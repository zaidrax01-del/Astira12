'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex flex-col lg:flex-row items-center justify-between overflow-hidden">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/84j8fY8t/file-000000006bf87246bdc745ec121b25d9.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full lg:w-1/2 px-6 lg:px-16 pt-24 lg:pt-0 space-y-6 text-center lg:text-left"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          <span className="text-white">Explore the </span>
          <span className="text-gradient">Cosmos</span>
          <br />
          <span className="text-white">Own the </span>
          <span className="text-gradient">Planets</span>
        </h1>
        <p className="text-lg text-gray-200 max-w-xl mx-auto lg:mx-0">
          Mint AI‑generated planets, trade in the marketplace, and shape the galaxy with our DAO.
        </p>
        <div className="flex gap-4 justify-center lg:justify-start">
          <Link
            href="/create"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition"
          >
            Create a Planet
          </Link>
          <Link
            href="/compass"
            className="px-8 py-3 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400/10 transition"
          >
            Explore All
          </Link>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-8 flex justify-center lg:justify-start text-gray-400 text-sm"
        >
          <span className="flex items-center gap-1">
            Scroll to explore <span className="text-lg">↓</span>
          </span>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE – realistic planet (Astira moon) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-10 w-full lg:w-1/2 h-[300px] lg:h-full flex items-center justify-center"
      >
        <div className="relative w-72 h-72 lg:w-96 lg:h-96">
          {/* Glowing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-cyan-400/10 animate-spin-slower" />

          {/* The planet image itself */}
          <img
            src="https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"
            alt="Astira Planet"
            className="w-full h-full object-cover rounded-full shadow-[0_0_60px_rgba(168,85,247,0.4)]"
          />

          {/* Atmospheric glow overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none" />
        </div>
      </motion.div>
    </section>
  )
}
