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


import {hasPermission} from "../../helpers/userPermissions";



const Appeal_draftsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);

  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const dispatch = useAppDispatch();


  const [filters] = useState([{label: 'Title', title: 'title'},{label: 'Content', title: 'content'},
          
          
          {label: 'SubmittedAt', title: 'submitted_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Author', title: 'author_user'},
    
    
              
          {label: 'Status', title: 'status', type: 'enum', options: ['draft','in_review','approved','sent','archived']},
  ]);
    
    const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_APPEAL_DRAFTS');
    

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
        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          
            {hasCreatePermission && <BaseButton className={'mr-3'} href={'/appeal_drafts/appeal_drafts-new'} color='info' label='New Appeal Draft'/>}
          
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
            
              <Link href={'/appeal_drafts/appeal_drafts-list'}>
                Back to list
              </Link>
            
          </div>
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableAppeal_drafts
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
            showGrid={true}
            />
        </CardBox>
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
