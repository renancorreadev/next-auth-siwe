import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai, goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { SessionProvider } from 'next-auth/react';

import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';

const { chains, provider, webSocketProvider } = configureChains(
  [
   goerli,
    mainnet,
    polygon,
    polygonMumbai,
  ],
  [
    alchemyProvider({ apiKey: "U-i5eSiiq8Y_RdbUe2sebmp2svtm0wDo" }),
    infuraProvider({apiKey: "e871044ecff627703c271dc6ee41ba40"}),
    publicProvider()
  ]
);

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const { connectors } = getDefaultWallets({
  appName: 'OmnesBlockchain App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to the RainbowKit + SIWE example app',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    //@ts-ignore
    <SessionProvider refetchInterval={0} session={pageProps.session}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}
