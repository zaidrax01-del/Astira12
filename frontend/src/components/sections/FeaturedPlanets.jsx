import { motion } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { Link } from 'react-router-dom';

const sample = [
  { id: 1, name: 'Ignarion', price: '12.4 SOL', image: 'https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png' },
  { id: 2, name: 'Verdyra', price: '8.9 SOL', image: 'https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png' },
  { id: 3, name: 'Cryonix', price: '15.1 SOL', image: 'https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png' },
  { id: 4, name: 'Heliora', price: '19.7 SOL', image: 'https://i.postimg.cc/T1NkWvTN/file-000000007cbc72469880782e40456670.png' },
];

export default function FeaturedPlanets() {
  return (
    <section className="px-8 py-20">
      <h2 className="text-4xl font-bold text-center mb-12">🔥 Featured Planets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sample.map((planet, i) => (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
          >
            <GlassPanel className="overflow-hidden p-0 group cursor-pointer">
              <div className="relative">
                <img src={planet.image} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{planet.name}</h3>
                <p className="text-purple-400 text-sm">{planet.price}</p>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
