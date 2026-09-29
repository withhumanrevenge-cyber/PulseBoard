import { DEV_SCORE_MAX } from "@/lib/dev-score";

type FleetNode = {
    totalStars?: number;
    devScore?: { total?: number; consistency?: number };
    topLanguage?: string;
};

export function calculateFleetSynergy(nodes: FleetNode[]) {
    if (nodes.length === 0) return { score: 0, label: "No profiles", color: "text-white" };

    const avgScore = nodes.reduce((acc, curr) => acc + (curr.devScore?.total || 0), 0) / nodes.length;

    const languages = new Set(nodes.map(n => n.topLanguage));
    const langDiversity = languages.size / nodes.length;

    // consistency is on a 0–DEV_SCORE_MAX.consistency scale; scale to 0–100
    // before averaging with avgScore, which is already 0–100.
    const avgConsistency100 =
      (nodes.reduce((acc, curr) => acc + (curr.devScore?.consistency || 0), 0) / nodes.length) *
      (100 / DEV_SCORE_MAX.consistency);

    let synergy = (avgScore * 0.6) + (avgConsistency100 * 0.4);

    if (langDiversity > 0.6) synergy += 10;
    if (langDiversity < 0.3 && nodes.length > 2) synergy -= 5;

    const score = Math.min(Math.round(synergy), 100);

    let label = "Standard Team";
    let color = "text-white";

    if (score > 85) { label = "High-performing team"; color = "text-primary"; }
    else if (score > 70) { label = "Strong momentum"; color = "text-emerald-500"; }
    else if (score < 40) { label = "Low activity"; color = "text-rose-500"; }

    return { score, label, color };
}
