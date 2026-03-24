"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useRef } from "react";

interface KineticSearchProps {
  prefix?: string;
  placeholder?: string;
  buttonText?: string;
}

export function KineticSearch({ 
  prefix = "pulseboard.dev/u/", 
  placeholder = "github_handle",
  buttonText = "Access"
}: KineticSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const magneticX = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), springConfig);
  const magneticY = useSpring(useTransform(mouseY, [-100, 100], [-5, 5]), springConfig);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto relative group"
    >
      <div className={`absolute -inset-8 bg-primary/10 rounded-[4rem] blur-[60px] transition-opacity duration-700 ${isFocused ? 'opacity-60' : 'opacity-0'}`} />
      
      <div 
        data-cursor="button"
        className={`relative flex items-center w-full p-2 h-20 glass rounded-full transition-all duration-500 overflow-hidden border ${isFocused ? 'border-primary/50 shadow-[0_0_50px_-10px_rgba(var(--primary-rgb),0.5)]' : 'border-white/10'}`}
      >
        <motion.div 
          style={{ x: magneticX, y: magneticY }}
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full" 
        />
        
        <div className="flex-1 flex items-center pl-10 gap-4 z-10">
          {prefix && (
            <motion.span 
              style={{ x: useTransform(magneticX, (v) => v * 0.4) }}
              className={`text-[11px] font-bold tracking-tight transition-colors duration-500 uppercase flex-shrink-0 ${isFocused ? 'text-primary' : 'text-muted-foreground/30'}`}
            >
              {prefix}
            </motion.span>
          )}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('username') as HTMLInputElement;
              if (input?.value) window.location.href = `/u/${input.value}`;
            }}
            className="flex-1"
          >
            <input 
              type="text" 
              name="username"
              autoComplete="off"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder} 
              className="bg-transparent border-none outline-none w-full font-bold placeholder:text-muted-foreground/20 text-foreground tracking-tight text-xl h-full uppercase"
              required
            />
          </form>
        </div>

        <motion.button 
          style={{ x: magneticX, y: magneticY }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const input = containerRef.current?.querySelector('input');
            if (input?.value) window.location.href = `/u/${input.value}`;
          }}
          className="relative flex-shrink-0 flex items-center justify-center px-12 h-full rounded-2xl bg-foreground text-background font-bold uppercase text-[11px] tracking-[0.2em] transition-all z-20 overflow-hidden group/btn ml-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          
          <span className="relative flex items-center gap-3">
            {buttonText} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-500" />
          </span>
        </motion.button>
      </div>
      
      <motion.div 
        animate={{ opacity: isFocused ? 0.3 : 0 }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground"
      >
        Launch Protocol
      </motion.div>
    </motion.div>
  );
}
