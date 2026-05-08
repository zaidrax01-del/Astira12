import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlowButton from '../components/ui/GlowButton'

export default function PlanetCreator() {
  const { account, token } = useContext(Web3Context)
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const resp = await api.post('/planet/generate', { prompt }, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Id': account } })
    setImage(resp.data.image_url)
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-3xl mb-8 text-purple-300">Create a Planet</h2>
      {!account ? <p>Connect wallet first</p> : (
        <>
          <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your planet..." className="bg-white/10 rounded px-4 py-2 w-80 mb-4" />
          <GlowButton onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate (3 free)'}</GlowButton>
          {image && <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={image} className="mt-8 w-64 h-64 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)]" />}
        </>
      )}
    </div>
  )
}
