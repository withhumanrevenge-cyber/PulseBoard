"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Code, Github, BadgeCheck, Zap, ArrowUpRight, Copy, Activity } from "lucide-react";
import { NeutralLivelyBg } from "@/components/neutral-bg";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("7 days");

  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-x-hidden text-slate-900 selection:bg-slate-200 font-sans pb-40">
      <NeutralLivelyBg />

      {/* Profile Header (Matching Reference) */}
      <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-slate-100">
           <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                    <img src={profile.avatarUrl} alt={username} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.name || username}</h1>
                   <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-400">@{username}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </div>
                   </div>
                </div>
           </div>

           {/* Time Filters Bar */}
           <div className="flex items-center p-1.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                {["7 days", "30 days", "90 days", "All time"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab}
                    </button>
                ))}
           </div>
        </header>

        {/* Stats Grid (Matching Reference) - 4 Columns */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-100">
            <StatsCol label="TOTAL STARS" value={privacy.hideStars ? "—" : profile.totalStars} subText="+12 this week" color="text-amber-500" />
            <StatsCol label="CONTRIBUTIONS" value={privacy.hideContributions ? "—" : profile.contributions} subText="+8 today" color="text-slate-950" />
            <StatsCol label="TOP LANGUAGE" value={privacy.hideTech ? "Private" : profile.topLanguage} subText="94.5% of code" color="text-indigo-600" />
            <StatsCol label="CURRENT STREAK" value="12 days" subText="Best: 21 days" color="text-emerald-600" isLast />
        </section>

        {/* Heatmap Placeholder Section (Matching Reference) */}
        <section className="space-y-6">
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Contribution activity <span className="text-slate-200 ml-2">last 16 weeks</span></h3>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl overflow-hidden">
                <div className="flex flex-wrap gap-1.5 opacity-40">
                    {Array.from({ length: 112 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-4 h-4 rounded-[2px] ${i % 7 === 0 ? 'bg-emerald-600' : i % 3 === 0 ? 'bg-emerald-400' : 'bg-slate-100'}`} 
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* Details 2-Column Section (Top Repos vs Activity) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            <div className="space-y-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Top repositories</h3>
                <div className="space-y-1">
                    {profile.repos.slice(0, 4).map(repo => (
                        <a 
                            key={repo.name} 
                            href={repo.link} 
                            target="_blank"
                            className="flex items-center justify-between p-6 hover:bg-slate-50/50 rounded-2xl transition-all group"
                        >
                            <div className="space-y-1">
                                <div className="font-bold text-slate-900 group-hover:text-black">{repo.name}</div>
                                <div className="text-xs font-semibold text-slate-400">{repo.language || "Unknown"}</div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <Star className="w-3.5 h-3.5" />
                                {repo.stars}
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent activity</h3>
                <div className="space-y-6 pl-2">
                    {[
                        { entry: `Pushed 2 commits to PulseBoard`, time: '2 hours ago', icon: "bg-emerald-500" },
                        { entry: `Opened PR in PulseBoard`, time: '5 hours ago', icon: "bg-blue-500" },
                        { entry: `Pushed 1 commit to myskills`, time: 'Yesterday', icon: "bg-emerald-500" },
                        { entry: `Starred shadcn/ui`, time: '2 days ago', icon: "bg-orange-500" }
                    ].map((activity, i) => (
                        <div key={i} className="flex gap-4 relative">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.icon}`} />
                            <div className="space-y-1">
                                <div className="text-sm font-bold text-slate-900">{activity.entry}</div>
                                <div className="text-xs font-medium text-slate-300">{activity.time}</div>
                            </div>
                            {i < 3 && <div className="absolute left-0.5 top-5 bottom-[-1.5rem] w-px bg-slate-50" />}
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Language Breakdown Section (Matching Reference) */}
        <section className="pt-16 space-y-6">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Language breakdown</h3>
             <div className="w-full space-y-8">
                 <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-50">
                    <div className="h-full bg-blue-600" style={{ width: '65%' }} />
                    <div className="h-full bg-emerald-500" style={{ width: '18%' }} />
                    <div className="h-full bg-amber-500" style={{ width: '10%' }} />
                    <div className="h-full bg-pink-500" style={{ width: '7%' }} />
                 </div>
                 <div className="flex flex-wrap gap-8">
                    {[
                        { label: 'TypeScript', val: '65%', color: 'bg-blue-600' },
                        { label: 'CSS', val: '18%', color: 'bg-emerald-500' },
                        { label: 'JavaScript', val: '10%', color: 'bg-amber-500' },
                        { label: 'Other', val: '7%', color: 'bg-pink-500' },
                    ].map(lang => (
                        <div key={lang.label} className="flex items-center gap-2.5">
                            <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                            <span className="text-xs font-bold text-slate-900">{lang.label} <span className="text-slate-300 ml-1">{lang.val}</span></span>
                        </div>
                    ))}
                 </div>
             </div>
        </section>

        {/* Share Bar (Matching Reference) */}
        <footer className="pt-24">
            <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="px-6 py-3 font-bold text-slate-900 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                   pulseboard.app/u/{username}
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                    <Copy className="w-4 h-4" />
                    Copy link
                </button>
            </div>
        </footer>
      </main>
    </div>
  );
}

function StatsCol({ label, value, subText, color, isLast }: any) {
    return (
        <div className={`p-10 space-y-3 ${!isLast ? 'border-r border-slate-100' : ''}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
            <div className={`text-4xl font-black tracking-tight ${color}`}>
                {value}
            </div>
            <div className="text-xs font-bold text-emerald-500">{subText}</div>
        </div>
    );
}
