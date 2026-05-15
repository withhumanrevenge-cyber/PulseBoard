"use client";

import { useEffect } from "react";
import { useBot } from "@/components/bot-context";

export default function GlobalLoading() {
  const { setIsLoading } = useBot();

  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" />
  );
}
