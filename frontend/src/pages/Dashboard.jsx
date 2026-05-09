import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlowButton from '../components/ui/GlowButton'

// All 15 planet data
const allPlanets = [
  { name: 'Ignarion', type: 'Fire Planet', rarity: 'Rare', image: 'https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png' },
  { name: 'Verdyra', type: 'Nature Planet', rarity: 'Uncommon', image: 'https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png' },
  { name: 'Cryonix', type: 'Ice Planet', rarity: 'Rare', image: 'https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png' },
  { name: 'Solvaris', type: 'Solar Planet', rarity: 'Epic', image: 'https://i.postimg.cc/m2TpXVcZ/file-00000000c8347243b313707c839a3e4d.png' },
  { name: 'Terranova', type: 'Earth-like Planet', rarity: 'Common', image: 'https://i.postimg.cc/NFCXxg9s/file-0000000088e071f4a38b674b96724918.png' },
  { name: 'Pyronox', type: 'Volcanic Planet', rarity: 'Rare', image: 'https://i.postimg.cc/9XsZzfh1/file-00000000c45471f4b1804b339a61a154.png' },
  { name: 'Gravion', type: 'Rocky Planet', rarity: 'Common', image: 'https://i.postimg.cc/s28DKvw1/file-00000000311071f4b675afc6b6c59f5d.png' },
  { name: 'Aqualis Prime', type: 'Water Planet', rarity: 'Rare', image: 'https://i.postimg.cc/13fkBMTz/file-00000000bf4471f494e465dcce23961b.png' },
  { name: 'Heliora', type: 'Energy Planet', rarity: 'Epic', image: 'https://i.postimg.cc/T1NkWvTN/file-000000007cbc72469880782e40456670.png' },
  { name: 'Ignis Rex', type: 'Ringed Fire Planet', rarity: 'Epic', image: 'https://i.postimg.cc/g0pKj2vz/file-00000000c70871f4be9c05b82f4421c5.png' },
  { name: 'Drakonis', type: 'Molten Core Planet', rarity: 'Epic', image: 'https://i.postimg.cc/Y9HngxYx/file-00000000ed7c720a8d3af0568fb515cc.png' },
  { name: 'Voltaris', type: 'Storm/Electric Planet', rarity: 'Epic', image: 'https://i.postimg.cc/zv3nRLt5/file-00000000e4c0720aa0fc22d47e152f15.png' },
  { name: 'Nebulon', type: 'Nebula Planet', rarity: 'Legendary', image: 'https://i.postimg.cc/rzXKFzvK/file-00000000a12c7246bbf2eba55df79b6a.png' },
  { name: 'Gaialux', type: 'Luminous Earth Planet', rarity: 'Epic', image: 'https://i.postimg.cc/ZKSNSMZJ/file-00000000bf047243a9c13e188e2fd9c9.png' },
  { name: 'Cindros', type: 'Burning Core Planet', rarity: 'Legendary', image: 'https://i.postimg.cc/h4rDXyTD/file-000000009f24720a8457f4d129b860b4.png' }
]

export default function Dashboard() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative w-full h-[500px] rounded-2xl overflow-hidden flex items-center justify-center">
        <img
          src="https://i.ibb.co/rff7H2Sq/file-00000000ed5071f48a86ac3926cd0030.png"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6"
          >
            Forge Your Cosmic Legacy
          </motion.h1>
          <p className="text-lg text-gray-300 mb-8">
            Create, evolve, and explore unique planets powered by AI. Mint as NFTs, trade on the marketplace, and build your interstellar empire.
          </p>
          <Link to="/create">
            <GlowButton>Create Planet</GlowButton>
          </Link>
        </div>
      </section>

      {/* Welcome */}
      <section className="text-center max-w-4xl mx-auto">
        <p className="text-xl text-gray-300 leading-relaxed">
          Astira is a digital universe where you can bring your own planet to life, trade it as an NFT, and shape a new interstellar economy.
        </p>
      </section>

      {/* All 15 Planets */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-cyan-300">Explore the Galaxy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allPlanets.map((planet) => (
            <motion.div
              key={planet.name}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={planet.image}
                  alt={planet.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{planet.name}</h3>
                <p className="text-purple-300 text-sm">{planet.type} · <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">{planet.rarity}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
