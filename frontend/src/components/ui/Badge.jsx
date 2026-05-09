const variants = {
  captain: 'from-yellow-500 to-orange-500',
  navigator: 'from-cyan-500 to-blue-600',
  signal: 'from-violet-500 to-purple-700',
  artist: 'from-pink-500 to-rose-600',
  engineer: 'from-green-400 to-emerald-600',
}

export default function Badge({ type, label }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${variants[type] || 'from-gray-500 to-gray-700'} shadow-lg`}>
      {label}
    </span>
  )
}
