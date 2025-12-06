# Layer 2 – Persona Detail Pages

Layer 2 (L2) = entity detail pages under:

- `/dashboard/<persona>/<entity>/[id]`

Only the routes listed here are allowed as dashboard detail routes.

---

## Organizer – L2 pages

1) `/dashboard/organizer/events/[eventId]` (O1 – Event Master)
- From:
  - Organizer L1: overview, activities, accreditation, execution, sponsors.
- Purpose:
  - Single source of truth for an event: status, key KPIs, quick links.
- Flows to:
  - Edit, registrations, attendance, certificates, sponsors, assign EM/vendor.

2) `/dashboard/organizer/events/[eventId]/edit` (O2 – Event Edit)
- From:
  - Activities L1 → “Edit”.
- Purpose:
  - Edit agenda, speakers, logistics and metadata.
- Flows to:
  - Back to master (O1).

3) `/dashboard/organizer/events/[eventId]/registrations` (O3 – Event Registrations)
- From:
  - Activities L1 (“Registrations”).
  - Execution L1 (“View registrations”).
- Purpose:
  - List of registered HCPs, registration status.
- Flows to:
  - HCP ticket detail (H2) indirectly via cross-entity linkage.

4) `/dashboard/organizer/events/[eventId]/attendance` (O4 – Event Attendance)
- From:
  - Activities L1, Execution L1.
  - Event Manager attendance (EM3) via data flows.
- Purpose:
  - Final attendance ledger and compliance readiness.
- Flows to:
  - Certificate issuance (O5) and regulator monitoring (R routes).

5) `/dashboard/organizer/events/[eventId]/certificates` (O5 – Event Certificates)
- From:
  - Activities L1, Execution L1, EM certificates L1.
- Purpose:
  - Event-level view of certificate issuance and status.
- Flows to:
  - HCP certificate detail (H3) indirectly.

6) `/dashboard/organizer/events/[eventId]/sponsors` (O6 – Event Sponsors)
- From:
  - Activities L1.
  - Sponsors L1.
- Purpose:
  - Sponsorship deals and packages for one event.
- Flows to:
  - Vendor sponsorship detail (V2) via data links.

7) `/dashboard/organizer/events/[eventId]/assign` (O7 – Event Assignment)
- From:
  - Execution L1 → “Assign EM/vendor”.
- Purpose:
  - Assign execution vendor / EM.
- Flows to:
  - Creates/updates assignment entity seen on Event Manager assignments L1.

---

## Event Manager – L2 pages

1) `/dashboard/event-manager/events/[eventId]` (EM1 – Ops Overview)
- From:
  - Assignments L1 (row click).
- Purpose:
  - High-level operational view: event info, assignment status, quick links.
- Flows to:
  - Check-in (EM2), attendance (EM3), handover (EM4).

2) `/dashboard/event-manager/events/[eventId]/checkin` (EM2 – Check-In Console)
- From:
  - Assignments L1 (“Go to check-in”).
  - Checkin L1 tab.
- Purpose:
  - Live check-in via QR/manual entry with counters.
- Flows to:
  - Attendance ledger (EM3).

3) `/dashboard/event-manager/events/[eventId]/attendance` (EM3 – Attendance Ledger)
- From:
  - Attendance L1 tab.
  - Check-in console after operations.
- Purpose:
  - Detailed attendance list, exceptions, finalize action.
- Flows to:
  - Organizer attendance page (O4) via shared data.

4) `/dashboard/event-manager/events/[eventId]/handover` (EM4 – Handover Pack)
- From:
  - Handover L1 tab.
- Purpose:
  - View / confirm handover artifacts (summary, exceptions, logs).
- Flows to:
  - Regulator / Organizer audit processes via data, not direct navigation.

---

## HCP – L2 pages

1) `/dashboard/hcp/events/[eventId]` (H1 – Event Detail)
- From:
  - Discover L1 (card click).
  - Registrations L1 (event name).
  - Credits L1 (event row).
- Purpose:
  - Full event information for the HCP (agenda, credits, logistics).
- Flows to:
  - In-page registration, ticket context.

2) `/dashboard/hcp/tickets/[ticketId]` (H2 – Ticket Detail)
- From:
  - Registrations L1 (“View ticket”).
- Purpose:
  - Ticket/QR code, instructions, minimal event info.
- Flows to:
  - Event detail (H1) via event link.

3) `/dashboard/hcp/certificates/[certificateId]` (H3 – Certificate Detail)
- From:
  - Credits L1 (“Open certificate”).
  - Certs_reviews L1 (“Open certificate”).
- Purpose:
  - Certificate view/download/verification and sharing.
- Flows to:
  - Event detail (H1) via event link.

---

## Sponsor / Vendor – L2 pages

1) `/dashboard/vendor/events/[eventId]` (V1 – Sponsor Event View)
- From:
  - Marketplace L1 (“View event”).
  - Performance L1 (“Open event performance”).
- Purpose:
  - Event information from sponsor perspective: audience, packages, performance.
- Flows to:
  - Sponsorship detail (V2) via data.

2) `/dashboard/vendor/sponsorships/[sponsorshipId]` (V2 – Sponsorship Detail)
- From:
  - Purchases L1 (“Open sponsorship”).
- Purpose:
  - Contract/package details, payment status, disclosures.
- Flows to:
  - Campaign view (V3) via link if applicable.

3) `/dashboard/vendor/campaigns/[campaignId]` (V3 – Campaign Detail)
- From:
  - Performance L1 (“Open campaign”).
- Purpose:
  - Campaign overview, constituent events, ROI metrics.
- Flows to:
  - Event view (V1) for specific events.

---

## Regulator – L2 pages

1) `/dashboard/regulator/applications/[applicationId]` (R1 – Application Detail)
- From:
  - Review_queue L1 (“Open application”).
  - Compliance_monitor L1 (event row).
- Purpose:
  - Full application view: event info, provider, status, history.
- Flows to:
  - Decision workspace (R2).
  - Checklist (R3).

2) `/dashboard/regulator/applications/[applicationId]/decision` (R2 – Decision Workspace)
- From:
  - Review_queue L1 (“Review”).
  - Decision_workspace L1.
- Purpose:
  - Decision screen with form, status change, comments.
- Flows to:
  - Updated state seen by Organizer (O routes).

3) `/dashboard/regulator/applications/[applicationId]/checklist` (R3 – Checklist View)
- From:
  - Links inside application detail (R1) or decision (R2).
- Purpose:
  - Detailed rubric and scoring inputs/outputs.

4) `/dashboard/regulator/providers/[providerId]` (R4 – Provider Profile)
- From:
  - Compliance_monitor L1 (provider row).
  - Audit_risk L1 (provider row).
- Purpose:
  - Provider profile, event history, compliance score, risk flags.
- Flows to:
  - Application(s) (R1) via event/application links.

---

## Global L2 Rules

- No `/dashboard/...` detail routes outside this list may be implemented.
- Any “Open X” link that moves to a new page must use one of these routes.
- Routes like `/live`, `/details`, `/view`, `/marketplace` as standalone pages are **not allowed** unless added here first.
- For all routes listed here:
  - UI may **not** link to them until at least a DS-compliant stub page exists.
  - Once linked, they must never fall through to raw 404.
