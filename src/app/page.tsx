"use client";

import { useUser } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Globe, Github, Zap, Shield, Sparkles, Code, GitBranch, Terminal, Radio } from "lucide-react";
import Link from "next/link";
import { PulseLogo } from "@/components/pulse-logo";
import { KineticSearch } from "@/components/kinetic-search";
import { SmartAuthButton } from "@/components/smart-auth-button";
import { ScoutBot } from "@/components/scout-bot";
import { KineticParticles } from "@/components/kinetic-particles";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary/20 bg-white text-black overflow-x-hidden">
      <KineticParticles />
      
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b border-black/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-black text-white shadow-xl shadow-black/10">
            <PulseLogo className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">PulseBoard</span>
        </div>

        <nav className="flex items-center gap-8">
          <Link href="/explore" className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] hover:text-black transition-all hidden md:block">
            Directory
          </Link>
          <SmartAuthButton
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
          >
            Access Console
          </SmartAuthButton>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-32 space-y-48">
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center space-y-16">
          <div className="relative flex flex-col items-center space-y-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
               <ScoutBot />
            </motion.div>

            <div className="space-y-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-[0.5em] text-black/30"
               >
                 <Radio size={14} className="text-primary animate-pulse" />
                 Global Developer Database
               </motion.div>

               <h1 className="text-[5rem] md:text-[8rem] font-black tracking-[-0.05em] leading-[0.8] uppercase max-w-5xl mx-auto drop-shadow-sm shadow-black/5">
                 Pulse<br/>Board
               </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-black/50 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic"
            >
              &ldquo;Automate your professional transparency. Connect your stack and launch a verified metrics portfolio that updates as you ship.&rdquo;
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full max-w-2xl relative z-10"
          >
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full -z-10 opacity-30" />
            <KineticSearch 
              prefix="u/" 
              placeholder="github_handle" 
              buttonText="Access Profile" 
            />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-20 relative z-10">
            {[
              { title: "Velocity Platform", desc: "Real-time commit synchronization. Your reputation updates the moment you push to main.", icon: Zap, label: "0.1MS SYNC" },
              { title: "Verified Identity", desc: "Cryptographically signed summaries of your work history. Trusted transparency for hiring.", icon: Shield, label: "ENCRYPTED" },
              { title: "Global Directory", desc: "Get discovered by top engineering labs. Sort by shipping frequency and technical mastery.", icon: Globe, label: "DIRECTORY" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full"
              >
                <div className="p-12 rounded-[4rem] bg-white border border-black/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-700 h-full flex flex-col justify-between space-y-10 relative overflow-hidden group/card shadow-black/5">
                  <div className="space-y-8 relative z-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center group-hover:rotate-12 transition-all duration-700 shadow-2xl shadow-black/20">
                        <f.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-3">
                       <div className="text-[10px] font-black tracking-[0.4em] text-black/20 uppercase">{f.label}</div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{f.title}</h3>
                    </div>
                    <p className="text-black/40 leading-relaxed font-medium italic">&ldquo;{f.desc}&rdquo;</p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0">
                     <div className="h-px w-10 bg-black/20" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Portfolio</span>
                     <ArrowRight size={14} className="text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
        </section>

        <footer className="pt-32 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <PulseLogo className="w-6 h-6 opacity-20" />
               <span className="text-[10px] font-black uppercase tracking-[0.8em] opacity-20">Developer Platform v3.2</span>
            </div>
            <p className="text-black/30 text-base font-medium max-w-sm leading-relaxed italic">The standard for tracking developer shipping frequency and technical velocity.</p>
          </div>
          <div className="flex items-center gap-20">
             <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Directory</p>
                <Link href="/explore" className="block text-base font-black uppercase tracking-tight hover:text-primary transition-colors">Global Profiles</Link>
             </div>
             <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Access</p>
                <Link href="#" className="block text-base font-black uppercase tracking-tight hover:text-primary transition-colors">Documentation</Link>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
