# Test Plan – Dashboards & Detail Pages

This plan defines the **E2E expectations** for dashboards.

---

## E2E Scenario – Happy Path (Flow 1)

Scenario follows `FLOWS.md / Flow 1 – Event → Credits`.

Minimum coverage:

- Organizer:
  - L1: `?tab=activities`, `?tab=execution`
  - L2: event edit, event master, attendance, certificates, assign
- Regulator:
  - L1: `?tab=review_queue`
  - L2: application detail, decision workspace
- Event Manager:
  - L1: `?tab=assignments`, `?tab=checkin`, `?tab=attendance`, `?tab=handover`
  - L2: ops overview, checkin, attendance, handover
- HCP:
  - L1: `?tab=discover`, `?tab=registrations`, `?tab=credits`, `?tab=certs_reviews`
  - L2: event detail, ticket detail, certificate detail

Test assertions:

- No navigation step hits raw 404.
- No `/dashboard/...` route used in this flow renders as an unstyled blank page.
- L2 pages use the design system layout (cards/buttons/empty states).

Implementation file:

- `tests/e2e/demo-happy-path.spec.ts`

---

## Commands

To pass this plan:

- `npm run type-check`
- `npm test`
- `npx playwright test tests/e2e/demo-happy-path.spec.ts`
