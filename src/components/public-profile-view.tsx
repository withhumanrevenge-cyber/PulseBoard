"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Github, Rocket, Sword, TrendingUp, Code2, Share2, GitMerge, BadgeCheck, Briefcase, Linkedin, Twitter, Copy, Check, X, EyeOff } from "lucide-react";
import { verifyDeployment } from "@/app/actions/verify-deployment";
import { useEffect, useState } from "react";
import { getWeeklyContributions } from "@/app/actions/github";
import { LanguagePie } from "./language-pie";
import { useComparisonRegistry } from "@/lib/use-comparison";
import { IntelligenceTerminal } from "./intelligence-terminal";
import type { PublicGitHubProfile } from "@/app/actions/public-github";
import type { PublicProfileSettings } from "@/lib/public-settings";
import { DEV_SCORE_MAX } from "@/lib/dev-score";
import { SmartAuthButton } from "./smart-auth-button";
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
  settings: PublicProfileSettings;
}

// Fixed format (not toLocaleDateString): server and browser locales differ
// ("Sep" vs "Sept"), which breaks hydration.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatMonthYear(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export function PublicProfileView({ username, profile, repos, settings }: PublicProfileViewProps) {
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
                {settings.claimed && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400" title="The owner signed in with this GitHub account">
                    <BadgeCheck size={12} /> Claimed
                  </div>
                )}
                {settings.claimed && settings.openToWork && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    <Briefcase size={12} /> Open to opportunities
                  </div>
                )}
              </div>
            </div>

            {(settings.bio || profile.bio) && (
              <p className="max-w-xl mx-auto text-muted-foreground text-lg font-medium leading-relaxed">
                {settings.bio || profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-accent/50 text-foreground border border-border/50 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-2"
              >
                <Github size={14} /> GitHub
              </a>

              {settings.linkedin && (
                <a
                  href={`https://www.linkedin.com/in/${encodeURIComponent(settings.linkedin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 bg-accent/50 text-foreground border border-border/50 rounded-lg hover:bg-accent transition-all flex items-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={`https://x.com/${encodeURIComponent(settings.twitter)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 bg-accent/50 text-foreground border border-border/50 rounded-lg hover:bg-accent transition-all flex items-center"
                  aria-label="X / Twitter"
                >
                  <Twitter size={14} />
                </a>
              )}

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
                       {settings.hideContributions ? (
                         <span className="text-3xl font-bold text-muted-foreground leading-none flex items-center gap-2"><EyeOff size={22} /> Hidden</span>
                       ) : (
                         <span className="text-6xl font-bold text-foreground leading-none tabular-nums">{profile.totalContributions || profile.contributions}</span>
                       )}
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Contributions · 100d</span>
                    </div>
                    <div className={`flex gap-1 h-6 items-end ${settings.hideContributions ? "hidden" : ""}`}>
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

        <section className="space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-2 border-b border-border/50 pb-8">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Proof of work</p>
                  <h2 className="text-4xl font-bold tracking-tighter text-gradient">Code merged by other maintainers</h2>
                  <p className="text-sm text-muted-foreground font-medium max-w-xl">
                    {`Pull requests accepted into repositories ${profile.name || username} does not own. Someone else reviewed them, so they can't be self-reported.`}
                  </p>
               </div>
               <div className="flex items-baseline gap-2">
                  <GitMerge size={18} className="text-violet-500 self-center" />
                  <span className="text-5xl font-bold tracking-tighter tabular-nums">{profile.proofOfWork.mergedExternalPRs}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">merged PRs</span>
               </div>
            </div>

            {profile.proofOfWork.topContributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.proofOfWork.topContributions.map((c) => (
                  <a
                    key={c.repo}
                    href={`https://github.com/${c.repo}/pulls?q=${encodeURIComponent(`is:pr is:merged author:${username}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 border border-border/50 bg-card spatial-card rounded-2xl hover:border-foreground/20 transition-all flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold tracking-tight text-foreground truncate">{c.repo}</span>
                      <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/5 text-amber-600 border border-amber-500/10 text-[10px] font-bold uppercase tracking-widest">
                        <Star size={10} className="fill-current" /> {formatStars(c.stars)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{c.mergedPRs} merged PR{c.mergedPRs === 1 ? "" : "s"}</span>
                      {c.lastMergedAt && (
                        <span>Last {formatMonthYear(c.lastMergedAt)}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-border/60 text-sm text-muted-foreground font-medium text-center">
                No pull requests merged into other people&apos;s repositories yet. Own projects still count toward impact and velocity.
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {([
                ["Impact", profile.devScore.impact, DEV_SCORE_MAX.impact, "Stars on own repos"],
                ["Velocity", profile.devScore.velocity, DEV_SCORE_MAX.velocity, "Contributions, 100 days"],
                ["Collaboration", profile.devScore.collaboration, DEV_SCORE_MAX.collaboration, "Merged external PRs"],
                ["Consistency", profile.devScore.consistency, DEV_SCORE_MAX.consistency, "Active days + streak"],
                ["Breadth", profile.devScore.breadth, DEV_SCORE_MAX.breadth, "Languages shipped"],
              ] as const).map(([label, value, max, hint]) => (
                <div key={label} className="p-4 rounded-xl border border-border/50 bg-card space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                    <span className="text-xs font-bold tabular-nums">{value}/{max}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${Math.round((value / max) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{hint}</p>
                </div>
              ))}
            </div>
        </section>

        {!settings.claimed && (
          <section className="p-8 md:p-10 rounded-2xl border border-border/50 bg-card flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Is this you, @{username}?</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-lg">
                Claim this profile with GitHub to control what&apos;s shown, add your bio and links, and let teams know you&apos;re open to opportunities.
              </p>
            </div>
            <SmartAuthButton className="shrink-0 h-11 px-6 rounded-lg bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
              <Github size={14} /> Claim profile
            </SmartAuthButton>
          </section>
        )}

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
                                 rel="noopener noreferrer"
                                 className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-border/50 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/50 transition-all"
                               >
                                 <Github size={12} /> Source
                                </a>
                                {repo.homepage && (
                                 <a
                                   href={repo.homepage}
                                   target="_blank"
                                   rel="noopener noreferrer nofollow"
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
            devScore={profile.devScore.total}
            mergedPRs={profile.proofOfWork.mergedExternalPRs}
            setShowReputation={setShowReputation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1.5 text-left">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 min-w-0 truncate px-3 py-2 rounded-lg bg-accent/40 border border-border/50 text-[11px]">{value}</code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 p-2 rounded-lg border border-border/50 hover:bg-accent transition-all"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

// Share = the growth loop: every copied link / README badge points back to a profile.
function ReputationCard({ username, avatarUrl, devScore, mergedPRs, setShowReputation }: { username: string; avatarUrl: string; devScore: number; mergedPRs: number; setShowReputation: (open: boolean) => void }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = `${origin}/u/${username}`;
  const badgeUrl = `${origin}/api/v1/badge/${username}`;
  const badgeMarkdown = `[![PulseBoard DevScore](${badgeUrl})](${profileUrl})`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm"
      onClick={() => setShowReputation(false)}
    >
      <div role="dialog" aria-modal="true" aria-label="Share profile" className="w-full max-w-md bg-card p-6 sm:p-10 rounded-3xl border border-border/50 vercel-shadow space-y-8 text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setShowReputation(false)}
          aria-label="Close"
          className="absolute top-6 right-6 p-2 bg-accent/50 text-muted-foreground hover:text-foreground rounded-lg transition-all"
        >
           <X size={14} />
        </button>
        <div className="flex items-center gap-4 text-left">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-accent vercel-shadow shrink-0">
            <Image src={avatarUrl} alt={username} fill sizes="64px" className="object-cover" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-foreground tracking-tight">@{username}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              DevScore {devScore}{mergedPRs > 0 ? ` · ${mergedPRs} merged OSS PRs` : ""}
            </p>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- live SVG badge preview */}
        {origin && <img src={badgeUrl} alt="PulseBoard badge preview" className="h-7 mx-auto" />}

        <div className="space-y-4">
          <CopyRow label="Profile link" value={profileUrl} />
          <CopyRow label="README badge (Markdown)" value={badgeMarkdown} />
        </div>

        <div className="flex gap-2">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-10 rounded-lg border border-border/50 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/50 transition-all flex items-center justify-center gap-2"
          >
            <Linkedin size={12} /> LinkedIn
          </a>
          <a
            href={`https://x.com/intent/post?text=${encodeURIComponent("My verified developer profile on PulseBoard")}&url=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-10 rounded-lg border border-border/50 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/50 transition-all flex items-center justify-center gap-2"
          >
            <Twitter size={12} /> Post
          </a>
        </div>
      </div>
    </motion.div>
  );
}
