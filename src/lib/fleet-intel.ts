export function calculateFleetSynergy(nodes: any[]) {
    if (nodes.length === 0) return { score: 0, label: "Empty Fleet", color: "text-white" };

    const totalStars = nodes.reduce((acc, curr) => acc + (curr.totalStars || 0), 0);
    const avgScore = nodes.reduce((acc, curr) => acc + (curr.devScore.total || 0), 0) / nodes.length;
    
    // 1. Language Synergy (Bonus for diversity, but penalty for too many silos)
    const languages = new Set(nodes.map(n => n.topLanguage));
    const langDiversity = languages.size / nodes.length;
    
    // 2. Velocity Consistency
    const avgStreak = nodes.reduce((acc, curr) => acc + (curr.devScore.consistency || 0), 0) / nodes.length;

    // Base Score: (Impact + Velocity)
    let synergy = (avgScore * 0.6) + (avgStreak * 0.4);

    // Diversity Multiplier
    if (langDiversity > 0.6) synergy += 10; // "Versatile Team"
    if (langDiversity < 0.3 && nodes.length > 2) synergy -= 5; // "Redundant Skillset"

    const score = Math.min(Math.round(synergy), 100);

    let label = "Standard Fleet";
    let color = "text-white";

    if (score > 85) { label = "Elite Taskforce"; color = "text-primary"; }
    else if (score > 70) { label = "High Velocity"; color = "text-emerald-500"; }
    else if (score < 40) { label = "Low Impact"; color = "text-rose-500"; }

    return { score, label, color };
}
