"use client";

import { motion } from "framer-motion";

const stages = [
  { name: "Genesis", desc: "Molten core stabilizes, first atmosphere forms. The planet awakens.", icon: "🌋" },
  { name: "Civilization", desc: "Intelligent life emerges, builds monuments across the surface.", icon: "🏛️" },
  { name: "Expansion", desc: "Interstellar trade, planetary networks rise to prominence.", icon: "🚀" },
  { name: "Ascension", desc: "Godhood — the planet transcends physical reality.", icon: "✨" },
];

export default function EvolutionSystem() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"
        >
          Planetary Evolution
        </motion.h2>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500 hidden md:block" />
          {stages.map((stage, idx) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`relative flex flex-col md:flex-row gap-6 mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="md:w-1/2 glass-card p-6">
                <div className="text-4xl mb-3">{stage.icon}</div>
                <h3 className="text-2xl font-bold text-cyan-300">{stage.name}</h3>
                <p className="text-gray-300 mt-2">{stage.desc}</p>
              </div>
              <div className="md:w-1/2 hidden md:block" />
              <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_20px_cyan] hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
