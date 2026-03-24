"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfdfd] text-foreground selection:bg-primary/20">
      <div className="flex flex-col items-center">
        <div className="relative mb-32">
          <div className="absolute inset-0 bg-black/5 blur-[120px] rounded-full" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            className="relative w-64 h-64 flex items-center justify-center"
          >
            <div className="absolute inset-0 border-[2px] border-black/5 rounded-full" />
            <motion.div 
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-[-20px] border border-black/5 rounded-full" 
            />
            <motion.div 
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-8 border border-black/[0.08] rounded-full" 
            />
            
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.98, 1, 0.98] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Activity className="w-20 h-20 text-black stroke-[1.5px]" />
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center space-y-12 w-full text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] font-black uppercase tracking-[1.4rem] text-black w-full"
            style={{ marginRight: '-1.4rem' }} 
          >
            Synchronizing Pulse
          </motion.p>
          
          <div className="w-48 h-[1px] bg-black/[0.08] relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
               className="absolute inset-y-0 w-1/2 bg-black/60"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
