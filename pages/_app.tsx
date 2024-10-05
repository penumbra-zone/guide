import type {AppProps} from 'next/app'
import {PenumbraUIProvider} from '@penumbra-zone/ui/PenumbraUIProvider';
import {ChakraProvider, useColorMode, theme} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";

const queryClient = new QueryClient();
export default function App({Component, pageProps}: AppProps) {

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
