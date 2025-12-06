"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassButtonVariants = cva(
  "relative overflow-hidden font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-white/20 dark:bg-white/10 text-foreground hover:bg-white/30 dark:hover:bg-white/15",
        primary:
          "bg-primary/20 dark:bg-primary/30 text-primary-foreground hover:bg-primary/30 dark:hover:bg-primary/40",
        secondary:
          "bg-secondary/20 dark:bg-secondary/30 text-secondary-foreground hover:bg-secondary/30 dark:hover:bg-secondary/40",
        ghost:
          "bg-transparent hover:bg-white/10 dark:hover:bg-white/5 text-foreground",
        outline:
          "bg-transparent border-2 border-white/30 dark:border-white/20 text-foreground hover:bg-white/10 dark:hover:bg-white/5",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-xl",
        default: "h-11 px-6 text-base rounded-2xl",
        lg: "h-14 px-8 text-lg rounded-2xl",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, children, asChild, ...props }, ref) => {
    // Map our variants to glass button variants
    const _glassVariant = variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "default";

    // Extract motion-specific props to avoid conflicts
    const { _onDrag, _onDragStart, _onDragEnd, ...buttonProps } = props as Record<string, unknown>;
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          glassButtonVariants({ variant, size }),
          "backdrop-blur-md border border-white/20 dark:border-white/10",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          className
        )}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...buttonProps}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Content */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };

