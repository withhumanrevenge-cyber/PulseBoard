import { describe, expect, it } from "vitest";
import { calculateDevScore, DEV_SCORE_MAX } from "@/lib/dev-score";

const zero = { totalStars: 0, contributions: 0, streak: 0, languages: 0 };

describe("calculateDevScore", () => {
  it("scores an empty profile as 0", () => {
    const s = calculateDevScore(zero);
    expect(s.total).toBe(0);
    expect(s.labels).toEqual([]);
  });

  it("caps every component at its max and the total at 100", () => {
    const s = calculateDevScore({
      totalStars: 10_000_000,
      contributions: 100_000,
      streak: 365,
      languages: 50,
      activeDays: 100,
      mergedExternalPRs: 10_000,
      maxExternalRepoStars: 500_000,
    });
    expect(s.impact).toBe(DEV_SCORE_MAX.impact);
    expect(s.velocity).toBe(DEV_SCORE_MAX.velocity);
    expect(s.collaboration).toBe(DEV_SCORE_MAX.collaboration);
    expect(s.consistency).toBe(DEV_SCORE_MAX.consistency);
    expect(s.breadth).toBe(DEV_SCORE_MAX.breadth);
    expect(s.total).toBe(100);
    expect(s.labels).toContain("Elite");
  });

  it("maxes sum to exactly 100", () => {
    expect(Object.values(DEV_SCORE_MAX).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("gives no collaboration reach credit without merged PRs", () => {
    const s = calculateDevScore({ ...zero, maxExternalRepoStars: 100_000 });
    expect(s.collaboration).toBe(0);
  });

  it("rewards merged external PRs more than stars alone would suggest", () => {
    const contributor = calculateDevScore({ ...zero, mergedExternalPRs: 20, maxExternalRepoStars: 50_000 });
    expect(contributor.collaboration).toBeGreaterThanOrEqual(12);
    expect(contributor.labels).toContain("OSS Contributor");
  });

  it("ignores negative inputs", () => {
    const s = calculateDevScore({ totalStars: -5, contributions: -1, streak: -3, languages: -2 });
    expect(s.total).toBe(0);
  });
});
