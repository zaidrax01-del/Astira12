'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Cryonix',
    username: '@IceWalker',
    image: '/planet-cryonix.png',
    color: '#3b82f6',
    x: '18%',
    y: '30%',
    size: 90,
    ring: true,
  },
  {
    id: 2,
    name: 'Lumerion',
    username: '@CrystalLover',
    image: '/planet-lumerion.png',
    color: '#a855f7',
    x: '50%',
    y: '18%',
    size: 85,
    ring: true,
  },
  {
    id: 3,
    name: 'Verdana',
    username: '@GreenThumb',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '72%',
    y: '32%',
    size: 95,
    ring: true,
  },
  {
    id: 4,
    name: 'Zenithor',
    username: '@MechaMind',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '82%',
    y: '54%',
    size: 82,
    ring: false,
  },
  {
    id: 5,
    name: 'Auroria',
    username: '@SkyDreamer',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '70%',
    y: '76%',
    size: 88,
    ring: true,
  },
  {
    id: 6,
    name: 'Nexoria',
    username: '@VoidSeeker',
    image: '/planet-nexoria.png',
    color: '#9333ea',
    x: '50%',
    y: '88%',
    size: 92,
    ring: false,
  },
  {
    id: 7,
    name: 'Dunora',
    username: '@DuneRider',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '28%',
    y: '78%',
    size: 90,
    ring: true,
  },
  {
    id: 8,
    name: 'Solvora',
    username: '@Flameborn',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '8%',
    y: '58%',
    size: 86,
    ring: true,
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2])

  return (
    <div className="relative w-screen min-h-[100svh] overflow-hidden bg-black text-white">
      {/* STAR BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover bg-center opacity-70" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* GALAXY */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* OUTER GLOW */}
        <div className="absolute w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full bg-purple-700/20 blur-[120px]" />

        {/* GALAXY IMAGE */}
        <motion.img
          src="/galaxy.png"
          alt="Galaxy"
          animate={{ rotate: 360 }}
          transition={{
            duration: 300,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="
            relative
            w-[95vw]
            h-[95vw]
            max-w-[950px]
            max-h-[950px]
            object-contain
            opacity-90
            pointer-events-none
            select-none
          "
          style={{
            filter:
              'drop-shadow(0 0 80px rgba(168,85,247,0.7))',
          }}
        />

        {/* CENTER LIGHT */}
        <div className="absolute w-32 h-32 rounded-full bg-white blur-[60px] opacity-70" />
      </div>

      {/* ORBITS */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-30">
          <circle
            cx="50%"
            cy="50%"
            r="180"
            stroke="rgba(0,255,255,0.3)"
            strokeDasharray="8 10"
            fill="none"
          />

          <circle
            cx="50%"
            cy="50%"
            r="280"
            stroke="rgba(168,85,247,0.25)"
            strokeDasharray="8 12"
            fill="none"
          />
        </svg>
      </div>

      {/* SEARCH BAR */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex gap-3 w-[95%] md:w-auto">
        <div className="flex-1 md:w-[520px] h-12 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center px-4">
          <span className="text-white/40">🔍</span>

          <input
            placeholder="Search planets..."
            className="bg-transparent outline-none w-full ml-3 text-sm text-white placeholder:text-white/30"
          />
        </div>

        <button className="h-12 px-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-sm">
          All Sectors ▾
        </button>
      </div>

      {/* LEFT PANELS */}
      <div className="absolute left-3 top-24 z-40 flex flex-col gap-4 scale-[0.8] md:scale-100 origin-top-left">
        <div className="w-[220px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
          <h3 className="text-xs tracking-[0.2em] text-white/70 mb-4">
            LIVE EVENTS
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p>Cosmic Storm</p>
              <p className="text-purple-400 text-xs">
                Double evolution chance
              </p>
            </div>

            <div>
              <p>Star Fair</p>
              <p className="text-cyan-400 text-xs">
                Visit the Star Fair
              </p>
            </div>

            <div>
              <p>Planet Party</p>
              <p className="text-green-400 text-xs">
                Live now
              </p>
            </div>
          </div>
        </div>

        <div className="w-[220px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
          <h3 className="text-xs tracking-[0.2em] text-white/70 mb-4">
            STAR MAP LEGEND
          </h3>

          <div className="space-y-2 text-xs text-white/60">
            <div>Featured Planet</div>
            <div>Original Planet</div>
            <div>Player Planet</div>
            <div>Event Planet</div>
            <div>Trade Hub</div>
          </div>
        </div>
      </div>

      {/* RIGHT INFO PANEL */}
      <div className="absolute right-3 top-20 z-40 w-[180px] md:w-[320px] rounded-3xl border border-cyan-400/20 bg-black/50 backdrop-blur-2xl p-3 md:p-5">
        <img
          src={selectedPlanet.image}
          className="w-full h-[120px] md:h-[220px] rounded-2xl object-cover"
        />

        <div className="mt-3">
          <h2 className="text-lg md:text-3xl font-semibold">
            {selectedPlanet.name}
          </h2>

          <p className="text-white/50 text-xs md:text-sm">
            {selectedPlanet.username}
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] md:text-sm">
            <div>
              <p className="text-white/40">
                Habitability
              </p>

              <p className="text-green-400">
                High
              </p>
            </div>

            <div>
              <p className="text-white/40">
                Population
              </p>

              <p>210</p>
            </div>

            <div>
              <p className="text-white/40">
                Rarity
              </p>

              <p className="text-pink-400">
                Legendary
              </p>
            </div>
          </div>

          <button className="w-full mt-4 h-10 md:h-14 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-sm md:text-lg font-semibold">
            Visit Planet
          </button>
        </div>
      </div>

      {/* CORE LABEL */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <div className="text-4xl md:text-7xl text-white">
          ✦
        </div>

        <h2 className="text-sm md:text-2xl font-bold tracking-[0.3em]">
          THE CORE
        </h2>

        <p className="text-white/50 mt-1 text-xs md:text-base">
          Astira Central Hub
        </p>
      </div>

      {/* PLANETS */}
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          initial={{ y: 0 }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4 + planet.id,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onClick={() => setSelectedPlanet(planet)}
          className="absolute z-20 cursor-pointer group"
          style={{
            left: planet.x,
            top: planet.y,
          }}
        >
          <div
            className="relative rounded-full"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
            }}
          >
            {/* GLOW */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-80"
              style={{
                background: planet.color,
              }}
            />

            {/* RING */}
            {planet.ring && (
              <div
                className="absolute inset-[-8%] rounded-full border"
                style={{
                  borderColor: `${planet.color}80`,
                }}
              />
            )}

            {/* PLANET */}
            <img
              src={planet.image}
              className="relative w-full h-full rounded-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          <div className="mt-2 text-center">
            <h3 className="text-sm md:text-xl font-medium">
              {planet.name}
            </h3>

            <p className="text-white/40 text-[10px] md:text-sm">
              {planet.username}
            </p>
          </div>
        </motion.div>
      ))}

      {/* BOTTOM BUTTONS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 md:gap-4 scale-[0.85] md:scale-100">
        {[
          ['📍', 'My Location'],
          ['🔖', 'Bookmarks'],
          ['⚙️', 'Filters'],
          ['🚀', 'Jump Gate'],
        ].map((item) => (
          <button
            key={item[1]}
            className="h-11 px-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-2 text-xs md:text-sm hover:bg-white/10 transition"
          >
            <span>{item[0]}</span>
            {item[1]}
          </button>
        ))}
      </div>

      {/* ZOOM */}
      <div className="absolute right-4 bottom-24 md:bottom-10 z-50 flex gap-2">
        <button className="w-11 h-11 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center">
          －
        </button>

        <button className="w-11 h-11 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center">
          ＋
        </button>
      </div>
    </div>
  )
}
