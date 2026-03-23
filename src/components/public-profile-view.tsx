"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Code, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { Sparkline } from "./sparkline";

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
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-[100%] blur-[120px] -z-10" />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-[6px] border-background shadow-2xl ring-2 ring-primary/10 transition-transform group-hover:scale-105 duration-500">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || username} 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 border-[4px] border-background shadow-lg flex items-center justify-center p-2"
            >
              <div className="w-full h-full bg-white rounded-full animate-ping opacity-20" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              {profile.name || `@${username}`}
            </h1>
            {profile.bio && (
              <p className="text-xl text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-foreground text-background font-bold hover:scale-105 transition-all active:scale-95 shadow-xl hover:shadow-primary/20"
            >
              <Github className="w-5 h-5" /> Analyze Stack
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24">
          {cards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden group p-10 rounded-[3rem] bg-secondary/10 border border-white/5 hover:border-primary/30 transition-all duration-700 min-h-[18rem] flex flex-col justify-between backdrop-blur-2xl"
            >
              <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-1000 bg-current ${stat.color}`} />
              
              <div className="flex items-center justify-between z-10 relative">
                <span className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em] opacity-60">{stat.label}</span>
                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 glass border-white/5`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>

              <div className="z-10 relative mt-6 mb-6">
                <div className={`font-black tracking-tighter leading-[0.9] break-words ${
                   stat.value.length > 12 ? 'text-2xl lg:text-3xl' : 
                   stat.value.length > 8 ? 'text-4xl lg:text-5xl' : 
                   'text-6xl lg:text-7xl'
                }`}>
                  {stat.value}
                </div>
                <p className="mt-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                   {stat.label === "Top Tech" ? "Primary Stack" : "Verified Source"}
                </p>
              </div>

              <div className="relative z-10 pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                 <Sparkline 
                    color={stat.color === "text-amber-500" ? "#f59e0b" : stat.color === "text-emerald-500" ? "#10b981" : "#06b6d4"} 
                    data={stat.label === "Stars Earned" ? [2, 5, 3, 8, 12, 10, 15] : [20, 45, 30, 60, 80, 75, 90]}
                    width={200}
                    height={40}
                 />
              </div>
              
              <stat.icon size={220} className={`absolute -bottom-16 -right-16 opacity-[0.02] ${stat.color} group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-1000 rotate-12 -z-0`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight">Source Highlights</h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-border/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {profile.repos.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-secondary/5 border border-white/5 hover:border-primary/40 hover:bg-secondary/10 transition-all duration-700 h-72 overflow-hidden backdrop-blur-md"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 max-w-[70%]">
                      <h3 className="text-3xl font-black group-hover:text-primary transition-colors leading-none tracking-tighter break-words">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Healthy Source</span>
                      </div>
                    </div>

                    <div className="relative group/star flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/5 border border-amber-500/10 group-hover:bg-amber-500/10 transition-all duration-500">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 group-hover/star:scale-110 transition-transform" />
                      <span className="font-black text-sm tracking-tighter">{(repo.stars ?? 0).toLocaleString()}</span>
                      
                      {repo.stars && repo.stars > 0 && (
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-500/20 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed line-clamp-2 font-medium tracking-tight">
                    {repo.description || "Experimental repository exploring new technical domains and architectural patterns."}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4">
                   <div className="flex items-center gap-2">
                    {repo.language && (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/[0.03] border border-foreground/5 text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
                        {repo.language}
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 border border-white/5">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                
                <a href={repo.link} target="_blank" rel="noreferrer" className="absolute inset-0 z-20" aria-label={`View ${repo.name}`}>
                  <span className="sr-only">View Repository</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="py-12 text-center relative z-10 mt-20 border-t border-border/20 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Crafted with PulseBoard</p>
          <Link href="/" className="px-8 py-2.5 rounded-full border border-border hover:bg-foreground hover:text-background transition-all font-black tracking-tighter">
            Build yours
          </Link>
        </div>
      </footer>
    </div>
  );
}
