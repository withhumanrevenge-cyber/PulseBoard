"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PulseAIContextType {
  open: boolean;
  seed: string | null;
  openChat: (seed?: string) => void;
  closeChat: () => void;
  consumeSeed: () => string | null;
}

const PulseAIContext = createContext<PulseAIContextType | undefined>(undefined);

export function PulseAIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);

  const openChat = useCallback((s?: string) => {
    if (s) setSeed(s);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);

  const consumeSeed = useCallback(() => {
    const s = seed;
    setSeed(null);
    return s;
  }, [seed]);

  return (
    <PulseAIContext.Provider value={{ open, seed, openChat, closeChat, consumeSeed }}>
      {children}
    </PulseAIContext.Provider>
  );
}

export function usePulseAI() {
  const ctx = useContext(PulseAIContext);
  if (!ctx) throw new Error("usePulseAI must be used within a PulseAIProvider");
  return ctx;
}
