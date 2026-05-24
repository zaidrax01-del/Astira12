'use client'
import { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import * as THREE from 'three'

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
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#a855f7' : 'white'}
        transparent
        opacity={0}
      />
      <Html position={[0, 0, 0]} center distanceFactor={8}>
        <div
          className="rounded-full overflow-hidden shadow-lg"
          style={{
            width: '60px',
            height: '60px',
            border: hovered ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.2)',
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

function OrbitRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

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
        orbitRadius: 5 + idx * 1.5,   // tighter orbits
        speed: 0.08 + Math.random() * 0.06,
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
      <div className="flex gap-3 mb-4">
        {['all', 'mine', 'system'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize backdrop-blur-md border transition ${
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

      {/* Contained square compass */}
      <div className="relative w-full max-w-[700px] aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <Canvas camera={{ position: [0, 8, 16], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.6} />
          <Stars radius={50} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableDamping dampingFactor={0.1} enableZoom={true} maxDistance={25} minDistance={8} />

          {/* Central axis marker (tiny faint dot to keep axis visible) */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>

          {filtered.map(p => (
            <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} />
          ))}
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
