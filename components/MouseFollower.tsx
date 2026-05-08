"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MouseFollower() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 w-96 h-96 rounded-full blur-3xl opacity-20"
      animate={{ x: mouse.x - 192, y: mouse.y - 192 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      style={{ background: "radial-gradient(circle, cyan, transparent 70%)" }}
    />
  );
}
