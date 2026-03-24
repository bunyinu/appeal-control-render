import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiAccountBadgeOutline, mdiAccountCircleOutline, mdiChartTimelineVariant, mdiKeyVariant, mdiShieldAccountOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/users/usersSlice';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, personName, renderText } from '../../helpers/recordView';

const UsersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!users || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading user details...</CardBox>
      </SectionMain>
    );
  }

  const ownedCases = (users.cases_owner_user || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.case_number || 'Case',
    meta: item.patient_name || 'No patient name',
    caption: `${item.status || 'status unknown'} • ${item.priority || 'priority unknown'}`,
    href: `/cases/cases-view/?id=${item.id}`,
  }));

  const permissionItems = (users.custom_permissions || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.name,
    meta: 'Custom permission override',
    href: `/permissions/permissions-view/?id=${item.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('User Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='User Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='User Record'
          title={personName(users)}
          subtitle={`${renderText(users.email)} • ${renderText(users.app_role?.name, 'No assigned role')}`}
          actions={[
            { href: `/users/users-edit/?id=${id}`, label: 'Edit User', color: 'info' },
            { href: '/users/users-list', label: 'Back to Users' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Role', value: renderText(users.app_role?.name), help: 'Assigned application role', path: mdiShieldAccountOutline },
            { label: 'Disabled', value: formatBoolean(users.disabled), help: 'Account access status', path: mdiAccountCircleOutline },
            { label: 'Custom Permissions', value: users.custom_permissions?.length || 0, help: 'Direct permission overrides', path: mdiKeyVariant },
            { label: 'Owned Cases', value: users.cases_owner_user?.length || 0, help: 'Cases currently assigned', path: mdiAccountBadgeOutline },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px] mb-6'>
          <RecordFieldCard
            title='User Profile'
            description='Core account and assignment information.'
            columns={2}
            fields={[
              { label: 'First Name', value: renderText(users.firstName) },
              { label: 'Last Name', value: renderText(users.lastName) },
              { label: 'Phone Number', value: renderText(users.phoneNumber) },
              { label: 'Email', value: renderText(users.email) },
              { label: 'Role', value: renderText(users.app_role?.name) },
              { label: 'Organization', value: renderText(users.organizations?.name) },
            ]}
          />

          <RecordBodyCard title='Avatar' description='Profile image stored for the account.'>
            {users?.avatar?.length ? (
              <ImageField name='avatar' image={users.avatar} className='h-24 w-24' />
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>No avatar uploaded.</p>
            )}
          </RecordBodyCard>
        </div>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <WorkspaceSidebarList
            title='Owned Cases'
            description='A short list of cases assigned to this user.'
            actionHref='/cases/cases-list'
            actionLabel='Open cases'
            items={ownedCases}
            emptyText='This user does not currently own any cases.'
          />

          <WorkspaceSidebarList
            title='Custom Permissions'
            description='Direct permission overrides applied to this user.'
            actionHref='/permissions/permissions-list'
            actionLabel='Open permissions'
            items={permissionItems}
            emptyText='No custom permissions are assigned.'
          />
        </div>
      </SectionMain>
    </>
  );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_USERS'>{page}</LayoutAuthenticated>;
};

export default UsersView;
