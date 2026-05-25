'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

/* ── Planet data (same orbital distance, evenly spaced angles) ── */
const PLANETS = [
  { id: 'cryonix', name: 'Cryonix', title: 'The Frozen Heart', color: '#4da6ff', img: '/planet-cryonix.png', angle: 0, distance: 40, habitability: 'Low', population: '1.2M', rarity: 'Legendary', explorer: 'AstralNomad', description: 'A mysterious ice planet…' },
  { id: 'solvora', name: 'Solvora', title: 'The Forge World', color: '#ff6b3d', img: '/planet-solvora.png', angle: 45, distance: 40, habitability: 'Extremely Hostile', population: '850K', rarity: 'Legendary', explorer: 'EmberKnight', description: 'A legendary volcanic planet…' },
  { id: 'dunora', name: 'Dunora', title: 'The Timeless Dune', color: '#d9a04a', img: '/planet-dunora.png', angle: 90, distance: 40, habitability: 'Moderate', population: '620K', rarity: 'Legendary', explorer: 'SandWalker', description: 'An ancient desert world…' },
  { id: 'lumerion', name: 'Lumerion', title: 'The Stardust Garden', color: '#e57399', img: '/planet-lumerion.png', angle: 135, distance: 40, habitability: 'Highly Stable', population: '2.1M', rarity: 'Legendary', explorer: 'StarWeaver', description: 'A breathtaking crystal world…' },
  { id: 'verdana', name: 'Verdana', title: 'The Living Breath', color: '#4ee64e', img: '/planet-verdana.png', angle: 180, distance: 40, habitability: 'Extremely High', population: '3.4M', rarity: 'Legendary', explorer: 'GaiaTender', description: 'A legendary living world…' },
  { id: 'zenithor', name: 'Zenithor', title: 'The Machine Core', color: '#b380ff', img: '/planet-zenithor.png', angle: 225, distance: 40, habitability: 'Controlled Synthetic Zones', population: '480K', rarity: 'Legendary', explorer: 'CorePilot', description: 'A colossal artificial world…' },
  { id: 'infernox', name: 'Infernox', title: 'The Eternal Inferno', color: '#ff3333', img: '/planet-infernox.png', angle: 270, distance: 40, habitability: 'Near Impossible', population: '210K', rarity: 'Mythic Legendary', explorer: 'PyreLord', description: 'A catastrophic fire planet…' },
  { id: 'glacieron', name: 'Glacieron', title: 'The Eternal Blizzard', color: '#80ccff', img: '/planet-glacieron.png', angle: 315, distance: 40, habitability: 'Extremely Harsh', population: '180K', rarity: 'Mythic Legendary', explorer: 'FrostWarden', description: 'A colossal frozen titan…' },
]

export default function CosmicCompass() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.01) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <SpaceBackground />
      <Navbar />

      {/* Full‑screen galaxy background that blends naturally */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/galaxy.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 70%)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0) 70%)',
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-between pt-20 pb-4 px-4">
        {/* Top controls */}
        <div className="w-full max-w-3xl flex gap-3 mb-2">
          <div className="glass-dark flex-1 px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <input
              placeholder="Search sectors..."
              className="bg-transparent flex-1 text-sm text-white placeholder-gray-500 outline-none"
            />
            <span className="text-gray-500 text-sm">🔍</span>
          </div>
          <button className="glass-dark px-4 py-2.5 rounded-full text-sm text-gray-400 border border-white/10 flex items-center gap-2">
            All Sectors <span className="text-xs">▾</span>
          </button>
        </div>

        {/* Galaxy Viewport with planets */}
        <div className="relative w-full max-w-[700px] aspect-square mx-auto my-auto">
          {/* Holographic center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
            <div className="text-[10px] tracking-[0.3em] text-purple-300/70 font-semibold">THE CORE</div>
            <div className="text-[8px] text-gray-500">Astira Central Hub</div>
          </div>

          {/* Planet layer (rotates) */}
          <div
            className="absolute inset-0 z-10"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {PLANETS.map((planet) => {
              const rad = (planet.angle * Math.PI) / 180
              // distance now same for all, so radius = 40% of container width
              const centerX = 50 + (planet.distance / 50) * 40 * Math.cos(rad)
              const centerY = 50 + (planet.distance / 50) * 40 * Math.sin(rad)
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
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:border-white/50"
                    style={{ boxShadow: `0 0 15px ${planet.color}40` }}
                  >
                    <img
                      src={planet.img}
                      alt={planet.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-[9px] text-white mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {planet.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex gap-3 mt-2">
          {['My Location', 'Filters', 'Jump Gate'].map((btn) => (
            <button
              key={btn}
              className="glass-dark px-4 py-2 rounded-full text-sm text-gray-400 border border-white/10 hover:bg-white/10 transition shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Planet Info Bottom Card */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full z-50 max-h-[50vh] overflow-y-auto glass-dark rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="p-5 space-y-3">
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
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
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
                  <div key={s.label} className="glass-dark p-2 rounded-lg text-center">
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

      <style jsx global>{`
        .glass-dark {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  )
}
