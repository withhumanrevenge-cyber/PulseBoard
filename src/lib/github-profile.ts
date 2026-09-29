// Public GitHub profile fetch — server-only. Results are cached per username so
// profile views, badges, OG images and the API share one GitHub call per window
// and the registry write happens at most once per window instead of per view.

import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";
import { calculateDevScore, type DevScoreMetrics } from "@/lib/dev-score";
import { normalizeGitHubLogin } from "@/lib/github-username";
import { summarizeProofOfWork, type MergedPRNode, type ProofOfWork } from "@/lib/proof-of-work";
import { supabaseAdmin } from "@/lib/supabase";
import { upsertTalentVector } from "@/lib/vector-store";

const PROFILE_TTL_SECONDS = 600;

// Registry being offline (paused Supabase project etc.) is environmental, not a
// per-request bug — warn once instead of spamming console.error on every view.
let registrySyncWarned = false;

type ContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
};

type RepoNode = {
  name: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  url: string;
  homepageUrl: string | null;
  isFork: boolean;
  createdAt: string;
};

type PublicGitHubResponse = {
  user: {
    name: string | null;
    login: string;
    avatarUrl: string;
    bio: string | null;
    createdAt: string;
    followers: { totalCount: number };
    contributionsCollection: { contributionCalendar: ContributionCalendar };
    repositories: { totalCount: number; nodes: RepoNode[] };
  } | null;
  mergedPRs: { issueCount: number; nodes: MergedPRNode[] };
};

export type PublicGitHubProfile = {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
  totalStars: number;
  contributions: number;
  followers: number;
  joined: string;
  topLanguage: string;
  streak: number;
  mostActiveDay: string;
  consistencyIndex: number;
  growthPulse: number;
  languageMap: { name: string; percentage: number; color: string }[];
  devScore: DevScoreMetrics;
  proofOfWork: ProofOfWork;
  totalRepos: number;
  totalContributions: number;
  fetchedAt: string;
  repos: {
    name: string;
    description: string | null;
    stars: number;
    language?: string | null;
    link: string;
    homepage: string | null;
    created: string;
  }[];
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
  HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Swift: "#ffac45",
  PHP: "#4F5D95", Java: "#b07219", "C#": "#178600",
};

const getLangColor = (name: string) => LANG_COLORS[name] || "#716b64";

const PROFILE_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!, $prQuery: String!) {
    user(login: $login) {
      name
      login
      avatarUrl
      bio
      createdAt
      followers { totalCount }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          name
          description
          stargazerCount
          primaryLanguage { name }
          url
          homepageUrl
          isFork
          createdAt
        }
      }
    }
    mergedPRs: search(query: $prQuery, type: ISSUE, first: 50) {
      issueCount
      nodes {
        ... on PullRequest {
          mergedAt
          repository { nameWithOwner url stargazerCount }
        }
      }
    }
  }
