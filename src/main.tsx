import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'

import { createWeb3Modal } from '@web3modal/wagmi/react'

import { WagmiProvider } from 'wagmi'
import {  bscTestnet} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, projectId } from './components/shared/Constants/config.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';

// 0. Setup queryClient
const queryClient = new QueryClient()




// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  defaultChain: bscTestnet,
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
        <GoogleOAuthProvider clientId=''>
          <App />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </BrowserRouter>,
)
