import { mdiAccount, mdiChartTimelineVariant, mdiMail, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
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
import { SwitchField } from '../../components/SwitchField'

import { SelectField } from '../../components/SelectField'
import { SelectFieldMany } from "../../components/SelectFieldMany";
import {RichTextField} from "../../components/RichTextField";

import { create } from '../../stores/tasks/tasksSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const createInitialValues = (caseId = '') => ({
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    case: caseId,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    assignee_user: '',
    
    
    
    
    title: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    description: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    status: 'todo',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    priority: 'low',
    
    
    
    
    
    
    
    
    
    
    
    
    due_at: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    completed_at: '',
    
    
    
    
    
    
    
    
    
})


const TasksNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const caseId = typeof router.query.caseId === 'string' ? router.query.caseId : ''
  const initialValues = React.useMemo(
    () => createInitialValues(caseId),
    [caseId],
  )

    
    
    // get from url params
    const { dateRangeStart, dateRangeEnd } = router.query
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push(caseId ? `/cases/cases-view/?id=${caseId}` : '/tasks/tasks-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Task')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Task" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={
                dateRangeStart && dateRangeEnd ?
                {
                    ...initialValues,
                    due_at: moment(dateRangeStart).format('YYYY-MM-DDTHH:mm'),
                    completed_at: moment(dateRangeEnd).format('YYYY-MM-DDTHH:mm'),
                } : initialValues
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>





















  <FormField label="Organization" labelFor="organization">
      <Field name="organization" id="organization" component={SelectField} options={[]} itemRef={'organizations'}></Field>
  </FormField>



























  <FormField label="Case" labelFor="case">
      <Field name="case" id="case" component={SelectField} options={[]} itemRef={'cases'}></Field>
  </FormField>



























  <FormField label="Assignee" labelFor="assignee_user">
      <Field name="assignee_user" id="assignee_user" component={SelectField} options={[]} itemRef={'users'}></Field>
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
      <Field
          type="datetime-local"
          name="due_at"
          placeholder="DueAt"
      />
  </FormField>



























  <FormField
      label="CompletedAt"
  >
      <Field
          type="datetime-local"
          name="completed_at"
          placeholder="CompletedAt"
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

TasksNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_TASKS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default TasksNew
