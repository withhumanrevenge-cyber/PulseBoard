import { Metadata } from "next";
import { cache } from "react";
import { getPublicGitHubData, type PublicGitHubProfile } from "@/app/actions/public-github";
import { PublicProfileView } from "@/components/public-profile-view";
import { Activity } from "lucide-react";

export const revalidate = 300;

// generateMetadata and the page both need the profile — dedupe to one fetch per request.
const getProfile = cache((username: string) => getPublicGitHubData(username));

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { username } = await props.params;
  const id = username === "demo" ? "levelsio" : username;
  const profile = await getProfile(id);

  if (!profile) return { title: "Profile Not Found | PulseBoard" };

  return {
    title: `${profile.name || username} | PulseBoard`,
    description: `View ${profile.name || username}'s public activity, contributions, and stack.`,
    openGraph: {
      images: [profile.avatarUrl],
    },
  };
}

export default async function PublicPage(props: PageProps) {
  const { username } = await props.params;
  const id = username === "demo" ? "levelsio" : username;
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

  const typedProfile = profile as PublicGitHubProfile;

  return (
    <PublicProfileView 
      username={id} 
      profile={typedProfile} 
      repos={typedProfile.repos || []} 
    />
  );
}
