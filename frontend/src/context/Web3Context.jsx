import { createContext, useState, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import api from '../services/api';

import '@solana/wallet-adapter-react-ui/styles.css';

export const Web3Context = createContext();

const SolanaAuthProvider = ({ children }) => {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    if (!publicKey || !signMessage) return;
    try {
      const walletAddress = publicKey.toBase58();
      const nonceResp = await api.post('/auth/nonce', { wallet_address: walletAddress });
      const message = `Sign this message to login to Astira: ${nonceResp.data.nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const bs58 = (await import('bs58')).default;
      const signatureBase58 = bs58.encode(signature);
      const verifyResp = await api.post('/auth/verify', {
        wallet_address: walletAddress,
        signature: signatureBase58,
      });
      setToken(verifyResp.data.token);
      localStorage.setItem('token', verifyResp.data.token);
      const balResp = await api.get('/wallet/balance', { headers: { 'X-User-Id': walletAddress } });
      setBalance(balResp.data.balance || 0);
    } catch (err) {
      console.error('Auth error:', err);
      disconnect();
    }
  };

  useMemo(() => {
    if (connected && publicKey) connectWallet();
  }, [connected, publicKey]);

  return (
    <Web3Context.Provider
      value={{
        account: publicKey ? publicKey.toBase58() : null,
        balance,
        token,
        connectWallet: () => {},
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3ContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <SolanaAuthProvider>{children}</SolanaAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
