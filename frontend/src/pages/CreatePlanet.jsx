import { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'

const PREMIUM_PRICE_USD = 7.99

export default function CreatePlanet() {
  const { account, token, sendSolPayment, sendUsdcPayment, hasPremium } = useContext(Web3Context)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [freeGenerations, setFreeGenerations] = useState(3)
  const [premium, setPremium] = useState(false)

  useEffect(() => {
    if (account) {
      api.get('/auth/status', { headers: { 'X-User-Id': account } }).then(res => {
        setFreeGenerations(3 - res.data.free_generations_used)
        setPremium(res.data.has_premium_generation)
      }).catch(() => {})
    }
  }, [account, hasPremium])

  const requireConnection = () => {
    if (!connected) { setVisible(true); return false }
    return true
  }

  const handleGenerate = () => {
    if (!requireConnection()) return
    if (!prompt.trim()) return
    if (freeGenerations > 0 || premium) {
      generatePlanet()
    } else {
      setShowPayment(true)
    }
  }

  const generatePlanet = async () => {
    setLoading(true)
    try {
      const resp = await api.post('/planet/generate', { prompt }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setResult(resp.data)
      if (resp.data.free_remaining !== undefined) setFreeGenerations(resp.data.free_remaining)
    } catch (err) {
      if (err.response?.data?.error === 'premium_required') setShowPayment(true)
      else alert('Generation failed.')
    }
    setLoading(false)
  }

  const handleUnlockPremium = async (currency) => {
    setShowPayment(false)
    setLoading(true)
    try {
      let signature
      if (currency === 'SOL') {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json()
        const solPrice = data.solana.usd
        const solAmount = PREMIUM_PRICE_USD / solPrice
        signature = await sendSolPayment(solAmount)
      } else if (currency === 'USDC') {
        signature = await sendUsdcPayment(PREMIUM_PRICE_USD)
      }
      if (!signature) throw new Error('Payment failed')
      await api.post('/payment/unlock-premium', { signature, currency }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPremium(true)
      generatePlanet()
    } catch (err) {
      alert('Transaction failed: ' + (err.message || err))
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-10">
      <h2 className="text-3xl font-bold text-cyan-300">Create a New Planet</h2>
      <div className="text-sm text-gray-400">
        {connected ? (
          <>Free generations left: <span className="text-purple-300">{freeGenerations}</span> {premium && <span className="ml-2 text-green-300">(Premium ♾️)</span>}</>
        ) : 'Connect wallet to see free generations.'}
      </div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your planet..." className="w-full h-32 bg-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <GlowButton onClick={handleGenerate} disabled={loading}>{loading ? 'Processing...' : 'Generate AI Planet'}</GlowButton>

      {showPayment && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Unlock Advanced AI Generation</h3>
            <p className="text-gray-300 mb-4">One-time payment of ${PREMIUM_PRICE_USD} USD. Unlimited planets forever.</p>
            <div className="flex justify-center gap-4 mt-6">
              <GlowButton onClick={() => handleUnlockPremium('SOL')}>Pay with SOL</GlowButton>
              <GlowButton onClick={() => handleUnlockPremium('USDC')} className="!bg-blue-500">Pay with USDC</GlowButton>
            </div>
            <p className="text-xs text-gray-400 mt-4">Live SOL price used for conversion.</p>
          </motion.div>
        </motion.div>
      )}

      {loading && (
        <div className="flex justify-center">
          <motion.div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
        </div>
      )}
      {result && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <img src={result.image_url} alt="Generated planet" className="mx-auto w-64 h-64 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)]" />
          <p className="mt-4 text-gray-300">Planet added to your Cosmic Compass!</p>
        </motion.div>
      )}
    </div>
  )
}
