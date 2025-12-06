# Current Agent Prompts

**Last Updated:** 2025-01-27  
**Status:** Task 1.7 complete, Task 1.8 next

This file contains copy-paste ready prompts for agents. 
**HOW TO USE:** Open this file, find the prompt you need, copy the entire section (from "You are..." to the end), and paste into your agent chat tab.

**Current Status:**
- Task 1.6: Complete, needs review
- Task 1.7: Complete, needs review  
- Task 1.8: Next (Update ACCEPTANCE.md)

---

## PROMPT FORMAT NOTE

All prompts below are plain text - no code blocks. Just copy from "You are..." to the end of that section and paste directly into your agent chat tab.

---

## Review Prompt - Task 1.6

Copy everything below this line into your Review Agent chat tab:

You are the Review Agent. Review Task 1.6 - Update FLOWS.md.

TASK TO REVIEW:
- Task 1.6: Update Docs/FLOWS.md

REVIEW CHECKLIST:
1. Does "Cross-Persona Spine - Event → Credits" section exist?
   - Section title: "## Cross-Persona Spine – Event → Credits" or similar
   - Located in FLOWS.md (around line 86)

2. Is happy-path documented with all real routes?
   Check for these routes in the flow:
   - Organizer drafts/edits: `/dashboard/organizer/events/[eventId]/edit` ✓
   - Organizer submits: `/dashboard/organizer/events/[eventId]` ✓
   - Regulator reviews: `/dashboard/regulator/applications/[applicationId]` ✓
   - Regulator decision: `/dashboard/regulator/applications/[applicationId]/decision` ✓
   - Organizer assigns EM: `/dashboard/organizer/events/[eventId]/assign` ✓
   - Event Manager checkin: `/dashboard/event-manager/events/[eventId]/checkin` ✓
   - Event Manager attendance: `/dashboard/event-manager/events/[eventId]/attendance` ✓
   - Event Manager handover: `/dashboard/event-manager/events/[eventId]/handover` ✓
   - Organizer sees attendance: `/dashboard/organizer/events/[eventId]/attendance` ✓
   - HCP event: `/dashboard/hcp/events/[eventId]` ✓
   - HCP ticket: `/dashboard/hcp/tickets/[ticketId]` ✓
   - HCP certificate: `/dashboard/hcp/certificates/[certificateId]` ✓
   - HCP credits tab: `/dashboard/hcp?tab=credits` (L1 reference) ✓

3. Is Route Validation Rule added?
   - Rule states: "All pages referenced in this flow must be routes defined in `L1_DASHBOARD_VIEWS.md` and `L2_DETAIL_PAGES.md`. No custom URLs are allowed in this spine."
   - Rule is clearly stated (around line 141-143)

4. Do all routes exist in L1_DASHBOARD_VIEWS.md or L2_DETAIL_PAGES.md?
   - Verify each route referenced exists in the authoritative docs
   - No custom/invalid routes
   - All routes validated

5. Is formatting consistent?
   - Markdown structure is correct
   - Routes are clearly formatted
   - Flow is readable and well-organized
   - Steps are numbered or clearly structured

REFERENCE DOCUMENTS:
- Master plan: Docs/Plans/guiding docs and full dashboard implementation phases.md (Task 1.6)
- Implementation plan: Docs/Plans/PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md (Task 1.6)
- File to review: Docs/FLOWS.md
- Route validation: Docs/L1_DASHBOARD_VIEWS.md, Docs/L2_DETAIL_PAGES.md

PROVIDE:
- Status: APPROVED or NEEDS FIXES
- Issues found (if any) with severity: Critical/High/Medium/Low
- Specific recommendations for fixes
- Route validation results (verify all routes exist in authoritative docs)

After review, update Docs/AGENT-HANDOFF.md with the review results.

---

## Review Prompt - Task 1.7

Copy everything below this line into your Review Agent chat tab:

You are the Review Agent. Review Task 1.7 - Update TEST-PLAN.md.

TASK TO REVIEW:
- Task 1.7: Update Docs/TEST-PLAN.md

