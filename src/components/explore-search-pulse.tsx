"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

export function ExploreSearchPulse() {
  return (
    <div className="w-full max-w-lg mx-auto relative group pt-8">
      <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('username') as HTMLInputElement;
          if (input.value) window.location.href = `/u/${input.value}`;
        }}
        className="relative flex items-center w-full glass-card p-2 pl-8 overflow-hidden transition-all font-medium shadow-2xl border-white/20 gap-2"
      >
        <input 
          type="text" 
          name="username"
          autoComplete="off"
          placeholder="search_handle" 
          className="bg-transparent border-none outline-none flex-1 min-w-0 font-black placeholder:text-muted-foreground/20 text-foreground uppercase tracking-widest text-sm"
          required
        />
        <button type="submit" className="flex-shrink-0 group flex items-center justify-center px-10 py-4 rounded-full bg-foreground text-background font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all gap-3 shadow-xl">
          View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </button>
      </form>
    </div>
  );
}
