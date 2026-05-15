"use client";

import { useEffect } from "react";
import { useBot } from "./bot-context";

export function LoadingTrigger() {
  const { setIsLoading } = useBot();

  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);

  return null;
}
