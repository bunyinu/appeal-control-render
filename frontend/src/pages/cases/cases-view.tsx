import React, { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import {
  mdiChartTimelineVariant,
  mdiFileDocument,
  mdiFileDocumentEdit,
  mdiFormatListChecks,
  mdiHistory,
  mdiNoteText,
} from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch as fetchCase } from '../../stores/cases/casesSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import FormField from '../../components/FormField';
import TableTasks from '../../components/Tasks/TableTasks';
import TableDocuments from '../../components/Documents/TableDocuments';
import TableAppealDrafts from '../../components/Appeal_drafts/TableAppeal_drafts';
import TableNotes from '../../components/Notes/TableNotes';
import TableActivityLogs from '../../components/Activity_logs/TableActivity_logs';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  humanized,
  personName,
  renderText,
} from '../../helpers/recordView';

const CasesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cases, loading } = useAppSelector((state) => state.cases);
  const { id } = router.query;

  const [activeTab, setActiveTab] = useState('overview');
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCase({ id }));
    }
  }, [dispatch, id]);

  const handleActionSubmit = async (values) => {
    if (!id) return;

    setActionLoading(true);

    try {
      if (modalAction === 'markWon') {
        await axios.put(`/cases/${id}/mark-won`, { data: { resolutionReason: values.reason } });
      } else if (modalAction === 'markLost') {
        await axios.put(`/cases/${id}/mark-lost`, { data: { resolutionReason: values.reason } });
      } else if (modalAction === 'reopen') {
        await axios.put(`/cases/${id}/reopen`, { data: { reopenReason: values.reason } });
      } else if (modalAction === 'changeStatus') {
        await axios.put(`/cases/${id}/change-status`, { data: { status: values.status } });
      }

      dispatch(fetchCase({ id }));
      setModalAction(null);
    } catch (error) {
      console.error(error);
      alert(`Action failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const generateFixedFilter = (field, value) => [{ id: 'fixed', fields: { selectedField: field, filterValue: value } }];

  if (!cases || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading case details...</CardBox>
      </SectionMain>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks', icon: mdiFormatListChecks },
    { id: 'documents', label: 'Documents', icon: mdiFileDocument },
    { id: 'drafts', label: 'Appeal Drafts', icon: mdiFileDocumentEdit },
    { id: 'notes', label: 'Notes', icon: mdiNoteText },
    { id: 'activity', label: 'Activity', icon: mdiHistory },
  ];

  return (
    <>
      <Head>
        <title>{getPageTitle('Case Details')}</title>
      </Head>
      <SectionMain>
        <CardBoxModal
          isActive={!!modalAction}
          title={
            modalAction === 'markWon'
              ? 'Mark Case Won'
              : modalAction === 'markLost'
                ? 'Mark Case Lost'
                : modalAction === 'reopen'
                  ? 'Reopen Case'
                  : modalAction === 'changeStatus'
                    ? 'Change Status'
                    : ''
          }
          buttonColor={modalAction === 'markWon' ? 'success' : modalAction === 'markLost' ? 'danger' : 'info'}
          buttonLabel={actionLoading ? 'Saving...' : 'Confirm'}
          onCancel={() => setModalAction(null)}
          onConfirm={() => {
            const form = document.getElementById('action-form');
            if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }}
        >
          <Formik initialValues={{ reason: '', status: cases.status }} onSubmit={handleActionSubmit}>
            <Form id='action-form'>
              {['markWon', 'markLost', 'reopen'].includes(modalAction || '') && (
                <FormField label='Reason'>
                  <Field name='reason' as='textarea' className='w-full rounded border-gray-300 p-2' rows='3' required />
                </FormField>
              )}
              {modalAction === 'changeStatus' && (
                <FormField label='New Status'>
                  <Field name='status' as='select' className='w-full rounded border-gray-300 p-2'>
                    <option value='intake'>Intake</option>
                    <option value='triage'>Triage</option>
                    <option value='evidence_needed'>Evidence Needed</option>
                    <option value='appeal_ready'>Appeal Ready</option>
                    <option value='submitted'>Submitted</option>
                    <option value='pending_payer'>Pending Payer</option>
                    <option value='won'>Won</option>
                    <option value='lost'>Lost</option>
                  </Field>
                </FormField>
              )}
            </Form>
          </Formik>
        </CardBoxModal>

        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={`Case ${cases.case_number || cases.id}`}
          main
        >
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Case Record'
          title={cases.patient_name || cases.case_number || 'Case'}
          subtitle={`${renderText(cases.case_number)} • ${renderText(cases.payer?.name, 'No payer linked')}`}
          actions={[
            { href: `/cases/cases-edit/?id=${id}`, label: 'Edit Case', color: 'info' },
            { href: '/cases/cases-list', label: 'Back to Cases' },
            { href: '/appeal-dashboard', label: 'Appeal Dashboard' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            {
              label: 'Status',
              value: humanized(cases.status),
              help: 'Current appeal state',
              path: mdiChartTimelineVariant,
            },
            {
              label: 'Priority',
              value: humanized(cases.priority),
              help: 'Operational urgency',
              path: mdiFormatListChecks,
            },
            {
              label: 'Amount At Risk',
              value: formatCurrency(cases.amount_at_risk),
              help: 'Financial exposure',
              path: mdiFileDocument,
            },
            {
              label: 'Due At',
              value: formatDate(cases.due_at),
              help: 'Next required deadline',
              path: mdiHistory,
            },
          ]}
        />

        <RecordBodyCard
          title='Case Actions'
          description='Move the case forward from the detail page without dropping back to the queue.'
        >
          <div className='flex flex-wrap gap-3'>
            <BaseButton color='white' label='Assign Owner' href={`/cases/cases-edit/?id=${id}`} />
            <BaseButton color='white' label='Change Status' onClick={() => setModalAction('changeStatus')} />
            <BaseButton color='info' label='Add Task' href={`/tasks/tasks-new?caseId=${id}`} />
            <BaseButton color='info' label='Add Note' href={`/notes/notes-new?caseId=${id}`} />
            <BaseButton color='info' label='Upload Document' href={`/documents/documents-new?caseId=${id}`} />
            <BaseButton color='info' label='New Draft' href={`/appeal_drafts/appeal_drafts-new?caseId=${id}`} />
            <BaseButton color='success' label='Mark Won' onClick={() => setModalAction('markWon')} />
            <BaseButton color='danger' label='Mark Lost' onClick={() => setModalAction('markLost')} />
            {['won', 'lost'].includes(cases.status) && (
              <BaseButton color='warning' label='Reopen Case' onClick={() => setModalAction('reopen')} />
            )}
          </div>
        </RecordBodyCard>

        <div className='mb-6 flex flex-wrap gap-3'>
          {tabs.map((tab) => (
            <BaseButton
              key={tab.id}
              color={activeTab === tab.id ? 'info' : 'whiteDark'}
              label={tab.label}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
            <RecordFieldCard
              title='Patient Profile'
              description='Core patient and ordering information attached to this case.'
              columns={2}
              fields={[
                { label: 'Patient Name', value: renderText(cases.patient_name) },
                { label: 'Date of Birth', value: formatDate(cases.patient_dob) },
                { label: 'Member ID', value: renderText(cases.member_id) },
                { label: 'Facility', value: renderText(cases.facility_name) },
                { label: 'Ordering Provider', value: renderText(cases.ordering_provider) },
                { label: 'Procedure Code', value: renderText(cases.procedure_code) },
              ]}
            />

            <RecordFieldCard
              title='Appeal Context'
              description='Routing, denial, and ownership context for this case.'
              fields={[
                { label: 'Payer', value: renderText(cases.payer?.name) },
                { label: 'Owner', value: personName(cases.owner_user) },
                { label: 'Outcome', value: humanized(cases.outcome) },
                { label: 'Diagnosis Code', value: renderText(cases.diagnosis_code) },
                { label: 'Denial Reason Code', value: renderText(cases.denial_reason_code) },
                { label: 'Denial Reason', value: renderText(cases.denial_reason) },
                { label: 'Submitted At', value: formatDateTime(cases.submitted_at) },
                { label: 'Closed At', value: formatDateTime(cases.closed_at) },
              ]}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <RecordBodyCard title='Case Tasks' description='Tasks assigned directly to this case.'>
            <div className='mb-4'>
              <BaseButton color='info' label='Add Task' href={`/tasks/tasks-new?caseId=${id}`} />
            </div>
            <TableTasks
              filterItems={generateFixedFilter('case', cases.id)}
              setFilterItems={() => null}
              filters={[{ title: 'case' }]}
              showGrid={true}
            />
          </RecordBodyCard>
        )}

        {activeTab === 'documents' && (
          <RecordBodyCard title='Case Documents' description='Evidence and supporting documentation linked to this case.'>
            <div className='mb-4'>
              <BaseButton color='info' label='Upload Document' href={`/documents/documents-new?caseId=${id}`} />
            </div>
            <TableDocuments
              filterItems={generateFixedFilter('case', cases.id)}
              setFilterItems={() => null}
              filters={[{ title: 'case' }]}
              showGrid={true}
            />
          </RecordBodyCard>
        )}

        {activeTab === 'drafts' && (
          <RecordBodyCard title='Appeal Drafts' description='Draft letters and submission artifacts for this case.'>
            <div className='mb-4'>
              <BaseButton color='info' label='New Draft' href={`/appeal_drafts/appeal_drafts-new?caseId=${id}`} />
            </div>
            <TableAppealDrafts
              filterItems={generateFixedFilter('case', cases.id)}
              setFilterItems={() => null}
              filters={[{ title: 'case' }]}
              showGrid={true}
            />
          </RecordBodyCard>
        )}

        {activeTab === 'notes' && (
          <RecordBodyCard title='Case Notes' description='Internal and operational notes attached to this case.'>
            <div className='mb-4'>
              <BaseButton color='info' label='Add Note' href={`/notes/notes-new?caseId=${id}`} />
            </div>
            <TableNotes
              filterItems={generateFixedFilter('case', cases.id)}
              setFilterItems={() => null}
              filters={[{ title: 'case' }]}
              showGrid={true}
            />
          </RecordBodyCard>
        )}

        {activeTab === 'activity' && (
          <RecordBodyCard title='Activity Timeline' description='System activity and audit history for this case.'>
            <TableActivityLogs
              filterItems={generateFixedFilter('case', cases.id)}
              setFilterItems={() => null}
              filters={[{ title: 'case' }]}
              showGrid={true}
            />
          </RecordBodyCard>
        )}
      </SectionMain>
    </>
  );
};

CasesView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_CASES'>{page}</LayoutAuthenticated>;
};

export default CasesView;
