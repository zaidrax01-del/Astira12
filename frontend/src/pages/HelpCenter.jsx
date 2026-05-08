import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'

export default function HelpCenter() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [faqs, setFaqs] = useState([])
  const [open, setOpen] = useState(null)

  useState(() => { api.get('/help/faq').then(r => setFaqs(r.data)) }, [])

  const ask = async () => {
    const resp = await api.post('/help/chat', { question, history: [] })
    setAnswer(resp.data.answer)
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl text-center mb-8 text-purple-300">Help Center</h2>
      <div className="mb-12">
        <textarea value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-white/10 rounded p-4 mb-4" placeholder="Ask Astira AI..." />
        <button onClick={ask} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded">Ask</button>
        {answer && <GlassPanel className="mt-4 p-4">{answer}</GlassPanel>}
      </div>
      <div>
        <h3 className="text-2xl mb-4">FAQs</h3>
        {faqs.map((faq, idx) => (
          <GlassPanel key={idx} className="mb-2 cursor-pointer" onClick={() => setOpen(open === idx ? null : idx)}>
            <div className="flex justify-between items-center p-4">
              <span>{faq.q}</span>
              <span>{open === idx ? '−' : '+'}</span>
            </div>
            <AnimatePresence>
              {open === idx && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 text-gray-300">
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
