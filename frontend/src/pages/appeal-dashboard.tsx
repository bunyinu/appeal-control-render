import * as icon from '@mdi/js';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import CardBox from '../components/CardBox';
import BaseButton from '../components/BaseButton';
import BaseIcon from '../components/BaseIcon';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPageTitle } from '../config';
import { humanize } from '../helpers/humanize';
import { useAppSelector } from '../stores/hooks';

type BreakdownItem = {
  status?: string;
  priority?: string;
  count: number;
  amountAtRisk?: number;
};

type QueueCase = {
  id: string;
  caseNumber: string;
  patientName: string;
  status: string;
  priority: string;
  dueAt: string | null;
  amountAtRisk: number;
  payerName: string | null;
  ownerName: string | null;
};

type QueueTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: string | null;
  caseId: string | null;
  caseNumber: string | null;
  patientName: string | null;
  assigneeName: string | null;
};

type ActivityItem = {
  id: string;
  action: string;
  message: string | null;
  occurredAt: string | null;
  actorName: string | null;
  caseId: string | null;
  caseNumber: string | null;
  patientName: string | null;
  entityKey: string | null;
};

type DraftItem = {
  id: string;
  title: string;
  status: string;
  updatedAt: string | null;
  caseId: string | null;
  caseNumber: string | null;
  patientName: string | null;
};

