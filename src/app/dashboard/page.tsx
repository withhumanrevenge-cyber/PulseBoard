"use client";

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Activity, Star, GitCommit, Code, LayoutDashboard, Share2, LogOut, RefreshCcw, AlertCircle, ExternalLink, Zap, Github, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGitHubStats, GitHubMetrics } from "@/app/actions/github";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        const res = await getGitHubStats();
        if (res) {
          setData(res);
        } else {
          setError("GitHub connection required. Please verify your account link.");
        }
      } catch (err) {
        setError("Failed to sync metrics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, isLoaded]);

  const cards = [
    { label: "Total Stars", value: data?.totalStars.toLocaleString() ?? "0", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Commit Velocity", value: data?.commitCount ?? "0", icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Primary Stack", value: data?.topLanguage ?? "...", icon: Code, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Weekly Activity", value: data?.activeDays ?? "0/30", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (!isLoaded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5 text-primary">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-black tracking-tight">PulseBoard</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/user-profile"
            className="p-2.5 rounded-full glass hover:bg-secondary/80 transition-all group"
            title="Settings"
          >
            <Code className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full glass hover:bg-secondary/80 transition-all"
          >
            <Zap className="w-4 h-4 fill-current text-primary/80" />
          </button>
          <div className="h-6 w-px bg-border/50 mx-2" />
          <SignOutButton>
            <button className="flex items-center gap-2 pr-4 pl-2 py-1.5 rounded-full glass hover:bg-destructive shadow-sm hover:text-white transition-all text-xs font-bold leading-none">
              <div className="w-6 h-6 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                <LogOut className="w-3 h-3" />
              </div>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-20">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pulse Active
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
              Welcome to your <br />
              <span className="text-gradient capitalize">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Your public pulse is syncing with your latest source contributions. Transparency is your greatest leverage.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Link
              href={`/u/${user?.username || user?.id}`}
              target="_blank"
              className="group flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Launch Public Board</span>
              <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </section>

        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] glass border-primary/10 bg-primary/[0.02] flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Github size={28} />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl font-bold tracking-tight">Connect your GitHub pulse</h3>
                <p className="text-muted-foreground font-medium max-w-sm">We need to link your account to sync your commit velocity and open source metrics.</p>
              </div>
            </div>
            
            <Link 
              href="/user-profile" 
              className="flex items-center gap-2 px-8 py-4 glass bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center"
            >
              <span>Connect GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
          {cards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 flex flex-col justify-between h-56 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} glass border-white/5`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="text-5xl font-black tracking-tighter">
                  {loading ? (
                    <div className="w-20 h-10 bg-muted/20 animate-pulse rounded-lg" />
                  ) : stat.value}
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12">
                <stat.icon size={200} />
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-1 md:p-1 relative overflow-hidden group"
        >
          <div className="p-8 md:p-12 space-y-12 relative z-10 bg-background/20 rounded-[2.4rem]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  Recent Repositories
                </h2>
                <p className="text-muted-foreground font-medium">Your most active open-source contributions.</p>
              </div>
              {loading && <RefreshCcw size={20} className="animate-spin text-muted-foreground" />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data?.recentRepos.length === 0 && !loading && (
                <div className="col-span-full p-20 text-center glass border-dashed rounded-[2rem]">
                  <p className="text-muted-foreground font-medium">No recent activity detected. Connect repository to track.</p>
                </div>
              )}
              {data?.recentRepos.map((repo, i) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="group flex items-center justify-between p-6 rounded-[1.8rem] glass border-transparent hover:border-primary/20 hover:bg-card/40 transition-all cursor-default"
                >
                  <div className="flex flex-col space-y-2">
                    <span className="font-black text-xl group-hover:text-primary transition-colors tracking-tight">
                      {repo.name}
                    </span>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/5">
                        {repo.language || "OSS"}
                      </span>
                      <span>Update {repo.updated}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass font-black text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {repo.stars.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <footer className="pt-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              THANKS FOR SHIPPING
            </p>
        </footer>
      </main>
    </div>
  );
}

