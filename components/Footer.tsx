"use client";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 px-6 backdrop-blur-sm bg-black/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-display font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          ASTIRA
        </div>
        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition">Twitter</a>
          <a href="#" className="hover:text-cyan-400 transition">Discord</a>
          <a href="#" className="hover:text-cyan-400 transition">GitHub</a>
          <a href="#" className="hover:text-cyan-400 transition">Medium</a>
        </div>
        <div className="text-gray-500 text-sm">© 2025 ASTIRA — infinite cosmos</div>
      </div>
    </footer>
  );
}
