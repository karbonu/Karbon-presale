import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import {  mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Your WalletConnect Cloud project ID
const projectId = '1e05e85ce4aaa22f7c5a8a10b76118c1'

// 2. Create wagmiConfig
const metadata = {
  name: 'Karbon Sale',
  description: 'Buy Karbon',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet] as const
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  defaultChain: mainnet,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  allowUnsupportedChain: false,
  enableOnramp: true,
  themeVariables: {
    '--w3m-accent': '#08E04A',
  }
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </WagmiProvider>
  </BrowserRouter>,
)
