import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { mdiChartTimelineVariant, mdiEyeOutline, mdiKeyVariant, mdiPencilOutline, mdiPlusBoxOutline } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { fetch } from '../../stores/permissions/permissionsSlice';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import WorkspaceSummaryCards from '../../components/WorkspaceSummaryCards';
import { RecordFieldCard, RecordHero } from '../../components/RecordView';
import { renderText } from '../../helpers/recordView';

const PermissionsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { permissions, loading } = useAppSelector((state) => state.permissions);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      dispatch(fetch({ id }));
    }
  }, [dispatch, id]);

  if (!permissions || loading) {
    return (
      <SectionMain>
        <CardBox className='p-6 text-sm text-gray-500 dark:text-gray-400'>Loading permission details...</CardBox>
      </SectionMain>
    );
  }

  const [verb = 'access', ...rest] = (permissions.name || '').split('_');
  const scope = rest.join('_') || 'general';

  const verbIcon =
    verb === 'READ'
      ? mdiEyeOutline
      : verb === 'CREATE'
        ? mdiPlusBoxOutline
        : verb === 'UPDATE'
          ? mdiPencilOutline
          : mdiKeyVariant;

  return (
    <>
      <Head>
        <title>{getPageTitle('Permission Details')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title='Permission Details' main>
          {''}
        </SectionTitleLineWithButton>

        <RecordHero
          eyebrow='Permission Record'
          title={permissions.name || 'Permission'}
          subtitle='Access catalog entry used by roles and users.'
          actions={[
            { href: `/permissions/permissions-edit/?id=${id}`, label: 'Edit Permission', color: 'info' },
            { href: '/permissions/permissions-list', label: 'Back to Permissions' },
          ]}
        />

        <WorkspaceSummaryCards
          items={[
            { label: 'Permission', value: permissions.name || 'Not available', help: 'Stored catalog key', path: mdiKeyVariant },
            { label: 'Verb', value: verb || 'Not available', help: 'Action family', path: verbIcon },
            { label: 'Scope', value: scope || 'Not available', help: 'Entity coverage', path: mdiChartTimelineVariant },
            { label: 'Usage', value: 'Role Based', help: 'Assigned through roles or overrides', path: mdiKeyVariant },
          ]}
        />

        <RecordFieldCard
          title='Permission Breakdown'
          description='How this permission is structured in the access catalog.'
          columns={2}
          fields={[
            { label: 'Full Name', value: renderText(permissions.name) },
            { label: 'Action Verb', value: verb || 'Not available' },
            { label: 'Scope', value: scope || 'Not available' },
            { label: 'Record Id', value: renderText(permissions.id) },
          ]}
        />
      </SectionMain>
    </>
  );
};

PermissionsView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='READ_PERMISSIONS'>{page}</LayoutAuthenticated>;
};

export default PermissionsView;
