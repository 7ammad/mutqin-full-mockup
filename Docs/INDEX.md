# Docs Index

This folder defines how the Mutqin CPD Ecosystem behaves.

For **dashboards and persona flows**, the canonical order of truth is:

1. `Docs/IA-SITEMAP.md` – personas, base routes, tab keys (L1 skeleton)
2. `Docs/L1_DASHBOARD_VIEWS.md` – what each dashboard tab shows (L1)
3. `Docs/L2_DETAIL_PAGES.md` – the only legal detail routes (L2)
4. `Docs/FLOWS.md` – cross-persona flows using those routes
5. `Docs/COMPLETE_SITEMAP.md` – routing overview (public + auth + dashboards)
6. `Docs/TEST-PLAN.md` – how E2E must exercise those flows
7. `Docs/ACCEPTANCE.md` – definition of “dashboards + detail pages v1 done”

If **any older doc conflicts** with `IA-SITEMAP`, `L1_DASHBOARD_VIEWS`, or
`L2_DETAIL_PAGES`, the conflict must be resolved in favour of those three.

`CONTRACTS.md` and `RBAC.md` remain the source of truth for:

- Core entities (event, application, ticket, certificate, sponsorship, etc.)
- Status/state machines
- Action IDs and policy enforcement
