'use client'
import { motion } from 'framer-motion'

const planets = [
  { name: 'Ignarion', price: '12.4 SOL', img: 'https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png' },
  { name: 'Verdyra', price: '8.9 SOL', img: 'https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png' },
  { name: 'Cryonix', price: '15.1 SOL', img: 'https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png' },
  { name: 'Heliora', price: '19.7 SOL', img: 'https://i.postimg.cc/T1NkWvTN/file-000000007cbc72469880782e40456670.png' },
]

export default function Featured() {
  return (
    <section className="px-6 lg:px-16 py-24">
      <h2 className="text-4xl font-bold text-center mb-16 text-gradient">Featured Planets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {planets.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden cursor-pointer group"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={p.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="text-purple-400 text-sm">{p.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
