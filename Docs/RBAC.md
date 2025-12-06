# RBAC (Source of Truth v3)

This document is the single source of truth for:
- **Roles** (internal/external) and **legacy persona mapping**
- **ActionIds** (must match `src/types/actions.ts`)
- **State-based gates** (must match `docs/CONTRACTS.md`)
- **Ownership / scope rules** (own org, assigned event, own ticket)
- **UI gating rules** (disable with reason; don’t hide critical CTAs in demo)

> UI language rule: the product UI never shows Arabic+English on the same screen (toggle-based). This doc is English-only to keep agents consistent.

---

## 1) Roles (by org type)

### CPD Provider (internal)
- `provider_admin` — manages provider org, users, permissions, and can perform all provider actions.
- `event_owner` — owns activities lifecycle, accreditation submissions, and operations handoffs.
- `scientific_reviewer` — content-only review (objectives, faculty, agenda); cannot submit/publish.
- `sponsorship_manager` — packages, sponsors, assets workflows; cannot publish accreditation.
- `compliance_officer` — hard gate for risky actions (publish, manual overrides, submissions, audit packs).
- `ops_liaison` — coordinates with vendors; logistics + operational checklists; cannot submit/publish.

### Execution Vendor (external)
- `vendor_ops_admin` — manages vendor org and staff (no event compliance submissions).
- `vendor_event_ops_lead` — accepts assignments; runs onsite ops; can check-in + finalize.
- `vendor_checkin_staff` — check-in only (no finalize).
- `vendor_reporting_lead` — finalize + vendor reports only (no check-in).

### Sponsor (external)
- `sponsor_admin` — manages sponsor org and users; approves spend.
- `sponsor_campaign_manager` — purchases packages, uploads assets, manages campaign.
- `sponsor_compliance_approver` — approves disclosures on sponsor side before submission.

### Regulator (demo mode)
- `regulator_reviewer` — reviews applications, requests fixes, views analytics.
- `regulator_approver` — approves/rejects with reason codes.
- `regulator_audit_analyst` — analytics + exports + audit trails.

### HCP
- `hcp` — individual practitioner.

---

## 2) Legacy persona mapping (backward compatible)

Legacy roles must remain supported for existing demo + Playwright:
- `organizer` → normalize to `event_owner` (default). If user is “super user”, map to `provider_admin`.
- `event_manager` → normalize to `vendor_event_ops_lead`
- `vendor` → normalize to `sponsor_campaign_manager`
- `regulator` → normalize to `regulator_reviewer` **and** `regulator_approver` (demo bundles)
- `hcp` → `hcp`

Rules:
- If a user only has a legacy role, **normalize it** to a v3 role before policy evaluation.
- Tests can keep legacy roles; the app must still behave correctly after normalization.

---

## 3) Ownership / scope rules (non-negotiable)

All permissions below are **required but not sufficient**. The policy layer must also enforce:

- Provider roles: can act only on resources where `activity.providerOrgId === user.orgId`
- Vendor roles: can act only on activities where `activity.assignedVendorOrgId === user.orgId`
- Sponsor roles: can act only on sponsorships where `sponsor.orgId === user.orgId`
- HCP: can act only on own tickets and own reviews (`ticket.hcpUserId === user.userId`)
- Regulator: global read; write only in regulator consoles (demo)

---

## 4) ActionIds + allowed roles + state gates  
**Do not invent new ActionIds.** Map UX features to existing ids.

> State rules reference `docs/CONTRACTS.md` (canonical state machine definitions).

### Org
- `org.manage_users`, `org.manage_settings`
  - allowed: `provider_admin`, `vendor_ops_admin` (own org), `sponsor_admin` (own org)

### Activity authoring
- `activity.create`
  - allowed: `provider_admin`, `event_owner`
- `activity.edit_content`
  - allowed: `provider_admin`, `event_owner`, `scientific_reviewer`
  - gate: `activity.status in {draft, submitted, pending_review, rejected}` (no edits after approved unless explicitly reopened)
- `activity.edit_logistics`
  - allowed: `provider_admin`, `event_owner`, `ops_liaison`
  - gate: `activity.status in {draft, submitted, pending_review, rejected}`

### Accreditation submissions (provider → regulator)
- `activity.submit_for_accreditation` (and legacy alias `accreditation.submit`)
  - allowed: `provider_admin`, `event_owner`
  - gate: `activity.status in {draft, rejected}` → moves to `submitted/pending_review`
  - optional UX: “Compliance co-sign required” when `compliance_officer` exists in org
- `activity.respond_to_rejection`
  - allowed: `provider_admin`, `event_owner`, `scientific_reviewer` (content-only fixes)
  - gate: `activity.status === rejected` → transitions back to `draft`

### Publish / lifecycle
- `activity.publish` (and legacy alias `organizer.event.publish` / `event.publish`)
  - allowed: `provider_admin`, `event_owner`
  - hard gate (UX + policy): requires `compliance_officer` approval flag in demo (simulated)
  - state gate: `activity.status === approved`
