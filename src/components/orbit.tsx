"use client";

import { motion } from "framer-motion";
import { Github, Star, GitCommit, Code, Shield, Zap, Globe, Sparkles } from "lucide-react";

const icons = [
  { Icon: Github, color: "text-slate-900", delay: 0 },
  { Icon: Star, color: "text-amber-500", delay: 1 },
  { Icon: GitCommit, color: "text-indigo-600", delay: 2 },
  { Icon: Code, color: "text-emerald-600", delay: 3 },
  { Icon: Shield, color: "text-blue-600", delay: 4 },
  { Icon: Zap, color: "text-indigo-600", delay: 5 },
  { Icon: Globe, color: "text-slate-400", delay: 6 },
  { Icon: Sparkles, color: "text-yellow-500", delay: 7 },
];

export function OrbitBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center opacity-40">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Orbit Rings */}
        <div className="absolute w-[400px] h-[400px] border border-indigo-100/50 rounded-full" />
        <div className="absolute w-[600px] h-[600px] border border-indigo-50/50 rounded-full" />
        <div className="absolute w-[850px] h-[850px] border border-indigo-50/20 rounded-full" />

        {/* Orbiting Icons */}
        {icons.map((item, i) => {
          const radius = i < 4 ? 200 : 380;
          const duration = i < 4 ? 25 : 40;
          
          return (
            <motion.div
              key={i}
              initial={{ rotate: i * (360 / icons.length) }}
              animate={{ rotate: i * (360 / icons.length) + 360 }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute"
              style={{ width: radius * 2, height: radius * 2 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                    animate={{ rotate: -(i * (360 / icons.length) + 360) }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={`p-3 rounded-2xl bg-white shadow-xl shadow-indigo-50 border border-indigo-50/50 ${item.color}`}
                >
                    <item.Icon className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
