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
    'https://threejs.org/examples/textures/planets/jupiter.jpg'
  )

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y =
        clock.getElapsedTime() * 0.03
    }

    if (ringRef.current) {
      ringRef.current.rotation.z =
        clock.getElapsedTime() * 0.08
    }
  })

  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3)

    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 20
      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 20
    }

    return positions
  }, [])

  return (
    <group>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />

        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[2.2, 256, 256]} />

        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2.2, 128, 128]} />

        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring */}
      <mesh
        ref={ringRef}
        rotation={[1.1, 0, 0]}
      >
        <torusGeometry args={[3.4, 0.04, 16, 200]} />

        <meshBasicMaterial color="#d8b4fe" />
      </mesh>

      {/* Particles */}
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
          size={0.02}
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
  ]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764_0%,#070114_40%,#000_100%)]" />

      <div className="
        absolute
        top-1/3
        left-1/2
        -translate-x-1/2
        w-[500px]
        lg:w-[900px]
        h-[500px]
        lg:h-[900px]
        rounded-full
        bg-purple-500/20
        blur-[120px]
      " />

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="
        relative
        z-10
        pt-24
        px-4
        lg:px-10
        pb-10
      ">

        <div className="
          flex
          flex-col
          lg:grid
          lg:grid-cols-[340px_1fr_340px]
          gap-6
          items-start
        ">

          {/* MOBILE PLANET FIRST */}
          <div className="
            order-1
            lg:order-2
            relative
            w-full
            h-[320px]
            lg:h-[820px]
            flex
            items-center
            justify-center
          ">

            {/* Glow */}
            <div className="
              absolute
              w-[320px]
              h-[320px]
              lg:w-[700px]
              lg:h-[700px]
              rounded-full
              bg-purple-500/20
              blur-[100px]
            " />

            <Canvas
              camera={{
                position: [0, 0, 7],
                fov: 45,
              }}
            >

              <fog
                attach="fog"
                args={['#070114', 8, 20]}
              />

              <ambientLight intensity={0.5} />

              <pointLight
                position={[5, 5, 5]}
                intensity={2.5}
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
                count={3000}
                factor={4}
                fade
              />

              <OrbitControls
                autoRotate
                autoRotateSpeed={0.25}
                enableZoom={false}
              />

              <Suspense fallback={null}>
                <PlanetScene />
              </Suspense>

            </Canvas>

            {/* CONTROLS */}
            <div className="
              absolute
              bottom-2
              lg:bottom-10
              glass-panel
              rounded-full
              px-5
              py-3
              flex
              items-center
              gap-4
            ">

              <button>◀</button>

              <button className="text-sm">
                360°
              </button>

              <button>▶</button>

            </div>
          </div>

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              order-2
              lg:order-1
              w-full
              glass-panel
              rounded-[28px]
              p-5
              lg:h-[760px]
            "
          >

            <h1 className="
              text-3xl
              lg:text-5xl
              font-black
              leading-none
            ">
              AI-DRIVEN
            </h1>

            <h2 className="
              text-3xl
              lg:text-5xl
              font-black
              text-purple-400
              leading-none
              mb-3
            ">
              PLANET GENESIS
            </h2>

            <p className="
              text-gray-400
              text-sm
              mb-6
            ">
              Describe it. Generate it. Own it.
            </p>

            {/* INPUT */}
            <div className="space-y-5">

              <div>

                <p className="
                  text-sm
                  text-gray-300
                  mb-2
                ">
                  Describe Your Planet
                </p>

                <textarea
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.target.value)
                  }
                  placeholder="Crystal oceans, floating islands, purple atmosphere..."
                  className="
                    w-full
                    h-32
                    lg:h-44
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

              {/* STYLE */}
              <div>

                <p className="
                  text-sm
                  text-gray-300
                  mb-3
                ">
                  Style
                </p>

                <div className="
                  flex
                  flex-wrap
                  gap-2
                ">

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
                        text-sm
                        hover:border-purple-500
                        transition
                      "
                    >
                      {item}
                    </button>
                  ))}

                </div>

              </div>

              {/* STATS */}
              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <div className="stat-card">
                  <p className="stat-label">
                    Type
                  </p>

                  <h3>Oceanic</h3>
                </div>

                <div className="stat-card">
                  <p className="stat-label">
                    Energy
                  </p>

                  <h3>High</h3>
                </div>

                <div className="stat-card">
                  <p className="stat-label">
                    Rarity
                  </p>

                  <h3>Epic</h3>
                </div>

                <div className="stat-card">
                  <p className="stat-label">
                    Habitability
                  </p>

                  <h3>78%</h3>
                </div>

              </div>

              <GlowButton className="w-full">
                Generate Planet
              </GlowButton>

            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              order-3
              w-full
              glass-panel
              rounded-[28px]
              p-5
              lg:h-[760px]
            "
          >

            <h2 className="
              text-2xl
              font-bold
              mb-5
            ">
              Your Generated Planet
            </h2>

            {/* FIXED IMAGE */}
            <div className="
              w-full
              h-52
              rounded-2xl
              overflow-hidden
              border
              border-white/10
              bg-white/5
            ">

              <img
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop"
                alt="planet"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            </div>

            {/* INFO */}
            <div className="
              mt-6
              space-y-4
            ">

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

            {/* TRAITS */}
            <div className="mt-8">

              <h3 className="
                font-semibold
                mb-4
              ">
                Special Traits
              </h3>

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

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

        {/* CAROUSEL */}
        <div className="
          flex
          gap-4
          mt-8
          overflow-x-auto
          pb-4
        ">

          {variations.map((planet, i) => (
            <div
              key={i}
              className="
                min-w-[120px]
                lg:min-w-[150px]
                glass-panel
                rounded-2xl
                p-2
              "
            >

              <img
                src={planet}
                className="
                  w-full
                  h-24
                  lg:h-32
                  object-cover
                  rounded-xl
                "
              />

            </div>
          ))}

        </div>

      </div>

      {/* STYLES */}
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
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .stat-label {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>

    </div>
  )
}
