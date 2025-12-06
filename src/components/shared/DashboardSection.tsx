"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "space-y-3",
  md: "space-y-4",
  lg: "space-y-6",
};

export function DashboardSection({
  title,
  description,
  children,
  className,
  headerActions,
  spacing = "md",
}: DashboardSectionProps) {
  return (
    <section className={cn("w-full", className)}>
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            {title && (
              <h2 className="text-2xl font-bold text-[var(--label)] mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[var(--secondary-label)]">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={cn(spacingClasses[spacing])}>{children}</div>
    </section>
  );
}

