import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import GlassPanel from "../ui/GlassPanel";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const resp = await api.post("/help/chat", {
        question: input,
        history: messages,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: resp.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <GlassPanel className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === "user"
                  ? "ml-auto bg-purple-500/20 text-white"
                  : "mr-auto bg-white/10 text-gray-200"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-auto p-3 bg-white/10 rounded-xl flex gap-1"
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Astira AI..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={send}
          className="p-2 rounded-full bg-purple-500/30 text-purple-300 hover:bg-purple-500/50"
        >
          ➤
        </button>
      </div>
    </GlassPanel>
  );
}
