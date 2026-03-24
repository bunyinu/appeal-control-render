import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableActivity_logs from '../../components/Activity_logs/TableActivity_logs'
import BaseButton from '../../components/BaseButton'
import axios from "axios";
import Link from "next/link";



const Activity_logsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);

  
  const [filters] = useState([{label: 'EntityKey', title: 'entity_key'},{label: 'Message', title: 'message'},{label: 'IPAddress', title: 'ip_address'},
          
          
          {label: 'OccurredAt', title: 'occurred_at', date: 'true'},
    
    
    
    
    {label: 'Case', title: 'case'},
    
    
    
    {label: 'Actor', title: 'actor_user'},
    
    
              
          {label: 'EntityType', title: 'entity_type', type: 'enum', options: ['case','task','document','appeal_draft','note','payer','user','setting']},{label: 'Action', title: 'action', type: 'enum', options: ['created','updated','assigned','status_changed','priority_changed','submitted','uploaded','commented','deleted','restored','login']},
  ]);
    
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

    const getActivity_logsCSV = async () => {
        const response = await axios({url: '/activity_logs?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'activity_logsCSV.csv'
        link.click()
    };

  return (
    <>
      <Head>
        <title>{getPageTitle('Activity Logs')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Activity Logs" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Filter'
              onClick={addFilter}
          />
          <BaseButton className={'mr-3'} color='info' label='Download CSV' onClick={getActivity_logsCSV} />
          
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
            
              <Link href={'/activity_logs/activity_logs-list'}>
                Back to list
              </Link>
            
          </div>
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableActivity_logs
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
            showGrid={true}
            />
        </CardBox>
      </SectionMain>
    </>
  )
}

Activity_logsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
        permission={'READ_ACTIVITY_LOGS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default Activity_logsTablesPage
