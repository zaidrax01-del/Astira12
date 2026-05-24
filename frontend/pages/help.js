'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

// 30 FAQ items randomly selected from the full 500 – covering all major topics
const faqData = [
  {
    q: 'What is Astira?',
    a: 'Astira is an NFT creation and trading platform built around the theme of "planets," where users generate, mint, display, trade, and operate their own planet NFTs.',
  },
  {
    q: 'How do I create a planet?',
    a: 'Go to the Create Planet page, type a description, and click Generate AI Planet. New wallets get 3 free generations. After that, a one-time $7.99 payment unlocks unlimited generations.',
  },
  {
    q: 'What is the $AST token used for?',
    a: 'Payments, incentives, governance, and ecosystem settlement. You can use it for minting fees, premium generation, staking, and voting.',
  },
  {
    q: 'What is the original planet series?',
    a: '16 original planets that serve as the aesthetic ancestors for all future generations. Holders receive royalties from derivative planets.',
  },
  {
    q: 'Can planets evolve?',
    a: 'Yes, planets change over time through user actions, staking, and on‑chain events like comet passes or black hole tides.',
  },
  {
    q: 'What is the galaxy map?',
    a: 'A unified 2D/light 3D map where all minted planets are displayed. You can visit other planets, view their logs, and attend events.',
  },
  {
    q: 'How does integration work?',
    a: 'Merge two planets into a new hybrid. The originals are burned or locked, and the new planet inherits traits plus rarity bonuses.',
  },
  {
    q: 'What is deconstruction?',
    a: 'Break a planet into resource fragments, star cores, or mineral cards, which can be traded or used for upgrades.',
  },
  {
    q: 'Does Astira use real astronomical data?',
    a: 'Yes, from NASA and ESA databases. You can generate "scientific art" planets based on real exoplanet parameters.',
  },
  {
    q: 'Who governs Astira?',
    a: 'Original series holders, qualified planet holders, and $AST token holders participate in DAO governance.',
  },
  {
    q: 'What is the roadmap?',
    a: 'Phase 1: Platform validation. Phase 2: Gameplay enhancement. Phase 3: Ecological expansion. Phase 4: Infrastructure upgrade.',
  },
  {
    q: 'Is $AST required to mint a planet?',
    a: 'Casting fees are paid in $AST. However, free generations are available initially.',
  },
  {
    q: 'Can I use the platform without a wallet?',
    a: 'Yes, you can browse the Dashboard, explore the Cosmic Compass, and view the Whitepaper without connecting a wallet.',
  },
  {
    q: 'What is the Cosmic Compass?',
    a: 'A 3D interactive star map that displays all planets in orbit. You can rotate, zoom, and filter by All, System, or My Planets.',
  },
  {
    q: 'How does planet fusion work?',
    a: 'Combine two compatible planets to create a brand new one with blended traits. It costs $3.99 paid in SOL or USDC.',
  },
  {
    q: 'What are derivative rewards?',
    a: 'If a new planet is stylistically similar to an existing one, 15% of the generation fee goes to a reward pool shared among the first 16 lineage holders.',
  },
  {
    q: 'How is voting power calculated?',
    a: 'Based on the number of planets you own and your AST token balance, capped at 5% of total possible votes.',
  },
  {
    q: 'What payment methods are available?',
    a: 'You can pay with SOL or USDC. SOL amounts are converted live using the CoinGecko price.',
  },
  {
    q: 'Will there be a marketplace?',
    a: 'Yes – the Galactic Marketplace is planned. It will allow buying, selling, and auctioning planet NFTs.',
  },
  {
    q: 'How can I contact the team?',
    a: 'Reach us on Twitter @astira_web3 or Telegram t.me/astiraweb3. The Team page also shows individual profiles.',
  },
  {
    q: 'Can I delete a planet?',
    a: 'Yes, if you created the planet and it has not been minted, you can delete it from the Cosmic Compass.',
  },
  {
    q: 'What is the difference between planet type and rarity?',
    a: 'Type describes the environment (Fire, Ice, etc.). Rarity indicates scarcity (Common, Rare, Epic, Legendary).',
  },
  {
    q: 'Is my wallet secure?',
    a: 'We never access your private keys. All transactions are signed locally in your wallet via Sign‑In with Solana.',
  },
  {
    q: 'What is the refund policy?',
    a: 'Refunds are only given for failed AI generations or duplicate charges, not for dissatisfaction with a generated planet.',
  },
  {
    q: 'How does the one‑time premium unlock work?',
    a: 'After 3 free generations, a one‑time $7.99 payment unlocks unlimited planet generation for your wallet forever.',
  },
  {
    q: 'Does the platform have a token burn mechanism?',
    a: 'Not explicitly, but fees may be burned or locked in the future as decided by the DAO.',
  },
  {
    q: 'Can I use Astira on mobile?',
    a: 'Yes, the website is fully responsive and works on mobile browsers. Wallet connection is supported via Phantom or Solflare apps.',
  },
  {
    q: 'What happens during a "black hole tide" event?',
    a: 'It is a random on‑chain event that can alter planet attributes, adding narrative and rarity changes.',
  },
  {
    q: 'Can I earn $AST tokens?',
    a: 'Yes, through community incentives, staking, airdrops, and participating in events.',
  },
  {
    q: 'Where can I download the full whitepaper?',
    a: 'Visit the Whitepaper page and click the Download PDF button to get the complete document.',
  },
]

// ---- AI Chat Component with loading animation ----
function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    try {
      const resp = await api.post('/help/chat', {
        question: input,
        history: messages.slice(-10),
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: resp.data.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ])
    } finally {
      setThinking(false)
    }
  }

  return (
    <GlassPanel className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'ml-auto bg-purple-500/20 text-white'
                  : 'mr-auto bg-white/10 text-gray-200'
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto p-3 bg-white/10 rounded-xl flex items-center gap-2 text-gray-400 text-sm"
            >
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent" />
              Thinking...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about Astira..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={send}
          className="p-2 rounded-full bg-purple-500/30 text-purple-300 hover:bg-purple-500/50"
        >
          ➤
        </button>
      </div>
    </GlassPanel>
  )
}

// ---- FAQ Section ----
function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-3">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="glass p-4 rounded-xl cursor-pointer"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex justify-between items-center text-white">
            <span className="text-sm md:text-base font-medium">{item.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              className="text-xl text-purple-400"
            >
              +
            </motion.span>
          </div>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-gray-300 text-sm mt-2 leading-relaxed"
              >
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// ---- Main Help Center Page ----
export default function HelpCenter() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-4 sm:px-8 max-w-5xl mx-auto space-y-16 pb-20">
        <h2 className="text-4xl font-bold text-center text-gradient">
          Astira Help Center
        </h2>

        <section>
          <h3 className="text-2xl font-semibold text-cyan-300 mb-6">🤖 Ask the AI</h3>
          <AIChat />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-cyan-300 mb-6">📋 Frequently Asked Questions</h3>
          <FAQ />
        </section>
      </main>
    </div>
  )
}
