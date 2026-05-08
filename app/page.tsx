// app/page.tsx — CORRECT VERSION
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
import StarsBackground from "@/components/StarsBackground";    // ← Correct name
import MouseFollower from "@/components/MouseFollower";       // ← Correct name

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
