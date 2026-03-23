"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Activity, Github, Zap, Globe, Shield, Sparkles, Search, ArrowUpRight } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100">
      {/* Immersive Background (Light Mode Apple Style) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50/30 rounded-full blur-[120px]" />
      </div>

      <header className="px-6 lg:px-14 h-24 flex items-center justify-between glass sticky top-0 z-50 border-b border-indigo-50/50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            <PulseLogo className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight tracking-tighter text-indigo-950 uppercase">PulseBoard</span>
        </motion.div>
        
        <nav className="flex items-center gap-8">
          <Link href="/explore" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors hidden md:block">
            Explore
          </Link>
          <div className="h-4 w-px bg-slate-100 hidden md:block" />
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="relative group px-6 py-2.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest overflow-hidden transition-all hover:pr-10 hover:scale-105 active:scale-95 shadow-xl shadow-slate-200">
                <span>Sign In</span>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-100">
              Go to Console
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <section className="relative w-full max-w-7xl px-6 pt-32 pb-40 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-xl shadow-indigo-50 border border-indigo-50 text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-indigo-600"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Verified Reputation Protocol
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[8.5rem] font-black tracking-tight tracking-tighter leading-[0.85] mb-10 text-slate-950 uppercase"
          >
            The Automated <br />
            <span className="text-indigo-600">Protocol</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold mb-16"
          >
            Connect once. Stay verified. Your shipping velocity turns into automated professional leverage for the global tech ecosystem.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto"
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('username') as HTMLInputElement;
                if (input.value) window.location.href = `/u/${input.value}`;
              }}
              className="group flex items-center w-full bg-white shadow-[0_40px_80px_-24px_rgba(79,70,229,0.15)] border border-indigo-50 rounded-[2.5rem] p-3 pl-8 overflow-hidden focus-within:ring-4 focus-within:ring-indigo-100 transition-all font-semibold"
            >
              <span className="text-slate-400 tracking-tight font-black hidden sm:inline flex-shrink-0 uppercase text-[10px]">pulseboard.dev/u/</span>
              <input 
                type="text" 
                name="username"
                placeholder="github_handle" 
                className="bg-transparent border-none outline-none flex-1 min-w-0 font-black placeholder:text-slate-300 text-slate-900 ml-2"
                required
              />
              <button type="submit" className="flex-shrink-0 flex items-center justify-center px-10 py-5 rounded-[1.8rem] bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all gap-3 whitespace-nowrap shadow-xl shadow-indigo-100">
                Launch <Search className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </section>

        <section className="w-full max-w-7xl px-6 pb-60">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <motion.div variants={itemVariants} className="md:col-span-8 bg-white p-12 rounded-[4rem] border border-indigo-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] min-h-[500px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-indigo-50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                <Github size={300} strokeWidth={1} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                        <Github className="w-7 h-7" />
                    </div>
                    <h3 className="text-5xl font-black tracking-tight uppercase leading-none text-slate-950">GitHub Pulse <br />Verification</h3>
                    <p className="text-slate-400 text-xl max-w-md font-semibold leading-relaxed">Your lifetime commits and shipping velocity synced instantly. Credibility you don't have to manually update.</p>
                </div>
                <div className="flex gap-4">
                    {['Automated', 'Verified', 'Public'].map(t => (
                        <span key={t} className="px-4 py-1.5 rounded-full bg-indigo-50 text-[10px] font-black uppercase tracking-widest text-indigo-600">{t}</span>
                    ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-4 bg-slate-950 p-12 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-800 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="space-y-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-4xl font-black tracking-tight uppercase leading-none">Zero Ops <br />Integrity</h3>
                        <p className="text-slate-400 font-semibold leading-relaxed">Connect once. We handle the heavy lifting. Your profile lives forever.</p>
                    </div>
                    <ArrowUpRight className="w-10 h-10 text-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-12 bg-white p-16 rounded-[4rem] border border-indigo-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center gap-16 relative overflow-hidden group">
                <div className="absolute -bottom-12 -right-12 text-indigo-50 opacity-50">
                    <Shield size={320} />
                </div>
                <div className="flex-1 space-y-8 relative z-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <Globe className="w-7 h-7" />
                    </div>
                    <h3 className="text-6xl font-black tracking-tight uppercase leading-none text-indigo-950">Global Network <br />Reputation</h3>
                    <p className="text-slate-400 text-xl font-semibold leading-relaxed max-w-2xl">PulseBoard transforms your GitHub data into a verifiable professional profile. Join the top builders in the global elite directory.</p>
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="px-10 py-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-5 text-emerald-600 transform group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6" />
                        <span className="font-black uppercase tracking-widest text-xs">Verified Elite</span>
                    </div>
                    <div className="px-10 py-6 bg-slate-900 border border-slate-700 rounded-3xl flex items-center gap-5 text-white transform group-hover:-rotate-2 transition-transform">
                        <Activity className="w-6 h-6 text-indigo-400" />
                        <span className="font-black uppercase tracking-widest text-xs">Live Protocol</span>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </section>

        <footer className="w-full max-w-7xl px-6 py-32 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
                <PulseLogo className="w-5 h-5" />
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-xs text-slate-800">PulseBoard Protocol</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Link href="https://pulseboard.dev/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="https://pulseboard.dev/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link href="https://x.com/pulseboard" className="hover:text-indigo-600 transition-colors">Twitter</Link>
          </div>
          <div className="text-[10px] font-black tracking-[0.8em] uppercase text-slate-200">
            THANKS FOR SHIPPING
          </div>
        </footer>
      </main>
    </div>
  );
}
