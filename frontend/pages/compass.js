'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Cryonix',
    image: '/planet-cryonix.png',
    color: '#3b82f6',
    x: '22%',
    y: '34%',
  },
  {
    id: 2,
    name: 'Lumerion',
    image: '/planet-lumerion.png',
    color: '#9333ea',
    x: '50%',
    y: '22%',
  },
  {
    id: 3,
    name: 'Verdana',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '76%',
    y: '34%',
  },
  {
    id: 4,
    name: 'Zenithor',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '84%',
    y: '56%',
  },
  {
    id: 5,
    name: 'Auroria',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '70%',
    y: '78%',
  },
  {
    id: 6,
    name: 'Nexoria',
    image: '/planet-nexoria.png',
    color: '#a855f7',
    x: '50%',
    y: '88%',
  },
  {
    id: 7,
    name: 'Dunora',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '28%',
    y: '78%',
  },
  {
    id: 8,
    name: 'Solvora',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '10%',
    y: '58%',
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])

  return (
    <div className="relative w-screen h-[100svh] overflow-hidden bg-black text-white">
      {/* STARS BACKGROUND */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "url('/stars-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* MAIN GALAXY */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* BIG PURPLE GLOW */}
        <div className="absolute w-[90vw] h-[90vw] rounded-full bg-purple-700/30 blur-[120px]" />

        {/* ROTATING GALAXY */}
        <motion.img
          src="/galaxy.jpg"
          alt="Galaxy"
          animate={{ rotate: 360 }}
          transition={{
            duration: 260,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[95vw] h-[95vw] object-cover opacity-100"
          style={{
            filter:
              'drop-shadow(0 0 90px rgba(168,85,247,0.8))',
          }}
        />

        {/* CENTER WHITE GLOW */}
        <div className="absolute w-28 h-28 rounded-full bg-white blur-[60px] opacity-80" />
      </div>

      {/* SEARCH */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 w-[92%]">
        <div className="flex-1 h-11 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center px-4">
          <span className="text-white/40">🔍</span>

          <input
            placeholder="Search planets..."
            className="bg-transparent outline-none w-full ml-3 text-sm placeholder:text-white/30"
          />
        </div>

        <button className="px-4 rounded-full bg-black/40 border border-white/10 text-xs">
          All ▾
        </button>
      </div>

      {/* LEFT PANELS */}
      <div className="absolute left-2 top-20 z-40 scale-[0.78] origin-top-left">
        <div className="w-[190px] rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-4 mb-3">
          <h3 className="text-[10px] tracking-[0.25em] text-white/70 mb-3">
            LIVE EVENTS
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <p>Cosmic Storm</p>
              <p className="text-purple-400">
                Double evolution chance
              </p>
            </div>

            <div>
              <p>Star Fair</p>
              <p className="text-cyan-400">
                Visit the Star Fair
              </p>
            </div>

            <div>
              <p>Planet Party</p>
              <p className="text-green-400">
                Live now
              </p>
            </div>
          </div>
        </div>

        <div className="w-[190px] rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-4">
          <h3 className="text-[10px] tracking-[0.25em] text-white/70 mb-3">
            STAR MAP
          </h3>

          <div className="space-y-2 text-[10px] text-white/60">
            <div>Featured Planet</div>
            <div>Trade Hub</div>
            <div>Jump Gate</div>
          </div>
        </div>
      </div>

      {/* RIGHT INFO PANEL */}
      <div className="absolute right-2 top-20 z-40 w-[175px] rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 p-3">
        <img
          src={selectedPlanet.image}
          className="w-full h-[110px] rounded-2xl object-cover"
        />

        <h2 className="mt-3 text-lg font-semibold">
          {selectedPlanet.name}
        </h2>

        <div className="grid grid-cols-3 gap-1 mt-3 text-[9px]">
          <div>
            <p className="text-white/40">Hab</p>
            <p className="text-green-400">High</p>
          </div>

          <div>
            <p className="text-white/40">Pop</p>
            <p>210</p>
          </div>

          <div>
            <p className="text-white/40">Rare</p>
            <p className="text-pink-400">L</p>
          </div>
        </div>

        <button className="w-full mt-4 h-9 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-xs font-semibold">
          Visit Planet
        </button>
      </div>

      {/* CENTER CORE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <div className="text-5xl text-white drop-shadow-[0_0_30px_white]">
          ✦
        </div>

        <h2 className="text-sm tracking-[0.35em] font-bold">
          THE CORE
        </h2>

        <p className="text-[10px] text-white/50">
          Astira Central Hub
        </p>
      </div>

      {/* PLANETS */}
      {planets.map((planet, index) => (
        <motion.div
          key={planet.id}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onClick={() => setSelectedPlanet(planet)}
          className="absolute z-20 cursor-pointer"
          style={{
            left: planet.x,
            top: planet.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* GLOW */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-80"
            style={{
              background: planet.color,
            }}
          />

          {/* PLANET */}
          <div className="relative w-[72px] h-[72px]">
            <img
              src={planet.image}
              className="w-full h-full rounded-full object-cover"
            />

            {/* ORBIT RING */}
            <div
              className="absolute inset-[-8%] rounded-full border"
              style={{
                borderColor: `${planet.color}90`,
              }}
            />
          </div>

          {/* NAME */}
          <div className="mt-2 text-center">
            <h3 className="text-xs font-semibold">
              {planet.name}
            </h3>
          </div>
        </motion.div>
      ))}

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 scale-75">
        {[
          '📍 My Location',
          '🔖 Bookmarks',
          '⚙️ Filters',
          '🚀 Jump Gate',
        ].map((item) => (
          <button
            key={item}
            className="h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-[10px] backdrop-blur-xl"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
