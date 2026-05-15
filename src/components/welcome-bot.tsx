"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBot } from "./bot-context";

export function WelcomeBot({ inline = false }: { inline?: boolean }) {
  const { isLoading } = useBot();
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const [message, setMessage] = useState("Hello.");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { scrollY: motionScrollY } = useScroll();

  useMotionValueEvent(motionScrollY, "change", (latest) => {
    setScrollY(latest);
  });

  // Sync message visibility with loading state
  useEffect(() => {
    if (isLoading) {
      setIsMessageVisible(true);
      setMessage("Just you wait...");
      return;
    }

    if (isHome && scrollY < 160) {
      setIsMessageVisible(true);
      setMessage("Welcome to PulseBoard.");
      const timer = window.setTimeout(() => setIsMessageVisible(false), 3200);
      return () => window.clearTimeout(timer);
    }

    setIsMessageVisible(false);
  }, [isLoading, isHome, scrollY]);

  const getPos = () => {
    if (isLoading) {
      return { 
        left: "50%", 
        top: "50%", 
        translateX: "-50%", 
        translateY: "-50%", 
        scale: 1.2,
      };
    }
    // Fixed corner position
    return { 
      left: "auto",
      right: "32px", 
      top: "auto",
      bottom: "32px", 
      translateX: "0%", 
      translateY: "0%", 
      scale: 1 
    };
  };

  const opacity = useTransform(motionScrollY, [0, 120], [0, 1]);

  // If we're on home, use the motion opacity for the fixed bot
  const finalOpacity = isHome && !inline ? opacity : 1;

  return (
    <motion.div 
      initial={inline ? { opacity: 1, scale: 1 } : false}
      animate={inline ? {} : getPos()}
      style={{ 
        opacity: finalOpacity,
        position: inline ? "relative" : "fixed",
        zIndex: inline ? 10 : 40,
        pointerEvents: (inline || !isHome || scrollY > 120) ? "auto" : "none"
      }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 180, 
        mass: 1 
      }}
      className={`${inline ? "relative" : "fixed"} hidden md:flex flex-col items-center`}
    >
      <div className="relative flex flex-col items-center gap-4">
        
        <motion.div
          className="relative w-12 h-20 flex flex-col items-center z-50"
        >
          <motion.div 
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 bg-foreground rounded-xl shadow-lg border border-white/20 relative z-20 flex items-center justify-center overflow-hidden"
          >
             <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-background rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-background rounded-full animate-pulse" />
             </div>
             <motion.div 
                animate={{ top: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-background/20" 
             />
          </motion.div>

          <div className="w-2 h-2 bg-foreground/40 -mt-0.5" />

          <motion.div 
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-12 bg-foreground rounded-lg shadow-xl border border-white/10 relative overflow-hidden"
          >
             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-background/10 rounded-full" />
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background/5" />
          </motion.div>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8">
             <AnimatePresence>
                {[...Array(6)].map((_, i) => (
                  <Particle key={i} delay={i * 0.5} />
                ))}
             </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {isMessageVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="px-4 py-2 rounded-2xl bg-foreground text-background text-[11px] font-bold uppercase tracking-widest shadow-2xl relative whitespace-nowrap mt-4 text-center vercel-shadow"
            >
              {message}
              <div className="absolute w-3 h-3 bg-foreground rotate-45 -top-1 left-1/2 -translate-x-1/2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Particle({ delay }: { delay: number }) {
  const xOffset = ((delay * 1337) % 60) - 30;
  
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 0, scale: 1 }}
      animate={{ 
        y: [0, 60], 
        x: [0, xOffset],
        opacity: [0, 0.8, 0],
        scale: [1, 0.1]
      }}
      transition={{ 
        duration: 2.5, 
        repeat: Infinity, 
        delay,
        ease: "easeOut"
      }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground/30 rounded-full blur-[1px]"
    />
  );
}
