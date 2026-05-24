'use client'
import { motion } from 'framer-motion'

const planets = [
  {
    id: 1,
    name: 'Solvora',
    subtitle: 'The Forge World',
    element: 'Fire',
    rarity: 'Legendary',
    glow: 'shadow-orange-500/40',
    border: 'border-orange-500/30',
    img: '/planet-solvora.png', // placeholder – replace with real image path
  },
  {
    id: 2,
    name: 'Cryonix',
    subtitle: 'The Frozen Heart',
    element: 'Ice',
    rarity: 'Legendary',
    glow: 'shadow-blue-500/40',
    border: 'border-blue-500/30',
    img: '/planet-cryonix.png',
  },
  {
    id: 3,
    name: 'Verdana',
    subtitle: 'The Living Breath',
    element: 'Nature',
    rarity: 'Legendary',
    glow: 'shadow-green-500/40',
    border: 'border-green-500/30',
    img: '/planet-verdana.png',
  },
  {
    id: 4,
    name: 'Dunora',
    subtitle: 'The Timeless Dune',
    element: 'Earth',
    rarity: 'Legendary',
    glow: 'shadow-amber-500/40',
    border: 'border-amber-500/30',
    img: '/planet-dunora.png',
  },
  {
    id: 5,
    name: 'Zenithor',
    subtitle: 'The Machine Core',
    element: 'Tech',
    rarity: 'Legendary',
    glow: 'shadow-orange-600/40',
    border: 'border-orange-600/30',
    img: '/planet-zenithor.png',
  },
  {
    id: 6,
    name: 'Lumerion',
    subtitle: 'The Stardust Garden',
    element: 'Crystal',
    rarity: 'Legendary',
    glow: 'shadow-pink-500/40',
    border: 'border-pink-500/30',
    img: '/planet-lumerion.png',
  },
  {
    id: 7,
    name: 'Infernox',
    subtitle: 'The Eternal Inferno',
    element: 'Fire',
    rarity: 'Mythic Legendary',
    glow: 'shadow-red-600/40',
    border: 'border-red-600/30',
    img: '/planet-infernox.png',
  },
  {
    id: 8,
    name: 'Glacieron',
    subtitle: 'The Eternal Blizzard',
    element: 'Ice',
    rarity: 'Mythic Legendary',
    glow: 'shadow-cyan-500/40',
    border: 'border-cyan-500/30',
    img: '/planet-glacieron.png',
  },
]

const elementIcons = {
  Fire: '🔥',
  Ice: '❄️',
  Nature: '🌿',
  Earth: '🏜️',
  Tech: '⚙️',
  Crystal: '💎',
}

export default function Featured() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-16 py-16 sm:py-24">
      {/* Section title */}
      <div className="text-center mb-12 sm:mb-16 space-y-3">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-white">
          LEGENDARY REALMS
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
          Explore the eight original planets that form the foundation of the
          Astira universe.
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
      </div>

      {/* Planet grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {planets.map((planet, i) => (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true }}
            className={`relative glass rounded-2xl overflow-hidden border ${planet.border} ${planet.glow} transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(var(--glow),0.6)]`}
          >
            {/* Planet image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={planet.img}
                alt={planet.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Number badge */}
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm font-bold text-white">
                {planet.id}
              </div>
            </div>

            {/* Card details */}
            <div className="p-4 sm:p-5 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
                {planet.name}
              </h3>
              <p className="text-sm text-gray-400">{planet.subtitle}</p>

              {/* Element + rarity badges */}
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

      {/* Bottom text */}
      <p className="text-center text-gray-500 text-sm mt-12 tracking-[0.3em] uppercase">
        8 PLANETS. INFINITE POSSIBILITIES.
      </p>
    </section>
  )
}
