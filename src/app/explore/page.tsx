import { getExploreUsers } from "@/app/actions/explore";
import Link from "next/link";
import { ArrowRight, Globe, Github, Zap } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import { ExploreGrid } from "@/components/explore-grid";
import { KineticSearch } from "@/components/kinetic-search";
import { SmartAuthButton } from "@/components/smart-auth-button";

export const revalidate = 600;

export default async function ExplorePage() {
  let users: { id: string; username: string; avatar_url: string }[] = [];

  try {
    users = await getExploreUsers();
  } catch {
    users = [];
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-background text-foreground">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5">
            <PulseLogo className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">PulseBoard</span>
        </Link>

        <div className="flex items-center gap-7">
          <Link href="/" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all hidden md:block">
            Home
          </Link>
          <SmartAuthButton
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/50 bg-foreground text-background text-[11px] font-semibold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all outline-none"
          >
            Console
          </SmartAuthButton>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-32 space-y-32 text-center">
        <section className="space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/80">
            <Globe className="w-3.5 h-3.5" />
            Public Protocol Directory
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] flex flex-col items-center">
            <span>Explore <span className="font-light italic text-muted-foreground/60">the</span></span>
            <span className="text-gradient font-black">Network</span>
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl font-normal max-w-2xl mx-auto leading-relaxed">
            Real-time shipping velocity from the world&apos;s most active engineering nodes.
          </p>

          <KineticSearch 
            prefix="" 
            placeholder="Search Handle" 
            buttonText="View" 
          />
        </section>

        {(!users || users.length === 0) ? (
          <section className="p-32 text-center rounded-[3rem] glass border border-dashed border-border/40 flex flex-col items-center gap-6">
            <Github className="w-12 h-12 text-muted-foreground/20" />
            <div className="space-y-4">
              <p className="font-bold text-2xl tracking-tight">Protocol Offline</p>
              <p className="text-muted-foreground font-normal text-lg max-w-sm">
                Be the first to launch your pulse and get featured in the global directory.
              </p>
            </div>
            <SmartAuthButton
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all outline-none shadow-2xl shadow-primary/20"
            >
              Launch Pulse <ArrowRight className="w-4 h-4" />
            </SmartAuthButton>
          </section>
        ) : (
          <ExploreGrid users={users} />
        )}

        <section className="p-20 rounded-[4rem] bg-foreground text-background flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-12 text-background/10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <Zap size={300} strokeWidth={0.3} />
          </div>
          <div className="space-y-8 max-w-2xl relative z-10 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">Join <br /> <span className="font-light italic opacity-40">the</span> <span className="font-black">Protocol.</span></h2>
            <p className="text-background/60 font-normal text-xl leading-relaxed">
              Connect your stack, launch your dashboard, and get featured in the global builder directory today.
            </p>
          </div>
          <SmartAuthButton
            className="px-14 py-8 bg-primary text-primary-foreground rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 relative z-10 whitespace-nowrap outline-none"
          >
            Launch Profile
          </SmartAuthButton>
        </section>
      </main>

      <footer className="py-24 text-center border-t border-border/10">
        <p className="text-[10px] font-bold uppercase tracking-[0.8em] opacity-20">Thanks for Shipping</p>
      </footer>
    </div>
  );
}
