'use client'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import Featured from '../components/sections/Featured'
import SpaceBackground from '../components/animations/SpaceBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Deep space stars behind everything */}
      <SpaceBackground />

      {/* Transparent navbar */}
      <Navbar />

      {/* Hero section with new background image */}
      <Hero />

      {/* Featured planets grid */}
      <Featured />
    </div>
  )
}
