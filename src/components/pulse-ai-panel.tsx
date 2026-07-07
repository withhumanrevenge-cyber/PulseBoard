"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Star, ArrowUpRight, Loader2, Key, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePulseAI } from "./pulse-ai-context";
import { askPulseAI, type PulseSource, type PulseTurn } from "@/app/actions/pulse-ai";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: PulseSource[];
}

const SUGGESTIONS = [
  "Find consistent React developers",
  "Who are the top Rust engineers?",
  "Analyze @torvalds",
  "Recommend a Python collaborator",
];

const uid = () => Math.random().toString(36).slice(2);

export function PulseAIPanel() {
  const { open, closeChat, consumeSeed } = usePulseAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const seeded = consumeSeed();
    if (seeded) void send(seeded);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || loading) return;

    const history: PulseTurn[] = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { id: uid(), role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    const res = await askPulseAI(prompt, history);
    setLoading(false);

    if (res.error === "not_configured") {
      setNeedsKey(true);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "assistant", content: res.message, sources: res.sources },
    ]);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 z-[90] bg-background/30 backdrop-blur-[2px] md:backdrop-blur-0 md:bg-transparent"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-label="PulseAI Talent Scout assistant"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="fixed z-[95] inset-x-3 bottom-3 top-auto h-[78vh] max-h-[640px]
                       md:inset-x-auto md:right-6 md:bottom-28 md:w-[420px] md:h-[600px]
                       flex flex-col rounded-3xl border border-border/60 overflow-hidden
                       bg-card/70 backdrop-blur-2xl
                       shadow-[0_24px_70px_-12px_rgba(28,25,23,0.45),0_8px_28px_rgba(28,25,23,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]
                       dark:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.8),0_8px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {/* Header */}
            <header className="relative flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-b from-foreground/[0.03] to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold tracking-tight">PulseAI</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Talent Scout</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close assistant"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
              {messages.length === 0 && !needsKey && <EmptyState onPick={(s) => void send(s)} />}

              {needsKey && <ConfigNotice />}

              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {loading && <ThinkingBubble />}
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 border-t border-border/50 p-3 bg-gradient-to-t from-foreground/[0.03] to-transparent"
            >
              <div className="flex items-end gap-2 p-1.5 rounded-2xl bg-background/60 border border-border/60 focus-within:border-foreground/30 transition-colors">
                <label htmlFor="pulse-ai-input" className="sr-only">
                  Message PulseAI
                </label>
                <textarea
                  id="pulse-ai-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Find or analyze a developer…"
                  disabled={needsKey}
                  className="flex-1 resize-none bg-transparent outline-none text-sm font-medium px-3 py-2 max-h-28 placeholder:text-muted-foreground/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || needsKey}
                  aria-label="Send message"
                  className="shrink-0 w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground/50 mt-2 font-medium">
                Grounded in live GitHub data — PulseAI can still make mistakes.
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 pt-6">
      <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border/50 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-foreground" />
      </div>
      <div className="space-y-1.5 max-w-[18rem]">
        <h2 className="text-lg font-bold tracking-tight">Scout the dev community</h2>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          Ask me to find collaborators, analyze a GitHub profile, or compare engineers.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="px-3 py-1.5 rounded-full border border-border/60 bg-background/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConfigNotice() {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <Key className="w-4 h-4" />
        <p className="text-sm font-bold tracking-tight">PulseAI needs a key</p>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
        Add a free <span className="font-mono text-xs">GROQ_API_KEY</span> to your{" "}
        <span className="font-mono text-xs">.env.local</span> and restart the dev server.
      </p>
      <a
        href="https://console.groq.com/keys"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground hover:opacity-80 transition-opacity"
      >
        Get a key <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[88%] px-4 py-2.5 text-sm font-medium leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-foreground text-background rounded-2xl rounded-br-md shadow-sm"
            : "bg-background/70 border border-border/50 text-foreground rounded-2xl rounded-bl-md shadow-sm"
        }`}
      >
        {message.content}
      </div>
      {message.sources && message.sources.length > 0 && (
        <div className="w-full grid grid-cols-1 gap-2 pt-1">
          {message.sources.map((s) => (
            <SourceCard key={s.username} source={s} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SourceCard({ source }: { source: PulseSource }) {
  return (
    <Link
      href={`/u/${source.username}`}
      className="group flex items-center gap-3 p-2.5 rounded-xl bg-background/60 border border-border/50 hover:border-foreground/25 hover:bg-background transition-all cursor-pointer"
    >
      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
        {source.avatarUrl ? (
          <Image src={source.avatarUrl} alt={source.username} fill sizes="40px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Users className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold tracking-tight truncate">@{source.username}</p>
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
          {source.topLanguage && <span className="truncate">{source.topLanguage}</span>}
          {source.totalStars !== null && (
            <span className="inline-flex items-center gap-0.5 shrink-0">
              <Star className="w-3 h-3 fill-current text-amber-500" />
              {source.totalStars.toLocaleString()}
            </span>
          )}
          {source.devScore !== null && <span className="shrink-0">· Score {source.devScore}</span>}
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
    </Link>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md bg-background/70 border border-border/50 w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
