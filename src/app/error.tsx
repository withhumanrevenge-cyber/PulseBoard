"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("[CRITICAL_PULSE_FAILED]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      {/* Visual Glitch Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-destructive/20 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-destructive/5 -rotate-12 translate-x-12 -translate-y-12">
            <AlertTriangle size={200} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight leading-none">PULSE INTERRUPTED</h1>
                <p className="text-muted-foreground font-medium">We encountered a turbulence in the sync layer. This usually happens when the data stream is momentarily blocked.</p>
            </div>

            {error.digest && (
                <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-[10px] font-mono opacity-50">
                    REF-ID: {error.digest}
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
                <button
                    onClick={() => reset()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-foreground text-background rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-2 px-6 h-12 glass border border-border/50 rounded-full font-bold hover:scale-105 active:scale-95 transition-all text-sm"
                >
                    <Home className="w-4 h-4" />
                    Back Home
                </Link>
            </div>
        </div>
      </motion.div>
      
      <p className="mt-8 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
        If this persists, please contact pulse-support@pulseboard.dev
      </p>
    </div>
  );
}
