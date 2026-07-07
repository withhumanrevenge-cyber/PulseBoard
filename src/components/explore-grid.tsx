"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Plus, Check } from "lucide-react";
import { useComparisonRegistry } from "@/lib/use-comparison";
import Image from "next/image";

export interface ExploreUser {
  id?: string;
  username: string;
  avatar_url: string;
  total_stars?: number;
  total_forks?: number;
  total_contributions?: number;
  top_language?: string;
}

export function ExploreGrid({ users }: { users: ExploreUser[] }) {
  const { toggleNode, isSelected } = useComparisonRegistry();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
      {users.map((user, i) => {
        const selected = isSelected(user.username);
        
        return (
          <motion.div
            key={user.username}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`group relative p-8 h-[24rem] flex flex-col justify-between border rounded-xl spatial-card bg-card ${selected ? "border-foreground" : "border-border hover:border-foreground/20"}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleNode({ id: user.username, username: user.username, avatar_url: user.avatar_url }); }}
                className={`absolute top-4 right-4 z-30 p-2 rounded-md transition-all ${selected ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {selected ? <Check size={16} /> : <Plus size={16} />}
              </button>

              <Link href={`/u/${user.username}`} className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className={`relative w-32 h-32 rounded-xl overflow-hidden border-2 transition-all ${selected ? "border-foreground" : "border-muted group-hover:border-foreground/20"}`}>
                  <Image
                    src={user.avatar_url}
                    alt={user.username}
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground border border-border">
                        {user.top_language || "General"}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/5 text-[10px] font-medium text-amber-500 border border-amber-500/10">
                       <Star size={10} className="fill-current" />
                       {user.total_stars || 0}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    @{user.username}
                  </h3>
                </div>
              </Link>

              <Link href={`/u/${user.username}`} className="flex items-center justify-center gap-2 pt-6 border-t border-border group/link">
                <span className="text-xs font-medium text-muted-foreground group-hover/link:text-foreground transition-colors">View Profile</span>
                <ArrowRight size={14} className="text-muted-foreground group-hover/link:text-foreground group-hover/link:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