type DashboardPayload = {
  generatedAt: string;
  scope: {
    organizationName: string;
    globalAccess: boolean;
  };
  metrics: {
    totalCases: number;
    activeCases: number;
    overdueCases: number;
    dueThisWeekCases: number;
    submittedCases: number;
    readyCases: number;
    evidenceNeededCases: number;
    urgentCases: number;
    blockedTasks: number;
    dueSoonTasks: number;
    totalDocuments: number;
    draftAppeals: number;
    amountAtRisk: number;
  };
  statusBreakdown: BreakdownItem[];
  priorityBreakdown: BreakdownItem[];
  taskBreakdown: BreakdownItem[];
  highPriorityCases: QueueCase[];
  dueSoonTaskQueue: QueueTask[];
  recentActivity: ActivityItem[];
  recentDrafts: DraftItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) {
    return 'No timestamp';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function ProgressRows({
  items,
  total,
  itemKey,
}: {
  items: BreakdownItem[];
  total: number;
  itemKey: 'status' | 'priority';
}) {
  if (!items.length) {
    return <div className='text-sm text-gray-500 dark:text-gray-400'>No records yet.</div>;
  }

  return (
    <div className='space-y-4'>
      {items.map((item) => {
        const label = item[itemKey] || '';
        const width = total ? `${Math.max(6, Math.round((item.count / total) * 100))}%` : '0%';

        return (
          <div key={`${itemKey}-${label}`} className='space-y-2'>
            <div className='flex items-center justify-between gap-3 text-sm'>
              <span>{humanize(label)}</span>
              <span className='text-gray-500 dark:text-gray-400'>
                {item.count}
                {item.amountAtRisk ? ` • ${formatCurrency(item.amountAtRisk)}` : ''}
              </span>
            </div>
            <div className='h-2 overflow-hidden rounded bg-slate-100 dark:bg-dark-700'>
              <div className='h-full rounded bg-slate-700 dark:bg-slate-200' style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const AppealDashboard = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/cases/appeal-dashboard');

        if (isMounted) {
          setDashboard(response.data);
        }
      } catch (loadError) {
        console.error('Failed to load appeal dashboard', loadError);

        if (isMounted) {
          setError('Unable to load appeal operations data right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const totalCases = dashboard?.metrics.totalCases || 0;
  const totalTasks = (dashboard?.taskBreakdown || []).reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <Head>
        <title>{getPageTitle('Appeal Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={icon.mdiChartTimelineVariant}
          title='Appeal Dashboard'
          main
        >
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Appeal operations summary</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {dashboard?.scope?.globalAccess
                  ? 'Cross-organization view of active appeal work.'
                  : `${dashboard?.scope?.organizationName || 'Current organization'} queue status and near-term workload.`}
              </p>
              {dashboard?.generatedAt && (
                <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  Refreshed {formatDateTime(dashboard.generatedAt)}
                </p>
              )}
            </div>
            <div className='flex flex-wrap gap-3'>
              <BaseButton href='/cases/cases-list' color='info' label='Open Cases' />
              <BaseButton href='/tasks/tasks-list' color='white' label='Open Tasks' />
              <BaseButton href='/appeal_drafts/appeal_drafts-list' color='white' label='Open Drafts' />
            </div>
          </div>
        </CardBox>

        {loading ? (
          <CardBox className='min-h-[240px] items-center justify-center'>
            <LoadingSpinner />
          </CardBox>
        ) : error ? (
          <CardBox>
            <p className='text-lg font-semibold'>Dashboard unavailable</p>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{error}</p>
          </CardBox>
        ) : dashboard ? (
          <>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6'>
              {[
                {
                  label: 'Active Cases',
                  value: dashboard.metrics.activeCases,
                  help: `${dashboard.metrics.totalCases} total`,
                  path: icon.mdiBriefcaseSearch,
                },
                {
                  label: 'Overdue Cases',
                  value: dashboard.metrics.overdueCases,
                  help: `${dashboard.metrics.dueThisWeekCases} due this week`,
                  path: icon.mdiAlertCircle,
                },
                {
                  label: 'Amount At Risk',
                  value: formatCurrency(dashboard.metrics.amountAtRisk),
                  help: `${dashboard.metrics.submittedCases} submitted/pending`,
                  path: icon.mdiCurrencyUsd,
                },
                {
                  label: 'Draft Appeals',
                  value: dashboard.metrics.draftAppeals,
                  help: `${dashboard.metrics.readyCases} ready to submit`,
                  path: icon.mdiFileDocumentEdit,
                },
              ].map((item) => (
                <CardBox key={item.label}>
                  <div className='flex justify-between align-center'>
                    <div>
                      <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                        {item.label}
                      </div>
                      <div className='text-3xl leading-tight font-semibold'>
                        {item.value}
                      </div>
                      <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                        {item.help}
                      </div>
                    </div>
                    <div>
                      <BaseIcon
                        className={iconsColor}
                        w='w-14'
                        h='h-14'
                        size={40}
                        path={item.path}
                      />
                    </div>
                  </div>
                </CardBox>
              ))}
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'>
              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Case Pipeline</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Counts by case status</p>
                  </div>
                  <Link href='/cases/cases-list' className='text-sm text-blue-600'>
                    View cases
                  </Link>
                </div>
                <ProgressRows items={dashboard.statusBreakdown} total={totalCases} itemKey='status' />
              </CardBox>

              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Priority Mix</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Current queue urgency</p>
                  </div>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {dashboard.metrics.urgentCases} urgent/high
                  </span>
                </div>
                <ProgressRows items={dashboard.priorityBreakdown} total={totalCases} itemKey='priority' />
              </CardBox>

              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Task Load</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Open task pressure this week</p>
                  </div>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {dashboard.metrics.blockedTasks} blocked
                  </span>
                </div>
                <ProgressRows items={dashboard.taskBreakdown} total={totalTasks} itemKey='status' />
              </CardBox>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6'>
              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Priority Queue</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Cases that likely need attention next</p>
                  </div>
                  <BaseButton href='/cases/cases-list' color='white' small label='Open queue' />
                </div>
                <div className='space-y-3'>
                  {dashboard.highPriorityCases.length ? (
                    dashboard.highPriorityCases.map((caseItem) => (
                      <Link
                        key={caseItem.id}
                        href={`/cases/cases-view?id=${caseItem.id}`}
                        className='block rounded border border-slate-200 px-4 py-3 dark:border-dark-700'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>{caseItem.caseNumber}</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>{caseItem.patientName}</p>
                          </div>
                          <div className='text-right text-sm'>
                            <p>{humanize(caseItem.status)}</p>
                            <p className='text-gray-500 dark:text-gray-400'>{humanize(caseItem.priority)}</p>
                          </div>
                        </div>
                        <div className='mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400'>
                          <span>Due {formatDate(caseItem.dueAt)}</span>
                          <span>{formatCurrency(caseItem.amountAtRisk)}</span>
                          {caseItem.payerName && <span>{caseItem.payerName}</span>}
                          {caseItem.ownerName && <span>{caseItem.ownerName}</span>}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>No cases in queue.</div>
                  )}
                </div>
              </CardBox>

              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Due Soon Tasks</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Tasks with the nearest deadlines</p>
                  </div>
                  <BaseButton href='/tasks/tasks-list' color='white' small label='Open tasks' />
                </div>
                <div className='space-y-3'>
                  {dashboard.dueSoonTaskQueue.length ? (
                    dashboard.dueSoonTaskQueue.map((task) => (
                      <Link
                        key={task.id}
                        href={`/tasks/tasks-view?id=${task.id}`}
                        className='block rounded border border-slate-200 px-4 py-3 dark:border-dark-700'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>{task.title}</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {task.caseNumber ? `${task.caseNumber} • ${task.patientName || 'Case linked'}` : 'Standalone task'}
                            </p>
                          </div>
                          <div className='text-right text-sm'>
                            <p>{humanize(task.status)}</p>
                            <p className='text-gray-500 dark:text-gray-400'>{humanize(task.priority)}</p>
                          </div>
                        </div>
                        <div className='mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400'>
                          <span>Due {formatDate(task.dueAt)}</span>
                          {task.assigneeName && <span>{task.assigneeName}</span>}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>No tasks due soon.</div>
                  )}
                </div>
              </CardBox>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Recent Drafts</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Latest appeal letter activity</p>
                  </div>
                  <BaseButton href='/appeal_drafts/appeal_drafts-list' color='white' small label='Open drafts' />
                </div>
                <div className='space-y-3'>
                  {dashboard.recentDrafts.length ? (
                    dashboard.recentDrafts.map((draft) => (
                      <Link
                        key={draft.id}
                        href={`/appeal_drafts/appeal_drafts-view?id=${draft.id}`}
                        className='block rounded border border-slate-200 px-4 py-3 dark:border-dark-700'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>{draft.title}</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {draft.caseNumber ? `${draft.caseNumber} • ${draft.patientName || 'Case linked'}` : 'No linked case'}
                            </p>
                          </div>
                          <div className='text-right text-sm'>
                            <p>{humanize(draft.status)}</p>
                            <p className='text-gray-500 dark:text-gray-400'>{formatDateTime(draft.updatedAt)}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>No recent drafts.</div>
                  )}
                </div>
              </CardBox>

              <CardBox>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <p className='text-lg font-semibold'>Recent Activity</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Latest operational updates</p>
                  </div>
                  <BaseButton href='/activity_logs/activity_logs-list' color='white' small label='Open logs' />
                </div>
                <div className='space-y-3'>
                  {dashboard.recentActivity.length ? (
                    dashboard.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className='rounded border border-slate-200 px-4 py-3 dark:border-dark-700'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold'>{humanize(activity.action)}</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {activity.message || activity.entityKey || 'Activity logged'}
                            </p>
                          </div>
                          <div className='text-right text-sm text-gray-500 dark:text-gray-400'>
                            {formatDateTime(activity.occurredAt)}
                          </div>
                        </div>
                        <div className='mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400'>
                          {activity.actorName && <span>{activity.actorName}</span>}
                          {activity.caseId ? (
                            <Link href={`/cases/cases-view?id=${activity.caseId}`} className='text-blue-600'>
                              {activity.caseNumber || activity.patientName || 'Open case'}
                            </Link>
                          ) : (
                            activity.entityKey && <span>{activity.entityKey}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>No recent activity.</div>
                  )}
                </div>
              </CardBox>
            </div>
          </>
        ) : null}
      </SectionMain>
    </>
  );
};

AppealDashboard.getLayout = (page: ReactElement) => (
  <LayoutAuthenticated permission='READ_CASES'>{page}</LayoutAuthenticated>
);

export default AppealDashboard;
