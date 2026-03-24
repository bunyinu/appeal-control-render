import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import axios from 'axios';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import BaseIcon from "../components/BaseIcon";
import { mdiInformation, mdiEye, mdiEyeOff, mdiShieldCheckOutline } from '@mdi/js';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import { Field, Form, Formik } from 'formik';
import FormField from '../components/FormField';
import FormCheckRadio from '../components/FormCheckRadio';
import BaseDivider from '../components/BaseDivider';
import BaseButtons from '../components/BaseButtons';
import { useRouter } from 'next/router';
import { getPageTitle } from '../config';
import { findMe, loginUser, resetAction } from '../stores/authSlice';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import Link from 'next/link';
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const textColor = useAppSelector((state) => state.style.linkColor);
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const notify = (type, msg) => toast(msg, { type });
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser, isFetching, errorMessage, token, notify: notifyState } = useAppSelector(
    (state) => state.auth,
  );
  const [initialValues, setInitialValues] = React.useState({
    email: '',
    password: '',
    remember: true,
  });
  const showDemoAccounts =
    process.env.NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS === 'true' ||
    process.env.NODE_ENV !== 'production';
  const demoAccounts = [
    {
      label: 'Super Administrator',
      email: 'super_admin@flatlogic.com',
      password: 'fcb45e0e',
    },
    {
      label: 'Administrator',
      email: 'admin@flatlogic.com',
      password: 'fcb45e0e',
    },
    {
      label: 'Appeals Specialist',
      email: 'client@hello.com',
      password: 'd0b1868750e0',
    },
  ];
  const title = 'Appeal Control';

  useEffect(() => {
    if (token) {
      dispatch(findMe());
    }
  }, [token, dispatch]);

  useEffect(() => {
    const tokenFromQuery = router.query.token;

    if (typeof tokenFromQuery !== 'string' || !tokenFromQuery) {
      return;
    }

    localStorage.setItem('token', tokenFromQuery);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromQuery}`;
    dispatch(findMe());
    router.replace('/dashboard');
  }, [dispatch, router, router.query.token]);

  useEffect(() => {
    if (currentUser?.id) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (errorMessage) {
      notify('error', errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (notifyState?.showNotification) {
      notify('success', notifyState?.textNotification);
      dispatch(resetAction());
    }
  }, [dispatch, notifyState?.showNotification, notifyState?.textNotification]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (value) => {
    const { remember, ...rest } = value;
    await dispatch(loginUser(rest));
  };

  const setLogin = (email: string, password: string) => {
    setInitialValues(prev => ({
      ...prev,
      email,
      password,
    }));
  };

  return (
    <div>
      <Head>
        <title>{getPageTitle('Login')}</title>
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
                Denial Appeals Workspace
              </div>
              <h2 className='text-3xl font-semibold leading-tight'>Secure case operations for appeal teams.</h2>
              <p className='mt-4 text-sm text-slate-200'>
                Keep cases, tasks, documents, draft letters, and payer submission details inside one controlled workflow.
              </p>
              <div className='mt-6 flex items-center gap-3 text-sm text-slate-200'>
                <BaseIcon path={mdiShieldCheckOutline} size={20} />
                <span>Private workspace media and controlled authentication flow.</span>
              </div>
            </div>
          </div>

          <div className='flex w-full items-center justify-center flex-col space-y-4'>
            {showDemoAccounts && (
              <CardBox id="loginRoles" className='w-full md:w-3/5 lg:w-2/3'>
                <h2 className="text-4xl font-semibold my-4">{title}</h2>

                <div className='flex flex-row text-gray-500 justify-between'>
                  <div>
                    <p className='mb-3'>Choose a demo profile to autofill the sign-in form.</p>
                    {demoAccounts.map((account) => (
                      <p className='mb-2' key={account.email}>
                        <button
                          type='button'
                          className={`font-medium ${textColor}`}
                          onClick={() => setLogin(account.email, account.password)}
                        >
                          {account.label}
                        </button>{' '}
                        access
                      </p>
                    ))}
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </CardBox>
            )}

            <CardBox className='w-full md:w-3/5 lg:w-2/3'>
              {!showDemoAccounts && (
                <>
                  <h2 className="text-4xl font-semibold my-4">{title}</h2>
                  <p className='mb-6 text-sm text-gray-500'>
                    Sign in to continue to the appeal operations workspace.
                  </p>
                </>
              )}

              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => handleSubmit(values)}
              >
                <Form>
                  <FormField
                    label='Login'
                    help='Please enter your login'
                  >
                    <Field name='email' />
                  </FormField>

                  <div className='relative'>
                    <FormField
                      label='Password'
                      help='Please enter your password'
                    >
                      <Field name='password' type={showPassword ? 'text' : 'password'} />
                    </FormField>
                    <div
                      className='absolute bottom-8 right-0 pr-3 flex items-center cursor-pointer'
                      onClick={togglePasswordVisibility}
                    >
                      <BaseIcon
                        className='text-gray-500 hover:text-gray-700'
                        size={20}
                        path={showPassword ? mdiEyeOff : mdiEye}
                      />
                    </div>
                  </div>

                  <div className={'flex justify-between'}>
                    <FormCheckRadio type='checkbox' label='Remember'>
                      <Field type='checkbox' name='remember' />
                    </FormCheckRadio>

                    <Link className={`${textColor} text-blue-600`} href={'/forgot'}>
                      Forgot password?
                    </Link>
                  </div>

                  <BaseDivider />

                  <BaseButtons>
                    <BaseButton
                      className={'w-full'}
                      type='submit'
                      label={isFetching ? 'Loading...' : 'Login'}
                      color='info'
                      disabled={isFetching}
                    />
                  </BaseButtons>
                  <br />
                  <p className={'text-center'}>
                    Don’t have an account yet?{' '}
                    <Link className={`${textColor}`} href={'/register'}>
                      New Account
                    </Link>
                  </p>
                </Form>
              </Formik>
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
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
