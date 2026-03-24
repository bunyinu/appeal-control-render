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

import { update, fetch } from '../../stores/cases/casesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditCasesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    payer: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    owner_user: null,
    

    
    
    
    'case_number': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'patient_name': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    
    patient_dob: new Date(),
    

    

    

    

    

    

    

    
    
    
    'member_id': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'procedure_code': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'diagnosis_code': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'denial_reason_code': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    denial_reason: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'facility_name': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'ordering_provider': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    
    'amount_at_risk': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    status: '',
    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    priority: '',
    

    

    

    

    
    
    

    

    

    

    

    
    submitted_at: new Date(),
    

    

    

    

    

    

    

    
    
    

    

    

    

    

    
    due_at: new Date(),
    

    

    

    

    

    

    

    
    
    

    

    

    

    

    
    closed_at: new Date(),
    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    outcome: '',
    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { cases } = useAppSelector((state) => state.cases)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof cases === 'object') {
      setInitialValues(cases)
    }
  }, [cases])

  useEffect(() => {
      if (typeof cases === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (cases)[el])
          setInitialValues(newInitialVal);
      }
  }, [cases])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data })).unwrap()
    await router.push('/cases/cases-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit cases')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit cases'} main>
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

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Payer' labelFor='payer'>
        <Field
            name='payer'
            id='payer'
            component={SelectField}
            options={initialValues.payer}
            itemRef={'payers'}
      
        
      
        
      
        
      
        
      
        
            showField={'name'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
    

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Owner' labelFor='owner_user'>
        <Field
            name='owner_user'
            id='owner_user'
            component={SelectField}
            options={initialValues.owner_user}
            itemRef={'users'}
      
        
            showField={'firstName'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
    </FormField>
    

  

  

    

  



  
    <FormField
        label="CaseNumber"
    >
        <Field
            name="case_number"
            placeholder="CaseNumber"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="PatientName"
    >
        <Field
            name="patient_name"
            placeholder="PatientName"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  

  

  

  

  

  
      <FormField
          label="PatientDateofBirth"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.patient_dob ?
                  new Date(
                      dayjs(initialValues.patient_dob).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'patient_dob': date})}
          />
      </FormField>
  

  

  

  

  

  

    

  



  
    <FormField
        label="MemberID"
    >
        <Field
            name="member_id"
            placeholder="MemberID"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="ProcedureCode"
    >
        <Field
            name="procedure_code"
            placeholder="ProcedureCode"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="DiagnosisCode"
    >
        <Field
            name="diagnosis_code"
            placeholder="DiagnosisCode"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="DenialReasonCode"
    >
        <Field
            name="denial_reason_code"
            placeholder="DenialReasonCode"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  

  
    <FormField label="DenialReason" hasTextareaHeight>
        <Field name="denial_reason" as="textarea" placeholder="DenialReason" />
    </FormField>
  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="FacilityName"
    >
        <Field
            name="facility_name"
            placeholder="FacilityName"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  
    <FormField
        label="OrderingProvider"
    >
        <Field
            name="ordering_provider"
            placeholder="OrderingProvider"
        />
    </FormField>
  

  

  

  

  

  

  

  

  

  

  

    

  



  

  

  

  
    <FormField
        label="AmountatRisk"
    >
        <Field
            type="number"
            name="amount_at_risk"
            placeholder="AmountatRisk"
        />
    </FormField>
  

  

  

  

  

  

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">
          
            <option value="intake">intake</option>
          
            <option value="triage">triage</option>
          
            <option value="evidence_needed">evidence_needed</option>
          
            <option value="appeal_ready">appeal_ready</option>
          
            <option value="submitted">submitted</option>
          
            <option value="pending_payer">pending_payer</option>
          
            <option value="won">won</option>
          
            <option value="lost">lost</option>
          
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
          label="SubmittedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.submitted_at ?
                  new Date(
                      dayjs(initialValues.submitted_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'submitted_at': date})}
          />
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
          label="ClosedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.closed_at ?
                  new Date(
                      dayjs(initialValues.closed_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'closed_at': date})}
          />
      </FormField>
  

  

  

  

  

  

    

  



  

  

  

  

  

  

  

  
    <FormField label="Outcome" labelFor="outcome">
        <Field name="outcome" id="outcome" component="select">
          
            <option value="unknown">unknown</option>
          
            <option value="won">won</option>
          
            <option value="lost">lost</option>
          
            <option value="partially_won">partially_won</option>
          
            <option value="withdrawn">withdrawn</option>
          
        </Field>
    </FormField>
  

  

  

  

    

  


  

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/cases/cases-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditCasesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_CASES'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditCasesPage
