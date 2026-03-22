import { getPublicGitHubData } from "@/app/actions/public-github";
import PublicProfileView from "@/components/public-profile-view";
import { Activity } from "lucide-react";

export const revalidate = 3600;

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

  return <PublicProfileView username={id} profile={profile} />;
}
