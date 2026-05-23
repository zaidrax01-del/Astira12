import Hero from '../components/sections/Hero';
import FeaturedPlanets from '../components/sections/FeaturedPlanets';
import Navbar from '../components/layout/Navbar';
import SpaceBackground from '../components/animations/SpaceBackground';

export default function Dashboard() {
  return (
    <div className="relative">
      <SpaceBackground />
      <Navbar />
      <Hero />
      <FeaturedPlanets />
      {/* Additional sections (DAO, marketplace preview) can be added here */}
    </div>
  );
}
