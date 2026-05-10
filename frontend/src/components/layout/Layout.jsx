import { useState } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import CustomWalletModal from '../wallet/CustomWalletModal'
import { useWeb3Context } from '../../context/Web3Context'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { showCustomModal, closeWalletModal } = useWeb3Context()

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-20 px-4 md:px-8 pb-16">{children}</main>

      <CustomWalletModal
        open={showCustomModal}
        onClose={closeWalletModal}
      />
    </div>
  )
}
