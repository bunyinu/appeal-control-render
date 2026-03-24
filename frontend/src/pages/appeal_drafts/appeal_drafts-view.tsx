import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiClockOutline, mdiFileDocumentEditOutline, mdiPaperclip, mdiSendOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/appeal_drafts/appeal_draftsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatDateTime, humanized, personName, renderText } from '../../helpers/recordView';

const AppealDraftsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { appeal_drafts, loading } = useAppSelector((state) => state.appeal_drafts);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!appeal_drafts || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading draft details...</CardBox>
      </SectionMain>
    );
  }

  const attachments = appeal_drafts?.attachments?.length
    ? dataFormatter.filesFormatter(appeal_drafts.attachments)
    : [];

  return (
    <>
      <Head>
        <title>{getPageTitle('Appeal Draft Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Appeal Draft Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Appeal Draft'
          title={appeal_drafts.title || 'Appeal Draft'}
          subtitle={`${renderText(appeal_drafts.case?.case_number, 'No case linked')} • ${humanized(appeal_drafts.status)}`}
          actions={[
            { href: `/appeal_drafts/appeal_drafts-edit/?id=${id}`, label: 'Edit Draft', color: 'info' },
            { href: '/appeal_drafts/appeal_drafts-list', label: 'Back to Drafts' },
            appeal_drafts.case?.id ? { href: `/cases/cases-view/?id=${appeal_drafts.case.id}`, label: 'Open Case' } : undefined,
          ].filter(Boolean)}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Status', value: humanized(appeal_drafts.status), help: 'Draft state', path: mdiFileDocumentEditOutline },
            { label: 'Submitted At', value: formatDateTime(appeal_drafts.submitted_at), help: 'Latest submission time', path: mdiSendOutline },
            { label: 'Attachments', value: attachments.length || 0, help: 'Supporting files', path: mdiPaperclip },
            { label: 'Author', value: personName(appeal_drafts.author_user), help: 'Draft owner', path: mdiClockOutline },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Draft Context'
            description='Who owns this draft and what case it supports.'
            fields={[
              { label: 'Organization', value: renderText(appeal_drafts.organization?.name) },
              { label: 'Case', value: renderText(appeal_drafts.case?.case_number) },
              { label: 'Author', value: personName(appeal_drafts.author_user) },
              { label: 'Status', value: humanized(appeal_drafts.status) },
            ]}
          />

          <RecordFieldCard
            title='Submission'
            description='Latest delivery and attachment details.'
            fields={[
              { label: 'Submitted At', value: formatDateTime(appeal_drafts.submitted_at) },
              { label: 'Attachments', value: attachments.length || 0 },
            ]}
          />
        </div>

        <RecordBodyCard title='Draft Content' description='Rendered letter content stored for this draft.'>
          <div className='prose prose-slate max-w-none dark:prose-invert'>
            {appeal_drafts.content ? (
              <div dangerouslySetInnerHTML={{ __html: appeal_drafts.content }} />
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>No draft content available.</p>
            )}
          </div>
        </RecordBodyCard>

        <RecordBodyCard title='Attachments' description='Files attached to this draft.'>
          <div className='space-y-3'>
            {attachments.length ? (
              attachments.map((file) => (
                <button
                  key={file.publicUrl}
                  onClick={(event) => saveFile(event, file.publicUrl, file.name)}
                  className='block rounded border border-slate-200 px-4 py-3 text-left text-sm dark:border-dark-700'
                >
                  {file.name}
                </button>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>No attachments yet.</p>
            )}
          </div>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

AppealDraftsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_APPEAL_DRAFTS'>{page}</LayoutAuthenticated>;
};

export default AppealDraftsView;
