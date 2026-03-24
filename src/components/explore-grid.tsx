"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "./motion-kit";
import Link from "next/link";
import { ArrowRight, Github, Star, Sword, X, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  avatar_url: string;
  total_stars?: number;
  top_language?: string;
}

export function ExploreGrid({ users }: { users: User[] }) {
  const [selected, setSelected] = useState<User[]>([]);
  const router = useRouter();

  const toggleSelect = (user: User) => {
    setSelected(prev => {
      if (prev.find(u => u.id === user.id)) {
        return prev.filter(u => u.id !== user.id);
      }
      if (prev.length >= 2) return prev;
      return [...prev, user];
    });
  };

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-64">
        {users.map((user, i) => {
          const isSelected = !!selected.find(u => u.id === user.id);
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
              className="relative perspective-[1000px]"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); toggleSelect(user); }}
                className={`absolute top-8 left-8 z-30 p-4 rounded-3xl border transition-all duration-500 scale-90 ${isSelected ? "bg-primary text-primary-foreground border-primary shadow-2xl" : "bg-black/5 text-black/20 border-black/5 backdrop-blur-xl hover:text-black hover:border-black/20"}`}
              >
                <Sword size={20} className={isSelected ? "animate-pulse" : ""} />
              </button>

              <Link href={`/u/${user.username}`}>
                <SpotlightCard className={`flex flex-col items-center justify-between p-12 rounded-[4rem] border transition-all duration-700 h-[32rem] overflow-hidden bg-white group ${isSelected ? "border-primary shadow-2xl shadow-primary/20" : "border-black/5 hover:border-black/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl"}`}>
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-1000 rotate-12 -z-0">
                    <Github size={240} strokeWidth={0.5} />
                  </div>

                  <div className={`relative z-10 w-44 h-44 rounded-[3.5rem] overflow-hidden border-[8px] border-white shadow-2xl ring-4 transition-all duration-700 bg-white ${isSelected ? "ring-primary shadow-primary/20 scale-105" : "ring-black/5 group-hover:ring-black/10"}`}>
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>

                  <div className="text-center space-y-4 relative z-10 mt-8 flex-1 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-widest text-black/40">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                         {user.top_language || "Experimental"}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-[9px] font-black uppercase tracking-widest text-amber-500">
                         <Star size={10} className="fill-current" />
                         {user.total_stars || 0}
                      </div>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter group-hover:text-primary transition-colors uppercase pt-2 text-black leading-none">
                      @{user.username}
                    </h3>
                  </div>

                  <div className="relative z-10 w-full pt-10 border-t border-black/5 flex items-center justify-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/20 group-hover:text-black">View Pulse</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform text-black/[0.05] group-hover:text-primary" />
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6"
          >
            <div className="bg-white/80 backdrop-blur-3xl border border-black/5 p-6 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex items-center justify-between gap-10">
               <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                     {selected.map(u => (
                        <div key={u.id} className="w-16 h-16 rounded-[1.2rem] border-4 border-white overflow-hidden relative group shadow-lg">
                           <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => toggleSelect(u)}
                             className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                           >
                              <X size={20} className="text-white" />
                           </button>
                        </div>
                     ))}
                     {selected.length < 2 && (
                        <div className="w-16 h-16 rounded-[1.2rem] border-4 border-white border-dashed bg-black/5 flex items-center justify-center text-black/10">
                           <Zap size={20} />
                        </div>
                     )}
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Fleet Command</p>
                     <p className="text-sm font-black text-black/40 uppercase">
                        {selected.length === 1 ? "Select another profile..." : "Dual Profiles Selected"}
                     </p>
                  </div>
               </div>

               <button 
                 disabled={selected.length < 2}
                 onClick={() => router.push(`/compare?u1=${selected[0].username}&u2=${selected[1].username}`)}
                 className={`px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all ${selected.length === 2 ? "bg-black text-white hover:scale-105 active:scale-95 shadow-2xl shadow-black/20" : "bg-black/5 text-black/20 cursor-not-allowed grayscale"}`}
               >
                 Ignite Comparison
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
