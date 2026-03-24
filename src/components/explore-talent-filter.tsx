"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, Code2 } from "lucide-react";
import { ExploreGrid } from "./explore-grid";

interface ExploreTalentFilterProps {
  initialUsers: any[];
}

export function ExploreTalentFilter({ initialUsers }: ExploreTalentFilterProps) {
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [minStars, setMinStars] = useState<number>(0);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    initialUsers.forEach(u => {
      if (u.top_language) langs.add(u.top_language.split(' + ')[0]);
    });
    return Array.from(langs).sort();
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(u => {
      const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
      const matchLang = !activeLang || u.top_language?.includes(activeLang);
      const matchStars = (u.total_stars || 0) >= minStars;
      return matchSearch && matchLang && matchStars;
    });
  }, [initialUsers, search, activeLang, minStars]);

  return (
    <div className="space-y-16 w-full">
      {/* Power-Filter Terminal */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-black/5 p-4 rounded-3xl border border-black/5 glass">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Network Handle"
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-black/5 text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-primary/5 focus:border-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-black/5">
             <Code2 className="w-4 h-4 text-primary" />
             <select 
               value={activeLang || ""}
               onChange={(e) => setActiveLang(e.target.value || null)}
               className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer"
             >
                <option value="">All Stacks</option>
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
             </select>
          </div>
          
          <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-black/5">
             <Star className="w-4 h-4 text-amber-500" />
             <select 
               value={minStars}
               onChange={(e) => setMinStars(Number(e.target.value))}
               className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer"
             >
                <option value={0}>0+ Stars</option>
                <option value={10}>10+ Stars</option>
                <option value={50}>50+ Stars</option>
                <option value={100}>100+ Stars</option>
             </select>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="py-32 text-center rounded-[3rem] border border-dashed border-black/10 flex flex-col items-center gap-4">
           <p className="text-xl font-bold tracking-tight opacity-40 uppercase tracking-[0.2em]">No Nodes Found</p>
           <button 
            onClick={() => { setSearch(""); setActiveLang(null); setMinStars(0); }}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all"
           >
             Clear Filters
           </button>
        </div>
      ) : (
        <ExploreGrid users={filteredUsers} />
      )}
    </div>
  );
}
