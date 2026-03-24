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

import { update, fetch } from '../../stores/settings/settingsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditSettingsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    
    'key': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    value: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    
    description: '',
    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    value_type: '',
    

    

    

    

    
    
    

    

    

    

    

    

    
    is_sensitive: false,
    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { settings } = useAppSelector((state) => state.settings)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof settings === 'object') {
      setInitialValues(settings)
    }
  }, [settings])

  useEffect(() => {
      if (typeof settings === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (settings)[el])
          setInitialValues(newInitialVal);
      }
  }, [settings])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data })).unwrap()
    await router.push('/settings/settings-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit settings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit settings'} main>
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

EditSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_SETTINGS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditSettingsPage
