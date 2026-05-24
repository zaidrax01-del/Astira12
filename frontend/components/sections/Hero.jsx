'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Centered text content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
          <span className="text-white">Explore the </span>
          <span className="text-gradient">Cosmos</span>
          <br />
          <span className="text-white">Own the </span>
          <span className="text-gradient">Planets</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto">
          Mint AI‑generated planets, trade in the marketplace, and shape the galaxy with our DAO.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/create"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition text-center"
          >
            Create a Planet
          </Link>
          <Link
            href="/compass"
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400/10 transition text-center"
          >
            Explore All
          </Link>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-8 text-gray-400 text-sm"
        >
          <span className="flex items-center justify-center gap-1">
            Scroll to explore <span className="text-lg">↓</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
