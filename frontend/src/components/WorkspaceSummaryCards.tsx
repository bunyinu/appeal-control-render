import React from 'react';
import BaseIcon from './BaseIcon';
import CardBox from './CardBox';

export type WorkspaceSummaryItem = {
  help: string;
  label: string;
  path: string;
  value: React.ReactNode;
};

type Props = {
  items: WorkspaceSummaryItem[];
};

export default function WorkspaceSummaryCards({ items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4'>
      {items.map((item) => (
        <CardBox key={item.label}>
          <div className='flex justify-between align-center'>
            <div>
              <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                {item.label}
              </div>
              <div className='text-3xl leading-tight font-semibold'>{item.value}</div>
              <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{item.help}</div>
            </div>
            <div>
              <BaseIcon w='w-14' h='h-14' size={40} path={item.path} />
            </div>
          </div>
        </CardBox>
      ))}
    </div>
  );
}
