"use client";

import { useComparisonRegistry } from "@/lib/use-comparison";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function IntelligenceTerminal() {
  const { selected } = useComparisonRegistry();

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
        >
          <div className="bg-foreground text-background px-6 py-4 rounded-xl shadow-2xl flex items-center justify-between gap-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {selected.map((u, i) => (
                  <motion.div 
                    key={u.username}
                    initial={{ scale: 0, x: -10 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative w-10 h-10 rounded-lg border-2 border-background overflow-hidden shadow-sm shrink-0"
                  >
                    <Image src={u.avatar_url} alt={u.username} fill sizes="40px" className="object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">Selection</p>
                <p className="text-xs font-medium">
                  {selected.length === 1 ? "1 profile · add more to compare" : `${selected.length} profiles selected`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/fleet"
                className="p-2 rounded-md hover:bg-background/10 transition-colors"
                 title="Team view"
              >
                 <LayoutGrid size={18} />
              </Link>

              {selected.length >= 1 ? (
                <Link 
                  href={`/compare?users=${selected.map(u => u.username).join(",")}`}
                  className="px-4 py-2 bg-background text-foreground rounded-md font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
                >
                  Compare {selected.length > 1 ? `(${selected.length})` : ""}
                </Link>
              ) : (
                <div className="px-4 py-2 bg-background/10 text-background/40 rounded-md font-semibold text-xs pointer-events-none">
                  Select profiles
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
