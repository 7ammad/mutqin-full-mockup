MODE: Architect

PHASE: Regulator dashboard (fix IA + tabs + data + “no empty pages”)

GOAL:
Regulator becomes a real product dashboard with **5 side-nav tabs**, each wired to **existing reads/actions** (or clearly flagged gaps) and seeded so nothing is blank.

TASK 1 — Lock “Arabic-first” and language toggle behavior

* Rule: **never mix Arabic + English in the same UI string**.
* Arabic-first means:

  * Default locale = Arabic (RTL), Arabic copy is the source copy.
  * English is a full translation via your existing toggle (LTR).
* Acceptance:

  * Switching language flips the whole screen copy (not dual labels).

TASK 2 — Define the Regulator side-nav (5 tabs)

* Tabs (names are locale-dependent; same routes/keys):

  1. Queue (المعروض للمراجعة)
  2. Review Workspace (مساحة المراجعة)
  3. Decisions (القرارات)
  4. Monitoring (المتابعة والالتزام)
  5. Analytics (التحليلات)
* Acceptance:

  * Uses the **existing global sidebar** (no “fake sidebar inside the page”, no duplicate header).
  * Every tab renders real content (cards/tables) and never a blank area.

TASK 3 — What each Regulator tab must SHOW + DO (UX spec)

* Tab 1: Queue

  * Show: activity cards requiring review (status submitted/pending_review), filters (city/specialty/search), counts (pending/due soon).
  * Do: open item into Review Workspace.
* Tab 2: Review Workspace

  * Show: selected activity details, submission metadata, risk flags, last audit trail snippet.
  * Do: Approve/Reject with reason code + optional note (existing POST decision).
* Tab 3: Decisions

  * Show: latest decisions list (approved/rejected), date range filter.
  * Do: open detail (read activity), export decisions report.
* Tab 4: Monitoring

  * Show: compliance table across recently ended activities:

    * Attendance Records status + due date
    * Hours Registration status + due date
    * exception rate / scan anomalies (if available)
  * Do: export monitoring report.
* Tab 5: Analytics (key function)

  * Show: charts/cards:

    * By city (submissions, approvals)
    * By specialty (volume, approval rate proxy)
    * Decision time avg (if available)
    * Overdue counts (attendance/hours)
  * Do: export analytics report.

TASK 4 — Data wiring contract (NO new domain logic)

* Regulator uses these reads (must exist per docs/CONTRACTS.md you pasted):

  * GET `/api/read/regulator/queue`
  * GET `/api/read/regulator/decisions`
  * GET `/api/read/regulator/monitoring`
  * GET `/api/read/regulator/analytics`
  * POST `/api/write/regulator/decision`
  * POST `/api/write/regulator/export`
* If any are missing in code:

  * Do NOT invent new shapes.
  * Implement minimal MSW handlers + api client wrappers that match CONTRACTS.md exactly.
* Acceptance:

  * All tabs render from these calls.
  * Demo seed includes enough items so each tab has content.

TASK 5 — Seed + empty-state policy (no black pages)

* Seed requirements (minimums):

  * Queue: 6+ items (mix of cities/specialties)
  * Decisions: 10+ items (approved/rejected mix)
  * Monitoring: 8+ items (some due soon, some overdue)
  * Analytics: computed breakdown arrays not empty
* Empty states (only if truly empty):

  * Must show a designed empty card with CTA (“Reset demo data” / “Create sample submissions”).
* Acceptance:

  * Fresh load in demo mode shows data in every tab without clicking anything.

TASK 6 — Agent constraints + “use the real sidebar”

* If DashboardLayout sidebar is empty, that’s the bug: populate **that** nav.
* Therefore: expand ALLOWED FILES to include the layout/sidebar file that owns the nav (likely `src/components/layout/DashboardLayout.tsx` or similar).
* Acceptance:

  * No duplicated header inside views.
  * No “Tabs in main content pretending to be sidenav”.

ACCEPTANCE (Regulator phase)

* Visual/UX:

  * 5 tabs appear in the real sidebar.
  * Each tab has above-the-fold KPI/cards and a scrollable list/table.
  * Language toggle switches full-copy (no bilingual strings).
  * Dark/light works unchanged.
* Technical:

  * CONTRACTS.md is the source of truth; endpoints match it.
  * Seeded demoStore ensures no blank screens.

If you want the coding agent to execute this cleanly, paste this *exact prompt* to the agent and add ONE line:

“ALLOWED FILES EXTENSION: include whatever file currently renders the empty sidebar nav (DashboardLayout.*).”
