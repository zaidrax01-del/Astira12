import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'

export default function CosmicCompass() {
  const [planets, setPlanets] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [rarity, setRarity] = useState('')

  const fetchPlanets = async () => {
    const resp = await api.get('/compass/planets', { params: { search, type, rarity } })
    setPlanets(resp.data.planets)
  }

  useEffect(() => { fetchPlanets() }, [search, type, rarity])

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-3xl text-center mb-8 text-purple-300">Cosmic Compass</h2>
      <div className="flex gap-4 mb-8 justify-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-white/10 rounded px-4 py-2" />
        <select value={type} onChange={e => setType(e.target.value)} className="bg-white/10 rounded px-4 py-2">
          <option value="">All Types</option>
          <option>Fire Planet</option><option>Ice Planet</option><option>Water Planet</option>
        </select>
        <select value={rarity} onChange={e => setRarity(e.target.value)} className="bg-white/10 rounded px-4 py-2">
          <option value="">All Rarities</option>
          <option>Common</option><option>Uncommon</option><option>Rare</option><option>Epic</option><option>Legendary</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {planets.map(p => (
          <motion.div key={p.id} whileHover={{ scale: 1.05 }} className="rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-md border border-white/10">
            <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="text-sm text-gray-400">{p.planet_type} · {p.rarity}</p>
              <p className="text-xs text-gray-500">by {p.creator.slice(0, 6)}...</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
