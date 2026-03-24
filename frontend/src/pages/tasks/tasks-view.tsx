import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiCheckCircleOutline, mdiClockAlertOutline, mdiFlagOutline, mdiFormatListChecks } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/tasks/tasksSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatDateTime, humanized, personName, renderText } from '../../helpers/recordView';

const TasksView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!tasks || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading task details...</CardBox>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Task Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Task Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Task Record'
          title={tasks.title || 'Task'}
          subtitle={`${renderText(tasks.case?.case_number, 'No case linked')} • ${personName(tasks.assignee_user)}`}
          actions={[
            { href: `/tasks/tasks-edit/?id=${id}`, label: 'Edit Task', color: 'info' },
            { href: '/tasks/tasks-list', label: 'Back to Tasks' },
            tasks.case?.id ? { href: `/cases/cases-view/?id=${tasks.case.id}`, label: 'Open Case' } : undefined,
          ].filter(Boolean)}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Status', value: humanized(tasks.status), help: 'Current task state', path: mdiFormatListChecks },
            { label: 'Priority', value: humanized(tasks.priority), help: 'Task urgency', path: mdiFlagOutline },
            { label: 'Due At', value: formatDateTime(tasks.due_at), help: 'Scheduled deadline', path: mdiClockAlertOutline },
            {
              label: 'Completed',
              value: tasks.completed_at ? formatDateTime(tasks.completed_at) : 'Open',
              help: 'Completion state',
              path: mdiCheckCircleOutline,
            },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Assignment'
            description='Who owns this task and where it belongs.'
            fields={[
              { label: 'Organization', value: renderText(tasks.organization?.name) },
              { label: 'Case', value: renderText(tasks.case?.case_number) },
              { label: 'Assignee', value: personName(tasks.assignee_user) },
              { label: 'Title', value: renderText(tasks.title) },
            ]}
          />

          <RecordFieldCard
            title='Timeline'
            description='Planning and completion information for the task.'
            fields={[
              { label: 'Status', value: humanized(tasks.status) },
              { label: 'Priority', value: humanized(tasks.priority) },
              { label: 'Due At', value: formatDateTime(tasks.due_at) },
              { label: 'Completed At', value: formatDateTime(tasks.completed_at) },
            ]}
          />
        </div>

        <RecordBodyCard
          title='Task Description'
          description='Supporting instructions or notes attached to the task.'
        >
          <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
            {renderText(tasks.description, 'No task description yet.')}
          </div>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

TasksView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_TASKS'>{page}</LayoutAuthenticated>;
};

export default TasksView;
