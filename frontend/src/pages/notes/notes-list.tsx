import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TableNotes from '../../components/Notes/TableNotes';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { humanize } from '../../helpers/humanize';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/notes/notesSlice';

type NotesWorkspaceSummary = {
  followUps: number;
  payerCalls: number;
  privateNotes: number;
  totalNotes: number;
};

const NotesTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<NotesWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'Title', title: 'title' },
    { label: 'Body', title: 'body' },
    { label: 'Case', title: 'case' },
    { label: 'Author', title: 'author_user' },
    {
      label: 'Note Type',
      title: 'note_type',
      type: 'enum',
      options: ['general', 'payer_call', 'clinical_review', 'submission', 'follow_up', 'outcome'],
    },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_NOTES');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/notes/count'),
      fetchCount('/notes/count', { note_type: 'payer_call' }),
      fetchCount('/notes/count', { note_type: 'follow_up' }),
      fetchCount('/notes/count', { is_private: 'true' }),
    ])
      .then(([totalNotes, payerCalls, followUps, privateNotes]) =>
        setWorkspaceSummary({ totalNotes, payerCalls, followUps, privateNotes }),
      )
      .catch((error) => {
        console.error('Unable to load notes summary', error);
        setWorkspaceSummary(null);
      });
  }, [currentUser]);

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: filters[0].title,
      },
    };

    setFilterItems([...filterItems, newItem]);
  };

  const getNotesCSV = async () => {
    const response = await axios({ url: '/notes?filetype=csv', method: 'GET', responseType: 'blob' });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'notesCSV.csv';
    link.click();
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

  const noteItems = (notes || []).slice(0, 5).map((note) => ({
    id: note.id,
    title: note?.title || 'Untitled note',
    meta: `${humanize(note?.note_type || 'general')} • ${note?.author_user?.label || 'Unknown author'}`,
    caption: note?.case?.label || 'No linked case',
    badge: note?.is_private ? 'Private' : 'Shared',
    href: `/notes/notes-view?id=${note.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Notes')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Notes' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Case notes workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Keep follow-ups, payer call summaries, and internal case notes organized inside the same workflow language as the rest of the product.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/notes/notes-new' color='info' label='New Note' />}
              <BaseButton href='/documents/documents-list' color='white' label='Documents' />
              <BaseButton href='/cases/cases-list' color='white' label='Cases' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Notes',
                value: workspaceSummary.totalNotes,
                help: 'Case note records in workspace',
                path: icon.mdiNoteMultipleOutline,
              },
              {
                label: 'Payer Calls',
                value: workspaceSummary.payerCalls,
                help: 'Call documentation entries',
                path: icon.mdiPhoneOutline,
              },
              {
                label: 'Follow Ups',
                value: workspaceSummary.followUps,
                help: 'Tracked follow-up notes',
                path: icon.mdiCalendarClockOutline,
              },
              {
                label: 'Private Notes',
                value: workspaceSummary.privateNotes,
                help: 'Restricted internal notes',
                path: icon.mdiLockOutline,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getNotesCSV} />
          {hasCreatePermission && (
            <BaseButton color='info' label='Upload CSV' onClick={() => setIsModalActive(true)} />
          )}
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
          </div>
        </CardBox>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Notes Queue</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Search note history, update note types, and keep follow-up documentation easy to review.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalNotes || 0} note records
              </span>
            </div>
            <TableNotes
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Recent Notes'
            description='Currently loaded notes and the case context they support.'
            actionHref='/documents/documents-list'
            actionLabel='Open documents'
            items={noteItems}
            emptyText='No notes are loaded yet.'
          />
        </div>
      </SectionMain>
      <CardBoxModal
        title='Upload CSV'
        buttonColor='info'
        buttonLabel='Confirm'
        isActive={isModalActive}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      >
        <DragDropFilePicker file={csvFile} setFile={setCsvFile} formats='.csv' />
      </CardBoxModal>
    </>
  );
};

NotesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_NOTES'>{page}</LayoutAuthenticated>;
};

export default NotesTablesPage;
