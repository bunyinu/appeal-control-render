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

import { update, fetch } from '../../stores/appeal_drafts/appeal_draftsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditAppeal_drafts = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    case: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    author_user: null,
    

    
    
    
    'title': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    status: '',
    

    

    

    

    
    
    

    

    
    content: '',
    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    

    
    attachments: [],
    

    

    

    
    
    

    

    

    

    

    
    submitted_at: new Date(),
    

    

    

    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { appeal_drafts } = useAppSelector((state) => state.appeal_drafts)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { appeal_draftsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: appeal_draftsId }))
  }, [appeal_draftsId])

  useEffect(() => {
    if (typeof appeal_drafts === 'object') {
      setInitialValues(appeal_drafts)
    }
  }, [appeal_drafts])

  useEffect(() => {
      if (typeof appeal_drafts === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (appeal_drafts)[el])

          setInitialValues(newInitialVal);
      }
  }, [appeal_drafts])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: appeal_draftsId, data }))
    await router.push('/appeal_drafts/appeal_drafts-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit Appeal Draft')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit appeal_drafts'} main>
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
    

  

  

    

  



  

  

  

  

  

  

  

  

  

  
  
    <FormField label='Author' labelFor='author_user'>
        <Field
            name='author_user'
            id='author_user'
            component={SelectField}
            options={initialValues.author_user}
            itemRef={'users'}
      
        
            showField={'firstName'}
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        
      
        ></Field>
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

EditAppeal_drafts.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_APPEAL_DRAFTS'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditAppeal_drafts
