# Phase 1 - Guiding Documentation Implementation Plan

**Status:** Ready for Implementation  
**Goal:** Create authoritative documentation stack for dashboards and detail pages before touching code  
**Duration:** 2-3 days  
**Dependencies:** None

---

## Overview

This plan implements Phase 1 Tasks 1.1-1.9, creating the complete documentation foundation that agents must reference before implementing any dashboard features. This establishes the single source of truth for L1 (dashboard views) and L2 (detail pages) routing, navigation, and structure.

---

## Task Breakdown

### TASK 1.1 - Update `Docs/INDEX.md` (Entry Point + Precedence)

**Objective:** Establish INDEX.md as the authoritative entry point with clear precedence rules for dashboard documentation.

**Steps:**

1. **Add "Start here for dashboards" section:**
   - Create new section after "Canonical docs"
   - List all dashboard-related docs with brief descriptions
   - Include links to:
     - `Docs/IA-SITEMAP.md`
     - `Docs/L1_DASHBOARD_VIEWS.md` (NEW)
     - `Docs/L2_DETAIL_PAGES.md` (NEW)
     - `Docs/COMPLETE_SITEMAP.md`
     - `Docs/FLOWS.md`
     - `Docs/TEST-PLAN.md`
     - `Docs/ACCEPTANCE.md`

2. **Add precedence hierarchy:**
   ```markdown
   ## Dashboard Documentation Precedence
   
   For dashboard-related decisions, follow this precedence (highest to lowest):
   1. `L2_DETAIL_PAGES.md` - Detail page routes and specs
   2. `L1_DASHBOARD_VIEWS.md` - Dashboard tab views and structure
   3. `IA-SITEMAP.md` - Navigation and routing contracts
   
   These override any older dashboard-related notes elsewhere.
   
   **Note:** The precedence stated here is: `L2_DETAIL_PAGES.md` → `L1_DASHBOARD_VIEWS.md` → `IA-SITEMAP.md`
   ```

3. **Clarify COMPLETE_SITEMAP.md role:**
   - Add note: "`COMPLETE_SITEMAP.md` holds the central routing overview (public, auth, dashboards, utility). For dashboards specifically, always follow: `IA-SITEMAP.md` → `L1_DASHBOARD_VIEWS.md` → `L2_DETAIL_PAGES.md`."

**Acceptance Criteria:**
- [ ] INDEX.md includes "Start here for dashboards" section
- [ ] Precedence hierarchy clearly stated
- [ ] All dashboard docs linked and described
- [ ] COMPLETE_SITEMAP.md role clarified

**Files Modified:**
- `Docs/INDEX.md`

---

### TASK 1.2 - Update `Docs/IA-SITEMAP.md` (Persona + Tabs, HCP CME Note)

**Objective:** Lock base routes, tab keys, and global L1 rules for all personas.

**Steps:**

1. **Verify/Update persona base routes and tabs:**
   - **Organizer:**
     - Base: `/dashboard/organizer`
     - Tabs: `overview | activities | accreditation | execution | sponsors`
   - **Event Manager:**
     - Base: `/dashboard/event-manager`
     - Tabs: `assignments | checkin | attendance | certificates | handover`
   - **HCP:**
     - Base: `/dashboard/hcp`
     - Tabs: `discover | registrations | credits | certs_reviews`
   - **Sponsor/Vendor:**
     - Base: `/dashboard/vendor`
     - Tabs: `marketplace | purchases | assets | performance | billing`
   - **Regulator:**
     - Base: `/dashboard/regulator`
     - Tabs: `review_queue | decision_workspace | compliance_monitor | audit_risk | analytics`

2. **Add Global L1 Rules section:**
   ```markdown
   ## Global L1 Rules
   
   - All dashboards must render inside `DashboardLayout`
     (real global sidebar + global header; no local sidebars/headers).
   - Tabs are **fixed**; new tabs require updating `IA-SITEMAP.md` first.
   - Layer 1 = dashboard views only. Detail pages live in `L2_DETAIL_PAGES.md`.
   - Default tab behavior must be defined per persona.
   ```

3. **Add HCP CME tracker note:**
   - Locate `credits` tab description in HCP section
   - Add note after credits description:
     ```markdown
     > CME tracker should use compact design with strategic placement per tab  
     > (see `UI_REVAMP_CME_TRACKER.md` for details).
     ```

