import GlowButton from '../components/ui/GlowButton'

const sections = [
  { title: 'Overview', content: 'Astira is an AI-powered planet NFT ecosystem built on Solana...' },
  { title: 'Core Features', content: 'AI generation, Cosmic Compass, Fusion, Rewards, DAO governance...' },
  { title: '$ASTIRA Token', content: 'Utility token for minting, fusion, voting. Total supply: 1 billion...' },
  { title: 'Roadmap', content: 'Q3 2026: Public launch...' },
]

export default function Whitepaper() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <h2 className="text-3xl font-bold text-center text-cyan-300">Whitepaper</h2>
      {sections.map(sec => (
        <div key={sec.title} className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-semibold text-purple-300 mb-4">{sec.title}</h3>
          <p className="text-gray-300">{sec.content}</p>
        </div>
      ))}
      <div className="text-center">
        <GlowButton onClick={() => window.open('/whitepaper.pdf', '_blank')}>Download PDF</GlowButton>
      </div>
    </div>
  )
}
