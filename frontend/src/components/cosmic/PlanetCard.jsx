import { motion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";

export default function PlanetCard({ planet, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      className="cursor-pointer group"
      onClick={() => onClick(planet.id)}
    >
      <GlassPanel className="overflow-hidden p-0">
        <div className="relative">
          <img
            src={planet.image_url}
            alt={planet.name}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl" />
          {/* Orbit ring effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-20 h-20 border border-purple-400/20 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {planet.name}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">{planet.planet_type}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {planet.rarity}
            </span>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
