# Cross-Persona Flows

This doc maps business journeys to **L1 + L2 routes**.

All routes referenced here must exist in:

- `L1_DASHBOARD_VIEWS.md`
- `L2_DETAIL_PAGES.md`

No custom URLs are allowed in these flows.

---

## Flow 1 – Event → Accreditation → Execution → HCP Credits

1) Organizer creates & edits event
- Screen:
  - L1: `/dashboard/organizer?tab=activities`
- Detail:
  - L2: `/dashboard/organizer/events/[eventId]/edit` (O2)

2) Organizer views event master & submits for accreditation
- Detail:
  - `/dashboard/organizer/events/[eventId]` (O1)
- Action:
  - Submit for accreditation (existing POST)

3) Regulator reviews application and decides
- L1:
  - `/dashboard/regulator?tab=review_queue`
- L2:
  - `/dashboard/regulator/applications/[applicationId]` (R1)
  - `/dashboard/regulator/applications/[applicationId]/decision` (R2)

4) Organizer assigns Event Manager / vendor
- L1:
  - `/dashboard/organizer?tab=execution`
- L2:
  - `/dashboard/organizer/events/[eventId]/assign` (O7)

5) Event Manager runs the event (check-in, attendance)
- L1:
  - `/dashboard/event-manager?tab=assignments`
  - `/dashboard/event-manager?tab=checkin`
  - `/dashboard/event-manager?tab=attendance`
  - `/dashboard/event-manager?tab=handover`
- L2:
  - `/dashboard/event-manager/events/[eventId]` (EM1)
  - `/dashboard/event-manager/events/[eventId]/checkin` (EM2)
  - `/dashboard/event-manager/events/[eventId]/attendance` (EM3)
  - `/dashboard/event-manager/events/[eventId]/handover` (EM4)

6) Organizer sees final attendance
- L1:
  - `/dashboard/organizer?tab=execution`
- L2:
  - `/dashboard/organizer/events/[eventId]/attendance` (O4)

7) Certificates are issued (Organizer/EM side)
- L1:
  - Organizer: `/dashboard/organizer?tab=execution` or `activities`
- L2:
  - `/dashboard/organizer/events/[eventId]/certificates` (O5)

8) HCP interacts with the event
- Discover:
  - L1: `/dashboard/hcp?tab=discover`
  - L2: `/dashboard/hcp/events/[eventId]` (H1)
- Registration:
  - L1: `/dashboard/hcp?tab=registrations`
  - L2: `/dashboard/hcp/tickets/[ticketId]` (H2)
- Credits & certificates:
  - L1: `/dashboard/hcp?tab=credits`, `/dashboard/hcp?tab=certs_reviews`
  - L2: `/dashboard/hcp/certificates/[certificateId]` (H3)

9) Regulator monitors compliance
- L1:
  - `/dashboard/regulator?tab=compliance_monitor`
  - `/dashboard/regulator?tab=audit_risk`
- L2:
  - `/dashboard/regulator/providers/[providerId]` (R4)
  - `/dashboard/regulator/applications/[applicationId]` (R1)

---

## Flow Rules

- Any new flow must reference only routes from:
  - `L1_DASHBOARD_VIEWS.md`
  - `L2_DETAIL_PAGES.md`
- If a flow step needs a new route:
  - The route must be added to those docs first.
