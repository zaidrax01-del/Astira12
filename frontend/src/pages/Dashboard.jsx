import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import GlowButton from '../components/ui/GlowButton';
import GlassPanel from '../components/ui/GlassPanel';

// ---- Featured planet data (from your images) ----
const featuredPlanets = [
  {
    name: 'Ignarion',
    type: 'Fire Planet',
    rarity: 'Rare',
    description: 'A blazing world covered in molten oceans and erupting volcanoes.',
    image: 'https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png',
  },
  {
    name: 'Verdyra',
    type: 'Nature Planet',
    rarity: 'Uncommon',
    description: 'A vibrant world filled with endless forests, glowing vegetation.',
    image: 'https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png',
  },
  {
    name: 'Cryonix',
    type: 'Ice Planet',
    rarity: 'Rare',
    description: 'A frozen world of endless glaciers and crystal storms.',
    image: 'https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png',
  },
];

// ---- Fade-up animation variant ----
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { account, connectWallet } = useContext(Web3Context);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const planetY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const planetScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="relative bg-transparent text-white overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center z-10"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Forge Your Cosmic Legacy
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Create, evolve, and explore unique planets powered by AI. Mint as NFTs, trade on the marketplace, and build your interstellar empire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton onClick={() => (window.location.href = '/create')}>
              Create Planet
            </GlowButton>
            {!account && (
              <GlowButton onClick={connectWallet} className="!bg-gradient-to-r !from-cyan-500 !to-blue-600">
                Connect Solana Wallet
              </GlowButton>
            )}
          </div>
        </motion.div>

        {/* Floating planet behind hero text */}
        <motion.div
          style={{ y: planetY, scale: planetScale }}
          className="absolute top-1/3 -right-32 w-96 h-96 opacity-40 pointer-events-none"
        >
          <img
            src="https://i.ibb.co/bMz81nMn/IMG-20260421-122500-468.jpg"
            alt="floating world"
            className="w-full h-full object-contain animate-spin-slow"
          />
        </motion.div>
      </section>

      {/* ── WHAT IS ASTIRA ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <GlassPanel className="p-10 md:p-16 space-y-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-cyan-300 mb-4">What is Astira?</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                AI‑powered planet NFT ecosystem. Generate unique worlds, mint as NFTs, trade on marketplace, evolve traits, and participate in DAO governance.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-pink-300 mb-4">What Astira is not</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Not a static “upload image” platform. We solve the lack of continuous interaction, world‑building, and long‑term incentives in current NFT projects.
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.section>

      {/* ── CORE POSITIONING ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Core Positioning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'No Creation Barrier', icon: '🎨' },
            { title: 'On-chain Evolution', icon: '🧬' },
            { title: 'Social Star Map', icon: '🗺️' },
            { title: 'DAO + Public Chain', icon: '🏛️' },
          ].map((item) => (
            <GlassPanel key={item.title} className="p-6 text-center space-y-3">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            </GlassPanel>
          ))}
        </div>
      </motion.section>

      {/* ── VISION & MISSION ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <GlassPanel className="p-10 space-y-4">
            <h2 className="text-3xl font-bold text-yellow-300">Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              Create a digital universe where everyone can showcase their art. Each planet carries an individual’s aesthetics, stories, and identity.
            </p>
          </GlassPanel>
          <GlassPanel className="p-10 space-y-4">
            <h2 className="text-3xl font-bold text-green-300">Mission</h2>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Lower barriers to high‑quality NFT creation</li>
              <li>Transform NFTs from static → dynamic assets</li>
              <li>Build a long‑term ecosystem: creation, trading, governance</li>
            </ul>
          </GlassPanel>
        </div>
      </motion.section>

      {/* ── TARGET USERS & BRAND EMOTION ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-300">Target Users</h2>
            <ul className="text-gray-300 space-y-2">
              <li>✨ NFT collectors</li>
              <li>🌐 Web3 natives</li>
              <li>🎨 Digital artists</li>
              <li>🔭 Astronomy lovers</li>
              <li>🚀 Young communities</li>
              <li>🆔 Identity expression seekers</li>
            </ul>
          </div>
          <GlassPanel className="p-10 space-y-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-pink-300">Brand Emotion</h2>
            <p className="text-gray-300 italic text-xl">
              “Creating a planet of your own.” Dreams, long‑termism, identity expression, and a sense of participation.
            </p>
          </GlassPanel>
        </div>
      </motion.section>

      {/* ── FEATURED WORLDS ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
          Featured Worlds
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlanets.map((planet) => (
            <motion.div
              key={planet.name}
              whileHover={{ y: -10, scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => (window.location.href = '/compass')}
            >
              <GlassPanel className="overflow-hidden p-0">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={planet.image}
                    alt={planet.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white">{planet.name}</h3>
                  <p className="text-sm text-purple-300">
                    {planet.type} – {planet.rarity}
                  </p>
                  <p className="text-gray-400 mt-2">{planet.description}</p>
                  <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    NFT Feature Soon
                  </span>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── QUICK LINKS ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-24 text-center"
      >
        <h2 className="text-3xl font-bold mb-10 text-white">Explore the Universe</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Cosmic Compass', path: '/compass' },
            { label: 'Fusion Lab', path: '/fusion' },
            { label: 'Governance', path: '/governance' },
            { label: 'Rewards', path: '/rewards' },
            { label: 'Help Center', path: '/help' },
            { label: 'Fleet Command', path: '/crew' },
          ].map((link) => (
            <GlowButton key={link.label} onClick={() => (window.location.href = link.path)} className="text-sm px-5 py-2">
              {link.label}
            </GlowButton>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm pb-8">
        Astira · Your Digital Universe
      </div>
    </div>
  );
}
