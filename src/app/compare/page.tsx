"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense, useMemo } from "react";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { motion } from "framer-motion";
import { Shield, Zap, Star, Activity, ArrowLeftRight, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PulseLogo } from "@/components/pulse-logo";
import { Sparkline } from "@/components/sparkline";
import { getWeeklyContributions } from "@/app/actions/github";
import { LoadingTrigger } from "@/components/loading-trigger";
import Image from "next/image";

type ProfileSummary = {
  name?: string;
  username: string;
  avatarUrl: string;
  totalStars?: number;
  contributions?: number;
  streak?: number;
  devScore: {
    total: number;
    labels?: string[];
  };
};

function CompareContent() {
  const searchParams = useSearchParams();
  const usersParam = searchParams.get("users");
  const u1 = searchParams.get("u1");
  const u2 = searchParams.get("u2");

  const userList = useMemo(() => {
    if (usersParam) return usersParam.split(",").filter(Boolean);
    if (u1 && u2) return [u1, u2];
    if (u1) return [u1];
    if (u2) return [u2];
    return [];
  }, [usersParam, u1, u2]);

  const [profiles, setProfiles] = useState<{data: ProfileSummary; weekly: number[]}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (userList.length === 0) return;
      setLoading(true);
      try {
        const results = await Promise.all(userList.map(async (username): Promise<{data: ProfileSummary; weekly: number[]} | null> => {
          const [res, weekly] = await Promise.all([
            getPublicGitHubData(username),
            getWeeklyContributions(username)
          ]);
          if (!res) return null;
          
          return { 
            data: {
              ...res,
              devScore: {
                total: res.devScore.total,
                labels: res.devScore.labels
              }
            }, 
            weekly 
          };
        }));
        setProfiles(results.filter((p): p is {data: ProfileSummary; weekly: number[]} => p !== null));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userList]);

  if (userList.length === 0) return <MissingHandles />;

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-muted bg-background text-foreground overflow-x-hidden">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 space-y-24 relative z-10 text-center">
        <section className="space-y-12">
           <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mx-auto"
              >
                <ArrowLeftRight size={14} className="text-foreground" />
                 Comparative Intel
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight max-w-4xl mx-auto">
                  Metric Analysis
              </h1>
           </div>

           <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {userList.map((u, i) => (
                <React.Fragment key={u}>
                  <span className="text-foreground">@{u}</span>
                  {i < userList.length - 1 && (
                    <>
                      <div className="w-8 h-px bg-border" />
                      <Zap className="w-4 h-4 text-foreground/40" />
                      <div className="w-8 h-px bg-border" />
                    </>
                  )}
                </React.Fragment>
              ))}
           </div>
        </section>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4 max-w-xl mx-auto">
             <LoadingTrigger />
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-12 lg:gap-16 pt-12 ${profiles.length > 1 ? 'lg:grid-cols-2 xl:grid-cols-3' : ''}`}>
             {profiles.map((profile, i) => (
               <motion.div 
                 key={profile.data.username}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="space-y-12"
               >
                  <ProfileHero data={profile.data} velocity={profile.weekly} />
                  <MetricComparison 
                    data={profile.data} 
                    allProfiles={profiles.map(p => p.data)} 
                  />
               </motion.div>
             ))}
          </div>
        )}
      </main>

      <footer className="py-12 text-center border-t border-border mt-20">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-20">PulseBoard Analytic Node</p>
      </footer>
    </div>
  );
}

function ProfileHero({ data, velocity }: { data: ProfileSummary; velocity: number[] }) {
    return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 flex flex-col items-start text-left p-8 rounded-xl bg-card border border-border shadow-sm relative overflow-hidden min-h-[400px]"
        >
           <div className="relative group/avatar">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-muted shadow-sm transition-transform group-hover/avatar:scale-105 duration-500 bg-background">
                <Image src={data.avatarUrl} alt={data.name || data.username} fill sizes="128px" className="object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-4 py-1.5 rounded-md bg-foreground text-background text-xs font-medium uppercase tracking-widest shadow-sm">
                {data.devScore.total} RANK
              </div>
           </div>
           
           <div className="space-y-4 relative z-10 w-full flex-1">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter leading-tight text-foreground break-words">{data.name || data.username}</h2>
              <div className="flex flex-wrap gap-2 justify-start">
                {(data.devScore.labels ?? []).slice(0, 2).map((l) => (
                    <span key={l} className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 rounded-md bg-muted">{l}</span>
                ))}
              </div>
           </div>

           <div className="w-full h-24 flex flex-col justify-end p-4 bg-muted/30 rounded-lg border border-border relative z-10 overflow-hidden">
              <div className="w-full h-full flex items-end">
                <Sparkline data={velocity} color="#10b981" width={400} height={40} />
              </div>
           </div>
        </motion.div>
    )
}

function MetricComparison({ data, allProfiles }: { data: ProfileSummary; allProfiles: ProfileSummary[] }) {
    const getMaxValue = (metric: keyof ProfileSummary | "devScore") => {
        if (metric === "devScore") return Math.max(...allProfiles.map(p => p.devScore.total));
        return Math.max(...allProfiles.map(p => (p[metric] as number) || 0));
    };

    const metricSet = [
        { label: "Impact Stars", value: data.totalStars || 0, max: getMaxValue("totalStars"), icon: Star },
        { label: "Contributions", value: data.contributions || 0, max: getMaxValue("contributions"), icon: Activity },
        { label: "Tech Reputation", value: data.devScore.total, max: getMaxValue("devScore"), icon: Shield },
        { label: "Ship Streak", value: data.streak || 0, max: getMaxValue("streak"), icon: TrendingUp },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
           {metricSet.map(m => {
               const isLeader = allProfiles.length > 1 && m.value > 0 && m.value === m.max;

               return (
                   <motion.div 
                    key={m.label} 
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl border transition-all flex flex-col justify-between h-40 ${isLeader ? "bg-card border-foreground/20 shadow-md ring-1 ring-foreground/5" : "bg-muted/20 border-border opacity-60"}`}
                   >
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-md ${isLeader ? "bg-foreground/5 text-foreground" : "bg-muted text-muted-foreground"}`}>
                           <m.icon className="w-4 h-4" />
                        </div>
                        {isLeader && <Trophy className="w-3.5 h-3.5 text-foreground animate-bounce" />}
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{m.label}</span>
                        <div className={`text-2xl font-bold tracking-tighter tabular-nums ${isLeader ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {m.value.toLocaleString()}
                        </div>
                      </div>
                   </motion.div>
               )
           })}
        </div>
    )
}

function MissingHandles() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8 px-6 text-center">
      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        <PulseLogo className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Analytic Input Required</h2>
        <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed mx-auto">
          Add GitHub handles to compare profiles side by side. Select any number of profiles to see how they rank against each other.
        </p>
      </div>
      <Link href="/explore" className="px-8 py-3 bg-foreground text-background rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
        Browse directory
      </Link>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><LoadingTrigger /></div>}>
      <CompareContent />
    </Suspense>
  );
}
