import { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import * as THREE from 'three'

// 3D Planet component – no black overlay, name below
function Planet3D({ planet, radius, speed, orbitAngle, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useMemo(() => new THREE.TextureLoader().load(planet.image_url), [planet.image_url])

  useFrame((state, delta) => {
    if (meshRef.current) {
      const angle = orbitAngle.current + state.clock.elapsedTime * speed
      meshRef.current.position.x = Math.cos(angle) * radius
      meshRef.current.position.z = Math.sin(angle) * radius
      meshRef.current.rotation.y += delta * 0.1  // slow self-rotation
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(planet); }}
    >
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.4}
        metalness={0.1}
        emissive={hovered ? '#444' : '#000'}   // subtle glow on hover, not black otherwise
        emissiveIntensity={hovered ? 0.5 : 0}
      />
      {/* Name label below the planet */}
      <Html position={[0, -1.2, 0]} center distanceFactor={5}>
        <div className="text-xs text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">
          {planet.name}
        </div>
      </Html>
    </mesh>
  )
}

// Center star
function CenterStar() {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshBasicMaterial color="#ffd700" />
      <pointLight intensity={2} distance={50} />
    </mesh>
  )
}

// Orbit ring
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
        orbitRadius: 6 + idx * 2.5,
        speed: 0.05 + Math.random() * 0.08,   // much slower (was 0.2+0.3)
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-cyan-300">Cosmic Compass</h2>
      <div className="flex justify-center gap-4">
        {['all', 'mine', 'system'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${filter === f ? 'bg-purple-500/30 text-purple-300 border border-purple-500' : 'bg-white/5 text-gray-400'}`}
          >
            {f === 'mine' ? 'My Planets' : f === 'system' ? 'System' : 'All'}
          </button>
        ))}
      </div>
      <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-black/30 border border-white/10 relative">
        {filter === 'mine' && !account && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white text-lg">
            Connect wallet to see your planets.
          </div>
        )}
        <Canvas camera={{ position: [0, 20, 30], fov: 50 }}>
          <ambientLight intensity={0.6} />      {/* brighter light so planet images aren't dark */}
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableDamping dampingFactor={0.1} />
          <CenterStar />
          {filtered.map(p => <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} />)}
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

      {/* Planet detail modal (unchanged but working) */}
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
                <div className="mt-4"><GlowButton onClick={() => alert('Delete not implemented')}>Delete Planet</GlowButton></div>
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
