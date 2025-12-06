# Phase 1 - Complete Sitemap for All Persona Dashboards

**Status:** Ready for Implementation  
**Goal:** Create comprehensive sitemap documentation covering all persona dashboards, routes, and navigation structure  
**Duration:** 1-2 days  
**Dependencies:** Task 1.1-1.4 should be completed first

---

## Overview

This plan focuses specifically on creating and maintaining the complete sitemap documentation that provides a bird's-eye view of all persona dashboards, their routes, navigation structure, and how they integrate into the overall application routing.

---

## Task Breakdown

### TASK 1 - Audit Current Sitemap State

**Objective:** Understand current COMPLETE_SITEMAP.md structure and identify gaps.

**Steps:**

1. **Review existing COMPLETE_SITEMAP.md:**
   - Identify what's already documented
   - Note missing persona dashboard sections
   - Identify inconsistencies with IA-SITEMAP.md

2. **Cross-reference with IA-SITEMAP.md:**
   - Verify all persona base routes match
   - Verify all tab keys match
   - Note any discrepancies

3. **Create gap analysis:**
   - List missing dashboard routes
   - List missing L2 detail routes
   - List missing navigation patterns

**Output:**
- Gap analysis document (internal notes)
- List of required updates

---

### TASK 2 - Create Dashboard Area Section

**Objective:** Add comprehensive dashboard area section to COMPLETE_SITEMAP.md.

**Steps:**

1. **Add/Update section header:**
   ```markdown
   ## Dashboard Area (Personas)
   
   This section shows how persona dashboards fit into the **central routing overview** 
   (public, auth, dashboards, utility). It is not claiming to list every possible route 
   in the product but defines the dashboard cluster clearly.
   ```

2. **Add persona dashboard overview:**
   ```markdown
   ### Persona Dashboard Overview
   
   All persona dashboards follow the pattern: `/dashboard/<persona>?tab=<tabKey>`
   
   - **Base Route:** `/dashboard/<persona>`
   - **Navigation:** Query parameter `?tab=<tabKey>` switches content
   - **Layout:** All dashboards use global `DashboardLayout` (sidebar + header)
   - **Detail Pages:** L2 routes under `/dashboard/<persona>/<entity>/[id]`
   ```

3. **Add ASCII routing tree:**
   ```
   /dashboard
   │
   ├── /dashboard/organizer
   │   ├── ?tab=overview
   │   ├── ?tab=activities
   │   ├── ?tab=accreditation
   │   ├── ?tab=execution
   │   └── ?tab=sponsors
   │   └── /events/[eventId] (L2)
   │       ├── /edit
   │       ├── /registrations
   │       ├── /attendance
   │       ├── /certificates
   │       ├── /sponsors
   │       └── /assign
   │
   ├── /dashboard/event-manager
   │   ├── ?tab=assignments
   │   ├── ?tab=checkin
   │   ├── ?tab=attendance
   │   ├── ?tab=certificates
   │   └── ?tab=handover
   │   └── /events/[eventId] (L2)
   │       ├── /checkin
   │       ├── /attendance
   │       └── /handover
   │
   ├── /dashboard/hcp
   │   ├── ?tab=discover
   │   ├── ?tab=registrations
   │   ├── ?tab=credits
   │   └── ?tab=certs_reviews
   │   └── /events/[eventId] (L2)
   │   └── /tickets/[ticketId] (L2)
   │   └── /certificates/[certificateId] (L2)
   │
   ├── /dashboard/vendor
   │   ├── ?tab=marketplace
   │   ├── ?tab=purchases
   │   ├── ?tab=assets
   │   ├── ?tab=performance
   │   └── ?tab=billing
   │   └── /events/[eventId] (L2)
   │   └── /sponsorships/[sponsorshipId] (L2)
   │   └── /campaigns/[campaignId] (L2)
   │
   └── /dashboard/regulator
       ├── ?tab=review_queue
       ├── ?tab=decision_workspace
       ├── ?tab=compliance_monitor
       ├── ?tab=audit_risk
       └── ?tab=analytics
       └── /applications/[applicationId] (L2)
           ├── /decision
           └── /checklist
       └── /providers/[providerId] (L2)
   ```

**Acceptance Criteria:**
- [ ] Dashboard Area section added
- [ ] Overview paragraph explains role
- [ ] ASCII tree shows all personas, tabs, and L2 routes
- [ ] Tree structure is clear and readable

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

### TASK 3 - Document Layer 2 Detail Pages Summary

**Objective:** Add comprehensive L2 summary section.

**Steps:**

1. **Add section:**
   ```markdown
   ## Layer 2 - Persona Detail Pages
   
   Detail pages provide entity-specific views under `/dashboard/<persona>/<entity>/[id]`.
   ```

2. **Add route counts table:**
   ```markdown
   ### Route Counts by Persona
   
   | Persona | L2 Routes | Description |
   |---------|-----------|-------------|
   | Organizer | 7 | Event management, registrations, attendance, certificates, sponsors, assignments |
   | Event Manager | 4 | Event operations, check-in, attendance, handover |
   | HCP | 3 | Event view, ticket details, certificate details |
   | Vendor | 3 | Event opportunities, sponsorship management, campaign management |
   | Regulator | 4 | Application review, decision making, provider management |
   | **Total** | **21** | All persona detail routes |
   ```

3. **Add route listing by persona:**
   ```markdown
   ### Organizer L2 Routes (7)
   
   1. `/dashboard/organizer/events/[eventId]` - Event master view
   2. `/dashboard/organizer/events/[eventId]/edit` - Edit event
   3. `/dashboard/organizer/events/[eventId]/registrations` - Manage registrations
   4. `/dashboard/organizer/events/[eventId]/attendance` - View attendance
   5. `/dashboard/organizer/events/[eventId]/certificates` - Certificate management
   6. `/dashboard/organizer/events/[eventId]/sponsors` - Sponsor management
   7. `/dashboard/organizer/events/[eventId]/assign` - Assign event manager
   
   ### Event Manager L2 Routes (4)
   
   1. `/dashboard/event-manager/events/[eventId]` - Operations overview
   2. `/dashboard/event-manager/events/[eventId]/checkin` - Check-in console
   3. `/dashboard/event-manager/events/[eventId]/attendance` - Attendance ledger
   4. `/dashboard/event-manager/events/[eventId]/handover` - Handover/audit pack
   
   ### HCP L2 Routes (3)
   
   1. `/dashboard/hcp/events/[eventId]` - Event details and registration
   2. `/dashboard/hcp/tickets/[ticketId]` - Ticket details and QR code
   3. `/dashboard/hcp/certificates/[certificateId]` - Certificate view and download
   
   ### Vendor L2 Routes (3)
   
   1. `/dashboard/vendor/events/[eventId]` - Event opportunity details
   2. `/dashboard/vendor/sponsorships/[sponsorshipId]` - Sponsorship management
   3. `/dashboard/vendor/campaigns/[campaignId]` - Campaign performance
   
   ### Regulator L2 Routes (4)
   
   1. `/dashboard/regulator/applications/[applicationId]` - Application review
   2. `/dashboard/regulator/applications/[applicationId]/decision` - Make decision
   3. `/dashboard/regulator/applications/[applicationId]/checklist` - Compliance checklist
   4. `/dashboard/regulator/providers/[providerId]` - Provider profile and history
   ```

4. **Add authoritative reference:**
   ```markdown
   ### Authoritative Source
   
   **See `L2_DETAIL_PAGES.md` as the authoritative list** with full specifications for each route.
   
   **Rule:** Agents may not introduce new `/dashboard/...` detail routes outside those listed in `L2_DETAIL_PAGES.md`.
   ```

**Acceptance Criteria:**
- [ ] Layer 2 section added
- [ ] Route counts table created
- [ ] All 21 routes listed by persona
- [ ] Authoritative reference to L2_DETAIL_PAGES.md
- [ ] Rule about no new routes stated

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

### TASK 4 - Add Navigation Flow Diagram

**Objective:** Document how users navigate between L1 and L2.

**Steps:**

1. **Add navigation patterns section:**
   ```markdown
   ## Navigation Patterns
   
   ### L1 to L2 Navigation
   
   Users navigate from dashboard tabs (L1) to detail pages (L2) via:
   - Row clicks in tables
   - Card clicks in grids
   - Action buttons (Open, Edit, View, etc.)
   - Breadcrumb navigation
   
   ### L2 to L1 Navigation
   
   Users return to dashboard tabs via:
   - Back button
   - Breadcrumb navigation
   - Sidebar tab selection
   - Cancel/Close actions
   ```

2. **Add example flows:**
   ```markdown
   ### Example Navigation Flows
   
   **Organizer Flow:**
   1. `/dashboard/organizer?tab=activities` (L1)
   2. Click event row → `/dashboard/organizer/events/[eventId]` (L2)
   3. Click "Edit" → `/dashboard/organizer/events/[eventId]/edit` (L2)
   4. Save → Returns to `/dashboard/organizer/events/[eventId]` (L2)
   5. Back → `/dashboard/organizer?tab=activities` (L1)
   
   **HCP Flow:**
   1. `/dashboard/hcp?tab=discover` (L1)
   2. Click event card → `/dashboard/hcp/events/[eventId]` (L2)
   3. Register → Returns to `/dashboard/hcp?tab=registrations` (L1)
   4. Click ticket → `/dashboard/hcp/tickets/[ticketId]` (L2)
   ```

**Acceptance Criteria:**
- [ ] Navigation patterns section added
- [ ] L1 to L2 patterns documented
- [ ] L2 to L1 patterns documented
- [ ] Example flows provided for at least 2 personas

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

### TASK 5 - Add Route Validation Rules

**Objective:** Document rules for route validation and enforcement.

**Steps:**

1. **Add validation section:**
   ```markdown
   ## Route Validation Rules
   
   ### Allowed Route Patterns
   
   **L1 Routes (Dashboard Tabs):**
   - Pattern: `/dashboard/<persona>?tab=<tabKey>`
   - Valid personas: `organizer`, `event-manager`, `hcp`, `vendor`, `regulator`
   - Valid tab keys: See `IA-SITEMAP.md` for each persona
   - Default behavior: Missing or invalid tab → render default tab
   
   **L2 Routes (Detail Pages):**
   - Pattern: `/dashboard/<persona>/<entity>/[id]` or `/dashboard/<persona>/<entity>/[id]/<action>`
   - Valid routes: See `L2_DETAIL_PAGES.md` for complete list
   - Total allowed: 21 routes (7+4+3+3+4)
   
   ### Forbidden Patterns
   
   - `/dashboard/<persona>/live` - Not allowed
   - `/dashboard/<persona>/<entity>/[id]/details` - Not allowed
   - `/dashboard/<persona>/<entity>/[id]/view` - Not allowed
   - Any route not listed in `L2_DETAIL_PAGES.md` - Not allowed
   ```

2. **Add enforcement rules:**
   ```markdown
   ### Enforcement
   
   - All routes must be validated against `IA-SITEMAP.md` (L1) and `L2_DETAIL_PAGES.md` (L2)
   - Unknown routes must show styled 404 (not raw Next.js 404)
   - Dead links are not allowed - routes must be implemented before being linked
   - Tab keys must match exactly as defined in `IA-SITEMAP.md`
   ```

**Acceptance Criteria:**
- [ ] Route validation rules section added
- [ ] Allowed patterns documented
- [ ] Forbidden patterns listed
- [ ] Enforcement rules stated

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

### TASK 6 - Cross-Reference with Other Docs

**Objective:** Ensure COMPLETE_SITEMAP.md properly references and aligns with other documentation.

**Steps:**

1. **Add references section:**
   ```markdown
   ## Related Documentation
   
   This sitemap provides the central routing overview. For detailed specifications:
   
   - **Dashboard Navigation:** See `IA-SITEMAP.md` for tab keys and navigation contracts
   - **L1 Views:** See `L1_DASHBOARD_VIEWS.md` for dashboard tab specifications
   - **L2 Pages:** See `L2_DETAIL_PAGES.md` for detail page specifications
   - **User Flows:** See `FLOWS.md` for cross-persona journey flows
   - **Testing:** See `TEST-PLAN.md` for E2E test scenarios
   - **Acceptance:** See `ACCEPTANCE.md` for definition of done
   ```

2. **Verify consistency:**
   - Check all route counts match L2_DETAIL_PAGES.md
   - Check all tab keys match IA-SITEMAP.md
   - Check all personas match across all docs
   - Resolve any discrepancies

**Acceptance Criteria:**
- [ ] Related documentation section added
- [ ] All route counts verified
- [ ] All tab keys verified
- [ ] All personas verified
- [ ] No discrepancies found

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

## Implementation Order

1. **Task 1:** Audit current state (30 min)
2. **Task 2:** Create dashboard area section (1-2 hours)
3. **Task 3:** Document L2 summary (1-2 hours)
4. **Task 4:** Add navigation flows (1 hour)
5. **Task 5:** Add validation rules (1 hour)
6. **Task 6:** Cross-reference verification (30 min)

**Total Estimated Time:** 5-7 hours (1 day)

---

## Verification Checklist

After completing all tasks:

- [ ] COMPLETE_SITEMAP.md includes Dashboard Area section
- [ ] ASCII tree shows all personas, tabs, and L2 routes
- [ ] All 21 L2 routes listed and counted correctly
- [ ] Navigation patterns documented
- [ ] Route validation rules documented
- [ ] References to other docs added
- [ ] All route counts match L2_DETAIL_PAGES.md
- [ ] All tab keys match IA-SITEMAP.md
- [ ] No discrepancies with other documentation

---

## Notes

- This plan complements Task 1.5 from the main Phase 1 plan
- Focus is on comprehensive sitemap documentation
- Must align with all other Phase 1 documentation
- Serves as the central routing reference for the entire application

---

**Status:** Ready for Implementation  
**Related Plans:** PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md

