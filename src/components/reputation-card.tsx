"use client";

import { motion } from "framer-motion";
import { Star, Shield, Zap, Github, Activity } from "lucide-react";
import { Sparkline } from "./sparkline";

interface ReputationCardProps {
  username: string;
  avatarUrl: string;
  totalStars: number;
  topLanguage: string;
  weeklyContributions: number[];
  onClose: () => void;
}

export function ReputationCard({ 
  username, 
  avatarUrl, 
  totalStars, 
  topLanguage, 
  weeklyContributions,
  onClose 
}: ReputationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md aspect-square bg-[#0a0a0a] rounded-[3rem] p-10 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden group flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -z-0">
           <Github size={300} strokeWidth={0.5} color="white" />
        </div>
        <div className="absolute bottom-0 left-0 p-12 opacity-[0.03] -rotate-12 -z-0">
           <Zap size={200} strokeWidth={0.5} color="white" />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">@{username}</h3>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">Verified Persona</p>
            </div>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-bold text-primary uppercase tracking-[0.5em]">
            Pulse v1.0
          </div>
        </div>

        <div className="space-y-8 relative z-10">
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-2">
                 <div className="flex items-center gap-2 text-amber-500 opacity-60">
                    <Star size={12} className="fill-current" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Global Stars</span>
                 </div>
                 <div className="text-3xl font-black text-white tracking-tighter">{(totalStars || 0).toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-2">
                 <div className="flex items-center gap-2 text-emerald-500 opacity-60">
                    <Activity size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Stack Intensity</span>
                 </div>
                 <div className="text-3xl font-black text-white tracking-tighter truncate leading-tight overflow-hidden">
                    {topLanguage.split(' + ')[0] || 'Code'}
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/20">Shipping Velocity</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[7px] font-black uppercase text-emerald-500 tracking-widest">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   Live Sync
                </div>
              </div>
              <div className="flex justify-center py-2">
                <Sparkline data={weeklyContributions} color="#10b981" width={300} height={60} />
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
           <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">PulseBoard</span>
           </div>
           <span className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em]">Reputation Protocol Verified</span>
        </div>
      </div>
    </motion.div>
  );
}
