"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Star, Activity, ArrowLeftRight, Trophy, TrendingUp, LayoutGrid, Users, ArrowLeft, Github } from "lucide-react";
import Link from "next/link";
import { PulseLogo } from "@/components/pulse-logo";
import { Sparkline } from "@/components/sparkline";
import { getWeeklyContributions } from "@/app/actions/github";
import { KineticParticles } from "@/components/kinetic-particles";

function CompareContent() {
  const searchParams = useSearchParams();
  const u1 = searchParams.get("u1");
  const u2 = searchParams.get("u2");
  const router = useRouter();
  
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weekly1, setWeekly1] = useState<number[]>([]);
  const [weekly2, setWeekly2] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      if (!u1 || !u2) return;
      setLoading(true);
      try {
        const [res1, res2, w1, w2] = await Promise.all([
          getPublicGitHubData(u1),
          getPublicGitHubData(u2),
          getWeeklyContributions(u1),
          getWeeklyContributions(u2)
        ]);
        setData1(res1);
        setData2(res2);
        setWeekly1(w1);
        setWeekly2(w2);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [u1, u2]);

  if (!u1 || !u2) return <MissingHandles />;

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary/20 bg-white text-black overflow-x-hidden">
      <KineticParticles />
      
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between sticky top-0 z-50 bg-white/50 backdrop-blur-3xl border-b border-black/5 shadow-sm">
        <Link href="/explore" className="flex items-center gap-3 group">
          <div className="p-2 rounded-2xl bg-black text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Directory</span>
        </Link>

        <div className="flex items-center gap-6">
           <Link 
              href="/fleet"
              className="px-6 py-3 rounded-full bg-black/5 border border-black/10 text-[9px] font-black uppercase tracking-[0.4em] text-black hover:bg-black hover:text-white transition-all hidden md:flex items-center gap-3 shadow-sm"
           >
              <LayoutGrid size={14} />
              Fleet Intelligence
           </Link>
           <Link 
              href="/"
              className="p-3.5 rounded-full bg-black text-white shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all"
           >
              <PulseLogo className="w-5 h-5 text-primary" />
           </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-32 space-y-48 relative z-10 text-center">
        <section className="space-y-16">
           <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mx-auto"
              >
                <ArrowLeftRight size={14} className="text-primary animate-pulse" />
                Engineering Grid Duel
              </motion.div>
              
              <h1 className="text-[5rem] md:text-[8rem] font-black tracking-[-0.05em] leading-[0.8] uppercase max-w-5xl mx-auto drop-shadow-sm shadow-black/5">
                 Dual<br/><span className="text-black/10 font-light italic text-[4rem] md:text-[6rem]">Platform</span> Duel
              </h1>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.8em] text-black/20">
              <span className={data1 ? "text-black" : ""}>@{u1}</span>
              <div className="w-12 h-px bg-black/10" />
              <Zap className="w-5 h-5 text-primary" />
              <div className="w-12 h-px bg-black/10" />
              <span className={data2 ? "text-black" : ""}>@{u2}</span>
           </div>
        </section>

        {loading ? (
          <div className="p-32 text-center rounded-[3rem] bg-white border border-black/5 shadow-xl flex flex-col items-center gap-6 max-w-2xl mx-auto">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Synthesizing Duel Metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 relative pt-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white border-2 border-primary shadow-2xl z-20 hidden lg:flex items-center justify-center scale-110">
                <Zap className="w-10 h-10 text-primary animate-pulse" />
             </div>

             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-24"
             >
                <ProfileHero data={data1} velocity={weekly1} />
                <MetricComparison data={data1} otherData={data2} />
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-24"
             >
                <ProfileHero data={data2} velocity={weekly2} align="right" />
                <MetricComparison data={data2} otherData={data1} />
             </motion.div>
          </div>
        )}
      </main>

      <footer className="py-24 text-center border-t border-black/5 mt-32">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-10">PulseBoard Comparison Engine</p>
      </footer>
    </div>
  );
}

