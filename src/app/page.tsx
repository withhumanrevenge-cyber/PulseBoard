"use client";

import { useEffect, useRef } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Github, Zap, Globe, Shield, Sparkles, Search, ArrowUpRight, Code, Star, GitCommit, Link as LinkIcon, RefreshCw } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import { motion, Variants } from "framer-motion";
import { NeutralLivelyBg } from "@/components/neutral-bg";
import gsap from "gsap";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      gsap.from(".hero-content > *", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
      });
    }
  }, [isLoaded]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-slate-200 font-sans overflow-x-hidden relative">
      <NeutralLivelyBg />
      
      {/* Premium Clean Header */}
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between backdrop-blur-xl bg-white/60 sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xl font-bold tracking-tight text-slate-900">PulseBoard</span>
        </div>
        
        <nav className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Explore</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Docs</Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden md:block" />
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                Sign in with GitHub
              </button>
            </SignInButton>
          ) : (
            <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl hover:bg-black transition-all">
              Dashboard
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Identity & Launch Section (Matching Reference) */}
        <section className="hero-content relative w-full max-w-5xl px-6 pt-32 pb-40 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold mb-10 border border-emerald-100/50">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Live metrics · No manual work
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-slate-950 max-w-3xl">
            Your GitHub activity, <br className="hidden md:block"/> beautifully public.
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            Enter any GitHub username and get an instant, shareable dashboard. Contributions, repos, languages, streak — all live.
          </p>

          <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('username') as HTMLInputElement;
                if (input.value) window.location.href = `/u/${input.value}`;
              }}
              className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-4 focus-within:ring-slate-100 transition-all"
            >
              <div className="px-6 py-3 py-4 text-slate-400 font-medium hidden sm:block">github.com /</div>
              <input 
                type="text" 
                name="username"
                placeholder="username" 
                className="bg-transparent border-none outline-none flex-1 font-bold text-slate-900 px-4"
                required
              />
              <button type="submit" className="px-8 py-4 rounded-[0.85rem] bg-slate-900 text-white font-bold text-sm tracking-tight hover:bg-black transition-all shadow-xl active:scale-95 duration-300">
                View pulse
              </button>
            </form>
            <p className="text-sm text-slate-400 font-medium">
               or see a <Link href="/u/levelsio" className="text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-all">live example &rarr;</Link>
            </p>
          </div>
        </section>

        {/* Global Metrics Bar (Matching Reference) */}
        <section className="w-full max-w-7xl px-6 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
                {[
                    { label: 'Dashboards', value: '12k+' },
                    { label: 'Commits tracked', value: '4.2M' },
                    { label: 'Repos indexed', value: '98k' },
                    { label: 'Uptime', value: '99.9%' }
                ].map(stat => (
                    <div key={stat.label} className="text-center space-y-1">
                        <div className="text-3xl font-black text-slate-950">{stat.value}</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>

        {/* Feature Grid (Matching Reference) */}
        <section className="w-full max-w-7xl px-6 pb-60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-slate-100">
                {[
                    { 
                        title: 'Live syncing', 
                        desc: 'Dashboard updates automatically as you push. No manual refresh, no delays.', 
                        icon: RefreshCw,
                        iconBg: 'bg-blue-50 text-blue-500'
                    },
                    { 
                        title: 'Shareable URL', 
                        desc: 'Every profile gets a public URL. Drop it in your LinkedIn bio or README.', 
                        icon: LinkIcon,
                        iconBg: 'bg-indigo-50 text-indigo-500'
                    },
                    { 
                        title: 'Zero setup', 
                        desc: 'No OAuth required for public profiles. Just type a username and go.', 
                        icon: Zap,
                        iconBg: 'bg-orange-50 text-orange-500'
                    }
                ].map((f, i) => (
                    <div key={f.title} className={`p-12 space-y-6 ${i !== 2 ? 'md:border-r border-slate-100' : ''} hover:bg-slate-50/50 transition-colors group`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                            <f.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-slate-950">{f.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <footer className="w-full max-w-7xl px-6 py-24 border-t border-slate-100 text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
                <PulseLogo className="w-5 h-5 opacity-20" />
                <span className="text-sm font-bold text-slate-300">PulseBoard Protocol</span>
            </div>
            <div className="text-[10px] font-black tracking-[1em] uppercase text-slate-100">THANKS FOR SHIPPING</div>
        </footer>
      </main>
    </div>
  );
}
