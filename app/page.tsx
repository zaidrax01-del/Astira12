"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlanetGenerator from "@/components/PlanetGenerator";
import GalaxyMapPreview from "@/components/GalaxyMapPreview";
import OriginalPlanets from "@/components/OriginalPlanets";
import EvolutionSystem from "@/components/EvolutionSystem";
import Roadmap from "@/components/Roadmap";
import TokenSection from "@/components/TokenSection";
import Footer from "@/components/Footer";
import StarsBackground from "@/components/StarsBackground";
import MouseFollower from "@/components/MouseFollower";

export default function Home() {
  return (
    <main className="relative">
      <StarsBackground />
      <MouseFollower />
      <Navbar />
      <HeroSection />
      <PlanetGenerator />
      <GalaxyMapPreview />
      <OriginalPlanets />
      <EvolutionSystem />
      <Roadmap />
      <TokenSection />
      <Footer />
    </main>
  );
}
