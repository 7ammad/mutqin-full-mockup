# Mutqin Core Spec (Compiled Canon)

Status: COMPILED FROM REPO DOCS  
Sources:
- docs/COMPLETE_SITEMAP.md
- docs/CONTRACTS.md
- docs/INDEX.md
- docs/ACCEPTANCE.md
- docs/IA-SITEMAP.md
- docs/RBAC.md
- docs/TEST-PLAN.md
- docs/FLOWS.md

This file is the **single spec** agents should read first.  
If this file and a source doc disagree, the source doc wins (see precedence).

---

## 1) Precedence & Global Rules

### 1.1 Doc precedence
When docs disagree, order of truth is:  
1) `docs/CONTRACTS.md` – entities, enums, API shapes :contentReference[oaicite:0]{index=0}  
2) `docs/RBAC.md` – roles, ActionIds, gates :contentReference[oaicite:1]{index=1}  
3) `docs/IA-SITEMAP.md` – dashboard routes + tabs + “no empty pages” :contentReference[oaicite:2]{index=2}  
4) `docs/FLOWS.md` – persona flows + demo spine :contentReference[oaicite:3]{index=3}  
5) `docs/TEST-PLAN.md` + `docs/ACCEPTANCE.md` – what must be proven   

Any change to product behavior must update the relevant source doc **before** code.

### 1.2 Global UX constraints
- Single global header (already implemented). No second header inside persona views.   
- Single global sidebar in `DashboardLayout`. Persona views must **not** render local sidebars. :contentReference[oaicite:6]{index=6}  
- Dashboard routes are `/dashboard/<persona>?tab=<tabKey>` with validated `tabKey`. Invalid → default. :contentReference[oaicite:7]{index=7}  
- Language is toggle-based: **never** show Arabic+English together on the same screen.   
- No empty tab pages: every tab must show real seeded data or a designed zero-state with CTA + example row/card.   

---

## 2) Routing & IA (what screens actually exist)

### 2.1 High-level sitemap

Static/public:
- `/` landing, `/auth/login`, `/demo`, `/not-found`, `/error`, `/sitemap.xml`, `/robots.txt`. :contentReference[oaicite:10]{index=10}  

Dashboard entries:
- `/dashboard` redirect.
- `/dashboard/organizer`
- `/dashboard/regulator`
- `/dashboard/event-manager`
- `/dashboard/vendor` (sponsor)
- `/dashboard/hcp`   

Onboarding + profile/settings routes exist in sitemap but are not core to the demo spine.

### 2.2 Persona → tabs (sidebar contract)

Route pattern: `/dashboard/<persona>?tab=<tabKey>` :contentReference[oaicite:12]{index=12}  

**Organizer (CPD Provider)** – default tab `overview`   
Tabs:
- `overview` – pipeline KPIs + next actions.
- `activities` – create/manage activities.
- `accreditation` – submissions + decisions.
- `execution` – vendor assignment, attendance snapshot, compliance trackers.
- `sponsors` – packages + disclosures.

**Regulator** – default tab `review_queue` (a.k.a. `queue` in legacy flows).   
Tabs:
- `review_queue` / `queue`
- `decision_workspace` / `review`
- `compliance_monitor` / `monitoring`
- `audit_risk` / `providers`/`audit` (depending on implementation)
- `analytics`

**Event Manager (Execution Vendor)** – default tab `assignments`.   
Tabs:
- `assignments`
- `checkin`
- `attendance`
- `certificates`
- `handover` or `analytics` (IA uses `handover` as explicit audit-pack tab).

**Sponsor/Vendor** – default tab `marketplace`.   
Tabs:
- `marketplace`
- `purchases`
- `assets`
- `campaigns`
- `analytics` or `billing` depending on final IA.

**HCP** – default tab `discover`.   
Tabs:
- `discover`
- `registrations` or `tickets` (legacy name)
- `credits`
- `certs_reviews` / split `certificates` + `reviews`

Rule: sidebar tab labels/keys must come from this IA — no persona is allowed to invent extra tabs.

