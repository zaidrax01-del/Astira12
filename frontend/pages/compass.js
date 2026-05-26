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
    size: 120,
  },
  {
    id: 2,
    name: 'Lumerion',
    image: '/planet-lumerion.png',
    color: '#9333ea',
    x: '50%',
    y: '20%',
    size: 105,
  },
  {
    id: 3,
    name: 'Verdana',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '80%',
    y: '34%',
    size: 130,
  },
  {
    id: 4,
    name: 'Zenithor',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '88%',
    y: '58%',
    size: 100,
  },
  {
    id: 5,
    name: 'Auroria',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '72%',
    y: '82%',
    size: 120,
  },
  {
    id: 6,
    name: 'Nexoria',
    image: '/planet-nexoria.png',
    color: '#a855f7',
    x: '50%',
    y: '92%',
    size: 125,
  },
  {
    id: 7,
    name: 'Dunora',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '28%',
    y: '82%',
    size: 110,
  },
  {
    id: 8,
    name: 'Solvora',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '8%',
    y: '58%',
    size: 105,
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])

  return (
    <div className="relative w-screen h-[100svh] overflow-hidden bg-black text-white">
      {/* BASE SPACE */}
      <div className="absolute inset-0 bg-[#02010a]" />

      {/* STAR FIELD */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: '140px 140px, 220px 220px',
          backgroundPosition: '0 0, 60px 80px',
        }}
      />

      {/* ATMOSPHERIC NEBULA */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-700/20 blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/20 blur-[160px]" />

        <div className="absolute top-[30%] left-[35%] w-[40vw] h-[40vw] rounded-full bg-purple-500/20 blur-[120px]" />

        <div className="absolute top-[50%] left-[10%] w-[25vw] h-[25vw] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      {/* CINEMATIC VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* MAIN GALAXY */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* HUGE CORE GLOW */}
        <div className="absolute w-[120vw] h-[120vw] rounded-full bg-fuchsia-600/10 blur-[180px]" />

        {/* SWIRL ONE */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 240,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[95vw] h-[95vw] rounded-full opacity-70"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                rgba(168,85,247,0),
                rgba(168,85,247,0.18),
                rgba(59,130,246,0.15),
                rgba(168,85,247,0.22),
                rgba(255,255,255,0.04),
                rgba(168,85,247,0)
              )
            `,
            filter:
              'blur(45px) drop-shadow(0 0 120px rgba(168,85,247,0.5))',
          }}
        />

        {/* SWIRL TWO */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 300,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[75vw] h-[75vw] rounded-full opacity-60"
          style={{
            background: `
              conic-gradient(
                from 180deg,
                rgba(59,130,246,0),
                rgba(59,130,246,0.16),
                rgba(168,85,247,0.22),
                rgba(255,255,255,0.05),
                rgba(59,130,246,0)
              )
            `,
            filter: 'blur(60px)',
          }}
        />

        {/* INNER SPIRAL */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 160,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[45vw] h-[45vw] rounded-full opacity-90"
          style={{
            background: `
              radial-gradient(
                circle at center,
                rgba(255,255,255,0.95) 0%,
                rgba(255,180,255,0.95) 8%,
                rgba(168,85,247,0.85) 18%,
                rgba(59,130,246,0.35) 35%,
                rgba(0,0,0,0) 70%
              )
            `,
            filter:
              'blur(30px) drop-shadow(0 0 120px rgba(168,85,247,0.9))',
          }}
        />

        {/* STAR PARTICLES */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 5,
                repeat: Infinity,
              }}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random(),
              }}
            />
          ))}
        </div>

        {/* CENTER LIGHT */}
        <div className="absolute w-40 h-40 rounded-full bg-fuchsia-400 blur-[120px] opacity-60" />
      </div>

      {/* SEARCH BAR */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex gap-3 w-[92%] max-w-[850px]">
        <div className="flex-1 h-14 rounded-full bg-black/25 border border-white/10 backdrop-blur-2xl flex items-center px-5">
          <span className="text-white/40 text-lg">🔍</span>

          <input
            placeholder="Search planets, explorers, coordinates..."
            className="bg-transparent outline-none w-full ml-4 text-sm placeholder:text-white/30"
          />
        </div>

        <button className="px-6 rounded-full bg-black/25 border border-white/10 backdrop-blur-2xl text-sm">
          All Sectors ▾
        </button>
      </div>

      {/* LEFT PANELS */}
      <div className="absolute left-4 top-24 z-40">
        <div className="w-[250px] rounded-[32px] bg-black/30 border border-white/10 backdrop-blur-2xl p-5 mb-4 shadow-[0_0_60px_rgba(168,85,247,0.12)]">
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

        <div className="w-[250px] rounded-[32px] bg-black/30 border border-white/10 backdrop-blur-2xl p-5 shadow-[0_0_60px_rgba(168,85,247,0.12)]">
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

      {/* RIGHT INFO PANEL */}
      <div className="absolute right-4 top-20 z-40 w-[320px] rounded-[34px] bg-black/35 border border-white/10 backdrop-blur-2xl p-5 shadow-[0_0_80px_rgba(168,85,247,0.15)]">
        <img
          src={selectedPlanet.image}
          className="w-full h-[200px] rounded-[24px] object-cover"
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
          A lush world filled with glowing forests,
          cosmic oceans, and vibrant lifeforms
          thriving under celestial energy.
        </p>

        <button className="w-full mt-7 h-14 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-sm font-semibold shadow-[0_0_40px_rgba(168,85,247,0.45)]">
          Visit Planet
        </button>
      </div>

      {/* CORE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="text-8xl text-white drop-shadow-[0_0_50px_white]"
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
            y: [0, -15, 0],
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
              duration: 24 + index * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-18%] rounded-full border"
            style={{
              borderColor: `${planet.color}60`,
            }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 30 + index * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-28%] rounded-full border border-dashed"
            style={{
              borderColor: `${planet.color}25`,
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
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">
              {planet.name}
            </h3>

            <p className="text-sm text-white/40">
              Explorer Planet
            </p>
          </div>
        </motion.div>
      ))}

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {[
          '📍 My Location',
          '🔖 Bookmarks',
          '⚙️ Filters',
          '🚀 Jump Gate',
        ].map((item) => (
          <button
            key={item}
            className="h-14 px-6 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-2xl text-sm shadow-[0_0_40px_rgba(168,85,247,0.1)]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
