import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlowButton from '../ui/GlowButton';

function FloatingPlanet() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#a855f7"
        roughness={0.4}
        metalness={0.8}
        emissive="#1e1b4b"
      />
      <pointLight intensity={1} distance={10} />
    </mesh>
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-8 pt-24 pb-12">
      {/* Left text */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 space-y-6 text-center md:text-left"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Explore the <span className="text-gradient">Cosmos</span><br />
          Own the <span className="text-gradient">Planets</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-lg">
          Mint unique AI‑generated planets, trade in the marketplace, and shape the galaxy with our DAO.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <Link to="/create">
            <GlowButton>Create a Planet</GlowButton>
          </Link>
          <Link to="/compass">
            <button className="px-8 py-3 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400/10 transition">
              Explore All
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Right 3D planet */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="md:w-1/2 h-[400px] md:h-[600px]"
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <FloatingPlanet />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </motion.div>
    </section>
  );
}
