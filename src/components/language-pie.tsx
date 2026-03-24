"use client";

import { motion } from "framer-motion";

interface Language {
  name: string;
  percentage: number;
  color: string;
}

export function LanguagePie({ languages, topLanguage }: { languages: Language[], topLanguage?: string }) {
  const total = languages.reduce((acc, l) => acc + l.percentage, 0);
  let cumulativePercent = 0;

  return (
    <div className="relative w-full aspect-square flex items-center justify-center group">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {languages.map((lang, i) => {
          const startPercent = cumulativePercent;
          cumulativePercent += lang.percentage;
          
          const startX = Math.cos(2 * Math.PI * (startPercent / 100));
          const startY = Math.sin(2 * Math.PI * (startPercent / 100));
          const endX = Math.cos(2 * Math.PI * (cumulativePercent / 100));
          const endY = Math.sin(2 * Math.PI * (cumulativePercent / 100));
          
          const largeArcFlag = lang.percentage > 50 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${50 + 40 * startX} ${50 + 40 * startY}`,
            `A 40 40 0 ${largeArcFlag} 1 ${50 + 40 * endX} ${50 + 40 * endY}`,
            `Z`
          ].join(' ');

          return (
            <motion.path
              key={lang.name}
              d={pathData}
              fill={lang.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="cursor-pointer transition-all border-none outline-none"
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-2">
         <span className="text-[10px] font-black text-black uppercase tracking-tighter text-center max-w-[40px] leading-tight break-words">
            {topLanguage || "Tech"}
         </span>
         <span className="text-[6px] font-black uppercase tracking-widest text-black/20 mt-1">Mastery</span>
      </div>
    </div>
  );
}
