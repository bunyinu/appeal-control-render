import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TablePayers from '../../components/Payers/TablePayers';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { humanize } from '../../helpers/humanize';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/payers/payersSlice';

type PayersWorkspaceSummary = {
  activePayers: number;
  faxSubmission: number;
  portalSubmission: number;
  totalPayers: number;
};

const PayersTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<PayersWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { payers } = useAppSelector((state) => state.payers);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'Name', title: 'name' },
    { label: 'Payer Code', title: 'payer_code' },
    { label: 'Plan Type', title: 'plan_type' },
    { label: 'Claims Address', title: 'claims_address' },
    { label: 'Fax Number', title: 'fax_number' },
    { label: 'Portal URL', title: 'portal_url' },
    { label: 'Appeals Submission Method', title: 'appeals_submission_method' },
    { label: 'Appeals Contact', title: 'appeals_contact' },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_PAYERS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/payers/count'),
      fetchCount('/payers/count', { is_active: 'true' }),
      fetchCount('/payers/count', { appeals_submission_method: 'portal' }),
      fetchCount('/payers/count', { appeals_submission_method: 'fax' }),
    ])
      .then(([totalPayers, activePayers, portalSubmission, faxSubmission]) =>
        setWorkspaceSummary({ totalPayers, activePayers, portalSubmission, faxSubmission }),
      )
      .catch((error) => {
        console.error('Unable to load payers summary', error);
        setWorkspaceSummary(null);
      });
  }, [currentUser]);

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: filters[0].title,
      },
    };

    setFilterItems([...filterItems, newItem]);
  };

  const getPayersCSV = async () => {
    const response = await axios({ url: '/payers?filetype=csv', method: 'GET', responseType: 'blob' });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'payersCSV.csv';
    link.click();
  };

  const onModalConfirm = async () => {
    if (!csvFile) return;
    await dispatch(uploadCsv(csvFile));
    dispatch(setRefetch(true));
    setCsvFile(null);
    setIsModalActive(false);
  };

  const onModalCancel = () => {
    setCsvFile(null);
    setIsModalActive(false);
  };

  const payerItems = (payers || []).slice(0, 5).map((payer) => ({
    id: payer.id,
    title: payer?.name || 'Untitled payer',
    meta: payer?.organization?.label || payer?.payer_code || 'No linked organization',
    caption: `${humanize(payer?.plan_type || 'unspecified')} plan • ${humanize(
      payer?.appeals_submission_method || 'manual',
    )}`,
    badge: payer?.is_active ? 'Active' : 'Review',
    href: `/payers/payers-view?id=${payer.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Payers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Payers' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Payer network workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Keep payer records organized, monitor submission methods, and move between case and organization context without leaving the network view.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && <BaseButton href='/payers/payers-new' color='info' label='New Payer' />}
              <BaseButton href='/cases/cases-list' color='white' label='Cases' />
              <BaseButton href='/organizations/organizations-list' color='white' label='Organizations' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Payers',
                value: workspaceSummary.totalPayers,
                help: 'Managed payer records',
                path: icon.mdiOfficeBuildingOutline,
              },
              {
                label: 'Active',
                value: workspaceSummary.activePayers,
                help: 'Operational payer entries',
                path: icon.mdiCheckCircleOutline,
              },
              {
                label: 'Portal Routing',
                value: workspaceSummary.portalSubmission,
                help: 'Portal-based submissions',
                path: icon.mdiMonitorArrowDownVariant,
              },
              {
                label: 'Fax Routing',
                value: workspaceSummary.faxSubmission,
                help: 'Fax-based submissions',
                path: icon.mdiFax,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getPayersCSV} />
          {hasCreatePermission && (
            <BaseButton color='info' label='Upload CSV' onClick={() => setIsModalActive(true)} />
          )}
          <div className='md:inline-flex items-center ms-auto'>
            <div id='delete-rows-button'></div>
          </div>
        </CardBox>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <CardBox>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>Payer Directory</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Search payer records, update routing details, and keep submission operations consistent.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalPayers || 0} payer records
              </span>
            </div>
            <TablePayers
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Payer Routing'
            description='Currently loaded payer records and the way appeals move through each channel.'
            actionHref='/cases/cases-list'
            actionLabel='Open cases'
            items={payerItems}
            emptyText='No payers are loaded yet.'
          />
        </div>
      </SectionMain>
      <CardBoxModal
        title='Upload CSV'
        buttonColor='info'
        buttonLabel='Confirm'
        isActive={isModalActive}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      >
        <DragDropFilePicker file={csvFile} setFile={setCsvFile} formats='.csv' />
      </CardBoxModal>
    </>
  );
};

PayersTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_PAYERS'>{page}</LayoutAuthenticated>;
};

export default PayersTablesPage;