**Acceptance Criteria:**
- [ ] All 5 personas have base routes defined
- [ ] All tab keys listed and match exactly
- [ ] Global L1 Rules section added
- [ ] HCP CME tracker note added near credits description

**Files Modified:**
- `Docs/IA-SITEMAP.md`

---

### TASK 1.3 - Create `Docs/L1_DASHBOARD_VIEWS.md` (Layer 1 Specification)

**Objective:** Create comprehensive specification for all dashboard tab views (L1).

**Steps:**

1. **Create file with intro:**
   ```markdown
   # Layer 1 - Dashboard Views Specification
   
   ## Definition
   Layer 1 = `/dashboard/<persona>?tab=<tabKey>` views.
   L1 shows lists, KPIs, high-level actions; **no entity detail pages**.
   ```

2. **For each persona, document each tab:**
   
   **Template for each tab:**
   ```markdown
   ### [Persona] - [Tab Name]
   
   **Purpose:** [One-line description]
   
   **Key Contents:**
   - KPI: [List KPIs if any]
   - Tables/Lists: [What data is shown]
   - Filters: [Available filters]
   - Main Components: [Component names]
   
   **Primary Actions:**
   - [Action name] → [L2 route or in-page]
   - [Action name] → [L2 route or in-page]
   
   **L2 Routes Linked:**
   - [Route from L2_DETAIL_PAGES.md]
   - [Route from L2_DETAIL_PAGES.md]
   ```

3. **Document all personas and tabs:**
   - Organizer: `overview`, `activities`, `accreditation`, `execution`, `sponsors`
   - Event Manager: `assignments`, `checkin`, `attendance`, `certificates`, `handover`
   - HCP: `discover`, `registrations`, `credits`, `certs_reviews`
   - Sponsor/Vendor: `marketplace`, `purchases`, `assets`, `performance`, `billing`
   - Regulator: `review_queue`, `decision_workspace`, `compliance_monitor`, `audit_risk`, `analytics`

4. **Add Global L1 Rules section at end:**
   ```markdown
   ## Global L1 Rules
   
   - L1 never hosts entity detail pages.
   - Any "Open event / Open ticket / Open application / Open sponsorship" must either:
     - Navigate to an L2 route defined in `L2_DETAIL_PAGES.md`, or
     - Stay in-page (drawer/dialog) with **no URL change**.
   ```

**Acceptance Criteria:**
- [ ] File created with clear intro
- [ ] All 5 personas documented
- [ ] All tabs documented with purpose, contents, actions, L2 links
- [ ] Global L1 Rules section added

**Files Created:**
- `Docs/L1_DASHBOARD_VIEWS.md`

---

### TASK 1.4 - Create `Docs/L2_DETAIL_PAGES.md` (Layer 2 Specification)

**Objective:** Create authoritative list of all allowed detail page routes.

**Steps:**

1. **Create file with intro:**
   ```markdown
   # Layer 2 - Detail Pages Specification
   
   ## Definition
   Layer 2 = detail pages under `/dashboard/<persona>/<entity>/<id>`.
   Only these routes are allowed for dashboards detail pages.
   ```

2. **List all L2 routes per persona:**

   **Organizer (7 routes):**
   - `/dashboard/organizer/events/[eventId]` - Event master
   - `/dashboard/organizer/events/[eventId]/edit`
   - `/dashboard/organizer/events/[eventId]/registrations`
   - `/dashboard/organizer/events/[eventId]/attendance`
   - `/dashboard/organizer/events/[eventId]/certificates`
   - `/dashboard/organizer/events/[eventId]/sponsors`
   - `/dashboard/organizer/events/[eventId]/assign`

   **Event Manager (4 routes):**
   - `/dashboard/event-manager/events/[eventId]` – Ops overview
   - `/dashboard/event-manager/events/[eventId]/checkin`
   - `/dashboard/event-manager/events/[eventId]/attendance`
   - `/dashboard/event-manager/events/[eventId]/handover`
   
   **Note:** Current `IA-SITEMAP.md` only lists 3 Event Manager detail routes. The master plan specifies 4 (including `/handover`). Task 1.4 should create L2_DETAIL_PAGES.md with all 4 routes as specified in the master plan.

   **HCP (3 routes):**
   - `/dashboard/hcp/events/[eventId]`
   - `/dashboard/hcp/tickets/[ticketId]`
   - `/dashboard/hcp/certificates/[certificateId]`

   **Sponsor/Vendor (3 routes):**
   - `/dashboard/vendor/events/[eventId]`
   - `/dashboard/vendor/sponsorships/[sponsorshipId]`
   - `/dashboard/vendor/campaigns/[campaignId]`

   **Regulator (4 routes):**
   - `/dashboard/regulator/applications/[applicationId]`
   - `/dashboard/regulator/applications/[applicationId]/decision`
   - `/dashboard/regulator/applications/[applicationId]/checklist`
   - `/dashboard/regulator/providers/[providerId]`

