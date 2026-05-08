import { motion } from "framer-motion";
import PlanetCard from "./PlanetCard";

export default function GalaxyGrid({ planets, onPlanetClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {planets.map((planet, index) => (
        <motion.div
          key={planet.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.6 }}
          // Orbit-like floating animation
          whileHover={{ y: -12 }}
        >
          <div className="relative">
            {/* Subtle orbiting particle around card */}
            <motion.div
              className="absolute -top-4 -left-4 w-8 h-8 border border-purple-400/10 rounded-full"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            />
            <PlanetCard planet={planet} onClick={onPlanetClick} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
