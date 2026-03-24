"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, GitCommit, Github, BadgeCheck, Zap, ArrowRight, Activity, Shield, Rocket } from "lucide-react";
import { SpotlightCard } from "./motion-kit";

type GitHubProfile = {
  name: string | null | undefined;
  avatarUrl: string;
  bio: string | null | undefined;
  totalStars: number;
  contributions: number;
  topLanguage: string;
  repos: Array<{
    name: string;
    description: string | null | undefined;
    stars: number | undefined;
    language: string | null | undefined;
    link: string;
    homepage?: string | null;
  }>;
};

export default function PublicProfileView({ 
  username, 
  profile,
  privacy = { hideStars: false, hideContributions: false, hideTech: false }
}: { 
  username: string; 
  profile: GitHubProfile;
  privacy?: { hideStars: boolean; hideContributions: boolean; hideTech: boolean };
}) {
  const isVerified = (profile.contributions ?? 0) > 100;
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { damping: 30, stiffness: 300 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { damping: 30, stiffness: 300 });

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  const stats = [
    { label: "Stars Earned", value: privacy.hideStars ? "—" : (profile.totalStars ?? 0).toLocaleString(), icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pulse Contributions", value: privacy.hideContributions ? "—" : (profile.contributions ?? 0).toLocaleString(), icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Identity Protocol", value: "Verified", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden text-foreground selection:bg-primary/20">
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <section className="flex flex-col items-center text-center space-y-12">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative group cursor-pointer"
          >
            <div className="w-52 h-52 rounded-[4.5rem] overflow-hidden border-[8px] border-background shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-4 ring-primary/5 transition-all duration-700 bg-secondary/20">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || username} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000"
              />
            </div>
            {isVerified && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -bottom-3 -right-3 w-16 h-16 rounded-[1.5rem] bg-primary text-primary-foreground border-4 border-background shadow-2xl flex items-center justify-center translate-z-20"
              >
                <BadgeCheck className="w-8 h-8" />
              </motion.div>
            )}
            <div className="absolute inset-0 rounded-[4.5rem] bg-primary/20 blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
          </motion.div>

          <div className="space-y-6 max-w-4xl flex flex-col items-center">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                {profile.name || username}
              </h1>
              <div className="flex items-center justify-center gap-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
                    Registry <span className="font-light italic opacity-50">@{username}</span>
                  </span>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     Live Tracking
                  </div>
              </div>
            </div>
            
            {profile.bio && (
              <p className="text-xl md:text-2xl text-muted-foreground/60 max-w-2xl font-normal leading-relaxed italic">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                className="group flex items-center gap-4 px-12 py-5 bg-foreground text-background rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Github className="w-5 h-5" />
                Analyze Registry
                <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
              
              {!privacy.hideTech && (
                <div className="px-8 py-5 glass border border-primary/20 text-primary rounded-full flex items-center gap-3 shadow-lg cursor-default">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{profile.topLanguage}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
          {stats.map((stat) => (
            <SpotlightCard
              key={stat.label}
              className="glass p-12 rounded-[4rem] border border-white/5 h-64 flex flex-col justify-between"
            >
              <div className="h-full flex flex-col justify-between relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20">{stat.label}</span>
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border border-white/5`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-5xl font-black tracking-tighter">
                  {stat.value}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </section>

        <section className="mt-48 space-y-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.5em]">
                    <Zap className="w-4 h-4" />
                    Verified Output
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                    Recent <span className="font-light italic opacity-20">Artifacts</span>
                  </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profile.repos.map((repo, i) => (
                    <motion.div
                        key={repo.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                    >
                      <SpotlightCard className="p-10 rounded-[3.5rem] glass border border-white/5 h-[28rem] flex flex-col justify-between relative z-10 group">
                        <div className="space-y-6">
                          <div className="flex items-start justify-between gap-4">
                              <h3 className="text-2xl font-bold tracking-tight uppercase leading-tight group-hover:text-primary transition-colors">
                                {repo.name}
                              </h3>
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/10 shadow-inner shrink-0 mt-1">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-xs font-black">{repo.stars ?? 0}</span>
                              </div>
                          </div>
                          <p className="text-muted-foreground/60 font-normal text-lg leading-relaxed line-clamp-3">
                              {repo.description || "No description provided."}
                          </p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg border border-primary/10 text-[9px] font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {repo.language || "Code"}
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                            </div>

                            <div className="flex items-center gap-3">
                              <a 
                                href={repo.link} 
                                target="_blank" 
                                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl glass border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                              >
                                <Github className="w-4 h-4 opacity-40" />
                                Registry
                              </a>
                              {repo.homepage && (
                                <a 
                                  href={repo.homepage} 
                                  target="_blank" 
                                  className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                >
                                  <Rocket className="w-4 h-4" />
                                  Deployed
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

      <footer className="py-32 text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10">Thanks for Shipping</p>
      </footer>
    </div>
  );
}
