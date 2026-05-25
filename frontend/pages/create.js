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
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764_0%,#05010f_45%,#000000_100%)]" />

      {/* STARS */}
      <div className="absolute inset-0 opacity-30 bg-[url('/stars.png')] bg-cover bg-center" />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="relative z-10 px-4 lg:px-8 pt-24 pb-10">

        <div className="grid lg:grid-cols-[320px_1fr_340px] gap-6 items-start">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]"
          >
            <h1 className="text-4xl font-black leading-tight">
              <span className="text-purple-500">AI-DRIVEN</span>
              <br />
              PLANET GENESIS
            </h1>

            <p className="text-gray-400 mt-3 text-sm">
              Describe it. Generate it. Own it.
            </p>

            {/* INPUT */}
            <div className="mt-6">
              <label className="text-sm text-gray-300">
                Describe Your Planet
              </label>

              <textarea
                placeholder="A planet with crystal oceans, floating islands, purple atmosphere..."
                className="w-full mt-2 h-36 bg-black/40 border border-purple-500/20 rounded-2xl p-4 outline-none text-sm resize-none"
              />
            </div>

            {/* STYLES */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 mb-3">Style</p>

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
            <div className="grid grid-cols-2 gap-3 mt-6">

              <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                <p className="text-gray-500 text-xs">Type</p>
                <p className="text-cyan-300 mt-1">Oceanic</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                <p className="text-gray-500 text-xs">Climate</p>
                <p className="text-white mt-1">Temperate</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                <p className="text-gray-500 text-xs">Rarity</p>
                <p className="text-pink-400 mt-1">Epic</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                <p className="text-gray-500 text-xs">Energy</p>
                <p className="text-green-400 mt-1">High</p>
              </div>

            </div>

            {/* BUTTON */}
            <button className="w-full mt-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition">
              Generate Planet
            </button>
          </motion.div>

          {/* CENTER PLANET */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[650px] rounded-[40px] overflow-hidden border border-purple-500/20 bg-black/30 backdrop-blur-xl flex items-center justify-center"
          >

            {/* GLOW */}
            <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

            {/* PLANET */}
            <motion.img
              src="/planetTexture.jpg"
              alt="planet"
              animate={{ rotate: 360 }}
              transition={{
                duration: 80,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="relative z-10 w-[520px] h-[520px] object-cover rounded-full shadow-[0_0_80px_rgba(168,85,247,0.5)]"
            />

            {/* RING */}
            <div className="absolute w-[700px] h-[700px] border-[14px] border-purple-300/60 rounded-full rotate-[20deg]" />

            {/* BOTTOM CONTROLS */}
            <div className="absolute bottom-6 flex items-center gap-4 bg-black/50 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
              <button>{'<'}</button>
              <span className="font-bold">360°</span>
              <button>{'>'}</button>
            </div>

          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]"
          >

            {/* TABS */}
            <div className="flex gap-2 mb-6">
              {['Overview', 'Attributes', 'History'].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 rounded-full text-sm bg-white/10 border border-white/10"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* GENERATED */}
            <h2 className="text-lg font-bold mb-4">
              Your Generated Planet
            </h2>

            <img
              src="/planetTexture.jpg"
              alt="planet"
              className="w-full h-48 object-cover rounded-2xl border border-white/10"
            />

            {/* INFO */}
            <div className="mt-6 space-y-4">

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
            <div className="mt-8">
              <h3 className="font-bold mb-4">Special Traits</h3>

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
                    className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center text-xs"
                  >
                    ✨
                    <p className="mt-2">{trait}</p>
                  </div>
                ))}

              </div>
            </div>

            {/* MINT */}
            <button className="w-full mt-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition">
              Mint Planet
            </button>

          </motion.div>

        </div>

        {/* BOTTOM VARIATIONS */}
        <div className="mt-8">
          <h3 className="text-gray-400 mb-4">
            AI Generation Results
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-2">

            {variations.map((img, index) => (
              <div
                key={index}
                className="min-w-[160px] h-[160px] rounded-3xl overflow-hidden border border-purple-500/20 bg-white/5 hover:scale-105 transition"
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
