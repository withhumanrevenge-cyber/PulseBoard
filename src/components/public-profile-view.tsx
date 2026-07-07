"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Github, Zap, Rocket, Sword, TrendingUp, Code2, Share2 } from "lucide-react";
import { verifyDeployment } from "@/app/actions/verify-deployment";
import { useEffect, useState } from "react";
import { getWeeklyContributions } from "@/app/actions/github";
import { LanguagePie } from "./language-pie";
import { useComparisonRegistry } from "@/lib/use-comparison";
import { IntelligenceTerminal } from "./intelligence-terminal";
import type { PublicGitHubProfile } from "@/app/actions/public-github";
import Image from "next/image";

function DeploymentBadge({ url }: { url: string }) {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      if (!url) return;
      const live = await verifyDeployment(url);
      setIsLive(live);
    }
    check();
  }, [url]);

  if (isLive === null) return null;

  return (
    <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest vercel-shadow z-20 ${
      isLive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
    }`}>
      {isLive ? "Live" : "Offline"}
    </div>
  );
}

interface PublicProfileViewProps {
  username: string;
  profile: PublicGitHubProfile;
  repos: PublicGitHubProfile["repos"];
}

export function PublicProfileView({ username, profile, repos }: PublicProfileViewProps) {
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const { toggleNode, isSelected } = useComparisonRegistry();
  const [showReputation, setShowReputation] = useState(false);

  const isSelectedForTeam = isSelected(username);

  useEffect(() => {
    async function load() {
      const data = await getWeeklyContributions(username);
      setWeeklyData(data);
    }
    load();
  }, [username]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      <main className="max-w-5xl mx-auto px-6 py-24 space-y-24">
        
        <section className="flex flex-col items-center text-center space-y-10">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border border-border/50 vercel-shadow bg-card"
            >
              <Image src={profile.avatarUrl} alt={username} fill sizes="160px" className="object-cover" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-foreground">
                {profile.name || username}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                   github.com/{username}
                </div>
              </div>
            </div>

            {profile.bio && (
              <p className="max-w-xl mx-auto text-muted-foreground text-lg font-medium leading-relaxed">
                {profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                className="h-10 px-5 bg-accent/50 text-foreground border border-border/50 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-2"
              >
                <Github size={14} /> GitHub
              </a>

              <button 
                onClick={() => toggleNode({ id: username, username, avatar_url: profile.avatarUrl })}
                className={`h-10 px-5 border rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isSelectedForTeam 
                  ? "bg-foreground border-foreground text-background vercel-shadow" 
                  : "bg-background border-border/50 hover:border-foreground/20 text-foreground"
                }`}
              >
                 <Sword size={14} />
                 {isSelectedForTeam ? "In Team" : "Add to Team"}
              </button>

              <button 
                onClick={() => setShowReputation(true)}
                className="h-10 px-5 bg-foreground text-background rounded-lg font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all vercel-shadow flex items-center gap-2"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 border border-border/50 bg-card spatial-card rounded-2xl flex flex-col justify-between h-64">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reputation</p>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">Dev Score</h2>
                 </div>
                 <div className="flex flex-col items-start gap-1">
                    <div className="text-6xl font-bold tracking-tighter text-foreground tabular-nums leading-none">{profile.devScore.total}</div>
                    <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                       {profile.devScore.labels[0] || "Verified"}
                    </div>
                 </div>
            </div>

            <div className="p-8 border border-border/50 bg-card spatial-card rounded-2xl flex flex-col justify-between h-64">
                 <div className="space-y-1 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Technology</p>
                    <div className="w-full aspect-square max-h-24 relative flex items-center justify-center p-2 mx-auto">
                       {profile.languageMap?.length > 0 ? (
                            <LanguagePie languages={profile.languageMap} topLanguage={profile.topLanguage} />
                       ) : (
                         <div className="w-full h-full rounded-full border border-dashed border-border/50 flex items-center justify-center">
                            <Code2 size={20} className="text-muted-foreground/20" />
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-base font-bold tracking-tight text-foreground leading-tight">
                       {profile.topLanguage}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Stack</p>
                 </div>
            </div>

            <div className="p-8 border border-border/50 bg-card spatial-card rounded-2xl h-64 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consistency</p>
                   <TrendingUp size={14} className="text-emerald-500" />
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col">
                      <span className="text-6xl font-bold text-foreground leading-none tabular-nums">{profile.streak || 0}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Active Streak</span>
                   </div>
                </div>
            </div>

            <div className="p-8 border border-border/50 bg-card spatial-card rounded-2xl h-64 flex flex-col justify-between">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Volume</p>
                    <GitCommit size={14} className="text-foreground" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex flex-col">
                       <span className="text-6xl font-bold text-foreground leading-none tabular-nums">{profile.totalContributions || profile.contributions}</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Contributions · 100d</span>
                    </div>
                    <div className="flex gap-1 h-6 items-end">
                       {weeklyData?.slice(-12).map((w, i) => (
                         <div 
                           key={i} 
                           style={{ height: `${Math.max(20, Math.min(100, (w / (Math.max(...weeklyData, 1) / 100))))}%` }}
                           className="flex-1 bg-foreground/10 rounded-sm hover:bg-foreground/30 transition-all duration-300"
                         />
                       ))}
                    </div>
                 </div>
            </div>
        </section>

        <section className="space-y-12">
            <div className="flex items-end justify-between px-2 border-b border-border/50 pb-8">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</p>
                  <h2 className="text-4xl font-bold tracking-tighter text-gradient">Recent repositories</h2>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {repos.slice(0, 9).map((repo, i) => (
                    <motion.div
                      key={repo.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="group p-8 h-full flex flex-col justify-between space-y-10 border border-border/50 bg-card spatial-card rounded-2xl hover:border-foreground/20 transition-all duration-500 relative overflow-hidden">
                        <DeploymentBadge url={repo.homepage || ""} />
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500">
                                  <Github size={16} className="text-foreground" />
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/5 text-amber-600 border border-amber-500/10 text-[10px] font-bold uppercase tracking-widest">
                                  <Star size={10} className="fill-current" />
                                  {repo.stars}
                               </div>
                            </div>

                            <div className="space-y-2">
                               <h3 className="text-xl font-bold tracking-tight text-foreground truncate">{repo.name}</h3>
                               <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                                   {repo.description || "Active production repository."}
                               </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                               {repo.language && (
                                <span className="px-2.5 py-1 bg-accent/50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
                                  {repo.language}
                                </span>
                               )}
                            </div>

                            <div className="flex items-center gap-3">
                               <a 
                                 href={repo.link}
                                 target="_blank"
                                 className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-border/50 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/50 transition-all"
                               >
                                 <Github size={12} /> Source
                                </a>
                                {repo.homepage && (
                                 <a
                                   href={repo.homepage}
                                   target="_blank"
                                   className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all vercel-shadow"
                                 >
                                   <Rocket size={12} /> Deploy
                                 </a>
                               )}
                            </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
            </div>
        </section>
      </main>

      <IntelligenceTerminal />

      <footer className="py-24 text-center border-t border-border/50">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 text-foreground">Verified Developer Profile</p>
      </footer>

      <AnimatePresence>
        {showReputation && (
          <ReputationCard 
            username={username}
            avatarUrl={profile.avatarUrl}
            totalStars={profile.totalStars}
            setShowReputation={setShowReputation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReputationCard({ username, avatarUrl, totalStars, setShowReputation }: { username: string; avatarUrl: string; totalStars: number; setShowReputation: (open: boolean) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
      onClick={() => setShowReputation(false)}
    >
      <div className="w-full max-w-sm bg-card p-10 rounded-3xl border border-border/50 vercel-shadow space-y-10 text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setShowReputation(false)}
          className="absolute top-6 right-6 p-2 bg-accent/50 text-muted-foreground hover:text-foreground rounded-lg transition-all"
        >
           <Zap size={14} />
        </button>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Network Verification</p>
            <h2 className="text-3xl font-bold tracking-tighter text-foreground text-gradient">Profile Ready</h2>
          </div>
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-accent vercel-shadow mx-auto">
            <Image src={avatarUrl} alt={username} fill sizes="96px" className="object-cover" />
          </div>
        <div className="space-y-1">
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GitHub Identity</p>
           <p className="text-xl font-bold text-foreground tracking-tight">@{username}</p>
        </div>
        <div className="p-8 rounded-2xl bg-accent/30 border border-border/50 flex justify-between items-center text-foreground">
           <div className="text-left space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Impact</p>
                <p className="text-2xl font-bold tracking-tighter">{totalStars} Stars</p>
           </div>
           <div className="p-3 rounded-xl bg-background border border-border/50 vercel-shadow">
             <Github size={24} className="opacity-80" />
           </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 text-foreground">Official PulseBoard Signature</p>
      </div>
    </motion.div>
  );
}
