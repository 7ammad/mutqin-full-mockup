Here’s the clean, final version you can copy into your project as **the master plan**.

No “full site map” wording anywhere. This is L1 + L2 + routing overview + implementation.

---

## PHASE 1 – GUIDING DOCUMENTATION (LOCK L1 + L2 + ROUTING OVERVIEW)

Goal: Agents have **one authoritative stack** for dashboards and detail pages before touching code.

---

### TASK 1.1 – `Docs/INDEX.md` (Entry + Precedence)

Update `INDEX.md`:

* Add a “Start here for dashboards” section that:

  * Points to:

    * `Docs/IA-SITEMAP.md`
    * `Docs/L1_DASHBOARD_VIEWS.md`
    * `Docs/L2_DETAIL_PAGES.md`
    * `Docs/COMPLETE_SITEMAP.md`
    * `Docs/FLOWS.md`
    * `Docs/TEST-PLAN.md`
    * `Docs/ACCEPTANCE.md`
  * States **precedence for dashboards**:

    * `L2_DETAIL_PAGES.md` → `L1_DASHBOARD_VIEWS.md` → `IA-SITEMAP.md`
      override any older dashboard-related notes elsewhere.
  * Clarifies role of `COMPLETE_SITEMAP.md`:

    * “`COMPLETE_SITEMAP.md` holds the central routing overview (public, auth, dashboards, utility). For dashboards specifically, always follow: `IA-SITEMAP.md` → `L1_DASHBOARD_VIEWS.md` → `L2_DETAIL_PAGES.md`.”

---

### TASK 1.2 – `Docs/IA-SITEMAP.md` (Persona + Tabs, HCP CME Note)

In `IA-SITEMAP.md`, under the **dashboard section**:

* For each persona, lock base route + tabs:

  * **Organizer**

    * Base: `/dashboard/organizer`
    * Tabs: `overview | activities | accreditation | execution | sponsors`
  * **Event Manager**

    * Base: `/dashboard/event-manager`
    * Tabs: `assignments | checkin | attendance | certificates | handover`
  * **HCP**

    * Base: `/dashboard/hcp`
    * Tabs: `discover | registrations | credits | certs_reviews`
  * **Sponsor/Vendor**

    * Base: `/dashboard/vendor`
    * Tabs: `marketplace | purchases | assets | performance | billing`
  * **Regulator**

    * Base: `/dashboard/regulator`
    * Tabs: `review_queue | decision_workspace | compliance_monitor | audit_risk | analytics`

* Add **global L1 rules** here:

  * All dashboards must render inside `DashboardLayout`
    (real global sidebar + global header; no local sidebars/headers).
  * Tabs are **fixed**; new tabs require updating `IA-SITEMAP.md` first.
  * Layer 1 = dashboard views only. Detail pages live in `L2_DETAIL_PAGES.md`.

* Add the **HCP CME tracker note** near the `credits` description:

  After the sentence where you describe `credits` as a credits/hours tracker, add:

  ```md
  > CME tracker should use compact design with strategic placement per tab  
  > (see `UI_REVAMP_CME_TRACKER.md` for details).
  ```

---

### TASK 1.3 – `Docs/L1_DASHBOARD_VIEWS.md` (NEW – Layer 1 spec)

Create `Docs/L1_DASHBOARD_VIEWS.md` with:

* Intro:

  * Define Layer 1: `/dashboard/<persona>?tab=<tabKey>` views.
  * State: L1 shows lists, KPIs, high-level actions; **no entity detail pages**.

* For **each persona**, define each tab:

  For every tab, specify:

  * **Purpose** – what the tab is for.
  * **Key contents** – KPIs, tables, filters, main components.
  * **Primary actions** – main buttons (and whether they are in-page or lead to L2 routes).
  * **L2 routes it links to** – explicit list pointing into `L2_DETAIL_PAGES.md`.

  Personas and tabs to cover:

  * Organizer: `overview`, `activities`, `accreditation`, `execution`, `sponsors`.
  * Event Manager: `assignments`, `checkin`, `attendance`, `certificates`, `handover`.
  * HCP: `discover`, `registrations`, `credits`, `certs_reviews`.
  * Sponsor/Vendor: `marketplace`, `purchases`, `assets`, `performance`, `billing`.
  * Regulator: `review_queue`, `decision_workspace`, `compliance_monitor`, `audit_risk`, `analytics`.

