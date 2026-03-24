import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableAppeal_drafts from '../../components/Appeal_drafts/TableAppeal_drafts'
import BaseButton from '../../components/BaseButton'
import axios from "axios";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import CardBoxModal from "../../components/CardBoxModal";
import DragDropFilePicker from "../../components/DragDropFilePicker";
import {setRefetch, uploadCsv} from '../../stores/appeal_drafts/appeal_draftsSlice';
import BaseIcon from '../../components/BaseIcon';
import * as icon from '@mdi/js';
import { humanize } from '../../helpers/humanize';


import {hasPermission} from "../../helpers/userPermissions";


type AppealDraftsWorkspaceSummary = {
  draftAppeals: number;
  readyCases: number;
  submittedCases: number;
  recentDrafts: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: string | null;
    caseNumber: string | null;
    patientName: string | null;
  }>;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'No recent update';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}


const Appeal_draftsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<AppealDraftsWorkspaceSummary | null>(null);

  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const dispatch = useAppDispatch();


  const [filters] = useState([{label: 'Title', title: 'title'},{label: 'Content', title: 'content'},
          
          
          {label: 'Submitted At', title: 'submitted_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Author', title: 'author_user'},
    
    
          
          {label: 'Status', title: 'status', type: 'enum', options: ['draft','in_review','approved','sent','archived']},
  ]);
    
    const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_APPEAL_DRAFTS');

    React.useEffect(() => {
        if (!currentUser) return;

        axios
            .get('/cases/appeal-dashboard')
            .then(({ data }) => setWorkspaceSummary({
                draftAppeals: data.metrics.draftAppeals,
                readyCases: data.metrics.readyCases,
                submittedCases: data.metrics.submittedCases,
                recentDrafts: data.recentDrafts || [],
            }))
            .catch((error) => {
                console.error('Unable to load appeal drafts summary', error);
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
                selectedField: '',
            },
        };
        newItem.fields.selectedField = filters[0].title;
        setFilterItems([...filterItems, newItem]);
    };

    const getAppeal_draftsCSV = async () => {
        const response = await axios({url: '/appeal_drafts?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'appeal_draftsCSV.csv'
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
        <title>{getPageTitle('Appeal Drafts')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Appeal Drafts" main>
        {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Appeal drafting workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Work through draft letters, keep ready cases moving, and stay close to recent updates without leaving the queue.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/appeal_drafts/appeal_drafts-new' color='info' label='New Appeal Draft' />}
              <BaseButton href='/tasks/tasks-list' color='white' label='Open Tasks' />
              <BaseButton href='/appeal-dashboard' color='white' label='Appeal Dashboard' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6'>
            {[
              {
                label: 'Open Drafts',
                value: workspaceSummary.draftAppeals,
                help: 'Current drafting load',
                path: icon.mdiFileDocumentEdit,
              },
              {
                label: 'Ready Cases',
                value: workspaceSummary.readyCases,
                help: 'Prepared for submission',
                path: icon.mdiClipboardCheckOutline,
              },
              {
                label: 'Submitted Cases',
                value: workspaceSummary.submittedCases,
                help: 'Already sent to payer',
                path: icon.mdiSendCheckOutline,
              },
              {
                label: 'Recent Updates',
                value: workspaceSummary.recentDrafts.length,
                help: 'Latest drafting activity',
                path: icon.mdiHistory,
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
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getAppeal_draftsCSV} />
          
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
                <p className='text-lg font-semibold'>Draft Queue</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Manage active drafts and move approved work toward submission.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.draftAppeals || 0} open drafts
              </span>
            </div>
            <TableAppeal_drafts
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Recent Drafts</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Latest letter activity</p>
              </div>
              <BaseButton href='/appeal-dashboard' color='white' small label='Open dashboard' />
            </div>
            <div className='space-y-3'>
              {workspaceSummary?.recentDrafts?.length ? (
                workspaceSummary.recentDrafts.map((draft) => (
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
                <div className='text-sm text-gray-500 dark:text-gray-400'>No recent draft activity.</div>
              )}
            </div>
          </CardBox>
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

Appeal_draftsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_APPEAL_DRAFTS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default Appeal_draftsTablesPage
