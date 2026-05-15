"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PulseLogo } from "@/components/pulse-logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Talents", href: "/explore", protected: false },
    { name: "Comparison", href: "/compare", protected: false },
    { name: "Dashboard", href: "/dashboard", protected: true },
    { name: "Team", href: "/fleet", protected: true },
  ];

  return (
    <header className="px-6 h-14 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="p-1.5 rounded-lg bg-foreground text-background vercel-shadow">
            <PulseLogo className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tighter">PulseBoard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const content = (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-accent/50 rounded-md -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );

            if (link.protected) {
              return <SignedIn key={link.href}>{content}</SignedIn>;
            }
            return content;
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="h-8 px-4 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all vercel-shadow">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-7 h-7 rounded-md vercel-shadow",
                userButtonPopoverCard: "vercel-shadow border-border"
              }
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
