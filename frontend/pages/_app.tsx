import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { enableMapSet } from 'immer';
import { SessionProvider } from 'next-auth/react';
enableMapSet();


export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
  );
}
