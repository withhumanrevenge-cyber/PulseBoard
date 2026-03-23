import { Metadata } from "next";
import { getPublicGitHubData } from "@/app/actions/public-github";
import PublicProfileView from "@/components/public-profile-view";
import { Activity } from "lucide-react";

export const revalidate = 300;

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params;
  const id = username === "demo" ? "levelsio" : username;
  const profile = await getPublicGitHubData(id);

  if (!profile) return { title: "Profile Not Found | PulseBoard" };

  return {
    title: `${profile.name || username}'s Live Pulse | PulseBoard`,
    description: `Track ${profile.name || username}'s shipping velocity, open source contributions, and tech stack in real-time. Transparent building starts here.`,
    openGraph: {
      images: [profile.avatarUrl],
    },
  };
}

export default async function PublicPage(props: { params: Promise<{ username: string }> }) {
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

  // Fetch Privacy Settings from Supabase
  let privacy = { hideStars: false, hideContributions: false, hideTech: false };
  const { supabase } = await import("@/lib/supabase");
  
  if (supabase) {
    const { data } = await supabase
      .from("users")
      .select("privacy_settings")
      .eq("username", id)
      .single();
    
    if (data?.privacy_settings) {
      privacy = data.privacy_settings;
    }
  }

  return <PublicProfileView username={id} profile={profile} privacy={privacy} />;
}
