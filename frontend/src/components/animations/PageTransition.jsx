import { motion } from "framer-motion";

const variants = {
  initial: { scale: 0.9, opacity: 0, filter: "blur(8px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
  exit: { scale: 1.1, opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } },
};

export default function PageTransition({ children }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
