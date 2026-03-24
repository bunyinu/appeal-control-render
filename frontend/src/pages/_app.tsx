import React from 'react';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { store } from '../stores/store';
import { Provider } from 'react-redux';
import '../css/main.css';
import axios from 'axios';
import { baseURLApi } from '../config';
import { useRouter } from 'next/router';
import ErrorBoundary from "../components/ErrorBoundary";
import { installProductionConsoleGuards } from '../helpers/quietConsole';
import 'intro.js/introjs.css';
import { appWithTranslation } from 'next-i18next';
import '../i18n';
import IntroGuide from '../components/IntroGuide';
import { appSteps,  loginSteps, usersSteps, rolesSteps } from '../stores/introSteps';
import { useAppDispatch } from '../stores/hooks';
import { setDarkMode } from '../stores/styleSlice';

// Initialize axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACK_API
    ? process.env.NEXT_PUBLIC_BACK_API
    : baseURLApi;

axios.defaults.headers.common['Content-Type'] = 'application/json';
installProductionConsoleGuards();

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stepsEnabled, setStepsEnabled] = React.useState(false);
  const [stepName, setStepName] = React.useState('');
  const [steps, setSteps] = React.useState([]);

    axios.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // TODO: Remove this code in future releases
    React.useEffect(() => {
        const allowedOrigin = (() => {
            if (!document.referrer) {
                return null;
            }
            try {
                return new URL(document.referrer).origin;
            } catch (error) {
                console.warn('[postMessage] Failed to parse parent origin from referrer', error);
                return null;
            }
        })();

	        const handleMessage = async (event: MessageEvent) => {
            const sourceWindow = event.source as Window | null;

            if (event.data === 'getLocation') {
	                sourceWindow?.postMessage(
	                    { iframeLocation: window.location.pathname },
	                    event.origin,
	                );
                return;
            }

            if (event.data === 'getAuthToken') {
                if (allowedOrigin && event.origin !== allowedOrigin) {
                    console.warn('[postMessage] Blocked getAuthToken from origin', event.origin);
                    return;
	                }
	                const token = localStorage.getItem('token');
	                const user = localStorage.getItem('user');
	                sourceWindow?.postMessage(
	                    { iframeAuthToken: token, iframeAuthUser: user },
	                    event.origin,
	                );
                return;
            }

            if (event.data === 'getScreenshot') {
	                try {
	                    const html2canvas = (await import('html2canvas')).default;
	                    const canvas = await html2canvas(document.body, { useCORS: true });
	                    const url = canvas.toDataURL('image/jpeg', 0.8);
	                    sourceWindow?.postMessage({ iframeScreenshot: url }, event.origin);
	                } catch (e) {
	                    console.error('html2canvas failed', e);
	                    sourceWindow?.postMessage({ iframeScreenshot: null }, event.origin);
	                }
	            }
	        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

  React.useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode === '1';

    dispatch(setDarkMode(isDarkMode));
  }, [dispatch]);

  React.useEffect(() => {
    // Tour is disabled by default in generated projects.
    return;
    const isCompleted = (stepKey: string) => {
      return localStorage.getItem(`completed_${stepKey}`) === 'true';
    };
     if (router.pathname === '/login' && !isCompleted('loginSteps')) {
      setSteps(loginSteps);
      setStepName('loginSteps');
      setStepsEnabled(true); 
    }else if (router.pathname === '/dashboard' && !isCompleted('appSteps')) {
      setTimeout(() => {
        setSteps(appSteps);
        setStepName('appSteps');
        setStepsEnabled(true); 
      }, 1000);
    } else if (router.pathname === '/users/users-list' && !isCompleted('usersSteps')) {
      setTimeout(() => {
        setSteps(usersSteps);
        setStepName('usersSteps');
        setStepsEnabled(true); 
      }, 1000);
    } else if (router.pathname === '/roles/roles-list' && !isCompleted('rolesSteps')) {
      setTimeout(() => {
        setSteps(rolesSteps);
        setStepName('rolesSteps');
        setStepsEnabled(true); 
      }, 1000);
    } else {
      setSteps([]);
      setStepsEnabled(false); 
    }
  }, [router.pathname]);

  const handleExit = () => {
    setStepsEnabled(false);
  };

  const title = 'Appeal Control'
  const description = "Multi-tenant SaaS to manage radiation oncology denial appeals with cases, tasks, documents, drafts, and analytics."
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4003/'
  const image = `${url.replace(/\/$/, '')}/product-hero.svg`
  const imageWidth = '1200'
  const imageHeight = '1600'

  return (
    <>
      {getLayout(
        <>
          <Head>
            <meta name="description" content={description} />

            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={title} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content={imageWidth} />
            <meta property="og:image:height" content={imageHeight} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image:src" content={image} />
            <meta property="twitter:image:width" content={imageWidth} />
            <meta property="twitter:image:height" content={imageHeight} />

            <link rel="icon" href="/favicon.svg" />
          </Head>

          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <IntroGuide
            steps={steps}
            stepsName={stepName}
            stepsEnabled={stepsEnabled}
            onExit={handleExit}
          />
        </>
      )}
    </>
  )
}

function AppWithProviders(props: AppPropsWithLayout) {
  return (
    <Provider store={store} children={<MyApp {...props} />} />
  );
}

export default appWithTranslation(AppWithProviders);
