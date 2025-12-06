// src/lib/dataSource.ts
import { demoEvents, DemoEvent } from '@/demo-data/events';
import { demoHcpSummary, DemoHcpSummary } from '@/demo-data/hcpSummary';
import { getState } from '@/context/demoStore';
import type { DemoEvent as DemoSeedEvent } from '@/context/demoSeed';
import { shouldUseDemoData, getEnvInfo } from '@/lib/env';

// Use validated environment configuration
// This ensures production safety: production defaults to API mode unless explicitly configured
const DEMO = shouldUseDemoData();

// Log environment info for debugging (only in development, client-side)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const envInfo = getEnvInfo();
  if (envInfo) {
    console.log('[dataSource] Environment:', envInfo);
  }
}

/**
 * Get all events (simplified structure for HCP dashboard)
 * Returns DemoEvent from demo-data/events.ts
 */
export async function getAllEvents(): Promise<DemoEvent[]> {
  if (DEMO) {
    return demoEvents;
  }

  // Production API call - ensure proper error handling
  const res = await fetch('/api/regulator/all-events', {
    // Add cache control for production
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to load events: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data.events || data || [];
}

/**
 * Get HCP summary (simplified structure for HCP dashboard)
 * Returns DemoHcpSummary from demo-data/hcpSummary.ts
 */
export async function getHcpSummary(hcpId: string): Promise<DemoHcpSummary> {
  if (DEMO) {
    return demoHcpSummary;
  }

  // Production API call - ensure proper error handling
  const res = await fetch(`/api/hcp/summary?hcpId=${encodeURIComponent(hcpId)}`, {
    // Add cache control for production
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Failed to load HCP summary: ${res.status} ${res.statusText}. ${errorText.substring(0, 100)}`);
  }
  
  return res.json();
}

// Backward compatibility functions for other components
export async function getAllEventsFull(): Promise<DemoSeedEvent[]> {
  if (DEMO) {
    const state = getState();
    return state.events;
  }
  
  const res = await fetch('/api/regulator/all-events', {
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) throw new Error('Failed to load events');
  const data = await res.json();
  return data.events || [];
}

export async function getHcpSummaryFull(hcpId: string) {
  if (DEMO) {
    const { getHcpSummary: getFromStore } = await import('@/context/demoStore');
    return getFromStore(hcpId);
  }
  
  const res = await fetch(`/api/hcp/summary?hcpId=${encodeURIComponent(hcpId)}`, {
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) throw new Error('Failed to load HCP summary');
  return res.json();
}

export async function getLandingEvents() {
  if (DEMO) return demoEvents;
  
  const res = await fetch('/api/regulator/all-events', {
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) throw new Error('Failed to load events');
  const data = await res.json();
  return data.events || [];
}

export async function getOrganizerEvents(organizerId: string): Promise<DemoSeedEvent[]> {
  if (DEMO) {
    const { getOrganizerEvents: getFromStore } = await import('@/context/demoStore');
    return getFromStore(organizerId);
  }
  
  const res = await fetch(`/api/organizer/events?organizerId=${organizerId}`, {
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) throw new Error('Failed to load organizer events');
  const data = await res.json();
  return data.events || [];
}

export async function getEventManagerAssignments(eventManagerId: string) {
  if (DEMO) {
    const { getEventManagerAssignments: getFromStore } = await import('@/context/demoStore');
    return getFromStore(eventManagerId);
  }
  
  const res = await fetch(`/api/event-manager/assignments?eventManagerId=${eventManagerId}`, {
    cache: process.env.NODE_ENV === 'production' ? 'no-store' : 'default',
  });
  
  if (!res.ok) throw new Error('Failed to load assignments');
  const data = await res.json();
  return data.assignments || [];
}
