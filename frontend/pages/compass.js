'use client'
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// ── Planet data (unchanged) ──
const systemPlanets = [
  { id: 'cryonix', name: 'Cryonix', title: 'The Frozen Heart', element: 'Ice', color: '#4da6ff', orbitRadius: 8, angle: 0.3, image: '/planet-cryonix.png', explorer: 'AstralNomad', population: '1.2M', habitability: 'Low', rarity: 'Legendary', description: 'A mysterious ice planet…' },
  { id: 'solvora', name: 'Solvora', title: 'The Forge World', element: 'Fire', color: '#ff6b3d', orbitRadius: 10, angle: 2.1, image: '/planet-solvora.png', explorer: 'EmberKnight', population: '850K', habitability: 'Extremely Hostile', rarity: 'Legendary', description: 'A legendary volcanic planet…' },
  { id: 'dunora', name: 'Dunora', title: 'The Timeless Dune', element: 'Earth', color: '#d9a04a', orbitRadius: 9, angle: 4.3, image: '/planet-dunora.png', explorer: 'SandWalker', population: '620K', habitability: 'Moderate', rarity: 'Legendary', description: 'An ancient desert world…' },
  { id: 'lumerion', name: 'Lumerion', title: 'The Stardust Garden', element: 'Crystal', color: '#e57399', orbitRadius: 7, angle: 5.8, image: '/planet-lumerion.png', explorer: 'StarWeaver', population: '2.1M', habitability: 'Highly Stable', rarity: 'Legendary', description: 'A breathtaking crystal world…' },
  { id: 'verdana', name: 'Verdana', title: 'The Living Breath', element: 'Nature', color: '#4ee64e', orbitRadius: 11, angle: 0.9, image: '/planet-verdana.png', explorer: 'GaiaTender', population: '3.4M', habitability: 'Extremely High', rarity: 'Legendary', description: 'A legendary living world…' },
  { id: 'zenithor', name: 'Zenithor', title: 'The Machine Core', element: 'Tech', color: '#b380ff', orbitRadius: 9.5, angle: 3.5, image: '/planet-zenithor.png', explorer: 'CorePilot', population: '480K', habitability: 'Controlled Synthetic Zones', rarity: 'Legendary', description: 'A colossal artificial world…' },
  { id: 'infernox', name: 'Infernox', title: 'The Eternal Inferno', element: 'Fire', color: '#ff3333', orbitRadius: 12, angle: 2.8, image: '/planet-infernox.png', explorer: 'PyreLord', population: '210K', habitability: 'Near Impossible', rarity: 'Mythic Legendary', description: 'A catastrophic fire planet…' },
  { id: 'glacieron', name: 'Glacieron', title: 'The Eternal Blizzard', element: 'Ice', color: '#80ccff', orbitRadius: 14, angle: 1.2, image: '/planet-glacieron.png', explorer: 'FrostWarden', population: '180K', habitability: 'Extremely Harsh', rarity: 'Mythic Legendary', description: 'A colossal frozen titan…' },
  { id: 'nexoria', name: 'Nexoria', title: 'The Void Nexus', element: 'Void', color: '#9933ff', orbitRadius: 16, angle: 5.5, image: '/planet-nexoria.png', explorer: 'VoidWatcher', population: '95K', habitability: 'Unknown', rarity: 'Mythic', description: 'A dark rift world…' },
  { id: 'auroria', name: 'Auroria', title: 'The Sapphire Tide', element: 'Water', color: '#4da6ff', orbitRadius: 15, angle: 4.0, image: '/planet-auroria.png', explorer: 'OceanSage', population: '1.9M', habitability: 'High', rarity: 'Epic', description: 'A serene ocean world…' },
]

