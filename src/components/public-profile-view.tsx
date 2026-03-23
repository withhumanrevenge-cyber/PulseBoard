"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, GitCommit, Code, Github, BadgeCheck, Zap, ArrowUpRight } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden text-slate-900 selection:bg-indigo-100">
      {/* Dynamic Background Accents (Light Apple Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/30 rounded-full blur-[140px] -z-10" />

      <main className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Identity Bento Block (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="relative group inline-block">
                <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-[8px] border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group-hover:scale-[1.02] transition-transform duration-700 ring-1 ring-slate-100">
                    <img 
                        src={profile.avatarUrl} 
                        alt={profile.name || username} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                </div>
                {isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl border-4 border-white">
                        <BadgeCheck className="w-6 h-6" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tight tracking-tighter text-slate-900 leading-[0.9]">
                {profile.name || username}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em]">{username}</span>
                {isVerified && (
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">Verified Protocol</span>
                )}
              </div>
              {profile.bio && (
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Github className="w-4 h-4" />
                Analyze Stack
              </a>
            </div>
          </motion.div>

          {/* Reputation Matrix Bento (Right) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BentoCard 
              label="Stars Earned" 
              value={privacy.hideStars ? "—" : profile.totalStars.toLocaleString()} 
              icon={Star} 
              color="text-amber-500" 
              bg="bg-amber-50"
              delay={0.1}
            />
            <BentoCard 
              label="Contributions" 
              value={privacy.hideContributions ? "—" : profile.contributions.toLocaleString()} 
              icon={GitCommit} 
              color="text-indigo-600" 
              bg="bg-indigo-50"
              delay={0.2}
            />
            <BentoCard 
              label="Primary Stack" 
              value={privacy.hideTech ? "Private" : profile.topLanguage} 
              icon={Code} 
              color="text-emerald-600" 
              bg="bg-emerald-50"
              spanFull={true}
              delay={0.3}
            />

            {/* Repos Bento Section */}
            <div className="sm:col-span-2 space-y-6 pt-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-600" />
                        Verified Repos
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.repos.map((repo, idx) => (
                        <motion.a
                            key={repo.name}
                            href={repo.link}
                            target="_blank"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.05 }}
                            className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] transition-all group flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold tracking-tight text-slate-800">{repo.name}</h3>
                                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    {repo.stars}
                                </div>
                                {repo.language && (
                                    <span className="text-[10px] font-bold text-slate-400 border-l border-slate-100 pl-3 uppercase tracking-widest">{repo.language}</span>
                                )}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200">Thanks for Shipping</p>
      </footer>
    </div>
  );
}

function BentoCard({ label, value, icon: Icon, color, bg, spanFull, delay = 0 }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            className={`p-10 rounded-[3rem] bg-white border border-slate-100 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${spanFull ? 'sm:col-span-2' : ''}`}
        >
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-40 ${bg}`} />
            <div className="relative z-10 flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
                <div className={`p-4 rounded-2xl ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="relative z-10 text-5xl font-black tracking-tight text-slate-900">
                {value}
            </div>
        </motion.div>
    );
}
