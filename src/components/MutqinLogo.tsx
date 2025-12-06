"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MutqinLogoProps {
  readonly variant?: "sidebar" | "header" | "compact";
  readonly showText?: boolean;
  readonly className?: string;
}

export function MutqinLogo({ variant = "sidebar", showText = true, className }: MutqinLogoProps) {
  // Size variants
  const sizes = {
    sidebar: { icon: 36, text: "text-lg" },
    header: { icon: 32, text: "text-xl" },
    compact: { icon: 24, text: "text-base" },
  };

  const size = sizes[variant];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Logo Icon - with white background removal via CSS filters */}
      <div className="relative flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Mutqin Logo"
          width={size.icon}
          height={size.icon}
          className="object-contain"
          style={{
            // Remove white background: use mix-blend-mode and filters
            mixBlendMode: "multiply",
            filter: "contrast(1.2) brightness(1.1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
          }}
          priority
        />
      </div>
      
      {/* Mutqin Text with Varien Font */}
      {showText && (
        <span
          className={cn(
            "font-bold text-[var(--label)] tracking-tight",
            size.text
          )}
          style={{
            fontFamily: "var(--font-varien), sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Mutqin
        </span>
      )}
    </div>
  );
}

