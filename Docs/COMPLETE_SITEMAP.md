# Routing Overview

This is a **routing overview**, not the primary contract for dashboards.

For dashboards, always follow:

- `IA-SITEMAP.md`
- `L1_DASHBOARD_VIEWS.md`
- `L2_DETAIL_PAGES.md`

Those files override any conflicting notes here.

---

## High-Level Areas

- Public: marketing, login, docs…
- Auth: sign-in, sign-up, password reset…
- Demo / Sandbox: `/demo-flow`
- Dashboards (personas):
  - `/dashboard/organizer`
  - `/dashboard/event-manager`
  - `/dashboard/hcp`
  - `/dashboard/vendor`
  - `/dashboard/regulator`

---

## Dashboard Area (Personas)

L1 views use query-string tabs, for example:

- `/dashboard/organizer?tab=activities`
- `/dashboard/event-manager?tab=assignments`
- `/dashboard/hcp?tab=discover`
- `/dashboard/vendor?tab=marketplace`
- `/dashboard/regulator?tab=review_queue`

Detail pages (L2) live under:

- `/dashboard/<persona>/<entity>/[id]`

The complete list of legal L2 routes is in `L2_DETAIL_PAGES.md`.

### Persona summary (L2 counts)

- Organizer – 7 detail routes
- Event Manager – 4 detail routes
- HCP – 3 detail routes
- Sponsor / Vendor – 3 detail routes
- Regulator – 4 detail routes

Total: 21 L2 routes.

Agents may **not** introduce new `/dashboard/...` detail routes outside that list.
