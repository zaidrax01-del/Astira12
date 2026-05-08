import { motion } from "framer-motion";

export default function LoadingSequence({ message = "Generating..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-8">
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-transparent border-t-cyan-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900 to-cyan-900 animate-pulse" />
      </div>
      <p className="text-xl text-purple-300 animate-pulse">{message}</p>
    </div>
  );
}
