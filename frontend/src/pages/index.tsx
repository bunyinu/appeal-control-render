import React from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import BaseButtons from '../components/BaseButtons';
import { getPageTitle, swaggerDocsURL } from '../config';
import CardBoxComponentTitle from "../components/CardBoxComponentTitle";

export default function Starter() {
  const title = 'Appeal Control';
  const showApiDocs =
    process.env.NEXT_PUBLIC_SHOW_API_DOCS === 'true' ||
    process.env.NODE_ENV !== 'production';

  return (
    <div>
      <Head>
        <title>{getPageTitle('Appeal Control')}</title>
      </Head>

      <SectionFullScreen bg='violet'>
        <div className='flex min-h-screen w-full'>
          <div
            className='hidden md:flex w-1/3 flex-col justify-end bg-slate-900 text-white'
            style={{
              backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.88)), url('/product-hero.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className='bg-slate-950/55 p-8 backdrop-blur-sm'>
              <div className='mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em]'>
                Appeal Operations
              </div>
              <h2 className='text-3xl font-semibold leading-tight'>Built for payer denials, deadlines, and appeal execution.</h2>
              <p className='mt-4 text-sm text-slate-200'>
                Keep case queues, evidence, draft letters, and payer contacts inside a single operational workspace.
              </p>
            </div>
          </div>

          <div className='flex items-center justify-center flex-col space-y-4 w-full lg:w-full'>
            <CardBox className='w-full md:w-3/5 lg:w-2/3'>
              <CardBoxComponentTitle title="Welcome to your Appeal Control app!" />

              <div className="space-y-3">
                <p className='text-center text-gray-500'>
                  Manage appeal cases, tasks, documents, drafts, notes, and activity in one workspace.
                </p>
                <p className='text-center text-gray-500'>
                  Use the appeal dashboard for queue visibility, or open the standard admin overview for entity counts and widgets.
                </p>
              </div>

              <BaseButtons>
                <BaseButton
                  href='/login'
                  label='Login'
                  color='info'
                  className='w-full'
                />
                {showApiDocs && (
                  <BaseButton
                    href={swaggerDocsURL}
                    target='_blank'
                    label='Swagger API'
                    color='white'
                    className='w-full'
                  />
                )}
              </BaseButtons>
            </CardBox>
          </div>
        </div>
      </SectionFullScreen>
      <div className='bg-black text-white flex flex-col text-center justify-center md:flex-row'>
        <p className='py-6 text-sm'>© 2026 <span>{title}</span>. All rights reserved</p>
        <Link className='py-6 ml-4 text-sm' href='/privacy-policy/'>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

Starter.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
