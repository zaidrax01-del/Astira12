import { motion } from 'framer-motion'

export default function GlowButton({ children, onClick, disabled, className }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
    >
      {children}
    </motion.button>
  )
}
