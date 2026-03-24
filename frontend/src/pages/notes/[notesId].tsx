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

import { update, fetch } from '../../stores/notes/notesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from "../../components/ImageField";

import {hasPermission} from "../../helpers/userPermissions";



const EditNotes = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {
      
    

    

    

    

    

    

    

    

    

    

    

    
    organization: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    case: null,
    

    
    
    

    

    

    

    

    

    

    

    

    

    

    
    author_user: null,
    

    
    
    
    'title': '',
    

    

    

    

    

    

    

    

    

    

    

    

    
    
    

    

    
    body: '',
    

    

    

    

    

    

    

    

    

    

    
    
    

    

    

    

    

    

    
    is_private: false,
    

    

    

    

    

    

    
    
    

    

    

    

    

    

    

    

    
    note_type: '',
    

    

    

    

    
    
    
  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { notes } = useAppSelector((state) => state.notes)
  
  const { currentUser } = useAppSelector((state) => state.auth);
  

  const { notesId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: notesId }))
  }, [notesId])

  useEffect(() => {
    if (typeof notes === 'object') {
      setInitialValues(notes)
    }
  }, [notes])

  useEffect(() => {
      if (typeof notes === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (notes)[el])

          setInitialValues(newInitialVal);
      }
  }, [notes])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: notesId, data }))
    await router.push('/notes/notes-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit notes')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit notes'} main>
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

EditNotes.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated
        
          permission={'UPDATE_NOTES'}
        
      >
          {page}
      </LayoutAuthenticated>
  )
}

export default EditNotes
