'use client'
import GlowButton from '../components/ui/GlowButton'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const sections = [
  { title: 'Overview', content: 'Astira is an AI-powered planet NFT ecosystem built on Solana...' },
  { title: 'Core Features', content: 'AI generation, Cosmic Compass, Fusion, Rewards, DAO governance...' },
  { title: '$ASTIRA Token', content: 'Utility token for minting, fusion, voting. Total supply: 1 billion...' },
  { title: 'Roadmap', content: 'Q3 2026: Public launch...' },
]

export default function Whitepaper() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-8 max-w-4xl mx-auto space-y-12">
        <h2 className="text-4xl font-bold text-center text-gradient">Whitepaper</h2>
        {sections.map(sec => (
          <div key={sec.title} className="glass p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">{sec.title}</h3>
            <p className="text-gray-300">{sec.content}</p>
          </div>
        ))}
        <div className="text-center">
          <GlowButton onClick={() => window.open('/whitepaper.pdf', '_blank')}>Download PDF</GlowButton>
        </div>
      </main>
    </div>
  )
}
