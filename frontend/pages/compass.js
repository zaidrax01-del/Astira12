'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

/* ── Planets (same data, but now with CSS positioning) ── */
const PLANETS = [
  { id: 'cryonix', name: 'Cryonix', title: 'The Frozen Heart', img: '/planet-cryonix.png', angle: 0, distance: 42, color: '#4da6ff' },
  { id: 'solvora', name: 'Solvora', title: 'The Forge World', img: '/planet-solvora.png', angle: 45, distance: 48, color: '#ff6b3d' },
  { id: 'dunora', name: 'Dunora', title: 'The Timeless Dune', img: '/planet-dunora.png', angle: 90, distance: 44, color: '#d9a04a' },
  { id: 'lumerion', name: 'Lumerion', title: 'The Stardust Garden', img: '/planet-lumerion.png', angle: 135, distance: 40, color: '#e57399' },
  { id: 'verdana', name: 'Verdana', title: 'The Living Breath', img: '/planet-verdana.png', angle: 180, distance: 46, color: '#4ee64e' },
  { id: 'zenithor', name: 'Zenithor', title: 'The Machine Core', img: '/planet-zenithor.png', angle: 225, distance: 43, color: '#b380ff' },
  { id: 'infernox', name: 'Infernox', title: 'The Eternal Inferno', img: '/planet-infernox.png', angle: 270, distance: 50, color: '#ff3333' },
  { id: 'glacieron', name: 'Glacieron', title: 'The Eternal Blizzard', img: '/planet-glacieron.png', angle: 315, distance: 47, color: '#80ccff' },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [rotation, setRotation] = useState(0)

  // Slow rotation effect for the orbit layer
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.02) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      <SpaceBackground />
      <Navbar />

      {/* ── Main content ── */}
      <div className="pt-20 px-4 pb-24 flex flex-col items-center min-h-screen">
        {/* Top controls */}
        <div className="flex gap-3 w-full max-w-md mb-6">
          <div className="glass flex-1 px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
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

        {/* ── Galaxy Container (square, centered) ── */}
        <div className="relative w-[90vw] max-w-[500px] aspect-square mb-8">
          {/* Glowing aura behind galaxy */}
          <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl" />

          {/* The galaxy image – centered, contained */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/galaxy.jpg"
              alt="Galaxy"
              className="w-full h-full object-contain rounded-full opacity-90"
              style={{ filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.4))' }}
            />
          </div>

          {/* Orbit layer – rotates slowly */}
          <div
            className="absolute inset-0"
            style={{ transform: `rotate(${rotation}deg)`, transition: 'none' }}
          >
            {PLANETS.map((planet) => {
              const rad = (planet.angle * Math.PI) / 180
              const x = 50 + (planet.distance / 100) * 50 * Math.cos(rad)
              const y = 50 + (planet.distance / 100) * 50 * Math.sin(rad)
              return (
                <div
                  key={planet.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedPlanet(planet)}
                >
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/20 shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:border-white/60"
                    style={{ boxShadow: `0 0 20px ${planet.color}40` }}
                  >
                    <img
                      src={planet.img}
                      alt={planet.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-white mt-1 text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {planet.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom floating controls */}
        <div className="flex gap-3">
          {['My Location', 'Filters', 'Jump Gate'].map((btn) => (
            <button
              key={btn}
              className="glass px-4 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition shadow-[0_0_10px_rgba(168,85,247,0.15)]"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* ── Planet Info Bottom Sheet ── */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full z-50 max-h-[70vh] overflow-y-auto glass rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 space-y-4">
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto" />

              {/* Close button */}
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <img
                  src={selectedPlanet.img}
                  alt={selectedPlanet.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                />
                <h2 className="text-2xl font-bold">{selectedPlanet.name}</h2>
                <p className="text-sm text-purple-300">{selectedPlanet.title}</p>
                <p className="text-xs text-gray-400">{selectedPlanet.explorer}</p>
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

              <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
                Visit Planet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
