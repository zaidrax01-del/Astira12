'use client'
import { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'
import * as THREE from 'three'

// Mock coordinate generator (will be replaced by backend coordinates later)
const generateCoordinates = (planetId) => ({
  galaxy: 'Orion Cluster',
  sector: Math.floor(Math.random() * 100) + 1,
  x: Math.floor(Math.random() * 10000) - 5000,
  y: Math.floor(Math.random() * 10000) - 5000,
  z: Math.floor(Math.random() * 10000) - 5000,
})

export default function UniverseExplorer() {
  const { account } = useContext(Web3Context)
  const [mode, setMode] = useState('universe') // 'universe' | 'explorer'
  const [planets, setPlanets] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    hasRings: false,
    hasMoons: false,
  })
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [cameraTarget, setCameraTarget] = useState(null) // for cinematic zoom
  const [explorerStats, setExplorerStats] = useState({
    wallet: account?.slice(0,6)+'...'+account?.slice(-4),
    discovered: 0,
    minted: 0,
    legendary: 0,
    mythic: 0,
    totalExpeditions: 0,
  })

  // Fetch planets based on mode
  useEffect(() => {
    if (mode === 'universe') {
      fetchPublicPlanets()
    } else if (mode === 'explorer' && account) {
      fetchExplorerPlanets()
    }
  }, [mode, account, filters, search])

  const fetchPublicPlanets = async () => {
    try {
      // Replace with actual endpoint when ready
      const resp = await api.get('/compass/planets', {
        params: { page: 1, per_page: 100, search, type: filters.type, rarity: filters.rarity }
      })
      setPlanets(resp.data.planets.map(p => ({
        ...p,
        coordinates: generateCoordinates(p.id),
        // mock extra fields for now
        atmosphere: 'Variable',
        rings: false,
        moons: 0,
        minted: false,
        discoveryDate: p.created_at,
      })))
    } catch (err) {
      console.error(err)
    }
  }

  const fetchExplorerPlanets = async () => {
    if (!account) return
    try {
      // Placeholder – will need a new backend endpoint
      const resp = await api.get('/compass/planets', {
        params: { page: 1, per_page: 100, creator: account }
      })
      setPlanets(resp.data.planets.map(p => ({
        ...p,
        coordinates: generateCoordinates(p.id),
        minted: false,
      })))
      // Update stats
      setExplorerStats(prev => ({
        ...prev,
        discovered: resp.data.total,
        minted: 0, // to be implemented
        legendary: resp.data.planets.filter(p => p.rarity === 'Legendary').length,
        mythic: resp.data.planets.filter(p => p.rarity === 'Mythic').length,
        totalExpeditions: resp.data.planets.length,
      }))
    } catch (err) { console.error(err) }
  }

  // Camera animation to planet
  const focusOnPlanet = useCallback((planet) => {
    setSelectedPlanet(planet)
    // Will move camera via a ref in the 3D scene
    setCameraTarget(planet.coordinates)
  }, [])

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      <SpaceBackground />
      <Navbar />

      {/* Top control bar */}
      <div className="absolute top-20 left-4 right-4 z-20 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          {/* Mode toggle */}
          <button
            onClick={() => setMode('universe')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'universe' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'}`}
          >
            Universe
          </button>
          <button
            onClick={() => setMode('explorer')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'explorer' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'}`}
            disabled={!account}
          >
            My Discoveries
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
            <input
              placeholder="Search by name, ID, DNA..."
              className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-48"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="text-gray-400">🔍</span>
          </div>
          {/* Filter dropdowns */}
          <select
            className="glass px-3 py-2 rounded-full text-sm text-gray-300 border border-white/10 outline-none"
            value={filters.type}
            onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="Terrestrial">Terrestrial</option>
            <option value="Oceanic">Oceanic</option>
            {/* ... add all planet types */}
          </select>
          <select
            className="glass px-3 py-2 rounded-full text-sm text-gray-300 border border-white/10 outline-none"
            value={filters.rarity}
            onChange={e => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
          >
            <option value="">All Rarity</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>
      </div>

      {/* 3D Universe Canvas */}
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <Stars radius={200} depth={100} count={10000} factor={8} saturation={0} fade speed={0.3} />
          <UniverseScene planets={planets} focusOnPlanet={focusOnPlanet} cameraTarget={cameraTarget} />
          <OrbitControls enableDamping dampingFactor={0.1} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={100} />
        </Canvas>
      </div>

      {/* Planet overlay */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetOverlay planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
        )}
      </AnimatePresence>

      {/* Explorer stats bar */}
      {mode === 'explorer' && account && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
          <div className="glass px-6 py-3 rounded-full flex gap-6 text-sm border border-white/10">
            <span>Wallet: {explorerStats.wallet}</span>
            <span>Discovered: {explorerStats.discovered}</span>
            <span>Minted: {explorerStats.minted}</span>
            <span>Legendary: {explorerStats.legendary}</span>
            <span>Mythic: {explorerStats.mythic}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// 3D Scene component with planets
function UniverseScene({ planets, focusOnPlanet, cameraTarget }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Smooth camera movement to selected planet
  useEffect(() => {
    if (cameraTarget && controlsRef.current) {
      // Animate camera position to planet coordinates
      const targetPos = new THREE.Vector3(
        cameraTarget.x / 1000, // scale down for visual
        cameraTarget.y / 1000,
        cameraTarget.z / 1000
      )
      controlsRef.current.target.copy(targetPos)
      camera.position.lerp(targetPos.clone().add(new THREE.Vector3(5, 3, 5)), 0.1)
    }
  }, [cameraTarget, camera])

  return (
    <>
      {planets.map((planet) => {
        const pos = planet.coordinates
          ? [pos.x / 1000, pos.y / 1000, pos.z / 1000]
          : [0, 0, 0]
        return (
          <PlanetInSpace
            key={planet.id}
            planet={planet}
            position={pos}
            onClick={() => focusOnPlanet(planet)}
          />
        )
      })}
      {/* Forward OrbitControls ref for external control */}
      <OrbitControls ref={controlsRef} />
    </>
  )
}

// Individual planet in 3D space
function PlanetInSpace({ planet, position, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const size = planet.rarity === 'Legendary' ? 1.5 : planet.rarity === 'Mythic' ? 2 : 1
  const rotationSpeed = planet.rarity === 'Legendary' ? 0.1 : 0.2

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(planet)}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(planet.image_url)}
        roughness={0.4}
        metalness={0.1}
        emissive={hovered ? '#444' : '#000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
      <Html center distanceFactor={15}>
        <div
          className={`text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          {planet.name}
        </div>
      </Html>
    </mesh>
  )
}

// Planet information overlay
function PlanetOverlay({ planet, onClose }) {
  const coords = planet.coordinates || { galaxy: 'Unknown', sector: 0, x: 0, y: 0, z: 0 }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
    >
      <motion.div
        className="glass p-6 rounded-2xl border border-white/10 max-w-lg w-full pointer-events-auto overflow-y-auto max-h-[80vh]"
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
        <div className="text-center space-y-2">
          <img src={planet.image_url} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-bold">{planet.name}</h2>
          <p className="text-sm text-purple-300">{planet.title}</p>
        </div>
        {/* Passport details */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {[
            ['Planet DNA', planet.dna || 'N/A'],
            ['Coordinates', `${coords.galaxy}, Sec ${coords.sector}`],
            ['X / Y / Z', `${coords.x} / ${coords.y} / ${coords.z}`],
            ['Type', planet.planet_type],
            ['Rarity', planet.rarity],
            ['Atmosphere', planet.atmosphere || 'Unknown'],
            ['Moons', planet.moons || '0'],
            ['Rings', planet.rings ? 'Yes' : 'No'],
            ['Minted', planet.minted ? 'Yes' : 'No'],
            ['Discovery Date', planet.discoveryDate || 'Unknown'],
          ].map(([label, val], i) => (
            <div key={i} className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-gray-400">{label}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>
        {planet.description && <p className="text-sm text-gray-300 mt-2">{planet.description}</p>}
      </motion.div>
    </motion.div>
  )
}
