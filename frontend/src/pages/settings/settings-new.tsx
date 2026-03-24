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

import { create } from '../../stores/settings/settingsSlice'
import { useAppDispatch } from '../../stores/hooks'
import { useRouter } from 'next/router'
import moment from 'moment';

const initialValues = {
    
    
    
    
    
    
    
    
    
    
    
    
    
    organization: '',
    
    
    
    
    key: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    value: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    description: '',
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    value_type: 'string',
    
    
    
    
    
    
    
    
    
    
    
    
    
    is_sensitive: false,
    
    
    
    
    
    
    
    
}


const SettingsNew = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

    
    

  const handleSubmit = async (data) => {
    await dispatch(create(data)).unwrap()
    await router.push('/settings/settings-list')
  }
  return (
    <>
      <Head>
        <title>{getPageTitle('New Setting')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="New Setting" main>
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
      label="Key"
  >
      <Field
          name="key"
          placeholder="Key"
      />
  </FormField>





























    <FormField label="Value" hasTextareaHeight>
        <Field name="value" as="textarea" placeholder="Value" />
    </FormField>



























    <FormField label="Description" hasTextareaHeight>
        <Field name="description" as="textarea" placeholder="Description" />
    </FormField>







































  <FormField label="ValueType" labelFor="value_type">
      <Field name="value_type" id="value_type" component="select">
      
        <option value="string">string</option>
      
        <option value="number">number</option>
      
        <option value="boolean">boolean</option>
      
        <option value="json">json</option>
      
      </Field>
  </FormField>





























  <FormField label='IsSensitive' labelFor='is_sensitive'>
      <Field
          name='is_sensitive'
          id='is_sensitive'
          component={SwitchField}
      ></Field>
  </FormField>









              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/settings/settings-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

SettingsNew.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'CREATE_SETTINGS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default SettingsNew
