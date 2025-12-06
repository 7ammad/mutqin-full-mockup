# Acceptance Criteria – Persona Dashboards & Detail Pages v1

This section defines when the dashboard + detail layer is considered “v1 done”.

---

## Dashboards (L1)

- All `/dashboard/<persona>?tab=<tabKey>` views:
  - Match base routes and tab keys in `IA-SITEMAP.md`.
  - Implement purpose/content/actions defined in `L1_DASHBOARD_VIEWS.md`
    (within current feature scope).
- No persona dashboard renders its own sidebar or header:
  - All use the shared `DashboardLayout` and global sidebar/header.

---

## Detail Pages (L2)

- All routes in `L2_DETAIL_PAGES.md`:
  - Either have a DS-compliant implementation, or
  - Are not linked from the UI.
- The UI does **not** link to any `/dashboard/...` detail route outside that list.
- Any implemented L2 page:
  - Uses design system components.
  - Has seeded content or a designed empty state; no blank screens.

---

## Routing and Flows

- E2E happy-path test follows `FLOWS.md / Flow 1` and uses only:
  - L1 routes from `L1_DASHBOARD_VIEWS.md`
  - L2 routes from `L2_DETAIL_PAGES.md`
- No raw Next.js 404 is seen on any `/dashboard/...` route during the E2E run.

---

## Tests

The following commands must pass:

- `npm run type-check`
- `npm test`
- `npx playwright test tests/e2e/demo-happy-path.spec.ts`

If any of these fail, the dashboards + detail pages v1 are **not** accepted.
