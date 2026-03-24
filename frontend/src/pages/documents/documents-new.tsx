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

import { create } from '../../stores/documents/documentsSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const createInitialValues = (caseId = '') => ({
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    case: caseId,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    uploaded_by_user: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    category: 'denial_letter',
    
    
    
    
    
    
    
    title: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    description: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    file: [],
    
    
    
    
    
    
    
    
    
    
    
    
    is_confidential: false,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    received_at: '',
    
    
    
    
    
    
    
    
    
})


const DocumentsNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const caseId = typeof router.query.caseId === 'string' ? router.query.caseId : ''
  const initialValues = React.useMemo(
    () => createInitialValues(caseId),
    [caseId],
  )

    
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push(caseId ? `/cases/cases-view/?id=${caseId}` : '/documents/documents-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Document')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Document" main>
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



























  <FormField label="UploadedBy" labelFor="uploaded_by_user">
      <Field name="uploaded_by_user" id="uploaded_by_user" component={SelectField} options={[]} itemRef={'users'}></Field>
  </FormField>























  <FormField label="Category" labelFor="category">
      <Field name="category" id="category" component="select">
      
        <option value="denial_letter">denial_letter</option>
      
        <option value="medical_records">medical_records</option>
      
        <option value="clinical_notes">clinical_notes</option>
      
        <option value="imaging">imaging</option>
      
        <option value="treatment_plan">treatment_plan</option>
      
        <option value="letter_of_medical_necessity">letter_of_medical_necessity</option>
      
        <option value="policy">policy</option>
      
        <option value="authorization">authorization</option>
      
        <option value="claim">claim</option>
      
        <option value="correspondence">correspondence</option>
      
        <option value="other">other</option>
      
      </Field>
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
















































  <FormField>
      <Field
          label='File'
          color='info'
          icon={mdiUpload}
          path={'documents/file'}
          name='file'
          id='file'
          schema={{
            size: undefined,
            formats: undefined,
          }}
          component={FormFilePicker}
      ></Field>
  </FormField>




















  <FormField label='IsConfidential' labelFor='is_confidential'>
      <Field
          name='is_confidential'
          id='is_confidential'
          component={SwitchField}
      ></Field>
  </FormField>





















  <FormField
      label="ReceivedAt"
  >
      <Field
          type="datetime-local"
          name="received_at"
          placeholder="ReceivedAt"
      />
  </FormField>















              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/documents/documents-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

DocumentsNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_DOCUMENTS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default DocumentsNew
