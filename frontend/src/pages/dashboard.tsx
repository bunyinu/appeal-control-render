import * as icon from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import { aiWidgetsEnabled, getPageTitle } from '../config';
import { hasPermission } from '../helpers/userPermissions';
import { fetchWidgets } from '../stores/roles/rolesSlice';
import { WidgetCreator } from '../components/WidgetCreator/WidgetCreator';
import { SmartWidget } from '../components/SmartWidget/SmartWidget';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import WorkspaceSummaryCards from '../components/WorkspaceSummaryCards';
import WorkspaceSidebarList from '../components/WorkspaceSidebarList';
import { RecordBodyCard, RecordHero } from '../components/RecordView';
import type { WorkspaceSidebarItem } from '../components/WorkspaceSidebarList';
import CardBox from '../components/CardBox';

type CountMap = Record<string, number | null>;

type AppealDashboardSummary = {
  metrics: {
    activeCases: number;
    blockedTasks: number;
    draftAppeals: number;
    dueSoonTasks: number;
    readyCases: number;
    recentActivityCount: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    occurredAt: string | null;
    caseNumber: string | null;
    actorName: string | null;
  }>;
};

const ENTITY_LABELS: Record<string, string> = {
  users: 'Users',
  roles: 'Roles',
  permissions: 'Permissions',
  organizations: 'Organizations',
  payers: 'Payers',
  cases: 'Cases',
  tasks: 'Tasks',
  documents: 'Documents',
  appeal_drafts: 'Appeal Drafts',
  notes: 'Notes',
  activity_logs: 'Activity Logs',
  settings: 'Settings',
};

