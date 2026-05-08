"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = ["Home", "Universe", "Galaxy Map", "Mint", "Roadmap", "Whitepaper"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (link: string) => {
    const id = link.toLowerCase().replace(" ", "-");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-2xl bg-black/40 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-3xl font-display font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          ASTIRA
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="hover:text-cyan-400 transition-colors duration-300"
            >
              {link}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/50 text-cyan-300 font-medium backdrop-blur-md shadow-lg shadow-cyan-500/20"
        >
          Connect Wallet
        </motion.button>
      </div>
    </motion.nav>
  );
}
