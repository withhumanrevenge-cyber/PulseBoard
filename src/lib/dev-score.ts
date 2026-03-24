export interface DevScoreMetrics {
  total: number; // 0-100
  velocity: number; // Based on contributions
  impact: number; // Based on stars
  breadth: number; // Based on language variety
  consistency: number; // Based on streak/active days
  labels: string[]; // ['Elite', 'High-Impact', etc.]
}

export function calculateDevScore(
  totalStars: number, 
  contributionCount: number, 
  streak: number, 
  languages: number
): DevScoreMetrics {
  // 1. Impact Weight (Max 40 pts) - logarithmic star scaling
  const impact = Math.min(40, Math.floor(Math.log10(totalStars + 1) * 10));
  
  // 2. Velocity Weight (Max 30 pts)
  const velocity = Math.min(30, Math.floor((contributionCount / 500) * 30));
  
  // 3. Consistency Weight (Max 20 pts)
  const consistency = Math.min(20, (streak * 2) + Math.min(10, Math.floor(contributionCount / 100)));
  
  // 4. Breadth Weight (Max 10 pts)
  const breadth = Math.min(10, languages * 2);

  const total = Math.min(100, impact + velocity + consistency + breadth);

  const labels = [];
  if (total > 90) labels.push("Elite Node");
  if (impact > 30) labels.push("High-Impact");
  if (velocity > 25) labels.push("High-Velocity");
  if (consistency > 15) labels.push("Verified Ship Streak");

  return { total, velocity, impact, breadth, consistency, labels };
}
