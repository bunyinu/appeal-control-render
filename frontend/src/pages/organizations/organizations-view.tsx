import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiAccountGroupOutline, mdiBriefcaseAccountOutline, mdiChartTimelineVariant, mdiOfficeBuildingOutline, mdiTuneVariant } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/organizations/organizationsSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';

const OrganizationsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organizations, loading } = useAppSelector((state) => state.organizations);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!organizations || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading organization details...</CardBox>
      </SectionMain>
    );
  }

  const usersList = (organizations.users_organizations || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: [item.firstName, item.lastName].filter(Boolean).join(' ') || item.email || 'User',
    meta: item.email || 'No email',
    href: `/users/users-view/?id=${item.id}`,
  }));

  const casesList = (organizations.cases_organization || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.case_number || 'Case',
    meta: item.patient_name || 'No patient name',
    caption: `${item.status || 'status unknown'} • ${item.priority || 'priority unknown'}`,
    href: `/cases/cases-view/?id=${item.id}`,
  }));

  const payerList = (organizations.payers_organization || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.name || 'Payer',
    meta: item.payer_code || 'No payer code',
    caption: item.plan_type || 'No plan type',
    href: `/payers/payers-view/?id=${item.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Organization Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Organization Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Organization Record'
          title={organizations.name || 'Organization'}
          subtitle='Operational container for users, payers, cases, and configuration.'
          actions={[
            { href: `/organizations/organizations-edit/?id=${id}`, label: 'Edit Organization', color: 'info' },
            { href: '/organizations/organizations-list', label: 'Back to Organizations' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Users', value: organizations.users_organizations?.length || 0, help: 'Assigned users', path: mdiAccountGroupOutline },
            { label: 'Payers', value: organizations.payers_organization?.length || 0, help: 'Linked payer records', path: mdiOfficeBuildingOutline },
            { label: 'Cases', value: organizations.cases_organization?.length || 0, help: 'Cases in this org', path: mdiBriefcaseAccountOutline },
            { label: 'Settings', value: organizations.settings_organization?.length || 0, help: 'Scoped configuration', path: mdiTuneVariant },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px] mb-6'>
          <RecordFieldCard
            title='Organization Context'
            description='Core metadata and workload counts for this organization.'
            columns={2}
            fields={[
              { label: 'Organization Name', value: organizations.name || 'Not available' },
              { label: 'Users', value: organizations.users_organizations?.length || 0 },
              { label: 'Payers', value: organizations.payers_organization?.length || 0 },
              { label: 'Cases', value: organizations.cases_organization?.length || 0 },
              { label: 'Tasks', value: organizations.tasks_organization?.length || 0 },
              { label: 'Documents', value: organizations.documents_organization?.length || 0 },
              { label: 'Appeal Drafts', value: organizations.appeal_drafts_organization?.length || 0 },
              { label: 'Notes', value: organizations.notes_organization?.length || 0 },
              { label: 'Activity Logs', value: organizations.activity_logs_organization?.length || 0 },
              { label: 'Settings', value: organizations.settings_organization?.length || 0 },
            ]}
          />

          <RecordBodyCard title='Operational Coverage' description='The organization connects both people and active appeal workstreams.'>
            <div className='space-y-3 text-sm text-gray-600 dark:text-gray-300'>
              <p>{`${organizations.tasks_organization?.length || 0} tasks and ${organizations.documents_organization?.length || 0} documents are currently scoped to this organization.`}</p>
              <p>{`${organizations.appeal_drafts_organization?.length || 0} drafts, ${organizations.notes_organization?.length || 0} notes, and ${organizations.activity_logs_organization?.length || 0} activity events are attached here.`}</p>
            </div>
          </RecordBodyCard>
        </div>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
          <WorkspaceSidebarList
            title='Users'
            description='People operating inside this organization.'
            actionHref='/users/users-list'
            actionLabel='Open users'
            items={usersList}
            emptyText='No users are linked to this organization.'
          />

          <WorkspaceSidebarList
            title='Payers'
            description='Payer records owned by this organization.'
            actionHref='/payers/payers-list'
            actionLabel='Open payers'
            items={payerList}
            emptyText='No payers are linked to this organization.'
          />

          <WorkspaceSidebarList
            title='Cases'
            description='Active and historical cases under this organization.'
            actionHref='/cases/cases-list'
            actionLabel='Open cases'
            items={casesList}
            emptyText='No cases are linked to this organization.'
          />
        </div>
      </SectionMain>
    </>
  );
};

OrganizationsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_ORGANIZATIONS'>{page}</LayoutAuthenticated>;
};

export default OrganizationsView;
