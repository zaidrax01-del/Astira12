'use client'

import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

import Navbar from '../components/layout/Navbar'
import GlowButton from '../components/ui/GlowButton'

/* ---------------- PLANET ---------------- */

function PlanetScene() {
  const planetRef = useRef()
  const ringRef = useRef()

  const texture = useLoader(
    THREE.TextureLoader,
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2070&auto=format&fit=crop'
  )

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y =
        clock.getElapsedTime() * 0.05
    }

    if (ringRef.current) {
      ringRef.current.rotation.z =
        clock.getElapsedTime() * 0.1
    }
  })

  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3)

    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }

    return positions
  }, [])

  return (
    <group>

      {/* Planet Glow */}
      <mesh>
        <sphereGeometry args={[3.9, 64, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Main Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[3.2, 256, 256]} />

        <meshStandardMaterial
          map={texture}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[3.2, 128, 128]} />

        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Energy Ring */}
      <mesh
        ref={ringRef}
        rotation={[1.2, 0, 0]}
      >
        <torusGeometry args={[4.8, 0.08, 16, 200]} />

        <meshBasicMaterial
          color="#c084fc"
        />
      </mesh>

      {/* Floating Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.03}
          color="#ffffff"
        />
      </points>
    </group>
  )
}

/* ---------------- PAGE ---------------- */

export default function CreatePlanet() {
  const [prompt, setPrompt] = useState('')

  const variations = [
    '/planet1.png',
    '/planet2.png',
    '/planet3.png',
    '/planet4.png',
    '/planet5.png',
  ]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764_0%,#070114_35%,#000_100%)]" />

      {/* Extra Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-purple-500/20 blur-[160px]" />

      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="relative z-10 pt-24 px-6 lg:px-10 pb-10">

        <div className="grid lg:grid-cols-[350px_1fr_340px] gap-6 items-center">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-[32px] h-[760px]"
          >

            <h1 className="text-5xl font-black leading-none">
              AI-DRIVEN
            </h1>

            <h2 className="text-5xl font-black text-purple-400 leading-none mb-4">
              PLANET GENESIS
            </h2>

            <p className="text-gray-400 mb-8">
              Describe it. Generate it. Own it.
            </p>

            <div className="space-y-5">

              <div>
                <p className="text-sm mb-2 text-gray-300">
                  Describe Your Planet
                </p>

                <textarea
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.target.value)
                  }
                  placeholder="A planet with crystal oceans, floating islands, aurora skies..."
                  className="
                    w-full
                    h-40
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    p-4
                    text-sm
                    outline-none
                    resize-none
                    backdrop-blur-xl
                  "
                />
              </div>

              <div>
                <p className="text-sm mb-3 text-gray-300">
                  Style
                </p>

                <div className="flex gap-3 flex-wrap">

                  {[
                    'Cosmic',
                    'Fantasy',
                    'Sci-Fi',
                    'Realistic',
                  ].map((item) => (
                    <button
                      key={item}
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-white/5
                        border
                        border-white/10
                        hover:border-purple-500
                        transition
                        text-sm
                      "
                    >
                      {item}
                    </button>
                  ))}

                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="stat-card">
                  <p className="text-gray-400 text-xs">
                    Type
                  </p>

                  <h3>Oceanic</h3>
                </div>

                <div className="stat-card">
                  <p className="text-gray-400 text-xs">
                    Energy
                  </p>

                  <h3>High</h3>
                </div>

                <div className="stat-card">
                  <p className="text-gray-400 text-xs">
                    Rarity
                  </p>

                  <h3>Epic</h3>
                </div>

                <div className="stat-card">
                  <p className="text-gray-400 text-xs">
                    Habitability
                  </p>

                  <h3>78%</h3>
                </div>

              </div>

              <GlowButton className="w-full mt-6">
                Generate Planet
              </GlowButton>

            </div>
          </motion.div>

          {/* CENTER PLANET */}
          <div className="relative h-[820px] flex items-center justify-center">

            {/* Planet Glow */}
            <div className="absolute w-[750px] h-[750px] rounded-full bg-purple-500/20 blur-[120px]" />

            <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>

              <fog
                attach="fog"
                args={['#070114', 10, 25]}
              />

              <ambientLight intensity={0.4} />

              <pointLight
                position={[5, 5, 5]}
                intensity={3}
                color="#8b5cf6"
              />

              <pointLight
                position={[-5, -5, -5]}
                intensity={2}
                color="#06b6d4"
              />

              <Stars
                radius={100}
                depth={50}
                count={4000}
                factor={4}
                fade
              />

              <OrbitControls
                autoRotate
                autoRotateSpeed={0.3}
                enableZoom={false}
              />

              <Suspense fallback={null}>
                <PlanetScene />
              </Suspense>

            </Canvas>

            {/* Bottom Controls */}
            <div className="
              absolute
              bottom-10
              flex
              items-center
              gap-4
              glass-panel
              px-6
              py-4
              rounded-full
            ">

              <button>◀</button>

              <button>360°</button>

              <button>▶</button>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-[32px] h-[760px]"
          >

            <h2 className="text-2xl font-bold mb-5">
              Your Generated Planet
            </h2>

            <img
              src="/planet-preview.png"
              className="
                w-full
                h-56
                object-cover
                rounded-2xl
                border
                border-white/10
                mb-6
              "
            />

            <div className="space-y-4">

              <div className="info-row">
                <span>Name</span>
                <span>Asteria Prime</span>
              </div>

              <div className="info-row">
                <span>Type</span>
                <span>Oceanic</span>
              </div>

              <div className="info-row">
                <span>Rarity</span>
                <span className="text-purple-400">
                  Epic
                </span>
              </div>

              <div className="info-row">
                <span>Habitability</span>
                <span className="text-green-400">
                  78%
                </span>
              </div>

            </div>

            <div className="mt-8">

              <h3 className="mb-4 font-semibold">
                Special Traits
              </h3>

              <div className="grid grid-cols-2 gap-3">

                {[
                  'Crystal Oceans',
                  'Floating Islands',
                  'Aurora Sky',
                  'Energy Ring',
                ].map((trait) => (
                  <div
                    key={trait}
                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-2xl
                      p-3
                      text-sm
                    "
                  >
                    {trait}
                  </div>
                ))}

              </div>

              <GlowButton className="w-full mt-8">
                Mint Planet
              </GlowButton>

            </div>
          </motion.div>

        </div>

        {/* Bottom Carousel */}
        <div className="flex gap-4 mt-8 overflow-x-auto pb-4">

          {variations.map((planet, i) => (
            <div
              key={i}
              className="
                min-w-[140px]
                glass-panel
                p-2
                rounded-2xl
                border
                border-white/10
              "
            >

              <img
                src={planet}
                className="
                  w-full
                  h-28
                  object-cover
                  rounded-xl
                "
              />

            </div>
          ))}

        </div>

      </div>

      {/* Styles */}
      <style jsx>{`
        .glass-panel {
          background: rgba(10, 10, 20, 0.45);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.08);

          box-shadow:
            0 0 40px rgba(168,85,247,0.15),
            inset 0 0 30px rgba(255,255,255,0.03);
        }

        .stat-card {
          padding: 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: white;
        }
      `}</style>

    </div>
  )
}
