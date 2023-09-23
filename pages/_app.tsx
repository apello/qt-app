import type { AppProps } from 'next/app'
import '../styles/global.css';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <CssVarsProvider>
          <Head>
            <title>QT App</title>
          </Head>
          <CssBaseline  />
          <Component {...pageProps} />
      </CssVarsProvider>
  ); 
}