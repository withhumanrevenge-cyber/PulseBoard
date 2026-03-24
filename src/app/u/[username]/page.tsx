import { Metadata } from "next";
import { getPublicGitHubData } from "@/app/actions/public-github";
import PublicProfileView from "@/components/public-profile-view";
import { Activity } from "lucide-react";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { username } = await props.params;
  const id = username === "demo" ? "levelsio" : username;
  const profile = await getPublicGitHubData(id);

  if (!profile) return { title: "Profile Not Found | PulseBoard" };

  return {
    title: `${profile.name || username}'s Live Pulse | PulseBoard`,
    description: `Track ${profile.name || username}'s shipping velocity, open source contributions, and tech stack in real-time.`,
    openGraph: {
      images: [profile.avatarUrl],
    },
  };
}

export default async function PublicPage(props: PageProps) {
  const { username } = await props.params;
  const id = username === "demo" ? "levelsio" : username;
  const profile = await getPublicGitHubData(id);

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

  let privacy = { hideStars: false, hideContributions: false, hideTech: false };
  try {
    const { supabase } = await import("@/lib/supabase");
    if (supabase) {
      const { data } = await supabase
        .from("users")
        .select("privacy_settings")
        .eq("username", id)
        .maybeSingle();
      
      if (data?.privacy_settings) {
        privacy = data.privacy_settings;
      }
    }
  } catch (err) {
    console.warn("[privacy_registry_bypass]", err);
  }

  return <PublicProfileView username={id} profile={profile} privacy={privacy} />;
}
