import { motion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import GlowButton from "../ui/GlowButton";

export default function ProposalCard({ proposal, onVote }) {
  const timeLeft = Math.max(0, new Date(proposal.end_timestamp) - new Date());
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <GlassPanel className="flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white">{proposal.title}</h3>
        <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {proposal.governance_layer}
        </span>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2">{proposal.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {days > 0 ? `${days}d remaining` : "Ended"}
        </span>
        <GlowButton onClick={() => onVote(proposal.id)} className="text-sm px-4 py-1.5">
          Vote
        </GlowButton>
      </div>
    </GlassPanel>
  );
}
