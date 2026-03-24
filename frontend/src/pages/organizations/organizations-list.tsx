import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TableOrganizations from '../../components/Organizations/TableOrganizations';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import WorkspaceSidebarList from '../../components/WorkspaceSidebarList';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { getPageTitle } from '../../config';
import { fetchCount } from '../../helpers/workspace';
import { hasPermission } from '../../helpers/userPermissions';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { setRefetch, uploadCsv } from '../../stores/organizations/organizationsSlice';

type OrganizationsWorkspaceSummary = {
  cases: number;
  payers: number;
  totalOrganizations: number;
  users: number;
};

const OrganizationsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<OrganizationsWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { organizations } = useAppSelector((state) => state.organizations);
  const dispatch = useAppDispatch();

  const [filters] = useState([{ label: 'Name', title: 'name' }]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_ORGANIZATIONS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/organizations/count'),
      fetchCount('/users/count'),
      fetchCount('/cases/count'),
      fetchCount('/payers/count'),
    ])
      .then(([totalOrganizations, users, cases, payers]) =>
        setWorkspaceSummary({ totalOrganizations, users, cases, payers }),
      )
      .catch((error) => {
        console.error('Unable to load organizations summary', error);
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

  const getOrganizationsCSV = async () => {
    const response = await axios({
      url: '/organizations?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'organizationsCSV.csv';
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

  const directoryItems = (organizations || []).slice(0, 5).map((organization) => ({
    id: organization.id,
    title: organization?.name || 'Untitled organization',
    meta: 'Operational organization record',
    caption: 'Linked into case, payer, and user workflows',
    href: `/organizations/organizations-view?id=${organization.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Organizations')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Organizations' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Organization operations workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Keep the organization directory aligned with cases, users, and payer records across the workspace.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && (
                <BaseButton href='/organizations/organizations-new' color='info' label='New Organization' />
              )}
              <BaseButton href='/cases/cases-list' color='white' label='Cases' />
              <BaseButton href='/payers/payers-list' color='white' label='Payers' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Organizations',
                value: workspaceSummary.totalOrganizations,
                help: 'Operational entities in workspace',
                path: icon.mdiDomain,
              },
              {
                label: 'Users',
                value: workspaceSummary.users,
                help: 'Accounts assigned across orgs',
                path: icon.mdiAccountGroup,
              },
              {
                label: 'Cases',
                value: workspaceSummary.cases,
                help: 'Cases linked to organizations',
                path: icon.mdiBriefcaseAccountOutline,
              },
              {
                label: 'Payers',
                value: workspaceSummary.payers,
                help: 'Payer records tied to operations',
                path: icon.mdiOfficeBuildingOutline,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getOrganizationsCSV} />
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
                <p className='text-lg font-semibold'>Organization Directory</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Review the organization list and keep operational records consistent across the platform.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalOrganizations || 0} active organizations
              </span>
            </div>
            <TableOrganizations
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Network Snapshot'
            description='Currently loaded organizations and their role in the operational network.'
            actionHref='/payers/payers-list'
            actionLabel='Open payers'
            items={directoryItems}
            emptyText='No organizations are loaded yet.'
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

OrganizationsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_ORGANIZATIONS'>{page}</LayoutAuthenticated>;
};

export default OrganizationsTablesPage;
