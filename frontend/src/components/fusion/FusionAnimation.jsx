import { motion } from "framer-motion";

export default function FusionAnimation({ planet1, planet2 }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex items-center">
        {/* Planet 1 */}
        <motion.div
          className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.6)]"
          animate={{ x: [0, -80, 0], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src={planet1} className="w-full h-full object-cover" />
        </motion.div>

        {/* Energy beam between planets */}
        <motion.div
          className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-4"
          animate={{ scaleX: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Planet 2 */}
        <motion.div
          className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_60px_rgba(34,211,238,0.6)]"
          animate={{ x: [0, 80, 0], rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src={planet2} className="w-full h-full object-cover" />
        </motion.div>

        {/* Central burst */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
