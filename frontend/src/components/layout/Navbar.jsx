import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useContext } from 'react';
import { Web3Context } from '../../context/Web3Context';
import GlowButton from '../ui/GlowButton';

const menu = [
  { name: 'Explore', path: '/compass' },
  { name: 'Create', path: '/create' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'DAO', path: '/governance' },
  { name: 'About', path: '/team' },
];

export default function Navbar() {
  const { connected, disconnect } = useWallet();
  const { balance } = useContext(Web3Context);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-extrabold text-gradient">ASTIRA</Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        {menu.map(m => (
          <Link key={m.name} to={m.path} className="text-gray-300 hover:text-purple-400 transition">
            {m.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {connected && (
          <span className="text-cyan-300 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {balance.toFixed(2)} SOL
          </span>
        )}
        {connected ? (
          <GlowButton onClick={disconnect} className="!bg-red-500/20 !text-red-300 !px-4 !py-2 !text-xs">
            Disconnect
          </GlowButton>
        ) : (
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 !rounded-full !px-6 !py-2 !text-sm !font-semibold !glow" />
        )}
      </div>
    </nav>
  );
}
