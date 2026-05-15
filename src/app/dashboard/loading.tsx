"use client";

import { useEffect } from "react";
import { useBot } from "@/components/bot-context";

export default function DashboardLoading() {
  const { setIsLoading } = useBot();

  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, [setIsLoading]);
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-16 relative overflow-hidden">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-10 mt-8">
            <div className="max-w-2xl space-y-4">
                <div className="w-24 h-6 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2">
                    <div className="w-[400px] max-w-full h-12 bg-muted/60 rounded-lg animate-pulse" />
                </div>
            </div>
            <div className="w-full md:w-[200px] h-10 bg-muted/80 rounded-md animate-pulse" />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-8 rounded-xl bg-card border border-border h-48 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />
                        <div className="w-16 h-3 bg-muted/40 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-20 h-8 bg-muted rounded-md animate-pulse" />
                        <div className="w-24 h-3 bg-muted/20 rounded-full animate-pulse" />
                    </div>
                </div>
            ))}
        </section>
        <section className="p-8 rounded-xl bg-card border border-border space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="w-32 h-6 bg-muted rounded-md animate-pulse" />
                    <div className="w-48 h-3 bg-muted/40 rounded-full animate-pulse" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/20 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-muted" />
                            <div className="space-y-1">
                                <div className="w-24 h-4 bg-muted rounded" />
                                <div className="w-16 h-2 bg-muted/50 rounded" />
                            </div>
                        </div>
                        <div className="w-8 h-4 bg-muted rounded" />
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
}
