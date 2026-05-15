"use client";

import { useComparisonRegistry } from "@/lib/use-comparison";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trash2, Share2, Check, Radio, Code2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicGitHubData, type PublicGitHubProfile } from "@/app/actions/public-github";
import { calculateFleetSynergy } from "@/lib/fleet-intel";
import { LoadingTrigger } from "@/components/loading-trigger";
import Image from "next/image";

export default function FleetPage() {
  const { selected, toggleNode, clearNodes } = useComparisonRegistry();
  const [copied, setCopied] = useState(false);
  const [fleetData, setFleetData] = useState<PublicGitHubProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFleet() {
      setLoading(true);
      try {
        const data = await Promise.all(
          selected.map(u => getPublicGitHubData(u.username))
        );
        setFleetData(data.filter((d): d is PublicGitHubProfile => d !== null));
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
    <div className="relative min-h-screen flex flex-col selection:bg-muted bg-background text-foreground overflow-x-hidden">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 space-y-24 relative z-10 text-center">
        <section className="space-y-12">
          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mx-auto"
             >
               <Radio size={14} className="text-foreground" />
               Fleet Synergy
             </motion.div>
             
             <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight max-w-4xl mx-auto">
               Fleet Overview
             </h1>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Analyze saved profiles and review synergy metrics across your shortlist.
          </p>

          <div className="flex items-center justify-center gap-4">
             {selected.length > 0 && (
               <>
                 <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
                 >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                      {copied ? "ID Copied" : "Export Fleet"}
                 </button>
                 <button 
                    onClick={clearNodes}
                    className="p-3 bg-muted text-muted-foreground hover:bg-red-500 hover:text-white rounded-md transition-all border border-border"
                 >
                    <Trash2 size={16} />
                 </button>
               </>
             )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl bg-card border border-border flex flex-col justify-between h-64 text-left shadow-sm">
                <div className="space-y-2">
                   <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Active team size</p>
                 <h2 className="text-2xl font-semibold tracking-tight">Profiles</h2>
                </div>
                <div className="text-7xl font-semibold tracking-tighter tabular-nums">
                   {selected.length}
                </div>
            </div>
            
            <div className="p-8 rounded-xl bg-card border border-border flex flex-col justify-between h-64 text-left shadow-sm">
                <div className="space-y-2">
                   <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Aggregated Impact</p>
                   <h2 className="text-2xl font-semibold tracking-tight">Verified Stars</h2>
                </div>
                <div className="text-6xl font-semibold tracking-tighter tabular-nums">
                   {totalTeamStarsByFleet.toLocaleString()}
                </div>
            </div>

            <div className="p-8 rounded-xl bg-foreground text-background flex flex-col justify-between h-64 text-left shadow-sm">
                <div className="space-y-2">
                   <p className="text-xs font-medium uppercase tracking-widest opacity-60">Synergy Index</p>
                   <h2 className="text-2xl font-semibold tracking-tight">{synergy.label}</h2>
                </div>
                <div className="text-7xl font-semibold tracking-tighter tabular-nums">
                   {synergy.score}<span className="text-2xl opacity-40">%</span>
                </div>
            </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-end justify-between px-2 border-b border-border pb-6 text-left">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground">Saved Profiles</p>
              <h1 className="text-4xl font-semibold tracking-tighter">Fleet Nodes</h1>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
                <LoadingTrigger />
            </div>
          ) : selected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                   <Users size={32} />
                </div>
                <div className="space-y-2">
                   <h2 className="text-2xl font-semibold tracking-tight">No profiles yet</h2>
                   <p className="text-muted-foreground font-medium max-w-md leading-relaxed mx-auto">
                     Save profiles to build a shortlist and compare team coverage.
                   </p>
                </div>
                <Link href="/explore" className="px-8 py-3 bg-foreground text-background rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
                    Browse profiles
                </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {fleetData.map((node, i) => (
                  <motion.div
                    key={node.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-8 rounded-xl bg-card border border-border space-y-8 text-left relative overflow-hidden shadow-sm transition-colors hover:border-foreground/20">
                      <div className="absolute top-6 right-6 z-30">
                         <button 
                           onClick={() => toggleNode({ id: node.username, username: node.username, avatar_url: node.avatarUrl })}
                           className="p-2 bg-muted text-muted-foreground hover:text-red-500 rounded-md transition-all border border-border"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-muted shadow-sm bg-background">
                           <Image src={node.avatarUrl} alt={node.name} fill sizes="80px" className="object-cover" />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-xl font-semibold tracking-tight text-foreground truncate max-w-[140px] leading-tight">{node.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                               <Code2 size={12} />
                               {node.topLanguage} Mastery
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-1">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Verified Stars</span>
                            <div className="text-xl font-semibold text-foreground tabular-nums">{node.totalStars.toLocaleString()}</div>
                         </div>
                         <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-1">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Dev Index</span>
                            <div className="text-xl font-semibold text-foreground tabular-nums">{node.devScore.total}</div>
                         </div>
                      </div>

                      <Link 
                        href={`/u/${node.username}`}
                        className="w-full py-3 bg-foreground text-background text-xs font-medium flex items-center justify-center rounded-md hover:opacity-90 transition-all shadow-sm gap-2"
                      >
                        View profile <TrendingUp size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="py-12 text-center border-t border-border mt-20">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-20">PulseBoard Team Overview</p>
      </footer>
    </div>
  );
}
