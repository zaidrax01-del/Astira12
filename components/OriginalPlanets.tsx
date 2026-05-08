"use client";

import { motion } from "framer-motion";

const planets = [
  { name: "Primordius", rarity: "Mythic", climate: "Molten Core", color: "from-red-600 to-orange-500" },
  { name: "Aetherion", rarity: "Legendary", climate: "Energy Storm", color: "from-purple-600 to-pink-500" },
  { name: "Cryos", rarity: "Epic", climate: "Eternal Frost", color: "from-cyan-500 to-blue-600" },
  { name: "Pyralis", rarity: "Legendary", climate: "Inferno", color: "from-orange-500 to-yellow-500" },
  { name: "Verdantia", rarity: "Epic", climate: "Overgrown", color: "from-green-500 to-emerald-600" },
  { name: "Oceana", rarity: "Rare", climate: "Waterworld", color: "from-blue-400 to-indigo-600" },
  { name: "Xerios", rarity: "Common", climate: "Desert", color: "from-amber-500 to-yellow-600" },
  { name: "Nebulon", rarity: "Mythic", climate: "Gas Giant", color: "from-indigo-500 to-purple-600" },
];

export default function OriginalPlanets() {
  return (
    <section className="py-28 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent"
        >
          Original Ancestor Planets
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
          {planets.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-5 rounded-2xl group cursor-pointer"
            >
              <div className={`h-40 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                <span className="text-5xl animate-pulse">🪐</span>
              </div>
              <h3 className="text-xl font-bold mt-4 group-hover:text-cyan-300 transition">{p.name}</h3>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-yellow-400">{p.rarity}</span>
                <span className="text-gray-400">{p.climate}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
