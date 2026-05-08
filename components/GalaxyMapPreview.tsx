"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const planets = [
  { name: "Primordius", color: "from-red-500 to-orange-500", desc: "The first flame, eternal and burning." },
  { name: "Aetherion", color: "from-purple-500 to-pink-500", desc: "A realm of pure energy and light." },
  { name: "Cryos", color: "from-cyan-400 to-blue-600", desc: "Frozen wastes hiding ancient secrets." },
  { name: "Verdantia", color: "from-green-400 to-emerald-600", desc: "Lush jungles and intelligent life." },
];

export default function GalaxyMapPreview() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <section id="galaxy-map" className="py-28 px-6 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Galaxy Map Preview
        </h2>
        <p className="text-gray-300">Explore cosmic territories — click on planets</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {planets.map((p) => (
          <motion.div
            key={p.name}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => setSelected(p)}
            className={`glass-card p-6 text-center cursor-pointer transition-all hover:border-${p.color.split(' ')[1]}/50`}
          >
            <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${p.color} animate-float shadow-xl`} />
            <h3 className="text-xl font-bold mt-4">{p.name}</h3>
            <p className="text-gray-400 text-sm mt-2">Click to explore</p>
          </motion.div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-md mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-cyan-300">{selected.name}</h3>
            <p className="mt-4 text-gray-300">{selected.desc}</p>
            <button className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white" onClick={() => setSelected(null)}>
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
