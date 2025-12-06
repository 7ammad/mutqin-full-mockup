PHASE – Event Manager Corrective Implementation (Pilot Persona)
TASK 1 – Re-align /dashboard/event-manager entry

Ensure /dashboard/event-manager:

Uses DashboardLayout with the real global sidebar + header.

Reads tab key from query param: assignments | checkin | attendance | certificates | handover.

Kill any:

Local sidebars/headers inside EM views.

Alternative tab keys (queue, live, etc.).

TASK 2 – Fix / (create) all EM L2 pages

Ensure these four pages exist and are DS-compliant:

/dashboard/event-manager/events/[eventId] – EM1 Ops Overview

/dashboard/event-manager/events/[eventId]/checkin – EM2 Check-In Console

/dashboard/event-manager/events/[eventId]/attendance – EM3 Attendance Ledger

/dashboard/event-manager/events/[eventId]/handover – EM4 Handover Pack

For each:

Wrap with DashboardLayout.

Use design system:

Title area (event name + meta).

At least one LiquidGlassCard or Card block for main content.

No blank white screens, no raw Tailwind colors.

If real data isn’t wired yet:

Use seeded/demo data or a clearly labeled “Demo stub – implementation pending” section (still styled).

TASK 3 – Wire EM L1 → EM L2 navigation correctly

For /dashboard/event-manager:

assignments tab:

Row click → /dashboard/event-manager/events/[eventId] (EM1).

Accept / Decline buttons:

In-page POST only, no route change.

checkin tab:

“Open check-in” → /dashboard/event-manager/events/[eventId]/checkin (EM2).

attendance tab:

Row click → /dashboard/event-manager/events/[eventId]/attendance (EM3).

handover tab:

Row click → /dashboard/event-manager/events/[eventId]/handover (EM4).

certificates tab:

If you don’t have a clear flow yet, keep it read-only (stats only) or link to Organizer event certificates (O5) as documented. No fake buttons.

Remove/replace any links pointing to:

/dashboard/event-manager/live

/details, /view, or any route not in L2_DETAIL_PAGES.md.

TASK 4 – Data wiring (reads only, respecting CONTRACTS)

Use existing typed GET/read functions for:

Assignments list.

Event summary / basic data for EM1.

Attendance data for EM3.

Handover summary for EM4 (if modeled; otherwise stub with seed).

Do not:

Add new entity fields or statuses without updating CONTRACTS.md.

Ensure:

No any / loose unknown in EM components.

You respect existing types from the policy/contract layer.

If a required EM read endpoint is missing but present in CONTRACTS:

Add minimal GET in src/lib/api + src/lib/mockApi that matches contracts.

No new domain concepts.

TASK 5 – Actions wiring (existing POSTs only)

Wire only what already exists:

Accept/decline assignment (in assignments tab and/or EM1).

Check-in ticket (EM2).

Finalize attendance (EM3).

If a handover POST exists in contracts, wire it in EM4; otherwise keep read-only.

Requirements:

Use the typed API client.

Use toast system for success/error.

Refresh relevant data via existing store/selectors; no new domain logic.

TASK 6 – Seed + empty state for EM

In your demo seed/store:

Guarantee at least 1–2 assignments for EM.

Ensure those events have:

Check-inable tickets.

Attendance entries.

Handover summary seed (even if simple).

For each EM tab:

If list is empty, show a designed EmptyState with:

Short title.

One-line description.

“Reset demo data” or equivalent CTA (if your demo supports it).

No tab should ever land on:

Blank page.

Raw text like “No data”.

TASK 7 – EM-focused E2E slice

In Playwright:

Add/extend a scenario that specifically walks EM:

Ensure an event is assigned to EM (can be pre-seeded).

Visit /dashboard/event-manager?tab=assignments.

Click into EM1 (events/[eventId]).

From there, navigate to:

EM2 (/checkin)

EM3 (/attendance)

EM4 (/handover)

Assert:

No navigation step hits 404.

Each page renders:

A title containing event name.

At least one DS card.

Key actions (accept assignment, maybe one check-in/finalize) succeed and show toasts.

Run:

npm run type-check

npm test

npx playwright test tests/e2e/demo-happy-path.spec.ts (plus any EM-specific spec)

TASK 8 – Manual doc vs UI audit (EM only)

Open:

IA-SITEMAP.md → EM section.

L1_DASHBOARD_VIEWS.md → EM tab descriptions.

L2_DETAIL_PAGES.md → EM1–EM4.

In the browser, click through all EM tabs and detail links and check:

Every tab exists and matches its stated purpose.

Every link to a detail page matches one of the four EM L2 routes.

There are no “mystery” routes not in L2 docs.

If EM passes this, we use the same pattern for Organizer, HCP, Vendor, Regulator.