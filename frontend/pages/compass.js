'use client'
import { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Line } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'
import * as THREE from 'three'

// ── Planet data fetcher ──
export default function UniverseExplorer() {
  const { account } = useContext(Web3Context)
  const [mode, setMode] = useState('universe')
  const [planets, setPlanets] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', rarity: '' })
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [cameraTarget, setCameraTarget] = useState(null)
  const [explorerStats, setExplorerStats] = useState({
    wallet: '', discovered: 0, minted: 0, legendary: 0, mythic: 0, totalExpeditions: 0
  })
  const [achievements, setAchievements] = useState([])
  const [universeStats, setUniverseStats] = useState({
    total_explorers: 0, total_planets_discovered: 0, total_planets_minted: 0,
    legendary_planets: 0, mythic_planets: 0, newest_discovery: null, latest_explorer: ''
  })
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    if (mode === 'universe') {
      fetchPublicPlanets()
      fetchUniverseStats()
    } else if (mode === 'explorer' && account) {
      fetchExplorerPlanets()
    }
  }, [mode, account, filters, search])

  const fetchPublicPlanets = async () => {
    try {
      const resp = await api.get('/universe/planets', { params: { page: 1, per_page: 200, search, type: filters.type, rarity: filters.rarity } })
      setPlanets(resp.data.planets)
    } catch (err) { console.error(err) }
  }

  const fetchUniverseStats = async () => {
    try {
      const resp = await api.get('/universe/stats')
      setUniverseStats(resp.data)
    } catch (err) { console.error(err) }
  }

  const fetchExplorerPlanets = async () => {
    if (!account) return
    try {
      const resp = await api.get('/explorer/discoveries', { headers: { 'X-User-Id': account } })
      setPlanets(resp.data.planets)
      setExplorerStats({
        wallet: account.slice(0,6)+'...'+account.slice(-4),
        discovered: resp.data.statistics.total_discovered,
        minted: resp.data.statistics.total_minted,
        legendary: resp.data.statistics.legendary,
        mythic: resp.data.statistics.mythic,
        totalExpeditions: resp.data.statistics.total_expeditions,
      })
      setAchievements(resp.data.achievements)
    } catch (err) { console.error(err) }
  }

  const focusOnPlanet = (planet) => {
    setSelectedPlanet(planet)
    setCameraTarget({ x: planet.coord_x, y: planet.coord_y, z: planet.coord_z })
  }

  // Constellation lines for explorer's planets
  const constellationLines = useMemo(() => {
    if (mode !== 'explorer' || planets.length < 2) return []
    const lines = []
    for (let i = 0; i < planets.length - 1; i++) {
      lines.push({
        start: [planets[i].coord_x/1000, planets[i].coord_y/1000, planets[i].coord_z/1000],
        end: [planets[i+1].coord_x/1000, planets[i+1].coord_y/1000, planets[i+1].coord_z/1000]
      })
    }
    return lines
  }, [planets, mode])

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
          <button onClick={() => setShowArchive(!showArchive)} className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10">
            {showArchive ? 'Hide Archive' : 'Discovery Archive'}
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
            <input placeholder="Search..." className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-40"
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

      {/* Universe stats bar */}
      {mode === 'universe' && (
        <div className="absolute top-40 left-4 right-4 z-20 flex justify-center">
          <div className="glass px-4 py-2 rounded-full flex gap-4 text-xs border border-white/10 overflow-x-auto">
            <span>Explorers: {universeStats.total_explorers}</span>
            <span>Planets: {universeStats.total_planets_discovered}</span>
            <span>Minted: {universeStats.total_planets_minted}</span>
            <span>Legendary: {universeStats.legendary_planets}</span>
            <span>Mythic: {universeStats.mythic_planets}</span>
            {universeStats.newest_discovery && (
              <span>Newest: #{universeStats.newest_discovery.discovery_number} {universeStats.newest_discovery.name}</span>
            )}
            <span>Latest Explorer: {universeStats.latest_explorer}</span>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <Stars radius={200} depth={100} count={10000} factor={8} saturation={0} fade speed={0.3} />
          <UniverseScene planets={planets} focusOnPlanet={focusOnPlanet} cameraTarget={cameraTarget}
            constellationLines={constellationLines} />
        </Canvas>
      </div>

      {/* Planet overlay */}
      <AnimatePresence>
        {selectedPlanet && <PlanetOverlay planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />}
      </AnimatePresence>

      {/* Explorer stats & achievements */}
      {mode === 'explorer' && account && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-center gap-2">
          <div className="glass px-4 py-2 rounded-full flex gap-4 text-xs border border-white/10">
            <span>Wallet: {explorerStats.wallet}</span>
            <span>Discovered: {explorerStats.discovered}</span>
            <span>Minted: {explorerStats.minted}</span>
            <span>Legendary: {explorerStats.legendary}</span>
            <span>Mythic: {explorerStats.mythic}</span>
          </div>
          {achievements.length > 0 && (
            <div className="glass px-4 py-2 rounded-full flex gap-3 text-xs border border-white/10">
              {achievements.map((a, i) => (
                <span key={i} className="text-purple-300">🏅 {a}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discovery Archive sidebar */}
      <AnimatePresence>
        {showArchive && account && (
          <DiscoveryArchive wallet={account} onSelectPlanet={focusOnPlanet} onClose={() => setShowArchive(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// 3D Scene with planets and constellation lines
function UniverseScene({ planets, focusOnPlanet, cameraTarget, constellationLines }) {
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
      {/* Constellation lines */}
      {constellationLines.map((line, i) => (
        <Line key={i} points={[line.start, line.end]} color="#a855f7" lineWidth={1} dashed dashScale={0.5} opacity={0.3} />
      ))}
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />
    </>
  )
}

function PlanetInSpace({ planet, position, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const size = planet.rarity === 'Legendary' ? 1.8 : planet.rarity === 'Mythic' ? 2.2 : planet.size_class === 'Tiny' ? 0.8 : planet.size_class === 'Small' ? 1.0 : 1.3
  const speed = planet.size_class === 'Massive' || planet.size_class === 'Titan' ? 0.05 : 0.15

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
          <p className="text-sm text-purple-300">Discovery #{planet.discovery_number}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {[['Rarity', planet.rarity], ['Size', planet.size_class], ['Value Index', `${planet.value_index}/100`],
            ['Type', planet.planet_type], ['Atmosphere', planet.atmosphere || 'Unknown'], ['Moons', planet.moons || '0'],
            ['Rings', planet.rings || 'No'], ['Events', planet.events || 'None'], ['Minted', planet.minted ? 'Yes' : 'No'],
            ['Rare Discovery', planet.rare_discovery || 'None'], ['Coordinates', coords],
            ['Discovery Date', planet.discovery_date]].map(([label, val], i) => (
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

function DiscoveryArchive({ wallet, onSelectPlanet, onClose }) {
  const [planets, setPlanets] = useState([])
  useEffect(() => {
    if (wallet) {
      api.get('/explorer/discoveries', { headers: { 'X-User-Id': wallet } })
        .then(res => setPlanets(res.data.planets))
        .catch(console.error)
    }
  }, [wallet])

  return (
    <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
      className="absolute left-0 top-20 bottom-0 w-80 bg-black/80 backdrop-blur-xl border-r border-white/10 z-20 overflow-y-auto p-4">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
      <h3 className="text-lg font-bold text-gradient mb-4">Discovery Archive</h3>
      <div className="space-y-2">
        {planets.map(planet => (
          <div key={planet.id} onClick={() => { onSelectPlanet(planet); onClose() }}
            className="glass p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/10 transition">
            <img src={planet.image_url} className="w-10 h-10 rounded-full object-cover" />
            <div className="text-sm">
              <p className="font-semibold">{planet.name}</p>
              <p className="text-xs text-gray-400">#{planet.discovery_number} · {planet.rarity}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
