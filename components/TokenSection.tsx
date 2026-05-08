"use client";

import { motion } from "framer-motion";

export default function TokenSection() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          AST Token — Universal Fuel
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-gray-300 mt-4 max-w-2xl mx-auto"
        >
          Power your interplanetary journey with the AST token
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { title: "Governance", desc: "Shape the galaxy with DAO voting rights.", icon: "🗳️" },
            { title: "Staking", desc: "Earn cosmic yields & rare NFT drops.", icon: "⛏️" },
            { title: "Evolution", desc: "Boost your planet's ascension speed.", icon: "📈" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-cyan-300">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-6 glass-card inline-block mx-auto"
        >
          <div className="text-sm text-gray-400">Powered by</div>
          <div className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Solana Blockchain</div>
          <div className="text-xs text-gray-500 mt-1">Lightning fast • Near zero fees • Carbon neutral</div>
        </motion.div>
      </div>
    </section>
  );
}
