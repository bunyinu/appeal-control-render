import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiLockOutline, mdiNoteTextOutline, mdiTagOutline, mdiTextBoxOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/notes/notesSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, humanized, personName, renderText } from '../../helpers/recordView';

const NotesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector((state) => state.notes);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!notes || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading note details...</CardBox>
      </SectionMain>
    );
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Note Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Note Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Case Note'
          title={notes.title || 'Note'}
          subtitle={`${renderText(notes.case?.case_number, 'No case linked')} • ${humanized(notes.note_type)}`}
          actions={[
            { href: `/notes/notes-edit/?id=${id}`, label: 'Edit Note', color: 'info' },
            { href: '/notes/notes-list', label: 'Back to Notes' },
            notes.case?.id ? { href: `/cases/cases-view/?id=${notes.case.id}`, label: 'Open Case' } : undefined,
          ].filter(Boolean)}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Note Type', value: humanized(notes.note_type), help: 'Classification', path: mdiTagOutline },
            { label: 'Private', value: formatBoolean(notes.is_private), help: 'Visibility', path: mdiLockOutline },
            { label: 'Author', value: personName(notes.author_user), help: 'Recorded by', path: mdiNoteTextOutline },
            { label: 'Case', value: renderText(notes.case?.case_number), help: 'Linked case', path: mdiTextBoxOutline },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Note Context'
            description='Where the note belongs and who recorded it.'
            fields={[
              { label: 'Organization', value: renderText(notes.organization?.name) },
              { label: 'Case', value: renderText(notes.case?.case_number) },
              { label: 'Author', value: personName(notes.author_user) },
              { label: 'Note Type', value: humanized(notes.note_type) },
              { label: 'Private', value: formatBoolean(notes.is_private) },
            ]}
          />

          <RecordFieldCard
            title='Title'
            description='Headline for the note entry.'
            fields={[{ label: 'Note Title', value: renderText(notes.title) }]}
          />
        </div>

        <RecordBodyCard title='Body' description='Full note content saved for this record.'>
          <div className='prose prose-slate max-w-none dark:prose-invert'>
            {notes.body ? (
              <div dangerouslySetInnerHTML={{ __html: notes.body }} />
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>No note body available.</p>
            )}
          </div>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

NotesView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_NOTES'>{page}</LayoutAuthenticated>;
};

export default NotesView;
