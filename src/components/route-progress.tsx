"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBot } from "./bot-context";

export function RouteProgress() {
  const { isLoading } = useBot();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="route-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none"
          aria-hidden
        >
          <motion.div
            className="h-full bg-foreground rounded-r-full shadow-[0_0_8px_var(--foreground)]"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "30%", "62%", "85%"] }}
            transition={{ duration: 8, times: [0, 0.15, 0.5, 1], ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
