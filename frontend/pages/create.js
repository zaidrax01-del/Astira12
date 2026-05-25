'use client'
import { useState, useContext, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Ring } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'
import * as THREE from 'three'

// ---------- 3D Planet Component ----------
function HolographicPlanet({ textureUrl }) {
  const planetRef = useRef()
  const ringRef = useRef()
  const particleGroupRef = useRef()
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512)
    gradient.addColorStop(0, '#ff6b3d')
    gradient.addColorStop(0.3, '#d9a04a')
    gradient.addColorStop(0.6, '#4da6ff')
    gradient.addColorStop(1, '#1e1b4b')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
    // add some noise/stars
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y = clock.getElapsedTime() * 0.15
    }
  })

  // Orbiting particles
  const particles = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 2.2 + Math.random() * 0.3
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    return positions
  }, [])

  return (
    <group>
      {/* Planet sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Glowing atmosphere */}
      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Energy ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.3, 2.6, 64]} />
        <meshBasicMaterial color="#c084fc" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>

      {/* Orbiting particles */}
      <points ref={particleGroupRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={300} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  )
}

// ---------- Main Page ----------
export default function CreatePlanet() {
  const { account, token, sendSolPayment, sendUsdcPayment, hasPremium } = useContext(Web3Context)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [freeGenerations, setFreeGenerations] = useState(3)
  const [premium, setPremium] = useState(false)

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
    if (freeGenerations > 0 || premium) generatePreview()
    else setShowPayment(true)
  }

  const generatePreview = async () => {
    setLoading(true)
    try {
      const resp = await api.post('/planet/generate', { prompt }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPreview({ image_url: resp.data.image_url, style_signature: resp.data.style_signature })
      if (resp.data.free_remaining !== undefined) setFreeGenerations(resp.data.free_remaining)
    } catch (err) {
      if (err.response?.data?.error === 'premium_required') setShowPayment(true)
      else alert('Generation failed.')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!name.trim()) { alert('Please name your planet.'); return }
    setLoading(true)
    try {
      await api.post('/planet/save', {
        image_url: preview.image_url,
        name,
        description,
        style_signature: preview.style_signature,
      }, { headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` } })
      alert('Planet saved!')
      setPreview(null); setName(''); setDescription(''); setPrompt('')
    } catch (err) { alert('Failed to save.') }
    setLoading(false)
  }

  const handleDiscard = () => {
    setPreview(null); setName(''); setDescription('')
  }

  const handleUnlockPremium = async (currency) => {
    setShowPayment(false); setLoading(true)
    try {
      let signature
      if (currency === 'SOL') {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json()
        const solPrice = data.solana.usd
        const solAmount = 7.99 / solPrice
        signature = await sendSolPayment(solAmount)
      } else if (currency === 'USDC') {
        signature = await sendUsdcPayment(7.99)
      }
      if (!signature) throw new Error('Payment failed')
      await api.post('/payment/unlock-premium', { signature, currency }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPremium(true)
      generatePreview()
    } catch (err) { alert('Transaction failed: ' + (err.message || err)); setLoading(false) }
  }

  // Sample planet variations for carousel (placeholder)
  const variations = [
    { img: '/planet-cryonix.png', name: 'Cryonix', rarity: 'Legendary' },
    { img: '/planet-solvora.png', name: 'Solvora', rarity: 'Legendary' },
    { img: '/planet-dunora.png', name: 'Dunora', rarity: 'Legendary' },
    { img: '/planet-lumerion.png', name: 'Lumerion', rarity: 'Legendary' },
    { img: '/planet-verdana.png', name: 'Verdana', rarity: 'Legendary' },
  ]

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col">
      <SpaceBackground />
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row pt-16 px-4 lg:px-8 pb-4 gap-4">
        {/* ── Center 3D Planet ── */}
        <div className="flex-1 h-[50vh] lg:h-full relative order-1 lg:order-2">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={20} depth={30} count={1000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls enableDamping dampingFactor={0.1} enableZoom={true} minDistance={3} maxDistance={12} />
            <HolographicPlanet />
          </Canvas>
          {/* Central glow overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-500/10 to-transparent" />
        </div>

        {/* ── Right Floating Info Panel ── */}
        <div className="lg:w-[340px] flex-shrink-0 order-2 lg:order-3 overflow-y-auto">
          <div className="glass p-4 rounded-2xl border border-white/10 space-y-4">
            {!preview ? (
              <>
                <h2 className="text-xl font-bold text-gradient">Create a Planet</h2>
                <div className="text-sm text-gray-400">
                  {connected ? (
                    <>Free generations: <span className="text-purple-300">{freeGenerations}</span>{premium && <span className="ml-1 text-green-300">(Premium ♾️)</span>}</>
                  ) : 'Connect wallet to create.'}
                </div>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe your planet..."
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <GlowButton onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate AI Planet'}
                </GlowButton>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <img src={preview.image_url} className="w-full h-40 object-cover rounded-xl border border-white/10" />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Planet name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex gap-2">
                  <GlowButton onClick={handleSave} disabled={loading} className="flex-1">Save</GlowButton>
                  <button onClick={handleDiscard} className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition">Discard</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Carousel (desktop only) ── */}
      <div className="hidden lg:flex gap-3 px-8 pb-4 overflow-x-auto">
        <h3 className="text-sm text-gray-400 self-center">Variations</h3>
        {variations.map((v, i) => (
          <div key={i} className="flex-shrink-0 glass p-2 rounded-xl border border-white/10 text-center w-24">
            <img src={v.img} className="w-12 h-12 mx-auto rounded-full object-cover" />
            <p className="text-[10px] text-white mt-1">{v.name}</p>
            <p className="text-[8px] text-purple-300">{v.rarity}</p>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-white/10"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-2">Unlock Advanced AI Generation</h3>
              <p className="text-gray-300 mb-4">One‑time $7.99 USD payment for unlimited planets forever.</p>
              <div className="flex justify-center gap-4 mt-6">
                <GlowButton onClick={() => handleUnlockPremium('SOL')}>Pay with SOL</GlowButton>
                <GlowButton onClick={() => handleUnlockPremium('USDC')} className="!bg-blue-500">Pay with USDC</GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
