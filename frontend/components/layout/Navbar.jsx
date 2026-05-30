'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { useContext } from 'react'
import { Web3Context } from '../../context/Web3Context'

export default function Navbar() {
  const { connected, disconnect } = useWallet()
  const { balance } = useContext(Web3Context)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/compass' },
    { name: 'Create', path: '/create' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'DAO', path: '/governance' },
    { name: 'Whitepaper', path: '/whitepaper' },
    { name: 'Help', path: '/help' },
    { name: 'Team', path: '/team' },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="text-2xl font-bold text-gradient">
        ASTIRA
      </Link>

      <div className="hidden md:flex gap-6 text-sm font-medium">
        {links.map(link => (
          <Link
            key={link.name}
            href={link.path}
            className="text-gray-300 hover:text-purple-400 transition"
          >
            {link.name}
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
          <button
            onClick={disconnect}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 text-sm"
          >
            Disconnect
          </button>
        ) : (
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 !rounded-full !px-5 !py-2 !text-sm !font-semibold" />
        )}
      </div>
    </nav>
  )
}
