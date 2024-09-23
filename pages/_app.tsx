import type { AppProps } from 'next/app'
import { PenumbraUIProvider } from '@penumbra-zone/ui/PenumbraUIProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PenumbraUIProvider>
      <Component {...pageProps} />
    </PenumbraUIProvider>
  );
}
