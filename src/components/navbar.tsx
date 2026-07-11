"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PulseLogo } from "@/components/pulse-logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { name: "Talents", href: "/explore", protected: false },
  { name: "Comparison", href: "/compare", protected: false },
  { name: "Dashboard", href: "/dashboard", protected: true },
  { name: "Team", href: "/fleet", protected: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
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

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <button className="h-8 px-4 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all vercel-shadow cursor-pointer">
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
                userButtonPopoverCard: "vercel-shadow border-border",
              },
            }}
          />
        </SignedIn>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden w-8 h-8 rounded-md border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 top-14 z-40 bg-background/40 backdrop-blur-[2px] cursor-default"
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden absolute top-14 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl p-3 flex flex-col gap-1 elev-3"
            >
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const item = (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-accent/60 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
                if (link.protected) {
                  return <SignedIn key={link.href}>{item}</SignedIn>;
                }
                return item;
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
