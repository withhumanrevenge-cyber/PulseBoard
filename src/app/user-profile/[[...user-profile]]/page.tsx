"use client";

import { UserProfile } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-muted">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground font-medium text-sm">Manage your identity, connected accounts, and preferences.</p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden p-2">
            <UserProfile 
              path="/user-profile" 
              routing="path"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full",
                  navbar: "bg-muted/50 border-r border-border",
                  navbarButton: "text-muted-foreground hover:text-foreground font-medium",
                  headerTitle: "text-xl font-semibold tracking-tight",
                  headerSubtitle: "text-muted-foreground font-medium text-sm",
                  profileSectionTitle: "text-xs font-semibold uppercase tracking-widest text-foreground opacity-60",
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
