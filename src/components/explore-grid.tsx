"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "./motion-kit";
import Link from "next/link";
import { ArrowRight, Github, Star } from "lucide-react";

interface User {
  id: string;
  username: string;
  avatar_url: string;
  total_stars?: number;
  top_language?: string;
}

export function ExploreGrid({ users }: { users: User[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
      {users.map((user, i) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={`/u/${user.username}`}>
            <SpotlightCard className="flex flex-col items-center justify-between p-12 rounded-[4rem] bg-secondary/5 border border-white/5 hover:border-primary/40 transition-all duration-700 h-[30rem] overflow-hidden backdrop-blur-xl group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-1000 rotate-12 -z-0">
                <Github size={240} strokeWidth={0.5} />
              </div>

              <div className="relative z-10 w-44 h-44 rounded-[3.5rem] overflow-hidden border-[8px] border-background shadow-2xl ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all duration-700">
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>

              <div className="text-center space-y-4 relative z-10 mt-8 flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold uppercase tracking-widest text-primary">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                     {user.top_language || "Experimental"}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10 text-[9px] font-bold uppercase tracking-widest text-amber-500">
                     <Star size={10} className="fill-current" />
                     {user.total_stars || 0}
                  </div>
                </div>
                <h3 className="text-4xl font-bold tracking-tighter group-hover:text-primary transition-colors uppercase pt-2">
                  @{user.username}
                </h3>
              </div>

              <div className="relative z-10 w-full pt-10 border-t border-white/5 flex items-center justify-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">View Pulse</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform text-white/10 group-hover:text-primary" />
              </div>
            </SpotlightCard>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
