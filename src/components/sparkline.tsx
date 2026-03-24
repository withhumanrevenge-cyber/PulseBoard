"use client";

import { motion } from "framer-motion";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "currentColor", width = 120, height = 40 }: SparklineProps) {
  if (!data || data.length < 2) return <div className="w-[120px] h-[40px] opacity-10 border-b border-dashed border-current" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: height - ((val - min) / range) * height,
  }));

  const pathData = `M ${points[0].x} ${points[0].y} ` + 
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");

  return (
    <div className="relative group/spark">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor={color} stopOpacity="0.4" />
             <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <motion.path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#gradient-spark)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </svg>
      {/* Target Dot */}
      <motion.div 
        animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ 
            left: points[points.length-1].x, 
            top: points[points.length-1].y,
            backgroundColor: color 
        }}
        className="absolute w-2 h-2 rounded-full -translate-x-1 -translate-y-1 blur-[1px]"
      />
    </div>
  );
}
