export interface DevScoreMetrics {
  total: number;
  velocity: number;
  impact: number;
  breadth: number;
  consistency: number;
  labels: string[];
}

export function calculateDevScore(
  totalStars: number, 
  contributionCount: number, 
  streak: number, 
  languages: number
): DevScoreMetrics {
  const impact = Math.min(40, Math.floor(Math.log10(totalStars + 1) * 10));
  
  const velocity = Math.min(30, Math.floor((contributionCount / 500) * 30));
  
  const consistency = Math.min(20, (streak * 2) + Math.min(10, Math.floor(contributionCount / 100)));
  
  const breadth = Math.min(10, languages * 2);

  const total = Math.min(100, impact + velocity + consistency + breadth);

  const labels = [];
  if (total > 90) labels.push("Elite");
  if (impact > 30) labels.push("High-Impact");
  if (velocity > 25) labels.push("High-Velocity");
  if (consistency > 15) labels.push("Consistent");

  return { total, velocity, impact, breadth, consistency, labels };
}
