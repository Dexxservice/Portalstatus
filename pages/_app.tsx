import type { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.css';



export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main style={{padding: 16}}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
