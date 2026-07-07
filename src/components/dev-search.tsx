"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Users, BookMarked, ArrowUpRight, Loader2, Plus, Check, SearchX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { askDevSearch } from "@/app/actions/dev-search";
import type { DevSearchResult, DevSearchUser } from "@/lib/dev-search";
import { useComparisonRegistry } from "@/lib/use-comparison";
import { Skel } from "@/components/skeletons";

const EXAMPLES = [
  "Top developers in India in TypeScript",
  "Rust engineers in Berlin",
  "Machine learning devs with 1000+ followers",
  "Best Python developers in Brazil",
];

export function DevSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DevSearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function run(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setQuery(trimmed);
    setLoading(true);
    try {
      const res = await askDevSearch(trimmed);
      setResult(res);
    } catch {
      setResult({
        ok: false,
        query: trimmed,
        filters: { keywords: null, language: null, location: null, minFollowers: null, minRepos: null, sort: null },
        totalCount: 0,
        users: [],
        error: "Search failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const chips = result
    ? [
        result.filters.language && { label: `Language · ${result.filters.language}` },
        result.filters.location && { label: `Location · ${result.filters.location}` },
        result.filters.minFollowers && { label: `Followers ≥ ${result.filters.minFollowers.toLocaleString()}` },
        result.filters.minRepos && { label: `Repos ≥ ${result.filters.minRepos}` },
        result.filters.keywords && { label: `Focus · ${result.filters.keywords}` },
        { label: `Sorted by ${result.filters.sort ?? "followers"}` },
      ].filter((c): c is { label: string } => Boolean(c))
    : [];

  return (
    <div className="w-full space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative flex items-center w-full p-1.5 h-16 bg-card border border-border rounded-2xl transition-all focus-within:border-foreground/25 focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--foreground)_6%,transparent)] elev-2">
          <div className="pl-4 pr-1 text-muted-foreground">
            <Sparkles size={18} />
          </div>
          <label htmlFor="dev-search-input" className="sr-only">
            Ask anything about developers
          </label>
          <input
            id="dev-search-input"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask anything — "top developers in India in TypeScript"'
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm md:text-base font-medium placeholder:text-muted-foreground/50 text-foreground min-w-0"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="shrink-0 flex items-center gap-2 px-6 h-12 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Search
          </button>
        </div>
      </form>

      {!result && !loading && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => void run(ex)}
              className="px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {loading && <SearchSkeleton />}

      <AnimatePresence mode="wait">
        {!loading && result && (
          <motion.div
            key={result.query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {result.ok && chips.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Understood as
                </span>
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="px-3 py-1 rounded-full bg-accent/60 border border-border text-[11px] font-semibold text-foreground"
                  >
                    {c.label}
                  </span>
                ))}
                {result.totalCount > 0 && (
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {result.totalCount.toLocaleString()} matches on GitHub
                  </span>
                )}
              </div>
            )}

            {result.ok && result.users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                {result.users.map((u, i) => (
                  <ResultCard key={u.login} user={u} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-card border border-border elev-1 flex flex-col items-center gap-5 max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/50">
                  <SearchX size={26} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold tracking-tight">
                    {result.error ? "Search hit a snag" : "No developers matched"}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                    {result.error
                      ? "GitHub could not process this search. Try simpler wording."
                      : "Try broadening the location or dropping a filter."}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ user, index }: { user: DevSearchUser; index: number }) {
  const { toggleNode, isSelected } = useComparisonRegistry();
  const selected = isSelected(user.login);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-5 rounded-2xl bg-card border border-border spatial-card"
    >
      <button
        onClick={() => toggleNode({ id: user.login, username: user.login, avatar_url: user.avatarUrl })}
        aria-label={selected ? `Remove ${user.login} from comparison` : `Add ${user.login} to comparison`}
        className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all cursor-pointer ${
          selected ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        {selected ? <Check size={14} /> : <Plus size={14} />}
      </button>

      <Link href={`/u/${user.login}`} className="block space-y-4 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
            <Image src={user.avatarUrl} alt={user.login} fill sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0 pr-8">
            <p className="text-base font-bold tracking-tight truncate">{user.name || user.login}</p>
            <p className="text-xs font-medium text-muted-foreground truncate">@{user.login}</p>
          </div>
        </div>

        {user.bio && (
          <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{user.bio}</p>
        )}

        <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1.5">
            <Users size={12} />
            {user.followers.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookMarked size={12} />
            {user.publicRepos.toLocaleString()} repos
          </span>
          {user.location && (
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin size={12} />
              <span className="truncate">{user.location}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          View pulse profile <ArrowUpRight size={12} />
        </div>
      </Link>
    </motion.div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-card border border-border space-y-4 elev-1">
          <div className="flex items-center gap-4">
            <Skel className="w-14 h-14 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skel className="w-32 h-4" />
              <Skel className="w-20 h-3" />
            </div>
          </div>
          <Skel className="w-full h-3" />
          <Skel className="w-2/3 h-3" />
          <div className="flex gap-4">
            <Skel className="w-14 h-3" />
            <Skel className="w-16 h-3" />
            <Skel className="w-14 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
