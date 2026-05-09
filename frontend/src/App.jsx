import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Web3ContextProvider } from './context/Web3Context'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CreatePlanet from './pages/CreatePlanet'
import CosmicCompass from './pages/CosmicCompass'
import Marketplace from './pages/Marketplace'
import Activity from './pages/Activity'
import Team from './pages/Team'
import Whitepaper from './pages/Whitepaper'
import HelpCenter from './pages/HelpCenter'
import SpaceBackground from './components/animations/SpaceBackground'

export default function App() {
  return (
    <Web3ContextProvider>
      <BrowserRouter>
        <SpaceBackground />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreatePlanet />} />
            <Route path="/compass" element={<CosmicCompass />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/team" element={<Team />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Web3ContextProvider>
  )
}