---

## 3) Domain Model & API (contracts)

### 3.1 Core entities
Defined in `docs/CONTRACTS.md`: :contentReference[oaicite:18]{index=18}  

Key types:
- `Org`, `User`, `Activity` (Event), `Assignment`
- `Ticket`, `AttendanceScan`, `AttendanceOverride`
- `SponsorPackage`, `SponsorDeal`, `Disclosure`
- `AuditEvent`

Key enums:
- `ActivityStatus` (`draft`, `submitted`, `pending_review`, `approved`, `rejected`, `published`, `completed`, `closed`)
- `AssignmentStatus` (`pending`, `accepted`, `declined`)
- `TicketStatus` (`confirmed`, `cancelled`)
- `AttendanceStatus` (`not_checked_in`, `checked_in`, `finalized`)
- `AttendanceRecordsStatus`, `HoursRegistrationStatus`
- `SponsorshipStatus`
- `AccreditationDecision` (`approved`, `rejected`)

No new enums/fields may be invented anywhere without updating `docs/CONTRACTS.md` first.

### 3.2 Read models (what dashboards consume)

Main ones used in dashboards: :contentReference[oaicite:19]{index=19}  

- Organizer:
  - `GET /api/read/organizer/overview` → `OrganizerOverviewRead`
  - `GET /api/read/organizer/activities` → `OrganizerActivitiesRead`
  - `GET /api/read/organizer/compliance` → `OrganizerComplianceRead`
  - `GET /api/read/organizer/sponsors` → `OrganizerSponsorsRead`

- Execution Vendor / Event Manager:
  - `GET /api/read/vendor/assignments` → `VendorAssignmentsRead`
  - `GET /api/read/vendor/checkin?activityId=...` → `VendorCheckinRead`

- HCP:
  - `GET /api/read/hcp/activities` → `HcpActivitiesRead`
  - `GET /api/read/hcp/credits` → `HcpCreditsRead`

- Regulator:
  - `GET /api/read/regulator/queue`
  - `GET /api/read/regulator/decisions`
  - `GET /api/read/regulator/monitoring`
  - `GET /api/read/regulator/analytics`

All API responses use the `ApiResponse<T>` envelope (`{ ok: true; data }` or `{ ok: false; error }`).

### 3.3 Write commands (what buttons are allowed to do)

Key POSTs: :contentReference[oaicite:20]{index=20}  

- Organizer:
  - `/api/write/activity/create|update`
  - `/api/write/accreditation/submit`
  - `/api/write/activity/publish`
  - `/api/write/assignment/request`
  - `/api/write/compliance/attendance-records/submit`
  - `/api/write/compliance/hours-registration/submit`

- Regulator:
  - `/api/write/regulator/decision`
  - `/api/write/regulator/export`

- Event Manager / Vendor:
  - `/api/write/assignment/respond`
  - `/api/write/ticket/checkin`
  - `/api/write/attendance/finalize`
  - `/api/write/attendance/override/request`

- HCP:
  - `/api/write/registration/create`

No UI writes are allowed outside these commands.

---

## 4) RBAC & ActionIds (who is allowed to click what)

Roles + mapping are in `docs/RBAC.md`: :contentReference[oaicite:21]{index=21}  

- Provider internal roles: `provider_admin`, `event_owner`, `scientific_reviewer`, `sponsorship_manager`, `compliance_officer`, `ops_liaison`.
- Vendor roles: `vendor_ops_admin`, `vendor_event_ops_lead`, `vendor_checkin_staff`, `vendor_reporting_lead`.
- Sponsor roles: `sponsor_admin`, `sponsor_campaign_manager`, `sponsor_compliance_approver`.
- Regulator roles: `regulator_reviewer`, `regulator_approver`, `regulator_audit_analyst`.
- HCP: `hcp`.

Legacy role names (`organizer`, `event_manager`, `vendor`, `regulator`, `hcp`) must be normalized to v3 roles before policy evaluation.

Key ActionIds (ex
