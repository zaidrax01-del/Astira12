'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

const faqData = [
  { q: 'What is Astira?', a: 'Astira is an AI-powered planet creation ecosystem...' },
  { q: 'How do I create a planet?', a: 'Go to Create Planet, type a description...' },
  // ... include all 22 FAQs ...
]

export default function HelpCenter() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [open, setOpen] = useState(null)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    try {
      const resp = await api.post('/help/chat', { question: input, history: messages.slice(-10) })
      setMessages(prev => [...prev, { role: 'assistant', content: resp.data.answer }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]) }
    setTyping(false)
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-8 max-w-5xl mx-auto space-y-16">
        <h2 className="text-4xl font-bold text-center text-gradient">Help Center</h2>
        <GlassPanel className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'ml-auto bg-purple-500/20 text-white' : 'mr-auto bg-white/10 text-gray-200'}`}>{msg.content}</motion.div>
              ))}
              {typing && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto p-3 bg-white/10 rounded-xl flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" /></motion.div>}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about Astira..." className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400" />
            <button onClick={send} className="p-2 rounded-full bg-purple-500/30 text-purple-300 hover:bg-purple-500/50">➤</button>
          </div>
        </GlassPanel>
        <div>
          <h3 className="text-2xl font-semibold text-cyan-300 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqData.map((item, i) => (
              <div key={i} className="glass p-4 rounded-xl cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
                <div className="flex justify-between items-center text-white">
                  <span className="text-sm md:text-base font-medium">{item.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl text-purple-400">+</motion.span>
                </div>
                <AnimatePresence>
                  {open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-gray-300 text-sm mt-2">{item.a}</motion.div>}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
