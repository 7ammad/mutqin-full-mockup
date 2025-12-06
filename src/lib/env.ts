// src/lib/env.ts
// Environment variable validation and type-safe access
// Based on Next.js best practices and t3-env pattern
// Uses Zod for runtime validation and type safety

import { z } from 'zod';

/**
 * Environment configuration with validation
 * 
 * CRITICAL: Production deployments MUST explicitly set NEXT_PUBLIC_DEMO_MODE=false
 * to prevent accidental use of demo data in production.
 */

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';

/**
 * Schema for validating environment variables
 * Trims whitespace and validates values
 */
const envSchema = z.object({
  NEXT_PUBLIC_DEMO_MODE: z
    .string()
    .trim()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_API_MOCKING: z
    .string()
    .trim()
    .transform((val) => val === 'enabled')
    .optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Parse and validate environment variables
 * Uses safeParse to handle errors gracefully
 * Wrapped in try-catch to prevent client-side crashes
 */
let envParseResult: { success: boolean; data?: any; error?: any };
try {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
    NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
    NODE_ENV: NODE_ENV,
  });
  
  envParseResult = result;

  // Log validation errors in development
  if (!envParseResult.success && isDevelopment) {
    console.warn('[ENV] Environment variable validation warnings:', envParseResult.error?.flatten());
  }
} catch (error) {
  // Fallback if Zod validation fails (shouldn't happen, but safety first)
  console.warn('[ENV] Validation error, using fallback parsing:', error);
  envParseResult = { success: false };
}

/**
 * Get and validate NEXT_PUBLIC_DEMO_MODE
 * 
 * Rules:
 * - Development: Defaults to 'true' (demo mode) if not set
 * - Production: Defaults to 'false' (API mode) if not set
 * - Test: Defaults to 'false' (API mode) for consistent test behavior
 * 
 * Uses Zod-validated value if available, falls back to manual parsing
 */
function getDemoMode(): boolean {
  try {
    // Use Zod-validated value if available
    if (envParseResult && envParseResult.success) {
      const demoMode = envParseResult.data.NEXT_PUBLIC_DEMO_MODE;
      
      // In production, warn if demo mode is enabled
      if (isProduction && demoMode === true) {
        if (typeof window === 'undefined') {
          console.warn(
            '[ENV] WARNING: Demo mode is enabled in production. ' +
            'This should only be used for demo deployments, not production systems.'
          );
        }
      }
      
      // Return validated value, defaulting based on environment
      if (demoMode !== undefined) {
        return demoMode;
      }
    }
  } catch (error) {
    // If Zod validation fails, fall back to manual parsing
    console.warn('[ENV] Error in Zod validation, using fallback:', error);
  }
  
  // Fallback: manual parsing with trimming (for edge cases and client-side safety)
  const demoEnv = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEMO_MODE 
    ? process.env.NEXT_PUBLIC_DEMO_MODE.trim() 
    : undefined;
  
  // In production, default to API mode
  if (isProduction) {
    if (demoEnv === undefined || demoEnv === '') {
      if (typeof window === 'undefined') {
        console.error(
          '[ENV] CRITICAL: NEXT_PUBLIC_DEMO_MODE is not set in production. ' +
          'Defaulting to API mode. If you need demo mode, explicitly set NEXT_PUBLIC_DEMO_MODE=true'
        );
      }
      return false; // Production defaults to API mode
    }
    
    if (demoEnv === 'true') {
      if (typeof window === 'undefined') {
        console.warn(
          '[ENV] WARNING: Demo mode is enabled in production. ' +
          'This should only be used for demo deployments, not production systems.'
        );
      }
      return true;
    }
    
    return false;
  }
  
  // Development: default to demo mode if not set
  if (isDevelopment) {
    if (demoEnv === undefined || demoEnv === '') {
      return true; // Default to demo mode in development
    }
    return demoEnv === 'true';
  }
  
  // Test: default to API mode for consistent test behavior
  if (isTest) {
    return demoEnv === 'true';
  }
  
  // Fallback: default to API mode
  return false;
}

/**
 * Get API mocking configuration
 * Uses Zod-validated value if available, falls back to manual parsing
 */
function getApiMocking(): boolean {
  try {
    // Use Zod-validated value if available
    if (envParseResult && envParseResult.success) {
      const apiMocking = envParseResult.data.NEXT_PUBLIC_API_MOCKING;
      if (apiMocking !== undefined) {
        return apiMocking;
      }
    }
  } catch (error) {
    // If Zod validation fails, fall back to manual parsing
    console.warn('[ENV] Error in Zod validation for API mocking, using fallback:', error);
  }
  
  // Fallback: manual parsing with trimming
  const apiMocking = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_MOCKING
    ? process.env.NEXT_PUBLIC_API_MOCKING.trim()
    : undefined;
  return apiMocking === 'enabled';
}

/**
 * Validated environment configuration
 */
export const env = {
  /**
   * Whether the application is in demo mode
   * - Development: defaults to true
   * - Production: defaults to false (requires explicit config)
   * - Test: defaults to false
   */
  isDemoMode: getDemoMode(),
  
  /**
   * Whether API mocking (MSW) is enabled
   */
  isApiMocking: getApiMocking(),
  
  /**
   * Current Node environment
   */
  nodeEnv: NODE_ENV,
  
  /**
   * Environment flags
   */
  isDevelopment,
  isProduction,
  isTest,
} as const;

/**
 * Validate environment configuration at module load
 * This runs once when the module is imported
 */
if (isProduction && env.isDemoMode) {
  const message = 
    '[ENV] PRODUCTION SAFETY CHECK: Demo mode is enabled in production. ' +
    'This may be intentional for demo deployments, but ensure this is correct.';
  
  if (typeof window === 'undefined') {
    // Server-side: use console.error
    console.error(message);
  } else {
    // Client-side: use console.warn (less aggressive)
    console.warn(message);
  }
}

/**
 * Export helper to check if we should use demo data
 * This is the single source of truth for data source decisions
 */
export function shouldUseDemoData(): boolean {
  return env.isDemoMode;
}

/**
 * Get environment info for debugging (development only)
 */
export function getEnvInfo() {
  if (!isDevelopment) {
    return null;
  }
  
  return {
    nodeEnv: env.nodeEnv,
    isDemoMode: env.isDemoMode,
    isApiMocking: env.isApiMocking,
    demoModeEnv: process.env.NEXT_PUBLIC_DEMO_MODE?.trim() || 'undefined (defaulting)',
    apiMockingEnv: process.env.NEXT_PUBLIC_API_MOCKING?.trim() || 'undefined (disabled)',
  };
}

