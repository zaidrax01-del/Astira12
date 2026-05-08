import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'
import GlowButton from '../components/ui/GlowButton'

export default function Governance() {
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    api.get('/governance/proposals').then(r => setProposals(r.data))
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-3xl text-center mb-8 text-purple-300">Governance</h2>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {proposals.map(p => (
          <GlassPanel key={p.id} className="p-6">
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="text-sm text-gray-400">{p.layer} · {p.status}</p>
            <p className="text-xs text-gray-500">Ends: {new Date(p.end_timestamp).toLocaleString()}</p>
            <GlowButton className="mt-4">Vote</GlowButton>
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
