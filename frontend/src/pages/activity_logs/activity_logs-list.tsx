import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableActivity_logs from '../../components/Activity_logs/TableActivity_logs'
import BaseButton from '../../components/BaseButton'
import axios from "axios";
import BaseIcon from '../../components/BaseIcon';
import * as icon from '@mdi/js';
import Link from 'next/link';
import { humanize } from '../../helpers/humanize';

type ActivityLogWorkspaceSummary = {
  totalLogs: number;
  recentActivity: Array<{
    id: string;
    action: string;
    message: string | null;
    occurredAt: string | null;
    actorName: string | null;
    caseId: string | null;
    caseNumber: string | null;
    patientName: string | null;
    entityKey: string | null;
  }>;
};

function formatDateTime(value?: string | null) {
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


const Activity_logsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<ActivityLogWorkspaceSummary | null>(null);


  const [filters] = useState([{label: 'Entity Key', title: 'entity_key'},{label: 'Message', title: 'message'},{label: 'IP Address', title: 'ip_address'},
          
          
          {label: 'Occurred At', title: 'occurred_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Actor', title: 'actor_user'},
    
    
          
          {label: 'Entity Type', title: 'entity_type', type: 'enum', options: ['case','task','document','appeal_draft','note','payer','user','setting']},{label: 'Action', title: 'action', type: 'enum', options: ['created','updated','assigned','status_changed','priority_changed','submitted','uploaded','commented','deleted','restored','login']},
  ]);

    React.useEffect(() => {
        axios
            .all([axios.get('/activity_logs/count'), axios.get('/cases/appeal-dashboard')])
            .then(
                axios.spread((countResponse, dashboardResponse) => {
                    setWorkspaceSummary({
                        totalLogs: countResponse.data?.count ?? countResponse.data ?? 0,
                        recentActivity: dashboardResponse.data?.recentActivity || [],
                    });
                }),
            )
            .catch((error) => {
                console.error('Unable to load activity logs summary', error);
                setWorkspaceSummary(null);
            });
    }, []);
    
    const addFilter = () => {
        const newItem = {
            id: uniqueId(),
            fields: {
                filterValue: '',
                filterValueFrom: '',
                filterValueTo: '',
                selectedField: '',
            },
        };
        newItem.fields.selectedField = filters[0].title;
        setFilterItems([...filterItems, newItem]);
    };

    const getActivity_logsCSV = async () => {
        const response = await axios({url: '/activity_logs?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'activity_logsCSV.csv'
        link.click()
    };

  return (
    <>
      <Head>
        <title>{getPageTitle('Activity Logs')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Activity Logs" main>
        {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Operational activity workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Review the latest system activity, export audit history, and jump directly into affected records.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <BaseButton href='/appeal-dashboard' color='info' label='Appeal Dashboard' />
              <BaseButton href='/search' color='white' label='Search Workspace' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6'>
            {[
              {
                label: 'Total Logs',
                value: workspaceSummary.totalLogs,
                help: 'Current accessible activity volume',
                path: icon.mdiHistory,
              },
              {
                label: 'Recent Updates',
                value: workspaceSummary.recentActivity.length,
                help: 'Latest operational events',
                path: icon.mdiTimelineClockOutline,
              },
              {
                label: 'Case Linked',
                value: workspaceSummary.recentActivity.filter((item) => item.caseId).length,
                help: 'Recent events tied to cases',
                path: icon.mdiBriefcaseSearch,
              },
              {
                label: 'User Named',
                value: workspaceSummary.recentActivity.filter((item) => item.actorName).length,
                help: 'Recent events with actor context',
                path: icon.mdiAccountClockOutline,
              },
            ].map((item) => (
              <CardBox key={item.label}>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>{item.label}</div>
                    <div className='text-3xl leading-tight font-semibold'>{item.value}</div>
                    <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{item.help}</div>
                  </div>
                  <div>
                    <BaseIcon w='w-14' h='h-14' size={40} path={item.path} />
                  </div>
                </div>
              </CardBox>
            ))}
          </div>
        )}
        <CardBox   className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Filter'
              onClick={addFilter}
          />
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getActivity_logsCSV} />
          
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
          </div>  
          
        </CardBox>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Activity Log</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Review exported audit history and filter down to the exact operational event you need.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalLogs || 0} total
              </span>
            </div>
            <TableActivity_logs
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Recent Activity</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Latest operational updates</p>
              </div>
              <BaseButton href='/appeal-dashboard' color='white' small label='Open dashboard' />
            </div>
            <div className='space-y-3'>
              {workspaceSummary?.recentActivity?.length ? (
                workspaceSummary.recentActivity.map((activity) => (
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
        
      </SectionMain>
    </>
  )
}

Activity_logsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_ACTIVITY_LOGS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default Activity_logsTablesPage
