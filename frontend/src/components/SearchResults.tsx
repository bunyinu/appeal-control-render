import React from 'react';
import Link from 'next/link';
import CardBox from './CardBox';
import { humanize } from '../helpers/humanize';

type SearchRecord = Record<string, any> & {
  id: string;
  tableName: string;
  matchAttribute: string[];
};

type Props = {
  searchResults: Record<string, SearchRecord[]>;
  searchQuery: string;
};

const hiddenKeys = new Set(['tableName', 'id', 'matchAttribute']);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(value: string, searchQuery: string) {
  if (!searchQuery) {
    return value;
  }

  const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'ig');
  const parts = value.split(regex);
  const normalizedQuery = searchQuery.toLowerCase();

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery ? (
      <mark key={`${part}-${index}`} className='rounded bg-amber-100 px-1 text-amber-900'>
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function recordHref(tableName: string, id: string) {
  return `/${tableName}/${tableName}-view?id=${id}`;
}

function getRenderableFields(item: SearchRecord) {
  return Object.keys(item)
    .filter((key) => !hiddenKeys.has(key) && item[key] !== null && item[key] !== undefined && item[key] !== '')
    .map((key) => ({
      key,
      value: Array.isArray(item[key]) ? item[key].join(', ') : String(item[key]),
    }));
}

function getPrimaryField(item: SearchRecord) {
  const renderableFields = getRenderableFields(item);
  const preferredKey = item.matchAttribute?.find((fieldName) =>
    renderableFields.some((field) => field.key === fieldName),
  );

  if (preferredKey) {
    return renderableFields.find((field) => field.key === preferredKey) || renderableFields[0];
  }

  return renderableFields[0];
}

export default function SearchResults({ searchResults, searchQuery }: Props) {
  const tableNames = Object.keys(searchResults);

  if (!tableNames.length) {
    return <div className='py-4 text-sm text-gray-500 dark:text-gray-400'>No matches found.</div>;
  }

  return (
    <div className='space-y-6'>
      {tableNames.map((tableName) => {
        const groupResults = searchResults[tableName];

        return (
          <CardBox key={tableName}>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-lg font-semibold'>{humanize(tableName)}</p>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  {groupResults.length} match{groupResults.length === 1 ? '' : 'es'}
                </p>
              </div>
              <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-dark-700 dark:text-slate-100'>
                {humanize(tableName)}
              </span>
            </div>

            <div className='mt-5 space-y-3'>
              {groupResults.map((item) => {
                const primaryField = getPrimaryField(item);
                const details = getRenderableFields(item)
                  .filter((field) => field.key !== primaryField?.key)
                  .slice(0, 3);

                return (
                  <Link
                    key={item.id}
                    href={recordHref(tableName, item.id)}
                    className='block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-400 dark:border-dark-700 dark:hover:border-slate-500'
                  >
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400'>
                          {primaryField ? humanize(primaryField.key) : humanize(tableName)}
                        </p>
                        <p className='mt-2 break-words text-base font-semibold leading-6'>
                          {primaryField
                            ? highlightMatch(primaryField.value, searchQuery)
                            : `${humanize(tableName)} record`}
                        </p>
                        {details.length > 0 && (
                          <div className='mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                            {details.map((field) => (
                              <div key={field.key}>
                                <span className='font-medium'>{humanize(field.key)}:</span>{' '}
                                {highlightMatch(field.value, searchQuery)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {item.matchAttribute?.length > 0 && (
                        <div className='flex flex-wrap gap-2 lg:max-w-[220px] lg:justify-end'>
                          {item.matchAttribute.slice(0, 3).map((attribute) => (
                            <span
                              key={attribute}
                              className='inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700'
                            >
                              {humanize(attribute)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardBox>
        );
      })}
    </div>
  );
}
