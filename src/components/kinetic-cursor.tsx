"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function KineticCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const springConfig = { damping: 25, stiffness: 450, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const hoverType = target.closest('[data-cursor]')?.getAttribute('data-cursor') || null;
      setIsHovering(hoverType);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Primary Dot - High Velocity */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 0 : 1
        }}
      />

      {/* Outer Warp Ring - Magnetic Responsive */}
      <motion.div
        className="fixed top-0 left-0 border-[1.5px] border-primary rounded-full pointer-events-none z-[9998] hidden md:block bg-primary/0"
        animate={{
          width: isHovering === 'button' ? 40 : (isHovering === 'text' ? 4 : 32),
          height: isHovering === 'button' ? 40 : (isHovering === 'text' ? 24 : 32),
          borderRadius: isHovering === 'text' ? '2px' : '999px',
          opacity: isHovering === 'text' ? 1 : (isHovering ? 0.8 : 0.3),
          backgroundColor: isHovering === 'button' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Style Injection to hide native cursor on Desktop */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body {
            cursor: none !important;
          }
          a, button, input, [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
