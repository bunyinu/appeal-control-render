import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TablePermissions from '../../components/Permissions/TablePermissions';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { humanize } from '../../helpers/humanize';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/permissions/permissionsSlice';

type PermissionsWorkspaceSummary = {
  createPermissions: number;
  readPermissions: number;
  totalPermissions: number;
  updatePermissions: number;
};

const PermissionsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<PermissionsWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { permissions } = useAppSelector((state) => state.permissions);
  const dispatch = useAppDispatch();

  const [filters] = useState([{ label: 'Name', title: 'name' }]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_PERMISSIONS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/permissions/count'),
      fetchCount('/permissions/count', { name: 'READ_' }),
      fetchCount('/permissions/count', { name: 'CREATE_' }),
      fetchCount('/permissions/count', { name: 'UPDATE_' }),
    ])
      .then(([totalPermissions, readPermissions, createPermissions, updatePermissions]) =>
        setWorkspaceSummary({
          totalPermissions,
          readPermissions,
          createPermissions,
          updatePermissions,
        }),
      )
      .catch((error) => {
        console.error('Unable to load permissions summary', error);
        setWorkspaceSummary(null);
      });
  }, [currentUser]);

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: filters[0].title,
      },
    };

    setFilterItems([...filterItems, newItem]);
  };

  const getPermissionsCSV = async () => {
    const response = await axios({
      url: '/permissions?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'permissionsCSV.csv';
    link.click();
  };

  const onModalConfirm = async () => {
    if (!csvFile) return;
    await dispatch(uploadCsv(csvFile));
    dispatch(setRefetch(true));
    setCsvFile(null);
    setIsModalActive(false);
  };

  const onModalCancel = () => {
    setCsvFile(null);
    setIsModalActive(false);
  };

  const permissionFamilies = React.useMemo(() => {
    const familyCounts = new Map<string, number>();

    (permissions || []).forEach((permission) => {
      const permissionName = permission?.name || '';
      const [, ...rest] = permissionName.split('_');
      const family = rest.length ? humanize(rest.join('_')) : 'General';
      familyCounts.set(family, (familyCounts.get(family) || 0) + 1);
    });

    return Array.from(familyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([family, count]) => ({
        id: family,
        title: family,
        meta: `${count} permissions in current view`,
        caption: 'Permission family',
        badge: `${count}`,
      }));
  }, [permissions]);

  return (
    <>
      <Head>
        <title>{getPageTitle('Permissions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Permissions' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Permission catalog workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Keep the action catalog readable, review permission families, and align role design with the available operations.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && (
                <BaseButton href='/permissions/permissions-new' color='info' label='New Permission' />
              )}
              <BaseButton href='/roles/roles-list' color='white' label='Roles' />
              <BaseButton href='/users/users-list' color='white' label='Users' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Permissions',
                value: workspaceSummary.totalPermissions,
                help: 'Total actions in the catalog',
                path: icon.mdiKeyChainVariant,
              },
              {
                label: 'Read Actions',
                value: workspaceSummary.readPermissions,
                help: 'Read access entries',
                path: icon.mdiEyeOutline,
              },
              {
                label: 'Create Actions',
                value: workspaceSummary.createPermissions,
                help: 'Creation access entries',
                path: icon.mdiPlusBoxOutline,
              },
              {
                label: 'Update Actions',
                value: workspaceSummary.updatePermissions,
                help: 'Edit access entries',
                path: icon.mdiPencilOutline,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getPermissionsCSV} />
          {hasCreatePermission && (
            <BaseButton color='info' label='Upload CSV' onClick={() => setIsModalActive(true)} />
          )}
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
          </div>
        </CardBox>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Permission Catalog</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Search and maintain the available actions that define role and user access.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalPermissions || 0} permission records
              </span>
            </div>
            <TablePermissions
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Permission Families'
            description='How the currently loaded permissions break down across application areas.'
            actionHref='/roles/roles-list'
            actionLabel='Open roles'
            items={permissionFamilies}
            emptyText='No permissions are loaded yet.'
          />
        </div>
      </SectionMain>
      <CardBoxModal
        title='Upload CSV'
        buttonColor='info'
        buttonLabel='Confirm'
        isActive={isModalActive}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      >
        <DragDropFilePicker file={csvFile} setFile={setCsvFile} formats='.csv' />
      </CardBoxModal>
    </>
  );
};

PermissionsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_PERMISSIONS'>{page}</LayoutAuthenticated>;
};

export default PermissionsTablesPage;
