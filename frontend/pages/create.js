'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'

const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
)

const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
)

function Planet() {
  return (
    <mesh rotation={[0.2, 0.5, 0]}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <meshStandardMaterial
        color="#2a1458"
        emissive="#7c3aed"
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

export default function Create() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764,#000)] z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-4 lg:px-8 pb-10">

        {/* DESKTOP */}
        <div className="hidden lg:grid grid-cols-[320px_1fr_340px] gap-6">

          {/* LEFT PANEL */}
          <div className="bg-white/5 border border-purple-500/20 rounded-[30px] p-6 backdrop-blur-xl">

            <h1 className="text-5xl font-black leading-none">
              AI-DRIVEN
              <br />
              <span className="text-purple-400">
                PLANET GENESIS
              </span>
            </h1>

            <p className="text-gray-400 mt-4 text-sm">
              Describe it. Generate it. Own it.
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your planet..."
              className="w-full h-40 mt-6 rounded-2xl bg-black/40 border border-white/10 p-4 outline-none resize-none"
            />

            {/* Style Pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['Cosmic', 'Fantasy', 'Sci-Fi', 'Realistic'].map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/10 text-sm border border-white/10"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3 mt-6">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-xs">Type</p>
                <p className="mt-1">Oceanic</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-xs">Energy</p>
                <p className="mt-1">High</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-xs">Rarity</p>
                <p className="mt-1 text-purple-400">Epic</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-xs">Habitability</p>
                <p className="mt-1 text-green-400">78%</p>
              </div>

            </div>

            {/* Button */}
            <button className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Generate Planet
            </button>
          </div>

          {/* CENTER PLANET */}
          <div className="relative h-[720px] rounded-[40px] overflow-hidden border border-purple-500/20 bg-black/30">

            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,#7c3aed33,transparent_70%)]" />

            {/* Orbit Ring */}
            <div className="absolute inset-10 border-[18px] border-purple-300/30 rounded-full z-10" />

            {/* Canvas */}
            <Canvas camera={{ position: [0, 0, 6] }}>

              <ambientLight intensity={1.5} />

              <directionalLight
                position={[5, 5, 5]}
                intensity={2}
              />

              <Planet />

              <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={1.5}
              />

            </Canvas>

            {/* 360 Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl z-20">
              360°
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white/5 border border-purple-500/20 rounded-[30px] p-6 backdrop-blur-xl">

            <h2 className="text-2xl font-bold mb-5">
              Your Generated Planet
            </h2>

            <img
              src="/planet-texture.jpg"
              alt="planet"
              className="w-full h-56 rounded-2xl object-cover border border-white/10"
            />

            {/* Info */}
            <div className="space-y-4 mt-6 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span>Asteria Prime</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span>Oceanic</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Rarity</span>
                <span className="text-purple-400">Epic</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Habitability</span>
                <span className="text-green-400">78%</span>
              </div>

            </div>

            {/* Traits */}
            <div className="grid grid-cols-3 gap-3 mt-8">

              {[
                'Crystal',
                'Aurora',
                'Energy',
                'Ocean',
                'Floating',
                'Core',
              ].map((trait) => (
                <div
                  key={trait}
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-xs"
                >
                  {trait}
                </div>
              ))}

            </div>

            {/* Mint Button */}
            <button className="w-full mt-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Mint Planet
            </button>

          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden flex flex-col gap-6">

          {/* Planet */}
          <div className="relative h-[420px] rounded-[40px] overflow-hidden border border-purple-500/20 bg-black/30">

            <div className="absolute inset-5 border-[10px] border-purple-300/30 rounded-full z-10" />

            <Canvas camera={{ position: [0, 0, 6] }}>

              <ambientLight intensity={1.5} />

              <directionalLight
                position={[5, 5, 5]}
                intensity={2}
              />

              <Planet />

              <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={1.5}
              />

            </Canvas>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 border border-white/10 px-5 py-2 rounded-full z-20">
              360°
            </div>
          </div>

          {/* Create Panel */}
          <div className="bg-white/5 border border-purple-500/20 rounded-[30px] p-5">

            <h2 className="text-2xl font-bold">
              Create Planet
            </h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your planet..."
              className="w-full h-32 mt-5 rounded-2xl bg-black/40 border border-white/10 p-4 outline-none resize-none"
            />

            <div className="flex flex-wrap gap-2 mt-5">
              {['Cosmic', 'Fantasy', 'Sci-Fi', 'Realistic'].map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/10 text-sm border border-white/10"
                >
                  {item}
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 font-bold">
              Generate Planet
            </button>

          </div>

          {/* Planet Info */}
          <div className="bg-white/5 border border-purple-500/20 rounded-[30px] p-5">

            <h2 className="text-2xl font-bold mb-4">
              Your Generated Planet
            </h2>

            <img
              src="/planet-texture.jpg"
              alt="planet"
              className="w-full h-52 rounded-2xl object-cover border border-white/10"
            />

            <div className="space-y-4 mt-6 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span>Asteria Prime</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span>Oceanic</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Rarity</span>
                <span className="text-purple-400">Epic</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Habitability</span>
                <span className="text-green-400">78%</span>
              </div>

            </div>

            <button className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold">
              Mint Planet
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