// ── Photorealistic Galaxy Core ──
function GalaxyCore() {
  const groupRef = useRef()
  const particleRef = useRef()

  // Create a massive particle system for the galaxy
  const particles = useMemo(() => {
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Spiral arms distribution
      const arm = Math.floor(Math.random() * 4)
      const angle = (arm / 4) * Math.PI * 2 + Math.random() * 0.5
      const radius = Math.random() * 15 + 2
      const twist = radius * 0.5
      const x = Math.cos(angle + twist) * radius + (Math.random() - 0.5) * 2
      const z = Math.sin(angle + twist) * radius + (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 1.5

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Color gradient from white/purple core to blue outer
      const color = new THREE.Color()
      const mix = radius / 15
      color.lerpColors(
        new THREE.Color('#ffffff'),
        mix < 0.3 ? new THREE.Color('#c084fc') : new THREE.Color('#3b82f6'),
        mix
      )
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  // Core glow
  const coreTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.1, 'rgba(200, 150, 255, 0.9)')
    gradient.addColorStop(0.4, 'rgba(100, 50, 200, 0.4)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Particle galaxy */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={15000}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={15000}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </points>

      {/* Bright core */}
      <mesh>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial
          map={coreTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </mesh>
      <pointLight intensity={5} distance={40} color="#c084fc" />
    </group>
  )
}

// ── Photorealistic Planet Marker ──
function PlanetMarker({ planet, onClick }) {
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
        onClick={(e) => { e.stopPropagation(); onClick(planet) }}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.3}
          metalness={0.2}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
        <Html center distanceFactor={15}>
          <div className="flex flex-col items-center space-y-1" style={{ pointerEvents: 'none' }}>
            <div className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">
              {planet.name}
            </div>
            <div className="text-[10px] text-gray-400">{planet.explorer}</div>
            <div className="text-[10px] text-purple-300">{planet.population}</div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// ── Info Panel (unchanged, but styled) ──
function InfoPanel({ planet, onClose }) {
  if (!planet) return (
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
      <button onClick={onClose} className="text-gray-400 hover:text-white text-lg float-right">✕</button>
      <div className="text-center space-y-2">
        <img src={planet.image} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]" />
        <h2 className="text-2xl font-bold">{planet.name}</h2>
        <p className="text-sm text-purple-300">{planet.title}</p>
        <p className="text-xs text-gray-400">{planet.explorer}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{ label: 'Habitability', value: planet.habitability }, { label: 'Population', value: planet.population }, { label: 'Rarity', value: planet.rarity }].map(s => (
          <div key={s.label} className="glass p-2 rounded-lg text-center">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-300">{planet.description}</p>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">Visit Planet</button>
        <button className="flex-1 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition">View Profile</button>
      </div>
    </motion.div>
  )
}

// ── Main Page ──
export default function CosmicCompass() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  return (
    <div className="h-screen w-screen bg-black flex">
      {/* LEFT SECTION – Immersive Galaxy */}
      <div className="w-[70%] h-full relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-3 w-64 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <input placeholder="Search sectors..." className="bg-transparent flex-1 text-sm text-white placeholder-gray-400 outline-none" />
            <span className="text-gray-400">🔍</span>
          </div>
          <button className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-2">
            All Sectors <span className="text-xs">▾</span>
          </button>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {['My Location', 'Bookmarks', 'Filters', 'Jump Gate'].map((btn) => (
            <button key={btn} className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition">{btn}</button>
          ))}
        </div>
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white">+</button>
          <button className="glass w-10 h-10 rounded-full flex items-center justify-center text-lg text-gray-300 hover:text-white">−</button>
        </div>

        <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#c084fc" />
          <Stars radius={100} depth={50} count={8000} factor={6} saturation={0.2} fade speed={0.5} />
          <GalaxyCore />
          <OrbitControls enableDamping dampingFactor={0.08} maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={40} />
          {systemPlanets.map((p) => (
            <PlanetMarker key={p.id} planet={p} onClick={setSelectedPlanet} />
          ))}
        </Canvas>
      </div>

      {/* RIGHT SECTION – Info Panel */}
      <div className="w-[30%] h-full glass border-l border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <InfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
      </div>
    </div>
  )
}
