import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'

export default function FusionLab() {
  const { account, token } = useContext(Web3Context)
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [fusing, setFusing] = useState(false)

  const fuse = async () => {
    if (selected.length !== 2) return
    setFusing(true)
    const resp = await api.post('/fusion/execute', { planet_ids: selected }, { headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` } })
    setResult(resp.data.image_url)
    setFusing(false)
  }

  return (
    <div className="min-h-screen p-8 text-center">
      <h2 className="text-3xl mb-8 text-purple-300">Fusion Lab</h2>
      <div className="flex justify-center gap-16 mb-12">
        {[0,1].map(i => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center cursor-pointer border border-white/20">
            {selected[i] ? <img src={`https://gateway.pinata.cloud/ipfs/${selected[i]}`} className="w-full h-full rounded-full" alt="selected" /> : <span className="text-gray-400">Select</span>}
          </motion.div>
        ))}
      </div>
      <GlowButton onClick={fuse} disabled={selected.length !== 2 || fusing}>Fuse (120 AST)</GlowButton>
      {fusing && <div className="mt-8 text-2xl animate-pulse">Fusing...</div>}
      {result && <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={result} className="mx-auto mt-8 w-64 h-64 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)]" />}
    </div>
  )
}
