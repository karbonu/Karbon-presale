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


const queryClient = new QueryClient()




createWeb3Modal({
  wagmiConfig: config,
  defaultChain: bscTestnet,
  projectId,
  enableAnalytics: true, 
  allowUnsupportedChain: false,
  enableOnramp: true,
  themeVariables: {
    '--w3m-accent': '#08E04A',
  }
})



let client = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'default_client_id'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={client}>
          <App />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </BrowserRouter>
);

