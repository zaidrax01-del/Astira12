import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import GlowButton from "../ui/GlowButton";
import { useState } from "react";

export default function VoteModal({ proposal, votePower, onClose, onSubmit }) {
  const [support, setSupport] = useState(true);
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <GlassPanel className="max-w-md w-full p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">{proposal.title}</h3>
            <p className="text-sm text-gray-400">Your voting power: <span className="text-purple-400 font-bold">{votePower.toFixed(2)}</span></p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setSupport(true)}
                className={`px-6 py-2 rounded-full ${support ? "bg-green-500/20 text-green-300 border border-green-500" : "bg-white/5 text-gray-400"}`}
              >
                👍 For
              </button>
              <button
                onClick={() => setSupport(false)}
                className={`px-6 py-2 rounded-full ${!support ? "bg-red-500/20 text-red-300 border border-red-500" : "bg-white/5 text-gray-400"}`}
              >
                👎 Against
              </button>
            </div>
            <GlowButton onClick={() => onSubmit(proposal.id, support)}>Cast Vote</GlowButton>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
