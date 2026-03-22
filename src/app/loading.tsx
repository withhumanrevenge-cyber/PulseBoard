"use client";

import { PulseLogo } from "@/components/pulse-logo";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[180px] rounded-full animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Multi-layered pulse rings */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping-slow" />
            <div className="absolute inset-4 border-2 border-primary/10 rounded-full animate-ping-slow" style={{ animationDelay: '1s' }} />
            <PulseLogo className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]" />
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Synchronizing Pulse</span>
            <div className="w-48 h-[2px] bg-primary/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-primary origin-left w-full"
                />
            </div>
        </div>
      </motion.div>
    </div>
  );
}
