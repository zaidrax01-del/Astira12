'use client'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

export default function Marketplace() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-8 text-center">
        <h2 className="text-4xl font-bold text-gradient">Galactic Marketplace</h2>
        <p className="text-gray-300 mt-4">Coming soon.</p>
      </main>
    </div>
  )
}
