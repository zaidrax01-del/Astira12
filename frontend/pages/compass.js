'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ChevronDown,
  Bookmark,
  LocateFixed,
  SlidersHorizontal,
  Rocket,
  Plus,
  Minus,
} from 'lucide-react'

const planets = [
  {
    id: 1,
    name: 'Cryonix',
    username: '@IceWalker',
    image: '/planet-cryonix.png',
    color: '#3b82f6',
    x: '22%',
    y: '28%',
    size: 140,
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
    size: 120,
    ring: true,
  },
  {
    id: 3,
    name: 'Verdana',
    username: '@GreenThumb',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '68%',
    y: '30%',
    size: 150,
    ring: true,
  },
  {
    id: 4,
    name: 'Zenithor',
    username: '@MechaMind',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '82%',
    y: '50%',
    size: 130,
    ring: false,
  },
  {
    id: 5,
    name: 'Auroria',
    username: '@SkyDreamer',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '70%',
    y: '73%',
    size: 120,
    ring: true,
  },
  {
    id: 6,
    name: 'Nexoria',
    username: '@VoidSeeker',
    image: '/planet-nexoria.png',
    color: '#9333ea',
    x: '50%',
    y: '86%',
    size: 135,
    ring: false,
  },
  {
    id: 7,
    name: 'Dunora',
    username: '@DuneRider',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '28%',
    y: '76%',
    size: 145,
    ring: true,
  },
  {
    id: 8,
    name: 'Solvora',
    username: '@Flameborn',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '8%',
    y: '56%',
    size: 135,
    ring: true,
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* SPACE BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover bg-center opacity-70" />

      {/* PURPLE NEBULA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,0,255,0.25),transparent_55%)]" />

      {/* GALAXY CORE */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(180,100,255,0.9) 10%, rgba(80,0,255,0.5) 30%, rgba(0,0,0,0) 70%)',
          filter: 'blur(1px)',
          boxShadow:
            '0 0 120px rgba(168,85,247,0.6), 0 0 220px rgba(59,130,246,0.35)',
        }}
      />

      {/* GALAXY SWIRL */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 250, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(168,85,247,0.35), rgba(59,130,246,0.15), transparent, rgba(168,85,247,0.35))',
          filter: 'blur(30px)',
        }}
      />

      {/* ORBIT LINES */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="250"
            stroke="rgba(0,255,255,0.2)"
            strokeDasharray="8 10"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="370"
            stroke="rgba(168,85,247,0.15)"
            strokeDasharray="8 12"
            fill="none"
          />
        </svg>
      </div>

      {/* LEFT PANELS */}
      <div className="absolute left-5 top-28 z-40 flex flex-col gap-5">
        <div className="w-[260px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
          <h3 className="text-sm font-semibold tracking-widest text-white/80 mb-4">
            LIVE EVENTS
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-white">Cosmic Storm</p>
              <p className="text-purple-400 text-sm">
                Double evolution chance
              </p>
            </div>

            <div>
              <p className="text-white">Star Fair</p>
              <p className="text-cyan-400 text-sm">Visit the Star Fair</p>
            </div>

            <div>
              <p className="text-white">Planet Party</p>
              <p className="text-green-400 text-sm">Live now</p>
            </div>
          </div>
        </div>

        <div className="w-[260px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
          <h3 className="text-sm font-semibold tracking-widest text-white/80 mb-4">
            STAR MAP LEGEND
          </h3>

          <div className="space-y-3 text-sm text-white/70">
            <div>Featured Planet</div>
            <div>Original Planet</div>
            <div>Player Planet</div>
            <div>Event Planet</div>
            <div>Trade Hub</div>
          </div>
        </div>
      </div>

      {/* RIGHT INFO PANEL */}
      <div className="absolute right-5 top-24 z-40 w-[320px] rounded-3xl border border-cyan-400/20 bg-black/50 backdrop-blur-2xl p-5 shadow-[0_0_50px_rgba(59,130,246,0.25)]">
        <img
          src={selectedPlanet.image}
          className="w-full h-[220px] rounded-2xl object-cover"
        />

        <div className="mt-4">
          <h2 className="text-3xl font-semibold">{selectedPlanet.name}</h2>
          <p className="text-white/50">{selectedPlanet.username}</p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div>
              <p className="text-white/40 text-sm">Habitability</p>
              <p className="text-green-400">High</p>
            </div>

            <div>
              <p className="text-white/40 text-sm">Population</p>
              <p>210</p>
            </div>

            <div>
              <p className="text-white/40 text-sm">Rarity</p>
              <p className="text-pink-400">Legendary</p>
            </div>
          </div>

          <button className="w-full mt-6 h-14 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-lg font-semibold shadow-[0_0_35px_rgba(168,85,247,0.5)]">
            Visit Planet
          </button>
        </div>
      </div>

      {/* TOP SEARCH */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <div className="w-[520px] h-14 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center px-5">
          <Search className="w-5 h-5 text-white/50" />
          <input
            placeholder="Search planets, explorers, coordinates..."
            className="bg-transparent outline-none w-full ml-3 text-white placeholder:text-white/30"
          />
        </div>

        <button className="h-14 px-6 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-2">
          All Sectors
          <ChevronDown size={18} />
        </button>
      </div>

      {/* CENTER LABEL */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <div className="text-[70px] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
          ✦
        </div>

        <h2 className="text-2xl font-bold tracking-[0.3em]">THE CORE</h2>

        <p className="text-white/50 mt-2">Astira Central Hub</p>
      </div>

      {/* PLANETS */}
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          initial={{ y: 0 }}
          animate={{ y: [0, -15, 0] }}
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
                className="absolute inset-[-10%] rounded-full border"
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

          <div className="mt-3 text-center">
            <h3 className="text-2xl font-medium">{planet.name}</h3>
            <p className="text-white/40 text-sm">{planet.username}</p>
          </div>
        </motion.div>
      ))}

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        {[
          {
            icon: <LocateFixed size={18} />,
            label: 'My Location',
          },
          {
            icon: <Bookmark size={18} />,
            label: 'Bookmarks',
          },
          {
            icon: <SlidersHorizontal size={18} />,
            label: 'Filters',
          },
          {
            icon: <Rocket size={18} />,
            label: 'Jump Gate',
          },
        ].map((item) => (
          <button
            key={item.label}
            className="h-14 px-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-3 hover:bg-white/10 transition"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* ZOOM BUTTONS */}
      <div className="absolute right-[360px] bottom-10 z-50 flex gap-3">
        <button className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center">
          <Minus />
        </button>

        <button className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-center">
          <Plus />
        </button>
      </div>
    </div>
  )
}