const DASHBOARD_ENTITIES = Object.keys(ENTITY_LABELS);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [counts, setCounts] = React.useState<CountMap>({});
  const [appealSummary, setAppealSummary] = React.useState<AppealDashboardSummary | null>(null);
  const [widgetsRole, setWidgetsRole] = React.useState({
    role: { value: '', label: '' },
  });

  const { currentUser } = useAppSelector((state) => state.auth);
  const { isFetchingQuery } = useAppSelector((state) => state.openAi);
  const { rolesWidgets, loading } = useAppSelector((state) => state.roles);

  const canManageWidgets = aiWidgetsEnabled && hasPermission(currentUser, 'CREATE_ROLES');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all(
      DASHBOARD_ENTITIES.map((entity) => {
        if (!hasPermission(currentUser, `READ_${entity.toUpperCase()}`)) {
          return Promise.resolve([entity, null] as const);
        }

        return axios
          .get(`/${entity}/count`)
          .then(({ data }) => [entity, Number(data?.count || 0)] as const)
          .catch(() => [entity, null] as const);
      }),
    ).then((results) => {
      setCounts(Object.fromEntries(results));
    });

    if (hasPermission(currentUser, 'READ_CASES')) {
      axios
        .get('/cases/appeal-dashboard')
        .then(({ data }) => setAppealSummary(data))
        .catch((error) => {
          console.error('Unable to load dashboard summary', error);
          setAppealSummary(null);
        });
    } else {
      setAppealSummary(null);
    }

    setWidgetsRole({
      role: {
        value: currentUser?.app_role?.id || '',
        label: currentUser?.app_role?.name || '',
      },
    });
  }, [currentUser]);

  React.useEffect(() => {
    if (!canManageWidgets || !currentUser || !widgetsRole.role.value) return;
    dispatch(fetchWidgets(widgetsRole.role.value));
  }, [canManageWidgets, dispatch, currentUser, widgetsRole.role.value]);

  const operationsItems = [
    hasPermission(currentUser, 'READ_CASES') && {
      id: 'cases',
      title: 'Cases',
      meta: `${counts.cases ?? 0} total records`,
      caption: `${appealSummary?.metrics.activeCases ?? 0} active right now`,
      badge: `${appealSummary?.metrics.readyCases ?? 0} ready`,
      href: '/cases/cases-list',
    },
    hasPermission(currentUser, 'READ_TASKS') && {
      id: 'tasks',
      title: 'Tasks',
      meta: `${counts.tasks ?? 0} total records`,
      caption: `${appealSummary?.metrics.dueSoonTasks ?? 0} due soon`,
      badge: `${appealSummary?.metrics.blockedTasks ?? 0} blocked`,
      href: '/tasks/tasks-list',
    },
    hasPermission(currentUser, 'READ_DOCUMENTS') && {
      id: 'documents',
      title: 'Documents',
      meta: `${counts.documents ?? 0} evidence records`,
      caption: 'Document intake and supporting files',
      href: '/documents/documents-list',
    },
    hasPermission(currentUser, 'READ_APPEAL_DRAFTS') && {
      id: 'drafts',
      title: 'Appeal Drafts',
      meta: `${counts.appeal_drafts ?? 0} total drafts`,
      caption: `${appealSummary?.metrics.draftAppeals ?? 0} open drafting items`,
      href: '/appeal_drafts/appeal_drafts-list',
    },
    hasPermission(currentUser, 'READ_ACTIVITY_LOGS') && {
      id: 'activity',
      title: 'Activity Log',
      meta: `${counts.activity_logs ?? 0} audit records`,
      caption: `${appealSummary?.metrics.recentActivityCount ?? 0} recent events`,
      href: '/activity_logs/activity_logs-list',
    },
  ].filter(Boolean) as WorkspaceSidebarItem[];

  const adminItems = [
    hasPermission(currentUser, 'READ_USERS') && {
      id: 'users',
      title: 'Users',
      meta: `${counts.users ?? 0} accounts`,
      caption: `${counts.roles ?? 0} roles and ${counts.permissions ?? 0} permissions`,
      href: '/users/users-list',
    },
    hasPermission(currentUser, 'READ_ORGANIZATIONS') && {
      id: 'organizations',
      title: 'Organizations',
      meta: `${counts.organizations ?? 0} organizations`,
      caption: 'Operational ownership boundaries',
      href: '/organizations/organizations-list',
    },
    hasPermission(currentUser, 'READ_PAYERS') && {
      id: 'payers',
      title: 'Payers',
      meta: `${counts.payers ?? 0} payer records`,
      caption: 'Routing, submission methods, and network context',
      href: '/payers/payers-list',
    },
    hasPermission(currentUser, 'READ_SETTINGS') && {
      id: 'settings',
      title: 'Settings',
      meta: `${counts.settings ?? 0} configuration entries`,
      caption: 'Environment and product configuration',
      href: '/settings/settings-list',
    },
  ].filter(Boolean) as WorkspaceSidebarItem[];

  return (
    <>
      <Head>
        <title>{getPageTitle('Operations Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Operations Dashboard' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Control Center'
          title='Operations and administration workspace'
          subtitle='Track appeal operations, jump into the main work queues, and keep administrative directories close without dropping back to generator-style screens.'
          actions={[
            { href: '/appeal-dashboard', label: 'Appeal Dashboard', color: 'info' },
            { href: '/cases/cases-list', label: 'Open Cases' },
            { href: '/search', label: 'Search' },
          ]}
        />

        {appealSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Active Cases',
                value: appealSummary.metrics.activeCases,
                help: `${appealSummary.metrics.readyCases} ready for submission`,
                path: icon.mdiBriefcaseAccountOutline,
              },
              {
                label: 'Due Soon Tasks',
                value: appealSummary.metrics.dueSoonTasks,
                help: `${appealSummary.metrics.blockedTasks} blocked tasks`,
                path: icon.mdiClockAlertOutline,
              },
              {
                label: 'Open Drafts',
                value: appealSummary.metrics.draftAppeals,
                help: 'Letters still in progress',
                path: icon.mdiFileDocumentEditOutline,
              },
              {
                label: 'Recent Activity',
                value: appealSummary.metrics.recentActivityCount,
                help: 'Latest recorded operational events',
                path: icon.mdiHistory,
              },
            ]}
          />
        )}

        <WorkspaceSummaryCards
          items={[
            {
              label: 'Users',
              value: counts.users ?? 'NA',
              help: 'User directory',
              path: icon.mdiAccountGroup,
            },
            {
              label: 'Organizations',
              value: counts.organizations ?? 'NA',
              help: 'Operating entities',
              path: icon.mdiDomain,
            },
            {
              label: 'Payers',
              value: counts.payers ?? 'NA',
              help: 'Payer network records',
              path: icon.mdiOfficeBuildingOutline,
            },
            {
              label: 'Settings',
              value: counts.settings ?? 'NA',
              help: 'Configuration entries',
              path: icon.mdiTuneVariant,
            },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px] mb-6'>
          <WorkspaceSidebarList
            title='Operational Workstreams'
            description='The main queues operators move through every day.'
            actionHref='/appeal-dashboard'
            actionLabel='Open appeal board'
            items={operationsItems}
            emptyText='No operational workstreams are available for this user.'
          />

          <WorkspaceSidebarList
            title='Administrative Directories'
            description='Core supporting data behind users, routing, and configuration.'
            actionHref='/users/users-list'
            actionLabel='Open users'
            items={adminItems}
            emptyText='No administrative directories are available for this user.'
          />
        </div>

        {canManageWidgets && (
          <RecordBodyCard
            title='Role Widgets'
            description='Configured widgets stay available, but they no longer define the entire dashboard.'
          >
            <WidgetCreator
              currentUser={currentUser}
              isFetchingQuery={isFetchingQuery}
              setWidgetsRole={setWidgetsRole}
              widgetsRole={widgetsRole}
            />
            {!!rolesWidgets.length && (
              <p className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
                {`${widgetsRole?.role?.label || 'Users'} widgets`}
              </p>
            )}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 grid-flow-dense'>
              {rolesWidgets.map((widget) => (
                <SmartWidget
                  key={widget.id}
                  userId={currentUser?.id}
                  widget={widget}
                  roleId={widgetsRole?.role?.value || ''}
                  admin={canManageWidgets}
                />
              ))}
              {(isFetchingQuery || loading) && (
                <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading widgets...</CardBox>
              )}
            </div>
          </RecordBodyCard>
        )}
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
