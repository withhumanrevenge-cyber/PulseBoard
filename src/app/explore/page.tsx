"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Github, Zap, Radio } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import { SmartAuthButton } from "@/components/smart-auth-button";
import { ExploreTalentFilter } from "@/components/explore-talent-filter";
import { IntelligenceTerminal } from "@/components/intelligence-terminal";
import { KineticParticles } from "@/components/kinetic-particles";
import { getExploreUsers } from "@/app/actions/explore";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getExploreUsers();
        setUsers(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary/20 bg-white text-black overflow-x-hidden">
      <KineticParticles />
      
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b border-black/5 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-black text-white shadow-xl shadow-black/10">
            <PulseLogo className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">PulseBoard</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] hover:text-black transition-all hidden md:block">
            Home
          </Link>
          <SmartAuthButton
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
          >
            Access Console
          </SmartAuthButton>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-32 space-y-48 text-center relative z-10">
        <section className="space-y-16 flex flex-col items-center">
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mx-auto"
             >
               <Radio size={14} className="text-primary animate-pulse" />
               Global Talent Directory
             </motion.div>
             
             <h1 className="text-[5rem] md:text-[8rem] font-black tracking-[-0.05em] leading-[0.8] uppercase max-w-5xl mx-auto drop-shadow-sm shadow-black/5">
                Build<br/><span className="text-black/10 font-light italic">the</span> Network
             </h1>
          </div>

          <p className="text-black/50 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;Scan the world&apos;s most active engineering nodes. Filter by technical mastery and shipping frequency.&rdquo;
          </p>

          <div className="w-full pt-10">
            <ExploreTalentFilter initialUsers={users} />
          </div>
        </section>

        {loading ? (
             <div className="p-32 text-center rounded-[3rem] bg-white border border-black/5 shadow-xl flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Synchronizing Nodes...</p>
             </div>
        ) : users.length === 0 && (
          <section className="p-32 text-center rounded-[4rem] bg-white border border-black/5 shadow-2xl flex flex-col items-center gap-10">
            <div className="w-24 h-24 rounded-[2rem] bg-black/5 flex items-center justify-center text-black/20">
               <Github size={40} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight">Registry Offline</h2>
              <p className="text-black/40 font-medium text-lg max-w-sm italic leading-relaxed mx-auto">
                &ldquo;Be the first to launch your profile and get featured in the global directory.&rdquo;
              </p>
            </div>
            <SmartAuthButton
              className="flex items-center gap-4 px-12 py-5 rounded-full bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
            >
              Launch Profile <ArrowRight className="w-4 h-4" />
            </SmartAuthButton>
          </section>
        )}

        <section className="p-20 rounded-[5rem] bg-black text-white flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <Zap size={400} strokeWidth={0.1} />
          </div>
          <div className="space-y-8 max-w-2xl relative z-10 text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">Join <br /> <span className="text-white/20 font-light italic">the</span> <span className="text-primary">Registry.</span></h2>
            <p className="text-white/40 font-medium text-xl leading-relaxed italic max-w-lg">
              &ldquo;Connect your stack, launch your dashboard, and get featured in the directory today.&rdquo;
            </p>
          </div>
          <SmartAuthButton
            className="px-14 py-8 bg-primary text-primary-foreground rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 relative z-10 whitespace-nowrap"
          >
            Launch Portfolio
          </SmartAuthButton>
        </section>
      </main>

      <IntelligenceTerminal />

      <footer className="py-24 text-center border-t border-black/5 mt-32">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10">PulseBoard Global Directory</p>
      </footer>
    </div>
  );
}
