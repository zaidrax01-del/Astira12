'use client'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Aurum Prime',
    subtitle: 'Wealth & Prestige',
    element: 'Gold',
    rarity: 'SSS',
    img: '/aurum-prime.png',
    glow: 'shadow-yellow-500/40',
    border: 'border-yellow-500/30',
  },
  {
    id: 2,
    name: 'Verdantia',
    subtitle: 'Life & Growth',
    element: 'Wood',
    rarity: 'SS',
    img: '/verdantia.png',
    glow: 'shadow-green-500/40',
    border: 'border-green-500/30',
  },
  {
    id: 3,
    name: 'Thalassaris',
    subtitle: 'Wisdom & Memory',
    element: 'Water',
    rarity: 'SSS',
    img: '/thalassaris.png',
    glow: 'shadow-blue-500/40',
    border: 'border-blue-500/30',
  },
  {
    id: 4,
    name: 'Ignis Vex',
    subtitle: 'Power & Conquest',
    element: 'Fire',
    rarity: 'SSS',
    img: '/ignis-vex.png',
    glow: 'shadow-red-600/40',
    border: 'border-red-600/30',
  },
  {
    id: 5,
    name: 'Terranova Prime',
    subtitle: 'Legacy & Stability',
    element: 'Earth',
    rarity: 'SSS',
    img: '/terranova-prime.png',
    glow: 'shadow-amber-500/40',
    border: 'border-amber-500/30',
  },
  {
    id: 6,
    name: 'Cryonis Eternal',
    subtitle: 'Time & Preservation',
    element: 'Ice',
    rarity: 'SSS',
    img: '/cryonis-eternal.png',
    glow: 'shadow-cyan-500/40',
    border: 'border-cyan-500/30',
  },
  {
    id: 7,
    name: 'Voltaris Nexus',
    subtitle: 'Energy & Innovation',
    element: 'Lightning',
    rarity: 'SSS',
    img: '/voltaris-nexus.png',
    glow: 'shadow-purple-500/40',
    border: 'border-purple-500/30',
  },
  {
    id: 8,
    name: 'Cyberion Prime',
    subtitle: 'Technology & Evolution',
    element: 'Cyber',
    rarity: 'SSS+',
    img: '/cyberion-prime.png',
    glow: 'shadow-pink-500/40',
    border: 'border-pink-500/30',
  },
]

const elementIcons = {
  Gold: '🟡',
  Wood: '🌿',
  Water: '💧',
  Fire: '🔥',
  Earth: '🪨',
  Ice: '❄️',
  Lightning: '⚡',
  Cyber: '🤖',
}

export default function Featured() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-16 py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16 space-y-3">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-white">
          THE EIGHT WORLDS
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
          Eight primordial planets that form the foundation of the Astira universe.
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {planets.map((planet, i) => (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true }}
            className={`relative glass rounded-2xl overflow-hidden border ${planet.border} ${planet.glow} transition-shadow duration-300`}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={planet.img}
                alt={planet.name}
                className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm font-bold text-white">
                {planet.id}
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-wide">{planet.name}</h3>
              <p className="text-sm text-gray-400">{planet.subtitle}</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                  <span>{elementIcons[planet.element] || '⭐'}</span>
                  {planet.element}
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-xs text-purple-300">
                  {planet.rarity}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-gray-500 text-sm mt-12 tracking-[0.3em] uppercase">
        8 WORLDS. INFINITE POSSIBILITIES.
      </p>
    </section>
  )
}
