"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface KineticSearchProps {
  prefix?: string;
  placeholder?: string;
  buttonText?: string;
}

export function KineticSearch({ 
  prefix = "u/", 
  placeholder = "github_handle",
  buttonText = "Search"
}: KineticSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto relative group"
    >
      <div 
        className={`relative flex items-center w-full p-1 h-14 bg-card border border-border rounded-lg transition-all duration-200 ${isFocused ? 'ring-2 ring-foreground/5 border-foreground/20' : ''}`}
      >
        <div className="flex-1 flex items-center pl-4 gap-3 z-10">
          <Terminal size={16} className="text-muted-foreground" />
          
          {prefix && (
            <span className={`text-sm font-medium transition-colors duration-200 ${isFocused ? 'text-foreground' : 'text-muted-foreground'}`}>
              {prefix}
            </span>
          )}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('username') as HTMLInputElement;
              if (input?.value) router.push(`/u/${input.value}`);
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
              className="bg-transparent border-none outline-none w-full font-medium placeholder:text-muted-foreground/40 text-foreground text-sm h-full"
              required
            />
          </form>
        </div>

        <button 
          onClick={() => {
            const input = containerRef.current?.querySelector('input');
            if (input?.value) router.push(`/u/${input.value}`);
          }}
          className="flex-shrink-0 flex items-center justify-center px-6 h-10 rounded-md bg-foreground text-background font-medium text-sm transition-all mr-1 hover:opacity-90"
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
}
