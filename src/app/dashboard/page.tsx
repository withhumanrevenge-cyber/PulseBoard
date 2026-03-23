"use client";

import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Activity, Star, GitCommit, Code, LayoutDashboard, Share2, LogOut, RefreshCcw, AlertCircle, ExternalLink, Zap, Github, ArrowRight, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGitHubStats, GitHubMetrics } from "@/app/actions/github";
import { Sparkline } from "@/components/sparkline";

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
  const [copied, setCopied] = useState(false);

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
    { label: "Total Stars", value: data?.totalStars?.toLocaleString() ?? "N/A", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pulse Contributions", value: data?.contributionCount?.toLocaleString() ?? "0", icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Top Tech", value: data?.topLanguage ?? "...", icon: Code, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pulse Badge", value: "Active", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
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
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
               onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${user?.username || user?.id}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
               }}
               className="group flex items-center gap-3 px-8 py-5 h-full glass border hover:bg-secondary transition-all active:scale-95 rounded-full font-bold relative min-w-[200px] justify-center"
            >
              <Share2 className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span>Copy Pulse Link</span>
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl z-20 whitespace-nowrap"
                  >
                    Pulse Board Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <Link
              href={`/u/${user?.username || user?.id}`}
              target="_blank"
              className="group flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
          {cards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden group p-10 rounded-[3rem] bg-secondary/5 border border-white/5 hover:border-primary/40 transition-all duration-700 min-h-[16rem] flex flex-col justify-between backdrop-blur-xl"
            >
              <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-1000 bg-current ${stat.color}`} />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{stat.label}</span>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} glass border-white/5 transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="relative z-10 mt-4 mb-4">
                <div className={`font-black tracking-tighter leading-[0.9] break-words ${
                    stat.value.length > 14 ? 'text-xl' :
                    stat.value.length > 9 ? 'text-3xl' :
                    'text-5xl'
                }`}>
                  {loading ? (
                    <div className="w-24 h-12 bg-muted/20 animate-pulse rounded-2xl" />
                  ) : stat.value}
                </div>
                {!loading && (
                    <p className="mt-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {stat.label.includes("Tech") ? "Primary Stack" : "Project Velocity"}
                    </p>
                )}
              </div>

              {!loading && (
                 <div className="relative z-10 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Sparkline 
                        color={stat.color === "text-amber-500" ? "#f59e0b" : stat.color === "text-emerald-500" ? "#10b981" : stat.color === "text-blue-500" ? "#3b82f6" : "#a855f7"} 
                        data={stat.label === "Total Stars" ? [5, 8, 12, 10, 18, 22, 28] : [100, 120, 90, 150, 200]}
                        width={180}
                        height={35}
                    />
                 </div>
              )}

              <div className="absolute -bottom-16 -right-16 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-1000 rotate-12 -z-0">
                <stat.icon size={220} />
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
            <div className="p-12 rounded-[3.5rem] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 border border-white/5 flex flex-col justify-between gap-10 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 text-primary/5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Zap size={180} />
                </div>
                <div className="space-y-4 max-w-xl relative z-10">
                    <h2 className="text-4xl font-black tracking-tight leading-none">Unlock the MRR Pulse</h2>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Ready to show your growth? Connect Stripe to display your live MRR velocity with currency localization.
                    </p>
                </div>
                <button className="px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 relative z-10 w-fit">
                    Connect Stripe
                </button>
            </div>

            <div className="p-12 rounded-[3.5rem] bg-secondary/5 border border-white/5 flex flex-col justify-between gap-10 group overflow-hidden relative backdrop-blur-xl">
                <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black tracking-tight leading-none">Reputation Control</h2>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Manage your public visibility. Toggling these hides your metrics from the global directory and API.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    {[
                      { label: "Hide Star Counts", icon: Star },
                      { label: "Hide Contributions", icon: GitCommit },
                      { label: "Collaboration Mode", icon: Shield },
                    ].map(pref => (
                      <button 
                        key={pref.label} 
                        className="flex items-center justify-between p-5 rounded-2xl glass border-primary/10 hover:border-primary/40 transition-all font-bold group"
                      >
                        <div className="flex items-center gap-3">
                            <pref.icon className="w-4 h-4 text-primary" />
                            <span className="text-xs">{pref.label}</span>
                        </div>
                        <div className="w-8 h-4 rounded-full bg-primary/20 relative">
                             <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary" />
                        </div>
                      </button>
                    ))}
                </div>
            </div>
        </motion.div>

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
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col justify-between p-8 rounded-[2rem] bg-secondary/5 border border-white/5 hover:border-primary/40 hover:bg-secondary/10 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-1000">
                    <Github size={120} />
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-start gap-4 mb-6">
                    <div className="space-y-1">
                      <span className="font-black text-2xl group-hover:text-primary transition-colors tracking-tight block">
                        {repo.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         Updated {repo.updated}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/10 group-hover:bg-amber-500/10 transition-colors">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-sm">{repo.stars.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    {repo.language && (
                      <span className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary">
                        {repo.language}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.a>
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

