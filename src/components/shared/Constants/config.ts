import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const projectId = '<1e05e85ce4aaa22f7c5a8a10b76118c1>'

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [bscTestnet.id]: http('https://bsc-testnet-rpc.publicnode.com	'),
  },
})