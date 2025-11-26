/**
 * iOS Design System Configuration
 * Liquid Glass & Glassmorphism Design Tokens
 */

export const designTokens = {
  // Glass blur intensities
  blur: {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
  },

  // Glass opacity levels
  opacity: {
    light: {
      sm: "bg-white/10",
      md: "bg-white/15",
      lg: "bg-white/20",
      xl: "bg-white/25",
    },
    dark: {
      sm: "dark:bg-white/5",
      md: "dark:bg-white/8",
      lg: "dark:bg-white/10",
      xl: "dark:bg-white/15",
    },
  },

  // Border styles
  borders: {
    light: "border-white/20",
    medium: "border-white/30",
    strong: "border-white/40",
    dark: {
      light: "dark:border-white/10",
      medium: "dark:border-white/15",
      strong: "dark:border-white/20",
    },
  },

  // Border radius (iOS-like)
  radius: {
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "40px",
  },

  // Shadow/glow effects (Apple's subtle approach)
  shadows: {
    glow: {
      sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
      md: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)",
      lg: "0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)",
      xl: "0 8px 12px rgba(0, 0, 0, 0.12), 0 16px 24px rgba(0, 0, 0, 0.1)",
    },
    depth: {
      sm: "0 4px 16px rgba(0, 0, 0, 0.1)",
      md: "0 8px 32px rgba(0, 0, 0, 0.15)",
      lg: "0 16px 64px rgba(0, 0, 0, 0.2)",
    },
  },

  // Animation timings (iOS-like spring physics)
  animations: {
    spring: {
      gentle: { type: "spring", stiffness: 300, damping: 30 },
      medium: { type: "spring", stiffness: 400, damping: 25 },
      snappy: { type: "spring", stiffness: 500, damping: 20 },
    },
    duration: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      ios: [0.36, 0.66, 0.04, 1],
      smooth: [0.4, 0, 0.2, 1],
    },
  },

  // Z-index layers
  zIndex: {
    base: 0,
    elevated: 10,
    floating: 20,
    overlay: 30,
    modal: 40,
    tooltip: 50,
  },
} as const;

/**
 * Get glass morphism classes
 */
export function getGlassClasses(
  intensity: "sm" | "md" | "lg" | "xl" | "2xl" = "md",
  variant: "light" | "dark" | "auto" = "auto"
) {
  const opacityMap = {
    sm: variant === "auto" ? "bg-white/10 dark:bg-white/5" : variant === "light" ? "bg-white/10" : "dark:bg-white/5",
    md: variant === "auto" ? "bg-white/15 dark:bg-white/8" : variant === "light" ? "bg-white/15" : "dark:bg-white/8",
    lg: variant === "auto" ? "bg-white/20 dark:bg-white/10" : variant === "light" ? "bg-white/20" : "dark:bg-white/10",
    xl: variant === "auto" ? "bg-white/25 dark:bg-white/15" : variant === "light" ? "bg-white/25" : "dark:bg-white/15",
    "2xl": variant === "auto" ? "bg-white/30 dark:bg-white/20" : variant === "light" ? "bg-white/30" : "dark:bg-white/20",
  };

  const blurClass = intensity === "2xl" ? designTokens.blur["2xl"] : designTokens.blur[intensity as "sm" | "md" | "lg" | "xl"];
  return `${opacityMap[intensity]} ${blurClass} border border-white/20 dark:border-white/10`;
}

/**
 * iOS-like hover scale effect
 */
export const hoverScale = {
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98, y: 0 },
};

/**
 * Liquid glass card animation variants
 */
export const liquidGlassVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: designTokens.animations.spring.medium,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: designTokens.animations.spring.gentle,
  },
};

