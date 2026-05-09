import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/ui/GlassPanel';
import GlowButton from '../components/ui/GlowButton';
import Navbar from '../components/layout/Navbar';

const featuredPlanets = [
  {
    name: 'Ignarion',
    type: 'Fire Planet',
    rarity: 'Rare',
    image: 'https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png',
    desc: 'Molten oceans, volcanic storms.',
  },
  {
    name: 'Verdyra',
    type: 'Nature Planet',
    rarity: 'Uncommon',
    image: 'https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png',
    desc: 'Endless forests, glowing life.',
  },
  {
    name: 'Cryonix',
    type: 'Ice Planet',
    rarity: 'Rare',
    image: 'https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png',
    desc: 'Frozen glaciers, crystal storms.',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function Dashboard() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const planetY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="relative text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 relative pt-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Your Universe, Your Rules
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10">
            AI‑powered planet creation, NFT minting, on‑chain evolution, and a vibrant cosmos to explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <GlowButton>Create a Planet</GlowButton>
            </Link>
            <Link to="/compass">
              <GlowButton className="!bg-gradient-to-r !from-cyan-500 !to-blue-600">
                Explore All Planets
              </GlowButton>
            </Link>
          </div>
        </motion.div>

        {/* Floating planet art */}
        <motion.div
          style={{ y: planetY }}
          className="absolute -bottom-10 -right-20 md:-right-40 w-96 h-96 opacity-30 pointer-events-none"
        >
          <img
            src="https://i.ibb.co/bMz81nMn/IMG-20260421-122500-468.jpg"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </section>

      {/* ── EXPLORE PLANETS ── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-cyan-300">Cosmic Artifacts</h2>
          <p className="text-gray-400 mt-4">Discover rare, legendary, and mysterious worlds.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlanets.map((planet) => (
            <motion.div
              key={planet.name}
              whileHover={{ y: -10, scale: 1.02 }}
              className="cursor-pointer group"
            >
              <GlassPanel className="overflow-hidden p-0 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={planet.image}
                    alt={planet.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{planet.name}</h3>
                    <p className="text-sm text-purple-300 mt-1">
                      {planet.type} – {planet.rarity}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">{planet.desc}</p>
                  </div>
                  <Link
                    to="/compass"
                    className="mt-4 inline-block text-purple-400 hover:text-purple-200 text-sm font-semibold transition-colors"
                  >
                    View full data →
                  </Link>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── MARKETPLACE / ACTIVITY ── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-green-300">Galactic Marketplace</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Trade planets, collect rare traits, and watch your cosmic assets evolve. Every transaction is on‑chain, powered by Solana.
            </p>
            <Link to="/marketplace">
              <GlowButton className="!bg-gradient-to-r !from-green-400 !to-teal-500">
                Explore Marketplace
              </GlowButton>
            </Link>
          </div>
          <GlassPanel className="p-8 flex justify-center">
            <div className="text-center text-gray-400 italic">
              <div className="text-6xl mb-4">🛒</div>
              <p>Live trading data coming soon</p>
            </div>
          </GlassPanel>
        </div>
      </motion.section>

      {/* ── CREATION TOOLS ── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-pink-300">Build Worlds with AI</h2>
          <p className="text-gray-400 mt-4">
            No art skills needed – just describe your vision and watch it materialise.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Generate', icon: '🎨', desc: 'Describe a planet in words, AI creates it.' },
            { title: 'Fuse', icon: '💥', desc: 'Combine two planets into a new hybrid.' },
            { title: 'Mint', icon: '🪙', desc: 'Turn your planet into a Solana NFT.' },
          ].map((item) => (
            <GlassPanel key={item.title} className="p-8 text-center space-y-3 hover:border-purple-500/50 transition-all">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </GlassPanel>
          ))}
        </div>
      </motion.section>

      {/* ── COMMUNITY / DAO ── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <GlassPanel className="p-10 space-y-4">
            <h2 className="text-3xl font-bold text-yellow-300">Govern by the People</h2>
            <p className="text-gray-300">
              AST token holders vote on the future of the ecosystem: economy, styles, lore. All transparent on‑chain.
            </p>
            <Link to="/governance">
              <GlowButton className="mt-4">Enter DAO</GlowButton>
            </Link>
          </GlassPanel>
          <GlassPanel className="p-10 space-y-4">
            <h2 className="text-3xl font-bold text-purple-300">Join the Fleet</h2>
            <p className="text-gray-300">
              Our community spans artists, collectors, and dreamers. Collaborate, share, and shape the universe together.
            </p>
            <Link to="/crew">
              <GlowButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 mt-4">
                Meet the Command
              </GlowButton>
            </Link>
          </GlassPanel>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 Astira. Built on Solana.</span>
          <div className="flex gap-6">
            <a href="https://x.com/astira_web3" target="_blank" className="hover:text-purple-400">𝕏</a>
            <a href="https://t.me/astiraweb3" target="_blank" className="hover:text-purple-400">✈️</a>
            <a href="https://discord.gg/astira" target="_blank" className="hover:text-purple-400">🎮</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
