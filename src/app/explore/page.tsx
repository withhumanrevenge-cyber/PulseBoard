import { getExploreUsers } from "@/app/actions/explore";
import Link from "next/link";
import { ArrowRight, Globe, Github, Zap } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import ExploreSearch from "@/components/explore-search";

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
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between glass sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <PulseLogo className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight">PulseBoard</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-border/50 bg-foreground text-background text-xs font-bold hover:scale-105 active:scale-95 transition-all"
          >
            My Console
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary/80">
            <Globe className="w-3 h-3" />
            Public Directory
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
            EXPLORE <br />
            <span className="text-gradient">NETWORK</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Real-time transparency from the world&apos;s most active builders.
          </p>

          <ExploreSearch />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {users.length === 0 && (
            <div className="col-span-full p-32 text-center rounded-[3rem] glass border border-dashed border-border/40 flex flex-col items-center gap-6">
              <Github className="w-12 h-12 text-muted-foreground/20" />
              <div className="space-y-2">
                <p className="font-black text-xl tracking-tight">Network is warming up</p>
                <p className="text-muted-foreground font-medium text-sm max-w-sm">
                  Be the first to launch your pulse and get featured in the global directory.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:scale-105 active:scale-95 transition-all"
              >
                Launch Yours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/u/${user.username}`}
              className="group relative flex flex-col items-center justify-between p-12 rounded-[3.5rem] bg-secondary/5 border border-white/5 hover:border-primary/20 transition-all duration-700 h-96 overflow-hidden backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-1000">
                <Github size={200} />
              </div>

              <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-[6px] border-background shadow-2xl ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all duration-700 relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="text-center space-y-2 relative z-10 mt-6 flex-1 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-2">Live Board</span>
                <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">
                  @{user.username}
                </h3>
              </div>

              <div className="relative z-10 w-full pt-8 border-t border-white/5 flex items-center justify-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Pulse</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </section>

        <section className="p-16 rounded-[4rem] bg-foreground text-background flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 text-background/10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <Zap size={240} />
          </div>
          <div className="space-y-6 max-w-xl relative z-10 text-center md:text-left">
            <h2 className="text-5xl font-black tracking-tight leading-none">Join the transparency revolution.</h2>
            <p className="text-background/60 font-medium text-lg leading-relaxed">
              Connect your stack, launch your dashboard, and get featured in the global directory.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-12 py-6 bg-primary text-primary-foreground rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 relative z-10 whitespace-nowrap"
          >
            Launch your Pulse
          </Link>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-border/30">
        <p className="text-xs font-black uppercase tracking-[0.6em] opacity-20">Thanks for Shipping</p>
      </footer>
    </div>
  );
}
