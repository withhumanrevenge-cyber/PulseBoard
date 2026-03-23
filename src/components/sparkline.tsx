"use client";

import { motion } from "framer-motion";

export function Sparkline({ 
  data = [12, 10, 15, 8, 20, 18, 25], 
  color = "currentColor", 
  height = 40, 
  width = 120 
}: { 
  data?: number[]; 
  color?: string; 
  height?: number; 
  width?: number; 
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * stepX,
    y: height - ((val - min) / range) * height + 2,
  }));

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blur-md opacity-20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
