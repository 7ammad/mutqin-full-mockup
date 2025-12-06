"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: "bg-[var(--apple-blue)]/10",
    icon: "text-[var(--apple-blue)]",
    border: "border-[var(--apple-blue)]/20",
  },
  green: {
    bg: "bg-[var(--apple-green)]/10",
    icon: "text-[var(--apple-green)]",
    border: "border-[var(--apple-green)]/20",
  },
  purple: {
    bg: "bg-[var(--apple-purple)]/10",
    icon: "text-[var(--apple-purple)]",
    border: "border-[var(--apple-purple)]/20",
  },
  orange: {
    bg: "bg-[var(--apple-orange)]/10",
    icon: "text-[var(--apple-orange)]",
    border: "border-[var(--apple-orange)]/20",
  },
  red: {
    bg: "bg-red-500/10",
    icon: "text-red-500",
    border: "border-red-500/20",
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  className,
  onClick,
}: KPICardProps) {
  const colors = colorClasses[color];
  const isInteractive = !!onClick;

  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.02, y: -2 } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={cn(isInteractive && "cursor-pointer", className)}
    >
      <LiquidGlassCard
        blurIntensity="md"
        interactive={isInteractive}
        className={cn(
          "p-6 transition-all",
          isInteractive && "hover:border-white/25"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--secondary-label)] uppercase tracking-wide mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-[var(--label)] mb-1">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-[var(--secondary-label)] mt-1">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive
                      ? "text-[var(--apple-green)]"
                      : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-[var(--secondary-label)]">
                  {trend.label}
                </span>
              </div>
            )}
          </div>

          {/* Right: Icon */}
          <div
            className={cn(
              "flex-shrink-0 h-12 w-12 rounded-ios-lg flex items-center justify-center",
              colors.bg,
              colors.border,
              "border"
            )}
          >
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>
      </LiquidGlassCard>
    </motion.div>
  );
}

