# Phase 2 - Complete Dashboard Implementation Plan

**Status:** Ready for Implementation  
**Goal:** Implement L1 + L2 in code to behave like a real product, following the docs exactly  
**Duration:** 2-3 weeks  
**Dependencies:** Phase 1 documentation must be complete

---

## Overview

This plan implements all dashboard functionality based on the authoritative documentation created in Phase 1. It covers routing safety, L2 page stubs, L1 to L2 wiring, data reads, actions, and E2E testing.

---

## Prerequisites

Before starting Phase 2, verify:

- [ ] All Phase 1 documentation is complete
- [ ] `IA-SITEMAP.md` defines all persona tabs
- [ ] `L1_DASHBOARD_VIEWS.md` specifies all tab views
- [ ] `L2_DETAIL_PAGES.md` lists all 21 detail routes
- [ ] `COMPLETE_SITEMAP.md` has dashboard area section
- [ ] `FLOWS.md` has cross-persona spine
- [ ] `TEST-PLAN.md` has E2E scenario
- [ ] `ACCEPTANCE.md` has dashboard criteria

---

## Task Breakdown

### TASK 2.1 - Routing & Dashboard 404 Safety

**Objective:** Implement dashboard-scoped 404 handling and ensure all dashboards use DashboardLayout.

**Steps:**

1. **Create dashboard not-found page:**
   - File: `app/dashboard/not-found.tsx`
   - Uses Mutqin design system components
   - Shows styled error message (not raw Next.js 404)
   - Includes navigation back to dashboard home

2. **Verify DashboardLayout usage:**
   - Check all persona dashboard pages use `DashboardLayout`
   - Verify no persona renders its own sidebar
   - Verify no persona renders its own header
   - Update any that don't comply

3. **Implement route validation:**
   - Create route validation utility
   - Validate L1 routes against `IA-SITEMAP.md` tab keys
   - Validate L2 routes against `L2_DETAIL_PAGES.md` list
   - Redirect invalid routes to not-found

4. **Add route constants:**
   - File: `src/lib/routes.ts` (or similar)
   - Define all valid persona base routes
   - Define all valid tab keys per persona
   - Define all valid L2 route patterns
   - Export for use throughout app

**Acceptance Criteria:**
- [ ] Dashboard not-found page created with design system
- [ ] All persona dashboards use DashboardLayout
- [ ] No local sidebars or headers in persona views
- [ ] Route validation utility created
- [ ] Route constants file created
- [ ] Invalid routes show styled 404, not raw Next.js 404

**Files Created:**
- `app/dashboard/not-found.tsx`
- `src/lib/routes.ts` (or appropriate location)

**Files Modified:**
- All persona dashboard page files (if needed)

**Commands to Run:**
```bash
npm run type-check
npm test
```

---

### TASK 2.2 - Stub All L2 Pages (Styled, No Blanks)

**Objective:** Create all 21 L2 detail pages with minimal styled UI, preventing raw 404s.

**Steps:**

1. **Create L2 page structure:**
   
   For each of the 21 routes in `L2_DETAIL_PAGES.md`:
   
   - Create corresponding page file under `app/dashboard/...`
   - Wrap with `DashboardLayout`
   - Use design system components:
     - `LiquidGlassCard` or `Card` for main content
     - Page title (from L2 doc purpose)
     - Short description (from L2 doc)
     - "Demo stub - implementation pending" section if data not wired

2. **Organizer L2 Pages (7):**
   - `/dashboard/organizer/events/[eventId]/page.tsx`
   - `/dashboard/organizer/events/[eventId]/edit/page.tsx`
   - `/dashboard/organizer/events/[eventId]/registrations/page.tsx`
   - `/dashboard/organizer/events/[eventId]/attendance/page.tsx`
   - `/dashboard/organizer/events/[eventId]/certificates/page.tsx`
   - `/dashboard/organizer/events/[eventId]/sponsors/page.tsx`
   - `/dashboard/organizer/events/[eventId]/assign/page.tsx`

3. **Event Manager L2 Pages (4):**
   - `/dashboard/event-manager/events/[eventId]/page.tsx`
   - `/dashboard/event-manager/events/[eventId]/checkin/page.tsx`
   - `/dashboard/event-manager/events/[eventId]/attendance/page.tsx`
   - `/dashboard/event-manager/events/[eventId]/handover/page.tsx`

4. **HCP L2 Pages (3):**
   - `/dashboard/hcp/events/[eventId]/page.tsx`
   - `/dashboard/hcp/tickets/[ticketId]/page.tsx`
   - `/dashboard/hcp/certificates/[certificateId]/page.tsx`

5. **Vendor L2 Pages (3):**
   - `/dashboard/vendor/events/[eventId]/page.tsx`
   - `/dashboard/vendor/sponsorships/[sponsorshipId]/page.tsx`
   - `/dashboard/vendor/campaigns/[campaignId]/page.tsx`

6. **Regulator L2 Pages (4):**
   - `/dashboard/regulator/applications/[applicationId]/page.tsx`
   - `/dashboard/regulator/applications/[applicationId]/decision/page.tsx`
   - `/dashboard/regulator/applications/[applicationId]/checklist/page.tsx`
   - `/dashboard/regulator/providers/[providerId]/page.tsx`

7. **Template structure for each page:**
   ```typescript
   import { DashboardLayout } from '@/components/layout/DashboardLayout';
   import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard';
   
   export default function PageName({ params }: { params: { id: string } }) {
     return (
       <DashboardLayout>
         <LiquidGlassCard>
           <h1>Page Title</h1>
           <p>Purpose description from L2_DETAIL_PAGES.md</p>
           {/* Demo stub section if needed */}
         </LiquidGlassCard>
       </DashboardLayout>
     );
   }
   ```

**Acceptance Criteria:**
- [ ] All 21 L2 pages created
- [ ] All pages use DashboardLayout
- [ ] All pages use design system components
- [ ] All pages have title and description
- [ ] No raw 404s when navigating to L2 routes
- [ ] All pages render styled UI (no blank screens)

**Files Created:**
- 21 page files under `app/dashboard/...`

**Commands to Run:**
```bash
npm run type-check
npm run build  # Verify no build errors
```

---

### TASK 2.3 - Wire L1 Tabs to Correct L2 Routes

**Objective:** Connect all L1 tab actions to their corresponding L2 routes.

**Steps:**

1. **Organizer Dashboard:**
   
   **Tab: `activities`**
   - "Open" button → `/dashboard/organizer/events/[eventId]`
   - "Edit" button → `/dashboard/organizer/events/[eventId]/edit`
   
   **Tab: `accreditation`**
   - Row click → `/dashboard/organizer/events/[eventId]`
   
   **Tab: `execution`**
   - "Registrations" → `/dashboard/organizer/events/[eventId]/registrations`
   - "Attendance" → `/dashboard/organizer/events/[eventId]/attendance`
   - "Certificates" → `/dashboard/organizer/events/[eventId]/certificates`
   - "Assign EM" → `/dashboard/organizer/events/[eventId]/assign`
   
   **Tab: `sponsors`**
   - "Sponsors" → `/dashboard/organizer/events/[eventId]/sponsors`

2. **Event Manager Dashboard:**
   
   **Tab: `assignments`**
   - Row click → `/dashboard/event-manager/events/[eventId]`
   
   **Tab: `checkin`**
   - "Open check-in" → `/dashboard/event-manager/events/[eventId]/checkin`
   
   **Tab: `attendance`**
   - Row → `/dashboard/event-manager/events/[eventId]/attendance`
   
   **Tab: `handover`**
   - Row → `/dashboard/event-manager/events/[eventId]/handover`

3. **HCP Dashboard:**
   
   **Tab: `discover`**
   - Event card → `/dashboard/hcp/events/[eventId]`
   
   **Tab: `registrations`**
   - Row → `/dashboard/hcp/tickets/[ticketId]`
   
   **Tab: `credits`**
   - Event/credit row → `/dashboard/hcp/events/[eventId]` or `/dashboard/hcp/certificates/[certificateId]`
   
   **Tab: `certs_reviews`**
   - Row → `/dashboard/hcp/certificates/[certificateId]`

4. **Vendor Dashboard:**
   
   **Tab: `marketplace`**
   - Opportunity card → `/dashboard/vendor/events/[eventId]`
   
   **Tab: `purchases`**
   - Row → `/dashboard/vendor/sponsorships/[sponsorshipId]`
   
   **Tab: `performance`**
   - Campaign row → `/dashboard/vendor/campaigns/[campaignId]`
   - Event in campaign → `/dashboard/vendor/events/[eventId]`

5. **Regulator Dashboard:**
   
   **Tab: `review_queue`**
   - Row → `/dashboard/regulator/applications/[applicationId]`
   - "Review" → `/dashboard/regulator/applications/[applicationId]/decision`
   
   **Tab: `compliance_monitor`**
   - Provider row → `/dashboard/regulator/providers/[providerId]`
   - Event row → `/dashboard/regulator/applications/[applicationId]`
   
   **Tab: `audit_risk`**
   - Provider row → `/dashboard/regulator/providers/[providerId]`

6. **Implementation pattern:**
   ```typescript
   import Link from 'next/link';
   import { useRouter } from 'next/navigation';
   
   // For row clicks
   <tr onClick={() => router.push(`/dashboard/persona/entity/${id}`)}>
   
   // For buttons
   <Link href={`/dashboard/persona/entity/${id}`}>
     <button>Open</button>
   </Link>
   ```

**Acceptance Criteria:**
- [ ] All L1 tabs have correct L2 route links
- [ ] No links to undefined routes
- [ ] All navigation uses Next.js Link or router.push
- [ ] All routes match L2_DETAIL_PAGES.md exactly
- [ ] No custom route patterns used

**Files Modified:**
- All L1 dashboard tab component files
- Table row components
- Card components
- Button components

**Commands to Run:**
```bash
npm run type-check
npm test
```

---

### TASK 2.4 - Wire Data Reads (Existing GETs Only)

**Objective:** Connect L2 pages to existing typed GET/read model functions.

**Steps:**

1. **For each L2 page:**
   - Identify required data from L2_DETAIL_PAGES.md purpose
   - Find existing GET/read functions in `src/lib/api` or `src/lib/mockApi`
   - Connect page to data fetching
   - Use proper TypeScript types (no `any`, no loose `unknown`)

2. **If required read is missing but in CONTRACTS.md:**
   - Implement GET handler in `src/lib/api`
   - Implement mock in `src/lib/mockApi`
   - Follow `Docs/CONTRACTS.md` exactly
   - Add proper TypeScript types

3. **Data fetching pattern:**
   ```typescript
   // Server component
   import { getEventById } from '@/lib/api/events';
   
   export default async function EventPage({ params }: { params: { eventId: string } }) {
     const event = await getEventById(params.eventId);
     
     return (
       <DashboardLayout>
         {/* Render event data */}
       </DashboardLayout>
     );
   }
   ```

4. **Type safety rules:**
   - No `any` types
   - No loose `unknown` without narrowing
   - Use types from `src/types/entities.ts`
   - Respect existing ActionId/policy engine where applicable

5. **Error handling:**
   - Handle not found (404)
   - Handle loading states
   - Handle error states
   - Use design system error components

**Acceptance Criteria:**
- [ ] All L2 pages connected to data reads
- [ ] All data fetching uses typed functions
- [ ] No `any` or loose `unknown` types
- [ ] Missing GETs implemented per CONTRACTS.md
- [ ] Error handling implemented
- [ ] Loading states handled

**Files Modified:**
- All L2 page files
- `src/lib/api/*` (if new GETs needed)
- `src/lib/mockApi/*` (if new mocks needed)

**Commands to Run:**
```bash
npm run type-check
npm test
```

---

### TASK 2.5 - Wire Actions (Existing POSTs Only)

**Objective:** Connect action buttons to existing POST endpoints.

**Steps:**

1. **Identify actions per persona:**
   
   **Organizer:**
   - Submit for accreditation
   - Publish event (if POST exists)
   - Submit attendance/hours (if POSTs exist)
   - Assign EM/vendor
   
   **Event Manager:**
   - Accept/decline assignment
   - Check-in ticket
   - Finalize attendance
   
   **HCP:**
   - Register for event
   
   **Regulator:**
   - Approve/return application with reason
   
   **Sponsor:**
   - Purchase sponsorship (if POST exists per CONTRACTS)

2. **For each action:**
   - Verify POST exists in codebase
   - Use typed API client
   - Use `toast-context` for success/error feedback
   - Use existing store/selectors to refresh UI
   - No new domain logic

3. **Action pattern:**
   ```typescript
   'use client';
   
   import { useToast } from '@/contexts/toast-context';
   import { submitForAccreditation } from '@/lib/api/events';
   
   export function SubmitButton({ eventId }: { eventId: string }) {
     const { showToast } = useToast();
     
     const handleSubmit = async () => {
       try {
         await submitForAccreditation(eventId);
         showToast('Submitted successfully', 'success');
         router.refresh(); // Refresh data
       } catch (error) {
         showToast('Submission failed', 'error');
       }
     };
     
     return <button onClick={handleSubmit}>Submit</button>;
   }
   ```

