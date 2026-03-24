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

import { create } from '../../stores/notes/notesSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const createInitialValues = (caseId = '') => ({
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    case: caseId,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    author_user: '',
    
    
    
    
    title: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    body: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    is_private: false,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    note_type: 'general',
    
    
    
    
    
    
})


const NotesNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const caseId = typeof router.query.caseId === 'string' ? router.query.caseId : ''
  const initialValues = React.useMemo(
    () => createInitialValues(caseId),
    [caseId],
  )

    
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push(caseId ? `/cases/cases-view/?id=${caseId}` : '/notes/notes-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Note')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Note" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
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































      <FormField label='Body' hasTextareaHeight>
          <Field
              name='body'
              id='body'
              component={RichTextField}
          ></Field>
      </FormField>







































  <FormField label='IsPrivate' labelFor='is_private'>
      <Field
          name='is_private'
          id='is_private'
          component={SwitchField}
      ></Field>
  </FormField>

























  <FormField label="NoteType" labelFor="note_type">
      <Field name="note_type" id="note_type" component="select">
      
        <option value="general">general</option>
      
        <option value="payer_call">payer_call</option>
      
        <option value="clinical_review">clinical_review</option>
      
        <option value="submission">submission</option>
      
        <option value="follow_up">follow_up</option>
      
        <option value="outcome">outcome</option>
      
      </Field>
  </FormField>











              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/notes/notes-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

NotesNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_NOTES'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default NotesNew
