# Layer 1 – Dashboard Views

Layer 1 (L1) = persona dashboards under:

- `/dashboard/<persona>?tab=<tabKey>`

L1 views:

- Show lists, KPIs, filters, high-level actions.
- Never act as “entity detail” pages.
- May open modals/drawers, or navigate into L2 routes.

Detail pages (L2) are defined in `L2_DETAIL_PAGES.md`.

---

## Organizer Dashboard

Base: `/dashboard/organizer`  
Tabs: `overview | activities | accreditation | execution | sponsors`

### Tab: overview

- Purpose:
  - Give Organizer a snapshot of pipeline and next actions.
- Contents:
  - KPI strip: draft events, pending accreditation, approved, upcoming, completed.
  - “Next actions” list (e.g. “3 activities ready to submit”).
- Primary actions:
  - “Create new activity” (if available in current scope).
- Navigation:
  - Event cards/rows → `/dashboard/organizer/events/[eventId]` (O1 – Event Master).

### Tab: activities

- Purpose:
  - Workbench for all events owned by Organizer.
- Contents:
  - Table: event, date, city, lifecycle status.
  - Filters: status, date, city.
- Primary actions:
  - Row-level:
    - Open master: `/dashboard/organizer/events/[eventId]` (O1).
    - Edit: `/dashboard/organizer/events/[eventId]/edit` (O2).
    - Registrations: `/dashboard/organizer/events/[eventId]/registrations` (O3).
    - Attendance: `/dashboard/organizer/events/[eventId]/attendance` (O4).
    - Certificates: `/dashboard/organizer/events/[eventId]/certificates` (O5).
    - Sponsors: `/dashboard/organizer/events/[eventId]/sponsors` (O6).

### Tab: accreditation

- Purpose:
  - Track accreditation submissions and decisions.
- Contents:
  - Table: event, submission date, status, regulator notes.
- Primary actions:
  - “Submit for accreditation” (existing POST only).
- Navigation:
  - Row → `/dashboard/organizer/events/[eventId]` (O1, accreditation section visible).

### Tab: execution

- Purpose:
  - Manage execution readiness and post-event status.
- Contents:
  - Table: event, assigned EM/vendor, execution date, attendance status, compliance status.
- Primary actions:
  - Assign EM/vendor: `/dashboard/organizer/events/[eventId]/assign` (O7).
  - View registrations: `/dashboard/organizer/events/[eventId]/registrations` (O3).
  - View attendance: `/dashboard/organizer/events/[eventId]/attendance` (O4).
- Navigation:
  - Event name → `/dashboard/organizer/events/[eventId]` (O1).

### Tab: sponsors

- Purpose:
  - Overview of sponsorships across events.
- Contents:
  - Table: sponsor, event, package, amount, status.
  - KPIs: total sponsored events, top sponsors.
- Primary actions:
  - “View event sponsorships” → `/dashboard/organizer/events/[eventId]/sponsors` (O6).
- Navigation:
  - Event name → `/dashboard/organizer/events/[eventId]` (O1).

---

## Event Manager Dashboard (Execution Vendor)

Base: `/dashboard/event-manager`  
Tabs: `assignments | checkin | attendance | certificates | handover`

### Tab: assignments

- Purpose:
  - Inbox of assigned events requiring acceptance.
- Contents:
  - Table: event, date, venue, assignment status, priority.
- Primary actions:
  - Accept / Decline assignment (existing POST).
- Navigation:
  - Row → `/dashboard/event-manager/events/[eventId]` (EM1 – Ops Overview).

### Tab: checkin

- Purpose:
  - Launch live check-in for events in execution.
- Contents:
  - List/dropdown of “today / upcoming” events with small stats.
- Primary actions:
  - “Open check-in” → `/dashboard/event-manager/events/[eventId]/checkin` (EM2).

### Tab: attendance

- Purpose:
  - Manage attendance ledger for each event and its finalize status.
- Contents:
  - Table: event, registered vs attended, exceptions count, finalized flag.
- Primary actions:
  - “Open attendance” → `/dashboard/event-manager/events/[eventId]/attendance` (EM3).

### Tab: certificates

- Purpose:
  - EM view into certificate readiness (if RBAC allows).
- Contents:
  - Table: event, eligible count, issued count.
- Navigation:
  - “Open event certificates” → `/dashboard/organizer/events/[eventId]/certificates` (O5)  
    or EM-side equivalent if defined later (must be documented before use).

### Tab: handover

- Purpose:
  - Post-event handover status for each event.
- Contents:
  - Table: event, date, handover status (pending, in_progress, completed).
- Primary actions:
  - “Open handover” → `/dashboard/event-manager/events/[eventId]/handover` (EM4).

---

## HCP Dashboard

Base: `/dashboard/hcp`  
Tabs: `discover | registrations | credits | certs_reviews`

### Tab: discover

- Purpose:
  - Browse accredited activities.
- Contents:
  - Cards: event, date, city, credits, organizer.
  - Filters: specialty, city, date.
