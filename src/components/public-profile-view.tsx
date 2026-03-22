"use client";

import { motion } from "framer-motion";
import { Star, GitCommit, Code, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";

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
  profile 
}: { 
  username: string; 
  profile: GitHubProfile 
}) {
  const cards = [
    { label: "Stars Earned", value: profile.totalStars.toLocaleString(), icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Contributions", value: profile.contributions.toString(), icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Top Tech", value: profile.topLanguage, icon: Code, color: "text-cyan-500", bg: "bg-cyan-500/10" },
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          {cards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="relative overflow-hidden group p-8 rounded-[2.5rem] bg-secondary/30 border border-border/40 hover:bg-secondary/50 hover:border-primary/20 transition-all h-44 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">{stat.label}</span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-5xl font-black tracking-tighter z-10">{stat.value}</div>
              
              <stat.icon className={`absolute -bottom-6 -right-6 w-36 h-36 opacity-[0.03] ${stat.color} transform group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700`} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.repos.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="group flex flex-col justify-between p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden h-64 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-purple-500/40 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors flex items-center gap-2">
                      {repo.name}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-primary" />
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 text-xs font-black ring-1 ring-border/50">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {(repo.stars ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                    {repo.description || "Experimental repository exploring new technical domains."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full bg-primary/5 text-primary border border-primary/20">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
                
                <a href={repo.link} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label={`View ${repo.name}`}>
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
