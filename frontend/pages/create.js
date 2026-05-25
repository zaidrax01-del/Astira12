'use client'
import { useState, useContext, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Ring, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'
import * as THREE from 'three'

/* ---------- Photorealistic Planet with Atmosphere, Ring, and Debris ---------- */
function PlanetScene() {
  const planetRef = useRef()
  const ringRef = useRef()
  const debrisRef = useRef()

  // Load a high‑quality alien planet texture (replace this URL with your own 2048x1024 jpg)
  const planetTexture = useLoader(THREE.TextureLoader, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Mars_Valles_Marineris.jpeg/1024px-Mars_Valles_Marineris.jpeg')
  // (Optional) Load ring texture – a semi‑transparent ice‑ring
  const ringTexture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/sprites/snowflake1.png') // placeholder; you can replace with a proper ring texture

  // Fresnel atmosphere shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
          vNormal = worldNormal;
          vPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 uColor;
        uniform float uIntensity;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - abs(dot(viewDir, vNormal));
          fresnel = pow(fresnel, 3.0);
          gl_FragColor = vec4(uColor, fresnel * uIntensity);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color('#a855f7') },
        uIntensity: { value: 0.6 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
    })
  }, [])

  // Debris particles (floating rocks)
  const debrisCount = 200
  const debrisPositions = useMemo(() => {
    const arr = new Float32Array(debrisCount * 3)
    for (let i = 0; i < debrisCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2.8 + Math.random() * 1.5
      const height = (Math.random() - 0.5) * 1.2
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = height
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (planetRef.current) planetRef.current.rotation.y = clock.getElapsedTime() * 0.05
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.5
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
    if (debrisRef.current) debrisRef.current.rotation.y = clock.getElapsedTime() * 0.15
  })

  return (
    <group>
      {/* Main planet with high‑res texture */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={planetTexture}
          roughness={0.7}
          metalness={0.1}
          bumpScale={0.05}
        />
      </mesh>

      {/* Atmosphere glow (Fresnel) */}
      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Realistic ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.3, 3.0, 128]} />
        <meshStandardMaterial
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
          roughness={0.4}
          metalness={0.0}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting debris (tiny rocks) */}
      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={debrisCount} array={debrisPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#aaaaaa" size={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  )
}

/* ---------- Main Page ---------- */
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
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row pt-16 px-4 lg:px-8 pb-4 gap-4">
        {/* Center 3D Planet */}
        <div className="flex-1 h-[45vh] lg:h-full relative order-1 lg:order-2">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />
            <Stars radius={30} depth={40} count={2000} factor={5} saturation={0.2} fade speed={0.8} />
            <OrbitControls enableDamping dampingFactor={0.1} enableZoom={true} minDistance={3} maxDistance={12} />
            <Suspense fallback={null}>
              <PlanetScene />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Floating Panel */}
        <div className="lg:w-[340px] flex-shrink-0 order-2 lg:order-3 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-4 rounded-2xl border border-white/10 space-y-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
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
                <img src={preview.image_url} className="w-full h-40 object-cover rounded-xl border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
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
          </motion.div>
        </div>
      </div>

      {/* Bottom Carousel */}
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
