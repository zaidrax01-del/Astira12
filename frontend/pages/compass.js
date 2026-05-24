'use client'
import { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import * as THREE from 'three'

// ---------- Planet orbit component ----------
function Planet3D({ planet, radius, speed, orbitAngle, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      const angle = orbitAngle.current + state.clock.elapsedTime * speed
      meshRef.current.position.x = Math.cos(angle) * radius
      meshRef.current.position.z = Math.sin(angle) * radius
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(planet) }}
    >
      <sphereGeometry args={[1.0, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#a855f7' : 'white'}
        transparent
        opacity={0}
      />
      <Html position={[0, 0, 0]} center distanceFactor={12}>
        <div
          className="rounded-full overflow-hidden shadow-lg"
          style={{
            width: '80px',
            height: '80px',
            border: hovered ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.5)',
            transition: 'border 0.3s',
          }}
        >
          <img
            src={planet.image_url}
            alt={planet.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>
        <div className="text-xs text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap mt-1">
          {planet.name}
        </div>
      </Html>
    </mesh>
  )
}

// ---------- Bright Orbit Ring ----------
function OrbitRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.1, radius + 0.1, 128]} />
      <meshBasicMaterial color="#ffffff" opacity={0.5} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

// ---------- Central Realistic Moon ----------
function CentralMoon() {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    // Reliable moon texture
    return loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/800px-FullMoon2010.jpg')
  }, [])

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.0, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      <pointLight intensity={0.8} distance={40} color="#ffffff" />
    </mesh>
  )
}

// ---------- Main Compass Page ----------
export default function CosmicCompass() {
  const { account } = useContext(Web3Context)
  const [planets, setPlanets] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  useEffect(() => { fetchPlanets() }, [account])

  const fetchPlanets = async () => {
    try {
      const resp = await api.get('/compass/planets', { params: { page: 1, per_page: 100 } })
      let all = resp.data.planets.map((p, idx) => ({
        ...p,
        orbitRadius: 5 + idx * 2.2,   // spread out for visibility
        speed: 0.04 + Math.random() * 0.04,
        initialAngle: Math.random() * Math.PI * 2,
      }))
      setPlanets(all)
    } catch (err) { console.error(err) }
  }

  const filtered = planets.filter(p => {
    if (filter === 'mine') return p.creator === account
    if (filter === 'system') return p.creator === '0xAstiraSeed' || p.creator?.startsWith('AstiraSeed')
    return true
  })

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-4 py-8">
      <h2 className="text-3xl font-bold text-gradient mb-6">Cosmic Compass</h2>

      {/* Filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {['all', 'mine', 'system'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm capitalize backdrop-blur-md border transition ${
              filter === f ? 'bg-purple-500/30 text-purple-300 border-purple-500' : 'bg-black/40 text-gray-300 border-white/20 hover:bg-black/50'
            }`}
          >
            {f === 'mine' ? 'My Planets' : f === 'system' ? 'System' : 'All'}
          </button>
        ))}
      </div>

      {/* Connect wallet overlay for 'mine' filter */}
      {filter === 'mine' && !account && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white text-lg">
          Connect wallet to see your planets.
        </div>
      )}

      {/* Large Container – rectangular, fills width on most screens */}
      <div className="relative w-full max-w-5xl h-[600px] sm:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-md shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        <Canvas camera={{ position: [0, 6, 14], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.0} />
          <Stars radius={80} depth={60} count={3000} factor={5} saturation={0} fade speed={1} />
          <OrbitControls enableDamping dampingFactor={0.1} enableZoom={true} maxDistance={30} minDistance={6} />

          {/* Central realistic Moon */}
          <CentralMoon />

          {/* Visible orbit rings */}
          {filtered.map(p => (
            <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} />
          ))}

          {/* Orbiting planets */}
          {filtered.map(p => (
            <Planet3D
              key={p.id}
              planet={p}
              radius={p.orbitRadius}
              speed={p.speed}
              orbitAngle={{ current: p.initialAngle }}
              onClick={setSelectedPlanet}
            />
          ))}
        </Canvas>
      </div>

      {/* Planet detail modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedPlanet.image_url} className="w-48 h-48 mx-auto rounded-full" />
              <h3 className="text-2xl font-bold mt-4">{selectedPlanet.name}</h3>
              <p className="text-gray-400">{selectedPlanet.planet_type} · {selectedPlanet.rarity}</p>
              <p className="text-gray-300 mt-2">{selectedPlanet.description || 'A mysterious world.'}</p>
              {selectedPlanet.creator === account ? (
                <div className="mt-4">
                  <GlowButton onClick={() => alert('Delete not implemented')}>Delete Planet</GlowButton>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">Mint (Coming Soon)</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
