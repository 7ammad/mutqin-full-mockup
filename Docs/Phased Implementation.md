Next phase (Phase 2) — 5 tasks, in the right order

Once Task B is proven, move to Phase 2. Copy/paste tasks below.

Phase 2.1 — Demo Store + seed + reset + persistence
MODE: Implementer (CODEX)

TASK (Phase 2.1): Create a demo store with deterministic seed + localStorage persistence + reset.

ALLOWED FILES:
- src/context/demoStore.ts (create)
- src/context/demoSeed.ts (create)
- src/context/demoPersistence.ts (create)
- src/context/index.ts (optional)

REQUIREMENTS:
- Single source of truth state object (events, assignments, tickets, attendance, certificates, reviews, sponsorships)
- seedDemoState(): same output every time
- localStorage: versioned key + migrate-or-reset strategy
- resetDemo(): clears storage and reseeds

ACCEPTANCE:
- npm run type-check clean
- Paste localStorage key + version
- Paste seedDemoState() returned IDs (eventId, ticketId, etc.)

Phase 2.2 — MSW install + bootstrap (no endpoints yet)
MODE: Implementer (CODEX)

TASK (Phase 2.2): Add MSW bootstrap for browser + tests.

ALLOWED FILES:
- src/lib/mockApi/browser.ts (create)
- src/lib/mockApi/server.ts (create)
- src/lib/mockApi/index.ts (create)
- package.json (if installing msw)
- src/app/** instrumentation entry (ONLY the minimal place you start MSW in dev)

REQUIREMENTS:
- MSW enabled in dev only (env guard)
- No handlers yet

ACCEPTANCE:
- npm run type-check clean
- Show where MSW starts (file + snippet)

Phase 2.3 — Handlers for accreditation + assignment + registration
MODE: Implementer (CODEX)

TASK (Phase 2.3): Implement MSW handlers for the first vertical slice.

ALLOWED FILES:
- src/lib/mockApi/handlers.ts (create)
- src/lib/mockApi/index.ts (update)
- src/context/demoStore.ts (if handler needs store API)

Endpoints:
- POST /accreditation/submit
- POST /accreditation/review
- POST /assignments/create
- POST /assignments/respond
- POST /registrations/create

ACCEPTANCE:
- npm run type-check clean
- Paste handler list + a sample request/response JSON for each

Phase 2.4 — Handlers for attendance → certificate → review
MODE: Implementer (CODEX)

TASK (Phase 2.4): Add MSW handlers for check-in/finalize/cert/review.

Endpoints:
- POST /attendance/checkin
- POST /attendance/finalize
- POST /certificates/issue
- POST /reviews/create

ACCEPTANCE:
- npm run type-check clean
- 1 sample request/response per endpoint

Phase 2.5 — Role-scoped selectors (query helpers)
MODE: Implementer (CODEX)

TASK (Phase 2.5): Create role-scoped selectors to prevent UI leakage.

ALLOWED FILES:
- src/lib/selectors/visibility.ts (create)
- src/lib/selectors/index.ts (create)
- (optional) docs update if needed

REQUIREMENTS:
- getVisibleEvents(role, actorId): HCP gets published only; EM gets assigned only; organizer gets owned only; regulator sees pending_review; vendor sees published
- No UI changes yet—selectors only

ACCEPTANCE:
- npm run type-check clean
- Paste selector function signatures + 3 examples


Do Task B proof first. Paste git diff --name-only and git status --porcelain here and I’ll tell you whether you’re clean to start Phase 2.