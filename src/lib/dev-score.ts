// DevScore v2 (0–100). Each component is capped so no single vanity metric dominates.
//   impact        30  stars on own repos (log-scaled)
//   velocity      25  contributions in the 100-day window
//   collaboration 20  PRs merged into other people's repos + reach of those repos
//   consistency   15  share of active days + current streak
//   breadth       10  languages shipped

export const DEV_SCORE_MAX = {
  impact: 30,
  velocity: 25,
  collaboration: 20,
  consistency: 15,
  breadth: 10,
} as const;

export interface DevScoreMetrics {
  total: number;
  impact: number;
  velocity: number;
  collaboration: number;
  consistency: number;
  breadth: number;
  labels: string[];
}

export interface DevScoreInput {
  totalStars: number;
  contributions: number;
  streak: number;
  languages: number;
  /** Days with ≥1 contribution in the 100-day window. */
  activeDays?: number;
  mergedExternalPRs?: number;
  maxExternalRepoStars?: number;
}

export function calculateDevScore(input: DevScoreInput): DevScoreMetrics {
  const stars = Math.max(0, input.totalStars);
  const contributions = Math.max(0, input.contributions);
  const streak = Math.max(0, input.streak);
  const activeDays = Math.max(0, Math.min(100, input.activeDays ?? 0));
  const mergedPRs = Math.max(0, input.mergedExternalPRs ?? 0);
  const reach = Math.max(0, input.maxExternalRepoStars ?? 0);

  const impact = Math.min(DEV_SCORE_MAX.impact, Math.floor(Math.log10(stars + 1) * 8));
  const velocity = Math.min(DEV_SCORE_MAX.velocity, Math.floor((contributions / 400) * DEV_SCORE_MAX.velocity));
  const collaboration = Math.min(
    DEV_SCORE_MAX.collaboration,
    Math.min(12, Math.round(Math.log2(mergedPRs + 1) * 3)) +
      (mergedPRs > 0 ? Math.min(8, Math.round(Math.log10(reach + 1) * 2)) : 0)
  );
  const consistency = Math.min(
    DEV_SCORE_MAX.consistency,
    Math.floor((activeDays / 100) * 12) + Math.min(3, Math.floor(streak / 3))
  );
  const breadth = Math.min(DEV_SCORE_MAX.breadth, Math.max(0, input.languages) * 2);

  const total = Math.min(100, impact + velocity + collaboration + consistency + breadth);

  const labels: string[] = [];
  if (total >= 85) labels.push("Elite");
  if (collaboration >= 12) labels.push("OSS Contributor");
  if (impact >= 22) labels.push("High-Impact");
  if (velocity >= 20) labels.push("High-Velocity");
  if (consistency >= 11) labels.push("Consistent");

  return { total, impact, velocity, collaboration, consistency, breadth, labels };
}
