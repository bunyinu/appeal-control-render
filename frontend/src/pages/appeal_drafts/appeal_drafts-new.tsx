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

import { create } from '../../stores/appeal_drafts/appeal_draftsSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const createInitialValues = (caseId = '') => ({
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    case: caseId,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    author_user: '',
    
    
    
    
    title: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    status: 'draft',
    
    
    
    
    
    
    
    
    
    content: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    attachments: [],
    
    
    
    
    
    
    
    
    
    
    
    submitted_at: '',
    
    
    
    
    
    
    
    
    
})


const Appeal_draftsNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const caseId = typeof router.query.caseId === 'string' ? router.query.caseId : ''
  const initialValues = React.useMemo(
    () => createInitialValues(caseId),
    [caseId],
  )

    
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push(caseId ? `/cases/cases-view/?id=${caseId}` : '/appeal_drafts/appeal_drafts-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Appeal Draft')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Appeal Draft" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={
                
                initialValues
                
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



























  <FormField label="Author" labelFor="author_user">
      <Field name="author_user" id="author_user" component={SelectField} options={[]} itemRef={'users'}></Field>
  </FormField>









  <FormField
      label="Title"
  >
      <Field
          name="title"
          placeholder="Title"
      />
  </FormField>









































  <FormField label="Status" labelFor="status">
      <Field name="status" id="status" component="select">
      
        <option value="draft">draft</option>
      
        <option value="in_review">in_review</option>
      
        <option value="approved">approved</option>
      
        <option value="sent">sent</option>
      
        <option value="archived">archived</option>
      
      </Field>
  </FormField>

















      <FormField label='Content' hasTextareaHeight>
          <Field
              name='content'
              id='content'
              component={RichTextField}
          ></Field>
      </FormField>














































  <FormField>
      <Field
          label='Attachments'
          color='info'
          icon={mdiUpload}
          path={'appeal_drafts/attachments'}
          name='attachments'
          id='attachments'
          schema={{
            size: undefined,
            formats: undefined,
          }}
          component={FormFilePicker}
      ></Field>
  </FormField>














  <FormField
      label="SubmittedAt"
  >
      <Field
          type="datetime-local"
          name="submitted_at"
          placeholder="SubmittedAt"
      />
  </FormField>















              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/appeal_drafts/appeal_drafts-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

Appeal_draftsNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_APPEAL_DRAFTS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default Appeal_draftsNew
