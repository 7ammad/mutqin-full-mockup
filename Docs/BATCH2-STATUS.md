# Phase 2 Batch 2 - Implementation Status

**Tasks:** 2.4 (Wire Data Reads), 2.5 (Wire Actions), 2.6 (E2E Testing)
**Started:** 2025-01-27
**Status:** In Progress

## Current State Analysis

### Available GET Endpoints
- ✅ `getOrganizerEvents(organizerId)` - Returns array of events
- ✅ `getRegulatorQueue()` - Returns queue events
- ✅ `getAllEvents()` - Returns all events
- ✅ `getEventManagerAssignments(eventManagerId)` - Returns assignments
- ✅ `getHcpSummary(hcpId)` - Returns tickets, certificates, reviews
- ✅ `getVendorSponsorships(vendorId)` - Returns sponsorships
- ✅ Regulator read endpoints (queue, decisions, monitoring, analytics)

### Missing GET Endpoints (Need to Add)
- ❌ `getEventById(eventId)` - Single event detail
- ❌ `getTicketById(ticketId)` - Single ticket detail
- ❌ `getCertificateById(certificateId)` - Single certificate detail
- ❌ `getApplicationById(applicationId)` - Single application detail
- ❌ `getSponsorshipById(sponsorshipId)` - Single sponsorship detail

### L2 Pages Current State
- Most L2 pages use static `INITIAL_EVENTS` data
- Need to wire to API calls with loading/error states
- Need proper TypeScript types

### Actions Current State
- POST endpoints exist in API client
- Some actions may be wired, need verification
- Need success/error feedback (toast)

### E2E Test Current State
- Current test uses `/demo-flow` page
- Need to update to test actual dashboard routes per TEST-PLAN.md
- Need to test all 9 steps of cross-persona spine

## Implementation Plan

### Task 2.4 - Wire Data Reads
1. Add missing GET endpoints to API client
2. Add mock handlers for new endpoints
3. Wire L1 dashboard tabs to data reads
4. Wire L2 detail pages to data reads
5. Implement loading states
6. Implement error handling

### Task 2.5 - Wire Actions
1. Verify all POST endpoints are wired
2. Add toast feedback for actions
3. Implement state transitions
4. Update UI after actions

### Task 2.6 - E2E Testing
1. Update test to use dashboard routes
2. Implement all 9 steps from TEST-PLAN.md
3. Verify routes, state transitions, handoffs
4. Ensure test passes

## Progress Tracking

### Task 2.4 - Wire Data Reads
- [x] Task 2.4.1 - Add missing GET endpoints (COMPLETE)
- [x] Task 2.4.2 - Wire L1 tabs to data reads (COMPLETE)
- [x] Task 2.4.3 - Wire L2 pages to data reads (COMPLETE)
  - All 21 L2 pages wired to API with loading/error states
- [x] Task 2.4.4 - Implement loading/error states (COMPLETE)
  - All pages use LoadingSkeleton and error handling

### Task 2.5 - Wire Actions
- [x] Task 2.5.1 - Wire all primary actions (COMPLETE)
- [x] Task 2.5.2 - Add toast feedback (COMPLETE)
- [x] Task 2.5.3 - Implement state transitions (COMPLETE)
- [x] Task 2.5.4 - UI refreshes after actions (COMPLETE)

### Task 2.6 - E2E Testing
- [x] Task 2.6.1 - Update E2E test scenario (COMPLETE)
- [x] Task 2.6.2 - Verify all 9 steps (COMPLETE)
- [x] Task 2.6.3 - Test passes (COMPLETE)

## Implementation Pattern for Remaining Work

### L2 Page Data Fetching Pattern
```typescript
"use client";

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.getEventById({ eventId: id });
        setEvent(res.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
        if (err instanceof Error && err.message.includes('not found')) {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingSkeleton variant="page" />;
  if (error) return <ErrorState message={error} />;
  if (!event) notFound();

  return <EventDetails event={event} />;
}
```

### Action Wiring Pattern
```typescript
const handleAction = async () => {
  try {
    const res = await api.submitAccreditation({ eventId });
    showToast('Submitted successfully', 'success');
    // Refresh data
    await refreshData();
  } catch (err) {
    showToast('Action failed', 'error');
  }
};
```
