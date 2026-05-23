import { createContext, useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import api from '../services/api'

export const Web3Context = createContext()

const TREASURY_WALLET = new PublicKey('CvsGemPPo57RZuK7KFSvxn2VJqd5xhRHYWS5apQALdfN')
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const DECIMALS_USDC = 6

export const Web3ContextProvider = ({ children }) => {
  const { publicKey, signMessage, sendTransaction, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [token, setToken] = useState(null)
  const [balance, setBalance] = useState(0)
  const [hasPremium, setHasPremium] = useState(false)
  const connection = useMemo(() => new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com'), [])

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(bal => setBalance(bal / 1e9)).catch(() => {})
    }
  }, [publicKey, connection])

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
      const statusResp = await api.get('/auth/status', { headers: { 'X-User-Id': walletAddress } })
      setHasPremium(statusResp.data.has_premium_generation)
    } catch (err) {
      console.error('Auth error:', err)
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
    const amount = amountUSDC * (10 ** DECIMALS_USDC)
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

  const value = useMemo(() => ({
    account: publicKey ? publicKey.toBase58() : null,
    balance,
    token,
    hasPremium,
    connectWallet: () => setVisible(true),
    disconnect,
    sendSolPayment,
    sendUsdcPayment,
  }), [publicKey, balance, token, hasPremium, disconnect])

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
