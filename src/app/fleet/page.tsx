"use client";

import { useComparisonRegistry } from "@/lib/use-comparison";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Rocket, Zap, Star, Github, ArrowLeft, Trash2, LayoutGrid, Share2, Check, Radio, Code2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { calculateFleetSynergy } from "@/lib/fleet-intel";
import { KineticParticles } from "@/components/kinetic-particles";
import { PulseLogo } from "@/components/pulse-logo";
import { SpotlightCard } from "@/components/motion-kit";

export default function FleetPage() {
  const { selected, toggleNode, clearNodes } = useComparisonRegistry();
  const [copied, setCopied] = useState(false);
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFleet() {
      setLoading(true);
      try {
        const data = await Promise.all(
          selected.map(u => getPublicGitHubData(u.username))
        );
        setFleetData(data.filter(Boolean));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (selected.length > 0) loadFleet();
    else {
      setFleetData([]);
      setLoading(false);
    }
  }, [selected]);

  const totalTeamStarsByFleet = fleetData.reduce((acc, curr) => acc + (curr.totalStars || 0), 0);
  const synergy = calculateFleetSynergy(fleetData);

  const handleShare = () => {
    const u = selected.map(n => n.username).join(",");
    const url = `${window.location.origin}/fleet/share?u=${u}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary/20 bg-white text-black overflow-x-hidden">
      <KineticParticles />
      
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b border-black/5 shadow-sm">
        <Link href="/explore" className="flex items-center gap-3 group">
          <div className="p-2 rounded-2xl bg-black text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Directory</span>
        </Link>

        <div className="flex items-center gap-4">
           {selected.length > 0 && (
             <>
               <button 
                  onClick={handleShare}
                  className="h-14 px-8 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center gap-4"
               >
                  {copied ? <Check size={14} className="text-primary" /> : <Share2 size={14} />}
                  {copied ? "Link Copied" : "Share Fleet"}
               </button>
               <button 
                  onClick={clearNodes}
                  className="w-14 h-14 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-full transition-all flex items-center justify-center border border-rose-500/10 shadow-xl active:scale-90"
               >
                  <Trash2 size={16} />
               </button>
             </>
           )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-32 space-y-48 relative z-10 text-center">
        <section className="space-y-16">
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mx-auto"
             >
               <Radio size={14} className="text-primary animate-pulse" />
               Aggregated Talent Intelligence
             </motion.div>
             
             <h1 className="text-[5rem] md:text-[8rem] font-black tracking-[-0.05em] leading-[0.8] uppercase max-w-5xl mx-auto drop-shadow-sm shadow-black/5">
                Fleet<br/><span className="text-black/10 font-light italic">the</span> Command
             </h1>
          </div>

          <p className="text-black/50 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;Manage your stashed profiles and analyze engineering synergy across your private talent fleet.&rdquo;
          </p>
        </section>

        {/* Global Impact Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <SpotlightCard className="p-12 rounded-[4rem] bg-white border border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-between h-96 group relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-12 text-black/[0.02] group-hover:scale-110 transition-transform duration-1000 rotate-12">
                   <Users size={180} />
                </div>
                <div className="space-y-4 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Active Fleet Size</p>
                   <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Talent Nodes</h2>
                </div>
                <div className="text-9xl font-black tracking-tighter text-black relative z-10 tabular-nums">
                   {selected.length}
                </div>
            </SpotlightCard>
            
            <SpotlightCard className="p-12 rounded-[4rem] bg-white border border-emerald-500/10 shadow-[0_40px_100px_-20px_rgba(16,185,129,0.05)] flex flex-col justify-between h-96 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-12 text-emerald-500 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12">
                   <Star size={180} />
                </div>
                <div className="space-y-4 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">Aggregated Impact</p>
                   <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Verified Stars</h2>
                </div>
                <div className="text-8xl font-black tracking-tighter text-black relative z-10 tabular-nums">
                   {totalTeamStarsByFleet.toLocaleString()}
                </div>
            </SpotlightCard>

            <SpotlightCard className="p-12 rounded-[4rem] bg-black border border-white/5 shadow-2xl flex flex-col justify-between h-96 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform duration-1000 -rotate-12">
                   <Zap size={220} />
                </div>
                <div className="space-y-4 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Synergy Protocol</p>
                   <h2 className="text-5xl font-black uppercase tracking-tighter text-white">{synergy.label}</h2>
                </div>
                <div className="text-9xl font-black tracking-tighter text-white relative z-10 tabular-nums">
                   {synergy.score}<span className="text-4xl text-white/20">%</span>
                </div>
            </SpotlightCard>
        </section>

        {/* Talent Grid */}
        <section className="space-y-24">
          <div className="flex items-end justify-between px-6 border-b border-black/5 pb-10 text-left">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary">Stashed Fleet</p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-sm">Deployed <span className="text-black/10 font-light italic">Nodes</span></h1>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 space-y-10">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-2xl shadow-primary/20" />
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-black/20">Synchronizing Fleet Analytics...</p>
            </div>
          ) : selected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-48 space-y-12 text-center bg-white border-2 border-dashed border-black/5 rounded-[5rem] shadow-2xl">
                <div className="w-24 h-24 rounded-[3rem] bg-black/5 flex items-center justify-center text-black/10">
                   <Users size={40} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-4xl font-black uppercase tracking-tight">Fleet Terminal Empty</h2>
                   <p className="text-black/40 font-medium text-lg max-w-md italic leading-relaxed mx-auto">
                      &ldquo;Command Terminal requires active talent nodes. Stash developers from their profiles to analyze your fleet synergy.&rdquo;
                   </p>
                </div>
                <Link href="/explore" className="px-14 py-6 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20">
                    Deploy Scout Nodes
                </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {fleetData.map((node, i) => (
                  <motion.div
                    key={node.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                    transition={{ delay: i * 0.1 }}
                    className="perspective-[1000px]"
                  >
                    <SpotlightCard className="p-12 rounded-[4rem] bg-white border border-black/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-700 space-y-12 text-left relative overflow-hidden group">
                      <div className="absolute top-8 right-8 z-30">
                         <button 
                           onClick={() => toggleNode({ id: node.name, username: node.name, avatar_url: node.avatarUrl })}
                           className="w-12 h-12 bg-rose-500/5 text-rose-500/40 hover:text-white hover:bg-rose-500 rounded-2xl transition-all flex items-center justify-center border border-rose-500/10 shadow-sm"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>

                      <div className="flex items-center gap-8">
                         <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-8 border-black/5 shadow-2xl bg-white relative group/avatar">
                            <img src={node.avatarUrl} alt={node.name} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                         </div>
                         <div className="space-y-3">
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-black break-words truncate max-w-[140px] leading-none">{node.name}</h3>
                            <div className="px-4 py-2 bg-black/5 border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest text-black/40 inline-flex items-center gap-2">
                               <Code2 size={12} className="text-primary" />
                               {node.topLanguage} Mastery
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 rounded-[2rem] bg-black/5 border border-black/5 space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Verified Stars</span>
                            <div className="text-2xl font-black text-black tabular-nums">{node.totalStars.toLocaleString()}</div>
                         </div>
                         <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/40">Dev Index</span>
                            <div className="text-2xl font-black text-black tabular-nums">{node.devScore.total}</div>
                         </div>
                      </div>

                      <Link 
                        href={`/u/${node.name}`}
                        className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 gap-4"
                      >
                        Deep Profile Analysis <TrendingUp size={14} className="text-primary" />
                      </Link>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="py-24 text-center border-t border-black/5 mt-32">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10">PulseBoard Fleet Intelligence</p>
      </footer>
    </div>
  );
}
