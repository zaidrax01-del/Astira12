'use client'
import { useState, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const COST_PER_DISCOVERY_SOL = 0.002
const ART_STYLES = ['Cosmic', 'Sci-Fi', 'Fantasy', 'Ancient', 'Realistic', 'Cinematic']
const CREATIVITY_LEVELS = ['Strict', 'Balanced', 'Creative']
const LOADING_SENTENCES = [
  'Initializing Universe...', 'Reading imagination...', 'Analyzing cosmic patterns...',
  'Forging Planet DNA...', 'Calculating gravity...', 'Generating atmosphere...',
  'Discovering moons...', 'Scanning biosignatures...', 'Determining rarity...',
  'Rendering planet...', 'Planet stabilized.', 'Planet discovered.'
]

export default function CreatePlanet() {
  const { account, token, sendSolPayment, sendUsdcPayment } = useContext(Web3Context)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('Cosmic')
  const [creativity, setCreativity] = useState('Balanced')
  const [loading, setLoading] = useState(false)
  const [discoveryComplete, setDiscoveryComplete] = useState(false)
  const [planetData, setPlanetData] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [freeDiscoveries, setFreeDiscoveries] = useState(3)        // remaining free
  const [paidDiscoveries, setPaidDiscoveries] = useState(0)        // available paid ones
  const [showPayment, setShowPayment] = useState(false)

  const [loadingStep, setLoadingStep] = useState(-1)
  const loadingTimer = useRef(null)
  const [rarityRevealStep, setRarityRevealStep] = useState(0)
  const [showRarityText, setShowRarityText] = useState(false)

  // Fetch user status on mount
  useEffect(() => {
    if (account) {
      api.get('/auth/status', { headers: { 'X-User-Id': account } })
        .then(res => {
          setFreeDiscoveries(3 - res.data.free_discoveries_used)
          setPaidDiscoveries(res.data.paid_discoveries_available || 0)
        })
        .catch(() => {})
    }
  }, [account])

  const requireConnection = () => {
    if (!connected) { setVisible(true); return false }
    return true
  }

  // ── Main discovery trigger ──
  const handleDiscover = () => {
    if (!requireConnection()) return
    if (!prompt.trim()) { alert('Please describe your planet.'); return }

    if (freeDiscoveries > 0 || paidDiscoveries > 0) {
      startDiscovery()
    } else {
      setShowPayment(true)   // no free, no paid → show payment modal
    }
  }

  // ── Actual API call (after eligibility check) ──
  const startDiscovery = async () => {
    setDiscoveryComplete(false)
    setPlanetData(null)
    setName('')
    setDescription('')
    setRarityRevealStep(0)
    setShowRarityText(false)
    setLoading(true)
    setLoadingStep(0)

    let apiResult = null
    const apiPromise = api.post('/planet/generate', { prompt }, {
      headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.data && res.data.planet) {
        apiResult = res.data.planet
      } else {
        apiResult = { error: true }
      }
    }).catch(() => { apiResult = { error: true } })

    let step = 0
    loadingTimer.current = setInterval(() => {
      step++
      if (step < LOADING_SENTENCES.length) setLoadingStep(step)
      else {
        clearInterval(loadingTimer.current)
        finalizeDiscovery(apiResult)
      }
    }, 800)
  }

  const finalizeDiscovery = async (apiResult) => {
    while (apiResult === null) await new Promise(resolve => setTimeout(resolve, 200))
    if (!apiResult || apiResult.error) {
      setLoading(false)
      setLoadingStep(-1)
      alert('Discovery failed. Please try again.')
      return
    }
    setPlanetData(apiResult)
    setName(apiResult.name || '')
    setLoading(false)
    setLoadingStep(-1)
    setDiscoveryComplete(true)

    // Update local counters (backend will also update)
    if (freeDiscoveries > 0) {
      setFreeDiscoveries(prev => prev - 1)
    } else if (paidDiscoveries > 0) {
      setPaidDiscoveries(prev => prev - 1)
    }

    // Rarity reveal animation
    setRarityRevealStep(1)
    const starInterval = setInterval(() => {
      setRarityRevealStep(prev => {
        if (prev >= 5) {
          clearInterval(starInterval)
          setTimeout(() => setShowRarityText(true), 300)
          return 6
        }
        return prev + 1
      })
    }, 500)
  }

  // ── Save / Discard ──
  const handleSave = async () => {
    if (!planetData) return
    if (!name.trim()) { alert('Please name your planet.'); return }
    setLoading(true)
    try {
      await api.post('/planet/save', {
        image_url: planetData.image_url,
        name,
        description,
        style_signature: planetData.style_signature,
      }, { headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` } })
      alert('Planet saved to your Cosmic Compass!')
      setDiscoveryComplete(false)
      setPlanetData(null)
      setName('')
      setDescription('')
      setPrompt('')
    } catch (err) { alert('Failed to save.') }
    setLoading(false)
  }

  const handleDiscard = () => {
    setDiscoveryComplete(false)
    setPlanetData(null)
    setName('')
    setDescription('')
  }

  // ── Payment for one discovery ──
  const handlePurchaseDiscovery = async () => {
    setShowPayment(false)
    setLoading(true)
    try {
      const signature = await sendSolPayment(COST_PER_DISCOVERY_SOL)
      if (!signature) throw new Error('Payment failed')
      // Tell backend to grant a paid discovery
      await api.post('/payment/purchase-discovery', { signature }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      // Increment local paid balance and then discover
      setPaidDiscoveries(prev => prev + 1)
      startDiscovery()
    } catch (err) {
      alert('Transaction failed: ' + (err.message || err))
      setLoading(false)
    }
  }

  // ── Helper data for UI ──
  const currentImageUrl = planetData?.image_url || ''
  const generatedName = name || planetData?.name || 'Unnamed World'
  const rarity = planetData?.rarity || 'Common'

  return (
    <div className="relative min-h-screen bg-[#050008] text-white overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <main className="pt-20 px-4 md:px-8 pb-20">
        {/* ---------- DISCOVERY FORM (no planet yet) ---------- */}
        {!discoveryComplete && !loading && (
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                DISCOVER A NEW WORLD
              </h1>
              <p className="text-gray-400">Describe the planet you wish existed.</p>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A dark planet with crystal oceans..." className="w-full h-36 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              <div>
                <p className="text-sm text-gray-400 mb-2">Art Style</p>
                <div className="flex flex-wrap gap-2">
                  {ART_STYLES.map(style => (
                    <button key={style} onClick={() => setSelectedStyle(style)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedStyle === style ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}>{style}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Universe Creativity</p>
                <div className="flex items-center gap-3">
                  {CREATIVITY_LEVELS.map(level => (
                    <button key={level} onClick={() => setCreativity(level)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${creativity === level ? 'bg-purple-600/30 border border-purple-500 text-purple-300' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>{level}</button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {creativity === 'Strict' && 'Follows your prompt closely.'}
                  {creativity === 'Balanced' && 'Mixes your idea with the universe.'}
                  {creativity === 'Creative' && 'Allows the universe to surprise you.'}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                {connected
                  ? <>Free Discoveries: <span className="text-purple-300">{freeDiscoveries}</span></>
                  : 'Connect wallet to discover.'
                }
                {paidDiscoveries > 0 && <span className="ml-2 text-green-300">(+{paidDiscoveries} paid)</span>}
              </p>
              <button onClick={handleDiscover} disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition disabled:opacity-50">
                Discover Planet
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-white/10 backdrop-blur-md animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/20 animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-cyan-400/10 animate-spin-slower" />
                <div className="absolute inset-20 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full flex items-center justify-center">
                  <span className="text-6xl opacity-30">🪐</span>
                </div>
              </div>
              <p className="text-gray-400 italic">No planet discovered yet.</p>
            </motion.div>
          </div>
        )}

        {/* ---------- CINEMATIC LOADING ---------- */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="space-y-2 text-center max-w-md">
              {LOADING_SENTENCES.map((s, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={i <= loadingStep ? { opacity: 1, y: 0 } : {}} className={`text-lg ${i === loadingStep ? 'text-purple-300 font-semibold' : 'text-gray-500'}`}>{s}</motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------- DISCOVERY COMPLETE ---------- */}
        {discoveryComplete && !loading && planetData && (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* ... same planet preview, passport, traits, interpretation ... (unchanged from previous single-planet layout) ... */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleDiscover} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition">
                Discover Another Planet
              </button>
              <button onClick={handleSave} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition">
                Mint Planet 🚀
              </button>
              <button onClick={handleDiscard} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
                Discard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ---------- Payment Modal (new exploration theme) ---------- */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-white/10" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-2">Expedition Limit Reached</h3>
              <p className="text-gray-300 mb-1">Your exploration vessel has reached the limit of its free expeditions.</p>
              <p className="text-gray-400 mb-4">You have successfully discovered three planets.</p>
              <p className="text-gray-200 font-semibold">Unlock another expedition for only <span className="text-purple-300">{COST_PER_DISCOVERY_SOL} SOL</span> and continue exploring the universe.</p>
              <button onClick={handlePurchaseDiscovery} className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition">
                Discover Another Planet — {COST_PER_DISCOVERY_SOL} SOL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
