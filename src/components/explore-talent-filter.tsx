"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, Code2, Sword, Loader2, Zap, Plus, ArrowRight } from "lucide-react";
import { ExploreGrid } from "./explore-grid";
import { useComparisonRegistry } from "@/lib/use-comparison";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { motion, AnimatePresence } from "framer-motion";

interface ExploreTalentFilterProps {
  initialUsers: any[];
}

export function ExploreTalentFilter({ initialUsers }: ExploreTalentFilterProps) {
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [minStars, setMinStars] = useState<number>(0);

  const [isSeeding, setIsSeeding] = useState(false);
  const { toggleNode, isSelected } = useComparisonRegistry();

  const handleDirectStash = async () => {
    if (!search.trim() || isSeeding) return;
    setIsSeeding(true);
    try {
      const data = await getPublicGitHubData(search.trim());
      if (data) {
        toggleNode({ 
           id: data.name, 
           username: data.name, 
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="relative group bg-white rounded-full p-2 h-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex items-center transition-all focus-within:ring-2 ring-primary/20 overflow-hidden">
             <div className="pl-10 text-black/20 group-focus-within:text-primary transition-colors">
                <Search size={24} />
             </div>
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleDirectStash()}
               placeholder="Search by Developer Handle"
               className="flex-1 bg-transparent border-none outline-none pl-6 text-xl font-bold placeholder:text-black/10 text-black uppercase tracking-tight h-full"
             />
             <AnimatePresence>
               {search.length > 2 && (
                 <motion.button 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   onClick={handleDirectStash}
                   disabled={isSeeding}
                   className={`h-20 px-10 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-4 mr-0 ${
                     isSelected(search)
                     ? "bg-rose-500 text-white"
                     : "bg-black text-white hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                   }`}
                 >
                   {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : isSelected(search) ? <Plus className="w-4 h-4" /> : <Sword className="w-4 h-4 text-primary" />}
                   {isSelected(search) ? "Stashed" : "Select & Compare"}
                 </motion.button>
               )}
             </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
             <div className="flex items-center gap-4 px-10 py-5 rounded-full bg-white border border-black/5 shadow-xl transition-all hover:border-black/10">
                <Code2 className="w-5 h-5 text-primary" />
                <select 
                  value={activeLang || ""}
                  onChange={(e) => setActiveLang(e.target.value || null)}
                  className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-black"
                >
                   <option value="">All Technical Stacks</option>
                   {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
             </div>
             
             <div className="flex items-center gap-4 px-10 py-5 rounded-full bg-white border border-black/5 shadow-xl transition-all hover:border-black/10">
                <Star className="w-5 h-5 text-amber-500" />
                <select 
                  value={minStars || 0}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-black"
                >
                   <option value={0}>Any Impact Level</option>
                   <option value={10}>10+ Verified Stars</option>
                   <option value={50}>50+ Verified Stars</option>
                   <option value={100}>100+ Verified Stars</option>
                </select>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 opacity-30">
           {["shadcn", "levelsio", "t3dotgg", "vercel", "gaearon"].map(node => (
              <button 
                key={node} 
                onClick={() => setSearch(node)}
                className="px-6 py-2 rounded-full border border-black/10 hover:border-black hover:text-black text-[9px] font-black uppercase tracking-widest text-black/40 transition-all active:scale-95"
              >
                 @{node}
              </button>
           ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="py-48 text-center rounded-[5rem] bg-white border border-black/5 shadow-2xl flex flex-col items-center gap-10">
           <div className="w-24 h-24 rounded-[3rem] bg-black/5 flex items-center justify-center text-black/10 group-hover:rotate-12 transition-transform">
              <Zap size={40} />
           </div>
           <div className="space-y-4">
              <p className="text-3xl font-black uppercase tracking-tight text-black">No Profiles Match Filters</p>
              <p className="text-black/30 font-medium text-lg max-w-sm italic leading-relaxed mx-auto">
                 &ldquo;The directory is searching... try clearing your technical stack or handle filters.&rdquo;
              </p>
           </div>
           <button 
            onClick={() => { setSearch(""); setActiveLang(null); setMinStars(0); }}
            className="flex items-center gap-4 px-12 py-5 rounded-full bg-black text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
           >
             Reset Filters <ArrowRight size={14} className="text-primary" />
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
