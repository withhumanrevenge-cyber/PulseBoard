"use client";

import { useState, useMemo } from "react";
import { Search, Star, Code2, Sword, Loader2, Zap, Plus, ArrowRight } from "lucide-react";
import { ExploreGrid } from "./explore-grid";
import type { ExploreUser } from "./explore-grid";
import { useComparisonRegistry } from "@/lib/use-comparison";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { motion, AnimatePresence } from "framer-motion";

interface ExploreTalentFilterProps {
  initialUsers: ExploreUser[];
}

export function ExploreTalentFilter({ initialUsers }: ExploreTalentFilterProps) {
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [minStars, setMinStars] = useState<number>(0);

  const [isSeeding, setIsSeeding] = useState(false);
  const { toggleNode, isSelected } = useComparisonRegistry();

  const normalizedSearch = search.trim().replace("@", "");
  const alreadySelected = normalizedSearch ? isSelected(normalizedSearch) : false;

  const handleDirectAdd = async () => {
    if (!normalizedSearch || isSeeding) return;
    setIsSeeding(true);
    try {
      const data = await getPublicGitHubData(normalizedSearch);
      if (data) {
        toggleNode({
           id: data.username,
           username: data.username,
           avatar_url: data.avatarUrl
        });
      }
    } catch (err) {
      console.error("[seeder_error]", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const languages = useMemo(() => {
    const langs = new Set<string>();
    initialUsers.forEach(u => {
      if (u.top_language) langs.add(u.top_language.split(' + ')[0]);
    });
    return Array.from(langs).sort();
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(u => {
      const matchSearch = String(u.username || "").toLowerCase().includes(search.toLowerCase());
      const matchLang = !activeLang || String(u.top_language || "").includes(activeLang);
      const matchStars = (u.total_stars || 0) >= minStars;
      return matchSearch && matchLang && matchStars;
    });
  }, [initialUsers, search, activeLang, minStars]);

  return (
    <div className="space-y-24 w-full">
      <div className="space-y-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative group flex items-center w-full p-1 h-14 bg-card border border-border rounded-lg transition-all focus-within:ring-2 focus-within:ring-foreground/5 focus-within:border-foreground/20">
             <div className="pl-4 text-muted-foreground group-focus-within:text-foreground transition-colors">
                <Search size={18} />
             </div>
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleDirectAdd()}
               placeholder="Search by GitHub handle"
               className="flex-1 bg-transparent border-none outline-none pl-3 text-sm font-medium placeholder:text-muted-foreground/40 text-foreground"
             />
             <AnimatePresence>
               {normalizedSearch.length > 2 && (
                 <motion.button 
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 10 }}
                   onClick={handleDirectAdd}
                   disabled={isSeeding}
                   className={`h-10 px-4 rounded-md font-medium text-sm transition-all flex items-center gap-2 mr-1 ${
                     alreadySelected
                     ? "bg-muted text-muted-foreground"
                     : "bg-foreground text-background hover:opacity-90 shadow-sm"
                   }`}
                 >
                   {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : alreadySelected ? <Plus className="w-4 h-4" /> : <Sword className="w-4 h-4" />}
                   {alreadySelected ? "Added" : "Add"}
                 </motion.button>
               )}
             </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
             <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-card border border-border shadow-sm">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={activeLang || ""}
                  onChange={(e) => setActiveLang(e.target.value || null)}
                  className="bg-transparent text-sm font-medium outline-none cursor-pointer text-foreground"
                >
                   <option value="">All Stacks</option>
                   {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
             </div>
             
             <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-card border border-border shadow-sm">
                <Star className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={minStars || 0}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  className="bg-transparent text-sm font-medium outline-none cursor-pointer text-foreground"
                >
                   <option value={0}>Any Impact</option>
                   <option value={10}>10+ Stars</option>
                   <option value={50}>50+ Stars</option>
                   <option value={100}>100+ Stars</option>
                </select>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 opacity-40">
           {["shadcn", "levelsio", "t3dotgg", "vercel", "gaearon"].map(node => (
              <button 
                key={node} 
                onClick={() => setSearch(node)}
                className="px-4 py-1.5 rounded-full border border-border hover:border-foreground hover:text-foreground text-[11px] font-medium transition-all active:scale-95"
              >
                 @{node}
              </button>
           ))}
        </div>
      </div>

           {filteredUsers.length === 0 ? (
        <div className="py-32 text-center rounded-xl bg-card border border-border shadow-sm flex flex-col items-center gap-8">
           <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/40">
              <Zap size={32} />
           </div>
           <div className="space-y-2">
              <p className="text-2xl font-semibold tracking-tight">No results found</p>
              <p className="text-muted-foreground font-medium text-base max-w-sm leading-relaxed mx-auto">
                Try clearing filters or searching for a different handle.
              </p>
           </div>
           <button 
            onClick={() => { setSearch(""); setActiveLang(null); setMinStars(0); }}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-foreground text-background font-medium text-sm hover:opacity-90 transition-all shadow-sm"
           >
             Reset filters <ArrowRight size={14} />
           </button>
        </div>
      ) : (
        <div className="pt-10">
          <ExploreGrid users={filteredUsers} />
        </div>
      )}
    </div>
  );
}
