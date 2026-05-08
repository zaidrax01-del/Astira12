"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PlanetGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [planet, setPlanet] = useState<any>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setPlanet({
        name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
        rarity: ["Mythic", "Legendary", "Epic", "Rare", "Common"][Math.floor(Math.random() * 5)],
        climate: ["Frozen", "Volcanic", "Oceanic", "Desert", "Lush", "Gas Giant", "Crystal"][Math.floor(Math.random() * 7)],
        energy: Math.floor(Math.random() * 100) + 1,
        orbit: ["Circular", "Eccentric", "Binary", "Tidally Locked"][Math.floor(Math.random() * 4)],
      });
      setGenerating(false);
    }, 2000);
  };

  return (
    <section id="mint" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Planet Generator
          </h2>
          <p className="text-gray-300 mt-4">Describe your vision — we'll forge a unique world</p>
        </motion.div>

        <div className="glass-card p-8 md:p-12">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your planet... (e.g., A frozen blue gas giant with glowing rings)"
            className="w-full bg-black/50 border border-cyan-500/30 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 resize-none h-32"
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={generate}
              disabled={generating}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg disabled:opacity-60 transition-all hover:scale-105"
            >
              {generating ? "Forging Planet..." : "Generate Planet"}
            </button>
          </div>

          {planet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-black/30 border border-cyan-500/30"
            >
              <h3 className="text-2xl font-bold text-cyan-300">{planet.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div><span className="text-gray-400">Rarity:</span> <span className="text-white font-bold">{planet.rarity}</span></div>
                <div><span className="text-gray-400">Climate:</span> <span className="text-white">{planet.climate}</span></div>
                <div><span className="text-gray-400">Energy:</span> <span className="text-white">{planet.energy}</span></div>
                <div><span className="text-gray-400">Orbit:</span> <span className="text-white">{planet.orbit}</span></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
