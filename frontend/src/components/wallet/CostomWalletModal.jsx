import { motion, AnimatePresence } from 'framer-motion';
import GlowButton from '../ui/GlowButton';
import { useWeb3Context } from '../../context/Web3Context';

const wallets = [
  {
    name: 'Phantom',
    icon: '👻',
    deepLink: (dappUrl) => `https://phantom.app/ul/browse?url=${encodeURIComponent(dappUrl)}`,
  },
  {
    name: 'Solflare',
    icon: '☀️',
    deepLink: (dappUrl) => `https://solflare.com/ul/browse?url=${encodeURIComponent(dappUrl)}`,
  },
  {
    name: 'Trust Wallet',
    icon: '🔷',
    deepLink: (dappUrl) => `https://link.trustwallet.com/open_url?url=${encodeURIComponent(dappUrl)}`,
  },
];

export default function CustomWalletModal({ open, onClose }) {
  const { connectWallet } = useWeb3Context();

  const handleWalletSelect = (deepLinkFn) => {
    const dappUrl = window.location.href;
    window.location.href = deepLinkFn(dappUrl);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full mx-4 border border-white/10 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-2xl font-bold text-center text-white">Connect Wallet</h3>
          <p className="text-sm text-gray-400 text-center">Choose your preferred wallet</p>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletSelect(wallet.deepLink)}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-purple-500/20 rounded-xl border border-white/10 transition-all text-white"
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span className="font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            You will be redirected to the wallet app for authentication
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
