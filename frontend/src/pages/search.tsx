import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { mdiChartTimelineVariant } from '@mdi/js';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import SectionMain from '../components/SectionMain';
import CardBox from '../components/CardBox';
import SearchResults from '../components/SearchResults';
import LoadingSpinner from '../components/LoadingSpinner';
import BaseButton from '../components/BaseButton';
import BaseDivider from '../components/BaseDivider';
import { useAppSelector } from '../stores/hooks';
import { humanize } from '../helpers/humanize';

type SearchRecord = Record<string, any> & {
  id: string;
  tableName: string;
  matchAttribute: string[];
};

const SearchView = () => {
  const router = useRouter();
  const queryParam = typeof router.query.query === 'string' ? router.query.query.trim() : '';
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchRecord[]>([]);
  const [error, setError] = useState('');
  const { currentUser } = useAppSelector((state) => state.auth);
  const organizationsId = currentUser?.organizations?.id;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!queryParam || queryParam.length < 2) {
        setSearchResults([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.post('/search', {
          searchQuery: queryParam,
          organizationId: organizationsId,
        });

        if (isMounted) {
          setSearchResults(response.data || []);
        }
      } catch (loadError) {
        console.error('Search request failed', loadError);

        if (isMounted) {
          setError('Search is unavailable right now.');
          setSearchResults([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [organizationsId, queryParam]);

  const groupedResults = useMemo(
    () =>
      searchResults.reduce<Record<string, SearchRecord[]>>((accumulator, item) => {
        accumulator[item.tableName] = accumulator[item.tableName] || [];
        accumulator[item.tableName].push(item);
        return accumulator;
      }, {}),
    [searchResults],
  );

  const totalMatches = searchResults.length;
  const resultGroups = Object.entries(groupedResults);

  return (
    <>
      <Head>
        <title>Search Result</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Search Workspace'
          main
        >
          {''}
        </SectionTitleLineWithButton>

        <CardBox className='mb-6'>
          <Formik
            enableReinitialize
            initialValues={{ query: queryParam }}
            onSubmit={(values, { setSubmitting }) => {
              const trimmedQuery = values.query.trim();

              if (trimmedQuery.length >= 2) {
                router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
              }

              setSubmitting(false);
            }}
          >
            <Form>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'>
                <div>
                  <label className='mb-2 block text-sm font-semibold'>Find records</label>
                  <Field
                    name='query'
                    placeholder='Search cases, tasks, notes, payers, or documents'
                    className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 dark:border-dark-700 dark:bg-dark-900'
                  />
                  <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                    Search spans every entity you can access and groups matches by record type.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <BaseButton type='submit' color='info' label='Search' />
                  <BaseButton
                    color='white'
                    label='Appeal Dashboard'
                    onClick={() => router.push('/appeal-dashboard')}
                  />
                </div>
              </div>
            </Form>
          </Formik>
        </CardBox>

        <CardBox className='mb-6'>
          {!queryParam ? (
            <div>
              <p className='text-lg font-semibold'>Start with a case number, patient name, payer, or note text.</p>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                Try terms like <span className='font-medium'>AC-2026-0003</span>,{' '}
                <span className='font-medium'>appeal ready</span>, or{' '}
                <span className='font-medium'>BlueShield</span>.
              </p>
            </div>
          ) : loading ? (
            <div className='flex min-h-[180px] items-center justify-center'>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div>
              <p className='text-lg font-semibold'>Search unavailable</p>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{error}</p>
            </div>
          ) : (
            <>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                  <p className='text-lg font-semibold'>
                    {totalMatches} match{totalMatches === 1 ? '' : 'es'} for &quot;{queryParam}&quot;
                  </p>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    Results are grouped by entity so you can jump directly into the right workflow.
                  </p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {resultGroups.map(([tableName, items]) => (
                    <span
                      key={tableName}
                      className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-dark-700 dark:text-slate-100'
                    >
                      {humanize(tableName)}: {items.length}
                    </span>
                  ))}
                </div>
              </div>
              <BaseDivider />
              <SearchResults searchResults={groupedResults} searchQuery={queryParam} />
            </>
          )}
        </CardBox>
      </SectionMain>
    </>
  );
};

SearchView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated permission='CREATE_SEARCH'>{page}</LayoutAuthenticated>;
};

export default SearchView;
