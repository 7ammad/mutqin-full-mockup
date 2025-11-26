/**
 * Apple Color System
 * 
 * Official Apple system colors and semantic color palette
 * Based on Apple Human Interface Guidelines
 * 
 * Reference: https://developer.apple.com/design/human-interface-guidelines/visual-design/color
 */

/**
 * Apple System Colors (RGB values)
 * These are Apple's official system colors for iOS/macOS
 */
export const appleSystemColors = {
  red: "rgb(255, 59, 48)",
  orange: "rgb(255, 149, 0)",
  yellow: "rgb(255, 204, 0)",
  green: "rgb(76, 217, 100)",
  tealBlue: "rgb(90, 200, 250)",
  blue: "rgb(0, 122, 255)",
  purple: "rgb(88, 86, 214)",
  pink: "rgb(255, 45, 85)",
} as const;

/**
 * Apple System Colors (OKLCH format for better color consistency)
 */
export const appleSystemColorsOKLCH = {
  red: {
    light: "oklch(0.65 0.22 27)",
    dark: "oklch(0.7 0.22 27)",
  },
  orange: {
    light: "oklch(0.75 0.18 70)",
    dark: "oklch(0.8 0.18 70)",
  },
  yellow: {
    light: "oklch(0.85 0.15 95)",
    dark: "oklch(0.9 0.15 95)",
  },
  green: {
    light: "oklch(0.7 0.18 145)",
    dark: "oklch(0.75 0.18 145)",
  },
  tealBlue: {
    light: "oklch(0.7 0.15 200)",
    dark: "oklch(0.75 0.15 200)",
  },
  blue: {
    light: "oklch(0.55 0.22 264)",
    dark: "oklch(0.6 0.22 264)",
  },
  purple: {
    light: "oklch(0.55 0.18 280)",
    dark: "oklch(0.6 0.18 280)",
  },
  pink: {
    light: "oklch(0.65 0.22 350)",
    dark: "oklch(0.7 0.22 350)",
  },
} as const;

/**
 * Semantic Color Names (Apple's approach)
 * These adapt automatically to light/dark mode
 */
export const semanticColors = {
  // Label Colors (Text)
  label: {
    light: "rgb(0, 0, 0)",
    dark: "rgb(255, 255, 255)",
  },
  secondaryLabel: {
    light: "rgb(60, 60, 67)",
    dark: "rgb(235, 235, 245)",
  },
  tertiaryLabel: {
    light: "rgba(60, 60, 67, 0.6)",
    dark: "rgba(235, 235, 245, 0.6)",
  },
  quaternaryLabel: {
    light: "rgba(60, 60, 67, 0.3)",
    dark: "rgba(235, 235, 245, 0.3)",
  },

  // Background Colors
  systemBackground: {
    light: "rgb(255, 255, 255)",
    dark: "rgb(0, 0, 0)",
  },
  secondarySystemBackground: {
    light: "rgb(242, 242, 247)",
    dark: "rgb(28, 28, 30)",
  },
  tertiarySystemBackground: {
    light: "rgb(255, 255, 255)",
    dark: "rgb(44, 44, 46)",
  },

  // Fill Colors
  systemFill: {
    light: "rgba(120, 120, 128, 0.2)",
    dark: "rgba(120, 120, 128, 0.36)",
  },
  secondarySystemFill: {
    light: "rgba(120, 120, 128, 0.16)",
    dark: "rgba(120, 120, 128, 0.32)",
  },
  tertiarySystemFill: {
    light: "rgba(120, 120, 128, 0.12)",
    dark: "rgba(120, 120, 128, 0.24)",
  },
  quaternarySystemFill: {
    light: "rgba(120, 120, 128, 0.08)",
    dark: "rgba(120, 120, 128, 0.18)",
  },

  // Separator Colors
  separator: {
    light: "rgba(60, 60, 67, 0.29)",
    dark: "rgba(84, 84, 88, 0.65)",
  },
  opaqueSeparator: {
    light: "rgb(198, 198, 200)",
    dark: "rgb(56, 56, 58)",
  },

  // Grouped Background
  systemGroupedBackground: {
    light: "rgb(242, 242, 247)",
    dark: "rgb(0, 0, 0)",
  },
  secondarySystemGroupedBackground: {
    light: "rgb(255, 255, 255)",
    dark: "rgb(28, 28, 30)",
  },
  tertiarySystemGroupedBackground: {
    light: "rgb(242, 242, 247)",
    dark: "rgb(44, 44, 46)",
  },
} as const;

/**
 * Get color value for current theme
 */
export function getColor(
  colorName: keyof typeof semanticColors,
  theme: "light" | "dark" = "light"
): string {
  return semanticColors[colorName][theme];
}

/**
 * Get Apple system color
 */
export function getSystemColor(
  colorName: keyof typeof appleSystemColors,
  theme: "light" | "dark" = "light"
): string {
  if (theme === "dark") {
    return appleSystemColorsOKLCH[colorName].dark;
  }
  return appleSystemColorsOKLCH[colorName].light;
}

/**
 * CSS Variable names for Apple colors
 */
export const cssVariableNames = {
  // System Colors
  systemRed: "--apple-red",
  systemOrange: "--apple-orange",
  systemYellow: "--apple-yellow",
  systemGreen: "--apple-green",
  systemTealBlue: "--apple-teal-blue",
  systemBlue: "--apple-blue",
  systemPurple: "--apple-purple",
  systemPink: "--apple-pink",

  // Semantic Colors
  label: "--label",
  secondaryLabel: "--secondary-label",
  tertiaryLabel: "--tertiary-label",
  quaternaryLabel: "--quaternary-label",
  systemBackground: "--system-background",
  secondarySystemBackground: "--secondary-system-background",
  tertiarySystemBackground: "--tertiary-system-background",
  systemFill: "--system-fill",
  secondarySystemFill: "--secondary-system-fill",
  tertiarySystemFill: "--tertiary-system-fill",
  quaternarySystemFill: "--quaternary-system-fill",
  separator: "--separator",
  opaqueSeparator: "--opaque-separator",
  systemGroupedBackground: "--system-grouped-background",
  secondarySystemGroupedBackground: "--secondary-system-grouped-background",
  tertiarySystemGroupedBackground: "--tertiary-system-grouped-background",
} as const;

