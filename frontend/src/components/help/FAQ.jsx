import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  { q: "What is Astira?", a: "Astira is an AI-powered planet creation ecosystem..." },
  // ... add all 15 FAQs
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex justify-between items-center p-4 text-white">
            <span>{item.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              className="text-xl text-purple-400"
            >
              +
            </motion.span>
          </div>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-gray-300 text-sm"
              >
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
