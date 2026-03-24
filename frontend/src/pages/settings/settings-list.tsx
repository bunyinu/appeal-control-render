import * as icon from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import axios from 'axios';
import BaseButton from '../../components/BaseButton';
import CardBox from '../../components/CardBox';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import TableSettings from '../../components/Settings/TableSettings';
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
import { setRefetch, uploadCsv } from '../../stores/settings/settingsSlice';

type SettingsWorkspaceSummary = {
  booleanValues: number;
  jsonValues: number;
  sensitiveValues: number;
  totalSettings: number;
};

function shorten(value?: string | null) {
  if (!value) {
    return 'No description';
  }

  return value.length > 60 ? `${value.slice(0, 57)}...` : value;
}

const SettingsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [workspaceSummary, setWorkspaceSummary] = React.useState<SettingsWorkspaceSummary | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'Key', title: 'key' },
    { label: 'Value', title: 'value' },
    { label: 'Description', title: 'description' },
    {
      label: 'Value Type',
      title: 'value_type',
      type: 'enum',
      options: ['string', 'number', 'boolean', 'json'],
    },
  ]);

  const hasCreatePermission = currentUser && hasPermission(currentUser, 'CREATE_SETTINGS');

  React.useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      fetchCount('/settings/count'),
      fetchCount('/settings/count', { is_sensitive: 'true' }),
      fetchCount('/settings/count', { value_type: 'json' }),
      fetchCount('/settings/count', { value_type: 'boolean' }),
    ])
      .then(([totalSettings, sensitiveValues, jsonValues, booleanValues]) =>
        setWorkspaceSummary({ totalSettings, sensitiveValues, jsonValues, booleanValues }),
      )
      .catch((error) => {
        console.error('Unable to load settings summary', error);
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

  const getSettingsCSV = async () => {
    const response = await axios({ url: '/settings?filetype=csv', method: 'GET', responseType: 'blob' });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'settingsCSV.csv';
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

  const settingItems = (settings || []).slice(0, 5).map((setting) => ({
    id: setting.id,
    title: setting?.key || 'Unnamed setting',
    meta: `${humanize(setting?.value_type || 'string')} value`,
    caption: shorten(setting?.description),
    badge: setting?.is_sensitive ? 'Sensitive' : 'Standard',
    href: `/settings/settings-view?id=${setting.id}`,
  }));

  return (
    <>
      <Head>
        <title>{getPageTitle('Settings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={icon.mdiChartTimelineVariant} title='Settings' main>
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-lg font-semibold'>Configuration workspace</p>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Review application configuration, keep sensitive settings visible to operators, and maintain deployment-level values in a cleaner interface.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hasCreatePermission && (
                <BaseButton href='/settings/settings-new' color='info' label='New Setting' />
              )}
              <BaseButton href='/organizations/organizations-list' color='white' label='Organizations' />
              <BaseButton href='/users/users-list' color='white' label='Users' />
            </div>
          </div>
        </CardBox>

        {workspaceSummary && (
          <WorkspaceSummaryCards
            items={[
              {
                label: 'Settings',
                value: workspaceSummary.totalSettings,
                help: 'Configuration records in workspace',
                path: icon.mdiTuneVariant,
              },
              {
                label: 'Sensitive',
                value: workspaceSummary.sensitiveValues,
                help: 'Protected configuration values',
                path: icon.mdiShieldLockOutline,
              },
              {
                label: 'JSON Values',
                value: workspaceSummary.jsonValues,
                help: 'Structured configuration entries',
                path: icon.mdiCodeJson,
              },
              {
                label: 'Boolean Values',
                value: workspaceSummary.booleanValues,
                help: 'Feature toggles and switches',
                path: icon.mdiToggleSwitchOutline,
              },
            ]}
          />
        )}

        <CardBox className='mb-6' cardBoxClassName='flex flex-wrap'>
          <BaseButton className='mr-3' color='info' label='Filter' onClick={addFilter} />
          <BaseButton className='mr-3' color='info' label='Download CSV' onClick={getSettingsCSV} />
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
                <p className='text-lg font-semibold'>Configuration List</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Search settings, keep value types clear, and review the most important configuration records in one place.
                </p>
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {workspaceSummary?.totalSettings || 0} configuration records
              </span>
            </div>
            <TableSettings
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              filters={filters}
              showGrid={false}
            />
          </CardBox>

          <WorkspaceSidebarList
            title='Configuration Snapshot'
            description='Currently loaded configuration records and the kinds of values they hold.'
            actionHref='/organizations/organizations-list'
            actionLabel='Open organizations'
            items={settingItems}
            emptyText='No settings are loaded yet.'
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

SettingsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_SETTINGS'>{page}</LayoutAuthenticated>;
};

export default SettingsTablesPage;
