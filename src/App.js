import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MainPage from './MainPage';
import CodingPage from './CodingPage';
import MePage from './MePage';
import ProducingPage from './ProducingPage';
import NFTPage from './NFTPage';

// 配置兩個鏈，但目前只啟用 Sepolia
const { chains, publicClient } = configureChains(
  [
    sepolia,
    // mainnet, // 正式環境時取消註解
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'KXX Music NFT',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/coding" element={<CodingPage />} />
              <Route path="/me" element={<MePage />} />
              <Route path="/producing" element={<ProducingPage />} />
              <Route path="/nft" element={<NFTPage />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
