export default function GlassPanel({ children, className }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}
