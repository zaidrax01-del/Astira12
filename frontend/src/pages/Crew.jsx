import { motion } from 'framer-motion'
import GlassPanel from '../components/ui/GlassPanel'
import Badge from '../components/ui/Badge'

const crew = [
  { name: 'Astira', role: 'CEO & Founder', desc: 'The visionary driving the mission...', img: 'https://i.ibb.co/bMz81nMn/IMG-20260421-122500-468.jpg', badge: { type: 'captain', label: 'Captain' }, socials: { twitter: 'https://x.com/astira_web3', telegram: 'https://t.me/Astira_web3' } },
  { name: 'Bob', role: 'Community Manager', desc: 'Nurturing the heart of Astira...', img: 'https://i.ibb.co/LdsRxcjr/IMG-20260421-122540-947.jpg', badge: { type: 'navigator', label: 'Navigator' }, socials: { twitter: 'https://x.com/bobbyd_great?s=11', telegram: 'https://t.me/bobbythe_great' } },
  { name: 'Tom', role: 'Project Promotion Manager', desc: 'Expanding the universe...', img: 'https://i.ibb.co/bMz81nMn/IMG-20260421-122500-468.jpg', badge: { type: 'signal', label: 'Signal Booster' }, socials: { twitter: 'https://x.com/astira_tom3?s=11', telegram: 'https://t.me/astiraTom' } },
  { name: 'Croix', role: 'Poster Designer', desc: 'The artist behind the cosmic visuals...', img: 'https://i.ibb.co/G438tLCp/IMG-20260421-122548-698.jpg', badge: { type: 'artist', label: 'Cosmic Artist' }, socials: { twitter: 'https://x.com/croixonchain?s=11', telegram: 'https://t.me/croixonchain' } },
  { name: 'Zaidra', role: 'Website Developer', desc: 'Building the bridge between AI and UX...', img: 'https://i.ibb.co/sd0fSH9W/file-000000002f0471f4ae01242774e7141a.png', badge: { type: 'engineer', label: 'Quantum Engineer' }, socials: { twitter: 'https://x.com/zaidra_', telegram: 'https://t.me/zaidrax' } }
]

const ProjectSocials = () => (
  <div className="flex justify-center gap-8 text-2xl mt-24">
    <a href="https://x.com/astira_web3" target="_blank" className="hover:text-purple-400">𝕏</a>
    <a href="https://t.me/astiraweb3" target="_blank" className="hover:text-purple-400">✈️</a>
  </div>
)

export default function Crew() {
  return (
    <div className="min-h-screen py-20 px-6">
      <motion.h1 initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-bold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-20">Astira Fleet Command</motion.h1>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {crew.map((m, i) => (
          <motion.div key={m.name} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i*0.1 }} whileHover={{ y: -10 }}>
            <GlassPanel className="p-8 text-center h-full flex flex-col items-center border border-white/10">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 p-1 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <img src={m.img} className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold">{m.name}</h2>
              <p className="text-purple-400 uppercase text-sm mb-2">{m.role}</p>
              <Badge type={m.badge.type} label={m.badge.label} />
              <p className="text-gray-400 text-sm mt-4 flex-grow">{m.desc}</p>
              <div className="flex gap-4 mt-6">
                {Object.entries(m.socials).map(([k, v]) => (
                  <a key={k} href={v} target="_blank" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-500/30 flex items-center justify-center">{k==='twitter'?'𝕏':'✈️'}</a>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
      <ProjectSocials />
    </div>
  )
}
