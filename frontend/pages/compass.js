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

export default function UniverseExplorer() {
  const { account } = useContext(Web3Context)
  const [mode, setMode] = useState('universe')   // 'universe' | 'explorer'
  const [planets, setPlanets] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', rarity: '', hasRings: '', hasMoons: '' })
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [cameraTarget, setCameraTarget] = useState(null)
  const [explorerStats, setExplorerStats] = useState({
    wallet: '',
    discovered: 0,
    minted: 0,
    legendary: 0,
    mythic: 0,
    totalExpeditions: 0,
  })

  useEffect(() => {
    if (mode === 'universe') {
      fetchPublicPlanets()
    } else if (mode === 'explorer' && account) {
      fetchExplorerPlanets()
    }
  }, [mode, account, filters, search])

  const fetchPublicPlanets = async () => {
    try {
      const params = { page: 1, per_page: 200, search, type: filters.type, rarity: filters.rarity }
      if (filters.hasRings) params.has_rings = filters.hasRings
      if (filters.hasMoons) params.has_moons = filters.hasMoons
      const resp = await api.get('/universe/planets', { params })
      setPlanets(resp.data.planets)
    } catch (err) { console.error(err) }
  }

  const fetchExplorerPlanets = async () => {
    if (!account) return
    try {
      const resp = await api.get('/explorer/discoveries', { headers: { 'X-User-Id': account } })
      setPlanets(resp.data.planets)
      const stats = resp.data.statistics
      setExplorerStats({
        wallet: account.slice(0,6)+'...'+account.slice(-4),
        discovered: stats.total_discovered,
        minted: stats.total_minted,
        legendary: stats.legendary,
        mythic: stats.mythic,
        totalExpeditions: stats.total_expeditions,
      })
    } catch (err) { console.error(err) }
  }

  const focusOnPlanet = (planet) => {
    setSelectedPlanet(planet)
    setCameraTarget({ x: planet.coord_x, y: planet.coord_y, z: planet.coord_z })
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      <SpaceBackground />
      <Navbar />
      {/* Top controls */}
      <div className="absolute top-20 left-4 right-4 z-20 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          <button onClick={() => setMode('universe')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'universe' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'}`}>
            Universe
          </button>
          <button onClick={() => setMode('explorer')} disabled={!account}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'explorer' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300'} disabled:opacity-50`}>
            My Discoveries
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
            <input placeholder="Search by name, ID, DNA..." className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-40 md:w-48"
              value={search} onChange={e => setSearch(e.target.value)} />
            <span className="text-gray-400">🔍</span>
          </div>
          <select className="glass px-3 py-2 rounded-full text-sm text-gray-300 border border-white/10 outline-none"
            value={filters.type} onChange={e => setFilters(prev => ({...prev, type: e.target.value}))}>
            <option value="">All Types</option>
            <option value="Terrestrial">Terrestrial</option>
            <option value="Oceanic">Oceanic</option>
            {/* add more types */}
          </select>
          <select className="glass px-3 py-2 rounded-full text-sm text-gray-300 border border-white/10 outline-none"
            value={filters.rarity} onChange={e => setFilters(prev => ({...prev, rarity: e.target.value}))}>
            <option value="">All Rarity</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <Stars radius={200} depth={100} count={10000} factor={8} saturation={0} fade speed={0.3} />
          <UniverseScene planets={planets} focusOnPlanet={focusOnPlanet} cameraTarget={cameraTarget} />
        </Canvas>
      </div>

      <AnimatePresence>
        {selectedPlanet && (
          <PlanetOverlay planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
        )}
      </AnimatePresence>

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

function UniverseScene({ planets, focusOnPlanet, cameraTarget }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (cameraTarget && controlsRef.current) {
      const targetPos = new THREE.Vector3(cameraTarget.x/1000, cameraTarget.y/1000, cameraTarget.z/1000)
      controlsRef.current.target.copy(targetPos)
      camera.position.lerp(targetPos.clone().add(new THREE.Vector3(5, 3, 5)), 0.1)
    }
  }, [cameraTarget, camera])

  return (
    <>
      {planets.map(planet => (
        <PlanetInSpace key={planet.id} planet={planet}
          position={[planet.coord_x/1000, planet.coord_y/1000, planet.coord_z/1000]}
          onClick={() => focusOnPlanet(planet)} />
      ))}
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />
    </>
  )
}

function PlanetInSpace({ planet, position, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const size = planet.rarity === 'Legendary' ? 1.5 : planet.rarity === 'Mythic' ? 2 : 1
  const speed = planet.rarity === 'Legendary' ? 0.1 : 0.2

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * speed
  })

  return (
    <mesh ref={meshRef} position={position}
      onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => onClick(planet)}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={new THREE.TextureLoader().load(planet.image_url)} roughness={0.4} metalness={0.1}
        emissive={hovered ? '#444' : '#000'} emissiveIntensity={hovered ? 0.5 : 0} />
      <Html center distanceFactor={15}>
        <div className={`text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          {planet.name}
        </div>
      </Html>
    </mesh>
  )
}

function PlanetOverlay({ planet, onClose }) {
  const coords = planet.coord_x ? `${planet.coord_x} / ${planet.coord_y} / ${planet.coord_z}` : 'Unknown'
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div className="glass p-6 rounded-2xl border border-white/10 max-w-lg w-full overflow-y-auto max-h-[80vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
        <div className="text-center space-y-2">
          <img src={planet.image_url} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <h2 className="text-2xl font-bold">{planet.name}</h2>
          <p className="text-sm text-purple-300">{planet.planet_type}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {[['Planet DNA', planet.dna || 'N/A'], ['Coordinates', coords], ['Rarity', planet.rarity],
            ['Type', planet.planet_type], ['Atmosphere', planet.atmosphere || 'Unknown'], ['Moons', planet.moons || '0'],
            ['Rings', planet.rings ? 'Yes' : 'No'], ['Minted', planet.minted ? 'Yes' : 'No']].map(([label, val], i) => (
            <div key={i} className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-gray-400">{label}</span><span>{val}</span>
            </div>
          ))}
        </div>
        {planet.description && <p className="text-sm text-gray-300 mt-2">{planet.description}</p>}
      </motion.div>
    </motion.div>
  )
}
