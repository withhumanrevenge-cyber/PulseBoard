"use client";

import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-14 space-y-20 relative overflow-hidden">
        {/* Skeleton Header */}
        <header className="h-20 glass sticky top-0 z-50 flex items-center justify-between px-6 lg:px-14">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                <div className="w-32 h-6 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="w-24 h-10 rounded-full bg-muted animate-pulse" />
            </div>
        </header>

        {/* Hero Skeleton */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl space-y-6">
                <div className="w-32 h-6 bg-emerald-500/10 rounded-full animate-pulse shadow-inner shadow-emerald-500/50" />
                <div className="space-y-4">
                    <div className="w-[600px] max-w-full h-16 md:h-24 bg-muted/60 rounded-3xl animate-pulse" />
                    <div className="w-[400px] max-w-full h-16 md:h-24 bg-muted/60 rounded-3xl animate-pulse delay-100" />
                </div>
            </div>
            <div className="w-full md:w-[350px] h-14 bg-muted/80 rounded-full animate-pulse" />
        </section>

        {/* Metrics Grid Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-8 h-48 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                        <div className="w-16 h-4 bg-muted/60 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-24 h-10 bg-muted rounded-xl animate-pulse font-black" />
                        <div className="w-32 h-4 bg-muted/40 rounded-full animate-pulse font-medium text-xs" />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-muted/5 rounded-full animate-ping-slow scale-150" style={{ animationDelay: `${i * 0.2}s` }} />
                </div>
            ))}
        </section>

        {/* Recent Repos Skeleton */}
        <section className="glass-card p-12 space-y-10">
            <div className="flex items-center justify-between border-b border-border/50 pb-8">
                <div className="space-y-2">
                    <div className="w-48 h-8 bg-muted rounded-xl animate-pulse" />
                    <div className="w-64 h-4 bg-muted/40 rounded-full animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-muted animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-3xl glass-card flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-muted" />
                            <div className="space-y-2">
                                <div className="w-32 h-5 bg-muted rounded-lg" />
                                <div className="w-20 h-3 bg-muted/50 rounded-full" />
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-muted rounded-lg" />
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
}
