import Link from 'next/link';
import BaseButton from './BaseButton';
import CardBox from './CardBox';

export type WorkspaceSidebarItem = {
  badge?: string;
  caption?: string;
  href?: string;
  id: string;
  meta?: string;
  title: string;
};

type Props = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  emptyText: string;
  items: WorkspaceSidebarItem[];
  title: string;
};

function SidebarRow({ item }: { item: WorkspaceSidebarItem }) {
  const content = (
    <div className='flex items-start justify-between gap-3 rounded border border-slate-200 px-4 py-3 dark:border-dark-700'>
      <div>
        <p className='font-semibold'>{item.title}</p>
        {item.meta && <p className='text-sm text-gray-500 dark:text-gray-400'>{item.meta}</p>}
        {item.caption && (
          <p className='mt-1 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500'>
            {item.caption}
          </p>
        )}
      </div>
      {item.badge && (
        <span className='rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-dark-700 dark:text-slate-100'>
          {item.badge}
        </span>
      )}
    </div>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link href={item.href} className='block'>
      {content}
    </Link>
  );
}

export default function WorkspaceSidebarList({
  actionHref,
  actionLabel,
  description,
  emptyText,
  items,
  title,
}: Props) {
  return (
    <CardBox>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-lg font-semibold'>{title}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
        </div>
        {actionHref && actionLabel && <BaseButton href={actionHref} color='white' small label={actionLabel} />}
      </div>
      <div className='space-y-3'>
        {items.length ? (
          items.map((item) => (
            <div key={item.id}>
              <SidebarRow item={item} />
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400'>{emptyText}</p>
        )}
      </div>
    </CardBox>
  );
}
