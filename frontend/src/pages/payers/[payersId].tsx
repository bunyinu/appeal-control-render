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

import { update, fetch } from '../../stores/payers/payersSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditPayers = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    
    'name': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'payer_code': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'plan_type': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    claims_address: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'fax_number': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'portal_url': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'appeals_submission_method': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    appeals_contact: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    
    is_active: false,
    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { payers } = useAppSelector((state) => state.payers)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { payersId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: payersId }))
  }, [payersId])

  useEffect(() => {
    if (typeof payers === 'object') {
      setInitialValues(payers)
    }
  }, [payers])

  useEffect(() => {
      if (typeof payers === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (payers)[el])

          setInitialValues(newInitialVal);
      }
  }, [payers])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: payersId, data }))
    await router.push('/payers/payers-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit payers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit payers'} main>
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

EditPayers.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_PAYERS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditPayers
