// src/lib/dataSource.ts
import { demoEvents, DemoEvent } from '@/demo-data/events';
import { demoHcpSummary, DemoHcpSummary } from '@/demo-data/hcpSummary';
import { getState } from '@/context/demoStore';
import type { DemoEvent as DemoSeedEvent } from '@/context/demoSeed';

// Check demo mode
// Defaults to true in development if not explicitly set
// For demo deployment, default to true unless explicitly disabled
// This ensures demo mode works even if .env.local is missing
const DEMO_ENV = process.env.NEXT_PUBLIC_DEMO_MODE;
// Default to demo mode unless explicitly set to 'false'
// This ensures the demo deployment works without environment variables
const DEMO = DEMO_ENV !== 'false' && (DEMO_ENV === 'true' || DEMO_ENV === undefined);

// Log demo mode status for debugging (only in development, client-side)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[dataSource] Demo mode:', DEMO, 'NEXT_PUBLIC_DEMO_MODE:', DEMO_ENV || 'undefined (defaulting to demo in dev)');
}

/**
 * Get all events (simplified structure for HCP dashboard)
 * Returns DemoEvent from demo-data/events.ts
 */
export async function getAllEvents(): Promise<DemoEvent[]> {
  if (DEMO) {
    return demoEvents;
  }

  const res = await fetch('/api/regulator/all-events');
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

  const res = await fetch(`/api/hcp/summary?hcpId=${encodeURIComponent(hcpId)}`);
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
  const res = await fetch('/api/regulator/all-events');
  if (!res.ok) throw new Error('Failed to load events');
  const data = await res.json();
  return data.events || [];
}

export async function getHcpSummaryFull(hcpId: string) {
  if (DEMO) {
    const { getHcpSummary: getFromStore } = await import('@/context/demoStore');
    return getFromStore(hcpId);
  }
  const res = await fetch(`/api/hcp/summary?hcpId=${encodeURIComponent(hcpId)}`);
  if (!res.ok) throw new Error('Failed to load HCP summary');
  return res.json();
}

export async function getLandingEvents() {
  if (DEMO) return demoEvents;
  const res = await fetch('/api/regulator/all-events');
  if (!res.ok) throw new Error('Failed to load events');
  const data = await res.json();
  return data.events || [];
}

export async function getOrganizerEvents(organizerId: string): Promise<DemoSeedEvent[]> {
  if (DEMO) {
    const { getOrganizerEvents: getFromStore } = await import('@/context/demoStore');
    return getFromStore(organizerId);
  }
  const res = await fetch(`/api/organizer/events?organizerId=${organizerId}`);
  if (!res.ok) throw new Error('Failed to load organizer events');
  const data = await res.json();
  return data.events || [];
}

export async function getEventManagerAssignments(eventManagerId: string) {
  if (DEMO) {
    const { getEventManagerAssignments: getFromStore } = await import('@/context/demoStore');
    return getFromStore(eventManagerId);
  }
  const res = await fetch(`/api/event-manager/assignments?eventManagerId=${eventManagerId}`);
  if (!res.ok) throw new Error('Failed to load assignments');
  const data = await res.json();
  return data.assignments || [];
}
