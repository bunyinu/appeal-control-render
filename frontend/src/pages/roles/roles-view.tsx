import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiAccountGroupOutline, mdiChartTimelineVariant, mdiEarth, mdiKeyVariant, mdiShieldAccountOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/roles/rolesSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import { RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, renderText } from '../../helpers/recordView';

const RolesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((state) => state.roles);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!roles || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading role details...</CardBox>
      </SectionMain>
    );
  }

  const permissionItems = (roles.permissions || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.name,
    meta: 'Linked permission',
    href: `/permissions/permissions-view/?id=${item.id}`,
  }));

  const userItems = (roles.users_app_role || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: [item.firstName, item.lastName].filter(Boolean).join(' ') || item.email || 'User',
    meta: item.email || 'No email',
    caption: item.disabled ? 'Disabled account' : 'Active account',
    href: `/users/users-view/?id=${item.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Role Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Role Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Role Record'
          title={roles.name || 'Role'}
          subtitle={`${roles.permissions?.length || 0} permissions • ${roles.users_app_role?.length || 0} assigned users`}
          actions={[
            { href: `/roles/roles-edit/?id=${id}`, label: 'Edit Role', color: 'info' },
            { href: '/roles/roles-list', label: 'Back to Roles' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Role Name', value: renderText(roles.name), help: 'Role identifier', path: mdiShieldAccountOutline },
            { label: 'Global Access', value: formatBoolean(roles.globalAccess), help: 'Workspace-wide scope', path: mdiEarth },
            { label: 'Permissions', value: roles.permissions?.length || 0, help: 'Linked permissions', path: mdiKeyVariant },
            { label: 'Assigned Users', value: roles.users_app_role?.length || 0, help: 'Users on this role', path: mdiAccountGroupOutline },
          ]}
        />

        <RecordFieldCard
          title='Role Configuration'
          description='Core definition of the role in the access model.'
          columns={2}
          fields={[
            { label: 'Name', value: renderText(roles.name) },
            { label: 'Global Access', value: formatBoolean(roles.globalAccess) },
            { label: 'Permissions', value: roles.permissions?.length || 0 },
            { label: 'Users Assigned', value: roles.users_app_role?.length || 0 },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px] mt-6'>
          <WorkspaceSidebarList
            title='Permissions'
            description='Permissions linked to this role.'
            actionHref='/permissions/permissions-list'
            actionLabel='Open permissions'
            items={permissionItems}
            emptyText='No permissions are assigned to this role.'
          />

          <WorkspaceSidebarList
            title='Assigned Users'
            description='A short list of users currently assigned to this role.'
            actionHref='/users/users-list'
            actionLabel='Open users'
            items={userItems}
            emptyText='No users are assigned to this role.'
          />
        </div>
      </SectionMain>
    </>
  );
};

RolesView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_ROLES'>{page}</LayoutAuthenticated>;
};

export default RolesView;
