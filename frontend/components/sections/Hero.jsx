'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlanetCanvas from '../PlanetCanvas'

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between min-h-screen pt-24 px-6 lg:px-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 space-y-8 text-center lg:text-left z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          <span className="text-white">Explore the </span>
          <span className="text-gradient">Cosmos</span><br />
          <span className="text-white">Own the </span>
          <span className="text-gradient">Planets</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl">
          Mint AI‑generated planets, trade in the marketplace, and shape the galaxy with our DAO.
        </p>
        <div className="flex gap-4 justify-center lg:justify-start">
          <Link href="/create" className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            Create a Planet
          </Link>
          <Link href="/compass" className="px-8 py-3 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400/10 transition">
            Explore All
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="lg:w-1/2 h-[400px] lg:h-[700px] relative -mr-16"
      >
        <PlanetCanvas />
      </motion.div>
    </section>
  )
}
