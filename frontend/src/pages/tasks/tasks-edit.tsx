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

import { update, fetch } from '../../stores/tasks/tasksSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditTasksPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    case: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    assignee_user: null,
    

    
    
    
    'title': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    description: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    status: '',
    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    priority: '',
    

    

    

    

    
    
    

    

    

    

    

    
    due_at: new Date(),
    

    

    

    

    

    

    

    
    
    

    

    

    

    

    
    completed_at: new Date(),
    

    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { tasks } = useAppSelector((state) => state.tasks)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof tasks === 'object') {
      setInitialValues(tasks)
    }
  }, [tasks])

  useEffect(() => {
      if (typeof tasks === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (tasks)[el])
          setInitialValues(newInitialVal);
      }
  }, [tasks])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data })).unwrap()
    await router.push('/tasks/tasks-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit tasks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit tasks'} main>
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
    

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Assignee' labelFor='assignee_user'>
        <Field
            name='assignee_user'
            id='assignee_user'
            component={SelectField}
            options={initialValues.assignee_user}
            itemRef={'users'}
      
        
            showField={'firstName'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
    

  

  

    

  



  
    <FormField
        label="Title"
    >
        <Field
            name="title"
            placeholder="Title"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  

  
    <FormField label="Description" hasTextareaHeight>
        <Field name="description" as="textarea" placeholder="Description" />
    </FormField>
  

  

  

  

  

  

  

  

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">
          
            <option value="todo">todo</option>
          
            <option value="in_progress">in_progress</option>
          
            <option value="blocked">blocked</option>
          
            <option value="done">done</option>
          
        </Field>
    </FormField>
  

  

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="Priority" labelFor="priority">
        <Field name="priority" id="priority" component="select">
          
            <option value="low">low</option>
          
            <option value="medium">medium</option>
          
            <option value="high">high</option>
          
            <option value="urgent">urgent</option>
          
        </Field>
    </FormField>
  

  

  

  

    

  



  

  

  

  

  

  
      <FormField
          label="DueAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.due_at ?
                  new Date(
                      dayjs(initialValues.due_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'due_at': date})}
          />
      </FormField>
  

  

  

  

  

  

    

  



  

  

  

  

  

  
      <FormField
          label="CompletedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.completed_at ?
                  new Date(
                      dayjs(initialValues.completed_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'completed_at': date})}
          />
      </FormField>
  

  

  

  

  

  

    

  


  

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/tasks/tasks-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditTasksPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_TASKS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditTasksPage
