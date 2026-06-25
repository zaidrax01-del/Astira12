'use client'
import { useState, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const PREMIUM_PRICE_USD = 7.99
const ART_STYLES = ['Cosmic', 'Sci-Fi', 'Fantasy', 'Ancient', 'Realistic', 'Cinematic']
const CREATIVITY_LEVELS = ['Strict', 'Balanced', 'Creative']
const LOADING_SENTENCES = [
  'Initializing Universe...', 'Reading imagination...', 'Analyzing cosmic patterns...',
  'Forging Planet DNA...', 'Calculating gravity...', 'Generating atmosphere...',
  'Discovering moons...', 'Scanning biosignatures...', 'Determining rarity...',
  'Rendering planet...', 'Planet stabilized.', 'Planet discovered.'
]

export default function CreatePlanet() {
  const { account, token, sendSolPayment, sendUsdcPayment, hasPremium } = useContext(Web3Context)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('Cosmic')
  const [creativity, setCreativity] = useState('Balanced')
  const [loading, setLoading] = useState(false)
  const [variations, setVariations] = useState([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [freeGenerations, setFreeGenerations] = useState(3)
  const [premium, setPremium] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const [loadingStep, setLoadingStep] = useState(-1)
  const [discoveryComplete, setDiscoveryComplete] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const loadingTimer = useRef(null)

  const [rarityRevealStep, setRarityRevealStep] = useState(0)
  const [showRarityText, setShowRarityText] = useState(false)

  useEffect(() => {
    if (account) {
      api.get('/auth/status', { headers: { 'X-User-Id': account } })
        .then(res => {
          setFreeGenerations(3 - res.data.free_generations_used)
          setPremium(res.data.has_premium_generation)
        })
        .catch(() => {})
    }
  }, [account, hasPremium])

  const requireConnection = () => {
    if (!connected) { setVisible(true); return false }
    return true
  }

  const handleGenerate = () => {
    if (!requireConnection()) return
    if (!prompt.trim()) { alert('Please describe your planet.'); return }
    if (freeGenerations > 0 || premium) startDiscovery()
    else setShowPayment(true)
  }

  const startDiscovery = async () => {
    setDiscoveryComplete(false)
    setVariations([])
    setPreviewIndex(0)
    setName('')
    setDescription('')
    setRarityRevealStep(0)
    setShowRarityText(false)
    setLoading(true)
    setLoadingStep(0)

    const apiPromise = api.post('/planet/generate', {
      prompt,
      num_samples: 5,
    }, {
      headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.data.variations && res.data.variations.length > 0) {
        setApiResponse(res.data)
      } else {
        setApiResponse({ error: true })
      }
    }).catch(() => setApiResponse({ error: true }))

    let step = 0
    loadingTimer.current = setInterval(() => {
      step++
      if (step < LOADING_SENTENCES.length) setLoadingStep(step)
      else {
        clearInterval(loadingTimer.current)
        finalizeDiscovery()
      }
    }, 800)
  }

  const finalizeDiscovery = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)) // wait for API
    if (!apiResponse || apiResponse.error) {
      setLoading(false)
      setLoadingStep(-1)
      alert('Discovery failed. Please try again.')
      return
    }
    setVariations(apiResponse.variations)
    setPreviewIndex(0)
    setName('')
    setDescription('')
    setLoading(false)
    setLoadingStep(-1)
    setDiscoveryComplete(true)
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

  const handleSave = async () => {
    const planet = variations[previewIndex]
    if (!planet) return
    if (!name.trim()) { alert('Please name your planet.'); return }
    setLoading(true)
    try {
      await api.post('/planet/save', {
        image_url: planet.image_url,
        name,
        description,
        style_signature: planet.style_signature,
      }, { headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` } })
      alert('Planet saved!')
      setDiscoveryComplete(false)
      setVariations([])
      setPreviewIndex(0)
      setName('')
      setDescription('')
      setPrompt('')
    } catch (err) { alert('Failed to save.') }
    setLoading(false)
  }

  const handleDiscard = () => {
    setDiscoveryComplete(false)
    setVariations([])
    setPreviewIndex(0)
    setName('')
    setDescription('')
  }

  const handleUnlockPremium = async (currency) => {
    setShowPayment(false)
    setLoading(true)
    try {
      let signature
      if (currency === 'SOL') {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json()
        const solAmount = PREMIUM_PRICE_USD / data.solana.usd
        signature = await sendSolPayment(solAmount)
      } else if (currency === 'USDC') {
        signature = await sendUsdcPayment(PREMIUM_PRICE_USD)
      }
      if (!signature) throw new Error('Payment failed')
      await api.post('/payment/unlock-premium', { signature, currency }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPremium(true)
      startDiscovery()
    } catch (err) { alert('Transaction failed: ' + (err.message || err)); setLoading(false) }
  }

  const currentPlanet = variations[previewIndex] || null
  const currentImageUrl = currentPlanet?.image_url || ''
  const generatedName = name || currentPlanet?.name || 'Unnamed World'
  const rarity = currentPlanet?.rarity || 'Common'
  const planetType = currentPlanet?.type || 'Terrestrial'

  return (
    <div className="relative min-h-screen bg-[#050008] text-white overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <main className="pt-20 px-4 md:px-8 pb-20">
        {/* DISCOVERY MODE */}
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
              <p className="text-sm text-gray-400">{connected ? <>Free discoveries left: <span className="text-purple-300">{freeGenerations}</span>{premium && <span className="ml-2 text-green-300">(Premium ∞)</span>}</> : 'Connect wallet to discover.'}</p>
              <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition disabled:opacity-50">Generate Planet</button>
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

        {/* LOADING */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="space-y-2 text-center max-w-md">
              {LOADING_SENTENCES.map((s, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={i <= loadingStep ? { opacity: 1, y: 0 } : {}} className={`text-lg ${i === loadingStep ? 'text-purple-300 font-semibold' : 'text-gray-500'}`}>{s}</motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* DISCOVERY COMPLETE */}
        {discoveryComplete && !loading && (
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative flex flex-col items-center">
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="relative w-80 h-80 md:w-96 md:h-96">
                  <img src={currentImageUrl} alt="Discovered planet" className="w-full h-full object-cover rounded-full border-4 border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.4)] animate-float" />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-spin-slow" />
                </motion.div>
                <div className="mt-4 text-center">
                  {!showRarityText ? (
                    <div className="flex gap-1 justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={i < rarityRevealStep ? { opacity: 1, scale: 1 } : {}} className="text-2xl">★</motion.span>
                      ))}
                    </div>
                  ) : (
                    <motion.p initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{rarity}</motion.p>
                  )}
                </div>
                <div className="mt-6 w-full max-w-md space-y-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Name your planet..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a short description (optional)..." className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-gradient">PLANET PASSPORT</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[['Name', generatedName], ['Planet DNA', currentPlanet?.dna], ['Universe Sector', 'NGC-224'], ['Discovery Time', new Date().toLocaleString()], ['Discovered By', connected ? account.slice(0, 6) + '...' : 'Unknown'], ['Generation #', '1'], ['Seed', currentPlanet?.seed]].map(([label, value], idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-400">{label}</span><span className="font-medium">{value}</span></div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xl font-semibold text-purple-300">Official Traits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                {[['Planet Type', currentPlanet?.type], ['Surface', currentPlanet?.surface], ['Atmosphere', currentPlanet?.atmosphere], ['Gravity', currentPlanet?.gravity], ['Temperature', currentPlanet?.temperature], ['Moons', currentPlanet?.moons], ['Rings', currentPlanet?.rings], ['Dominant Color', currentPlanet?.dominant_color], ['Star System', currentPlanet?.star_system], ['Civilization Potential', currentPlanet?.civilization_potential], ['Energy Signature', currentPlanet?.energy_signature], ['Rarity', currentPlanet?.rarity]].map(([label, value], idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5"><p className="text-xs text-gray-400">{label}</p><p className="font-semibold">{value}</p></div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">AI Interpretation</h3>
              <p className="text-gray-300 leading-relaxed">The universe interpreted your inspiration as a {currentPlanet?.type?.toLowerCase()} world with {currentPlanet?.surface?.toLowerCase()} surface, orbiting a {currentPlanet?.star_system?.toLowerCase()}. Its {currentPlanet?.atmosphere?.toLowerCase()} atmosphere gives it a {currentPlanet?.dominant_color?.toLowerCase()} hue. {currentPlanet?.moons} moons accompany this {currentPlanet?.rarity?.toLowerCase()} discovery.</p>
            </motion.div>
            {variations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Planet Gallery</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {variations.map((v, i) => (
                    <div key={i} onClick={() => setPreviewIndex(i)} className={`flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border-2 cursor-pointer transition ${i === previewIndex ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/10 hover:border-white/30'}`}>
                      <img src={v.image_url} alt={`Var ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleGenerate} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition">Generate Again</button>
              <button onClick={handleSave} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition">Mint Planet 🚀</button>
              <button onClick={handleDiscard} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">Discard</button>
            </div>
          </div>
        )}
      </main>
      {/* Payment Modal (unchanged) */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-white/10" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-2">Unlock Advanced Discovery</h3>
              <p className="text-gray-300 mb-4">One‑time ${PREMIUM_PRICE_USD} USD for unlimited discoveries.</p>
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => handleUnlockPremium('SOL')} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold">Pay with SOL</button>
                <button onClick={() => handleUnlockPremium('USDC')} className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold">Pay with USDC</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
