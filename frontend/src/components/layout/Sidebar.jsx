import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { name: 'Dashboard', path: '/' },
  { name: 'Create Planet', path: '/create' },
  { name: 'Cosmic Compass', path: '/compass' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'Activity', path: '/activity' },
  { name: 'Team', path: '/team' },
  { name: 'Whitepaper', path: '/whitepaper' },
  { name: 'Help Center', path: '/help' },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: open ? 0 : -300 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed left-0 top-20 bottom-0 w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col p-6"
    >
      <nav className="flex flex-col gap-3 flex-1">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={onClose}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${
              location.pathname === link.path ? 'text-purple-400 bg-white/5' : 'text-gray-300'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="flex gap-4 pt-4 border-t border-white/10">
        <a href="https://x.com/astira_web3" target="_blank" className="text-gray-400 hover:text-purple-400">𝕏</a>
        <a href="https://t.me/astiraweb3" target="_blank" className="text-gray-400 hover:text-purple-400">✈️</a>
      </div>
    </motion.aside>
  )
}
