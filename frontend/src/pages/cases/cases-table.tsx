import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableCases from '../../components/Cases/TableCases'
import BaseButton from '../../components/BaseButton'
import axios from "axios";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import CardBoxModal from "../../components/CardBoxModal";
import DragDropFilePicker from "../../components/DragDropFilePicker";
import {setRefetch, uploadCsv} from '../../stores/cases/casesSlice';


import {hasPermission} from "../../helpers/userPermissions";



const CasesTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const dispatch = useAppDispatch();


  const [filters] = useState([{label: 'CaseNumber', title: 'case_number'},{label: 'PatientName', title: 'patient_name'},{label: 'MemberID', title: 'member_id'},{label: 'ProcedureCode', title: 'procedure_code'},{label: 'DiagnosisCode', title: 'diagnosis_code'},{label: 'DenialReasonCode', title: 'denial_reason_code'},{label: 'DenialReason', title: 'denial_reason'},{label: 'FacilityName', title: 'facility_name'},{label: 'OrderingProvider', title: 'ordering_provider'},
          
          {label: 'AmountatRisk', title: 'amount_at_risk', number: 'true'},
          {label: 'PatientDateofBirth', title: 'patient_dob', date: 'true'},{label: 'SubmittedAt', title: 'submitted_at', date: 'true'},{label: 'DueAt', title: 'due_at', date: 'true'},{label: 'ClosedAt', title: 'closed_at', date: 'true'},
    
    
    
    
    {label: 'Payer', title: 'payer'},
    
    
    
    {label: 'Owner', title: 'owner_user'},
    
    
              
          {label: 'Status', title: 'status', type: 'enum', options: ['intake','triage','evidence_needed','appeal_ready','submitted','pending_payer','won','lost']},{label: 'Priority', title: 'priority', type: 'enum', options: ['low','medium','high','urgent']},{label: 'Outcome', title: 'outcome', type: 'enum', options: ['unknown','won','lost','partially_won','withdrawn']},
  ]);
    
    const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_CASES');
    

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

    const getCasesCSV = async () => {
        const response = await axios({url: '/cases?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'casesCSV.csv'
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
        <title>{getPageTitle('Cases')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Cases" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          
            {hasCreatePermission && <BaseButton className={'mr-3'} href={'/cases/cases-new'} color='info' label='New Case'/>}
          
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Filter'
              onClick={addFilter}
          />
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getCasesCSV} />
          
            {hasCreatePermission && (
              <BaseButton
                color='info'
                label='Upload CSV'
                onClick={() => setIsModalActive(true)}
              />
            )}
          
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
            
              <Link href={'/cases/cases-list'}>
                Back to board
              </Link>
            
          </div>
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableCases
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

CasesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_CASES'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default CasesTablesPage
