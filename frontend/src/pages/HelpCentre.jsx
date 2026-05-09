import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import GlassPanel from '../components/ui/GlassPanel';

/* ── 22 Premium FAQ Items ── */
const faqData = [
  {
    q: 'What is Astira?',
    a: 'Astira is an AI-powered planet creation ecosystem built on Solana. You can describe a world in words, generate a unique planet image, and eventually mint it as an NFT. The platform includes a Cosmic Compass that shows all planets in a 3D orbit, a fusion lab, governance system, and a derivative rewards mechanism.',
  },
  {
    q: 'How do I create my first planet?',
    a: 'Go to the Create Planet page, type a description (e.g., "a golden desert planet with crystal rings"), and click Generate AI Planet. New wallets receive 3 free generations. After that, you can unlock unlimited generations with a one‑time payment of $7.99 in SOL or USDC.',
  },
  {
    q: 'What is the AST token?',
    a: 'AST is the utility token of the Astira ecosystem. It will be used for planet minting, fusion, renaming, advanced AI features, and governance. The token is not live yet, but the economic model is already defined.',
  },
  {
    q: 'What is the Cosmic Compass?',
    a: 'The Cosmic Compass is a 3D interactive star map that displays all planets in the ecosystem. You can rotate, zoom, and filter planets by All, System (the 15 original worlds), or My Planets. Each planet orbits the central star at its own speed.',
  },
  {
    q: 'How does planet fusion work?',
    a: 'Fusion allows you to combine two compatible planets to create a brand new one with blended traits. It costs $3.99 (paid in SOL or USDC). The fusion process is shown with a dramatic animation and the result appears in your Cosmic Compass.',
  },
  {
    q: 'What are derivative rewards?',
    a: 'If a newly generated planet is stylistically similar to an existing one, the system recognises it as a derivative and allocates a portion of the generation fee (15%) to a reward pool. The first 16 creators in the lineage of the original planet share that pool.',
  },
  {
    q: 'How is voting power calculated?',
    a: 'Voting power is based on two factors: the number of planets you own and the amount of AST tokens you hold. To prevent whales from dominating, the combined influence is capped at 5% of the total possible votes.',
  },
  {
    q: 'What are the governance layers?',
    a: 'Astira uses a hybrid governance model with three layers: Planet Holder Governance (community matters), Economic Governance (tokenomics, fees), and Style‑Specific Governance (decisions about fusion rules, derivative lineage).',
  },
  {
    q: 'How do I connect my wallet?',
    a: 'Click the "Select Wallet" button in the top bar or the "Connect Wallet" prompt on the Create Planet page. You can choose Phantom, Solflare, or other Solana wallets. The site works in a normal browser – no dApp browser required.',
  },
  {
    q: 'Is my wallet secure?',
    a: 'We never have access to your private keys. All transactions are signed locally in your wallet. Authentication uses a one‑time signature (Sign‑In with Solana) that proves wallet ownership without exposing any secrets.',
  },
  {
    q: 'Can I use the platform without a wallet?',
    a: 'Yes – you can browse the Dashboard, explore the Cosmic Compass, view the Team page, and read the Whitepaper without connecting a wallet. Only planet generation and fusion require wallet authentication.',
  },
  {
    q: 'What is the refund policy?',
    a: 'Refunds are only given for failed AI generations or duplicate charges. You will not receive a refund simply because you dislike a generated planet. Instead, you may be offered discounted regeneration attempts in some cases.',
  },
  {
    q: 'How does the one‑time premium unlock work?',
    a: 'After you use your 3 free generations, the platform asks you to pay $7.99 (SOL or USDC) to unlock Advanced AI Generation permanently. This is a one‑time payment that grants unlimited planet generations for your wallet forever.',
  },
  {
    q: 'What payment methods are available?',
    a: 'You can pay with SOL or USDC. When you select SOL, the amount is converted from USD using the live CoinGecko price. Payments are sent directly to the project treasury wallet on Solana.',
  },
  {
    q: 'Where does my payment go?',
    a: 'All payments go to the official Astira treasury wallet. This funds further development, hosting, and ecosystem rewards.',
  },
  {
    q: 'Will there be a marketplace?',
    a: 'Yes – the Galactic Marketplace is planned. It will allow you to buy, sell, and auction planet NFTs. An activity feed will show recent mints and trades.',
  },
  {
    q: 'What is the token supply?',
    a: 'The AST token will have a total supply of 1 billion. Distribution details will be released in the tokenomics section of the whitepaper.',
  },
  {
    q: 'When will NFTs be mintable?',
    a: 'NFT minting is scheduled for Q4 2026. Until then, you can generate and store planets in the Cosmic Compass. Minting will use the $AST token.',
  },
  {
    q: 'How can I contact the team?',
    a: 'You can reach us on Twitter (@astira_web3) or Telegram (t.me/astiraweb3). The Fleet Command page also shows individual team member profiles with social links.',
  },
  {
    q: 'What is the roadmap?',
    a: 'Q3 2026: Public launch with planet generation and Cosmic Compass. Q4 2026: NFT minting and marketplace beta. Q1 2027: Fusion system and DAO activation. Q2 2027: Full decentralised governance and mobile app.',
  },
  {
    q: 'Can I delete a planet?',
    a: 'Yes – if you created the planet and it has not been minted, you can delete it from the Cosmic Compass. This removes it from your collection and from public view.',
  },
  {
    q: 'What is the difference between a planet’s type and rarity?',
    a: 'Type describes the planet’s environment (Fire Planet, Ice Planet, etc.). Rarity indicates how scarce it is (Common, Uncommon, Rare, Epic, Legendary). Rarity affects visual traits and, in the future, marketplace value.',
  },
];

/* ── AI Chat Component ── */
function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    try {
      const resp = await api.post('/help/chat', {
        question: input,
        history: messages.slice(-10), // keep last 10 messages for context
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: resp.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setTyping(false);
    }
  };

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
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-auto p-3 bg-white/10 rounded-xl flex gap-1"
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
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
  );
}

/* ── FAQ Component ── */
function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex justify-between items-center p-4 text-white">
            <span className="text-sm md:text-base font-medium">{item.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              className="text-xl text-purple-400 flex-shrink-0 ml-4"
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
                className="px-4 pb-4 text-gray-300 text-sm leading-relaxed"
              >
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Main HelpCenter Page ── */
export default function HelpCenter() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto space-y-16 py-8">
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Astira Help Center
      </h2>

      <section>
        <h3 className="text-2xl font-semibold text-cyan-300 mb-6">🤖 AI Assistant</h3>
        <AIChat />
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-cyan-300 mb-6">📋 Frequently Asked Questions</h3>
        <FAQ />
      </section>
    </div>
  );
}
