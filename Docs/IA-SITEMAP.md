# IA – Sitemap (Dashboards Focus)

This document defines **persona dashboards (Layer 1)**:

- Base routes under `/dashboard/...`
- Tab keys for each persona

Detail routes (Layer 2) live in `L2_DETAIL_PAGES.md`.

---

## Personas & Base Dashboard Routes

- Organizer (CPD Provider)
  - Base: `/dashboard/organizer`
  - Tabs: `overview | activities | accreditation | execution | sponsors`

- Event Manager (Execution Vendor)
  - Base: `/dashboard/event-manager`
  - Tabs: `assignments | checkin | attendance | certificates | handover`

- HCP (Healthcare Professional)
  - Base: `/dashboard/hcp`
  - Tabs: `discover | registrations | files | credits | certs_reviews`
  - Tab responsibilities:
    - `discover`: Browse and register for accredited activities
    - `registrations` (My Journey): Chronological timeline of all activity registrations
    - `files`: Quick access to tickets (QR codes) and certificates for on-site/verification use
    - `credits` (CME Credits): Analytical history of accumulated credits/hours with breakdowns
    - `certs_reviews`: Alias redirects to `credits` tab

- Sponsor / Vendor
  - Base (technical): `/dashboard/vendor`
  - Tabs: `marketplace | purchases | assets | performance | billing`

- Regulator
  - Base: `/dashboard/regulator`
  - Tabs: `review_queue | decision_workspace | compliance_monitor | audit_risk | analytics`

---

## Global Dashboard Rules

- All dashboards must render inside the shared `DashboardLayout`:
  - Real global sidebar
  - Global header
  - No fake sidebars / duplicate headers inside persona views

- Tab keys above are canonical:
  - New tabs must be added here first.
  - Renaming/removing tabs must be updated here first.

- Layer 1 = dashboard-level views only:
  - Lists, KPIs, filters, high-level actions.
  - Any “open single entity” view must be an L2 route from `L2_DETAIL_PAGES.md`
    or an in-page modal/drawer with no URL change.

- Language:
  - One language per render (Arabic or English).
  - Language toggle decides; dashboards must not mix languages on one page.

---

## HCP CME Tracker Note

The HCP dashboard uses a CME tracker across tabs:

- The `credits` tab is the primary “credits/hours tracker”.
- CME information may also appear in compact form on other tabs.

Design constraint:

> CME tracker should use compact design with strategic placement per tab  
> (see `UI_REVAMP_CME_TRACKER.md` for details).
