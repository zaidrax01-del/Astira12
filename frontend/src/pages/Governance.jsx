import Navbar from '../components/layout/Navbar';
import SpaceBackground from '../components/animations/SpaceBackground';

export default function Governance() {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <main className="pt-24 px-8">
        <h1 className="text-4xl font-bold text-gradient">DAO Governance</h1>
        <p className="text-gray-300 mt-4">Vote on proposals, shape the ecosystem. Coming soon.</p>
        <div className="mt-12 glass p-8 rounded-2xl max-w-2xl">
          <h2 className="text-2xl font-semibold">Active Proposals</h2>
          <p className="text-gray-400 mt-2">No proposals yet. Connect wallet to participate.</p>
        </div>
      </main>
    </div>
  );
}
