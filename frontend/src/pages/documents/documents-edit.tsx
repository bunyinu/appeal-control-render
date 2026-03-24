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

import { update, fetch } from '../../stores/documents/documentsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditDocumentsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    case: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    uploaded_by_user: null,
    

    
    
    

    

    

    

    

    

    

    

    
    category: '',
    

    

    

    

    
    
    
    'title': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    description: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    

    
    file: [],
    

    

    

    
    
    

    

    

    

    

    

    
    is_confidential: false,
    

    

    

    

    

    

    
    
    

    

    

    

    

    
    received_at: new Date(),
    

    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { documents } = useAppSelector((state) => state.documents)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof documents === 'object') {
      setInitialValues(documents)
    }
  }, [documents])

  useEffect(() => {
      if (typeof documents === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (documents)[el])
          setInitialValues(newInitialVal);
      }
  }, [documents])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data })).unwrap()
    await router.push('/documents/documents-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit documents')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit documents'} main>
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
    

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='UploadedBy' labelFor='uploaded_by_user'>
        <Field
            name='uploaded_by_user'
            id='uploaded_by_user'
            component={SelectField}
            options={initialValues.uploaded_by_user}
            itemRef={'users'}
      
        
            showField={'firstName'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
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
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.received_at ?
                  new Date(
                      dayjs(initialValues.received_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'received_at': date})}
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

EditDocumentsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_DOCUMENTS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditDocumentsPage
