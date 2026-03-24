import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiClockOutline, mdiFileTreeOutline, mdiHistory, mdiWeb } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/activity_logs/activity_logsSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatDateTime, humanized, personName, renderText } from '../../helpers/recordView';

const ActivityLogsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activity_logs, loading } = useAppSelector((state) => state.activity_logs);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!activity_logs || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading activity details...</CardBox>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Activity Log Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Activity Log Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Audit Event'
          title={humanized(activity_logs.action || activity_logs.actionType || 'activity')}
          subtitle={`${renderText(activity_logs.case?.case_number, 'No case linked')} • ${humanized(activity_logs.entity_type)}`}
          actions={[
            { href: `/activity_logs/activity_logs-edit/?id=${id}`, label: 'Edit Activity', color: 'info' },
            { href: '/activity_logs/activity_logs-list', label: 'Back to Activity Log' },
            activity_logs.case?.id ? { href: `/cases/cases-view/?id=${activity_logs.case.id}`, label: 'Open Case' } : undefined,
          ].filter(Boolean)}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Entity Type', value: humanized(activity_logs.entity_type), help: 'Affected record family', path: mdiFileTreeOutline },
            { label: 'Action', value: humanized(activity_logs.action), help: 'Recorded action', path: mdiHistory },
            { label: 'Occurred At', value: formatDateTime(activity_logs.occurred_at), help: 'Event timestamp', path: mdiClockOutline },
            { label: 'IP Address', value: renderText(activity_logs.ip_address), help: 'Request origin', path: mdiWeb },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Event Context'
            description='Where the event occurred and who triggered it.'
            fields={[
              { label: 'Organization', value: renderText(activity_logs.organization?.name) },
              { label: 'Case', value: renderText(activity_logs.case?.case_number) },
              { label: 'Actor', value: personName(activity_logs.actor_user) },
              { label: 'Entity Key', value: renderText(activity_logs.entity_key) },
            ]}
          />

          <RecordFieldCard
            title='Technical Detail'
            description='Technical metadata captured for this activity.'
            fields={[
              { label: 'Entity Type', value: humanized(activity_logs.entity_type) },
              { label: 'Action', value: humanized(activity_logs.action) },
              { label: 'Occurred At', value: formatDateTime(activity_logs.occurred_at) },
              { label: 'IP Address', value: renderText(activity_logs.ip_address) },
            ]}
          />
        </div>

        <RecordBodyCard title='Message' description='Stored audit message for this event.'>
          <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
            {renderText(activity_logs.message, 'No event message available.')}
          </div>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

ActivityLogsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_ACTIVITY_LOGS'>{page}</LayoutAuthenticated>;
};

export default ActivityLogsView;