3. **For each route, add 3 bullets:**
   - **From:** which L1 tab/CTA opens it
   - **Purpose:** one-line intent
   - **Flows to:** next stage/persona if relevant

4. **Add Global L2 Rules:**
   ```markdown
   ## Global L2 Rules
   
   - No `/dashboard/...` detail routes outside this list.
   - Any entity detail click must target **one** of these or stay in-page.
   - Any path like `/live`, `/details`, `/view` etc. that's not defined here is **invalid**.
   - For all routes listed here:
     - UI must not link to them until they are at least stub-implemented.
     - When linked, they must never fall through to raw 404.
   ```

**Acceptance Criteria:**
- [ ] File created with clear intro
- [ ] All 21 routes listed (7+4+3+3+4)
- [ ] Each route has From/Purpose/Flows to bullets
- [ ] Global L2 Rules section added

**Files Created:**
- `Docs/L2_DETAIL_PAGES.md`

---

### TASK 1.5 - Update `Docs/COMPLETE_SITEMAP.md` (Routing Overview)

**Objective:** Add dashboard area section showing how personas fit into central routing overview.

**Steps:**

1. **Add/rename section:**
   ```markdown
   ## Dashboard Area (Personas)
   ```
   - Explain: this section shows how persona dashboards fit into the **central routing overview** (public, auth, dashboards, utility).
   - State: It is not claiming to list every possible route in the product but defines the dashboard cluster clearly.

2. **Add ASCII tree:**
   ```
   /dashboard
   ├── /dashboard/organizer?tab=overview|activities|accreditation|execution|sponsors
   ├── /dashboard/event-manager?tab=assignments|checkin|attendance|certificates|handover
   ├── /dashboard/hcp?tab=discover|registrations|credits|certs_reviews
   ├── /dashboard/vendor?tab=marketplace|purchases|assets|performance|billing
   └── /dashboard/regulator?tab=review_queue|decision_workspace|compliance_monitor|audit_risk|analytics
   ```
   
   **Note:** The ASCII tree shows tab query keys only (L1). L2 detail routes are shown in the Layer 2 section below.

3. **Add Layer 2 section:**
   ```markdown
   ## Layer 2 - Persona Detail Pages
   
   Total: 21 detail routes
   - Organizer: 7
   - Event Manager: 4
   - HCP: 3
   - Vendor: 3
   - Regulator: 4
   
   See `L2_DETAIL_PAGES.md` as the **authoritative list**.
   
   **Rule:** Agents may not introduce new `/dashboard/...` detail routes outside those listed in `L2_DETAIL_PAGES.md`.
   ```

**Acceptance Criteria:**
- [ ] Dashboard Area section added/renamed
- [ ] ASCII tree showing all persona dashboards with tabs
- [ ] Layer 2 section with counts and link to L2_DETAIL_PAGES.md
- [ ] Rule stated about no new routes

**Files Modified:**
- `Docs/COMPLETE_SITEMAP.md`

---

### TASK 1.6 - Update `Docs/FLOWS.md` (Cross-Persona Spine with Real Routes)

**Objective:** Add cross-persona flow with explicit route references.

**Steps:**

1. **Add new section:**
   ```markdown
   ## Cross-Persona Spine - Event → Credits
   ```