REVIEW CHECKLIST:
1. Does "E2E Test Scenario - Cross-Persona Spine (Event → Credits)" section exist?
   - Section title matches or similar
   - Located in TEST-PLAN.md

2. Is test scenario documented following FLOWS.md?
   - Follows exact sequence from FLOWS.md "Cross-Persona Spine" section
   - All 9 steps documented with exact routes
   - Each step includes Route, Action, and Verify criteria

3. Are test requirements specified?
   - Route Validation (all routes must exist in authoritative docs)
   - Seeded Data (evt-1, org-1, em-1, hcp-1, reg-1)
   - State Transitions (draft → pending_review → approved → published → completed)
   - Route Navigation (no 404s, proper rendering)
   - Cross-Persona Handoffs
   - UI Elements verification

4. Is test implementation referenced?
   - References `tests/e2e/demo-happy-path.spec.ts`
   - States requirement for navigation through L1 tab and L2 route per persona

5. Do all routes exist in L1_DASHBOARD_VIEWS.md or L2_DETAIL_PAGES.md?
   - Verify each route referenced exists in authoritative docs
   - No custom/invalid routes

REFERENCE DOCUMENTS:
- Master plan: Docs/Plans/guiding docs and full dashboard implementation phases.md (Task 1.7)
- Implementation plan: Docs/Plans/PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md (Task 1.7)
- File to review: Docs/TEST-PLAN.md
- Flow reference: Docs/FLOWS.md (Cross-Persona Spine section)
- Route validation: Docs/L1_DASHBOARD_VIEWS.md, Docs/L2_DETAIL_PAGES.md

PROVIDE:
- Status: APPROVED or NEEDS FIXES
- Issues found (if any) with severity: Critical/High/Medium/Low
- Specific recommendations for fixes
- Route validation results

After review, update Docs/AGENT-HANDOFF.md with the review results.

---

## Documentation Agent Prompt - Task 1.8

Copy everything below this line into your Documentation Agent chat tab:

You are the Documentation Agent. Execute Task 1.8 - Update ACCEPTANCE.md.

TASK:
Update Docs/ACCEPTANCE.md to add acceptance criteria for persona dashboards and L2 pages.

STEPS:
1. Add new section:
   ## Persona Dashboards & Detail Pages v1

2. Add acceptance bullets:
   ### Acceptance Criteria
   
   - All `/dashboard/<persona>?tab=...` views adhere to `L1_DASHBOARD_VIEWS.md` and `IA-SITEMAP.md`.
   - All routes in `L2_DETAIL_PAGES.md` either:
     - Are implemented with DS-compliant UI, or
     - Are not linked from any UI (no dead links).
   - No raw Next.js 404 appears under any `/dashboard/...` path during happy-path.
   - The following commands must pass:
     - `npm run type-check`
     - `npm test`
     - `npx playwright test tests/e2e/demo-happy-path.spec.ts`

ACCEPTANCE CRITERIA:
- [ ] Section "Persona Dashboards & Detail Pages v1" added
- [ ] All acceptance bullets listed (4 bullets total)
- [ ] Commands specified (type-check, test, e2e)

REQUIRED INPUTS:
- Docs/ACCEPTANCE.md (file to update)
- Docs/L1_DASHBOARD_VIEWS.md (for reference)
- Docs/L2_DETAIL_PAGES.md (for reference)
- Docs/IA-SITEMAP.md (for reference)
- Docs/Plans/PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md (Task 1.8 specification)

CONSTRAINTS:
- Do not modify existing sections unless necessary
- Maintain document structure and formatting
- Use exact wording from implementation plan

After completion, update Docs/AGENT-HANDOFF.md with:
- Files changed
- Changes made
- Next task (Task 1.9)

---

## How to Use This File

1. Open `Docs/Plans/CURRENT-PROMPTS.md`
2. Find the prompt you need (Review or Documentation Agent)
3. Copy the entire prompt section (from "You are..." to the end)
4. Paste into the appropriate agent chat tab
5. The agent will execute the task

---

**Note:** This file is updated automatically by the Orchestrator when new prompts are generated. Always use the latest version.

