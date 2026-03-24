import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableTasks from '../../components/Tasks/TableTasks'
import BaseButton from '../../components/BaseButton'
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import CardBoxModal from "../../components/CardBoxModal";
import DragDropFilePicker from "../../components/DragDropFilePicker";
import {setRefetch, uploadCsv} from '../../stores/tasks/tasksSlice';


import {hasPermission} from "../../helpers/userPermissions";



const TasksTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);

  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const dispatch = useAppDispatch();


  const [filters] = useState([{label: 'Title', title: 'title'},{label: 'Description', title: 'description'},
          
          
          {label: 'Due At', title: 'due_at', date: 'true'},{label: 'Completed At', title: 'completed_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Assignee', title: 'assignee_user'},
    
    
              
          {label: 'Status', title: 'status', type: 'enum', options: ['todo','in_progress','blocked','done']},{label: 'Priority', title: 'priority', type: 'enum', options: ['low','medium','high','urgent']},
  ]);
    
    const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_TASKS');
    

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

    const getTasksCSV = async () => {
        const response = await axios({url: '/tasks?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'tasksCSV.csv'
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
        <title>{getPageTitle('Tasks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Tasks" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          
            {hasCreatePermission && <BaseButton className={'mr-3'} href={'/tasks/tasks-new'} color='info' label='New Task'/>}
          
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Filter'
              onClick={addFilter}
          />
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getTasksCSV} />
          
            {hasCreatePermission && (
              <BaseButton
                color='info'
                label='Upload CSV'
                onClick={() => setIsModalActive(true)}
              />
            )}
          
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
            
              <BaseButton color='white' label='Calendar View' href='/tasks/tasks-list' />
            
          </div>
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableTasks
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

TasksTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_TASKS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default TasksTablesPage