- Primary actions:
  - “Register” – in-page modal (no route change).
- Navigation:
  - Card → `/dashboard/hcp/events/[eventId]` (H1).

- CME note:
  - Compact credit indicators may appear here, but the full tracker is on `credits` tab.
  - Design: see `UI_REVAMP_CME_TRACKER.md`.

### Tab: registrations

- Purpose:
  - List upcoming and past registrations (tickets).
- Contents:
  - Table: event, date, status (upcoming, completed, cancelled).
- Primary actions:
  - “View ticket” → `/dashboard/hcp/tickets/[ticketId]` (H2).
- Navigation:
  - Event name → `/dashboard/hcp/events/[eventId]` (H1).

### Tab: credits

- Purpose:
  - CME tracker: accumulated credits/hours.
- Contents:
  - KPI strip: total this year, total lifetime, per specialty.
  - Table: event, credits, date, provider.
- Navigation:
  - “Open event” → `/dashboard/hcp/events/[eventId]` (H1).
  - “Open certificate” → `/dashboard/hcp/certificates/[certificateId]` (H3).

### Tab: certs_reviews

- Purpose:
  - Certificates & optional reviews in one place.
- Contents:
  - Table: event, date, credits, certificate status, review status.
- Primary actions:
  - “Open certificate” → `/dashboard/hcp/certificates/[certificateId]` (H3).
  - “Leave review” – in-page modal only.

---

## Sponsor / Vendor Dashboard

Base: `/dashboard/vendor`  
Tabs: `marketplace | purchases | assets | performance | billing`

### Tab: marketplace

- Purpose:
  - Discover sponsorship opportunities.
- Contents:
  - Cards: event, audience profile/size, base packages.
- Primary actions:
  - “View event” → `/dashboard/vendor/events/[eventId]` (V1).
  - “Sponsor this event” – in-page modal (no new route).
- Note:
  - There is **no** `/dashboard/vendor/marketplace` detail route. This is L1 only.

### Tab: purchases

- Purpose:
  - List of purchased sponsorships.
- Contents:
  - Table: event, package, amount, payment status.
- Primary actions:
  - “Open sponsorship” → `/dashboard/vendor/sponsorships/[sponsorshipId]` (V2).

### Tab: assets

- Purpose:
  - Manage creative assets & compliance files.
- Contents:
  - List of assets per campaign/event.
- Primary actions:
  - Upload/replace assets (in-page).

### Tab: performance

- Purpose:
  - See sponsor ROI across campaigns and events.
- Contents:
  - KPIs and charts: events sponsored, attendees reached, specialties.
  - Table: campaigns with period and metrics.
- Primary actions:
  - “Open campaign” → `/dashboard/vendor/campaigns/[campaignId]` (V3).
  - “Open event performance” → `/dashboard/vendor/events/[eventId]` (V1).

### Tab: billing

- Purpose:
  - Invoices and payment history.
- Contents:
  - Table: invoice, event/campaign, amount, status.
- Navigation:
  - Sponsorship/campaign → V2 / V3.

---

## Regulator Dashboard

Base: `/dashboard/regulator`  
Tabs: `review_queue | decision_workspace | compliance_monitor | audit_risk | analytics`

### Tab: review_queue

- Purpose:
  - Triage for all new accreditation applications.
- Contents:
  - Table: applicationId, event, provider, status, submitted date.
- Primary actions:
  - “Open application” → `/dashboard/regulator/applications/[applicationId]` (R1).
  - “Review” → `/dashboard/regulator/applications/[applicationId]/decision` (R2).

### Tab: decision_workspace

- Purpose:
  - Focused workspace of “in review” applications.
- Contents:
  - List of active application rows.
- Primary actions:
  - “Open decision workspace” → `/dashboard/regulator/applications/[applicationId]/decision` (R2).

### Tab: compliance_monitor

- Purpose:
  - Monitor provider/event compliance (attendance/hours etc.).
- Contents:
  - Provider table: name, compliance score, flags.
  - Event table: event, provider, compliance status, last submission date.
- Navigation:
  - Provider row → `/dashboard/regulator/providers/[providerId]` (R4).
  - Event row → `/dashboard/regulator/applications/[applicationId]` (R1).

### Tab: audit_risk

- Purpose:
  - Focus on high-risk providers/events.
- Contents:
  - Table: provider, risk level, last audit date, unresolved issues.
- Navigation:
  - Provider row → `/dashboard/regulator/providers/[providerId]` (R4).

### Tab: analytics

- Purpose:
  - Ecosystem-level metrics for the regulator.
- Contents:
  - Charts: events/year, credits issued, provider performance.
- Navigation:
  - Optional “Open provider” / “Open application” links that must map to R1/R4 only.

---

## Global L1 Rules

- L1 must not act as an entity detail page.
- Any “Open X” that requires a dedicated detail view must:
  - Navigate to a route defined in `L2_DETAIL_PAGES.md`, or
  - Use an in-page modal/drawer with no route change.
- No persona may add or rename tabs without updating `IA-SITEMAP.md` and this file.
