"use client";

import { useUser, SignOutButton, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Activity, Star, GitCommit, Code, Share2, LogOut, RefreshCcw, ExternalLink, Github, ArrowRight, Shield, Settings, X, User, Key, ChevronRight, ChevronLeft, ShieldAlert, Rocket, GitBranch, Zap, Twitter, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { getGitHubStats, GitHubMetrics } from "@/app/actions/github";
import { getSettings } from "@/app/actions/privacy";
import { Sparkline } from "@/components/sparkline";
import { useBot } from "@/components/bot-context";
import { DashboardSkeleton } from "@/components/skeletons";
import Image from "next/image";

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

type UserSettings = {
  hide_stars: boolean;
  hide_contributions: boolean;
  is_open_to_build: boolean;
  bio: string;
  linkedin: string;
  twitter: string;
};

export default function DashboardPage() {
  const { openUserProfile } = useClerk();
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'main' | 'account'>('main');
  const [settings, setSettings] = useState<UserSettings>({
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
        if (s) setSettings(s as UserSettings);
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
  const handleSaveSettings = async (newSettings: UserSettings) => {
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
    { label: "Active Streak", value: `${data?.streak ?? 0} Days`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Contributions", value: data?.contributionCount?.toLocaleString() ?? "0", icon: GitCommit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Identity Status", value: "Verified", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const { setIsLoading } = useBot();

  const toggleSetting = (key: keyof UserSettings) => {
    handleSaveSettings({ ...settings, [key]: !settings[key] });
  };

  const privacyOptions: Array<{ label: string; key: keyof UserSettings; icon: typeof Star }> = [
    { label: "Hide stars", key: "hide_stars", icon: Star },
    { label: "Hide contributions", key: "hide_contributions", icon: GitCommit },
    { label: "Open to opportunities", key: "is_open_to_build", icon: Activity },
  ];

  useEffect(() => {
    if (!isLoaded || loading) setIsLoading(true);
    else setIsLoading(false);
    return () => setIsLoading(false);
  }, [isLoaded, loading, setIsLoading]);

  if (!isLoaded || loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen flex flex-col selection:bg-muted bg-background text-foreground">
      <div className="fixed top-20 right-8 z-[60] flex items-center gap-3">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-md border border-border bg-card hover:bg-muted transition-all"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-24">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 text-left">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sync active
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Real-time activity and contribution metrics from your public GitHub profile.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-6 py-3 border border-border bg-card hover:bg-muted transition-all active:scale-95 rounded-md font-medium text-sm disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 text-muted-foreground ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync data'}
            </button>
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? `${window.location.origin}/u/${user?.username || user?.id}` : "";
                if (url) navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:opacity-90 transition-all active:scale-95 rounded-md font-medium text-sm relative"
            >
              <Share2 className="w-4 h-4 opacity-70" />
              Copy profile link
              <AnimatePresence>
                {copied && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[10px] font-medium rounded-md uppercase tracking-widest shadow-xl">
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="p-8 rounded-xl bg-card border border-border h-48 flex flex-col justify-between spatial-card">
                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                      <div className={`p-2 rounded-md ${stat.bg} ${stat.color} border border-border/5`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-4xl font-semibold tracking-tight leading-none">
                        {loading ? <div className="w-20 h-8 bg-muted animate-pulse rounded" /> : stat.value}
                      </div>
                      {data?.weeklyContributions && (stat.label === "Stars Earned" || stat.label === "Contributions") && (
                        <div className="pb-1 opacity-50">
                           <Sparkline 
                            data={data.weeklyContributions} 
                            color={stat.color.replace('text-', '').split('-')[0] === 'emerald' ? '#10b981' : '#f59e0b'} 
                            width={80} 
                            height={24} 
                           />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group h-full">
          <div className="p-8 rounded-xl bg-card border border-border overflow-hidden text-left spatial-card">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground">
                  <Code className="w-4 h-4" />
                  Tech stack
                </div>
                <h3 className="text-3xl font-semibold tracking-tight">Language mix</h3>
                <p className="text-muted-foreground text-sm font-medium max-w-sm leading-relaxed">Breakdown of contributions by language across recent activity.</p>
              </div>
              
              <div className="flex-[2] w-full flex flex-col gap-8">
                <div className="h-3 w-full flex rounded-full overflow-hidden bg-muted border border-border">
                  {data?.languageMap?.map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ backgroundColor: lang.color }}
                      className="h-full"
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {data?.languageMap?.map((lang) => (
                     <div key={lang.name} className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                         <span className="text-xs font-medium text-muted-foreground">{lang.name}</span>
                       </div>
                       <span className="text-xl font-semibold tracking-tight">{lang.percentage}%</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-border text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground text-xs font-medium uppercase tracking-widest">
                    <GitBranch className="w-4 h-4" />
                    Recent activity
                  </div>
                  <h2 className="text-4xl font-semibold tracking-tighter">Recent repositories</h2>
                </div>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
              {data?.recentRepos?.map((repo, i) => (
                  <motion.div key={repo.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative">
                    <div className="p-6 rounded-xl bg-card border border-border h-72 flex flex-col justify-between text-left relative z-10 spatial-card hover:border-foreground/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight truncate max-w-[150px]">
                              {repo.name}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/5 text-amber-500 border border-amber-500/10">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-medium">{repo.stars}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-foreground/20" />
                            <span className="text-xs font-medium text-muted-foreground">{repo.language || 'Code'}</span>
                        </div>
                      </div>
 
                      <div className="flex flex-col gap-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                             <span className="text-xs font-medium text-muted-foreground">{repo.updated}</span>
                             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <a 
                              href={repo.url} 
                              target="_blank" 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-foreground text-xs font-medium border border-border hover:bg-muted/80 transition-all"
                            >
                              <Github className="w-3.5 h-3.5" />
                              Registry
                            </a>
                            {repo.homepage && (
                              <a 
                                href={repo.homepage} 
                                target="_blank" 
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition-all shadow-sm"
                              >
                                <Rocket className="w-3.5 h-3.5" />
                                Deployed
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
 
      <footer className="py-20 text-center border-t border-border"><p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-20">Thanks for your work</p></footer>

      <AnimatePresence>
        {showFloating && (
          <motion.div key="floating-dock" initial={{ y: 100, x: "-50%", opacity: 0 }} animate={{ y: 0, x: "-50%", opacity: 1 }} exit={{ y: 100, x: "-50%", opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 glass-card p-3 rounded-full border border-border/40 shadow-2xl backdrop-blur-xl">
            <button onClick={handleSync} disabled={syncing} className="p-4 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all text-primary"><RefreshCcw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} /></button>
            <div className="h-8 w-px bg-border/60" />
            <button onClick={() => window.open(`/u/${user?.username || user?.id}`, '_blank')} className="px-8 py-4 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all outline-none"><Rocket className="w-4 h-4" />Open profile</button>
            <div className="h-8 w-px bg-border/60" /><button onClick={() => setIsSettingsOpen(true)} className="p-4 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all"><Settings className="w-5 h-5 text-muted-foreground" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div key="settings-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-background/40 z-[100]" />
            <motion.div key="settings-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary/10 border-l border-border/40 backdrop-blur-2xl z-[101] p-10 flex flex-col shadow-2xl overflow-y-auto">
               <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActivePanel('main')} className={`p-2 rounded-xl bg-primary/10 text-primary transition-all ${activePanel === 'main' ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:bg-primary/20'}`}><ChevronLeft className="w-4 h-4" /></button>
                        <h2 className="text-3xl font-bold tracking-tight">{activePanel === 'main' ? <>Settings</> : 'Security'}</h2>
                    </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-3 rounded-full hover:bg-foreground/5 transition-colors border border-border/40 outline-none"><X size={18} /></button>
               </div>

               <div className="relative flex-1">
                 <AnimatePresence mode="wait">
                   {activePanel === 'main' ? (
                     <motion.div key="main-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-16">
                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Bio</label>
                            <textarea value={settings.bio || ""} onChange={(e) => handleSaveSettings({ ...settings, bio: e.target.value })} placeholder="Short bio" className="w-full bg-muted/40 border border-border/50 rounded-[1.5rem] p-6 text-sm font-normal outline-none focus:border-primary/50 transition-all h-28 resize-none shadow-inner" />
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Social links</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="relative group"><Twitter className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /><input type="text" placeholder="@twitter" value={settings.twitter || ""} onChange={(e) => handleSaveSettings({ ...settings, twitter: e.target.value })} className="w-full bg-muted/40 border border-border/50 rounded-full py-3.5 pl-12 pr-6 text-[11px] font-bold outline-none focus:border-primary/50 transition-all" /></div>
                                <div className="relative group"><Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" /><input type="text" placeholder="linkedin-id" value={settings.linkedin || ""} onChange={(e) => handleSaveSettings({ ...settings, linkedin: e.target.value })} className="w-full bg-muted/40 border border-border/50 rounded-full py-3.5 pl-12 pr-6 text-[11px] font-bold outline-none focus:border-primary/50 transition-all" /></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Privacy</label>
                            <div className="space-y-3">
                                {privacyOptions.map((pref) => (
                                  <button key={pref.key} onClick={() => toggleSetting(pref.key)} className="w-full flex items-center justify-between p-6 rounded-[2rem] glass border-border/60 hover:bg-muted/30 transition-all group scale-95 hover:scale-100 outline-none">
                                    <div className="flex items-center gap-3"><pref.icon className="w-4 h-4 text-primary" /><span className="text-[11px] font-bold uppercase tracking-widest">{pref.label}</span></div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${ settings[pref.key] && pref.key !== "is_open_to_build" ? "bg-primary/20" : "bg-muted/40"}`}><div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${ settings[pref.key] ? "left-6 bg-primary" : "left-1 bg-muted-foreground"}`} /></div>
                                  </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => setActivePanel('account')} className="w-full p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center justify-between group hover:bg-primary/10 transition-all outline-none">
                            <div className="flex items-center gap-3"><div className="p-3 rounded-2xl bg-primary/10 text-primary"><User className="w-5 h-5" /></div><div className="text-left"><p className="font-bold uppercase tracking-widest text-[10px]">Account</p><p className="text-[9px] text-muted-foreground uppercase opacity-60">Profile and sign-in</p></div></div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                        </button>
                     </motion.div>
                   ) : (
                     <motion.div key="account-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12 pb-16">
                        <div className="p-8 rounded-[3rem] bg-muted/40 border border-border/50 flex flex-col items-center text-center gap-6">
                          {user?.imageUrl ? (
                            <Image src={user.imageUrl} width={96} height={96} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-primary/10 shadow-2xl" alt="Avatar" />
                          ) : (
                            <div className="w-24 h-24 rounded-[2rem] bg-muted ring-4 ring-primary/10 shadow-2xl" />
                          )}
                          <div>
                            <h3 className="text-xl font-bold tracking-tight uppercase">{user?.fullName || user?.username}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{user?.primaryEmailAddress?.emailAddress}</p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest"><Key className="w-3.5 h-3.5" />Verified account</div>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => openUserProfile()} className="w-full p-6 rounded-[2rem] glass border-border/50 hover:bg-muted/30 transition-all flex items-center justify-between group outline-none"><div className="flex items-center gap-4"><ShieldAlert className="w-4 h-4 text-muted-foreground group-hover:text-primary" /><span className="text-[10px] font-bold uppercase tracking-widest">Account security</span></div><ExternalLink className="w-3.5 h-3.5 opacity-30" /></button>
                            <SignOutButton><button className="w-full p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 group outline-none"><LogOut className="w-4 h-4" />Sign out</button></SignOutButton>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               <div className="mt-auto pt-8 border-t border-border/40 shrink-0 text-center opacity-10"><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[1em]">PROFILE</p></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
