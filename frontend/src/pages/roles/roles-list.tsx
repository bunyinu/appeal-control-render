import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TableRoles from '../../components/Roles/TableRoles';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/roles/rolesSlice';

type RolesWorkspaceSummary = {
  globalAccessRoles: number;
  permissions: number;
  totalRoles: number;
  users: number;
};

const RolesTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<RolesWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { roles } = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'Name', title: 'name' },
    { label: 'Permissions', title: 'permissions' },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_ROLES');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/roles/count'),
      fetchCount('/roles/count', { globalAccess: 'true' }),
      fetchCount('/permissions/count'),
      fetchCount('/users/count'),
    ])
      .then(([totalRoles, globalAccessRoles, permissions, users]) =>
        setWorkspaceSummary({ totalRoles, globalAccessRoles, permissions, users }),
      )
      .catch((error) => {
        console.error('Unable to load roles summary', error);
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

  const getRolesCSV = async () => {
    const response = await axios({ url: '/roles?filetype=csv', method: 'GET', responseType: 'blob' });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'rolesCSV.csv';
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

  const roleItems = (roles || []).slice(0, 5).map((role) => {
    const permissionCount = Array.isArray(role?.permissions) ? role.permissions.length : 0;

    return {
      id: role.id,
      title: role?.name || 'Untitled role',
      meta: `${permissionCount} linked permissions`,
      caption: role?.globalAccess ? 'Global access enabled' : 'Scoped to assigned users',
      badge: role?.globalAccess ? 'Global' : 'Scoped',
      href: `/roles/roles-view?id=${role.id}`,
    };
  });

  return (
    <>
      <Head>
        <title>{getPageTitle('Roles')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Roles' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Role access workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Maintain role definitions, review permission coverage, and keep user access aligned to the operating model.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/roles/roles-new' color='info' label='New Role' />}
              <BaseButton href='/users/users-list' color='white' label='Users' />
              <BaseButton href='/permissions/permissions-list' color='white' label='Permissions' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Roles',
                value: workspaceSummary.totalRoles,
                help: 'Access models in use',
                path: icon.mdiShieldAccountOutline,
              },
              {
                label: 'Global Access',
                value: workspaceSummary.globalAccessRoles,
                help: 'Roles with full workspace scope',
                path: icon.mdiEarth,
              },
              {
                label: 'Permissions',
                value: workspaceSummary.permissions,
                help: 'Available actions in catalog',
                path: icon.mdiKeyVariant,
              },
              {
                label: 'Users',
                value: workspaceSummary.users,
                help: 'Accounts consuming roles',
                path: icon.mdiAccountGroup,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getRolesCSV} />
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
                <p className='text-lg font-semibold'>Role Catalog</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Review role definitions, permission mappings, and coverage from a single workspace.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalRoles || 0} active role records
              </span>
            </div>
            <TableRoles
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Role Coverage'
            description='Currently loaded roles and the breadth of their permission mapping.'
            actionHref='/permissions/permissions-list'
            actionLabel='View permissions'
            items={roleItems}
            emptyText='No roles are loaded yet.'
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

RolesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_ROLES'>{page}</LayoutAuthenticated>;
};

export default RolesTablesPage;
