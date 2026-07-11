"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getPublicGitHubData, type PublicGitHubProfile } from "@/app/actions/public-github";
import { calculateFleetSynergy } from "@/lib/fleet-intel";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/skeletons";
import Image from "next/image";

function SharedFleetRegistry() {
  const searchParams = useSearchParams();
  const usernamesStr = searchParams.get("u") || "";
   const usernames = useMemo(() => usernamesStr.split(",").filter(Boolean), [usernamesStr]);

   const [fleetData, setFleetData] = useState<PublicGitHubProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
         const data = await Promise.all(usernames.map((u) => getPublicGitHubData(u)));
         setFleetData(data.filter((profile): profile is PublicGitHubProfile => Boolean(profile)));
      setLoading(false);
    }
    if (usernames.length > 0) load();
    else setLoading(false);
   }, [usernames]);

  const totalTeamStarsByFleet = fleetData.reduce((acc, curr) => acc + (curr.totalStars || 0), 0);
  const synergy = calculateFleetSynergy(fleetData);

  if (loading) return <PageLoader />;

  return (
   <div className="min-h-screen bg-transparent p-5 sm:p-10 md:p-24 selection:bg-primary/20 overflow-x-hidden">
      <header className="max-w-7xl mx-auto space-y-8 mb-16 md:mb-32 text-center">
        <div className="space-y-4">
           <span className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.5em] text-primary">Team Summary</span>
           <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">Shared <span className="font-light italic opacity-20">Team</span></h1>
        </div>
        <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.5em] opacity-30 flex flex-wrap items-center gap-3 sm:gap-4 justify-center text-center">
           <Shield size={16} className="text-primary" />
           {synergy.label} Team Profile
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-16 md:space-y-32">
         <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 md:p-12 rounded-3xl md:rounded-[4rem] glass border border-border/60 space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-foreground">Profiles</span>
               <div className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground tabular-nums">{fleetData.length}</div>
            </div>
            <div className="p-8 md:p-12 rounded-3xl md:rounded-[4rem] glass border border-border/60 space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-foreground">Total Stars</span>
               <div className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground">{totalTeamStarsByFleet}</div>
            </div>
            <div className="p-8 md:p-12 rounded-3xl md:rounded-[4rem] glass border border-primary/20 space-y-6 bg-primary/5">
                <div className="space-y-1">
                   <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${synergy.color}`}>{synergy.label}</p>
                     <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] italic">Team Fit</span>
                </div>
                <div className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-primary">{synergy.score}%</div>
            </div>
         </section>

         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {fleetData.map((node, i) => (
               <motion.div
                 key={node.username}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                         className="p-6 md:p-10 rounded-3xl md:rounded-[4rem] glass border border-border/40 space-y-8 group hover:border-primary/20 transition-all"
               >
                  <div className="flex items-center gap-5 md:gap-8">
                     <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[2rem] overflow-hidden border-4 border-background shadow-2xl shrink-0">
                        <Image src={node.avatarUrl} alt={node.name} fill sizes="96px" className="object-cover" />
                     </div>
                     <div className="space-y-1 min-w-0">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight truncate">{node.name}</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{node.topLanguage} Specialist</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-30">
                        <span>DevScore</span>
                        <span className="text-foreground opacity-100">{node.devScore.total}</span>
                     </div>
                     <div className="w-full h-2 bg-foreground/10 rounded-full relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${node.devScore.total}%` }}
                          className="absolute h-full bg-primary"
                        />
                     </div>
                  </div>

                  <Link
                    href={`/u/${node.username}`}
                              className="w-full py-5 glass border border-border/40 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center rounded-[1.5rem] hover:bg-foreground hover:text-background transition-all gap-4"
                  >
                    View Profile
                    <ArrowRight size={14} />
                  </Link>
               </motion.div>
            ))}
         </section>
      </main>

      <footer className="py-24 md:py-48 text-center text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[1em] opacity-5">
         Generated by PulseBoard
      </footer>
    </div>
  );
}

export default function FleetShare() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SharedFleetRegistry />
    </Suspense>
  );
}
