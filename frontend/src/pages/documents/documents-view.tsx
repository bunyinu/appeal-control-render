import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiFileDocumentOutline, mdiLockOutline, mdiTagOutline, mdiTrayArrowDown } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/documents/documentsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, formatDateTime, humanized, personName, renderText } from '../../helpers/recordView';

const DocumentsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector((state) => state.documents);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!documents || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading document details...</CardBox>
      </SectionMain>
    );
  }

  const files = documents?.file?.length ? dataFormatter.filesFormatter(documents.file) : [];

  return (
    <>
      <Head>
        <title>{getPageTitle('Document Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Document Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Document Record'
          title={documents.title || 'Document'}
          subtitle={`${renderText(documents.case?.case_number, 'No case linked')} • ${humanized(documents.category)}`}
          actions={[
            { href: `/documents/documents-edit/?id=${id}`, label: 'Edit Document', color: 'info' },
            { href: '/documents/documents-list', label: 'Back to Documents' },
            documents.case?.id ? { href: `/cases/cases-view/?id=${documents.case.id}`, label: 'Open Case' } : undefined,
          ].filter(Boolean)}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Category', value: humanized(documents.category), help: 'Document classification', path: mdiTagOutline },
            {
              label: 'Confidential',
              value: formatBoolean(documents.is_confidential),
              help: 'Access sensitivity',
              path: mdiLockOutline,
            },
            { label: 'Received At', value: formatDateTime(documents.received_at), help: 'Intake date', path: mdiTrayArrowDown },
            { label: 'Files', value: files.length || 0, help: 'Attached files', path: mdiFileDocumentOutline },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Document Context'
            description='Where this document belongs and who uploaded it.'
            fields={[
              { label: 'Organization', value: renderText(documents.organization?.name) },
              { label: 'Case', value: renderText(documents.case?.case_number) },
              { label: 'Uploaded By', value: personName(documents.uploaded_by_user) },
              { label: 'Title', value: renderText(documents.title) },
            ]}
          />

          <RecordFieldCard
            title='Document Status'
            description='Classification and intake details.'
            fields={[
              { label: 'Category', value: humanized(documents.category) },
              { label: 'Confidential', value: formatBoolean(documents.is_confidential) },
              { label: 'Received At', value: formatDateTime(documents.received_at) },
            ]}
          />
        </div>

        <RecordBodyCard title='Description' description='Summary or note captured for this document.'>
          <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
            {renderText(documents.description, 'No document description yet.')}
          </div>
        </RecordBodyCard>

        <RecordBodyCard title='Files' description='Attached files available for download.'>
          <div className='space-y-3'>
            {files.length ? (
              files.map((file) => (
                <button
                  key={file.publicUrl}
                  onClick={(event) => saveFile(event, file.publicUrl, file.name)}
                  className='block rounded border border-slate-200 px-4 py-3 text-left text-sm dark:border-dark-700'
                >
                  {file.name}
                </button>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>No files attached.</p>
            )}
          </div>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

DocumentsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_DOCUMENTS'>{page}</LayoutAuthenticated>;
};

export default DocumentsView;
