// ** Web3 Imports
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { bsc, bscTestnet, sepolia } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ENV } from "src/configs/env";

const projectId = process.env.NEXT_PUBLIC_WEB3_PROJECT_ID;
if (!projectId) {
  throw new Error(
    "Error: NEXT_PUBLIC_WEB3_PROJECT_ID is not defined. Please set it in your .env file."
  );
}

// WalletConnect metadata — must match the deployed origin exactly
const appOrigin =
  (ENV.frontendBaseUrl || "").replace(/\/$/, "") ||
  "https://bwscan.io";

const metadata = {
  name: "BIGWHALE Platform",
  description: "World's Largest Crypto Earning Platform",
  url: appOrigin,
  // pre-loader-new.png is the BIGWHALE logo shown on login/signup — use it here
  // so WalletConnect displays the correct branding on the connection screen.
  icons: [`${appOrigin}/images/pages/pre-loader-new.png`],
};

const walletConnectWalletIds = (ENV?.wallets || []).filter(Boolean);

// ── Active chain ──────────────────────────────────────────────────────────────
const activeChains = [];
if (ENV.chainId === 56) activeChains.push(bsc);
else if (ENV.chainId === 97) activeChains.push(bscTestnet);
else if (ENV.chainId === 11155111) activeChains.push(sepolia);
else {
  console.warn(`Unsupported chainId: ${ENV.chainId}. Defaulting to BSC Mainnet.`);
  activeChains.push(bsc);
}

// ── RPC providers ─────────────────────────────────────────────────────────────
const bscRpcUrl = "https://bnb-mainnet.g.alchemy.com/v2/nLkxIReAcZZLSpK7jLtmd";
// ⚠️ Was incorrectly pointing to bnb-mainnet — contracts on testnet were not found,
// causing simulateContract to return "0x" (no data) for every call.
const bscTestnetRpcUrl = "https://bnb-testnet.g.alchemy.com/v2/t2m-k706O1_CKUrV_fIYVVYYdew4oZrx";
const sepoliaRpcUrl = "https://eth-sepolia.g.alchemy.com/v2/gbnhSoSy4pQ2eiWkI2KQoAxiFgAQWVf9";

const rpcProviders = [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === bsc.id && bscRpcUrl) return { http: bscRpcUrl };
      if (chain.id === bscTestnet.id && bscTestnetRpcUrl) return { http: bscTestnetRpcUrl };
      if (chain.id === sepolia.id && sepoliaRpcUrl) return { http: sepoliaRpcUrl };
      return null;
    },
  }),
  walletConnectProvider({ projectId }),
  publicProvider(),
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  activeChains,
  rpcProviders
);

// ── wagmi config ──────────────────────────────────────────────────────────────
//
// KEY FIX: shimDisconnect: false on InjectedConnector
//
// shimDisconnect: true writes a "wagmi.disconnected" flag to localStorage when
// the user disconnects. On MetaMask mobile's in-app browser, this flag persists
// across page reloads (triggered by transaction confirmations), causing wagmi to
// skip autoConnect and show the wallet as disconnected.
//
// Setting shimDisconnect: false means wagmi always attempts autoConnect on mount,
// which is the correct behaviour for MetaMask mobile where the provider is always
// injected and the connection should survive page reloads.
//
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: false,
        metadata,
        // Persist WalletConnect session in localStorage so it survives page reloads
        storageOptions: {
          storage: typeof window !== "undefined" ? window.localStorage : undefined,
        },
      },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        // shimDisconnect: false — do NOT write a disconnected flag to localStorage.
        // MetaMask mobile reloads the page after every tx confirmation; with
        // shimDisconnect: true the app incorrectly treats the reload as a manual
        // disconnect and forces the user to reconnect manually.
        shimDisconnect: false,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  ...(walletConnectWalletIds.length > 0
    ? { includeWalletIds: walletConnectWalletIds }
    : {}),
});

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
