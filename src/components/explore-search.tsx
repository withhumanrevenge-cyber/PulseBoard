"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function ExploreSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const val = inputRef.current?.value.trim();
    if (val) router.push(`/u/${val}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex items-center gap-3 glass border border-border/50 rounded-full p-2 pl-6 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
      <Search className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search a GitHub handle..."
        className="bg-transparent border-none outline-none flex-1 font-medium placeholder:text-muted-foreground/30 text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-black hover:scale-105 active:scale-95 transition-all"
      >
        View
      </button>
    </div>
  );
}
