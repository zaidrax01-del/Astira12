'use client'
import { useState, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ---------- 8 planets ----------
const systemPlanets = [
  {
    id: 'cryonix', name: 'Cryonix', title: 'The Frozen Heart', color: '#4da6ff',
    orbitRadius: 8, angle: 0.3, image: '/planet-cryonix.png',
    explorer: 'AstralNomad', population: '1.2M', habitability: 'Low', rarity: 'Legendary',
    description: 'A mysterious ice planet drifting through the outer reaches of the Astira galaxy…',
  },
  {
    id: 'solvora', name: 'Solvora', title: 'The Forge World', color: '#ff6b3d',
    orbitRadius: 10, angle: 2.1, image: '/planet-solvora.png',
    explorer: 'EmberKnight', population: '850K', habitability: 'Extremely Hostile', rarity: 'Legendary',
    description: 'A legendary volcanic planet born from collapsing stars and endless cosmic fire…',
  },
  {
    id: 'dunora', name: 'Dunora', title: 'The Timeless Dune', color: '#d9a04a',
    orbitRadius: 9, angle: 4.3, image: '/planet-dunora.png',
    explorer: 'SandWalker', population: '620K', habitability: 'Moderate', rarity: 'Legendary',
    description: 'An ancient desert world shaped by endless cosmic winds…',
  },
  {
    id: 'lumerion', name: 'Lumerion', title: 'The Stardust Garden', color: '#e57399',
    orbitRadius: 7, angle: 5.8, image: '/planet-lumerion.png',
    explorer: 'StarWeaver', population: '2.1M', habitability: 'Highly Stable', rarity: 'Legendary',
    description: 'A breathtaking crystal world formed from condensed cosmic stardust…',
  },
  {
    id: 'verdana', name: 'Verdana', title: 'The Living Breath', color: '#4ee64e',
    orbitRadius: 11, angle: 0.9, image: '/planet-verdana.png',
    explorer: 'GaiaTender', population: '3.4M', habitability: 'Extremely High', rarity: 'Legendary',
    description: 'A legendary living world overflowing with cosmic life energy…',
  },
  {
    id: 'zenithor', name: 'Zenithor', title: 'The Machine Core', color: '#b380ff',
    orbitRadius: 9.5, angle: 3.5, image: '/planet-zenithor.png',
    explorer: 'CorePilot', population: '480K', habitability: 'Controlled Synthetic Zones', rarity: 'Legendary',
    description: 'A colossal artificial world forged by an ancient hyper-advanced civilization…',
  },
  {
    id: 'infernox', name: 'Infernox', title: 'The Eternal Inferno', color: '#ff3333',
    orbitRadius: 12, angle: 2.8, image: '/planet-infernox.png',
    explorer: 'PyreLord', population: '210K', habitability: 'Near Impossible', rarity: 'Mythic Legendary',
    description: 'A catastrophic fire planet consumed by endless volcanic chaos…',
  },
  {
    id: 'glacieron', name: 'Glacieron', title: 'The Eternal Blizzard', color: '#80ccff',
    orbitRadius: 14, angle: 1.2, image: '/planet-glacieron.png',
    explorer: 'FrostWarden', population: '180K', habitability: 'Extremely Harsh', rarity: 'Mythic Legendary',
    description: 'A colossal frozen titan trapped in an endless cosmic winter…',
  },
]

// ---------- Galaxy background lying flat ----------
function GalaxyBackground() {
  const texture = useLoader(THREE.TextureLoader, '/galaxy.jpg')
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[45, 30]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ---------- Planet dot orbiting in XZ plane ----------
function PlanetDot({ planet, onClick }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * 0.03
      const x = Math.cos(t + planet.angle) * planet.orbitRadius
      const z = Math.sin(t + planet.angle) * planet.orbitRadius
      groupRef.current.position.x = x
      groupRef.current.position.z = z
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onClick(planet)
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={planet.color} />
        <Html center distanceFactor={15}>
          <div
            className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{
              opacity: hovered ? 1 : 0,
              pointerEvents: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            {planet.name}
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// ---------- Right info panel ----------
function InfoPanel({ planet, onClose }) {
  if (!planet)
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center space-y-4">
          <span className="text-5xl">🪐</span>
          <p>Select a planet to view details</p>
        </div>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="h-full overflow-y-auto p-6 space-y-6"
    >
      <button onClick={onClose} className="text-gray-400 hover:text-white text-lg float-right">
        ✕
      </button>
      <div className="text-center space-y-2">
        <img
          src={planet.image}
          className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]"
        />
        <h2 className="text-2xl font-bold">{planet.name}</h2>
        <p className="text-sm text-purple-300">{planet.title}</p>
        <p className="text-xs text-gray-400">{planet.explorer}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
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
      <p className="text-sm text-gray-300">{planet.description}</p>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
          Visit Planet
        </button>
        <button className="flex-1 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition">
          View Profile
        </button>
      </div>
    </motion.div>
  )
}

// ---------- Main Compass Page ----------
export default function CosmicCompass() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  return (
    <div className="h-screen w-screen bg-black flex">
      {/* LEFT – Galaxy Map (70%) */}
      <div className="w-[70%] h-full relative">
        {/* Floating controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-3 w-64 border border-white/10">
            <input
              placeholder="Search sectors..."
              className="bg-transparent flex-1 text-sm text-white placeholder-gray-400 outline-none"
            />
            <span className="text-gray-400">🔍</span>
          </div>
          <button className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 flex items-center gap-2">
            All Sectors <span className="text-xs">▾</span>
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {['My Location', 'Bookmarks', 'Filters', 'Jump Gate'].map((btn) => (
            <button
              key={btn}
              className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white">
            +
          </button>
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white">
            −
          </button>
        </div>

        <Canvas camera={{ position: [0, 8, 20], fov: 55 }}>
          <ambientLight intensity={0.1} />
          <Stars radius={120} depth={80} count={6000} factor={6} saturation={0.1} fade speed={0.4} />
          <GalaxyBackground />
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            maxPolarAngle={Math.PI / 2}
            minDistance={6}
            maxDistance={50}
          />
          {systemPlanets.map((p) => (
            <PlanetDot key={p.id} planet={p} onClick={setSelectedPlanet} />
          ))}
        </Canvas>
      </div>

      {/* RIGHT – Info Panel (30%) */}
      <div className="w-[30%] h-full glass border-l border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <InfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
      </div>
    </div>
  )
}
