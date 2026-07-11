"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { PulseLogo } from "@/components/pulse-logo";
import { KineticSearch } from "@/components/kinetic-search";
import { WelcomeBot } from "@/components/welcome-bot";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-accent/30 bg-background text-foreground overflow-x-hidden">
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-24 space-y-24 md:space-y-40">
        <section className="relative flex flex-col items-center justify-center text-center space-y-12">
          <div className="relative flex flex-col items-center space-y-8">
             <div className="mb-4">
               <WelcomeBot inline />
             </div>
            
            <div className="space-y-6">
               <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] md:leading-[1.0] pb-2 max-w-4xl mx-auto text-gradient">
                 Verified profiles <br className="hidden md:block" /> that stay current.
               </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed"
            >
              Connect your stack and publish a profile that automatically updates with your GitHub activity.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-xl relative z-10"
          >
            <div className="absolute -inset-20 bg-primary/5 blur-[120px] rounded-full -z-10 opacity-40" />
            <KineticSearch 
              prefix="u/" 
              placeholder="github_handle" 
              buttonText="Open Profile" 
            />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 relative z-10">
            {[
              { title: "Live activity", desc: "Real-time commit signals based on your public GitHub data.", icon: Zap },
              { title: "Verified profile", desc: "Trusted metrics for hiring, comparison, and calibration.", icon: Shield },
              { title: "Global directory", desc: "Search and compare profiles by stack and consistency.", icon: Globe },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group h-full"
              >
                <div className="p-10 rounded-2xl bg-card border border-border/50 hover:border-foreground/20 spatial-card h-full flex flex-col justify-between space-y-8 relative overflow-hidden">
                  <div className="space-y-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-accent/50 text-foreground flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500">
                        <f.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
                       <p className="text-muted-foreground text-sm leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                     <span>Explore data</span>
                     <ArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
        </section>

        <footer className="pt-20 pb-12 border-t border-border/50 flex flex-col md:flex-row items-start justify-between gap-12 text-[10px] uppercase tracking-widest font-bold text-muted-foreground relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-foreground">
               <div className="p-1.5 rounded-lg bg-foreground text-background">
                 <PulseLogo className="w-3.5 h-3.5" />
               </div>
               <span className="text-sm tracking-tighter">PulseBoard</span>
            </div>
            <p className="max-w-xs leading-relaxed opacity-60">A clear, consistent view of developer impact and consistency.</p>
          </div>
          <div className="flex items-start gap-20">
             <div className="space-y-4">
                <p className="text-foreground">Directory</p>
                <div className="space-y-2">
                  <Link href="/explore" className="block hover:text-foreground transition-colors">Global Profiles</Link>
                  <Link href="/explore" className="block hover:text-foreground transition-colors">Trending Stack</Link>
                </div>
             </div>
             <div className="space-y-4">
                <p className="text-foreground">Resources</p>
                <div className="space-y-2">
                   <Link href="/explore" className="block hover:text-foreground transition-colors">Documentation</Link>
                   <Link href="/explore" className="block hover:text-foreground transition-colors">API Status</Link>
                </div>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