2. **Write happy-path with real routes:**
   - Organizer drafts / edits event: `/dashboard/organizer/events/[eventId]/edit`
   - Organizer submits for accreditation from: `/dashboard/organizer/events/[eventId]`
   - Regulator reviews application: `/dashboard/regulator/applications/[applicationId]`
   - Regulator makes decision via: `/dashboard/regulator/applications/[applicationId]/decision`
   - Organizer publishes event + assigns EM: `/dashboard/organizer/events/[eventId]/assign`
   - Event Manager runs event:
     - `/dashboard/event-manager/events/[eventId]/checkin`
     - `/dashboard/event-manager/events/[eventId]/attendance`
     - `/dashboard/event-manager/events/[eventId]/handover`
   - Organizer sees attendance: `/dashboard/organizer/events/[eventId]/attendance`
   - Certificates generated (Organizer/EM side – reference event + certificate link)
   - HCP sees:
     - Event: `/dashboard/hcp/events/[eventId]`
     - Ticket: `/dashboard/hcp/tickets/[ticketId]`
     - Certificate: `/dashboard/hcp/certificates/[certificateId]`
     - Credits: HCP dashboard `credits` tab referencing these

3. **Add explicit rule:**
   ```markdown
   **Route Validation Rule:**
   All pages referenced in this flow must be routes defined in `L1_DASHBOARD_VIEWS.md` and `L2_DETAIL_PAGES.md`. No custom URLs are allowed in this spine.
   ```
   
   **Note:** The master plan states: "All pages referenced in this flow must be routes defined in `L1_DASHBOARD_VIEWS.md` and `L2_DETAIL_PAGES.md`. No custom URLs are allowed in this spine."

**Acceptance Criteria:**
- [ ] Cross-Persona Spine section added
- [ ] Happy-path documented with all real routes
- [ ] Route validation rule added

**Files Modified:**
- `Docs/FLOWS.md`

---

### TASK 1.7 - Update `Docs/TEST-PLAN.md` (E2E Scenario Bound to L1 + L2)

**Objective:** Define canonical E2E test scenario following cross-persona spine.

**Steps:**

1. **Add E2E section (if not exists) or update existing:**

2. **Define canonical scenario:**
   ```markdown
   ## Canonical E2E Scenario - Cross-Persona Happy Path
   
   This scenario exactly follows the cross-persona spine in `FLOWS.md` using the **exact** L1 + L2 routes.
   
   **Test Flow:**
   - Exactly follows the cross-persona spine above
   - Explicitly names each page by full route
   - Requires navigation through at least:
     - One L1 tab and one L2 route per persona
   ```
   
   **Note:** The master plan states the scenario should "exactly follow the cross-persona spine above" and "explicitly name each page by full route." The detailed step-by-step flow should match the routes documented in the Cross-Persona Spine section of FLOWS.md.

3. **Add requirements:**
   ```markdown
   **Requirements:**
   
   In this scenario:
   - No navigation may hit raw 404.
   - No screen may be an unstyled blank page; every L2 route must render a minimally designed layout using the design system.
   ```
   
   **Note:** The master plan states these exact requirements. The scenario should require navigation through at least one L1 tab and one L2 route per persona.

4. **Reference test file:**
   ```markdown
   **Implementation:**
   This test is implemented in `tests/e2e/demo-happy-path.spec.ts` and must remain passing.
   ```
   
   **Note:** The master plan states: "This test is implemented in `tests/e2e/demo-happy-path.spec.ts` and must remain passing."

**Acceptance Criteria:**
- [ ] E2E section added/updated
- [ ] Canonical scenario defined with exact routes
- [ ] Requirements listed
- [ ] Test file referenced

**Files Modified:**
- `Docs/TEST-PLAN.md`

---

### TASK 1.8 - Update `Docs/ACCEPTANCE.md` (Dashboards + L2 Definition of Done)

**Objective:** Add acceptance criteria for persona dashboards and L2 pages.

**Steps:**

1. **Add new section:**
   ```markdown
   ## Persona Dashboards & Detail Pages v1
   ```

2. **Add acceptance bullets:**
   ```markdown
   ### Acceptance Criteria
   
   - All `/dashboard/<persona>?tab=...` views adhere to `L1_DASHBOARD_VIEWS.md` and `IA-SITEMAP.md`.
   - All routes in `L2_DETAIL_PAGES.md` either:
     - Are implemented with DS-compliant UI, or
     - Are not linked from any UI (no dead links).
   - No raw Next.js 404 appears under any `/dashboard/...` path during happy-path.
   - The following commands must pass:
     - `npm run type-check`
     - `npm test`
     - `npx playwright test tests/e2e/demo-happy-path.spec.ts`
   ```

**Acceptance Criteria:**
- [ ] Section added
- [ ] All acceptance bullets listed
- [ ] Commands specified

