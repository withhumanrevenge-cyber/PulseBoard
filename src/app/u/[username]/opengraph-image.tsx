import { ImageResponse } from "next/og";
import { getPublicGitHubProfile } from "@/lib/github-profile";

// Social card for /u/<login>. Every share on LinkedIn/X/Slack renders this, so
// the profile link itself advertises the product.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PulseBoard developer profile";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicGitHubProfile(username === "demo" ? "levelsio" : username);

  const name = profile?.name ?? username;
  const login = profile?.username ?? username;
  const score = profile?.devScore.total ?? 0;
  const prs = profile?.proofOfWork.mergedExternalPRs ?? 0;
  const repos = profile?.proofOfWork.externalRepos ?? 0;
  const lang = profile?.topLanguage ?? "";
  const topRepo = profile?.proofOfWork.topContributions[0]?.repo;

  const stat = (label: string, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 22, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3 }}>{label}</div>
      <div style={{ fontSize: 56, fontWeight: 700, color: "#FFFFFF" }}>{value}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0A0A0A 0%, #111827 60%, #1E1B4B 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} width={160} height={160} style={{ borderRadius: 32 }} alt="" />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 64, fontWeight: 700, color: "#FFFFFF" }}>{name}</div>
            {/* One string child: next/og (Satori) rejects multi-child divs without display:flex. */}
            <div style={{ fontSize: 30, color: "#9CA3AF" }}>{`@${login}${lang ? ` · ${lang}` : ""}`}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 80 }}>
          {stat("DevScore", `${score}/100`)}
          {stat("Merged OSS PRs", String(prs))}
          {stat("Projects", String(repos))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, color: "#C4B5FD" }}>
            {topRepo ? `Code merged into ${topRepo}` : "Verified from public GitHub activity"}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#FFFFFF" }}>PulseBoard</div>
        </div>
      </div>
    ),
    size
  );
}
