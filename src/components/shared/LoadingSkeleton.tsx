"use client";

import { cn } from "@/lib/utils";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-[var(--system-fill)]";
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
    />
  );
}

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "table" | "dashboard" | "event-card";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const renderCardSkeleton = () => (
    <LiquidGlassCard
      className={cn("space-y-4", className)}
      blurIntensity="lg"
      interactive={false}
    >
      <div className="space-y-3">
        <Skeleton variant="rectangular" height="24px" width="60%" />
        <Skeleton variant="text" height="16px" width="100%" />
        <Skeleton variant="text" height="16px" width="80%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height="32px" width="100px" />
        <Skeleton variant="rectangular" height="32px" width="100px" />
      </div>
    </LiquidGlassCard>
  );

  const renderListSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg bg-[var(--system-fill)]/30"
        >
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height="20px" width="60%" />
            <Skeleton variant="text" height="16px" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" height="20px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} variant="text" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <LiquidGlassCard
          key={i}
          className="p-6"
          blurIntensity="lg"
          interactive={false}
        >
          <div className="space-y-3">
            <Skeleton variant="text" height="16px" width="60%" />
            <Skeleton variant="text" height="32px" width="80%" />
            <Skeleton variant="rectangular" height="8px" width="100%" />
          </div>
        </LiquidGlassCard>
      ))}
    </div>
  );

  const renderEventCardSkeleton = () => (
    <LiquidGlassCard
      className={cn("space-y-4", className)}
      blurIntensity="lg"
      interactive={false}
    >
      <Skeleton variant="rectangular" height="200px" width="100%" />
      <div className="space-y-3">
        <Skeleton variant="text" height="24px" width="80%" />
        <Skeleton variant="text" height="16px" width="100%" />
        <Skeleton variant="text" height="16px" width="60%" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" height="24px" width="100px" />
        <Skeleton variant="rectangular" height="36px" width="120px" />
      </div>
    </LiquidGlassCard>
  );

  switch (variant) {
    case "card":
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderCardSkeleton()}</div>
          ))}
        </div>
      );
    case "list":
      return renderListSkeleton();
    case "table":
      return renderTableSkeleton();
    case "dashboard":
      return renderDashboardSkeleton();
    case "event-card":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderEventCardSkeleton()}</div>
          ))}
        </div>
      );
    default:
      return renderCardSkeleton();
  }
}

