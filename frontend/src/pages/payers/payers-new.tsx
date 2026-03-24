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

import { create } from '../../stores/payers/payersSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const initialValues = {
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    name: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    payer_code: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    plan_type: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    claims_address: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    fax_number: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    portal_url: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    appeals_submission_method: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    appeals_contact: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    is_active: false,
    
    
    
    
    
    
    
    
}


const PayersNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

    
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push('/payers/payers-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Payer')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Payer" main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
                
                initialValues
                
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>





















  <FormField label="Organization" labelFor="organization">
      <Field name="organization" id="organization" component={SelectField} options={[]} itemRef={'organizations'}></Field>
  </FormField>









  <FormField
      label="Name"
  >
      <Field
          name="name"
          placeholder="Name"
      />
  </FormField>



























  <FormField
      label="PayerCode"
  >
      <Field
          name="payer_code"
          placeholder="PayerCode"
      />
  </FormField>



























  <FormField
      label="PlanType"
  >
      <Field
          name="plan_type"
          placeholder="PlanType"
      />
  </FormField>





























    <FormField label="ClaimsAddress" hasTextareaHeight>
        <Field name="claims_address" as="textarea" placeholder="ClaimsAddress" />
    </FormField>

























  <FormField
      label="FaxNumber"
  >
      <Field
          name="fax_number"
          placeholder="FaxNumber"
      />
  </FormField>



























  <FormField
      label="PortalURL"
  >
      <Field
          name="portal_url"
          placeholder="PortalURL"
      />
  </FormField>



























  <FormField
      label="AppealsSubmissionMethod"
  >
      <Field
          name="appeals_submission_method"
          placeholder="AppealsSubmissionMethod"
      />
  </FormField>





























    <FormField label="AppealsContact" hasTextareaHeight>
        <Field name="appeals_contact" as="textarea" placeholder="AppealsContact" />
    </FormField>









































  <FormField label='IsActive' labelFor='is_active'>
      <Field
          name='is_active'
          id='is_active'
          component={SwitchField}
      ></Field>
  </FormField>









              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/payers/payers-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

PayersNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_PAYERS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default PayersNew
