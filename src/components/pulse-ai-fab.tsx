"use client";

import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePulseAI } from "./pulse-ai-context";

// Mobile-only launcher for PulseAI (the animated mascot is desktop-only).
export function PulseAIFab() {
  const { open, openChat } = usePulseAI();

  return (
    <AnimatePresence>
      {!open && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          onClick={() => openChat()}
          aria-label="Open PulseAI Talent Scout"
          className="md:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
