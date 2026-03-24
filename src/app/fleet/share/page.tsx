"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { calculateFleetSynergy } from "@/lib/fleet-intel";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Rocket, Zap, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SharedFleetRegistry() {
  const searchParams = useSearchParams();
  const usernamesStr = searchParams.get("u") || "";
  const usernames = usernamesStr.split(",").filter(Boolean);

  const [fleetData, setFleetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await Promise.all(
        usernames.map(u => getPublicGitHubData(u))
      );
      setFleetData(data.filter(Boolean));
      setLoading(false);
    }
    if (usernames.length > 0) load();
    else setLoading(false);
  }, [usernamesStr]);

  const totalTeamStarsByFleet = fleetData.reduce((acc, curr) => acc + (curr.totalStars || 0), 0);
  const synergy = calculateFleetSynergy(fleetData);

  if (loading) return (
     <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-30">Decrypting Shared Registry</p>
     </div>
  );

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-24 selection:bg-primary/20">
      <header className="max-w-7xl mx-auto space-y-8 mb-32 text-center">
        <div className="space-y-4">
           <span className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.5em] text-primary">Intelligence Audit Output</span>
           <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">Shared <span className="font-light italic opacity-20">Fleet</span></h1>
        </div>
        <p className="text-[12px] font-bold uppercase tracking-[0.5em] opacity-30 flex items-center gap-4 justify-center">
           <Shield size={16} className="text-primary" />
           {synergy.label} Intelligence Profile
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-32">
         {/* Metrics Grid */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-12 rounded-[4rem] glass border border-black/5 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-black">Audited Nodes</span>
                <div className="text-8xl font-black tracking-tighter text-black">{fleetData.length}</div>
            </div>
            <div className="p-12 rounded-[4rem] glass border border-black/5 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-black">Asset Force</span>
                <div className="text-8xl font-black tracking-tighter text-black">{totalTeamStarsByFleet}</div>
            </div>
            <div className="p-12 rounded-[4rem] glass border border-primary/20 space-y-6 bg-primary/5">
                <div className="space-y-1">
                   <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${synergy.color}`}>{synergy.label}</p>
                   <span className="text-[8px] font-bold text-black/20 uppercase tracking-[0.2em] italic">Synergy Protocol</span>
                </div>
                <div className="text-8xl font-black tracking-tighter text-primary">{synergy.score}%</div>
            </div>
         </section>

         {/* Share Table */}
         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {fleetData.map((node, i) => (
               <motion.div 
                 key={node.name}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="p-10 rounded-[4rem] glass border border-white/5 space-y-8 group hover:border-primary/20 transition-all"
               >
                  <div className="flex items-center gap-8">
                     <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-background shadow-2xl">
                        <img src={node.avatarUrl} alt={node.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-3xl font-black uppercase tracking-tight truncate max-w-[150px]">{node.name}</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{node.topLanguage} Specialist</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-30">
                        <span>DevScore Index</span>
                        <span className="text-white opacity-100">{node.devScore.total}</span>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${node.devScore.total}%` }}
                          className="absolute h-full bg-primary"
                        />
                     </div>
                  </div>

                  <Link 
                    href={`/u/${node.name}`}
                    className="w-full py-5 glass border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center rounded-[1.5rem] hover:bg-primary hover:text-white transition-all gap-4"
                  >
                    View Registry
                    <ArrowRight size={14} />
                  </Link>
               </motion.div>
            ))}
         </section>
      </main>

      <footer className="py-48 text-center text-[10px] font-black uppercase tracking-[1em] opacity-5">
         Intelligence Generated by PulseBoard Premium
      </footer>
    </div>
  );
}

export default function FleetShare() {
  return (
    <Suspense fallback={<div>Loading Fleet...</div>}>
      <SharedFleetRegistry />
    </Suspense>
  );
}
