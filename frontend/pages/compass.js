'use client'
import { useState, useEffect, useContext, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Line, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'
import * as THREE from 'three'

// ---------- Planet data for the galaxy map ----------
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
  {
    id: 'solvora',
    name: 'Solvora',
    title: 'The Forge World',
    element: 'Fire',
    color: '#f97316',
    orbitRadius: 8,
    angle: 2.1,
    image: '/planet-solvora.png',
    explorer: 'EmberKnight',
    population: '850K',
    habitability: 'Extremely Hostile',
    rarity: 'Legendary',
    description: 'A legendary volcanic planet born from collapsing stars and endless cosmic fire.',
  },
  {
    id: 'dunora',
    name: 'Dunora',
    title: 'The Timeless Dune',
    element: 'Earth',
    color: '#d97706',
    orbitRadius: 7,
    angle: 4.3,
    image: '/planet-dunora.png',
    explorer: 'SandWalker',
    population: '620K',
    habitability: 'Moderate',
    rarity: 'Legendary',
    description: 'An ancient desert world shaped by endless cosmic winds and forgotten civilizations.',
  },
  {
    id: 'lumerion',
    name: 'Lumerion',
    title: 'The Stardust Garden',
    element: 'Crystal',
    color: '#ec4899',
    orbitRadius: 5,
    angle: 5.8,
    image: '/planet-lumerion.png',
    explorer: 'StarWeaver',
    population: '2.1M',
    habitability: 'Highly Stable',
    rarity: 'Legendary',
    description: 'A breathtaking crystal world formed from condensed cosmic stardust and ancient celestial energy.',
  },
  {
    id: 'verdana',
    name: 'Verdana',
    title: 'The Living Breath',
    element: 'Nature',
    color: '#22c55e',
    orbitRadius: 9,
    angle: 0.9,
    image: '/planet-verdana.png',
    explorer: 'GaiaTender',
    population: '3.4M',
    habitability: 'Extremely High',
    rarity: 'Legendary',
    description: 'A legendary living world overflowing with cosmic life energy.',
  },
  {
    id: 'zenithor',
    name: 'Zenithor',
    title: 'The Machine Core',
    element: 'Tech',
    color: '#a855f7',
    orbitRadius: 7.5,
    angle: 3.5,
    image: '/planet-zenithor.png',
    explorer: 'CorePilot',
    population: '480K',
    habitability: 'Controlled Synthetic Zones',
    rarity: 'Legendary',
    description: 'A colossal artificial world forged by an ancient hyper-advanced civilization.',
  },
  {
    id: 'nexoria',
    name: 'Nexoria',
    title: 'The Void Nexus',
    element: 'Void',
    color: '#6b21a8',
    orbitRadius: 10,
    angle: 6.1,
    image: '/planet-nexoria.png',
    explorer: 'VoidWatcher',
    population: '120K',
    habitability: 'Unknown',
    rarity: 'Mythic',
    description: 'A dark rift world suspended between dimensions, pulsing with eerie void energy.',
  },
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

// ---------- 3D Components ----------
function PlanetMarker({ planet, onClick, isSelected }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * 0.1
      meshRef.current.position.x = Math.cos(t + planet.angle) * planet.orbitRadius
      meshRef.current.position.z = Math.sin(t + planet.angle) * planet.orbitRadius
      // Keep the HTML billboard facing camera
    }
  })

  return (
    <group>
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 64]} />
        <meshBasicMaterial color={planet.color} opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick(planet) }}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={planet.color} roughness={0.3} metalness={0.8} emissive={planet.color} emissiveIntensity={hovered ? 1 : 0.4} />
        <Html center distanceFactor={15}>
          <div className="flex flex-col items-center" style={{ pointerEvents: 'none' }}>
            <div className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap">{planet.name}</div>
            <div className="text-[10px] text-gray-400">{planet.explorer}</div>
            <div className="text-[10px] text-purple-300">{planet.population}</div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

function GalaxyCore() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#a855f7" />
      <pointLight intensity={2} distance={20} color="#a855f7" />
    </mesh>
  )
}

function TravelRoute({ planets }) {
  // Create a line connecting a few planets (Cryonix → Solvora → Verdana)
  const points = [
    new THREE.Vector3(Math.cos(0.3)*6, 0, Math.sin(0.3)*6),
    new THREE.Vector3(Math.cos(2.1)*8, 0, Math.sin(2.1)*8),
    new THREE.Vector3(Math.cos(0.9)*9, 0, Math.sin(0.9)*9),
  ]
  return <Line points={points} color="#a855f7" lineWidth={1} dashed dashScale={0.5} />
}

