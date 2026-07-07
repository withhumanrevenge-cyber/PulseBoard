"use server";

import {
  groqChat,
  isGroqConfigured,
  type ChatMessage,
  type ToolDefinition,
} from "@/lib/groq";
import { searchDevelopers, type ScoredDeveloper } from "@/lib/vector-store";
import { searchGitHubDevelopers } from "@/lib/dev-search";
import { getPublicGitHubData } from "@/app/actions/public-github";

export interface PulseSource {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  topLanguage: string | null;
  totalStars: number | null;
  devScore: number | null;
}

export interface PulseTurn {
  role: "user" | "assistant";
  content: string;
}

export interface PulseAIResult {
  ok: boolean;
  message: string;
  sources: PulseSource[];
  error?: "not_configured" | "failed";
}

const SYSTEM_PROMPT = `You are PulseAI, the Talent Scout agent inside PulseBoard — a developer reputation platform.

Your job is to help the developer community: find collaborators, scout hiring candidates, analyze a developer's strengths, and compare engineers. You serve recruiters, founders, OSS maintainers, and developers researching peers.

Hard rules:
- Ground EVERY factual claim about a specific developer in tool results. Never invent stars, languages, streaks, or scores.
- Use search_github for open-ended discovery across ALL of GitHub (by location, language, popularity — e.g. "top developers in India in TypeScript").
- Use search_developers for the PulseBoard talent registry (people already indexed here).
- Use analyze_developer when the user names a specific GitHub handle and wants depth.
- If a tool returns nothing, say so plainly and suggest a refinement. Do not fabricate profiles.
- Refer to developers by their GitHub handle with an @ prefix.
- Be concise and skimmable. Lead with the answer. Use short paragraphs or tight bullet lists. No emojis.
- DevScore is 0–100 (impact + velocity + consistency + breadth). Explain metrics in plain language when relevant.`;

const TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "search_developers",
      description:
        "Semantic search over the PulseBoard talent registry. Use for finding or recommending developers by stack, focus, or impact (e.g. 'rust systems engineers', 'consistent react developers').",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural-language description of the developer profile to find.",
          },
          limit: {
            type: "integer",
            description: "How many developers to return (1-10).",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_github",
      description:
        "Live search across ALL GitHub users. Use for open-ended discovery by location, language, followers, or popularity (e.g. 'top TypeScript developers in India').",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural-language description of the developers to find.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_developer",
      description:
        "Fetch a single developer's live GitHub metrics (stars, contributions, streak, languages, DevScore, top repos) by exact GitHub handle.",
      parameters: {
        type: "object",
        properties: {
          username: { type: "string", description: "Exact GitHub login/handle." },
        },
        required: ["username"],
      },
    },
  },
];

async function runTool(
  name: string,
  args: Record<string, unknown>,
  collected: Map<string, PulseSource>
): Promise<string> {
  if (name === "search_developers") {
    const query = String(args.query ?? "").trim();
    const limit = Math.min(10, Math.max(1, Number(args.limit) || 6));
    if (!query) return JSON.stringify({ error: "empty query" });
    const results = await searchDevelopers(query, limit);
    results.forEach((r) => collected.set(r.username, toSource(r)));
    return JSON.stringify({
      count: results.length,
      developers: results.map((r) => ({
        username: r.username,
        name: r.fullName,
        topLanguage: r.topLanguage,
        totalStars: r.totalStars,
        devScore: r.devScore,
        match: Number(r.similarity.toFixed(3)),
      })),
    });
  }

  if (name === "search_github") {
    const query = String(args.query ?? "").trim();
    if (!query) return JSON.stringify({ error: "empty query" });
    const res = await searchGitHubDevelopers(query, 8);
    if (!res.ok) return JSON.stringify({ error: res.error || "github search failed" });
    res.users.forEach((u) => {
      collected.set(u.login, {
        username: u.login,
        fullName: u.name,
        avatarUrl: u.avatarUrl,
        topLanguage: res.filters.language,
        totalStars: null,
        devScore: null,
      });
    });
    return JSON.stringify({
      interpreted: res.filters,
      totalMatches: res.totalCount,
      developers: res.users.map((u) => ({
        username: u.login,
        name: u.name,
        bio: u.bio,
        location: u.location,
        followers: u.followers,
        publicRepos: u.publicRepos,
      })),
    });
  }

  if (name === "analyze_developer") {
    const username = String(args.username ?? "").trim().replace(/^@/, "");
    if (!username) return JSON.stringify({ error: "missing username" });
    const p = await getPublicGitHubData(username);
    if (!p) return JSON.stringify({ error: `no public GitHub data for ${username}` });
    collected.set(p.username, {
      username: p.username,
      fullName: p.name,
      avatarUrl: p.avatarUrl,
      topLanguage: p.topLanguage,
      totalStars: p.totalStars,
      devScore: p.devScore.total,
    });
    return JSON.stringify({
      username: p.username,
      name: p.name,
      bio: p.bio,
      totalStars: p.totalStars,
      contributions: p.contributions,
      followers: p.followers,
      streak: p.streak,
      topLanguage: p.topLanguage,
      languages: p.languageMap.map((l) => `${l.name} ${l.percentage}%`),
      devScore: p.devScore,
      mostActiveDay: p.mostActiveDay,
      topRepos: p.repos.slice(0, 5).map((r) => ({
        name: r.name,
        stars: r.stars,
        language: r.language,
        description: r.description,
      })),
    });
  }

  return JSON.stringify({ error: `unknown tool ${name}` });
}

function toSource(r: ScoredDeveloper): PulseSource {
  return {
    username: r.username,
    fullName: r.fullName,
    avatarUrl: r.avatarUrl,
    topLanguage: r.topLanguage,
    totalStars: r.totalStars,
    devScore: r.devScore,
  };
}

export async function askPulseAI(
  prompt: string,
  history: PulseTurn[] = []
): Promise<PulseAIResult> {
  if (!isGroqConfigured()) {
    return { ok: false, message: "", sources: [], error: "not_configured" };
  }

  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return { ok: false, message: "Ask me to find or analyze a developer.", sources: [] };
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: trimmedPrompt },
  ];

  const collected = new Map<string, PulseSource>();

  try {
    for (let round = 0; round < 4; round++) {
      const reply = await groqChat({ messages, tools: TOOLS });
      messages.push({
        role: "assistant",
        content: reply.content ?? "",
        tool_calls: reply.tool_calls,
      });

      if (!reply.tool_calls?.length) {
        return {
          ok: true,
          message: reply.content?.trim() || "I could not find anything relevant. Try rephrasing.",
          sources: Array.from(collected.values()),
        };
      }

      for (const call of reply.tool_calls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          // ignore malformed tool args
        }
        const result = await runTool(call.function.name, args, collected);
        messages.push({ role: "tool", tool_call_id: call.id, content: result });
      }
    }

    const final = await groqChat({ messages, temperature: 0.3 });
    return {
      ok: true,
      message: final.content?.trim() || "Here is what I found.",
      sources: Array.from(collected.values()),
    };
  } catch (err) {
    console.error("[PULSE_AI_ERROR]", err instanceof Error ? err.message : err);
    return {
      ok: false,
      message: "PulseAI hit an error reaching the model. Please try again.",
      sources: Array.from(collected.values()),
      error: "failed",
    };
  }
}
