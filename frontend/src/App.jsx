import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Web3ContextProvider } from './context/Web3Context';
import Dashboard from './pages/Dashboard';
import CreatePlanet from './pages/CreatePlanet';
import CosmicCompass from './pages/CosmicCompass';
import Marketplace from './pages/Marketplace';
import Governance from './pages/Governance';
import Team from './pages/Team';
import Whitepaper from './pages/Whitepaper';
import HelpCenter from './pages/HelpCenter';

export default function App() {
  return (
    <Web3ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreatePlanet />} />
          <Route path="/compass" element={<CosmicCompass />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/team" element={<Team />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
      </BrowserRouter>
    </Web3ContextProvider>
  );
}
