import React from 'react';
import BaseButton from './BaseButton';
import CardBox from './CardBox';

export type RecordMetric = {
  help: string;
  label: string;
  value: React.ReactNode;
};

export type RecordField = {
  label: string;
  value: React.ReactNode;
};

type HeroAction = {
  color?: string;
  href?: string;
  label: string;
  onClick?: () => void;
  outline?: boolean;
};

type HeroProps = {
  actions?: HeroAction[];
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

type FieldCardProps = {
  columns?: 1 | 2;
  description?: string;
  fields: RecordField[];
  title: string;
};

type BodyCardProps = {
  children?: React.ReactNode;
  description?: string;
  title: string;
};

export function RecordHero({ actions = [], eyebrow, subtitle, title }: HeroProps) {
  return (
    <CardBox className='mb-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          {eyebrow && (
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500'>
              {eyebrow}
            </p>
          )}
          <p className='text-2xl font-semibold'>{title}</p>
          {subtitle && <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>}
        </div>
        {!!actions.length && (
          <div className='flex flex-wrap gap-3'>
            {actions.map((action) => (
              <span key={action.label}>
                <BaseButton
                  color={action.color || 'white'}
                  href={action.href}
                  label={action.label}
                  onClick={action.onClick}
                  outline={action.outline}
                />
              </span>
            ))}
          </div>
        )}
      </div>
    </CardBox>
  );
}

export function RecordMetrics({ items }: { items: RecordMetric[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4'>
      {items.map((item) => (
        <CardBox key={item.label}>
          <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>{item.label}</div>
          <div className='mt-2 text-2xl font-semibold'>{item.value}</div>
          <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{item.help}</div>
        </CardBox>
      ))}
    </div>
  );
}

export function RecordFieldCard({ columns = 1, description, fields, title }: FieldCardProps) {
  return (
    <CardBox>
      <div className='mb-4'>
        <p className='text-lg font-semibold'>{title}</p>
        {description && <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>}
      </div>
      <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {fields.map((field) => (
          <div key={field.label} className='rounded border border-slate-200 px-4 py-3 dark:border-dark-700'>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500'>
              {field.label}
            </p>
            <div className='mt-2 text-sm'>{field.value}</div>
          </div>
        ))}
      </div>
    </CardBox>
  );
}

export function RecordBodyCard({ children, description, title }: BodyCardProps) {
  return (
    <CardBox>
      <div className='mb-4'>
        <p className='text-lg font-semibold'>{title}</p>
        {description && <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>}
      </div>
      {children}
    </CardBox>
  );
}
