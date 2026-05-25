'use client'

import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'

export default function CreatePlanet() {
  const variations = [
    '/planet1.jpg',
    '/planet2.jpg',
    '/planet3.jpg',
    '/planet4.jpg',
    '/planet5.jpg',
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* COSMIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4c1d95_0%,#090014_40%,#000000_100%)]" />

      {/* STARS */}
      <div className="absolute inset-0 opacity-40 bg-[url('/stars.png')] bg-cover bg-center" />

      {/* PURPLE GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-600/20 blur-[180px] rounded-full" />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 lg:px-8 pt-24 pb-10">

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_360px] gap-6 items-start">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-purple-500/20 rounded-[32px] p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          >

            <h1 className="text-4xl lg:text-5xl font-black leading-tight">
              <span className="text-purple-500">AI-DRIVEN</span>
              <br />
              PLANET GENESIS
            </h1>

            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Describe it. Generate it. Own it.
            </p>

            {/* TEXTAREA */}
            <div className="mt-8">
              <label className="text-sm text-gray-300">
                Describe Your Planet
              </label>

              <textarea
                placeholder="A planet with crystal oceans, floating islands, aurora sky..."
                className="w-full mt-3 h-40 bg-black/40 border border-purple-500/20 rounded-2xl p-4 outline-none text-sm resize-none focus:border-cyan-400 transition"
              />
            </div>

            {/* STYLES */}
            <div className="mt-8">
              <p className="text-sm text-gray-300 mb-4">Style</p>

              <div className="flex flex-wrap gap-3">
                {['Cosmic', 'Realistic', 'Fantasy', 'Sci-Fi', 'Abstract'].map((style) => (
                  <button
                    key={style}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm hover:bg-purple-500/20 transition"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* ATTRIBUTES */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <p className="text-gray-500 text-xs">Type</p>
                <p className="text-cyan-300 mt-2">Oceanic</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <p className="text-gray-500 text-xs">Climate</p>
                <p className="text-white mt-2">Temperate</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <p className="text-gray-500 text-xs">Rarity</p>
                <p className="text-pink-400 mt-2">Epic</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <p className="text-gray-500 text-xs">Energy</p>
                <p className="text-green-400 mt-2">High</p>
              </div>

            </div>

            {/* BUTTON */}
            <button className="w-full mt-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition">
              Generate Planet
            </button>

          </motion.div>

          {/* CENTER PLANET */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[500px] md:h-[650px] xl:h-[760px] rounded-[40px] overflow-hidden border border-purple-500/20 bg-black/30 backdrop-blur-2xl flex items-center justify-center"
          >

            {/* CENTER GLOW */}
            <div className="absolute w-[700px] h-[700px] bg-purple-500/30 blur-[180px] rounded-full" />

            {/* SMALL STARS */}
            <div className="absolute inset-0 bg-[url('/stars.png')] opacity-40" />

            {/* PLANET */}
            <motion.img
              src="/planet-texture.jpg"
              alt="planet"
              animate={{ rotate: 360 }}
              transition={{
                duration: 120,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="relative z-20 w-[260px] h-[260px] md:w-[420px] md:h-[420px] xl:w-[560px] xl:h-[560px] object-cover rounded-full shadow-[0_0_120px_rgba(168,85,247,0.8)]"
            />

            {/* ATMOSPHERE */}
            <div className="absolute z-10 w-[300px] h-[300px] md:w-[470px] md:h-[470px] xl:w-[620px] xl:h-[620px] rounded-full border border-cyan-400/20 shadow-[0_0_100px_rgba(34,211,238,0.25)]" />

            {/* PLANET RING */}
            <div className="absolute z-30 w-[420px] md:w-[650px] xl:w-[850px] h-[120px] md:h-[180px] xl:h-[220px] border-[10px] border-purple-300/50 rounded-full rotate-[18deg] shadow-[0_0_60px_rgba(216,180,254,0.4)]" />

            {/* CONTROLS */}
            <div className="absolute bottom-8 z-40 flex items-center gap-4 bg-black/50 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
              <button className="text-white/70 hover:text-white transition">
                {'<'}
              </button>

              <span className="font-bold">360°</span>

              <button className="text-white/70 hover:text-white transition">
                {'>'}
              </button>
            </div>

          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-purple-500/20 rounded-[32px] p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          >

            {/* TABS */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['Overview', 'Attributes', 'History'].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 rounded-full text-sm bg-white/10 border border-white/10 hover:bg-purple-500/20 transition"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* IMAGE */}
            <h2 className="text-xl font-bold mb-4">
              Your Generated Planet
            </h2>

            <img
              src="/planet-texture.jpg"
              alt="planet"
              className="w-full h-56 object-cover rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
            />

            {/* INFO */}
            <div className="mt-8 space-y-5">

              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span>Asteria Prime</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span>Oceanic Planet</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Rarity</span>
                <span className="text-pink-400">Epic</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Habitability</span>
                <span className="text-green-400">78%</span>
              </div>

            </div>

            {/* TRAITS */}
            <div className="mt-10">
              <h3 className="font-bold mb-5">Special Traits</h3>

              <div className="grid grid-cols-3 gap-3">

                {[
                  'Crystal Oceans',
                  'Floating Islands',
                  'Aurora Sky',
                  'Energy Ring',
                  'Star Core',
                  'Bio Glow',
                ].map((trait) => (
                  <div
                    key={trait}
                    className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center text-xs hover:border-purple-400/40 transition"
                  >
                    ✨
                    <p className="mt-2 leading-relaxed">{trait}</p>
                  </div>
                ))}

              </div>
            </div>

            {/* MINT BUTTON */}
            <button className="w-full mt-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition">
              Mint Planet
            </button>

          </motion.div>

        </div>

        {/* VARIATIONS */}
        <div className="mt-10">

          <h3 className="text-gray-400 mb-5 text-lg">
            AI Generation Results
          </h3>

          <div className="flex gap-5 overflow-x-auto pb-3">

            {variations.map((img, index) => (
              <div
                key={index}
                className="min-w-[170px] md:min-w-[220px] h-[170px] md:h-[220px] rounded-[28px] overflow-hidden border border-purple-500/20 bg-white/5 hover:scale-105 transition"
              >
                <img
                  src={img}
                  alt="variation"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  )
}
