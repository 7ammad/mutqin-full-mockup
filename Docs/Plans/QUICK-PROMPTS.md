# Quick Prompts - Copy Ready

**Last Updated:** 2025-01-27
**Status:** Batch 1 partially complete - Task 2.3 needs remaining personas. Complete Task 2.3 before Batch 2.

**HOW TO USE:** This file contains current prompts only. When tasks complete, old prompts are removed and new ones added.

---

## Implementation Agent - Complete Task 2.3 (Remaining Personas)

Copy everything below into your Implementation Agent chat tab:

You are the Implementation Agent. Complete the remaining work for Task 2.3: Wire L1 to L2 Routes.

**CURRENT STATUS:**
- Task 2.1: ✅ APPROVED (Routing & 404 Safety)
- Task 2.2: ✅ APPROVED (Stub All L2 Pages)
- Task 2.3: ⚠️ PARTIAL
  - ✅ Organizer: Complete
  - ✅ Event Manager: Complete
  - ❌ HCP: Needs L1 to L2 wiring
  - ❌ Vendor: Needs L1 to L2 wiring
  - ❌ Regulator: Needs L1 to L2 wiring

**REQUIRED: Use Ref and EXA MCP Servers Before Implementation**

Before starting, you MUST use Ref and EXA MCP servers to get official documentation and best practices:

1. **Use `ref_search_documentation`** to search for:
   - Next.js App Router navigation patterns
   - React Link component best practices
   - TypeScript route building patterns

2. **Use `exa_get_code_context_exa`** to get:
   - Next.js navigation examples
   - React Link component patterns
   - Route building helper usage

**TASK: Complete L1 to L2 Wiring for HCP, Vendor, and Regulator**

Follow the Organizer and Event Manager patterns (already complete). Reference:
- Organizer implementation for pattern
- Event Manager implementation for pattern
- `src/lib/routes.ts` for route building helpers
- `Docs/L1_DASHBOARD_VIEWS.md` for correct navigation links

**Steps:**
1. Review Organizer and Event Manager L1 components to understand the pattern
2. Wire HCP L1 tabs to L2 routes:
   - Events tab → `/dashboard/hcp/events/[id]`
   - Tickets tab → `/dashboard/hcp/tickets/[id]`
   - Certificates tab → `/dashboard/hcp/certificates/[id]`
   - Credits tab → Already L1 (no L2 route)
3. Wire Vendor L1 tabs to L2 routes:
   - Events tab → `/dashboard/vendor/events/[id]`
   - Sponsorships tab → `/dashboard/vendor/sponsorships/[id]`
   - Analytics tab → Already L1 (no L2 route)
4. Wire Regulator L1 tabs to L2 routes:
   - Applications tab → `/dashboard/regulator/applications/[id]`
   - Providers tab → `/dashboard/regulator/providers/[id]`
   - Compliance tab → Already L1 (no L2 route)
5. Use `buildRoute` helper from `src/lib/routes.ts` for all route building
6. Ensure all navigation matches `L1_DASHBOARD_VIEWS.md` exactly

**Acceptance Criteria:**
- [ ] All HCP L1 tabs link to correct L2 routes
- [ ] All Vendor L1 tabs link to correct L2 routes
- [ ] All Regulator L1 tabs link to correct L2 routes
- [ ] Navigation uses route constants from `src/lib/routes.ts`
- [ ] All links match `L1_DASHBOARD_VIEWS.md` specifications
- [ ] No broken links
- [ ] All CTAs work correctly

**Files to Modify:**
- HCP L1 dashboard components in `app/dashboard/hcp/`
- Vendor L1 dashboard components in `app/dashboard/vendor/`
- Regulator L1 dashboard components in `app/dashboard/regulator/`

**Reference:**
- `Docs/L1_DASHBOARD_VIEWS.md` - Navigation specifications
- `Docs/L2_DETAIL_PAGES.md` - L2 route list
- `src/lib/routes.ts` - Route building helpers
- Organizer and Event Manager implementations (for pattern)

**After completion:**
1. Update `Docs/AGENT-HANDOFF.md` with:
   - Task 2.3 completion status
   - Files changed
   - All personas now complete
2. Run verification:
   - `npm run type-check`
   - `npm test`
   - Manually verify all L1 tabs link correctly

---

## Review and Fix Agent - Batch 1 (Tasks 2.1, 2.2, 2.3)

Copy everything below into your Review and Fix Agent chat tab:

You are the Review and Fix Agent. Review Phase 2 Batch 1: Tasks 2.1, 2.2, and 2.3, then implement all required fixes.

**REQUIRED: Use Ref and EXA MCP Servers for Review**

Before completing your review, you MUST use Ref and EXA MCP servers to validate against official documentation and best practices:

1. **Use `ref_search_documentation`** to search for:
   - Official documentation for technologies used (Next.js, React, TypeScript)
   - Best practices and patterns
   - Code examples from official sources
   - For this batch: Next.js routing, 404 handling, React component patterns, TypeScript best practices, design system implementation

2. **Use `exa_get_code_context_exa`** to get:
   - Relevant code examples and implementation patterns
   - Power user best practices
   - Real-world code samples
   - For this batch: Next.js App Router patterns, React component architecture, TypeScript type safety, design system component usage

3. **Validation Process:**
   - Compare implementation against official documentation
   - Check for adherence to best practices
   - Verify code examples match industry standards
   - Flag any deviations from recommended patterns

**This ensures reviews are based on official documentation and industry best practices, not assumptions.**

TASKS TO REVIEW:
- Task 2.1: Routing & 404 Safety
- Task 2.2: Stub All L2 Pages
- Task 2.3: Wire L1 to L2 Routes

REVIEW CHECKLIST FOR EACH TASK:

### Task 2.1 Review:
1. Is dashboard not-found page created with design system?
2. Do all persona dashboards use DashboardLayout?
3. Are there any local sidebars or headers in persona views?
4. Is route validation utility created?
5. Is route constants file created?
6. Do invalid routes show styled 404, not raw Next.js 404?

### Task 2.2 Review:
1. Are all 21 L2 routes stubbed?
2. Do all stubs use DashboardLayout?
3. Do all stubs use design system components?
4. Are there any blank/unstyled pages?
5. Are TypeScript types correct?
6. Do page titles match L2_DETAIL_PAGES.md?

### Task 2.3 Review:
1. Do all L1 tabs link to correct L2 routes?
2. Does navigation match L1_DASHBOARD_VIEWS.md?
3. Are there any broken links?
4. Do all CTAs work correctly?
5. Does navigation use route constants?

REFERENCE DOCUMENTS:
- Master plan: Docs/Plans/guiding docs and full dashboard implementation phases.md
- Phase 2 plan: Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md
- L1_DASHBOARD_VIEWS.md
- L2_DETAIL_PAGES.md
- IOS_DESIGN_SYSTEM.md
- IA-SITEMAP.md

**AFTER REVIEW - IMPLEMENT ALL FIXES:**

If any issues are found, you MUST implement the fixes yourself:

1. **For Task 2.2 fixes:**
   - Create any missing L2 route stub pages
   - Ensure all use DashboardLayout and design system components
   - Follow the pattern from existing stub pages

2. **For Task 2.3 fixes:**
   - Complete L1 to L2 wiring for all personas
   - Follow the Organizer pattern (already complete)
   - Use `buildRoute` helper from routes.ts
   - Ensure all navigation matches L1_DASHBOARD_VIEWS.md

3. **Use MCP servers for fix implementation:**
   - Use `exa_get_code_context_exa` to get code examples for fixes
   - Use `ref_search_documentation` to verify fix patterns match best practices
   - Ensure fixes align with official documentation

PROVIDE FOR EACH TASK:
- Status: APPROVED or NEEDS FIXES
- Issues found (if any) with severity: Critical/High/Medium/Low
- Specific recommendations
- **Fixes implemented** (list all fixes you implemented)

After review and fixes, update Docs/AGENT-HANDOFF.md with:
- Review results for all 3 tasks
- All fixes implemented
- Files changed for fixes
- Next batch (Batch 2: Tasks 2.4, 2.5, 2.6)

---

## Phase 2 - Batch 2: Tasks 2.4, 2.5, 2.6

### Implementation Agent - Batch 2 (Tasks 2.4, 2.5, 2.6)

Copy everything below into your Implementation Agent chat tab:

You are executing Phase 2 Batch 2: Tasks 2.4, 2.5, and 2.6 in parallel.

