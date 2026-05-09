import { Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useContext } from 'react'
import { Web3Context } from '../../context/Web3Context'

export default function Topbar({ onMenuClick, sidebarOpen }) {
  const { connected } = useWallet()
  const { balance } = useContext(Web3Context)

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
      <div className="flex items-center gap-4">
        {connected && (
          <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
            <span className="text-cyan-300 font-semibold text-sm">{balance.toFixed(3)} SOL</span>
          </div>
        )}
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 !rounded-full !px-5 !py-2 !font-semibold !text-sm !shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-lg">🌙</div>
      </div>
    </header>
  )
}
