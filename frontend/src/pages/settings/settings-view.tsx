import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiCodeJson, mdiLockOutline, mdiTextBoxOutline, mdiToggleSwitchOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/settings/settingsSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordBodyCard, RecordFieldCard, RecordHero } from '../../components/RecordView';
import { formatBoolean, humanized, renderText } from '../../helpers/recordView';

const SettingsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.settings);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!settings || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading setting details...</CardBox>
      </SectionMain>
    );
  }

  const valueTypeIcon =
    settings.value_type === 'json'
      ? mdiCodeJson
      : settings.value_type === 'boolean'
        ? mdiToggleSwitchOutline
        : mdiTextBoxOutline;

  return (
    <>
      <Head>
        <title>{getPageTitle('Setting Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Setting Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Configuration Record'
          title={settings.key || 'Setting'}
          subtitle={`${humanized(settings.value_type)} value • ${renderText(settings.organization?.name, 'Global or unassigned')}`}
          actions={[
            { href: `/settings/settings-edit/?id=${id}`, label: 'Edit Setting', color: 'info' },
            { href: '/settings/settings-list', label: 'Back to Settings' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Value Type', value: humanized(settings.value_type), help: 'Stored format', path: valueTypeIcon },
            { label: 'Sensitive', value: formatBoolean(settings.is_sensitive), help: 'Protected access', path: mdiLockOutline },
            { label: 'Organization', value: renderText(settings.organization?.name, 'Not assigned'), help: 'Owning scope', path: mdiChartTimelineVariant },
            { label: 'Key', value: renderText(settings.key), help: 'Configuration key', path: mdiTextBoxOutline },
          ]}
        />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]'>
          <RecordFieldCard
            title='Setting Context'
            description='Where this value is scoped and how it should be treated.'
            fields={[
              { label: 'Organization', value: renderText(settings.organization?.name, 'Not assigned') },
              { label: 'Key', value: renderText(settings.key) },
              { label: 'Value Type', value: humanized(settings.value_type) },
              { label: 'Sensitive', value: formatBoolean(settings.is_sensitive) },
            ]}
          />

          <RecordBodyCard title='Description' description='Human-readable note for operators.'>
            <div className='rounded border border-slate-200 px-4 py-4 text-sm dark:border-dark-700'>
              {renderText(settings.description, 'No description provided.')}
            </div>
          </RecordBodyCard>
        </div>

        <RecordBodyCard title='Value' description='Current stored configuration value.'>
          <pre className='overflow-x-auto rounded border border-slate-200 px-4 py-4 text-sm whitespace-pre-wrap dark:border-dark-700'>
            {renderText(settings.value, 'No stored value.')}
          </pre>
        </RecordBodyCard>
      </SectionMain>
    </>
  );
};

SettingsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_SETTINGS'>{page}</LayoutAuthenticated>;
};

export default SettingsView;
