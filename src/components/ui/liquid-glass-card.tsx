"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  blurIntensity?: "sm" | "md" | "lg" | "xl" | "2xl";
  glowIntensity?: "none" | "sm" | "md" | "lg" | "xl";
  borderRadius?: string;
  padding?: string;
  tint?: string; // Apple's tint color for prominence
  variant?: "regular" | "prominent"; // Apple's glass variants
}

export const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(({
  children,
  className,
  interactive = true,
  blurIntensity = "lg",
  glowIntensity = "sm",
  borderRadius = "24px",
  padding = "p-6",
  tint,
  variant = "regular",
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for liquid effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth following
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), {
    stiffness: 300,
    damping: 30,
  });

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
  };

  // Apple's subtle shadow approach - dark shadows for depth, minimal glow
  const glowStyles = {
    none: "0 1px 2px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
    md: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)",
    lg: "0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)",
    xl: "0 8px 12px rgba(0, 0, 0, 0.12), 0 16px 24px rgba(0, 0, 0, 0.1)",
  };

  // Apple's layered approach: Background, Middle, Foreground (subtle opacity)
  const backgroundClass = variant === "prominent" 
    ? "bg-white/12 dark:bg-white/6" 
    : "bg-white/8 dark:bg-white/4";
  const borderClass = variant === "prominent"
    ? "border-white/25 dark:border-white/12"
    : "border-white/15 dark:border-white/8";

  return (
    <motion.div
      ref={ref || cardRef}
      className={cn(
        "relative overflow-hidden",
        // Background layer (Apple's base layer)
        backgroundClass,
        borderClass,
        blurClasses[blurIntensity],
        "transition-all duration-300",
        className
      )}
      style={{
        borderRadius,
        boxShadow: glowStyles[glowIntensity],
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: "preserve-3d",
        // Apple's tint color (if provided)
        ...(tint && {
          backgroundColor: `${tint}15`,
          borderColor: `${tint}30`,
        }),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
    >
      {/* Middle layer - Reflection effect (Apple's subtle system effect) */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: tint
            ? `linear-gradient(135deg, ${tint}10 0%, ${tint}05 50%, transparent 100%)`
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* Foreground layer - Refraction highlight (Apple's subtle system effect) */}
      {isHovered && interactive && (
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            background: tint
              ? `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${tint}15 0%, transparent 50%)`
              : "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          }}
        />
      )}

      {/* Inner border highlight - Apple's subtle approach */}
      <div
        className="absolute inset-[1px] opacity-30"
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)",
        }}
      />

      {/* Content - Foreground layer */}
      <div className={cn("relative z-10", padding)}>{children}</div>
    </motion.div>
  );
});

LiquidGlassCard.displayName = "LiquidGlassCard";

