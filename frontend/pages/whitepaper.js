'use client'
import GlowButton from '../components/ui/GlowButton'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const sections = [
  {
    title: 'What is Astira?',
    image: null,
    content: `Astira is an NFT creation and trading platform built around the theme of "planets." Users can generate, mint, display, trade, and operate their own planet NFTs within a unified cosmic narrative.\n\nAstira is NOT just another "upload image → list → sell" marketplace. It solves the problem of NFTs lacking continuous interaction, storytelling, and long-term participation.\n\nIn one sentence: Astira helps users map their ideals and identities into a digital planet that can be created, owned, traded, evolved, and governed.`
  },
  {
    title: 'Vision, Mission & Brand Emotion',
    image: null,
    content: `Vision: Create a digital universe where everyone can showcase their art. Each planet carries an individual's aesthetics, stories, identity, and values.\n\nMission:\n• Lower the barrier to high-quality NFT creation\n• Turn static NFTs into dynamic, evolving assets\n• Build a long-term ecosystem for creation, trading, interaction, and governance\n• Transition to self-owned blockchain infrastructure\n\nBrand Emotion: Not pure financial speculation — but creating a planet of your own. Focus on dreams, long-termism, identity expression, and participation.\n\nTarget Users: NFT collectors, Web3 users, digital artists, astronomy fans, young communities, and anyone wanting a new form of digital identity.`
  },
  {
    title: 'Market Pain Points & Astira\'s Opportunity',
    image: null,
    content: `Static NFT assets (dead after mint) → Dynamic evolution & on-chain events\nHigh creation barriers (only pros) → AI-assisted planet generation\nNo story or community space → Galaxy map & social exploration\n\nOpportunity: A platform with low-barrier creation, continuous evolution, trading, social display, and a unified worldview becomes a scalable universe product — not just a marketplace.`
  },
  {
    title: 'AI-Driven Planet Genesis',
    image: 'https://i.ibb.co/LDS8LcFd/file-000000007e9871f4970986440f72c70a.png',
    content: `Users describe a planet in natural language (color, terrain, rings, resources, story tags). AI generates 2D/3D visuals + structured attributes.\n\nOutput includes:\n• Name, visual form, rarity, resource type\n• Habitability index, special event triggers\n• Cosmic coordinates, family lineage\n\nKey principle: Generation inherits the visual genes of the original planet series — no chaotic randomness. New planets feel like relatives of the core collection.\n\nValue: Astira upgrades from a trading market to a cosmic creation tool.`
  },
  {
    title: 'Original Series & Creator Revenue Sharing',
    image: 'https://i.ibb.co/Swtdjcn7/file-0000000032cc71f49ee4753b9d0fa1ce.png',
    content: `The Original 16 Planets are the aesthetic ancestors of the entire universe. All new planets must have a mapping relationship to them (color, structure, climate, emotion, etc.).\n\nRevenue Sharing: When a new planet is generated from an original series branch, royalties are automatically shared with the original series holders.\n\nWhy it matters: Protects scarcity, boosts holder loyalty, and gives creators long-term income — not just a one-time sale.`
  },
  {
    title: 'Dynamic Evolution (Living NFTs)',
    image: null,
    content: `Planets are not fixed images. They change over time, behavior, and on-chain events.\n\nEvolution triggers:\n• Sign-in, caring, staking, tasks, events\n• Adding resources or triggering special events\n\nPossible outcomes:\n• New satellites, skins, rarity upgrades, special statuses\n\nOn-chain events: comets, star fissions, black hole tides, civilization revivals — changing attributes and narratives.\n\nValue: Buying a planet is the beginning, not the end. Higher retention, longer lifecycle, stronger community.`
  },
  {
    title: 'Galaxy Map & Social Exploration',
    image: 'https://i.ibb.co/gFcFgsV5/file-000000006224720aab49868623ed0ac3.png',
    content: `All minted planets appear on a unified, browsable galaxy map.\n\nWhat you can do:\n• Pilot your planet or vehicle to visit others\n• View owner's logs, stories, showcase pages, activity records\n\nEvents: interstellar trade fairs, themed exhibitions, planet parties, brand sponsorships.\n\nStrategic choice: Lightweight 2D/light 3D (not a heavy metaverse) — easier to build and scale.`
  },
  {
    title: 'Integration & Deconstruction (Circular Economy)',
    image: null,
    content: `Integration: Merge two planets → new hybrid planet. Inherits attributes + rarity bonuses. Burns/locks resources.\n\nDeconstruction: Break a planet into fragments, star cores, mineral cards, civilization modules. Trade or reuse them.\n\nResult: A multi-layered cycle of generate → cultivate → merge → deconstruct → retrade. Increases user operations and reinforces scarcity of original series.`
  },
  {
    title: 'Real Astronomical Data Linkage',
    image: null,
    content: `Astira integrates real exoplanet data from NASA, ESA, and other public databases.\n\nFeatures:\n• Generate "scientific art" planets based on real mass, temperature, orbital period, star type\n• Regular "Discover New Planets" contests with community voting, airdrops, and rewards\n\nCross-industry value: Attracts astronomy fans, science educators, and cultural brands — not just the NFT crowd.`
  },
  {
    title: 'DAO Governance & Planetary Council',
    image: null,
    content: `Who governs:\n• Original series NFT holders\n• Qualified planet holders\n• AST token holders\n\nWhat the community decides:\n• Feature priorities, event rules, rare event frequency\n• AI model tuning, map access standards, incentive distribution\n\nStructure: Platform-led → joint governance → community-led "Planetary Council"\n\nValue: DAO is not just voting. It gives users lasting influence over the cosmic order.`
  },
  {
    title: 'Business Model & Revenue Sources',
    image: null,
    content: `Transaction fees — Primary & secondary NFT sales\nAI creative premium — Higher precision, more templates, rare recipes\nMinting & function fees — Fusion, disassembly, renaming, skins, event activation\nBrand partnerships — Planet surface ads, sponsored star zones, co-branded planets`
  },
  {
    title: '$AST Token Model',
    image: 'https://i.ibb.co/3q08cRb/file-000000004f1c720aa9405624d3b12ce0.png',
    content: `Role: Core functional token for payments, incentives, governance, and ecosystem settlement.\n\nMain uses:\n• Pay casting & premium generation fees\n• DAO governance & staking\n• Unlock rare creation permissions\n• Special events & ecological transactions\n\nValue capture: More platform activity → more $AST usage → demand grows.\n\nDistribution:\n• Ecological Development: 25%\n• Team: 20%\n• Community Incentives: 20%\n• Liquidity: 15%\n• Marketing: 10%\n• Airdrop: 10%`
  },
  {
    title: 'Technical Architecture & Public Chain Plan',
    image: null,
    content: `Initial deployment: Low-gas, user-friendly chains (e.g., Solana) to lower entry barriers.\n\nComponents:\n• Wallet login, contract minting, IPFS/decentralized storage\n• AI generation, on-chain event system, trading market, map display\n\nFuture – Astira Chain: When scale and complexity grow, Astira will launch its own blockchain for higher-frequency interactions, lower-cost updates, and a complete universe application layer.\n\n"Highest respect for Solana."`
  },
  {
    title: 'Roadmap',
    image: 'https://i.ibb.co/nN4ymf8V/file-00000000e07c7243b9baa5797a606962.png',
    content: `Phase 1 — Platform Validation: Brand, core visuals, planet creation MVP, original series, basic trading\n\nPhase 2 — Gameplay Enhancement: Dynamic evolution, star map, user logs, airdrops, community ops\n\nPhase 3 — Ecological Expansion: Integration/disassembly, brand collabs, data activities, DAO proposals\n\nPhase 4 — Infrastructure Upgrade: Astira Chain, cross-chain, developer interfaces, open ecosystem`
  },
  {
    title: 'Final Conclusion',
    image: null,
    content: `The true value of Astira is not selling an NFT concept or a trading interface. It uses planets as a symbolic medium to combine creativity, identity, storytelling, and digital assets.\n\nFor users: You're not buying a picture. You own a planet that expresses you, grows over time, enters the cosmic order, and is seen by others.\n\nFinal line: Everyone who runs for their ideals deserves to have a planet of their own in the digital universe. Astira is the starting point of that planet.`
  }
]

export default function Whitepaper() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-4 sm:px-8 max-w-5xl mx-auto space-y-12 pb-20">
        {/* Logo centered at top */}
        <div className="flex flex-col items-center space-y-6">
          <img
            src="https://i.ibb.co/39zH1sdf/file-00000000575871f4a13f4a32e177655e.png"
            alt="Astira Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
          <h2 className="text-4xl font-bold text-gradient text-center">Astira Whitepaper</h2>
        </div>

        {sections.map((sec) => (
          <div key={sec.title} className="glass p-6 sm:p-8 rounded-2xl space-y-6">
            <h3 className="text-2xl font-semibold text-purple-300">{sec.title}</h3>

            {/* Section image with fixed aspect ratio and contained fit */}
            {sec.image && (
              <div className="relative w-full max-w-full rounded-xl overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.15)] bg-black/20">
                <div className="aspect-video">
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            )}

            {/* Text content */}
            <div className="space-y-2">
              {sec.content.split('\n').map((line, i) => (
                <p key={i} className="text-gray-300 leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <GlowButton onClick={() => window.open('/whitepaper.pdf', '_blank')}>
            Download PDF
          </GlowButton>
        </div>
      </main>
    </div>
  )
}
