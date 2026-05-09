import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import GlowButton from '../ui/GlowButton';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/compass' },
  { name: 'Fusion', path: '/fusion' },
  { name: 'Governance', path: '/governance' },
  { name: 'Help', path: '/help' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-2xl shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          ASTIRA
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-purple-300 ${
                location.pathname === link.path
                  ? 'text-purple-400 border-b-2 border-purple-400 pb-0.5'
                  : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Wallet / Action */}
        <div className="flex items-center gap-4">
          {!connected ? (
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 !rounded-full !px-5 !py-2 !font-semibold !text-sm !shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-cyan-300 text-sm bg-white/5 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                $$ AST
              </span>
              <WalletMultiButton className="!bg-white/10 !rounded-full !px-4 !py-2 !text-sm" />
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
