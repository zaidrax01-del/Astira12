'use client'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import Featured from '../components/sections/Featured'
import SpaceBackground from '../components/animations/SpaceBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <Navbar />
      <Hero />
      <Featured />
    </div>
  )
}
