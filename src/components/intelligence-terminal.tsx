"use client";

import { useComparisonRegistry } from "@/lib/use-comparison";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, LayoutGrid } from "lucide-react";
import Link from "next/link";

export function IntelligenceTerminal() {
  const { selected } = useComparisonRegistry();

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-2xl px-6"
        >
          <div className="bg-white/80 backdrop-blur-3xl px-12 py-8 rounded-[3.5rem] border border-black/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-12 group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
            
            <div className="flex items-center gap-10 relative z-10 flex-1">
              <div className="flex -space-x-4">
                {selected.map((u, i) => (
                  <motion.div 
                    key={u.username}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-16 h-16 rounded-[1.5rem] border-4 border-white overflow-hidden shadow-2xl ring-2 ring-primary/20 shrink-0"
                  >
                    <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
                {selected.length < 2 && (
                  <div className="w-16 h-16 rounded-[1.5rem] border-4 border-dashed border-black/5 flex items-center justify-center text-black/20 text-xl font-black bg-black/[0.02] shrink-0">
                    +
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Intelligence Terminal</p>
                <p className="text-[12px] font-bold text-foreground uppercase tracking-tight">
                  {selected.length === 1 ? "Select 1 more to Duel" : `${selected.length} Nodes Ready for Ignition`}
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 flex items-center gap-4">
              <Link 
                href="/fleet"
                className="w-14 h-14 rounded-full bg-black/[0.03] border border-black/5 flex items-center justify-center hover:bg-black/5 transition-all text-black/40 hover:text-primary group"
                title="Command Hub"
              >
                 <LayoutGrid size={20} className="group-hover:scale-110 transition-transform" />
              </Link>

              {selected.length >= 2 ? (
                <Link 
                  href={`/compare?u1=${selected[0].username}&u2=${selected[1].username}`}
                  className="px-14 py-5 bg-primary text-primary-foreground rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 block text-center min-w-[220px]"
                >
                  Ignite Duel
                </Link>
              ) : (
                <div className="px-14 py-5 bg-black/[0.03] border border-black/5 text-black/20 rounded-full font-black text-[10px] uppercase tracking-[0.4em] pointer-events-none whitespace-nowrap min-w-[220px] text-center">
                  Await Nodes
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
