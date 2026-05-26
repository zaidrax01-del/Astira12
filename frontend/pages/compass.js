'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Cryonix',
    image: '/planet-cryonix.png',
    color: '#3b82f6',
    x: '18%',
    y: '34%',
    size: 140,
  },
  {
    id: 2,
    name: 'Lumerion',
    image: '/planet-lumerion.png',
    color: '#9333ea',
    x: '50%',
    y: '20%',
    size: 120,
  },
  {
    id: 3,
    name: 'Verdana',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '78%',
    y: '34%',
    size: 150,
  },
  {
    id: 4,
    name: 'Zenithor',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '86%',
    y: '58%',
    size: 115,
  },
  {
    id: 5,
    name: 'Auroria',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '72%',
    y: '78%',
    size: 130,
  },
  {
    id: 6,
    name: 'Nexoria',
    image: '/planet-nexoria.png',
    color: '#a855f7',
    x: '50%',
    y: '90%',
    size: 145,
  },
  {
    id: 7,
    name: 'Dunora',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '28%',
    y: '80%',
    size: 125,
  },
  {
    id: 8,
    name: 'Solvora',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '8%',
    y: '58%',
    size: 120,
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])

  return (
    <div className="relative w-screen h-[100svh] overflow-hidden bg-black text-white">
      {/* MAIN SPACE BACKGROUND */}
      <div className="absolute inset-0 bg-[#02010a]" />

      {/* STARS */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 200px 200px',
          backgroundPosition: '0 0, 40px 60px',
        }}
      />

      {/* PURPLE NEBULA */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-700/20 blur-[140px]" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[160px]" />

        <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-purple-500/20 blur-[150px]" />
      </div>

      {/* CINEMATIC VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* MAIN GALAXY ATMOSPHERE */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* OUTER GLOW */}
        <div className="absolute w-[120vw] h-[120vw] rounded-full bg-purple-600/10 blur-[180px]" />

        {/* GALAXY CORE */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 300,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[110vw] h-[110vw] rounded-full"
          style={{
            background: `
              radial-gradient(circle at center,
                rgba(255,255,255,1) 0%,
                rgba(255,120,255,0.95) 6%,
                rgba(140,80,255,0.9) 12%,
                rgba(40,20,90,0.7) 20%,
                rgba(10,10,30,0) 65%
              )
            `,
            filter:
              'blur(1px) drop-shadow(0 0 120px rgba(168,85,247,0.9))',
          }}
        />

        {/* SPIRAL LAYERS */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 180 + i * 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute rounded-full border"
            style={{
              width: `${55 + i * 10}vw`,
              height: `${55 + i * 10}vw`,
              borderColor:
                i % 2 === 0
                  ? 'rgba(168,85,247,0.18)'
                  : 'rgba(59,130,246,0.15)',
              boxShadow:
                '0 0 40px rgba(168,85,247,0.35)',
            }}
          />
        ))}

        {/* CENTER LIGHT */}
        <div className="absolute w-40 h-40 rounded-full bg-white blur-[90px] opacity-90" />
      </div>

      {/* TOP NAV */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[96%]">
        <div className="h-16 rounded-[28px] border border-white/10 bg-black/30 backdrop-blur-2xl flex items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <h1 className="text-xl font-bold tracking-[0.3em]">
              ASTIRA
            </h1>

            <div className="hidden md:flex gap-8 text-sm text-white/70">
              <button>Home</button>
              <button>Create</button>
              <button className="text-white">
                Galaxy Map
              </button>
              <button>Market</button>
              <button>DAO</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 h-10 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center">
              12,450 AST
            </div>

            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500" />
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex gap-3 w-[92%] max-w-[820px]">
        <div className="flex-1 h-14 rounded-full bg-black/30 border border-white/10 backdrop-blur-2xl flex items-center px-5">
          <span className="text-white/40 text-lg">🔍</span>

          <input
            placeholder="Search planets, explorers, coordinates..."
            className="bg-transparent outline-none w-full ml-4 text-sm placeholder:text-white/30"
          />
        </div>

        <button className="px-6 rounded-full bg-black/30 border border-white/10 backdrop-blur-2xl">
          All Sectors ▾
        </button>
      </div>

      {/* LEFT PANEL */}
      <div className="absolute left-5 top-36 z-40">
        <div className="w-[260px] rounded-[32px] bg-black/35 border border-white/10 backdrop-blur-2xl p-6 mb-4 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          <h3 className="text-xs tracking-[0.35em] text-white/60 mb-5">
            LIVE EVENTS
          </h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium">
                Cosmic Storm
              </p>

              <p className="text-sm text-purple-400">
                Double evolution chance
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Star Fair
              </p>

              <p className="text-sm text-cyan-400">
                Visit the Star Fair
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Planet Party
              </p>

              <p className="text-sm text-green-400">
                Live now
              </p>
            </div>
          </div>
        </div>

        <div className="w-[260px] rounded-[32px] bg-black/35 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          <h3 className="text-xs tracking-[0.35em] text-white/60 mb-5">
            STAR MAP LEGEND
          </h3>

          <div className="space-y-3 text-sm text-white/70">
            <div>✦ Featured Planet</div>
            <div>⬡ Trade Hub</div>
            <div>⬢ Jump Gate</div>
            <div>◎ Explorer Planet</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="absolute right-5 top-32 z-40 w-[320px] rounded-[34px] bg-black/40 border border-white/10 backdrop-blur-2xl p-5 shadow-[0_0_80px_rgba(168,85,247,0.2)]">
        <img
          src={selectedPlanet.image}
          className="w-full h-[190px] rounded-[24px] object-cover"
        />

        <h2 className="mt-5 text-3xl font-semibold">
          {selectedPlanet.name}
        </h2>

        <p className="text-white/50 mt-1">
          The Living Breath
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="text-white/40">Habitability</p>

            <p className="text-green-400 mt-1">
              High
            </p>
          </div>

          <div>
            <p className="text-white/40">Population</p>

            <p className="mt-1">210</p>
          </div>

          <div>
            <p className="text-white/40">Rarity</p>

            <p className="text-pink-400 mt-1">
              Legendary
            </p>
          </div>
        </div>

        <p className="text-sm text-white/60 leading-relaxed mt-6">
          A lush world filled with ancient forests,
          glowing rivers, and vibrant ecosystems
          thriving under cosmic light.
        </p>

        <button className="w-full mt-7 h-14 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-sm font-semibold shadow-[0_0_40px_rgba(168,85,247,0.5)]">
          Visit Planet
        </button>
      </div>

      {/* CENTER CORE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="text-8xl text-white drop-shadow-[0_0_60px_white]"
        >
          ✦
        </motion.div>

        <h2 className="text-2xl tracking-[0.4em] font-bold mt-3">
          THE CORE
        </h2>

        <p className="text-sm text-white/50 mt-2">
          Astira Central Hub
        </p>
      </div>

      {/* PLANETS */}
      {planets.map((planet, index) => (
        <motion.div
          key={planet.id}
          animate={{
            y: [0, -18, 0],
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.08,
          }}
          onClick={() => setSelectedPlanet(planet)}
          className="absolute z-20 cursor-pointer"
          style={{
            left: planet.x,
            top: planet.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* PLANET GLOW */}
          <div
            className="absolute inset-0 rounded-full blur-[60px] opacity-80"
            style={{
              background: planet.color,
            }}
          />

          {/* ORBIT RINGS */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-15%] rounded-full border"
            style={{
              borderColor: `${planet.color}80`,
            }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 25 + index * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-28%] rounded-full border border-dashed"
            style={{
              borderColor: `${planet.color}40`,
            }}
          />

          {/* PLANET */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: planet.size,
              height: planet.size,
              boxShadow: `0 0 80px ${planet.color}`,
            }}
          >
            <img
              src={planet.image}
              className="w-full h-full object-cover"
            />
          </div>

          {/* LABEL */}
          <div className="mt-5 text-center">
            <h3 className="text-lg font-semibold">
              {planet.name}
            </h3>

            <p className="text-sm text-white/50">
              Explorer Planet
            </p>
          </div>
        </motion.div>
      ))}

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        {[
          '📍 My Location',
          '🔖 Bookmarks',
          '⚙️ Filters',
          '🚀 Jump Gate',
        ].map((item) => (
          <button
            key={item}
            className="h-14 px-6 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-2xl text-sm shadow-[0_0_40px_rgba(168,85,247,0.12)]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
