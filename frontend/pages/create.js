'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const ART_STYLES = ['Cosmic', 'Sci-Fi', 'Fantasy', 'Ancient', 'Realistic', 'Cinematic']
const CREATIVITY_LEVELS = ['Strict', 'Balanced', 'Creative']
const LOADING_PULSES = ['◌', '◉', '◎', '◉', '◌']

export default function CreatePlanet() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('Cosmic')
  const [creativity, setCreativity] = useState('Balanced')
  const [loading, setLoading] = useState(false)
  const [discoveryComplete, setDiscoveryComplete] = useState(false)
  const [planetData, setPlanetData] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loadingPulse, setLoadingPulse] = useState(0)
  const loadingTimer = useRef(null)
  const [rarityRevealStep, setRarityRevealStep] = useState(0)
  const [showRarityText, setShowRarityText] = useState(false)

  const handleDiscover = () => {
    if (!prompt.trim()) { alert('Please describe your planet.'); return }
    startDiscovery()
  }

  const startDiscovery = async () => {
    setDiscoveryComplete(false)
    setPlanetData(null)
    setName('')
    setDescription('')
    setRarityRevealStep(0)
    setShowRarityText(false)
    setLoading(true)

    let pulseIdx = 0
    setLoadingPulse(0)
    loadingTimer.current = setInterval(() => {
      pulseIdx = (pulseIdx + 1) % LOADING_PULSES.length
      setLoadingPulse(pulseIdx)
    }, 300)

    try {
      const resp = await api.post('/planet/generate', {
        prompt,
        art_style: selectedStyle,
        creativity: creativity
      })
      clearInterval(loadingTimer.current)
      setLoading(false)

      if (resp.data && resp.data.planet) {
        const finalResult = resp.data.planet
        setPlanetData(finalResult)
        setName(finalResult.name || '')
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
      } else {
        alert('Discovery failed. Please try again.')
      }
    } catch (err) {
      clearInterval(loadingTimer.current)
      setLoading(false)
      alert('Discovery failed. Please try again.')
    }
  }

  const handleDiscard = () => {
    setDiscoveryComplete(false)
    setPlanetData(null)
    setName('')
    setDescription('')
  }

  const currentImageUrl = planetData?.image_url || ''
  const generatedName = name || planetData?.name || 'Unnamed World'
  const rarity = planetData?.rarity || 'Common'

  return (
    <div className="relative min-h-screen bg-[#050008] text-white overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <main className="pt-20 px-4 md:px-8 pb-20">
        {/* ---------- DISCOVERY FORM ---------- */}
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
              <button onClick={handleDiscover} disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition disabled:opacity-50">
                Discover Planet
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 backdrop-blur-md" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🪐</span>
                </div>
                <div className="absolute -top-1 -left-1 w-8 h-8 bg-purple-500/30 blur-xl animate-ping" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500/30 blur-xl animate-ping" />
              </div>
              <p className="text-gray-400 italic">No planet discovered yet.</p>
            </motion.div>
          </div>
        )}

        {/* ---------- CINEMATIC LOADING ---------- */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-7xl text-purple-400 mb-6"
            >
              {LOADING_PULSES[loadingPulse]}
            </motion.div>
            <p className="text-xl text-purple-200 font-semibold animate-pulse">Scanning the cosmos...</p>
          </motion.div>
        )}

        {/* ---------- DISCOVERY COMPLETE ---------- */}
        {discoveryComplete && !loading && planetData && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-purple-500/40 shadow-[0_0_80px_rgba(168,85,247,0.5)]"
                >
                  <motion.img
                    src={currentImageUrl}
                    alt="Discovered planet"
                    className="w-full h-full object-cover"
                    animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                  />
                  <div className="absolute top-0 left-0 w-12 h-12 bg-purple-400/30 blur-xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-cyan-400/30 blur-xl" />
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
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-gradient">PLANET PASSPORT</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Name', generatedName],
                    ['Planet DNA', planetData?.dna],
                    ['Size', planetData?.size_class],
                    ['Value Index', `${planetData?.value_index}/100`],
                    ['Universe Sector', 'NGC-224'],
                    ['Seed', planetData?.seed],
                    ['Events', planetData?.events || 'None'],
                    ['Rare Discovery', planetData?.rare_discovery || 'None']
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xl font-semibold text-purple-300">Official Traits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                {[
                  ['Planet Type', planetData?.type],
                  ['Surface', planetData?.surface],
                  ['Atmosphere', planetData?.atmosphere],
                  ['Gravity', planetData?.gravity],
                  ['Temperature', planetData?.temperature],
                  ['Moons', planetData?.moons],
                  ['Rings', planetData?.rings],
                  ['Dominant Color', planetData?.dominant_color],
                  ['Star System', planetData?.star_system],
                  ['Civilization Potential', planetData?.civilization_potential],
                  ['Energy Signature', planetData?.energy_signature],
                  ['Rarity', planetData?.rarity]
                ].map(([label, value], idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">AI Interpretation</h3>
              <p className="text-gray-300 leading-relaxed">
                The universe interpreted your inspiration as a {planetData?.type?.toLowerCase()} world with {planetData?.surface?.toLowerCase()} surface, orbiting a {planetData?.star_system?.toLowerCase()}.
                Its {planetData?.atmosphere?.toLowerCase()} atmosphere gives it a {planetData?.dominant_color?.toLowerCase()} hue.
                {planetData?.moons} moons accompany this {planetData?.rarity?.toLowerCase()} discovery.
                {planetData?.events ? ` Active events include: ${planetData.events}.` : ''}
                {planetData?.rare_discovery ? ` ⚠️ ${planetData.rare_discovery}!` : ''}
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleDiscover} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition">
                Discover Another Planet
              </button>
              <button onClick={handleDiscard} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
                Discard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
