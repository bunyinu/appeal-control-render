import * as icon from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableTasks from '../../components/Tasks/TableTasks'
import BaseButton from '../../components/BaseButton'
import BaseIcon from '../../components/BaseIcon'
import axios from "axios";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import CardBoxModal from "../../components/CardBoxModal";
import DragDropFilePicker from "../../components/DragDropFilePicker";
import {setRefetch, uploadCsv} from '../../stores/tasks/tasksSlice';
import { humanize } from '../../helpers/humanize';


import {hasPermission} from "../../helpers/userPermissions";

type TasksDashboardSummary = {
  blockedTasks: number;
  dueSoonTasks: number;
  draftAppeals: number;
  taskBreakdown: Array<{ status?: string; count: number }>;
  dueSoonTaskQueue: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueAt: string | null;
    caseNumber: string | null;
    patientName: string | null;
    assigneeName: string | null;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function BreakdownRows({ items, total }: { items: Array<{ status?: string; count: number }>; total: number }) {
  if (!items.length) {
    return <div className='text-sm text-gray-500 dark:text-gray-400'>No task load to show.</div>;
  }

  return (
    <div className='space-y-4'>
      {items.map((item) => {
        const width = total ? `${Math.max(6, Math.round((item.count / total) * 100))}%` : '0%';

        return (
          <div key={item.status || 'unknown'} className='space-y-2'>
            <div className='flex items-center justify-between gap-3 text-sm'>
              <span>{humanize(item.status || 'unspecified')}</span>
              <span className='text-gray-500 dark:text-gray-400'>{item.count}</span>
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


const TasksTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [dashboardSummary, setDashboardSummary] = React.useState<TasksDashboardSummary | null>(null);

  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const dispatch = useAppDispatch();


  const [filters] = useState([{label: 'Title', title: 'title'},{label: 'Description', title: 'description'},
          
          
          {label: 'Due At', title: 'due_at', date: 'true'},{label: 'Completed At', title: 'completed_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Assignee', title: 'assignee_user'},
    
    
          
          {label: 'Status', title: 'status', type: 'enum', options: ['todo','in_progress','blocked','done']},{label: 'Priority', title: 'priority', type: 'enum', options: ['low','medium','high','urgent']},
  ]);
    
    const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_TASKS');

    React.useEffect(() => {
        if (!currentUser) return;

        axios
            .get('/cases/appeal-dashboard')
            .then(({ data }) => setDashboardSummary({
                blockedTasks: data.metrics.blockedTasks,
                dueSoonTasks: data.metrics.dueSoonTasks,
                draftAppeals: data.metrics.draftAppeals,
                taskBreakdown: data.taskBreakdown,
                dueSoonTaskQueue: data.dueSoonTaskQueue || [],
            }))
            .catch((error) => {
                console.error('Unable to load tasks summary', error);
                setDashboardSummary(null);
            });
    }, [currentUser]);

    const taskCount = dashboardSummary?.taskBreakdown?.reduce((sum, item) => sum + item.count, 0) || 0;
    const inProgressTasks = dashboardSummary?.taskBreakdown?.find((item) => item.status === 'in_progress')?.count || 0;
    const doneTasks = dashboardSummary?.taskBreakdown?.find((item) => item.status === 'done')?.count || 0;
    

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

    const getTasksCSV = async () => {
        const response = await axios({url: '/tasks?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'tasksCSV.csv'
        link.click()
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

  return (
    <>
      <Head>
        <title>{getPageTitle('Tasks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title="Tasks" main>
        {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Task operations workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Review due dates, monitor blocked work, and move between calendar and table workflows without leaving the task queue.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/tasks/tasks-new' color='info' label='New Task' />}
              <BaseButton href='/tasks/tasks-table' color='white' label='Table View' />
              <BaseButton href='/appeal-dashboard' color='white' label='Appeal Dashboard' />
            </div>
          </div>
        </CardBox>

        {dashboardSummary && (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6'>
                {[
                    {
                        label: 'Due In 7 Days',
                        value: dashboardSummary.dueSoonTasks,
                        help: `${taskCount} total tasks`,
                        path: icon.mdiClockAlertOutline,
                    },
                    {
                        label: 'Blocked Tasks',
                        value: dashboardSummary.blockedTasks,
                        help: 'Need intervention',
                        path: icon.mdiAlertCircle,
                    },
                    {
                        label: 'In Progress',
                        value: inProgressTasks,
                        help: `${doneTasks} already done`,
                        path: icon.mdiClipboardTextClockOutline,
                    },
                    {
                        label: 'Open Drafts',
                        value: dashboardSummary.draftAppeals,
                        help: 'Related appeal letters',
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
        )}
        <CardBox   className='mb-6' cardBoxClassName='flex flex-wrap'>
          
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Filter'
              onClick={addFilter}
          />
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getTasksCSV} />
          
            {hasCreatePermission && (
              <BaseButton
                color='info'
                label='Upload CSV'
                onClick={() => setIsModalActive(true)}
              />
            )}
          
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
          </div>  
        </CardBox>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Task Calendar</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Track deadlines visually and create a task directly from an open slot.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {dashboardSummary?.dueSoonTasks || 0} due in 7 days
              </span>
            </div>
            <TableTasks
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <div className='space-y-6'>
            <CardBox>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-lg font-semibold'>Task Load</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>Current distribution by status</p>
                </div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>{taskCount} total</span>
              </div>
              <BreakdownRows items={dashboardSummary?.taskBreakdown || []} total={taskCount} />
            </CardBox>

            <CardBox>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-lg font-semibold'>Due Soon Queue</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>Nearest upcoming deadlines</p>
                </div>
                <BaseButton href='/tasks/tasks-table' color='white' small label='Open table' />
              </div>
              <div className='space-y-3'>
                {dashboardSummary?.dueSoonTaskQueue?.length ? (
                  dashboardSummary.dueSoonTaskQueue.map((task) => (
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
        </div>
        
      </SectionMain>
      <CardBoxModal
          title='Upload CSV'
          buttonColor='info'
          buttonLabel={'Confirm'}
        // buttonLabel={false ? 'Deleting...' : 'Confirm'}
          isActive={isModalActive}
          onConfirm={onModalConfirm}
          onCancel={onModalCancel}
      >
          <DragDropFilePicker
              file={csvFile}
              setFile={setCsvFile}
              formats={'.csv'}
          />
      </CardBoxModal>
    </>
  )
}

TasksTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_TASKS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default TasksTablesPage
