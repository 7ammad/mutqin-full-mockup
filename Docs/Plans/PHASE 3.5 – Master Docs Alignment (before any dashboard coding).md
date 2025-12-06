PHASE 3.5 – Master Docs Alignment (before any dashboard coding)

MODE: ARCHITECT

GOAL: Bring all master docs in sync with the sitemap, tabs, spine, and DS so agents stop guessing.

ALLOWED FILES (docs only):

Docs/INDEX.md

Docs/IA-SITEMAP.md

Docs/COMPLETE_SITEMAP.md

Docs/FLOWS.md

Docs/TEST-PLAN.md

Docs/ACCEPTANCE.md

Docs/RBAC.md (read/change only if absolutely needed)

Docs/IOS_DESIGN_SYSTEM.md (optional but recommended)

TASK 3.5.1 – INDEX.md

What to change

Add a short “start here” section:

Point to:

MUTQIN_CORE_SPEC.md (compiled spec)

MUTQIN_LIVE_OVERRIDES.md (last word on conflicts)

State precedence explicitly:

Live overrides > core spec > original docs.

Outcome

Any agent reading INDEX immediately knows:

Where to look first.

That dashboards must follow the new sitemap + spec.

TASK 3.5.2 – IA-SITEMAP.md

What to change

Persona tabs (lock canonical lists)
For each persona, explicitly list tabs as we agreed:

Organizer: overview | activities | accreditation | execution | sponsors

Event Manager: assignments | checkin | attendance | certificates | handover

HCP: discover | registrations | credits | certs_reviews

Sponsor: marketplace | purchases | assets | performance | billing

Regulator: review_queue | decision_workspace | compliance_monitor | audit_risk | analytics

Canonical detail routes
Add a subsection “Detail routes per persona” with:

/dashboard/organizer/events/[eventId]

/dashboard/event-manager/events/[eventId]

/dashboard/hcp/events/[eventId]

/dashboard/regulator/applications/[applicationId]

/dashboard/vendor/campaigns/[campaignId], etc.

Routing rules
Add two bullets:

All deep links must normalize to these detail routes + internal tab/state.

No persona may invent new dashboard tabs without IA update.

Outcome

IA becomes the single truth for sidebar tabs and main routes.

TASK 3.5.3 – COMPLETE_SITEMAP.md

What to change

Insert the ASCII sitemap diagram we finalized, under a heading like ## Dashboard Sitemap Diagram.

Normalize Sponsor/Vendor wording:

Decide:

Either “Sponsor” is the product name and /dashboard/vendor is the technical route

Or align both to sponsor.

Document that explicitly so agents stop mixing them.

Ensure all listed routes exist / are planned:

For any route that is “planned but not implemented”, mark it clearly as PLANNED so no agent relies on it yet.

Outcome

One glance shows how many “screens” per persona and the exact URL structure.

TASK 3.5.4 – FLOWS.md

What to change

Add a “Cross-persona spine” section with the exact chain:

Organizer /dashboard/organizer?tab=activities → submit for accreditation

Regulator /dashboard/regulator?tab=review_queue → approve

Organizer /dashboard/organizer?tab=activities → publish

Organizer /dashboard/organizer?tab=execution → assign EM

EM /dashboard/event-manager?tab=assignments|checkin|attendance → operate + finalize

Organizer /dashboard/organizer?tab=execution → submit attendance records + hours

HCP /dashboard/hcp?tab=credits → sees hours / /dashboard/hcp?tab=certs_reviews → sees cert

For each step, reference:

Route

POST endpoint name

Required status before/after

Outcome

FLOWS explicitly shows “Organizer → Regulator → Organizer → EM → HCP” with real routes.

TASK 3.5.5 – TEST-PLAN.md

What to change

Under E2E section, define canonical demo scenario using the real routes:

Organizer runs from Activities/Execution tabs.

Regulator uses Review Queue + Decision Workspace.

EM uses Assignments/Checkin/Attendance/Handover.

HCP uses Discover/Registrations/Credits/Certs_Reviews.

Sponsor uses Marketplace/Purchases at least for one event.

Make it explicit that tests/e2e/demo-happy-path.spec.ts MUST follow this spine and must:

Never hit raw 404.

Never land on an empty, unstyled screen.

Outcome

Every future code change is benchmarked against this cross-persona flow.

TASK 3.5.6 – ACCEPTANCE.md

What to change

Add explicit acceptance bullets for PHASE 3.6:

For each persona dashboard:

All tabs render either real seeded data or a designed empty state.

No sidebar tab or primary CTA leads to 404.

Layout uses DS components (LiquidGlassCard, GlassButton, Badge, EmptyState, etc.).

For the whole system:

Cross-persona spine runs end-to-end with no manual hacks.

Outcome

There is a written definition of “dashboards done” instead of vague “looks OK”.

TASK 3.5.7 – IOS_DESIGN_SYSTEM.md (optional but smart)

What to change

Add a short “Dashboard Patterns” section:

List allowed building blocks:

Page shell

KPI strip pattern (LiquidGlassCard grid)

Data section pattern (Card + Table)

Modal/Drawer pattern

Empty/Loading patterns

Mention the no raw Tailwind color rule here.

Outcome

Visual consistency is enforced in docs, not just in our heads.

TASK 3.5.8 – RBAC.md (only if needed)

Check if any ActionIds or role mappings for:

attendance.finalize

compliance submits

certificate.issue

sponsorship.purchase

are out of sync with the flows we just locked. If they are, update RBAC so:

Every CTA we plan in dashboards = existing ActionId + clear role permission.

After 3.5, THEN 3.6

Only after these doc edits:

We start PHASE 3.6 (the implementation plan I gave earlier).

Any agent touching code must treat the updated docs as law.