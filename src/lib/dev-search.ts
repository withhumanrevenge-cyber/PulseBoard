// Natural-language developer search: Groq parses the query into GitHub
// user-search qualifiers, GitHub Search returns live results, top hits get
// enriched with real profile data. Heuristic parser covers the no-key case.

import { Octokit } from "octokit";
import { groqChat, isGroqConfigured } from "@/lib/groq";

export interface DevSearchFilters {
  keywords: string | null;
  language: string | null;
  location: string | null;
  minFollowers: number | null;
  minRepos: number | null;
  sort: "followers" | "repositories" | "joined" | null;
}

export interface DevSearchUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  followers: number;
  publicRepos: number;
}

export interface DevSearchResult {
  ok: boolean;
  query: string;
  filters: DevSearchFilters;
  totalCount: number;
  users: DevSearchUser[];
  error?: string;
}

const EMPTY_FILTERS: DevSearchFilters = {
  keywords: null,
  language: null,
  location: null,
  minFollowers: null,
  minRepos: null,
  sort: null,
};

const KNOWN_LANGS = [
  "typescript", "javascript", "python", "java", "go", "rust", "c++", "c#",
  "php", "ruby", "swift", "kotlin", "dart", "scala", "haskell", "elixir",
  "html", "css", "shell", "lua", "r", "julia", "zig", "solidity",
];

const PARSE_PROMPT = `Convert a natural-language developer search into GitHub user-search filters.
Reply with ONLY minified JSON, no prose:
{"keywords":string|null,"language":string|null,"location":string|null,"min_followers":number|null,"min_repos":number|null,"sort":"followers"|"repositories"|"joined"|null}

Rules:
- language: one programming language if mentioned (canonical name, e.g. "TypeScript").
- location: city/country/region if mentioned (e.g. "India").
- keywords: remaining meaningful terms (domain like "machine learning", role like "security"); drop filler like top/best/developers/engineers/find/show. null if none.
- min_followers / min_repos: only when a number is stated ("1000+ followers").
- sort: "followers" when the query implies top/best/popular/famous; "joined" for newest; else null.`;

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function heuristicParse(query: string): DevSearchFilters {
  const q = query.toLowerCase();
  const filters: DevSearchFilters = { ...EMPTY_FILTERS };

  for (const lang of KNOWN_LANGS) {
    if (new RegExp(`(^|[^a-z#+])${lang.replace(/[+#]/g, "\\$&")}($|[^a-z])`).test(q)) {
      filters.language = lang;
      break;
    }
  }

  const loc = q.match(/\b(?:in|from)\s+([a-z][a-z\s]{1,30}?)(?:\s+(?:in|with|using|who)\b|[,.]|$)/);
  if (loc && loc[1] && !KNOWN_LANGS.includes(loc[1].trim())) {
    filters.location = loc[1].trim();
  }

  const followers = q.match(/(\d+)\s*\+?\s*followers/);
  if (followers) filters.minFollowers = Number(followers[1]);

  if (/\b(top|best|popular|famous|leading)\b/.test(q)) filters.sort = "followers";

  return filters;
}

async function parseQuery(query: string): Promise<DevSearchFilters> {
  if (!isGroqConfigured()) return heuristicParse(query);
  try {
    const reply = await groqChat({
      messages: [
        { role: "system", content: PARSE_PROMPT },
        { role: "user", content: query },
      ],
      temperature: 0,
      maxTokens: 200,
    });
    const parsed = extractJson(reply.content ?? "");
    if (!parsed) return heuristicParse(query);
    return {
      keywords: typeof parsed.keywords === "string" && parsed.keywords ? parsed.keywords : null,
      language: typeof parsed.language === "string" && parsed.language ? parsed.language : null,
      location: typeof parsed.location === "string" && parsed.location ? parsed.location : null,
      minFollowers: typeof parsed.min_followers === "number" ? parsed.min_followers : null,
      minRepos: typeof parsed.min_repos === "number" ? parsed.min_repos : null,
      sort:
        parsed.sort === "followers" || parsed.sort === "repositories" || parsed.sort === "joined"
          ? parsed.sort
          : null,
    };
  } catch {
    return heuristicParse(query);
  }
}

function buildGitHubQuery(filters: DevSearchFilters): string {
  const parts: string[] = ["type:user"];
  if (filters.keywords) parts.unshift(filters.keywords);
  if (filters.language) parts.push(`language:${JSON.stringify(filters.language)}`);
  if (filters.location) parts.push(`location:${JSON.stringify(filters.location)}`);
  if (filters.minFollowers) parts.push(`followers:>=${filters.minFollowers}`);
  if (filters.minRepos) parts.push(`repos:>=${filters.minRepos}`);
  return parts.join(" ");
}

export async function searchGitHubDevelopers(query: string, limit = 9): Promise<DevSearchResult> {
  const trimmed = query.trim();
  const base: DevSearchResult = {
    ok: false,
    query: trimmed,
    filters: { ...EMPTY_FILTERS },
    totalCount: 0,
    users: [],
  };
  if (!trimmed) return { ...base, error: "empty query" };

  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  if (!token) return { ...base, error: "GitHub token not configured" };

  const filters = await parseQuery(trimmed);
  const octokit = new Octokit({ auth: token });

  try {
    const { data } = await octokit.rest.search.users({
      q: buildGitHubQuery(filters),
      sort: filters.sort ?? "followers",
      order: "desc",
      per_page: Math.min(12, Math.max(1, limit)),
    });

    const users = await Promise.all(
      data.items.map(async (item): Promise<DevSearchUser> => {
        try {
          const { data: u } = await octokit.rest.users.getByUsername({ username: item.login });
          return {
            login: u.login,
            name: u.name ?? null,
            avatarUrl: u.avatar_url,
            bio: u.bio ?? null,
            location: u.location ?? null,
            followers: u.followers ?? 0,
            publicRepos: u.public_repos ?? 0,
          };
        } catch {
          return {
            login: item.login,
            name: null,
            avatarUrl: item.avatar_url,
            bio: null,
            location: null,
            followers: 0,
            publicRepos: 0,
          };
        }
      })
    );

    return { ok: true, query: trimmed, filters, totalCount: data.total_count, users };
  } catch (err) {
    const message = err instanceof Error ? err.message : "search failed";
    console.error("[DEV_SEARCH_ERROR]", message);
    return { ...base, filters, error: message };
  }
}