* End with **Global L1 Rules**:

  * L1 never hosts entity detail pages.
  * Any “Open event / Open ticket / Open application / Open sponsorship” must either:

    * Navigate to an L2 route defined in `L2_DETAIL_PAGES.md`, or
    * Stay in-page (drawer/dialog) with **no URL change**.

---

### TASK 1.4 – `Docs/L2_DETAIL_PAGES.md` (NEW – Layer 2 spec)

Create `Docs/L2_DETAIL_PAGES.md`:

* Intro:

  * Layer 2 = detail pages under `/dashboard/<persona>/<entity>/<id>`.
  * Only these routes are allowed for dashboards detail pages.

* Per persona, list all L2 routes with **tight spec**:

  **Organizer (7):**

  * `/dashboard/organizer/events/[eventId]` – Event master.
  * `/dashboard/organizer/events/[eventId]/edit`.
  * `/dashboard/organizer/events/[eventId]/registrations`.
  * `/dashboard/organizer/events/[eventId]/attendance`.
  * `/dashboard/organizer/events/[eventId]/certificates`.
  * `/dashboard/organizer/events/[eventId]/sponsors`.
  * `/dashboard/organizer/events/[eventId]/assign`.

  **Event Manager (4):**

  * `/dashboard/event-manager/events/[eventId]` – Ops overview.
  * `/dashboard/event-manager/events/[eventId]/checkin`.
  * `/dashboard/event-manager/events/[eventId]/attendance`.
  * `/dashboard/event-manager/events/[eventId]/handover`.

  **HCP (3):**

  * `/dashboard/hcp/events/[eventId]`.
  * `/dashboard/hcp/tickets/[ticketId]`.
  * `/dashboard/hcp/certificates/[certificateId]`.

  **Sponsor/Vendor (3):**

  * `/dashboard/vendor/events/[eventId]`.
  * `/dashboard/vendor/sponsorships/[sponsorshipId]`.
  * `/dashboard/vendor/campaigns/[campaignId]`.

  **Regulator (4):**

  * `/dashboard/regulator/applications/[applicationId]`.
  * `/dashboard/regulator/applications/[applicationId]/decision`.
  * `/dashboard/regulator/applications/[applicationId]/checklist`.
  * `/dashboard/regulator/providers/[providerId]`.

* For each route, add 3 bullets:

  * **From:** which L1 tab/CTA opens it.
  * **Purpose:** one-line intent.
  * **Flows to:** next stage/persona if relevant.

* Add **Global L2 Rules**:

  * No `/dashboard/...` detail routes outside this list.
  * Any entity detail click must target **one** of these or stay in-page.
  * Any path like `/live`, `/details`, `/view` etc. that’s not defined here is **invalid**.
  * For all routes listed here:

    * UI must not link to them until they are at least stub-implemented.
    * When linked, they must never fall through to raw 404.

---

### TASK 1.5 – `Docs/COMPLETE_SITEMAP.md` (Routing overview)

In `COMPLETE_SITEMAP.md`:

* Add/rename a section:

  ```md
  ## Dashboard Area (Personas)
  ```

  * Explain: this section shows how persona dashboards fit into the **central routing overview** (public, auth, dashboards, utility).
    It is not claiming to list every possible route in the product but defines the dashboard cluster clearly.

* Under that:

  * Add an ASCII tree (similar to what we discussed) showing:

    * `/dashboard`
    * `/dashboard/organizer?...`
    * `/dashboard/event-manager?...`
    * `/dashboard/hcp?...`
    * `/dashboard/vendor?...`
    * `/dashboard/regulator?...`
    * with tab querykeys only (L1).

* Add another section:

  ```md
  ## Layer 2 – Persona Detail Pages
  ```

  * Summarize counts:

    * Organizer: 7, Event Manager: 4, HCP: 3, Vendor: 3, Regulator: 4 (total 21).
  * Link to `L2_DETAIL_PAGES.md` as the **authoritative list**.
  * State:

    * “Agents may not introduce new `/dashboard/...` detail routes outside those listed in `L2_DETAIL_PAGES.md`.”

---

### TASK 1.6 – `Docs/FLOWS.md` (Cross-persona spine with real routes)

In `FLOWS.md`:

* Add `## Cross-Persona Spine – Event → Credits`:

  * Write the **happy-path** with real routes:

    * Organizer drafts / edits event:

      * `/dashboard/organizer/events/[eventId]/edit`
    * Organizer submits for accreditation from:

      * `/dashboard/organizer/events/[eventId]`
    * Regulator reviews application:

      * `/dashboard/regulator/applications/[applicationId]`
      * makes decision via `/dashboard/regulator/applications/[applicationId]/decision`
    * Organizer publishes event + assigns EM:

      * `/dashboard/organizer/events/[eventId]/assign`
    * Event Manager runs event:

      * `/dashboard/event-manager/events/[eventId]/checkin`
      * `/dashboard/event-manager/events/[eventId]/attendance`
      * `/dashboard/event-manager/events/[eventId]/handover`
    * Organizer sees attendance:

      * `/dashboard/organizer/events/[eventId]/attendance`
    * Certificates generated (Organizer/EM side – reference event + certificate link).
    * HCP sees:

      * Event: `/dashboard/hcp/events/[eventId]`
      * Ticket: `/dashboard/hcp/tickets/[ticketId]`
      * Certificate: `/dashboard/hcp/certificates/[certificateId]`
      * Credits: HCP dashboard `credits` tab referencing these.

* Add explicit rule:

  * “All pages referenced in this flow must be routes defined in `L1_DASHBOARD_VIEWS.md` and `L2_DETAIL_PAGES.md`. No custom URLs are allowed in this spine.”

---

### TASK 1.7 – `Docs/TEST-PLAN.md` (E2E scenario bound to L1 + L2)

In `TEST-PLAN.md`:

* Under E2E section, define **one canonical scenario**:

  * Exactly follows the cross-persona spine above.
  * Explicitly names each page by full route.
  * Requires navigation through at least:

    * One L1 tab and one L2 route per persona.

* Add requirements:

  * “In this scenario:

    * No navigation may hit raw 404.
    * No screen may be an unstyled blank page; every L2 route must render a minimally designed layout using the design system.”

* Reference test file:

  * “This test is implemented in `tests/e2e/demo-happy-path.spec.ts` and must remain passing.”

---

### TASK 1.8 – `Docs/ACCEPTANCE.md` (Dashboards + L2 definition of done)

In `ACCEPTANCE.md`:

* Add section:

  ```md
  ## Persona Dashboards & Detail Pages v1
  ```

* Acceptance bullets:

  * All `/dashboard/<persona>?tab=...` views adhere to `L1_DASHBOARD_VIEWS.md` and `IA-SITEMAP.md`.
  * All routes in `L2_DETAIL_PAGES.md` either:

    * Are implemented with DS-compliant UI, or
    * Are not linked from any UI (no dead links).
  * No raw Next.js 404 appears under any `/dashboard/...` path during happy-path.
  * The following commands must pass:

    * `npm run type-check`
    * `npm test`
    * `npx playwright test tests/e2e/demo-happy-path.spec.ts`

---

### TASK 1.9 – `Docs/IOS_DESIGN_SYSTEM.md` + `UI_REVAMP_CME_TRACKER.md` (Design rules)

* In `IOS_DESIGN_SYSTEM.md`:

  * Add a section:

    ```md
    ## Dashboard & Detail Page Patterns
    ```

  * Define allowed patterns:

    * KPI strips use `LiquidGlassCard`.
    * Data sections use `Card` + table.
    * Primary actions use `GlassButton`.
    * Empty states use `EmptyState` + “Reset demo data” CTA where relevant.

  * Add rule:

    * “No raw Tailwind color tokens on dashboards; use design system tokens/components.”

* Ensure `UI_REVAMP_CME_TRACKER.md` is referenced:

  * From HCP `credits` tab in `L1_DASHBOARD_VIEWS.md`.
  * Already referenced from `IA-SITEMAP.md` via the note you requested.

---

## PHASE 2 – IMPLEMENTATION PLAN (AFTER DOCS ARE UPDATED)

Goal: Implement L1 + L2 in code to behave like a real product, following the docs exactly.

---

### TASK 2.1 – Routing & Dashboard 404 Safety

* Implement a **dashboard-scoped not-found** (inside `DashboardLayout`) for unknown `/dashboard/...` routes:

  * Uses Mutqin design system.
  * Not the raw Next.js 404.
* Confirm:

  * All persona dashboards use `DashboardLayout` and the global sidebar/header.
  * No persona renders its own fake sidebar or duplicate header.
* Ensure the router recognizes only:

  * L1 routes from `IA-SITEMAP.md` / `L1_DASHBOARD_VIEWS.md`.
  * L2 routes from `L2_DETAIL_PAGES.md`.

---

### TASK 2.2 – Stub All L2 Pages (Styled, No Blanks)

For every route in `L2_DETAIL_PAGES.md`:

* Create the corresponding page file under `app/dashboard/...`.
* Wrap with `DashboardLayout`.
* Use design system components:

  * At least one `LiquidGlassCard` or `Card` with:

    * Page title.
    * Short description of purpose (copied from L2 doc).
* If real data is not wired yet:

  * Display a clearly labeled “Demo stub – implementation pending” section.
* Result: no L2 route ever lands on raw 404 or an ugly blank screen.

---

### TASK 2.3 – Wire L1 Tabs to Correct L2 Routes

Per persona:

* **Organizer**

  * `activities`, `accreditation`, `execution` tabs:

    * Any “Open” / “Edit” / “Registrations” / “Attendance” / “Certificates” / “Sponsors” / “Assign EM” actions must point to the corresponding Organizer L2 routes.

* **Event Manager**

  * `assignments`:

    * Row click → `/dashboard/event-manager/events/[eventId]`.
  * `checkin`:

    * “Open check-in” → `/dashboard/event-manager/events/[eventId]/checkin`.
  * `attendance`:

    * Row → `/dashboard/event-manager/events/[eventId]/attendance`.
  * `handover`:

    * Row → `/dashboard/event-manager/events/[eventId]/handover`.

* **HCP**

  * `discover`:

    * Event card → `/dashboard/hcp/events/[eventId]`.
  * `registrations`:

    * Row → `/dashboard/hcp/tickets/[ticketId]`.
  * `credits`:

    * Event/credit row → `/dashboard/hcp/events/[eventId]` or `/dashboard/hcp/certificates/[certificateId]` as defined in L1 spec.
  * `certs_reviews`:

    * Row → `/dashboard/hcp/certificates/[certificateId]`.

* **Sponsor/Vendor**

  * `marketplace`:

    * Opportunity card → `/dashboard/vendor/events/[eventId]`.
  * `purchases`:

    * Row → `/dashboard/vendor/sponsorships/[sponsorshipId]`.
  * `performance`:

    * Campaign row → `/dashboard/vendor/campaigns/[campaignId]`.
    * Event in campaign → `/dashboard/vendor/events/[eventId]`.

* **Regulator**

  * `review_queue`:

    * Row → `/dashboard/regulator/applications/[applicationId]`.
    * “Review” → `/dashboard/regulator/applications/[applicationId]/decision`.
  * `compliance_monitor`:

    * Provider row → `/dashboard/regulator/providers/[providerId]`.
    * Event row → `/dashboard/regulator/applications/[applicationId]`.
  * `audit_risk`:

    * Provider row → `/dashboard/regulator/providers/[providerId]`.

No other `/dashboard/...` route shapes are allowed.

---

### TASK 2.4 – Wire Data Reads (Existing GETs Only)

* For each L2 page:

  * Connect to existing typed GET/read model functions.
  * Do **not** introduce new domain fields or statuses.

* If a required read is missing but already specified in `CONTRACTS.md`:

  * Implement the GET handler and client in:

    * `src/lib/api`
    * `src/lib/mockApi`
  * Follow `Docs/CONTRACTS.md` exactly.

* Type-safety rules:

  * No `any`.
  * No loose `unknown`.
  * Respect existing ActionId/policy engine where applicable.

---

### TASK 2.5 – Wire Actions (Existing POSTs Only)

* For each action button on L1 or L2:

  * Only wire if a POST already exists (per your repo context):

    * Organizer:

      * Submit for accreditation.
      * Possibly publish event / submit attendance/hours (if POSTs exist and are documented).
      * Assign EM/vendor.
    * Event Manager:

      * Accept/decline assignment.
      * Check-in ticket.
      * Finalize attendance.
    * HCP:

      * Register for event.
    * Regulator:

      * Approve/return application with reason.
    * Sponsor:

      * Purchase sponsorship (if POST exists per CONTRACTS).

  * Use:

    * Typed API client.
    * `toast-context` for success/error feedback.
    * Existing store/selectors to refresh UI, no new domain logic.

---

### TASK 2.6 – E2E & Regression Guardrail

* Update `tests/e2e/demo-happy-path.spec.ts` to:

  * Follow the cross-persona spine from `FLOWS.md` using the **exact** L1 + L2 routes.
  * For each persona, hit at least:

    * One L1 dashboard tab.
    * One L2 detail page.

* Run and record:

  * `npm run type-check`
  * `npm test`
  * `npx playwright test tests/e2e/demo-happy-path.spec.ts`

* Treat any failure here as a blocker for “dashboards with L1 + L2 are ready”.

---

