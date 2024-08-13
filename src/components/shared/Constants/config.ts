import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected, safe, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors'


export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
    coinbaseWallet(),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
  ssr: true
})

