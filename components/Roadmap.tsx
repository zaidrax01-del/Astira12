"use client";

import { motion } from "framer-motion";

const phases = [
  { phase: "Phase 1", title: "Creation & Minting", desc: "Launch of 10,000 Genesis planets. AI generator v1 goes live.", status: "active", date: "Q1 2025" },
  { phase: "Phase 2", title: "Galaxy Expansion", desc: "Star clusters, interstellar trading between planets.", status: "upcoming", date: "Q2 2025" },
  { phase: "Phase 3", title: "Dynamic Evolution", desc: "Planets evolve based on community choices and staking.", status: "upcoming", date: "Q3 2025" },
  { phase: "Phase 4", title: "DAO & Astira Chain", desc: "Governance token launch + dedicated L2 rollup.", status: "upcoming", date: "Q4 2025" },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-28 px-6 bg-gradient-to-b from-black to-cosmic-deep">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-center mb-16 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent"
        >
          Cosmic Roadmap
        </motion.h2>
        <div className="space-y-8">
          {phases.map((p, i) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card p-6 flex flex-col md:flex-row gap-6 items-start border-l-8 ${p.status === 'active' ? 'border-l-cyan-500' : 'border-l-white/20'}`}
            >
              <div className="min-w-32">
                <span className="text-cyan-400 font-bold text-xl">{p.phase}</span>
                <div className="text-sm text-gray-500 mt-1">{p.date}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-gray-300 mt-1">{p.desc}</p>
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${p.status === 'active' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-gray-400'}`}>
                  {p.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
