'use client'
import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ---------- Planet data ----------
const systemPlanets = [
  {
    id: 'cryonix',
    name: 'Cryonix',
    title: 'The Frozen Heart',
    element: 'Ice',
    color: '#3b82f6',
    orbitRadius: 6,
    angle: 0.3,
    image: '/planet-cryonix.png',
    explorer: 'AstralNomad',
    population: '1.2M',
    habitability: 'Low',
    rarity: 'Legendary',
    description: 'A mysterious ice planet drifting through the outer reaches of the Astira galaxy. Cryonix is covered in colossal crystal glaciers, frozen oceans, and luminous frost storms.',
  },
  // ... (include all 8 planets from previous code) ...
  {
    id: 'auroria',
    name: 'Auroria',
    title: 'The Sapphire Tide',
    element: 'Water',
    color: '#06b6d4',
    orbitRadius: 11,
    angle: 1.7,
    image: '/planet-auroria.png',
    explorer: 'OceanSage',
    population: '1.9M',
    habitability: 'High',
    rarity: 'Epic',
    description: 'A serene ocean world with floating islands and endless aurora-lit skies.',
  },
]

// ---------- 3D Galaxy components ----------
function SpiralArm({ radius, color, opacity = 0.15 }) {
  // A simple ring with a wider thickness and glow
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.3, radius + 0.3, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

function GalaxyCore() {
  const coreRef = useRef()
  const glowRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02)
    if (glowRef.current) glowRef.current.scale.setScalar(1.5 + Math.sin(t * 3) * 0.05)
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.15} />
      </mesh>
      <pointLight intensity={3} distance={30} color="#a855f7" />
    </group>
  )
}

function PlanetMarker({ planet, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * 0.05
      meshRef.current.position.x = Math.cos(t + planet.angle) * planet.orbitRadius
      meshRef.current.position.z = Math.sin(t + planet.angle) * planet.orbitRadius
    }
  })

  return (
    <group>
      {/* Thick glowing orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.15, planet.orbitRadius + 0.15, 128]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick(planet) }}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={planet.color} roughness={0.2} metalness={0.9} emissive={planet.color} emissiveIntensity={hovered ? 1.2 : 0.5} />
        <Html center distanceFactor={15}>
          <div className="flex flex-col items-center space-y-1" style={{ pointerEvents: 'none' }}>
            <div className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">{planet.name}</div>
            <div className="text-[10px] text-gray-400">{planet.explorer}</div>
            <div className="text-[10px] text-purple-300">{planet.population}</div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// ---------- Right Info Panel (floating card) ----------
function InfoPanel({ planet, onClose }) {
  if (!planet) return null

  const feed = [
    { user: 'StarPilot', text: 'discovered a new asteroid', time: '2m ago' },
    { user: 'NovaQueen', text: 'upgraded engine', time: '8m ago' },
    { user: 'CosmicDrifter', text: 'arrived at Cryonix', time: '12m ago' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-80 max-h-[80vh] glass rounded-2xl border border-white/10 p-4 overflow-y-auto shadow-[0_0_30px_rgba(168,85,247,0.3)]"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg"
      >
        ✕
      </button>

      {/* Planet preview */}
      <div className="text-center space-y-2">
        <img src={planet.image} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]" />
        <h2 className="text-2xl font-bold">{planet.name}</h2>
        <p className="text-sm text-purple-300">{planet.title}</p>
        <p className="text-xs text-gray-400">{planet.explorer}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: 'Habitability', value: planet.habitability },
          { label: 'Population', value: planet.population },
          { label: 'Rarity', value: planet.rarity },
        ].map((s) => (
          <div key={s.label} className="glass p-2 rounded-lg text-center">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mt-4">{planet.description}</p>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
          Visit Planet
        </button>
        <button className="flex-1 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition">
          View Profile
        </button>
      </div>

      {/* Social feed */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Activity Feed</h3>
        <div className="space-y-2">
          {feed.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">{f.user[0]}</div>
              <div>
                <span className="font-medium">{f.user}</span> <span className="text-gray-400">{f.text}</span>
                <p className="text-xs text-gray-500">{f.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ship status */}
      <div className="glass p-3 rounded-xl flex items-center gap-3 mt-4">
        <span className="text-2xl">🚀</span>
        <div className="flex-1">
          <p className="text-sm font-semibold">StarVoyager MK-IV</p>
          <div className="h-1.5 bg-white/10 rounded-full mt-1">
            <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-gray-400">Fuel: 67%</p>
        </div>
      </div>
    </motion.div>
  )
}

// ---------- Main Galaxy Map Page ----------
export default function CosmicCompass() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  return (
    <div className="h-screen w-screen bg-[#020617] relative overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
        <div className="glass px-5 py-2.5 rounded-full flex items-center gap-3 w-72 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <input
            placeholder="Search sectors..."
            className="bg-transparent flex-1 text-sm text-white placeholder-gray-400 outline-none"
          />
          <span className="text-gray-400">🔍</span>
        </div>
        <button className="glass px-5 py-2.5 rounded-full text-sm text-gray-300 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-2">
          All Sectors <span className="text-xs">▾</span>
        </button>
      </div>

      {/* Bottom Floating Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {['My Location', 'Bookmarks', 'Filters', 'Jump Gate'].map((btn) => (
          <button
            key={btn}
            className="glass px-5 py-2.5 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white transition shadow-[0_0_15px_rgba(168,85,247,0.2)]">+</button>
        <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white transition shadow-[0_0_15px_rgba(168,85,247,0.2)]">−</button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 12, 20], fov: 55 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        {/* Deep space stars and nebula */}
        <Stars radius={80} depth={60} count={4000} factor={5} saturation={0.3} fade speed={0.5} />
        {/* Spiral galaxy arms – layered glowing rings */}
        <SpiralArm radius={5} color="#a855f7" opacity={0.12} />
        <SpiralArm radius={7} color="#c084fc" opacity={0.1} />
        <SpiralArm radius={9} color="#22d3ee" opacity={0.08} />
        <SpiralArm radius={11} color="#a855f7" opacity={0.06} />
        <GalaxyCore />
        <OrbitControls enableDamping dampingFactor={0.08} maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={30} />
        {systemPlanets.map((p) => (
          <PlanetMarker key={p.id} planet={p} onClick={setSelectedPlanet} />
        ))}
      </Canvas>

      {/* Right Info Panel – floating */}
      <AnimatePresence>
        {selectedPlanet && (
          <InfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
