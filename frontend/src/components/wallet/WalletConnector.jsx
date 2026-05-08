import { useContext } from "react";
import { Web3Context } from "../../context/Web3Context";
import GlowButton from "../ui/GlowButton";

export default function WalletConnector() {
  const { account, connectWallet, balance } = useContext(Web3Context);
  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
          <span className="text-purple-400 font-mono text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <span className="text-cyan-300">{balance} AST</span>
        </div>
      ) : (
        <GlowButton onClick={connectWallet}>Connect Wallet</GlowButton>
      )}
    </div>
  );
}
