import { Metadata } from "next";
import { cache } from "react";
import { getPublicGitHubProfile } from "@/lib/github-profile";
import { getPublicProfileSettings } from "@/lib/public-settings";
import { PublicProfileView } from "@/components/public-profile-view";
import { Activity } from "lucide-react";

export const revalidate = 300;

// generateMetadata and the page both need the profile — dedupe to one fetch per request.
const getProfile = cache((username: string) => getPublicGitHubProfile(username));

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function resolveId(username: string) {
  return username === "demo" ? "levelsio" : username;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { username } = await props.params;
  const profile = await getProfile(resolveId(username));

  if (!profile) return { title: "Profile Not Found | PulseBoard", robots: { index: false } };

  const name = profile.name || profile.username;
  const pow = profile.proofOfWork;
  const description =
    pow.mergedExternalPRs > 0
      ? `${name} has ${pow.mergedExternalPRs} pull requests merged into ${pow.externalRepos}+ open-source projects. DevScore ${profile.devScore.total}/100 · ${profile.topLanguage}.`
      : `${name}'s verified developer profile — DevScore ${profile.devScore.total}/100 · ${profile.topLanguage}.`;

  return {
    title: `${name} (@${profile.username}) | PulseBoard`,
    description,
    alternates: { canonical: `/u/${profile.username}` },
    openGraph: { title: `${name} on PulseBoard`, description, type: "profile" },
    twitter: { card: "summary_large_image", title: `${name} on PulseBoard`, description },
  };
}

export default async function PublicPage(props: PageProps) {
  const { username } = await props.params;
  const id = resolveId(username);
  const profile = await getProfile(id);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10 text-center bg-background">
        <Activity className="w-10 h-10 text-primary animate-pulse" />
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Profile Offline</h1>
          <p className="text-muted-foreground font-medium max-w-sm">
            Could not retrieve data for &quot;{username}&quot;. Ensure the GitHub handle is correct and public.
          </p>
        </div>
      </div>
    );
  }

  const settings = await getPublicProfileSettings(profile.username);

  return (
    <PublicProfileView
      username={profile.username}
      profile={profile}
      repos={profile.repos || []}
      settings={settings}
    />
  );
}