**REQUIRED: Use Ref and EXA MCP Servers Before Implementation**

Before starting implementation, you MUST use Ref and EXA MCP servers to get official documentation, best practices, and code examples:

1. **Use `ref_search_documentation`** to search for:
   - Official documentation for technologies you'll use
   - Best practices and patterns
   - Code examples from official sources
   - For this batch: Data fetching patterns (React Query, SWR, etc.), state management, API integration, error handling, loading states, E2E testing best practices (Playwright)

2. **Use `exa_get_code_context_exa`** to get:
   - Relevant code examples and implementation patterns
   - Power user best practices
   - Real-world code samples
   - For this batch: React data fetching hooks, state management patterns, API client implementations, error boundary patterns, E2E test scenarios

3. **Before implementing each task:**
   - Search for official documentation on the approach you'll use
   - Get code examples for similar implementations
   - Verify your approach matches best practices
   - Use the examples to guide your implementation

**This ensures implementation follows official documentation and industry best practices from the start.**

BATCH OVERVIEW:
- Task 2.4: Wire Data Reads
- Task 2.5: Wire Actions
- Task 2.6: E2E Testing

Execute all three tasks, then update Docs/AGENT-HANDOFF.md with completion status for all three.

---

### TASK 2.4 - Wire Data Reads

Objective: Connect all L1 and L2 pages to data sources (API/mocks).

Steps:
1. Wire L1 dashboard tabs to data reads
2. Wire L2 detail pages to data reads
3. Implement loading states
4. Implement error handling
5. Use seeded data (evt-1, org-1, em-1, hcp-1, reg-1)
6. Ensure all data displays match L1_DASHBOARD_VIEWS.md and L2_DETAIL_PAGES.md specifications

Acceptance Criteria:
- [ ] All L1 tabs display data
- [ ] All L2 pages display data
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Seeded data working
- [ ] Data matches documentation specifications

Files to Modify:
- L1 dashboard components in `app/dashboard/<persona>/`
- L2 detail page components
- Data fetching utilities
- API/mock handlers

Reference:
- Docs/L1_DASHBOARD_VIEWS.md
- Docs/L2_DETAIL_PAGES.md
- Docs/CONTRACTS.md
- Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md (Task 2.4)

---

### TASK 2.5 - Wire Actions

Objective: Connect UI actions to POST endpoints and state updates.

Steps:
1. Wire all primary actions from L1_DASHBOARD_VIEWS.md
2. Wire all actions from L2_DETAIL_PAGES.md
3. Implement state transitions per FLOWS.md
4. Add success/error feedback
5. Update UI after actions
6. Ensure RBAC gating per RBAC.md

Acceptance Criteria:
- [ ] All primary actions wired
- [ ] State transitions working per FLOWS.md
- [ ] Success/error feedback implemented
- [ ] UI updates after actions
- [ ] RBAC gating enforced

Files to Modify:
- Action handlers
- State management
- UI components with actions
- Policy checks (use src/lib/policy/can.ts if exists)

Reference:
- Docs/L1_DASHBOARD_VIEWS.md
- Docs/L2_DETAIL_PAGES.md
- Docs/FLOWS.md
- Docs/RBAC.md
- Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md (Task 2.5)

---

### TASK 2.6 - E2E Testing

Objective: Implement and verify E2E test scenario from TEST-PLAN.md.

Steps:
1. Update `tests/e2e/demo-happy-path.spec.ts`
2. Implement test scenario from TEST-PLAN.md "E2E Test Scenario - Cross-Persona Spine"
3. Test all 9 steps of cross-persona spine
4. Verify all routes, state transitions, and handoffs
5. Ensure test passes
6. Verify all test requirements from TEST-PLAN.md

Acceptance Criteria:
- [ ] E2E test implements TEST-PLAN.md scenario exactly
- [ ] All 9 steps tested
- [ ] All routes verified
- [ ] State transitions verified
- [ ] Cross-persona handoffs verified
- [ ] Test passes

Files to Modify:
- `tests/e2e/demo-happy-path.spec.ts`

Reference:
- Docs/TEST-PLAN.md
- Docs/FLOWS.md
- Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md (Task 2.6)

---

After completing all 3 tasks:
1. Update Docs/AGENT-HANDOFF.md with:
   - Files changed for each task
   - Changes made for each task
   - Phase 2 completion status
