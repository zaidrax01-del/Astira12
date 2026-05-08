import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Web3ContextProvider } from './context/Web3Context'
import Dashboard from './pages/Dashboard'
import CosmicCompass from './pages/CosmicCompass'
import PlanetCreator from './pages/PlanetCreator'
import FusionLab from './pages/FusionLab'
import Governance from './pages/Governance'
import Rewards from './pages/Rewards'
import HelpCenter from './pages/HelpCenter'
import Crew from './pages/Crew'
import PageTransition from './components/animations/PageTransition'
import ParticleBackground from './components/animations/ParticleBackground'

export default function App() {
  return (
    <Web3ContextProvider>
      <BrowserRouter>
        <ParticleBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/compass" element={<PageTransition><CosmicCompass /></PageTransition>} />
            <Route path="/create" element={<PageTransition><PlanetCreator /></PageTransition>} />
            <Route path="/fusion" element={<PageTransition><FusionLab /></PageTransition>} />
            <Route path="/governance" element={<PageTransition><Governance /></PageTransition>} />
            <Route path="/rewards" element={<PageTransition><Rewards /></PageTransition>} />
            <Route path="/help" element={<PageTransition><HelpCenter /></PageTransition>} />
            <Route path="/crew" element={<PageTransition><Crew /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </Web3ContextProvider>
  )
}
