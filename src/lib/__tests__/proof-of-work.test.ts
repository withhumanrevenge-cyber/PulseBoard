import { describe, expect, it } from "vitest";
import { summarizeProofOfWork } from "@/lib/proof-of-work";

const pr = (repo: string, stars: number, mergedAt: string) => ({
  mergedAt,
  repository: { nameWithOwner: repo, url: `https://github.com/${repo}`, stargazerCount: stars },
});

describe("summarizeProofOfWork", () => {
  it("returns empty for no PRs", () => {
    expect(summarizeProofOfWork(0, [])).toEqual({
      mergedExternalPRs: 0,
      externalRepos: 0,
      maxRepoStars: 0,
      topContributions: [],
    });
  });

  it("groups by repo, keeps latest merge, ranks by stars then count", () => {
    const pow = summarizeProofOfWork(120, [
      pr("small/lib", 10, "2026-01-01T00:00:00Z"),
      pr("small/lib", 10, "2026-03-01T00:00:00Z"),
      pr("vercel/next.js", 130000, "2025-06-01T00:00:00Z"),
      pr("small/lib", 10, "2026-02-01T00:00:00Z"),
    ]);
    expect(pow.mergedExternalPRs).toBe(120); // exact total from search, not the sample size
    expect(pow.externalRepos).toBe(2);
    expect(pow.maxRepoStars).toBe(130000);
    expect(pow.topContributions[0].repo).toBe("vercel/next.js");
    expect(pow.topContributions[1]).toMatchObject({ repo: "small/lib", mergedPRs: 3, lastMergedAt: "2026-03-01T00:00:00Z" });
  });

  it("skips non-PR search nodes (empty objects)", () => {
    const pow = summarizeProofOfWork(1, [{}, pr("a/b", 1, "2026-01-01T00:00:00Z")]);
    expect(pow.externalRepos).toBe(1);
  });
});