2. Run verification:
   - `npm run type-check`
   - `npm test`
   - `npx playwright test tests/e2e/demo-happy-path.spec.ts`

---

## Testing Agent - Batch 2 (Tasks 2.4, 2.5, 2.6)

Copy everything below into your Testing Agent chat tab:

You are the Testing Agent. Run comprehensive tests for Phase 2 Batch 2: Tasks 2.4, 2.5, and 2.6.

**REQUIRED: Use Ref and EXA MCP Servers for Testing Best Practices**

Before running tests, you MUST use Ref and EXA MCP servers to get testing best practices and patterns:

1. **Use `ref_search_documentation`** to search for:
   - Official testing documentation (Playwright, Jest, Vitest, etc.)
   - Best practices for E2E testing
   - Visual regression testing patterns
   - Design system testing approaches
   - Accessibility testing practices
   - For this batch: Playwright E2E testing, React component testing, visual testing, design system validation

2. **Use `exa_get_code_context_exa`** to get:
   - Relevant test code examples and patterns
   - Power user testing practices
   - Real-world test scenarios
   - For this batch: Playwright test patterns, visual regression testing, design system component testing, accessibility testing examples

3. **Testing Approach:**
   - Use official documentation to guide test structure
   - Follow best practices for test organization
   - Implement visual/design validation tests
   - Ensure tests are maintainable and follow industry standards

**This ensures tests follow official documentation and industry best practices.**

TESTING SCOPE:
- Functional Testing: Verify all features work correctly
- Design Testing: Verify alignment, spacing, design system compliance
- Visual Testing: Verify UI matches design specifications
- Accessibility Testing: Verify WCAG compliance
- E2E Testing: Verify complete user flows

TEST EXECUTION:

1. **Type Checking:**
   ```bash
   npm run type-check
   ```
   - Verify no TypeScript errors
   - All types are correct

2. **Unit Tests:**
   ```bash
   npm test
   ```
   - Verify all unit tests pass
   - Check test coverage if available

3. **E2E Tests:**
   ```bash
   npx playwright test tests/e2e/demo-happy-path.spec.ts
   ```
   - Verify E2E test scenario passes
   - All 9 steps of cross-persona spine work

4. **Design System Validation:**
   - Verify all components use design system tokens (no raw Tailwind colors)
   - Verify all pages use DashboardLayout
   - Verify spacing and alignment match design system
   - Verify typography follows design system
   - Verify color usage follows design system
   - Check for consistent component usage (LiquidGlassCard, Card, GlassButton, EmptyState)

5. **Visual/Design Checks:**
   - Verify proper spacing between elements
   - Verify alignment (left/right, center, grid alignment)
   - Verify responsive behavior
   - Verify RTL support (if applicable)
   - Verify no layout shifts or visual bugs
   - Verify consistent padding/margins

6. **Accessibility Checks:**
   - Verify keyboard navigation works
   - Verify screen reader compatibility
   - Verify ARIA labels where needed
   - Verify color contrast ratios
   - Verify focus states are visible

7. **Functional Validation:**
   - Verify all L1 tabs display data correctly
   - Verify all L2 pages display data correctly
   - Verify all actions work (buttons, links, forms)
   - Verify state transitions work per FLOWS.md
   - Verify navigation works correctly
   - Verify error handling displays properly
   - Verify loading states display properly

REFERENCE DOCUMENTS:
- Docs/TEST-PLAN.md
- Docs/FLOWS.md
- Docs/L1_DASHBOARD_VIEWS.md
- Docs/L2_DETAIL_PAGES.md
- Docs/IOS_DESIGN_SYSTEM.md
- Docs/ACCEPTANCE.md
- Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md

TEST RESULTS FORMAT:

For each test category, provide:
- **Status:** PASS / FAIL / PARTIAL
- **Issues Found:** (if any)
  - Severity: Critical/High/Medium/Low
  - Description
  - Affected files/components
  - Recommendation
- **Test Output:** (paste relevant output)
- **Screenshots:** (if visual issues found, describe them)

After testing, update Docs/AGENT-HANDOFF.md with:
- Test results summary
- All issues found (if any)
- Test output
- Next steps (proceed to review or fix issues)

---

---