// ---------- Left Sidebar ----------
function LeftSidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Create', icon: '✨' },
    { name: 'My Planets', icon: '🪐' },
    { name: 'Galaxy Map', icon: '🌌' },
    { name: 'Market', icon: '📊' },
    { name: 'Events', icon: '🎉' },
    { name: 'DAO', icon: '🏛️' },
    { name: 'Messages', icon: '💬' },
    { name: 'Profile', icon: '👤' },
    { name: 'More', icon: '⋯' },
  ]

  return (
    <aside className="w-[220px] lg:w-[260px] h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" className="w-8 h-8" alt="logo" />
        <span className="text-lg font-bold text-gradient">ASTIRA</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              activeNav === item.name
                ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Player rank card */}
      <div className="glass p-3 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span>🛡️</span>
          <span>Rank: Stellar</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
        </div>
        <p className="text-xs text-gray-400">XP 7,540 / 10,000</p>
      </div>
    </aside>
  )
}

// ---------- Right Info Panel ----------
function RightPanel({ selectedPlanet }) {
  if (!selectedPlanet) return (
    <aside className="w-[300px] lg:w-[360px] h-screen bg-black/30 backdrop-blur-xl border-l border-white/10 p-4 flex flex-col items-center justify-center text-gray-400">
      <span className="text-5xl mb-4">🪐</span>
      <p>Select a planet to view details</p>
    </aside>
  )

  const feed = [
    { user: 'StarPilot', text: 'discovered a new asteroid', time: '2m ago' },
    { user: 'NovaQueen', text: 'upgraded engine', time: '8m ago' },
    { user: 'CosmicDrifter', text: 'arrived at Cryonix', time: '12m ago' },
  ]

  return (
    <aside className="w-[300px] lg:w-[360px] h-screen bg-black/30 backdrop-blur-xl border-l border-white/10 p-4 overflow-y-auto space-y-6">
      {/* Planet preview */}
      <div className="text-center">
        <img src={selectedPlanet.image} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
        <h2 className="text-2xl font-bold mt-2">{selectedPlanet.name}</h2>
        <p className="text-sm text-purple-300">{selectedPlanet.title}</p>
        <p className="text-xs text-gray-400">{selectedPlanet.explorer}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Habitability', value: selectedPlanet.habitability },
          { label: 'Population', value: selectedPlanet.population },
          { label: 'Rarity', value: selectedPlanet.rarity },
        ].map((s) => (
          <div key={s.label} className="glass p-2 rounded-lg">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300">{selectedPlanet.description}</p>

      {/* Buttons */}
      <div className="flex gap-2">
        <GlowButton className="flex-1 !py-2 !text-sm">Visit Planet</GlowButton>
        <button className="flex-1 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:bg-white/5">View Profile</button>
      </div>

      {/* Social feed */}
      <div>
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

      {/* Ship card */}
      <div className="glass p-3 rounded-xl flex items-center gap-3">
        <span className="text-2xl">🚀</span>
        <div className="flex-1">
          <p className="text-sm font-semibold">StarVoyager MK-IV</p>
          <div className="h-1.5 bg-white/10 rounded-full mt-1">
            <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-gray-400">Fuel: 67%</p>
        </div>
      </div>
    </aside>
  )
}

// ---------- Main Compass Page ----------
export default function CosmicCompass() {
  const [activeNav, setActiveNav] = useState('Galaxy Map')
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  return (
    <div className="h-screen flex bg-[#020617] overflow-hidden">
      <LeftSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      {/* Center Map */}
      <div className="flex-1 relative">
        {/* Top search bar + filter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 w-64">
            <input
              placeholder="Search sectors..."
              className="bg-transparent flex-1 text-sm text-white placeholder-gray-500 outline-none"
            />
            <span>🔍</span>
          </div>
          <button className="glass px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-1">
            All Sectors <span>▾</span>
          </button>
        </div>

        {/* Bottom control buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {['My Location', 'Bookmarks', 'Filters', 'Jump Gate'].map((btn) => (
            <button key={btn} className="glass px-4 py-2 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 transition">
              {btn}
            </button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg">+</button>
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg">−</button>
        </div>

        <Canvas camera={{ position: [0, 12, 18], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={0.2} fade speed={0.5} />
          <GalaxyCore />
          <OrbitControls enableDamping dampingFactor={0.1} maxPolarAngle={Math.PI / 2.2} />
          <TravelRoute />
          {/* Spiral galaxy arms (particles) */}
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[4, 12, 128]} />
            <meshBasicMaterial color="#a855f7" opacity={0.1} transparent side={THREE.DoubleSide} />
          </mesh>
          {systemPlanets.map((p) => (
            <PlanetMarker key={p.id} planet={p} onClick={setSelectedPlanet} isSelected={selectedPlanet?.id === p.id} />
          ))}
        </Canvas>
      </div>

      <RightPanel selectedPlanet={selectedPlanet} />
    </div>
  )
}
