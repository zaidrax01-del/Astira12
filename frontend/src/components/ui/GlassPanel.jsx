import { motion } from "framer-motion";

export default function GlassPanel({ children, className, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
