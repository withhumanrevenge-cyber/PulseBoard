"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Github, BadgeCheck, Zap, ArrowRight, Activity, Shield, Rocket, Sword, Bell, TrendingUp, LayoutGrid, Code2 } from "lucide-react";
import { SpotlightCard } from "./motion-kit";
import { verifyDeployment } from "@/app/actions/verify-deployment";
import { useEffect, useState } from "react";
import { getWeeklyContributions } from "@/app/actions/github";
import { LanguagePie } from "./language-pie";
import { useComparisonRegistry } from "@/lib/use-comparison";
import Link from "next/link";
import { IntelligenceTerminal } from "./intelligence-terminal";


function DeploymentBadge({ url }: { url: string }) {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      const live = await verifyDeployment(url);
      setIsLive(live);
    }
    check();
  }, [url]);

  if (isLive === null) return null;

  return (
    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl z-20 ${
      isLive ? "bg-emerald-500 text-white animate-pulse" : "bg-rose-500 text-white opacity-50"
    }`}>
      {isLive ? "Live" : "Inactive"}
    </div>
  );
}

interface PublicProfileViewProps {
  username: string;
  profile: any;
  repos: any[];
  privacy: any;
}

export function PublicProfileView({ username, profile, repos, privacy }: PublicProfileViewProps) {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const { toggleNode, isSelected } = useComparisonRegistry();
  const [showReputation, setShowReputation] = useState(false);

  const isSelectedForDuel = isSelected(username);

  useEffect(() => {
    async function load() {
      const data = await getWeeklyContributions(username);
      setWeeklyData(data);
    }
    load();
  }, [username]);


  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/20">
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        <section className="flex flex-col items-center text-center space-y-12 transition-all">
            <div className="relative group">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 md:w-64 md:h-64 rounded-[4rem] overflow-hidden border-8 border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative z-10 bg-white"
              >
                <img 
                  src={profile.avatarUrl} 
                  alt={username}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none text-black">
                {profile.name || username}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-black/5 shadow-sm text-[10px] font-black uppercase tracking-[0.4em] text-black/60">
                   @{username}
                </div>
              </div>
            </div>

            {profile.bio && (
              <p className="max-w-xl mx-auto text-black/40 text-xl font-medium leading-relaxed italic">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-10 px-4">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                className="h-16 px-10 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-4"
              >
                <Github size={16} /> Portfolio
              </a>

              <button 
                onClick={() => toggleNode({ id: username, username, avatar_url: profile.avatarUrl })}
                className={`h-16 px-10 border-2 rounded-full font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl ${
                  isSelectedForDuel 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-white border-black/5 hover:border-black text-black"
                }`}
              >
                 <Sword size={16} className={isSelectedForDuel ? "text-primary-foreground" : "text-primary"} />
                 {isSelectedForDuel ? "Selected" : "Select Profile"}
              </button>

              <button 
                onClick={() => setShowReputation(true)}
                className="h-16 px-10 bg-primary text-primary-foreground rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
              >
                Export Stats
              </button>
            </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <SpotlightCard className="p-10 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] group min-h-[480px] flex flex-col justify-between overflow-hidden">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Technical Overview</p>
                    <h2 className="text-4xl font-black italic tracking-tighther uppercase leading-[0.85] text-black">
                       Dev<br/>Stats
                    </h2>
                 </div>
                 <div className="flex flex-col items-start gap-2">
                    <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Aggregate Rating</span>
                    <div className="text-6xl md:text-7xl font-black text-black leading-none break-all">{profile.devScore.total}</div>
                 </div>
                  <div className="pt-8 border-t border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40 italic">Verified Live Analysis</div>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] flex flex-col justify-between min-h-[480px]">
                 <div className="space-y-6 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Stack Mastery</p>
                    <div className="w-full aspect-square relative flex items-center justify-center p-2">
                       {profile.languageMap?.length > 0 ? (
                            <LanguagePie languages={profile.languageMap} topLanguage={profile.topLanguage} />
                       ) : (
                         <div className="w-full h-full rounded-full border-2 border-dashed border-black/5 flex items-center justify-center">
                            <Code2 size={40} className="text-black/5" />
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Technical Breadth</p>
                    <p className="text-xl font-black text-black leading-tight max-w-[180px]">
                       {profile.languageMap?.length || 0} Programming Languages
                    </p>
                 </div>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] min-h-[480px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Shipping Velocity</p>
                   <TrendingUp size={20} className="text-emerald-500" />
                </div>
                <div className="space-y-10">
                   <div className="flex flex-col">
                      <span className="text-6xl md:text-8xl font-black text-black leading-none tabular-nums break-all">{profile.streak || 0}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/20 mt-2">Active Day Streak</span>
                   </div>
                   <div className="space-y-4 pt-10 border-t border-black/5">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-black">
                         <span>Activity Focus</span>
                         <span className="text-emerald-500">Peak Performance</span>
                      </div>
                      <p className="text-[10px] font-medium text-black/40 italic">
                         Consistently pushing and updating across the tech stack.
                      </p>
                   </div>
                </div>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] min-h-[480px] flex flex-col justify-between">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Contribution</p>
                    <GitCommit size={20} className="text-primary" />
                 </div>
                 <div className="space-y-10">
                    <div className="flex flex-col">
                       <span className="text-6xl md:text-7xl font-black text-black leading-none tabular-nums break-all">{profile.totalContributions || profile.contributions}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-black/20 mt-2">Annual Impact</span>
                    </div>
                    <div className="space-y-4 pt-10 border-t border-black/5">
                       <div className="flex flex-wrap justify-between items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black">
                          <span>Contribution Pulse</span>
                          <span className="text-emerald-500 whitespace-nowrap">Stability Optimal</span>
                       </div>
                       <div className="flex gap-1.5 h-16 items-end">
                          {weeklyData?.slice(-10).map((w, i) => (
                            <div 
                              key={i} 
                              style={{ height: `${Math.max(15, Math.min(100, (w / (Math.max(...weeklyData, 1) / 100))))}%` }}
                              className="flex-1 bg-black shadow-sm rounded-full opacity-10 hover:opacity-100 transition-all"
                            />
                          ))}
                       </div>
                    </div>
                 </div>
            </SpotlightCard>

            <SpotlightCard className="p-10 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] group overflow-hidden min-h-[480px] flex flex-col justify-between">
                <div className="flex items-center justify-between relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.6em] text-black/30">Asset Index</p>
                   <Star size={20} className="text-amber-500 fill-amber-500" />
                </div>
                <div className="space-y-10 relative z-10 w-full">
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Technical Assets</span>
                      <div className="text-5xl md:text-6xl font-black tabular-nums text-black leading-none break-all">{profile.totalStars}</div>
                      <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">Verified Stars</span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black">
                         <span>Global Repositories</span>
                         <span className="text-black/40">{profile.totalRepos || profile.repos?.length}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/5 border border-black/5 flex justify-between items-center">
                         <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Growth Rate</span>
                            <div className="text-lg font-black text-emerald-500">+{profile.growthPulse}%</div>
                         </div>
                         <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${Math.min(100, profile.growthPulse)}%` }}
                            />
                         </div>
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-black group-hover:scale-110 transition-transform duration-1000">
                    <Github size={180} />
                </div>
            </SpotlightCard>
        </section>

        <section className="space-y-16">
            <div className="flex items-end justify-between px-6 border-b border-black/5 pb-10">
               <div className="space-y-3 text-black">
                  <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary">Development Fleet</p>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Verified <span className="text-black/10 font-light italic">Fleet</span></h2>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {repos.slice(0, 9).map((repo, i) => (
                    <motion.div
                      key={repo.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <SpotlightCard className="group p-10 h-full flex flex-col justify-between space-y-12 border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3.5rem] hover:shadow-2xl transition-all relative overflow-hidden">
                        <DeploymentBadge url={repo.homepage} />
                        
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                               <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                  <Github size={20} className="text-black group-hover:rotate-12 transition-transform" />
                               </div>
                               <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 text-black text-[12px] font-black shadow-sm">
                                  <Star size={14} className="text-amber-500 fill-amber-500" />
                                  {repo.stars}
                               </div>
                            </div>

                            <div className="space-y-3">
                               <h3 className="text-2xl font-black uppercase tracking-tight text-black break-words leading-tight truncate">{repo.name}</h3>
                               <p className="text-black/40 text-base font-medium line-clamp-2 italic">
                                  &ldquo;{repo.description || "Active production repository summary."}&rdquo;
                               </p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="flex flex-wrap gap-2">
                               {repo.repositoryTopics?.nodes?.slice(0, 3).map((topic: any) => (
                                 <span key={topic.topic.name} className="px-4 py-2 bg-black opacity-5 group-hover:opacity-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-black">
                                    {topic.topic.name}
                                 </span>
                               ))}
                            </div>

                            <div className="flex items-center gap-4">
                               <a 
                                 href={repo.link}
                                 target="_blank"
                                 className="flex-1 flex items-center justify-center gap-3 h-16 rounded-2xl border-2 border-black/5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                               >
                                 <Github size={16} /> Repository
                               </a>
                               {repo.homepage && (
                                 <a
                                   href={repo.homepage}
                                   target="_blank"
                                   className="flex-1 flex items-center justify-center gap-3 h-16 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                                 >
                                   <Rocket size={16} className="text-primary" /> Live Demo
                                 </a>
                               )}
                            </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                ))}
            </div>
        </section>
      </main>

      <IntelligenceTerminal />

      <footer className="py-32 text-center border-t border-black/5 bg-white">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-5 text-black italic">PulseBoard Identity Verified</p>
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

function ReputationCard({ username, avatarUrl, totalStars, setShowReputation }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl"
      onClick={() => setShowReputation(false)}
    >
      <div className="w-full max-w-lg bg-white p-12 rounded-[4rem] shadow-2xl space-y-10 text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setShowReputation(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black hover:text-white transition-all flex items-center justify-center"
        >
           <Zap size={16} />
        </button>
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary">Identity Verified</p>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Ready for Sharing</h2>
        </div>
        <div className="w-32 h-32 rounded-[3.5rem] overflow-hidden border-4 border-background shadow-[0_30px_60px_rgba(0,0,0,0.15)] mx-auto">
           <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4">
           <p className="text-[12px] font-bold uppercase tracking-widest opacity-40 text-black">GitHub Reference</p>
           <p className="text-2xl font-black text-black">@{username}</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5 flex justify-between items-center text-black">
           <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 text-black">Total Impact</p>
              <p className="text-2xl font-black">{totalStars} Verified Stars</p>
           </div>
           <Github size={30} className="opacity-10" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20 text-black">Official Platform Verification</p>
      </div>
    </motion.div>
  );
}
