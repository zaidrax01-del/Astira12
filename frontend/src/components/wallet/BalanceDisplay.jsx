import { useContext } from "react";
import { Web3Context } from "../../context/Web3Context";

export default function BalanceDisplay() {
  const { balance } = useContext(Web3Context);
  return (
    <div className="flex items-center gap-2 text-lg">
      <span className="text-gray-400">Balance:</span>
      <span className="text-cyan-300 font-bold">{balance} AST</span>
    </div>
  );
}
