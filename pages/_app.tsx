import { ChakraProvider, theme, useColorMode } from '@chakra-ui/react';
import { PenumbraUIProvider } from '@penumbra-zone/ui/PenumbraUIProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <PenumbraUIProvider>
          <Component {...pageProps} />
        </PenumbraUIProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
