"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Github, Radio } from "lucide-react";
import { SmartAuthButton } from "@/components/smart-auth-button";
import { DevSearch } from "@/components/dev-search";
import { ExploreTalentFilter } from "@/components/explore-talent-filter";
import { IntelligenceTerminal } from "@/components/intelligence-terminal";
import { getExploreUsers } from "@/app/actions/explore";
import { getTopGithubUsers } from "@/app/actions/github";
import { motion } from "framer-motion";
import { ProfileGridSkeleton } from "@/components/skeletons";
import type { ExploreUser } from "@/components/explore-grid";
import Image from "next/image";
import Link from "next/link";

interface TopTalent {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  type: string;
}

export default function ExplorePage() {
  const [users, setUsers] = useState<ExploreUser[]>([]);
  const [topTalents, setTopTalents] = useState<TopTalent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [userData, githubData] = await Promise.all([
          getExploreUsers(),
          getTopGithubUsers()
        ]);
        setUsers(userData || []);
        setTopTalents(githubData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-muted bg-background text-foreground overflow-x-hidden">

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 space-y-24 relative z-10">
        <section className="space-y-12 flex flex-col items-center text-center">
          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mx-auto"
             >
               <Radio size={14} className="text-foreground" />
               Global Directory
             </motion.div>
             
             <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-tight max-w-4xl mx-auto">
               Verified Developer Intelligence
             </h1>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Ask in plain language — PulseBoard searches all of GitHub and answers with live profiles.
          </p>

          <div className="w-full">
            <DevSearch />
          </div>

          {topTalents.length > 0 && (
            <div className="w-full pt-16 space-y-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-semibold tracking-tight">Global Impact Leaders</h2>
                  <p className="text-sm text-muted-foreground font-medium">Ranked by weighted contribution and follower distribution</p>
                </div>
                <div className="self-start px-3 py-1 rounded-md bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border shrink-0">
                  Updated Daily
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topTalents.map((talent, i) => (
                  <motion.div
                    key={talent.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative p-4 rounded-xl bg-card border border-border hover:border-foreground/20 spatial-card"
                  >
                    <Link href={`/u/${talent.username}`} className="block space-y-4">
                      <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-muted group-hover:border-foreground/10 transition-colors">
                        <Image 
                          src={talent.avatarUrl} 
                          alt={talent.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold tracking-tight truncate">{talent.username}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Rank #{i + 1}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="w-full pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">or browse directory</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <ExploreTalentFilter initialUsers={users} />
            </div>
          )}
        </section>

        {loading ? (
             <div className="pt-4">
                <ProfileGridSkeleton count={6} />
             </div>
        ) : users.length === 0 && (
          <section className="p-20 text-center rounded-xl bg-card border border-border shadow-sm flex flex-col items-center gap-8">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
               <Github size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Directory unavailable</h2>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed mx-auto">
                Be the first to publish a profile and appear in the directory.
              </p>
            </div>
            <SmartAuthButton
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Create profile <ArrowRight className="w-4 h-4" />
            </SmartAuthButton>
          </section>
        )}

        <section className="p-12 rounded-xl bg-foreground text-background flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
          <div className="space-y-6 max-w-xl relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Join the directory.</h2>
            <p className="text-background/60 font-medium text-lg leading-relaxed max-w-md">
              Connect your stack, publish your dashboard, and appear in the directory.
            </p>
          </div>
          <SmartAuthButton
            className="px-8 py-4 bg-background text-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity relative z-10 whitespace-nowrap"
          >
            Create profile
          </SmartAuthButton>
        </section>
      </main>

      <IntelligenceTerminal />

      <div className="pb-32">
        <footer className="py-12 text-center border-t border-border mt-20">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">PulseBoard Talent Directory</p>
        </footer>
      </div>
    </div>
  );
}
