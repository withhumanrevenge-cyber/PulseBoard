// Proof of work: pull requests merged into repositories the developer does NOT own.
// Another maintainer reviewed and accepted the code, so this is far harder to game
// than stars on your own repos or raw commit counts.

export interface MergedPRNode {
  mergedAt?: string | null;
  repository?: {
    nameWithOwner: string;
    url: string;
    stargazerCount: number;
  } | null;
}

export interface ExternalContribution {
  repo: string;
  url: string;
  stars: number;
  mergedPRs: number;
  lastMergedAt: string | null;
}

export interface ProofOfWork {
  /** Total merged PRs into other people's repos (exact, from search issueCount). */
  mergedExternalPRs: number;
  /** Distinct external repos seen in the sampled PRs. */
  externalRepos: number;
  /** Highest star count among repos the developer got code merged into. */
  maxRepoStars: number;
  topContributions: ExternalContribution[];
}

export const EMPTY_PROOF_OF_WORK: ProofOfWork = {
  mergedExternalPRs: 0,
  externalRepos: 0,
  maxRepoStars: 0,
  topContributions: [],
};

export function summarizeProofOfWork(totalCount: number, nodes: MergedPRNode[]): ProofOfWork {
  const byRepo = new Map<string, ExternalContribution>();

  for (const node of nodes) {
    const repo = node?.repository;
    if (!repo?.nameWithOwner) continue;
    const existing = byRepo.get(repo.nameWithOwner);
    const mergedAt = node.mergedAt ?? null;
    if (existing) {
      existing.mergedPRs++;
      if (mergedAt && (!existing.lastMergedAt || mergedAt > existing.lastMergedAt)) {
        existing.lastMergedAt = mergedAt;
      }
    } else {
      byRepo.set(repo.nameWithOwner, {
        repo: repo.nameWithOwner,
        url: repo.url,
        stars: repo.stargazerCount ?? 0,
        mergedPRs: 1,
        lastMergedAt: mergedAt,
      });
    }
  }

  const repos = Array.from(byRepo.values());
  // Rank by reach first (a PR into a 50k-star project outweighs many into tiny ones),
  // then by how often they contributed there.
  repos.sort((a, b) => b.stars - a.stars || b.mergedPRs - a.mergedPRs);

  return {
    mergedExternalPRs: Math.max(totalCount, nodes.length),
    externalRepos: repos.length,
    maxRepoStars: repos[0]?.stars ?? 0,
    topContributions: repos.slice(0, 6),
  };
}