function ProfileHero({ data, velocity, align = "left" }: { data: any, velocity: number[], align?: "left" | "right" }) {
    return (
        <motion.div 
          whileHover={{ scale: 1.02, rotateY: align === "left" ? 5 : -5 }}
          className={`space-y-12 flex flex-col p-12 rounded-[4rem] bg-white border border-black/5 shadow-2xl relative overflow-hidden group ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
        >
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 -z-0">
               <Github size={200} />
           </div>

           <div className="relative group/avatar">
              <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-[8px] border-black/5 shadow-2xl transition-transform group-hover/avatar:scale-105 duration-700 bg-white">
                <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute -bottom-4 ${align === "right" ? "-left-4" : "-right-4"} px-8 py-3 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-2xl`}>
                {data.devScore.total} RANK
              </div>
           </div>
           
           <div className="space-y-6 relative z-10 w-full">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-black break-all">{data.name || data.username}</h2>
              <div className={`flex flex-wrap gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
                {data.devScore.labels.slice(0, 2).map((l: string) => (
                    <span key={l} className="text-[9px] font-black uppercase tracking-widest text-black/30 border border-black/5 px-4 py-2 rounded-full bg-black/5">{l}</span>
                ))}
              </div>
           </div>

           <div className="w-full h-32 flex flex-col justify-end p-8 bg-black/5 rounded-[2.5rem] border border-black/5 relative z-10">
              <div className="flex justify-between items-center mb-4 text-[9px] font-black uppercase tracking-widest text-black/20">
                 <span>Shipping Pulse</span>
                 <span className="text-primary opacity-100">Active</span>
              </div>
              <Sparkline data={velocity} color="#10b981" width={400} height={50} />
           </div>
        </motion.div>
    )
}

function MetricComparison({ data, otherData }: { data: any, otherData: any }) {
    const isWinner = (v1: number, v2: number) => (v1 || 0) > (v2 || 0);
    
    const metricSet = [
        { label: "Impact Stars", v1: data.totalStars, v2: otherData.totalStars, icon: Star },
        { label: "Contributions", v1: data.contributions, v2: otherData.contributions, icon: Activity },
        { label: "Tech Reputation", v1: data.devScore.total, v2: otherData.devScore.total, icon: Shield },
        { label: "Ship Streak", v1: data.streak, v2: otherData.streak, icon: TrendingUp },
    ];

    return (
        <div className="grid grid-cols-2 gap-8">
           {metricSet.map(m => {
               const winning = isWinner(m.v1, m.v2);

               return (
                   <motion.div 
                    key={m.label} 
                    whileHover={{ scale: 1.05 }}
                    className={`p-10 rounded-[3rem] border transition-all flex flex-col justify-between h-56 ${winning ? "bg-white border-primary shadow-2xl shadow-primary/10" : "bg-white border-black/5 opacity-40 grayscale"}`}
                   >
                      <div className="flex items-center justify-between">
                        <div className={`p-4 rounded-2xl ${winning ? "bg-primary/10 text-primary" : "bg-black/5 text-black/20"}`}>
                           <m.icon className="w-5 h-5" />
                        </div>
                        {winning && <Trophy className="w-4 h-4 text-primary animate-bounce" />}
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">{m.label}</span>
                        <div className="text-4xl font-black tracking-tighter text-black tabular-nums">{(m.v1 || 0).toLocaleString()}</div>
                      </div>
                   </motion.div>
               )
           })}
        </div>
    )
}

function MissingHandles() { return <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-12 px-6 text-center">
    <div className="w-24 h-24 rounded-[3rem] bg-black/5 flex items-center justify-center text-black/10">
       <PulseLogo className="w-12 h-12" />
    </div>
    <div className="space-y-4">
       <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">Missing Duel <br/><span className="text-black/10 font-light italic text-[4rem]">Targets</span></h2>
       <p className="text-black/40 max-w-md font-medium text-lg leading-relaxed italic mx-auto">&ldquo;The Comparison Terminal requires two valid registry handles to ignite. Return to explore and select your nodes.&rdquo;</p>
    </div>
    <Link href="/explore" className="px-14 py-6 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20">Return to Directory</Link>
</div> }

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Zap className="w-12 h-12 text-primary animate-ping" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
