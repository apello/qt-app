import type { AppProps } from 'next/app'
import '../styles/global.css';
import { CssBaseline, CssVarsProvider } from '@mui/joy';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <CssVarsProvider>
          <CssBaseline  />
          <Component {...pageProps} />
      </CssVarsProvider>
  ); 
}