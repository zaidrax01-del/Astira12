import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#02001A] text-white">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-20 px-4 md:px-8 pb-16">{children}</main>
    </div>
  );
}