**Files Modified:**
- `Docs/ACCEPTANCE.md`

---

### TASK 1.9 - Update Design System Docs

**Objective:** Add dashboard patterns to design system and ensure CME tracker reference.

**Steps:**

1. **Update `Docs/IOS_DESIGN_SYSTEM.md`:**

   Add section:
   ```markdown
   ## Dashboard & Detail Page Patterns
   
   ### Allowed Patterns
   - KPI strips use `LiquidGlassCard`
   - Data sections use `Card` + table
   - Primary actions use `GlassButton`
   - Empty states use `EmptyState` + "Reset demo data" CTA where relevant
   
   ### Rules
   - No raw Tailwind color tokens on dashboards; use design system tokens/components.
   - All dashboard pages must use `DashboardLayout` wrapper.
   ```

2. **Verify `UI_REVAMP_CME_TRACKER.md` reference:**
   - Ensure it's referenced from HCP `credits` tab in `L1_DASHBOARD_VIEWS.md`
   - Already referenced from `IA-SITEMAP.md` (from Task 1.2)
   
   **Note:** The master plan states: "Ensure `UI_REVAMP_CME_TRACKER.md` is referenced: From HCP `credits` tab in `L1_DASHBOARD_VIEWS.md`. Already referenced from `IA-SITEMAP.md` via the note you requested."

**Acceptance Criteria:**
- [ ] Dashboard & Detail Page Patterns section added to IOS_DESIGN_SYSTEM.md
- [ ] Allowed patterns defined
- [ ] Rules stated
- [ ] CME tracker reference verified in both locations

**Files Modified:**
- `Docs/IOS_DESIGN_SYSTEM.md`

---

## Implementation Order

1. **Day 1:**
   - Task 1.1 (INDEX.md)
   - Task 1.2 (IA-SITEMAP.md)
   - Task 1.3 (L1_DASHBOARD_VIEWS.md) - Start

2. **Day 2:**
   - Task 1.3 (L1_DASHBOARD_VIEWS.md) - Complete
   - Task 1.4 (L2_DETAIL_PAGES.md)
   - Task 1.5 (COMPLETE_SITEMAP.md)

3. **Day 3:**
   - Task 1.6 (FLOWS.md)
   - Task 1.7 (TEST-PLAN.md)
   - Task 1.8 (ACCEPTANCE.md)
   - Task 1.9 (Design System docs)

---

## Verification Checklist

After completing all tasks:

- [ ] All files created/modified as specified
- [ ] All routes match between IA-SITEMAP, L1, L2, and COMPLETE_SITEMAP
- [ ] Precedence hierarchy clear in INDEX.md
- [ ] Cross-persona flow documented with real routes
- [ ] E2E test scenario defined
- [ ] Acceptance criteria documented
- [ ] Design system patterns added
- [ ] No conflicts between documents

---

## Notes

- All documentation must be consistent across files
- Route definitions must match exactly
- Any discrepancies must be resolved before marking tasks complete
- Documentation is the foundation for Phase 2 implementation

## Important Discrepancies to Resolve

**Current Codebase vs Master Plan:**
- The current codebase uses different tab keys than specified in the master plan:
  - **Regulator:** Code uses `queue`, `review`, `decisions`, `monitoring` but master plan specifies `review_queue`, `decision_workspace`, `compliance_monitor`, `audit_risk`
  - **Event Manager:** Code uses `inbox`, `live-ops` but master plan specifies `assignments`, `checkin`
- **Action Required:** During Task 1.2, verify that `IA-SITEMAP.md` matches the master plan exactly. If the codebase has different tab keys, they must be updated to match the master plan, OR the master plan must be updated if the codebase keys are the correct ones.

**Event Manager L2 Routes:**
- Master plan specifies 4 routes (including `/handover`)
- Current `IA-SITEMAP.md` may only list 3 routes
- **Action Required:** Task 1.4 should create L2_DETAIL_PAGES.md with all 4 routes as specified in master plan

**File Paths:**
- `DashboardLayout` component is at: `src/components/DashboardLayout.tsx`
- Import path: `@/components/DashboardLayout`
- All file paths in this plan should be verified against actual codebase structure

---

**Status:** Ready for Implementation  
**Next Phase:** Phase 2 - Complete Dashboard Implementation

