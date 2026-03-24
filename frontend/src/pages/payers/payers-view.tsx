import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiFax, mdiMonitorArrowDownVariant, mdiOfficeBuildingOutline, mdiShieldCheckOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/payers/payersSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, humanized, renderText } from '../../helpers/recordView';

const PayersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { payers, loading } = useAppSelector((state) => state.payers);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!payers || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading payer details...</CardBox>
      </SectionMain>
    );
  }

  const linkedCases = (payers.cases_payer || []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.case_number || 'Case',
    meta: item.patient_name || 'No patient name',
    caption: `${item.status || 'status unknown'} • ${item.priority || 'priority unknown'}`,
    href: `/cases/cases-view/?id=${item.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Payer Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Payer Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Payer Record'
          title={payers.name || 'Payer'}
          subtitle={`${renderText(payers.organization?.name)} • ${humanized(payers.appeals_submission_method)}`}
          actions={[
            { href: `/payers/payers-edit/?id=${id}`, label: 'Edit Payer', color: 'info' },
            { href: '/payers/payers-list', label: 'Back to Payers' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Payer Code', value: renderText(payers.payer_code), help: 'Internal reference', path: mdiOfficeBuildingOutline },
            { label: 'Plan Type', value: humanized(payers.plan_type), help: 'Plan classification', path: mdiShieldCheckOutline },
            {
              label: 'Submission Method',
              value: humanized(payers.appeals_submission_method),
              help: 'Appeal routing channel',
              path: payers.appeals_submission_method === 'fax' ? mdiFax : mdiMonitorArrowDownVariant,
            },
            { label: 'Active', value: formatBoolean(payers.is_active), help: 'Operational status', path: mdiChartTimelineVariant },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px] mb-6'>
          <RecordFieldCard
            title='Payer Context'
            description='Core payer identity and routing.'
            columns={2}
            fields={[
              { label: 'Organization', value: renderText(payers.organization?.name) },
              { label: 'Name', value: renderText(payers.name) },
              { label: 'Payer Code', value: renderText(payers.payer_code) },
              { label: 'Plan Type', value: humanized(payers.plan_type) },
              { label: 'Portal URL', value: renderText(payers.portal_url) },
              { label: 'Fax Number', value: renderText(payers.fax_number) },
            ]}
          />

          <RecordBodyCard title='Appeals Contact' description='Contact guidance used during submission and follow-up.'>
            <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
              {renderText(payers.appeals_contact, 'No appeals contact details provided.')}
            </div>
          </RecordBodyCard>
        </div>

        <RecordBodyCard title='Claims Address' description='Primary mailing address for claims or appeal correspondence.'>
          <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
            {renderText(payers.claims_address, 'No claims address provided.')}
          </div>
        </RecordBodyCard>

        <WorkspaceSidebarList
          title='Linked Cases'
          description='A short list of cases routed through this payer.'
          actionHref='/cases/cases-list'
          actionLabel='Open cases'
          items={linkedCases}
          emptyText='No cases are linked to this payer.'
        />
      </SectionMain>
    </>
  );
};

PayersView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_PAYERS'>{page}</LayoutAuthenticated>;
};

export default PayersView;
