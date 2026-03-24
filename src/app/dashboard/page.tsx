"use client";

import { useUser, SignOutButton, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Activity, Star, GitCommit, Code, LayoutDashboard, Share2, LogOut, RefreshCcw, AlertCircle, ExternalLink, Github, ArrowRight, Shield, Settings, X, Globe, User, MessageSquare, Key, ChevronRight, ChevronLeft, LogIn, ShieldAlert, Rocket, GitBranch, Zap, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGitHubStats, GitHubMetrics } from "@/app/actions/github";
import { getSettings } from "@/app/actions/privacy";
import { Sparkline } from "@/components/sparkline";
import { SpotlightCard } from "@/components/motion-kit";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  },
};

export default function DashboardPage() {
  const { signOut, openUserProfile } = useClerk();
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'main' | 'account'>('main');
  const [settings, setSettings] = useState({
    hide_stars: false,
    hide_contributions: false,
    is_open_to_build: true,
    bio: "",
    linkedin: "",
    twitter: ""
  });

  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function load() {
      if (!isLoaded || !user) return;
      try {
        setLoading(true);
        const [stats, s] = await Promise.all([getGitHubStats(), getSettings()]);
        if (stats) setData(stats);
        if (s) setSettings(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isLoaded]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await getGitHubStats();
      if (res) setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = async (newSettings: any) => {
    setSettings(newSettings);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const cards = [
    { label: "Stars Earned", value: data?.totalStars?.toLocaleString() ?? "N/A", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Shipping Velocity", value: `${data?.streak ?? 0} Days`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Pulse Contributions", value: data?.contributionCount?.toLocaleString() ?? "0", icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Identity Protocol", value: "Verified", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (!isLoaded || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfdfd] text-foreground selection:bg-primary/20">
      <div className="flex flex-col items-center">
        <div className="relative mb-32">
          <div className="absolute inset-0 bg-black/5 blur-[120px] rounded-full" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            className="relative w-64 h-64 flex items-center justify-center"
          >
            <div className="absolute inset-0 border-[2px] border-black/5 rounded-full" />
            <motion.div 
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-[-20px] border border-black/5 rounded-full" 
            />
            <motion.div 
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-8 border border-black/[0.08] rounded-full" 
            />
            
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.98, 1, 0.98] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Activity className="w-20 h-20 text-black stroke-[1.5px]" />
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center space-y-12 w-full text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] font-black uppercase tracking-[1.4rem] text-black w-full"
            style={{ marginRight: '-1.4rem' }} 
          >
            Synchronizing Pulse
          </motion.p>
          
          <div className="w-48 h-[1px] bg-black/[0.08] relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
               className="absolute inset-y-0 w-1/2 bg-black/60"
             />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5 text-primary">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">PulseBoard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`/u/${user?.username || user?.id}`, '_blank')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background hover:scale-105 active:scale-95 transition-all text-[11px] font-bold uppercase tracking-widest shadow-xl"
          >
            <Rocket className="w-4 h-4" />
            Launch Pulse
          </button>
          
          <div className="h-4 w-px bg-border/50 mx-1" />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-full glass hover:bg-secondary/80 transition-all font-bold group"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-32 space-y-32">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pulse Active
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]">
              Welcome to <span className="font-light italic opacity-40">your</span> <br />
              <span className="text-gradient">Console</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-normal max-w-lg leading-relaxed">
              Real-time synchronization of your development frequency. Reputations are built by shipping.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="group flex items-center gap-3 px-10 py-5 h-full glass border border-white/10 hover:bg-secondary transition-all active:scale-95 rounded-full font-bold relative min-w-[220px] justify-center disabled:opacity-50"
            >
              <RefreshCcw className={`w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity ${syncing ? 'animate-spin' : ''}`} />
              <span className="text-[11px] uppercase tracking-widest">{syncing ? 'Syncing...' : 'Sync Registry'}</span>
            </button>
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? `${window.location.origin}/u/${user?.username || user?.id}` : "";
                if (url) navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="group flex items-center gap-3 px-10 py-5 h-full bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 rounded-full font-bold relative min-w-[220px] justify-center"
            >
              <Share2 className="w-5 h-5 opacity-70" />
              <span className="text-[11px] uppercase tracking-widest">Copy Protocol Link</span>
              <AnimatePresence>
                {copied && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest pointer-events-none shadow-xl">
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <SpotlightCard className="p-10 rounded-[3.5rem] glass border border-white/5 h-64 flex flex-col justify-between">
                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">{stat.label}</span>
                      <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} border border-white/5 transition-transform group-hover:rotate-12`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold tracking-tight">
                      {loading ? <div className="w-24 h-12 bg-muted/20 animate-pulse rounded-2xl" /> : stat.value}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group h-full">
          <SpotlightCard className="p-12 rounded-[4rem] glass border border-white/10 overflow-hidden text-left">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                  <Code className="w-4 h-4" />
                  Tech Stack Identity
                </div>
                <h3 className="text-5xl font-bold tracking-tight">Language <br /> <span className="font-light italic opacity-40">Frequency</span></h3>
                <p className="text-muted-foreground text-xl font-normal max-w-sm leading-relaxed">Deep analysis of your verified registry contributions across different architectural patterns.</p>
              </div>
              
              <div className="flex-[2] w-full flex flex-col gap-10">
                <div className="h-4 w-full flex rounded-full overflow-hidden shadow-inner bg-secondary/10 border border-white/5">
                  {data?.languageMap?.map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ backgroundColor: lang.color }}
                      className="h-full"
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   {data?.languageMap?.map((lang) => (
                     <div key={lang.name} className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                       </div>
                       <span className="text-[1.8rem] font-bold tracking-tight leading-none">{lang.percentage}%</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-2 border-white/5 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                    <GitBranch className="w-4.5 h-4.5" />
                    Verified Output
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase">Recent <span className="font-light italic opacity-40">Artifacts</span></h2>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/20">Your most influential nodes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-40">
              {data?.recentRepos?.map((repo, i) => (
                  <motion.div key={repo.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative">
                    <SpotlightCard className="p-8 rounded-[3rem] glass border border-white/5 h-80 flex flex-col justify-between text-left relative z-10">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold tracking-tight uppercase truncate max-w-[150px]">
                              {repo.name}
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/10">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold">{repo.stars}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{repo.language || 'Code'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                          <div className="flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity mb-2">
                             <span className="text-[10px] font-bold uppercase tracking-widest">{repo.updated}</span>
                             <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <a 
                              href={repo.url} 
                              target="_blank" 
                              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                            >
                              <Github className="w-3.5 h-3.5" />
                              Registry
                            </a>
                            {repo.homepage && (
                              <a 
                                href={repo.homepage} 
                                target="_blank" 
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                              >
                                <Rocket className="w-3.5 h-3.5" />
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

      <footer className="py-32 text-center border-t border-white/5"><p className="text-[10px] font-bold uppercase tracking-[1em] opacity-10">Thanks for Shipping</p></footer>

      <AnimatePresence>
        {showFloating && (
          <motion.div key="floating-dock" initial={{ y: 100, x: "-50%", opacity: 0 }} animate={{ y: 0, x: "-50%", opacity: 1 }} exit={{ y: 100, x: "-50%", opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 glass-card p-3 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl">
            <button onClick={handleSync} disabled={syncing} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-primary"><RefreshCcw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} /></button>
            <div className="h-8 w-px bg-white/10" />
            <button onClick={() => window.open(`/u/${user?.username || user?.id}`, '_blank')} className="px-8 py-4 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all outline-none"><Rocket className="w-4 h-4" />Live Pulse</button>
            <div className="h-8 w-px bg-white/10" /><button onClick={() => setIsSettingsOpen(true)} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all"><Settings className="w-5 h-5 text-muted-foreground" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div key="settings-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-background/40 z-[100]" />
            <motion.div key="settings-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary/10 border-l border-white/10 backdrop-blur-2xl z-[101] p-10 flex flex-col shadow-2xl overflow-y-auto">
               <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActivePanel('main')} className={`p-2 rounded-xl bg-primary/10 text-primary transition-all ${activePanel === 'main' ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:bg-primary/20'}`}><ChevronLeft className="w-4 h-4" /></button>
                        <h2 className="text-3xl font-bold tracking-tight">{activePanel === 'main' ? <>Configuration</> : 'Security'}</h2>
                    </div>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-3 rounded-full hover:bg-white/5 transition-colors border border-white/5 outline-none"><X size={18} /></button>
               </div>

               <div className="relative flex-1">
                 <AnimatePresence mode="wait">
                   {activePanel === 'main' ? (
                     <motion.div key="main-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-16">
                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Identity Biography</label>
                            <textarea value={settings.bio || ""} onChange={(e) => handleSaveSettings({ ...settings, bio: e.target.value })} placeholder="Describe your frequency..." className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-sm font-normal outline-none focus:border-primary/50 transition-all h-28 resize-none shadow-inner" />
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Social Frequency</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="relative group"><Twitter className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /><input type="text" placeholder="@twitter" value={settings.twitter || ""} onChange={(e) => handleSaveSettings({ ...settings, twitter: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-[11px] font-bold outline-none focus:border-primary/50 transition-all" /></div>
                                <div className="relative group"><Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /><input type="text" placeholder="linkedin-id" value={settings.linkedin || ""} onChange={(e) => handleSaveSettings({ ...settings, linkedin: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-[11px] font-bold outline-none focus:border-primary/50 transition-all" /></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Reputation Privacy</label>
                            <div className="space-y-3">
                                {[
                                    { label: "Stealth Stars", key: "hide_stars", icon: Star },
                                    { label: "Private Registry", key: "hide_contributions", icon: GitCommit },
                                    { label: "Collab Mode", key: "is_open_to_build", icon: Activity },
                                ].map((pref) => (
                                    <button key={pref.key} onClick={() => handleSaveSettings({ ...settings, [pref.key]: !(settings as any)[pref.key] })} className="w-full flex items-center justify-between p-6 rounded-[2rem] glass border-white/5 hover:bg-white/5 transition-all group scale-95 hover:scale-100 outline-none">
                                        <div className="flex items-center gap-3"><pref.icon className="w-4 h-4 text-primary" /><span className="text-[11px] font-bold uppercase tracking-widest">{pref.label}</span></div>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${ (settings as any)[pref.key] && pref.key !== 'is_open_to_build' ? 'bg-primary/20' : 'bg-white/5'}`}><div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${ (settings as any)[pref.key] ? 'left-6 bg-primary' : 'left-1 bg-muted-foreground'}`} /></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => setActivePanel('account')} className="w-full p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center justify-between group hover:bg-primary/10 transition-all outline-none">
                            <div className="flex items-center gap-3"><div className="p-3 rounded-2xl bg-primary/10 text-primary"><User className="w-5 h-5" /></div><div className="text-left"><p className="font-bold uppercase tracking-widest text-[10px]">Session Hub</p><p className="text-[9px] text-muted-foreground uppercase opacity-60">Identity & Logins</p></div></div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </button>
                     </motion.div>
                   ) : (
                     <motion.div key="account-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12 pb-16">
                        <div className="p-8 rounded-[3rem] bg-white/5 border border-white/5 flex flex-col items-center text-center gap-6"><img src={user?.imageUrl} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-primary/10 shadow-2xl" alt="Avatar" /><div><h3 className="text-xl font-bold tracking-tight uppercase">{user?.fullName || user?.username}</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{user?.primaryEmailAddress?.emailAddress}</p></div><div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest"><Key className="w-3.5 h-3.5" />Pulse ID Verified</div></div>
                        <div className="space-y-3">
                            <button onClick={() => openUserProfile()} className="w-full p-6 rounded-[2rem] glass border-white/5 hover:bg-white/5 transition-all flex items-center justify-between group outline-none"><div className="flex items-center gap-4"><ShieldAlert className="w-4 h-4 text-muted-foreground group-hover:text-primary" /><span className="text-[10px] font-bold uppercase tracking-widest">Security Dashboard</span></div><ExternalLink className="w-3.5 h-3.5 opacity-30" /></button>
                            <SignOutButton><button className="w-full p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 group outline-none"><LogOut className="w-4 h-4" />End Session</button></SignOutButton>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               <div className="mt-auto pt-8 border-t border-white/5 shrink-0 text-center opacity-10"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[1em]">REPUTATION NODE</p></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
