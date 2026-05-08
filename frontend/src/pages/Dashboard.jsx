import { useContext } from 'react'
import { motion } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import GlowButton from '../components/ui/GlowButton'
import GlassPanel from '../components/ui/GlassPanel'

export default function Dashboard() {
  const { account, balance, connectWallet } = useContext(Web3Context)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8">
      <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        A S T I R A
      </motion.h1>
      {!account ? (
        <GlowButton onClick={connectWallet}>Connect Wallet</GlowButton>
      ) : (
        <GlassPanel className="p-8 max-w-md w-full text-center">
          <p className="text-cyan-300 font-mono text-sm">{account}</p>
          <p className="text-3xl mt-4">{balance} AST</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <GlowButton onClick={() => window.location.href='/create'}>Create Planet</GlowButton>
            <GlowButton onClick={() => window.location.href='/compass'}>Cosmic Compass</GlowButton>
            <GlowButton onClick={() => window.location.href='/fusion'}>Fusion Lab</GlowButton>
            <GlowButton onClick={() => window.location.href='/governance'}>Governance</GlowButton>
            <GlowButton onClick={() => window.location.href='/crew'}>Fleet Command</GlowButton>
            <GlowButton onClick={() => window.location.href='/rewards'}>Rewards</GlowButton>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
