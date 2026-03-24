import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormFilePicker from '../../components/FormFilePicker'
import FormImagePicker from '../../components/FormImagePicker'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/activity_logs/activity_logsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditActivity_logs = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    case: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    actor_user: null,
    

    
    
    

    

    

    

    

    

    

    

    
    entity_type: '',
    

    

    

    

    
    
    
    'entity_key': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    action: '',
    

    

    

    

    
    
    

    
    message: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    
    occurred_at: new Date(),
    

    

    

    

    

    

    

    
    
    
    'ip_address': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { activity_logs } = useAppSelector((state) => state.activity_logs)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { activity_logsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: activity_logsId }))
  }, [activity_logsId])

  useEffect(() => {
    if (typeof activity_logs === 'object') {
      setInitialValues(activity_logs)
    }
  }, [activity_logs])

  useEffect(() => {
      if (typeof activity_logs === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (activity_logs)[el])

          setInitialValues(newInitialVal);
      }
  }, [activity_logs])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: activity_logsId, data }))
    await router.push('/activity_logs/activity_logs-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit Activity Log')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit activity_logs'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>


  

  

  

  

  

  

  

  

  

  
    {hasPermission(currentUser, 'READ_ORGANIZATIONS') && 
    <FormField label='Organization' labelFor='organization'>
        <Field
            name='organization'
            id='organization'
            component={SelectField}
            options={initialValues.organization}
            itemRef={'organizations'}
      
        
      
        
      
        
      
        
            showField={'name'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
     } 

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Case' labelFor='case'>
        <Field
            name='case'
            id='case'
            component={SelectField}
            options={initialValues.case}
            itemRef={'cases'}
      
        
      
        
      
        
      
        
      
        
      
        
            showField={'case_number'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
    

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Actor' labelFor='actor_user'>
        <Field
            name='actor_user'
            id='actor_user'
            component={SelectField}
            options={initialValues.actor_user}
            itemRef={'users'}
      
        
            showField={'firstName'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
    

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="EntityType" labelFor="entity_type">
        <Field name="entity_type" id="entity_type" component="select">
          
            <option value="case">case</option>
          
            <option value="task">task</option>
          
            <option value="document">document</option>
          
            <option value="appeal_draft">appeal_draft</option>
          
            <option value="note">note</option>
          
            <option value="payer">payer</option>
          
            <option value="user">user</option>
          
            <option value="setting">setting</option>
          
        </Field>
    </FormField>
  

  

  

  

    

  



  
    <FormField
        label="EntityKey"
    >
        <Field
            name="entity_key"
            placeholder="EntityKey"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="Action" labelFor="action">
        <Field name="action" id="action" component="select">
          
            <option value="created">created</option>
          
            <option value="updated">updated</option>
          
            <option value="assigned">assigned</option>
          
            <option value="status_changed">status_changed</option>
          
            <option value="priority_changed">priority_changed</option>
          
            <option value="submitted">submitted</option>
          
            <option value="uploaded">uploaded</option>
          
            <option value="commented">commented</option>
          
            <option value="deleted">deleted</option>
          
            <option value="restored">restored</option>
          
            <option value="login">login</option>
          
        </Field>
    </FormField>
  

  

  

  

    

  



  

  
    <FormField label="Message" hasTextareaHeight>
        <Field name="message" as="textarea" placeholder="Message" />
    </FormField>
  

  

  

  

  

  

  

  

  

  

    

  



  

  

  

  

  

  
      <FormField
          label="OccurredAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.occurred_at ?
                  new Date(
                      dayjs(initialValues.occurred_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'occurred_at': date})}
          />
      </FormField>
  

  

  

  

  

  

    

  



  
    <FormField
        label="IPAddress"
    >
        <Field
            name="ip_address"
            placeholder="IPAddress"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  


  

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/activity_logs/activity_logs-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditActivity_logs.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_ACTIVITY_LOGS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditActivity_logs
