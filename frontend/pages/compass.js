'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Cryonix',
    image: '/planet-cryonix.png',
    color: '#3b82f6',
    x: '28%',
    y: '38%',
    size: 110,
  },
  {
    id: 2,
    name: 'Lumerion',
    image: '/planet-lumerion.png',
    color: '#9333ea',
    x: '50%',
    y: '24%',
    size: 105,
  },
  {
    id: 3,
    name: 'Verdana',
    image: '/planet-verdana.png',
    color: '#22c55e',
    x: '72%',
    y: '38%',
    size: 120,
  },
  {
    id: 4,
    name: 'Zenithor',
    image: '/planet-zenithor.png',
    color: '#f97316',
    x: '80%',
    y: '62%',
    size: 95,
  },
  {
    id: 5,
    name: 'Auroria',
    image: '/planet-auroria.png',
    color: '#06b6d4',
    x: '67%',
    y: '80%',
    size: 110,
  },
  {
    id: 6,
    name: 'Nexoria',
    image: '/planet-nexoria.png',
    color: '#a855f7',
    x: '50%',
    y: '88%',
    size: 120,
  },
  {
    id: 7,
    name: 'Dunora',
    image: '/planet-dunora.png',
    color: '#c08457',
    x: '33%',
    y: '80%',
    size: 100,
  },
  {
    id: 8,
    name: 'Solvora',
    image: '/planet-solvora.png',
    color: '#ef4444',
    x: '20%',
    y: '62%',
    size: 100,
  },
]

export default function GalaxyMap() {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-black text-white">
      {/* SPACE BASE */}
      <div className="absolute inset-0 bg-[#02010a]" />

      {/* STARS */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 220px 220px',
          backgroundPosition: '0 0, 60px 80px',
        }}
      />

      {/* SMALL RANDOM STARS */}
      {[...Array(120)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
        />
      ))}

      {/* HUGE NEBULA */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[70vw] h-[70vw] bg-fuchsia-700/20 rounded-full blur-[180px] top-[5%] left-[10%]" />

        <div className="absolute w-[65vw] h-[65vw] bg-blue-600/20 rounded-full blur-[180px] bottom-[-10%] right-[5%]" />

        <div className="absolute w-[35vw] h-[35vw] bg-pink-500/10 rounded-full blur-[140px] top-[40%] left-[40%]" />
      </div>

      {/* GALAXY CORE AREA */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* OUTER GLOW */}
        <div className="absolute w-[70vw] h-[70vw] rounded-full bg-fuchsia-500/10 blur-[180px]" />

        {/* GALAXY SPIRAL */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 220,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[60vw] h-[60vw] rounded-full"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                rgba(168,85,247,0),
                rgba(168,85,247,0.25),
                rgba(59,130,246,0.18),
                rgba(255,255,255,0.05),
                rgba(168,85,247,0)
              )
            `,
            filter:
              'blur(50px) drop-shadow(0 0 120px rgba(168,85,247,0.5))',
          }}
        />

        {/* SECOND GALAXY ARM */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 300,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-[48vw] h-[48vw] rounded-full"
          style={{
            background: `
              conic-gradient(
                from 180deg,
                rgba(59,130,246,0),
                rgba(59,130,246,0.22),
                rgba(168,85,247,0.15),
                rgba(255,255,255,0.03),
                rgba(59,130,246,0)
              )
            `,
            filter: 'blur(60px)',
          }}
        />

        {/* ORBIT RINGS */}
        {[260, 380, 520].map((size, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 120 + i * 50,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute rounded-full border border-white/10"
            style={{
              width: size,
              height: size,
            }}
          />
        ))}

        {/* CENTER */}
        <div className="absolute w-44 h-44 rounded-full bg-fuchsia-500 blur-[120px] opacity-80" />

        <div className="absolute text-center z-30">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="text-7xl drop-shadow-[0_0_60px_white]"
          >
            ✦
          </motion.div>

          <h2 className="mt-3 text-2xl tracking-[0.4em] font-bold">
            THE CORE
          </h2>

          <p className="text-white/50 text-sm mt-2">
            Astira Central Hub
          </p>
        </div>
      </div>

      {/* SVG ORBITS */}
      <svg className="absolute inset-0 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="250"
          stroke="rgba(168,85,247,0.12)"
          strokeWidth="1"
          fill="none"
        />

        <circle
          cx="50%"
          cy="50%"
          r="380"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth="1"
          fill="none"
        />

        <circle
          cx="50%"
          cy="50%"
          r="520"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* SEARCH BAR */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex gap-3 w-[92%] max-w-[850px]">
        <div className="flex-1 h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-2xl flex items-center px-5">
          <span className="text-white/40">🔍</span>

          <input
            placeholder="Search planets, explorers, coordinates..."
            className="bg-transparent outline-none w-full ml-4 text-sm placeholder:text-white/30"
          />
        </div>

        <button className="px-6 rounded-full bg-black/60 border border-white/20 backdrop-blur-2xl text-sm">
          All Sectors ▾
        </button>
      </div>

      {/* LEFT PANELS */}
      <div className="absolute left-4 top-24 z-40 hidden xl:block">
        <div className="w-[260px] rounded-[32px] bg-black/55 border border-white/20 backdrop-blur-2xl p-5 mb-4">
          <h3 className="text-xs tracking-[0.35em] text-white/60 mb-5">
            LIVE EVENTS
          </h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium">
                Cosmic Storm
              </p>

              <p className="text-purple-400 text-sm">
                Double evolution chance
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Star Fair
              </p>

              <p className="text-cyan-400 text-sm">
                Visit the Star Fair
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Planet Party
              </p>

              <p className="text-green-400 text-sm">
                Live now
              </p>
            </div>
          </div>
        </div>

        <div className="w-[260px] rounded-[32px] bg-black/55 border border-white/20 backdrop-blur-2xl p-5">
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
      <div className="absolute right-4 top-20 z-40 w-[320px] rounded-[34px] bg-black/60 border border-white/20 backdrop-blur-2xl p-5 hidden xl:block">
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

        <button className="w-full mt-7 h-14 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-sm font-semibold shadow-[0_0_50px_rgba(168,85,247,0.45)]">
          Visit Planet
        </button>
      </div>

      {/* PLANETS */}
      {planets.map((planet, index) => (
        <motion.div
          key={planet.id}
          animate={{
            y: [0, -14, 0],
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

          {/* ORBIT RING */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 30 + index * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-18%] rounded-full border"
            style={{
              borderColor: `${planet.color}55`,
            }}
          />

          {/* SECOND RING */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 45 + index * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-[-28%] rounded-full border border-dashed"
            style={{
              borderColor: `${planet.color}22`,
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

      {/* MINI OBJECTS */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            width: 8 + Math.random() * 18,
            height: 8 + Math.random() * 18,
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            background:
              i % 2 === 0
                ? 'rgba(168,85,247,0.7)'
                : 'rgba(59,130,246,0.7)',
            filter: 'blur(2px)',
          }}
        />
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
            className="h-14 px-6 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-2xl text-sm"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
