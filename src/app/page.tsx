"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Activity, Github, Zap, Globe, Shield, Sparkles, Search } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <PulseLogo className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">PulseBoard</span>
        </motion.div>
        
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block" aria-disabled={!isLoaded}>
            Explore
          </Link>
          <div className="h-4 w-px bg-border/50 hidden md:block" />
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="relative group px-5 py-2 rounded-full bg-foreground text-background text-sm font-bold overflow-hidden transition-all hover:pr-8 hover:scale-105 active:scale-95">
                <span>Sign In</span>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-bold hover:scale-105 active:scale-95 transition-all">
              Console
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <section className="relative w-full max-w-7xl px-6 pt-24 pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-primary/80"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Verified Builder Protocol
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7.5rem] font-black tracking-tight leading-[0.85] mb-8"
          >
            THE LIVE <br />
            <span className="text-gradient">PULSEBOARD</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium mb-12"
          >
            Automate your professional transparency. Connect your stack and launch a verified metrics protocol that updates as you ship. No manual work, just pure credibility.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto"
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('username') as HTMLInputElement;
                if (input.value) window.location.href = `/u/${input.value}`;
              }}
              className="flex items-center w-full glass border border-border/50 rounded-full p-2 pl-6 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all font-medium shadow-2xl shadow-primary/5"
            >
              <span className="text-muted-foreground/60 tracking-tight font-bold hidden sm:inline">pulseboard.dev/u/</span>
              <input 
                type="text" 
                name="username"
                placeholder="github_handle" 
                className="bg-transparent border-none outline-none flex-1 font-black placeholder:text-muted-foreground/30 text-foreground ml-2 sm:ml-0"
                required
              />
              <button type="submit" className="group flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background font-bold tracking-tight hover:scale-105 active:scale-95 transition-all gap-2">
                Launch <Search className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </motion.div>
        </section>

        <section className="w-full max-w-6xl px-6 pb-40">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants} className="md:col-span-2 glass-card p-10 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 group-hover:text-primary/10 transition-all duration-700">
                <Github size={240} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                  <Github className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">GitHub Real-time Pulse</h3>
                <p className="text-muted-foreground text-lg max-w-md font-medium">Your commit history, language distribution, and shipping velocity synced automatically. Turn your activity into authority.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-10 flex flex-col justify-between group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Zero-Ops Setup</h3>
                <p className="text-muted-foreground font-medium">Connect once, stay live forever. We handle the data syncing while you focus on building.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-10 flex flex-col justify-between md:col-span-3 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-4">Public Reputation Protocol</h3>
                  <p className="text-muted-foreground text-lg font-medium">Build trust by default. Your public pulse is a verifiable proof of work for investors and the global tech ecosystem.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="glass px-6 py-4 rounded-2xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold">Verified Reputation</span>
                  </div>
                  <div className="glass px-6 py-4 rounded-2xl flex items-center gap-3 border-emerald-500/20">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold">Live Protocol</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <footer className="w-full max-w-7xl px-6 py-20 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <PulseLogo className="w-5 h-5 opacity-50" />
            <span className="font-bold tracking-tight opacity-50 uppercase text-xs">PulseBoard Protocol</span>
          </div>
          <div className="text-xs font-bold tracking-[0.6em] uppercase opacity-20">
            THANKS FOR SHIPPING
          </div>
        </footer>
      </main>
    </div>
  );
}
