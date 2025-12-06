Event Manager phase (what you should do now)

You said: “give me the box for the event manager as well” and “each persona is a phase”.

Here’s the Event Manager block to paste to the agent.

MODE: Implementer

PHASE: Event Manager dashboard redesign (Execution Vendor / Event Ops)

GOAL:
Make Event Manager a real ops console: assignment inbox → live execution → post-event wrap → analytics. No fake sidebars, no blank pages, no 404.

CONSTRAINTS:

No new domain logic.

Use existing DS components (LiquidGlassCard, GlassButton, Badge, Toast).

No bilingual strings; language toggle only.

Keep global header untouched; populate real sidebar.

ALLOWED FILES:

src/components/eventmanager/EventManagerView.tsx

src/components/eventmanager/* (if exists)

src/components/DashboardLayout.tsx (sidebar + nav only)

src/app/demo-flow/page.tsx (links only)

src/context/demoSeed.ts (seed only)

src/context/demoStore.ts (helpers/selectors only, no new domain)

src/lib/api/* and src/lib/mockApi/* ONLY if a required GET is missing and must match docs/CONTRACTS.md

TASKS:

TASK 1: Sidebar tabs (5)

Tabs:

Inbox (المهام)

Live Ops (التشغيل المباشر)

Attendance & Exceptions (الحضور والاستثناءات)

Handover Pack (حزمة التسليم)

Analytics (التحليلات)

Use the real global sidebar in DashboardLayout.

Query param ?tab= or your existing pattern, but must not create new routes.

TASK 2: Inbox tab (assigned work)

Show: assignment cards with event title/date/city/status + primary CTA.

Actions: Accept / Decline assignment (existing POST).

Gating: only show assignments relevant to this persona.

TASK 3: Live Ops tab (check-in simulation)

Show: selected event “Now operating” panel + quick KPIs (checked-in, errors).

Actions: Check-in ticket, Finalize attendance (existing POSTs).

Must be functional with the existing mock API; no dead buttons.

TASK 4: Attendance & Exceptions tab

Show: attendance table + exceptions list.

Actions: Create exception (if exists) / mark resolved (if exists). If not in current posts, show as read-only (no fake buttons).

TASK 5: Handover Pack tab (output for Organizer)

Show: generated artifacts summary (attendance ledger, exceptions summary, timestamped log snippet).

Actions: “Generate pack” (if exists) else “Preview pack” (read derived from existing store).

No file download required for demo; show a structured preview card list.

TASK 6: Analytics tab

Show: simple ops analytics: attendance rate, exception rate, by city/event.

Source: existing GET read models (Phase 2.6). If missing, add minimal read endpoint matching CONTRACTS.md.

TASK 7: Seed + no empty pages

Ensure there are enough assignments and events so:

Inbox has 6+ assignments

Live Ops has at least 1 “ready” event

Attendance table has rows

Analytics breakdown non-empty

If empty, show designed empty state with CTA “Reset demo data”.

ACCEPTANCE (must paste outputs)

npm run type-check

npm test

npx playwright test tests/e2e/demo-happy-path.spec.ts

Manual smoke: open all 5 tabs, confirm non-empty content and no 404.

DELIVERABLE FORMAT:

Files changed

Commands run + outputs

Known pre-existing failures (if any)