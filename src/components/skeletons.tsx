"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PulseLogo } from "@/components/pulse-logo";

export function Skel({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-7 bg-background">
      <PulseLogo className="w-10 h-10" />
      <div className="relative w-40 h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/2 rounded-full bg-foreground/80"
          animate={{ x: ["-120%", "240%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">{label}</p>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-24">
        {/* Hero */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl space-y-5">
            <Skel className="w-28 h-6 rounded-full" />
            <Skel className="w-72 max-w-full h-14" />
            <Skel className="w-96 max-w-full h-5" />
          </div>
          <div className="flex items-center gap-4">
            <Skel className="w-32 h-11 rounded-md" />
            <Skel className="w-40 h-11 rounded-md" />
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-xl bg-card border border-border h-48 flex flex-col justify-between elev-1">
              <div className="flex items-center justify-between">
                <Skel className="w-24 h-3" />
                <Skel className="w-9 h-9 rounded-md" />
              </div>
              <Skel className="w-20 h-9" />
            </div>
          ))}
        </div>

        {/* Language mix */}
        <div className="p-8 rounded-xl bg-card border border-border elev-1 flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-4">
            <Skel className="w-24 h-4" />
            <Skel className="w-40 h-8" />
            <Skel className="w-64 max-w-full h-4" />
          </div>
          <div className="flex-[2] space-y-8">
            <Skel className="w-full h-3 rounded-full" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skel className="w-16 h-3" />
                  <Skel className="w-12 h-6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent repos */}
        <section className="space-y-12">
          <div className="space-y-2 border-b border-border pb-6">
            <Skel className="w-28 h-3" />
            <Skel className="w-64 max-w-full h-9" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border h-72 flex flex-col justify-between elev-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skel className="w-32 h-5" />
                    <Skel className="w-12 h-6 rounded-md" />
                  </div>
                  <Skel className="w-24 h-3" />
                </div>
                <div className="space-y-4 pt-4 border-t border-border">
                  <Skel className="w-full h-3" />
                  <Skel className="w-28 h-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function ProfileGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-8 h-[24rem] rounded-xl bg-card border border-border flex flex-col items-center justify-between elev-1">
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <Skel className="w-32 h-32 rounded-xl" />
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                <Skel className="w-16 h-5 rounded-md" />
                <Skel className="w-12 h-5 rounded-md" />
              </div>
              <Skel className="w-36 h-7" />
            </div>
          </div>
          <div className="w-full pt-6 border-t border-border flex justify-center">
            <Skel className="w-28 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PublicProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-24 space-y-24">
        <section className="flex flex-col items-center text-center space-y-10">
          <Skel className="w-32 h-32 md:w-40 md:h-40 rounded-3xl" />
          <div className="flex flex-col items-center gap-4">
            <Skel className="w-64 max-w-full h-12" />
            <Skel className="w-40 h-6 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skel className="w-28 h-10 rounded-lg" />
            <Skel className="w-32 h-10 rounded-lg" />
            <Skel className="w-24 h-10 rounded-lg" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-8 border border-border/50 bg-card rounded-2xl h-64 flex flex-col justify-between elev-1">
              <Skel className="w-24 h-3" />
              <div className="space-y-2">
                <Skel className="w-20 h-12" />
                <Skel className="w-16 h-3" />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-12">
          <div className="border-b border-border/50 pb-8 space-y-2">
            <Skel className="w-24 h-3" />
            <Skel className="w-64 max-w-full h-9" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-8 h-64 border border-border/50 bg-card rounded-2xl flex flex-col justify-between elev-1">
                <div className="flex items-center justify-between">
                  <Skel className="w-10 h-10 rounded-xl" />
                  <Skel className="w-12 h-6 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skel className="w-32 h-5" />
                  <Skel className="w-full h-3" />
                  <Skel className="w-3/4 h-3" />
                </div>
                <div className="flex gap-3">
                  <Skel className="flex-1 h-9 rounded-lg" />
                  <Skel className="flex-1 h-9 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function CompareSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className={cn("grid grid-cols-1 gap-12 pt-12", count > 1 && "lg:grid-cols-2 xl:grid-cols-3")}>
      {Array.from({ length: Math.max(1, count) }).map((_, i) => (
        <div key={i} className="space-y-12">
          <div className="p-8 rounded-xl bg-card border border-border elev-1 space-y-8 min-h-[400px]">
            <Skel className="w-32 h-32 rounded-xl" />
            <Skel className="w-48 h-9" />
            <div className="flex gap-2">
              <Skel className="w-20 h-6 rounded-md" />
              <Skel className="w-24 h-6 rounded-md" />
            </div>
            <Skel className="w-full h-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="p-6 rounded-xl bg-card border border-border h-40 flex flex-col justify-between elev-1">
                <Skel className="w-9 h-9 rounded-md" />
                <div className="space-y-2">
                  <Skel className="w-20 h-3" />
                  <Skel className="w-16 h-7" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
