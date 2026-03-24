import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import TableUsers from '../../components/Users/TableUsers';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/users/usersSlice';

type UsersWorkspaceSummary = {
  organizations: number;
  permissions: number;
  roles: number;
  totalUsers: number;
};

const UsersTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<UsersWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'First Name', title: 'firstName' },
    { label: 'Last Name', title: 'lastName' },
    { label: 'Phone Number', title: 'phoneNumber' },
    { label: 'E-Mail', title: 'email' },
    { label: 'App Role', title: 'app_role' },
    { label: 'Custom Permissions', title: 'custom_permissions' },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_USERS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/users/count'),
      fetchCount('/roles/count'),
      fetchCount('/permissions/count'),
      fetchCount('/organizations/count'),
    ])
      .then(([totalUsers, roles, permissions, organizations]) =>
        setWorkspaceSummary({ totalUsers, roles, permissions, organizations }),
      )
      .catch((error) => {
        console.error('Unable to load users summary', error);
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

  const getUsersCSV = async () => {
    const response = await axios({ url: '/users?filetype=csv', method: 'GET', responseType: 'blob' });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'usersCSV.csv';
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

  const directoryItems = (users || []).slice(0, 5).map((user) => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    const roleName = user?.app_role?.label || user?.app_role?.name || 'No assigned role';
    const permissionCount = Array.isArray(user?.custom_permissions) ? user.custom_permissions.length : 0;

    return {
      id: user.id,
      title: fullName || user?.email || 'Unnamed user',
      meta: user?.email || 'No email address',
      caption: `Role: ${roleName}`,
      badge: user?.disabled ? 'Disabled' : permissionCount ? `${permissionCount} custom` : 'Standard',
      href: `/users/users-view?id=${user.id}`,
    };
  });

  return (
    <>
      <Head>
        <title>{getPageTitle('Users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Users' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>User administration workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Manage staff accounts, track access structure, and keep user provisioning close to roles and permissions.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/users/users-new' color='info' label='Add or Invite User' />}
              <BaseButton href='/roles/roles-list' color='white' label='Roles' />
              <BaseButton href='/permissions/permissions-list' color='white' label='Permissions' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Users',
                value: workspaceSummary.totalUsers,
                help: 'Accounts in the workspace',
                path: icon.mdiAccountGroup,
              },
              {
                label: 'Roles',
                value: workspaceSummary.roles,
                help: 'Assigned access models',
                path: icon.mdiShieldAccount,
              },
              {
                label: 'Permissions',
                value: workspaceSummary.permissions,
                help: 'Permission catalog entries',
                path: icon.mdiKeyVariant,
              },
              {
                label: 'Organizations',
                value: workspaceSummary.organizations,
                help: 'User assignment boundaries',
                path: icon.mdiDomain,
              },
            ]}
          />
        )}

        <CardBox id='usersList' className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getUsersCSV} />
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
                <p className='text-lg font-semibold'>User Directory</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Review accounts, apply filters, and update assignments from a single workspace.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalUsers || 0} total users
              </span>
            </div>
            <TableUsers
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Access Snapshot'
            description='Recently loaded accounts and their current access posture.'
            actionHref='/roles/roles-list'
            actionLabel='Manage roles'
            items={directoryItems}
            emptyText='No users are loaded yet.'
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

UsersTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_USERS'>{page}</LayoutAuthenticated>;
};

export default UsersTablesPage;
