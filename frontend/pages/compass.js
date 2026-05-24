'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

/* ── Planet data ── */
const PLANETS = [
  {
    id: 'cryonix', name: 'Cryonix', title: 'The Frozen Heart', color: '#4da6ff',
    img: '/planet-cryonix.png', angle: 0, distance: 38, habitability: 'Low',
    population: '1.2M', rarity: 'Legendary', explorer: 'AstralNomad',
    description: 'A mysterious ice planet drifting through the outer reaches of the Astira galaxy…',
  },
  {
    id: 'solvora', name: 'Solvora', title: 'The Forge World', color: '#ff6b3d',
    img: '/planet-solvora.png', angle: 45, distance: 44, habitability: 'Extremely Hostile',
    population: '850K', rarity: 'Legendary', explorer: 'EmberKnight',
    description: 'A legendary volcanic planet born from collapsing stars and endless cosmic fire…',
  },
  {
    id: 'dunora', name: 'Dunora', title: 'The Timeless Dune', color: '#d9a04a',
    img: '/planet-dunora.png', angle: 90, distance: 40, habitability: 'Moderate',
    population: '620K', rarity: 'Legendary', explorer: 'SandWalker',
    description: 'An ancient desert world shaped by endless cosmic winds…',
  },
  {
    id: 'lumerion', name: 'Lumerion', title: 'The Stardust Garden', color: '#e57399',
    img: '/planet-lumerion.png', angle: 135, distance: 36, habitability: 'Highly Stable',
    population: '2.1M', rarity: 'Legendary', explorer: 'StarWeaver',
    description: 'A breathtaking crystal world formed from condensed cosmic stardust…',
  },
  {
    id: 'verdana', name: 'Verdana', title: 'The Living Breath', color: '#4ee64e',
    img: '/planet-verdana.png', angle: 180, distance: 42, habitability: 'Extremely High',
    population: '3.4M', rarity: 'Legendary', explorer: 'GaiaTender',
    description: 'A legendary living world overflowing with cosmic life energy…',
  },
  {
    id: 'zenithor', name: 'Zenithor', title: 'The Machine Core', color: '#b380ff',
    img: '/planet-zenithor.png', angle: 225, distance: 39, habitability: 'Controlled Synthetic Zones',
    population: '480K', rarity: 'Legendary', explorer: 'CorePilot',
    description: 'A colossal artificial world forged by an ancient hyper-advanced civilization…',
  },
  {
    id: 'infernox', name: 'Infernox', title: 'The Eternal Inferno', color: '#ff3333',
    img: '/planet-infernox.png', angle: 270, distance: 46, habitability: 'Near Impossible',
    population: '210K', rarity: 'Mythic Legendary', explorer: 'PyreLord',
    description: 'A catastrophic fire planet consumed by endless volcanic chaos…',
  },
  {
    id: 'glacieron', name: 'Glacieron', title: 'The Eternal Blizzard', color: '#80ccff',
    img: '/planet-glacieron.png', angle: 315, distance: 43, habitability: 'Extremely Harsh',
    population: '180K', rarity: 'Mythic Legendary', explorer: 'FrostWarden',
    description: 'A colossal frozen titan trapped in an endless cosmic winter…',
  },
]

export default function CosmicCompass() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [rotation, setRotation] = useState(0)

  // Slow continuous rotation of the planet layer
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.015) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Deep space starfield (existing component) */}
      <SpaceBackground />

      {/* Navbar */}
      <Navbar />

      {/* ── Full‑screen Galaxy background ── */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%)`,
        }}
      >
        <img
          src="/galaxy.jpg"
          alt=""
          className="w-[180vw] max-w-none h-[180vw] max-h-none object-cover opacity-60"
          style={{
            filter: 'blur(0px) drop-shadow(0 0 40px rgba(168,85,247,0.6))',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* ── Planet layer (rotates slowly) ── */}
      <div
        className="absolute inset-0 z-10"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {PLANETS.map((planet) => {
          const rad = (planet.angle * Math.PI) / 180
          // Position relative to the screen center
          const centerX = 50 + (planet.distance / 50) * 35 * Math.cos(rad)
          const centerY = 50 + (planet.distance / 50) * 35 * Math.sin(rad)
          return (
            <div
              key={planet.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${centerX}%`,
                top: `${centerY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setSelectedPlanet(planet)}
            >
              <div
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 transition-all duration-300 group-hover:scale-125 group-hover:border-white/60"
                style={{ boxShadow: `0 0 25px ${planet.color}60` }}
              >
                <img
                  src={planet.img}
                  alt={planet.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-[10px] sm:text-xs text-white mt-1 text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {planet.name}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Top controls (floating) ── */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex gap-3 w-full max-w-md px-4">
        <div className="glass flex-1 px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <input
            placeholder="Search sectors..."
            className="bg-transparent flex-1 text-sm text-white placeholder-gray-400 outline-none"
          />
          <span className="text-gray-400 text-sm">🔍</span>
        </div>
        <button className="glass px-4 py-2.5 rounded-full text-sm text-gray-300 border border-white/10 flex items-center gap-2">
          All Sectors <span className="text-xs">▾</span>
        </button>
      </div>

      {/* ── Bottom floating controls ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {['My Location', 'Filters', 'Jump Gate'].map((btn) => (
          <button
            key={btn}
            className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition shadow-[0_0_10px_rgba(168,85,247,0.2)]"
          >
            {btn}
          </button>
        ))}
      </div>

      {/* ── Planet Info Bottom Sheet ── */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full z-50 max-h-[55vh] overflow-y-auto glass rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 space-y-3">
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto" />
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedPlanet.img}
                  alt={selectedPlanet.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedPlanet.name}</h2>
                  <p className="text-sm text-purple-300">{selectedPlanet.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Habitability', value: selectedPlanet.habitability },
                  { label: 'Population', value: selectedPlanet.population },
                  { label: 'Rarity', value: selectedPlanet.rarity },
                ].map((s) => (
                  <div key={s.label} className="glass p-2 rounded-lg text-center">
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-300">{selectedPlanet.description}</p>

              <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
                Visit Planet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
