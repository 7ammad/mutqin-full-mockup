/**
 * Design System Defaults
 * 
 * This file exports default design system configurations
 * to ensure consistency across the project.
 * 
 * Apple Liquid Glass (iOS 18+) is the default design system.
 */

import { designTokens, getGlassClasses } from "./design-system";

/**
 * Default component configurations
 */
export const defaultComponentConfigs = {
  // Card defaults
  card: {
    blurIntensity: "xl" as const,
    glowIntensity: "md" as const,
    interactive: true,
    borderRadius: "24px",
    variant: "regular" as const,
  },

  // Button defaults
  button: {
    blurIntensity: "md" as const,
    variant: "default" as const,
    size: "default" as const,
  },

  // Panel defaults
  panel: {
    blurIntensity: "lg" as const,
    glowIntensity: "sm" as const,
    interactive: false,
    borderRadius: "24px",
  },

  // Modal defaults
  modal: {
    blurIntensity: "2xl" as const,
    glowIntensity: "lg" as const,
    interactive: false,
    borderRadius: "32px",
    variant: "prominent" as const,
  },
} as const;

/**
 * Get default glass classes for a component type
 */
export function getDefaultGlassClasses(componentType: keyof typeof defaultComponentConfigs) {
  const config = defaultComponentConfigs[componentType];
  return getGlassClasses(config.blurIntensity, "auto");
}

/**
 * Check if design system should be applied
 * Returns true by default (Liquid Glass is the default)
 */
export function shouldUseDesignSystem(): boolean {
  return true; // Always use Liquid Glass as default
}

/**
 * Design system name
 */
export const DESIGN_SYSTEM_NAME = "Apple Liquid Glass (iOS 18+)";

/**
 * Design system version
 */
export const DESIGN_SYSTEM_VERSION = "1.0.0";

