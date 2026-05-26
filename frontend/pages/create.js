'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import Navbar from '../components/layout/Navbar'

function FloatingParticles() {
  const particlesRef = useRef()

  const particleCount = 500
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.03}
        color="#c084fc"
        transparent
        opacity={0.8}
      />
    </points>
  )
}

function Planet() {
  const planetRef = useRef()

  const texture = useLoader(
    THREE.TextureLoader,
    '/planet-texture.jpg'
  )

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0015
    }
  })

  return (
    <group>
      {/* MAIN PLANET */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2.7, 256, 256]} />

        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* BIG GLOW */}
      <mesh>
        <sphereGeometry args={[3.1, 128, 128]} />

        <meshBasicMaterial
          color="#9333ea"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* INNER GLOW */}
      <mesh>
        <sphereGeometry args={[2.85, 64, 64]} />

        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* RING 1 */}
      <mesh rotation={[1.7, 0.2, 0]}>
        <torusGeometry args={[4.1, 0.05, 16, 300]} />

        <meshBasicMaterial
          color="#d8b4fe"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* RING 2 */}
      <mesh rotation={[1.7, 0.2, 0]}>
        <torusGeometry args={[4.45, 0.03, 16, 300]} />

        <meshBasicMaterial
          color="#f0abfc"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* FLOATING PARTICLES */}
      <FloatingParticles />
    </group>
  )
}

export default function Create() {
  const variations = [
    '/planet-texture.jpg',
    '/planet-texture.jpg',
    '/planet-texture.jpg',
    '/planet-texture.jpg',
    '/planet-texture.jpg',
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,#581c87,#000)]" />

      {/* PURPLE LIGHT */}
      <div className="fixed top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-purple-500/20 blur-[180px]" />

      <div className="relative z-10 px-4 lg:px-8 pt-24 pb-10">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_320px] gap-6 items-start">

          {/* LEFT PANEL */}
          <div className="rounded-[30px] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.2)]">

            <h1 className="text-4xl font-black leading-none bg-gradient-to-b from-fuchsia-400 to-white bg-clip-text text-transparent">
              AI-DRIVEN
              <br />
              PLANET
              <br />
              GENESIS
            </h1>

            <p className="text-gray-400 mt-4 text-sm">
              Describe it. Generate it. Own it.
            </p>

            {/* TEXTAREA */}
            <div className="mt-6">
              <p className="text-sm mb-2 text-gray-300">
                Describe Your Planet
              </p>

              <textarea
                placeholder="A planet with crystal oceans, floating islands, purple skies..."
                className="w-full h-36 rounded-2xl bg-black/30 border border-white/10 p-4 outline-none resize-none focus:border-purple-500 transition"
              />
            </div>

            {/* STYLES */}
            <div className="mt-6">
              <p className="text-sm mb-3 text-gray-300">
                Style
              </p>

              <div className="flex flex-wrap gap-2">
                {['Cosmic', 'Realistic', 'Fantasy', 'Sci-Fi', 'Abstract'].map((item) => (
                  <button
                    key={item}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm hover:bg-purple-500/30 hover:border-purple-400 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ATTRIBUTES */}
            <div className="grid grid-cols-2 gap-3 mt-6">

              {[
                ['Type', 'Oceanic'],
                ['Climate', 'Temperate'],
                ['Resources', 'Crystal + Energy'],
                ['Rarity', 'Epic'],
                ['Habitability', '78%'],
                ['Energy', 'High'],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white/5 border border-white/10 p-3 backdrop-blur-xl"
                >
                  <p className="text-xs text-gray-400">
                    {title}
                  </p>

                  <p className="mt-1 font-semibold text-sm">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <button className="w-full mt-6 py-4 rounded-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              Generate Planet
            </button>
          </div>

          {/* CENTER */}
          <div>

            {/* PLANET CONTAINER */}
            <div className="relative h-[650px] rounded-[35px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.25)]">

              {/* BACK LIGHT */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,#9333ea22,transparent_70%)]" />

              {/* CANVAS */}
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>

                <ambientLight intensity={1.5} />

                <directionalLight
                  position={[5, 5, 5]}
                  intensity={2.5}
                />

                <pointLight
                  position={[-5, -5, -5]}
                  intensity={1}
                  color="#9333ea"
                />

                <Stars
                  radius={100}
                  depth={50}
                  count={7000}
                  factor={4}
                  saturation={0}
                  fade
                />

                <OrbitControls
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                />

                <Planet />

              </Canvas>

              {/* CONTROL */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="px-7 py-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl shadow-lg">
                  360°
                </div>
              </div>
            </div>

            {/* VARIATIONS */}
            <div className="mt-6">

              <p className="text-sm text-gray-400 mb-3">
                AI Generation Results
              </p>

              <div className="flex gap-4 overflow-x-auto pb-2">

                {variations.map((img, index) => (
                  <div
                    key={index}
                    className="min-w-[140px] h-[140px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:scale-105 transition cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.15)]"
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

          {/* RIGHT PANEL */}
          <div className="rounded-[30px] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.2)]">

            {/* TABS */}
            <div className="flex gap-2 mb-5">

              {['Overview', 'Attributes', 'History'].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 rounded-full bg-white/10 text-xs hover:bg-purple-500/30 transition"
                >
                  {tab}
                </button>
              ))}

            </div>

            <h2 className="font-bold text-lg">
              Your Generated Planet
            </h2>

            {/* IMAGE */}
            <img
              src="/planet-texture.jpg"
              alt="planet"
              className="w-full h-56 object-cover rounded-2xl mt-4 border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
            />

            {/* INFO */}
            <div className="space-y-4 mt-6 text-sm">

              {[
                ['Name', 'Asteria Prime'],
                ['Type', 'Oceanic Planet'],
                ['Rarity', 'Epic'],
                ['Habitability', '78%'],
                ['Energy Level', 'High'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-white/5 pb-2"
                >
                  <span className="text-gray-400">
                    {k}
                  </span>

                  <span>
                    {v}
                  </span>
                </div>
              ))}

            </div>

            {/* TRAITS */}
            <div className="mt-7">

              <p className="font-semibold mb-4">
                Special Traits
              </p>

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
                    className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center text-xs hover:bg-purple-500/20 transition"
                  >
                    ✦

                    <div className="mt-2 leading-tight">
                      {trait}
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* BUTTON */}
            <button className="w-full mt-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              Mint Planet 🚀
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
