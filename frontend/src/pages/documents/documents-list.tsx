import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TableDocuments from '../../components/Documents/TableDocuments';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { humanize } from '../../helpers/humanize';
import { fetchCount, formatWorkspaceDate } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/documents/documentsSlice';

type DocumentsWorkspaceSummary = {
  confidentialDocuments: number;
  denialLetters: number;
  medicalRecords: number;
  totalDocuments: number;
};

const DocumentsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<DocumentsWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { documents } = useAppSelector((state) => state.documents);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'Title', title: 'title' },
    { label: 'Description', title: 'description' },
    { label: 'Received At', title: 'received_at', date: 'true' },
    { label: 'Case', title: 'case' },
    { label: 'Uploaded By', title: 'uploaded_by_user' },
    {
      label: 'Category',
      title: 'category',
      type: 'enum',
      options: [
        'denial_letter',
        'medical_records',
        'clinical_notes',
        'imaging',
        'treatment_plan',
        'letter_of_medical_necessity',
        'policy',
        'authorization',
        'claim',
        'correspondence',
        'other',
      ],
    },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_DOCUMENTS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/documents/count'),
      fetchCount('/documents/count', { category: 'denial_letter' }),
      fetchCount('/documents/count', { category: 'medical_records' }),
      fetchCount('/documents/count', { is_confidential: 'true' }),
    ])
      .then(([totalDocuments, denialLetters, medicalRecords, confidentialDocuments]) =>
        setWorkspaceSummary({
          totalDocuments,
          denialLetters,
          medicalRecords,
          confidentialDocuments,
        }),
      )
      .catch((error) => {
        console.error('Unable to load documents summary', error);
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

  const getDocumentsCSV = async () => {
    const response = await axios({
      url: '/documents?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'documentsCSV.csv';
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

  const documentItems = (documents || []).slice(0, 5).map((document) => ({
    id: document.id,
    title: document?.title || 'Untitled document',
    meta: `${humanize(document?.category || 'other')} • ${formatWorkspaceDate(
      document?.received_at,
      'Not dated',
    )}`,
    caption: document?.case?.label || document?.uploaded_by_user?.label || 'No linked case',
    badge: document?.is_confidential ? 'Confidential' : 'Standard',
    href: `/documents/documents-view?id=${document.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Documents')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Documents' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Document intake workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Organize incoming evidence, keep denial materials accessible, and stay close to case context during review.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && (
                <BaseButton href='/documents/documents-new' color='info' label='New Document' />
              )}
              <BaseButton href='/cases/cases-list' color='white' label='Cases' />
              <BaseButton href='/appeal-dashboard' color='white' label='Appeal Dashboard' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Documents',
                value: workspaceSummary.totalDocuments,
                help: 'Evidence records in workspace',
                path: icon.mdiFileDocumentMultipleOutline,
              },
              {
                label: 'Denial Letters',
                value: workspaceSummary.denialLetters,
                help: 'Appeal starting points',
                path: icon.mdiFileCancelOutline,
              },
              {
                label: 'Medical Records',
                value: workspaceSummary.medicalRecords,
                help: 'Clinical support materials',
                path: icon.mdiFileDocumentOutline,
              },
              {
                label: 'Confidential',
                value: workspaceSummary.confidentialDocuments,
                help: 'Restricted access files',
                path: icon.mdiShieldLockOutline,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getDocumentsCSV} />
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
                <p className='text-lg font-semibold'>Document Library</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Review evidence records, update categories, and keep case documents audit-friendly.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalDocuments || 0} document records
              </span>
            </div>
            <TableDocuments
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Recent Intake'
            description='Currently loaded files and the evidence categories supporting active case work.'
            actionHref='/appeal-dashboard'
            actionLabel='Open dashboard'
            items={documentItems}
            emptyText='No documents are loaded yet.'
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

DocumentsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_DOCUMENTS'>{page}</LayoutAuthenticated>;
};

export default DocumentsTablesPage;
