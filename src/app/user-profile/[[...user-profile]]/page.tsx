"use client";

import { UserProfile } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[140px] animate-float" style={{ animationDelay: "-4s" }} />
      </div>

      <header className="px-6 lg:px-14 h-20 flex items-center glass sticky top-0 z-50">
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Console
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
            <p className="text-muted-foreground font-medium">Manage your identity, connected accounts, and preferences.</p>
          </div>

          <div className="glass-card overflow-hidden shadow-2xl shadow-primary/5 border-primary/5">
            <UserProfile 
              path="/user-profile" 
              routing="path"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full",
                  navbar: "bg-primary/5 border-r border-primary/5",
                  navbarButton: "text-muted-foreground hover:text-foreground font-medium",
                  headerTitle: "text-2xl font-black tracking-tight",
                  headerSubtitle: "text-muted-foreground font-medium",
                  profileSectionTitle: "text-sm font-bold uppercase tracking-wider text-primary opacity-60",
                  userButtonPrimaryHover: "bg-primary",
                  scrollBox: "bg-transparent",
                  pageScrollBox: "bg-transparent",
                  contentPageBox: "bg-transparent",
                }
              }}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
