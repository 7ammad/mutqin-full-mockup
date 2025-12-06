/**
 * Route Validation Utility
 * 
 * Validates dashboard routes against IA-SITEMAP.md and L2_DETAIL_PAGES.md.
 */

import { isValidL1Route, isValidL2Route, isValidTab, getDefaultTab, PERSONA_TABS } from './routes';
import { Persona } from './mockData';

/**
 * Validates a dashboard route path
 * @param path - The route path to validate
 * @returns true if valid, false otherwise
 */
export function validateDashboardRoute(path: string): boolean {
  // Remove query string for validation
  const pathWithoutQuery = path.split('?')[0];
  
  // Check if it's a valid L1 or L2 route
  return isValidL1Route(path) || isValidL2Route(pathWithoutQuery);
}

/**
 * Validates and normalizes a tab parameter for a persona
 * @param persona - The persona type
 * @param tab - The tab key to validate
 * @returns The validated tab key (or default if invalid)
 */
export function validateAndNormalizeTab(persona: Persona, tab: string | null): string {
  if (!tab) {
    return getDefaultTab(persona);
  }
  
  if (isValidTab(persona, tab)) {
    return tab;
  }
  
  // Invalid tab, return default
  return getDefaultTab(persona);
}

/**
 * Checks if a route is a valid L2 detail route
 * @param path - The route path to check
 * @returns true if it's a valid L2 route
 */
export function isL2Route(path: string): boolean {
  const pathWithoutQuery = path.split('?')[0];
  return isValidL2Route(pathWithoutQuery);
}

/**
 * Checks if a route is a valid L1 dashboard route
 * @param path - The route path to check
 * @returns true if it's a valid L1 route
 */
export function isL1Route(path: string): boolean {
  return isValidL1Route(path);
}

/**
 * Extracts the persona from a dashboard route
 * @param path - The route path
 * @returns The persona or null if not found
 */
export function extractPersonaFromRoute(path: string): Persona | null {
  if (path.startsWith('/dashboard/organizer')) return 'ORGANIZER';
  if (path.startsWith('/dashboard/event-manager')) return 'EVENT_MANAGER';
  if (path.startsWith('/dashboard/hcp')) return 'HCP';
  if (path.startsWith('/dashboard/vendor')) return 'VENDOR';
  if (path.startsWith('/dashboard/regulator')) return 'REGULATOR';
  return null;
}

/**
 * Extracts the tab key from a dashboard route query string
 * @param path - The route path with query string
 * @returns The tab key or null if not found
 */
export function extractTabFromRoute(path: string): string | null {
  const url = new URL(path, 'http://localhost');
  return url.searchParams.get('tab');
}
