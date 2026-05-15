"use client";

import { useBot } from "./bot-context";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingOverlay() {
  const { isLoading } = useBot();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[40] bg-background/20 backdrop-blur-2xl flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
