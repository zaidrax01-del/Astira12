import { createContext, useState, useEffect, useMemo } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { SolanaMobileWalletAdapter } from '@solana/wallet-adapter-mobile'
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui'
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import api from '../services/api'
import '@solana/wallet-adapter-react-ui/styles.css'

export const Web3Context = createContext()

const TREASURY_WALLET = new PublicKey('CvsGemPPo57RZuK7KFSvxn2VJqd5xhRHYWS5apQALdfN')
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const DECIMALS_USDC = 6

const SolanaAuthProvider = ({ children }) => {
  const { publicKey, signMessage, sendTransaction, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [balance, setBalance] = useState(0)
  const [hasPremium, setHasPremium] = useState(false)
  const connection = useMemo(() => new Connection(clusterApiUrl(WalletAdapterNetwork.Mainnet)), [])

  // Real SOL balance
  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(bal => setBalance(bal / 1e9)).catch(() => {})
    }
  }, [publicKey, connection])

  // Authentication (never force disconnect)
  const authenticate = async () => {
    if (!publicKey || !signMessage) return
    try {
      const walletAddress = publicKey.toBase58()
      const nonceResp = await api.post('/auth/nonce', { wallet_address: walletAddress })
      const message = `Sign this message to login to Astira: ${nonceResp.data.nonce}`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await signMessage(encodedMessage)
      const bs58 = (await import('bs58')).default
      const signatureBase58 = bs58.encode(signature)
      const verifyResp = await api.post('/auth/verify', { wallet_address: walletAddress, signature: signatureBase58 })
      setToken(verifyResp.data.token)
      localStorage.setItem('token', verifyResp.data.token)
      const statusResp = await api.get('/auth/status', { headers: { 'X-User-Id': walletAddress } })
      setHasPremium(statusResp.data.has_premium_generation)
    } catch (err) {
      console.error('Auth error (wallet stays connected):', err)
    }
  }

  useEffect(() => {
    if (connected && publicKey) authenticate()
  }, [connected, publicKey])

  const sendSolPayment = async (amountSOL) => {
    if (!publicKey || !sendTransaction) throw new Error('Wallet not connected')
    const lamports = amountSOL * 1e9
    const transaction = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: TREASURY_WALLET, lamports })
    )
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey
    const signature = await sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'confirmed')
    return signature
  }

  const sendUsdcPayment = async (amountUSDC) => {
    if (!publicKey || !sendTransaction) throw new Error('Wallet not connected')
    const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey)
    const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, TREASURY_WALLET)
    const amount = amountUSDC * 10 ** DECIMALS_USDC
    const transaction = new Transaction().add(
      createTransferInstruction(fromTokenAccount, toTokenAccount, publicKey, amount, [], TOKEN_PROGRAM_ID)
    )
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey
    const signature = await sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'confirmed')
    return signature
  }

  const contextValue = useMemo(() => ({
    account: publicKey ? publicKey.toBase58() : null,
    balance,
    token,
    hasPremium,
    connectWallet: () => setVisible(true),
    disconnect,
    sendSolPayment,
    sendUsdcPayment,
  }), [publicKey, balance, token, hasPremium, disconnect])

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

export const Web3ContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const base = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
      new WalletConnectWalletAdapter({
        network,
        options: { projectId: '00000000000000000000000000000000' },
      }),
    ]
    if (isMobile) {
      // Mobile wallet adapter natively deep-links to wallets
      base.unshift(
        new SolanaMobileWalletAdapter({
          appIdentity: { name: 'Astira', uri: window.location.origin },
          authorizationResultCache: undefined,
          cluster: network,
        })
      )
    }
    return base
  }, [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <SolanaAuthProvider>{children}</SolanaAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
