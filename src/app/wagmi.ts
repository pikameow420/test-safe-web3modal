import { http, createConfig } from "wagmi";
import { arbitrum, mainnet, sepolia} from "wagmi/chains";
import { injected, safe, walletConnect } from "wagmi/connectors";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

export const metadata = {
  name: 'Safe Connector Test',
  description: 'Safe Connector Test',
  url: 'https://test-safe-web3modal.vercel.app', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Enable the Domains using the allowedDomains prop in the safe connector

export const config = createConfig({
  chains: [sepolia, arbitrum, mainnet ],
  transports: {
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http()
  },
  connectors: [
    safe({
      allowedDomains: [/app\.safe\.global$/, /coinshift\.global$/],
      shimDisconnect: true,
    }),
    injected(),
    walletConnect({ projectId: projectId!, metadata, showQrModal: false }), // showQrModal must be false.
  ],
});

