"use client";

import { useUser } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Globe, Github, Zap, Shield, Sparkles, Code, GitBranch, Terminal } from "lucide-react";
import Link from "next/link";
import { BackgroundOrganism } from "@/components/motion-kit";
import { PulseLogo } from "@/components/pulse-logo";
import { KineticSearch } from "@/components/kinetic-search";
import { SmartAuthButton } from "@/components/smart-auth-button";

export default function LandingPage() {
  const { user } = useUser();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary/20 bg-background text-foreground overflow-x-hidden">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5">
            <PulseLogo className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">PulseBoard</span>
        </div>

        <nav className="flex items-center gap-7">
          <Link href="/explore" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all hidden md:block">
            Directory
          </Link>
          <SmartAuthButton
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/50 bg-foreground text-background text-[11px] font-semibold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all outline-none"
          >
            Console
          </SmartAuthButton>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-40 space-y-48">
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12">
          <div className="space-y-8 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/80"
            >
              <Terminal className="w-3.5 h-3.5" />
              Verified Shipping Node
            </motion.div>

            <h1 className="text-6xl md:text-[11rem] font-bold tracking-[-0.04em] leading-[0.85] flex flex-col items-center group">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Welcome <span className="font-light italic text-muted-foreground/20 group-hover:text-primary/40 transition-colors duration-1000 tracking-tight">to the</span>
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-gradient font-black py-4 tracking-[-0.06em]"
              >
                PulseBoard
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground text-xl md:text-2xl font-normal max-w-2xl mx-auto leading-relaxed"
            >
              Automate your professional transparency. Connect your stack and launch a verified metrics protocol that updates as you ship.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="w-full max-w-2xl"
          >
            <KineticSearch 
              prefix="u/" 
              placeholder="github_handle" 
              buttonText="Access" 
            />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-20">
            {[
              { title: "Active Velocity", desc: "Real-time commit synchronization. Your reputation updates the moment you push to main.", icon: Zap, label: "0.1MS SYNC" },
              { title: "Verified Protocol", desc: "Cryptographically signed summaries of your work history. Trustless transparency for nodes.", icon: Shield, label: "ENCRYPTED" },
              { title: "Global Directory", desc: "Get discovered by top engineering labs. Sort by shipping frequency and linguistic stack.", icon: Globe, label: "NETWORK" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full"
              >
                <div className="p-10 rounded-[3rem] bg-secondary/5 border border-black/[0.03] hover:border-black/[0.08] hover:bg-secondary/10 transition-all duration-700 h-full flex flex-col justify-between space-y-8 relative overflow-hidden">
                  <div className="space-y-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl">
                        <f.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                       <div className="text-[10px] font-black tracking-[0.3em] text-black/20 uppercase">{f.label}</div>
                       <h3 className="text-3xl font-bold tracking-tight">{f.title}</h3>
                    </div>
                    <p className="text-muted-foreground/80 leading-relaxed font-normal">{f.desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0">
                     <div className="h-px w-8 bg-black/20" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Active Node</span>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/[0.02] rounded-full blur-3xl group-hover:bg-primary/5 transition-all duration-1000" />
                </div>
              </motion.div>
            ))}
        </section>

        <footer className="pt-20 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
               <PulseLogo className="w-5 h-5 opacity-20" />
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20">Pulse System 0.1</span>
            </div>
            <p className="text-muted-foreground/40 text-sm max-w-sm">The decentralized standard for tracking developer shipping frequency and architectural velocity.</p>
          </div>
          <div className="flex items-center gap-12">
             <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Support</p>
                <Link href="#" className="block text-sm font-semibold hover:text-primary transition-colors">Documentation</Link>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Protocol</p>
                <Link href="/explore" className="block text-sm font-semibold hover:text-primary transition-colors">Directory</Link>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
