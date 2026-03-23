"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Code, Github, BadgeCheck, Zap } from "lucide-react";

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
  const isVerified = profile.contributions > 100;

  const cards = [
    { 
      label: "Stars Earned", 
      value: privacy.hideStars ? "—" : profile.totalStars.toLocaleString(), 
      icon: Star, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10" 
    },
    { 
      label: "Contributions", 
      value: privacy.hideContributions ? "—" : profile.contributions.toLocaleString(), 
      icon: GitCommit, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10" 
    },
    { 
      label: "Top Tech", 
      value: privacy.hideTech ? "Private" : profile.topLanguage, 
      icon: Code, 
      color: "text-cyan-500", 
      bg: "bg-cyan-500/10" 
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-[100%] blur-[120px] -z-10" />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-[6px] border-background shadow-2xl ring-2 ring-primary/10 transition-transform group-hover:scale-105 duration-500">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || username} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
              />
            </div>
            {isVerified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-primary text-primary-foreground border-[6px] border-background shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform"
                title="Consistency Guard Verified"
              >
                <BadgeCheck className="w-6 h-6" />
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-6xl font-black tracking-tighter leading-none">
                  {profile.name || username}
                </h1>
                {isVerified && (
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Verified
                    </div>
                )}
              </div>
              <p className="text-sm font-black text-muted-foreground/30 uppercase tracking-[0.6em]">
                {username}
              </p>
            </div>
            
            {profile.bio && (
              <p className="text-xl text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed italic border-l-2 border-primary/10 pl-6">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                className="flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/5"
              >
                <Github className="w-4 h-4" />
                Analyze Stack
              </a>
              
              {!privacy.hideTech && (
                <div className="px-6 py-5 glass border border-emerald-500/20 text-emerald-500 rounded-full flex items-center gap-2 shadow-2xl shadow-emerald-500/5 cursor-default hover:bg-emerald-500/5 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Open to build</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
            >
              <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-10 ${card.bg}`} />
              <div className="relative z-10 flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{card.label}</span>
                <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                  <card.icon className="w-5 h-5 flex-shrink-0" />
                </div>
              </div>
              <div className="relative z-10 text-4xl font-black tracking-tighter">
                {card.value}
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    Verified Repos
                </h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                    Showing latest public pulses
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-40">
                {profile.repos.map((repo, i) => (
                    <motion.a
                        key={repo.name}
                        href={repo.link}
                        target="_blank"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                        className="group p-8 rounded-[3rem] glass border border-white/5 hover:border-primary/20 hover:scale-[1.02] transition-all duration-500"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black tracking-tight">{repo.name}</h3>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/10">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-black">{repo.stars}</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm line-clamp-2 mb-6">
                            {repo.description || "Experimental builder rep pulse."}
                        </p>
                        <div className="flex items-center gap-2">
                            {repo.language && (
                                <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    {repo.language}
                                </span>
                            )}
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10">Thanks for Shipping</p>
      </footer>
    </div>
  );
}
