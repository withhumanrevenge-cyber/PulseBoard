"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Bot, Cpu, Zap, Radio, Terminal } from "lucide-react";

export function ScoutBot() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-500, 500], [20, -20]);
  const rotateY = useTransform(springX, [-500, 500], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative w-32 h-32 md:w-48 md:h-48 group cursor-cell"
    >
      {/* Robot Body */}
      <div className="absolute inset-0 bg-white rounded-[2.5rem] border-4 border-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-1 bg-primary/20" />
         
         <div className="relative flex flex-col items-center gap-4">
            {/* Eyes */}
            <div className="flex gap-6">
               <motion.div 
                 animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                 transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                 className="w-4 h-4 rounded-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.2)]" 
               />
               <motion.div 
                 animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                 transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] }}
                 className="w-4 h-4 rounded-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.2)]" 
               />
            </div>
            
            {/* Status Line */}
            <div className="w-12 h-1 bg-black/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: [-50, 50] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="h-full w-1/2 bg-primary"
               />
            </div>
         </div>
      </div>

      {/* Floating Indicators */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute -top-12 -right-12 p-4 bg-black text-white rounded-2xl border-2 border-white shadow-2xl z-20"
      >
         <Radio size={16} className="animate-pulse text-primary" />
      </motion.div>

      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 opacity-20 group-hover:opacity-40 transition-opacity" />
    </motion.div>
  );
}

export function GeometricParticles() {
  const shapes = Array.from({ length: 15 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
      {shapes.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: ["0%", "100%", "0%"],
            rotate: [0, 360],
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%"]
          }}
          transition={{ 
            duration: 20 + Math.random() * 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute"
        >
          {i % 4 === 0 ? (
             <div className="w-16 h-16 border-2 border-black/[0.05] rounded-full" />
          ) : i % 4 === 1 ? (
             <Terminal size={24} className="text-black/5" />
          ) : i % 4 === 2 ? (
             <div className="w-20 h-2 bg-black/[0.03] rounded-full -rotate-45" />
          ) : (
             <div className="w-12 h-12 border-2 border-black/[0.05] rotate-45" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
