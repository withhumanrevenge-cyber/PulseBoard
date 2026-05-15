"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BotContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export function BotProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BotContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </BotContext.Provider>
  );
}

export function useBot() {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error("useBot must be used within a BotProvider");
  }
  return context;
}