- `activity.complete`
  - allowed: `provider_admin`, `event_owner`
  - gate: `activity.status === published`
- `activity.close`
  - allowed: `provider_admin`, `event_owner`, `compliance_officer`
  - gate: `activity.status === completed` AND both compliance tracks are not blocking (demo can simulate)

### Assignment (provider → vendor)
- `assignment.create`
  - allowed: `provider_admin`, `event_owner`
  - gate: `activity.status in {approved, published}`
- `assignment.cancel`
  - allowed: `provider_admin`, `event_owner`
- `assignment.accept`, `assignment.decline`
  - allowed: `vendor_event_ops_lead`

### HCP tickets
- `ticket.register`
  - allowed: `hcp`
  - gate: `activity.status === published`
- `ticket.cancel`
  - allowed: `hcp` (own ticket only)

### Attendance (vendor ops + provider oversight)
- `attendance.checkin`
  - allowed: `vendor_checkin_staff`, `vendor_event_ops_lead`
  - gate: `activity.status === published` AND `assignment.status === accepted`
- `attendance.finalize`
  - allowed: `vendor_reporting_lead`, `vendor_event_ops_lead`
  - gate: `activity.status === published` AND `attendance.hasAnyCheckins === true`
- `attendance.override_manual`
  - allowed: `provider_admin`, `compliance_officer`
  - gate: `activity.status === published`
  - always audit-log manual overrides

### Compliance submissions (post-activity)
- `compliance.submit_attendance_records`
  - allowed: `compliance_officer` (provider side)
  - gate: `activity.status === completed` AND within configured window (demo enforces via countdown)
- `compliance.submit_hours_registration`
  - allowed: `compliance_officer` (provider side)
  - gate: `activity.status === completed` AND within configured window
- `compliance.request_extension`
  - allowed: `provider_admin`, `compliance_officer`

### Sponsorship (provider offers; sponsor buys; provider approves for display)
- `sponsorship.create_packages`
  - allowed: `provider_admin`, `sponsorship_manager`
  - gate: `activity.status in {approved, published}` (policy choice; UX normally prefers approved+ only)
- `sponsorship.purchase`
  - allowed: `sponsor_admin`, `sponsor_campaign_manager`
  - gate: `activity.status === published`
- `sponsorship.upload_assets`
  - allowed: `sponsor_campaign_manager`
- `sponsorship.submit_disclosure`
  - allowed: `sponsor_admin`, `sponsor_compliance_approver`
- `sponsorship.approve_for_display`
  - allowed: `provider_admin`, `sponsorship_manager`, `compliance_officer`
  - hard gate: disclosure must exist + provider compliance checklist completed

### Audit / Analytics / Exports
- `audit.view`
  - allowed: `regulator_reviewer`, `regulator_approver`, `regulator_audit_analyst`, `compliance_officer`
  - use for: regulator analytics dashboards, monitoring, audit trails
- `audit.export_pack`
  - allowed: `regulator_audit_analyst`, `compliance_officer`
  - use for: exports (CSV/PDF/demo “report pack”)

### Certificates & reviews
- `certificate.issue`
  - allowed: `provider_admin`, `event_owner`, `vendor_event_ops_lead`
  - gate: `attendance.finalized === true` AND `activity.status in {approved, published, completed}`
- `hcp.review`
  - allowed: `hcp`
  - gate: `ticket.status === attended` (verified check-in)

### Regulator decisions
- `regulator.accreditation.set_status` (and/or `accreditation.review`)
  - allowed: `regulator_reviewer`, `regulator_approver`
  - gate: `activity.status === pending_review` (or equivalent in contracts)

### Demo utility
- `demo.reset`
  - allowed: `provider_admin`

---

## 5) UI gating rules (how dashboards must behave)

- Tabs and buttons must be driven by **policy**, not hardcoded per page.
- If user can’t do an action: **show disabled** with a clear reason (English-only in EN mode; Arabic-only in AR mode).
- Never duplicate the global dashboard header inside views.
- Do not create “fake sidebars” inside a view when a global sidebar exists.

Reason strings (examples, to standardize):
- Publish disabled: “Requires Approved status + Compliance sign-off.”
- Check-in disabled: “Requires accepted assignment + Published activity.”
- Finalize disabled: “No check-ins captured yet.”
- Export disabled: “Requires Audit Analyst / Compliance role.”

---

## 6) Implementation contract (what engineers must do)

1) Normalize legacy roles → v3 roles in one place (auth/session layer).
2) Implement a single `can(actionId, ctx)` policy function used by:
   - Sidebar tab visibility
   - Button enabled state + reason
   - API route handlers (server-side enforcement)
3) Seed/demo data must include at least:
   - one provider org with `event_owner` + `compliance_officer`
   - one vendor org with `vendor_event_ops_lead` + `vendor_checkin_staff` + `vendor_reporting_lead`
   - one sponsor org with `sponsor_campaign_manager` + `sponsor_compliance_approver`
   - one regulator user with `regulator_audit_analyst`

---