`;

function isNotFound(error: unknown): boolean {
  const errors = (error as { errors?: { type?: string }[] })?.errors;
  return Array.isArray(errors) && errors.some((e) => e.type === "NOT_FOUND");
}

async function fetchProfile(login: string): Promise<PublicGitHubProfile | null> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");

  const octokit = new Octokit({ auth: token });
  const now = new Date();
  const hundredDaysAgo = new Date(now);
  hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);

  let response: PublicGitHubResponse;
  try {
    response = await octokit.graphql<PublicGitHubResponse>(PROFILE_QUERY, {
      login,
      from: hundredDaysAgo.toISOString(),
      to: now.toISOString(),
      prQuery: `is:pr is:merged author:${login} -user:${login} sort:updated-desc`,
    });
  } catch (error) {
    // Unknown user is a real answer (cache it); anything else is transient (don't).
    if (isNotFound(error)) return null;
    throw error;
  }

  const user = response.user;
  if (!user) return null;

  const repos = user.repositories.nodes || [];
  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0);
  const contributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
  const weeks = user.contributionsCollection?.contributionCalendar?.weeks || [];

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayActivity: Record<number, number> = {};
  const allDays = weeks.flatMap((w) => w.contributionDays).reverse();

  for (const day of allDays) {
    dayActivity[day.weekday] = (dayActivity[day.weekday] || 0) + day.contributionCount;
  }

  // Streak: contiguous non-zero days from today back; the first zero-day ends it.
  let currentStreak = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) currentStreak++;
    else break;
  }

  const mostActiveDayIndex = Object.entries(dayActivity).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostActiveDay = mostActiveDayIndex !== undefined ? weekDays[Number(mostActiveDayIndex)] : "Unknown";

  const langMap: Record<string, number> = {};
  repos.forEach((r) => {
    const lang = r.primaryLanguage?.name;
    if (lang) langMap[lang] = (langMap[lang] || 0) + 1;
  });

  const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
  const topLanguage = sortedLangs[0]?.[0] || "TypeScript";

  const totalRepos = repos.length;
  const languageMap = sortedLangs.slice(0, 5).map(([name, count]) => ({
    name,
    percentage: Math.round((count / Math.max(1, totalRepos)) * 100),
    color: getLangColor(name),
  }));

  const activeDaysCount = allDays.filter((d) => d.contributionCount > 0).length;
  const consistencyIndex = Math.round((activeDaysCount / 100) * 100);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentReposCount = repos.filter((r) => new Date(r.createdAt) > thirtyDaysAgo).length;
  const growthPulse = totalStars > 0 ? Math.round((recentReposCount / totalStars) * 100) : 0;

  const proofOfWork = summarizeProofOfWork(response.mergedPRs?.issueCount ?? 0, response.mergedPRs?.nodes ?? []);

  const devScore = calculateDevScore({
    totalStars,
    contributions,
    streak: currentStreak,
    languages: sortedLangs.length,
    activeDays: activeDaysCount,
    mergedExternalPRs: proofOfWork.mergedExternalPRs,
    maxExternalRepoStars: proofOfWork.maxRepoStars,
  });

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("talents").upsert(
      {
        username: user.login,
        full_name: user.name || user.login,
        avatar_url: user.avatarUrl,
        total_stars: totalStars,
        dev_score: devScore.total,
        top_language: topLanguage,
        last_fetch: now.toISOString(),
      },
      { onConflict: "username" }
    );

    if (error && !registrySyncWarned) {
      registrySyncWarned = true;
      console.warn(
        "[REGISTRY_SYNC_SKIPPED]",
        error.message,
        "— talent registry unreachable; profile pages still work. Check your Supabase project."
      );
    }

    if (!error) {
      // Separate, best-effort write: the column comes from 0002 and older
      // registries without it must keep syncing the core fields above.
      void supabaseAdmin
        .from("talents")
        .update({ merged_external_prs: proofOfWork.mergedExternalPRs })
        .eq("username", user.login)
        .then(() => undefined);
    }

    void upsertTalentVector({
      username: user.login,
      fullName: user.name,
      bio: user.bio,
      topLanguage,
      languages: sortedLangs.map(([name]) => name),
      repoText: [
        ...repos.slice(0, 12).map((r) => `${r.name} ${r.description ?? ""}`),
        ...proofOfWork.topContributions.map((c) => c.repo.replace("/", " ")),
      ].join(" "),
    });
  }

  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    totalStars,
    contributions,
    followers: user.followers.totalCount,
    joined: user.createdAt,
    topLanguage,
    streak: currentStreak,
    mostActiveDay,
    consistencyIndex,
    growthPulse: growthPulse || 1,
    languageMap,
    devScore,
    proofOfWork,
    totalRepos: user.repositories.totalCount,
    totalContributions: contributions,
    fetchedAt: now.toISOString(),
    repos: repos
      .filter((r) => !r.isFork)
      .slice(0, 12)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazerCount,
        language: repo.primaryLanguage?.name,
        link: repo.url,
        homepage: repo.homepageUrl || null,
        created: repo.createdAt,
      })),
  };
}

export async function getPublicGitHubProfile(username: string): Promise<PublicGitHubProfile | null> {
  const login = normalizeGitHubLogin(username);
  if (!login) return null;

  const key = login.toLowerCase();
  const cached = unstable_cache(() => fetchProfile(login), ["gh-profile-v2", key], {
    revalidate: PROFILE_TTL_SECONDS,
    tags: [`gh-profile:${key}`],
  });

  try {
    return await cached();
  } catch (error) {
    console.error("[GITHUB_LIVE_FETCH_ERROR]", error instanceof Error ? error.message : error);
    return null;
  }
}