4. **Only wire if POST exists:**
   - Check existing API functions
   - Don't create new POSTs unless explicitly in CONTRACTS.md
   - Document which actions are wired vs pending

**Acceptance Criteria:**
- [ ] All existing POSTs wired to UI actions
- [ ] All actions use typed API client
- [ ] Toast feedback implemented
- [ ] UI refreshes after actions
- [ ] No new domain logic introduced
- [ ] Actions documented (wired vs pending)

**Files Modified:**
- Action button components
- Form components
- L1 and L2 pages with actions

**Commands to Run:**
```bash
npm run type-check
npm test
```

---

### TASK 2.6 - E2E & Regression Guardrail

**Objective:** Update and verify E2E test follows cross-persona spine.

**Steps:**

1. **Update E2E test file:**
   - File: `tests/e2e/demo-happy-path.spec.ts`
   - Follow cross-persona spine from `FLOWS.md`
   - Use exact L1 + L2 routes
   - Hit at least one L1 tab and one L2 route per persona

2. **Test scenario structure:**
   ```typescript
   test('cross-persona happy path', async ({ page }) => {
     // Organizer
     await page.goto('/dashboard/organizer?tab=activities');
     await page.click('[data-testid="event-row"]');
     await expect(page).toHaveURL(/\/dashboard\/organizer\/events\/\d+/);
     
     // Regulator
     await page.goto('/dashboard/regulator?tab=review_queue');
     // ... continue through all personas
   });
   ```

3. **Test requirements:**
   - No navigation hits raw 404
   - No screen is unstyled blank page
   - Every L2 route renders styled layout
   - All personas tested
   - At least one L1 tab per persona
   - At least one L2 route per persona

4. **Run and record results:**
   ```bash
   npm run type-check
   npm test
   npx playwright test tests/e2e/demo-happy-path.spec.ts
   ```

5. **Treat failures as blockers:**
   - Any test failure = blocker
   - Fix before marking phase complete
   - Document any known issues

**Acceptance Criteria:**
- [ ] E2E test updated to follow cross-persona spine
- [ ] All personas tested
- [ ] All L1 tabs tested
- [ ] All L2 routes tested
- [ ] All tests passing
- [ ] No raw 404s in test flow
- [ ] No blank screens in test flow

**Files Modified:**
- `tests/e2e/demo-happy-path.spec.ts`

**Commands to Run:**
```bash
npm run type-check
npm test
npx playwright test tests/e2e/demo-happy-path.spec.ts
```

---

## Implementation Order

### Week 1: Foundation
- **Day 1-2:** Task 2.1 (Routing & 404 Safety)
- **Day 3-4:** Task 2.2 (Stub All L2 Pages)
- **Day 5:** Task 2.3 (Wire L1 to L2) - Start

### Week 2: Data & Actions
- **Day 1-2:** Task 2.3 (Wire L1 to L2) - Complete
- **Day 3-4:** Task 2.4 (Wire Data Reads)
- **Day 5:** Task 2.5 (Wire Actions) - Start

### Week 3: Testing & Polish
- **Day 1-2:** Task 2.5 (Wire Actions) - Complete
- **Day 3-4:** Task 2.6 (E2E Testing)
- **Day 5:** Final verification and documentation

---

## Verification Checklist

After completing all tasks:

- [ ] All 21 L2 pages created and styled
- [ ] All L1 tabs link to correct L2 routes
- [ ] All data reads wired
- [ ] All existing actions wired
- [ ] E2E test passing
- [ ] Type check passing
- [ ] Unit tests passing
- [ ] No raw 404s
- [ ] No blank screens
- [ ] All routes match documentation
- [ ] Design system components used throughout

---

## Definition of Done

Phase 2 is complete when:

1. ✅ All L2 pages exist and render styled UI
2. ✅ All L1 tabs link to correct L2 routes
3. ✅ All data reads connected
4. ✅ All existing actions wired
5. ✅ E2E test passes
6. ✅ Type check passes
7. ✅ Unit tests pass
8. ✅ No raw 404s in happy path
9. ✅ All routes match L2_DETAIL_PAGES.md
10. ✅ All navigation matches IA-SITEMAP.md

---

## Notes

- Follow documentation exactly - no deviations
- Use design system components only
- Type safety is non-negotiable
- Test after each task
- Document any blockers or issues

---

**Status:** Ready for Implementation  
**Prerequisites:** Phase 1 documentation complete

