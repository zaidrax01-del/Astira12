import { Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3Context } from '../../context/Web3Context'
import GlowButton from '../ui/GlowButton'

const LOGO_URL = 'https://i.ibb.co/bMz81nMn/IMG-20260421-122500-468.jpg'

export default function Topbar({ onMenuClick, sidebarOpen }) {
  const { connected, disconnect } = useWallet()
  const { balance, openWalletModal } = useWeb3Context()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-2xl hover:text-purple-400">
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          ASTIRA
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {connected ? (
          <>
            <div className="bg-white/5 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
              <span className="text-cyan-300 font-semibold text-xs">{balance.toFixed(3)} SOL</span>
            </div>
            <GlowButton
              onClick={disconnect}
              className="!bg-red-600 !from-red-500 !to-pink-500 !px-3 !py-1.5 !text-xs !rounded-full"
            >
              Disconnect
            </GlowButton>
          </>
        ) : (
          <GlowButton
            onClick={openWalletModal}   // <-- opens custom modal
            className="!px-4 !py-2 !text-xs !rounded-full"
          >
            Connect Wallet
          </GlowButton>
        )}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          <img src={LOGO_URL} alt="Astira Logo" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  )
}
