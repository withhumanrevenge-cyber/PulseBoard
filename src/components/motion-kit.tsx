"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundOrganism() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Desktop: Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Mobile: Device Orientation (Accelerometer)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return;
      // Map tilt to pseudo-mouse coordinates
      mouseX.set((e.gamma + 90) * (window.innerWidth / 180));
      mouseY.set((e.beta + 180) * (window.innerHeight / 360));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleOrientation);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-40">
      <motion.div 
        style={{
          x: useTransform(springX, (v) => v * 0.05),
          y: useTransform(springY, (v) => v * 0.05),
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]"
      />
      <motion.div 
        style={{
          x: useTransform(springX, (v) => v * -0.03),
          y: useTransform(springY, (v) => v * -0.03),
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px]"
      />
    </div>
  );
}

export function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function onTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(touch.clientX - left);
    mouseY.set(touch.clientY - top);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden group/card ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/card:opacity-100 group-active/card:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, var(--primary), transparent 40%)`
          ),
          opacity: 0.1,
        }}
      />
      {children}
    </motion.div>
  );
}
