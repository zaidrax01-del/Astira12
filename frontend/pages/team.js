'use client'
import { motion } from 'framer-motion'
import GlassPanel from '../components/ui/GlassPanel'
import Badge from '../components/ui/Badge'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const crew = [
  {
    name: 'Astira',
    role: 'CEO & Founder',
    desc: 'Visionary driving the mission to build a next‑generation AI/Web3 planetary ecosystem. Astira defines strategy, product direction, and innovation.',
    img: '/team-astira.png',
    badge: { type: 'captain', label: 'Captain' },
    twitter: 'https://x.com/astira_web3',
    telegram: 'https://t.me/Astira_web3'
  },
  {
    name: 'Bob',
    role: 'Community Manager',
    desc: 'Nurturing the heart of Astira – Bob builds, engages, and empowers the community across every channel. From feedback loops to events, he keeps the galaxy connected.',
    img: '/team-bob.png',
    badge: { type: 'navigator', label: 'Navigator' },
    twitter: 'https://x.com/bobbyd_great?s=11',
    telegram: 'https://t.me/bobbythe_great'
  },
  {
    name: 'Tom',
    role: 'Project Promotion Manager',
    desc: 'Expanding the universe. Tom leads marketing, partnerships, and growth strategies to ensure Astira reaches every corner of the space.',
    img: '/team-tom.png',
    badge: { type: 'signal', label: 'Signal Booster' },
    twitter: 'https://x.com/astira_tom3?s=11',
    telegram: 'https://t.me/astiraTom'
  },
  {
    name: 'Croix',
    role: 'Poster Designer',
    desc: 'The artist behind the cosmic visuals. Croix designs every poster, banner, and asset that defines the futuristic identity of Astira.',
    img: '/team-croix.png',
    badge: { type: 'artist', label: 'Cosmic Artist' },
    twitter: 'https://x.com/croixonchain?s=11',
    telegram: 'https://t.me/croixonchain'
  },
  {
    name: 'Zaidra',
    role: 'Website Developer',
    desc: 'Building the bridge between AI and user experience. Zaidra crafts the platform’s interface, ensuring speed, immersion, and seamless functionality.',
    img: '/team-zaidra.png',
    badge: { type: 'engineer', label: 'Quantum Engineer' },
    twitter: 'https://x.com/zaidra_',
    telegram: 'https://t.me/zaidrax'
  }
]

export default function Team() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-4 sm:px-8">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl sm:text-5xl font-bold text-center text-gradient mb-16"
        >
          Astira Fleet Command
        </motion.h1>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {crew.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <GlassPanel className="p-8 text-center h-full flex flex-col items-center border border-white/10">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4"
                />
                <h2 className="text-2xl font-bold">{m.name}</h2>
                <p className="text-purple-400 uppercase text-sm mb-2">{m.role}</p>
                <Badge type={m.badge.type} label={m.badge.label} />
                <p className="text-gray-400 text-sm mt-4 flex-grow">{m.desc}</p>
                <div className="flex gap-4 mt-4">
                  <a href={m.twitter} target="_blank" className="text-gray-400 hover:text-purple-400">𝕏</a>
                  <a href={m.telegram} target="_blank" className="text-gray-400 hover:text-purple-400">✈️</a>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-6">Connect with the Mothership</h2>
          <div className="flex justify-center gap-8 text-2xl">
            <a href="https://x.com/astira_web3" target="_blank" className="hover:text-purple-400 transition">𝕏</a>
            <a href="https://t.me/astiraweb3" target="_blank" className="hover:text-purple-400 transition">✈️</a>
          </div>
        </div>
      </main>
    </div>
  )
}
