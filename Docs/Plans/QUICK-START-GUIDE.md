# Quick Start Guide - Multi-Agent Execution

**How to actually run the multi-agent workflow in Cursor**

---

## Step 1: Set Up Tracking File

✅ **DONE** - `Docs/AGENT-HANDOFF.md` is created and ready.

---

## Step 2: Start First Agent Session

### Phase 1: Use ONE Chat Tab (Sequential)

**Important:** Phase 1 uses ONE chat tab because:
- Tasks are sequential
- May touch same files
- Cursor prevents multiple tabs from editing same files
- Need to maintain context

1. **Open a Cursor Chat tab** (or press Cmd+T to create new one)
2. **Copy and paste this prompt:**

```
You are the Documentation Agent for the Mutqin CPD Ecosystem project.

Your responsibilities:
- Create and update documentation files per Phase 1 tasks
- Ensure consistency across all documentation
- Follow the master plan exactly (no deviations)
- Cross-reference between documents properly

Current task: Task 1.1 - Update Docs/INDEX.md

Reference documents:
- Master plan: Docs/Plans/guiding docs and full dashboard implementation phases.md
- Implementation plan: Docs/Plans/PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md
- Current INDEX.md: Docs/INDEX.md
- Hand-off tracker: Docs/AGENT-HANDOFF.md

Single source of truth: Docs/Plans/guiding docs and full dashboard implementation phases.md

Task details from master plan:
- Add a "Start here for dashboards" section that points to:
  * Docs/IA-SITEMAP.md
  * Docs/L1_DASHBOARD_VIEWS.md (NEW)
  * Docs/L2_DETAIL_PAGES.md (NEW)
  * Docs/COMPLETE_SITEMAP.md
  * Docs/FLOWS.md
  * Docs/TEST-PLAN.md
  * Docs/ACCEPTANCE.md
- States precedence for dashboards: L2_DETAIL_PAGES.md → L1_DASHBOARD_VIEWS.md → IA-SITEMAP.md
- Clarifies role of COMPLETE_SITEMAP.md

Definition of done:
- INDEX.md includes "Start here for dashboards" section
- Precedence hierarchy clearly stated
- All dashboard docs linked and described
- COMPLETE_SITEMAP.md role clarified

After completing, update Docs/AGENT-HANDOFF.md with:
- Task completed
- Files changed
- Next task (1.2)
```

3. **Attach these files to the chat:**
   - `Docs/INDEX.md`
   - `Docs/Plans/guiding docs and full dashboard implementation phases.md`
   - `Docs/Plans/PHASE1-GUIDING-DOCUMENTATION-IMPLEMENTATION-PLAN.md`

4. **Let the agent work** - Review the diff when done

5. **Accept/reject changes** - Make sure it matches the master plan

6. **Update AGENT-HANDOFF.md** manually (or ask agent to do it)

---

## Step 3: Continue with Next Tasks

### For Task 1.2:

**Same process, new prompt:**

```
You are the Documentation Agent for the Mutqin CPD Ecosystem project.

[Keep the same role description]

Current task: Task 1.2 - Update Docs/IA-SITEMAP.md

Task details from master plan:
- For each persona, lock base route + tabs:
  * Organizer: Base /dashboard/organizer, Tabs: overview | activities | accreditation | execution | sponsors
  * Event Manager: Base /dashboard/event-manager, Tabs: assignments | checkin | attendance | certificates | handover
  * HCP: Base /dashboard/hcp, Tabs: discover | registrations | credits | certs_reviews
  * Sponsor/Vendor: Base /dashboard/vendor, Tabs: marketplace | purchases | assets | performance | billing
  * Regulator: Base /dashboard/regulator, Tabs: review_queue | decision_workspace | compliance_monitor | audit_risk | analytics
- Add global L1 rules section
- Add HCP CME tracker note near credits description

[Rest of prompt same as Task 1.1]
```

**Attach:**
- `Docs/IA-SITEMAP.md`
- Master plan
- Implementation plan

---

## Step 4: Phase 2 - Use Multiple Chat Tabs

**Important:** Phase 2 uses MULTIPLE chat tabs because:
- Tasks work on different files (no conflicts)
- Can work in parallel
- Each tab maintains isolated context

### Setup Multiple Tabs:

1. **Tab 1: Route Architecture**
   - Press Cmd+T to create
   - Use Route Architecture Agent prompt
   - Tasks: 2.1, 2.2, 2.3

2. **Tab 2: Data Integration** (start after Tab 1 completes 2.2)
   - Press Cmd+T to create
   - Use Data Integration Agent prompt
   - Task: 2.4

3. **Tab 3: Action Wiring** (start after Tab 2 completes)
   - Press Cmd+T to create
   - Use Action Wiring Agent prompt
   - Task: 2.5

4. **Tab 4: Testing** (start after all tabs complete)
   - Press Cmd+T to create
   - Use Testing Agent prompt
   - Task: 2.6

### Coordination:

- Each tab updates `Docs/AGENT-HANDOFF.md` when complete
- Next tab reads hand-off before starting
- Cursor will warn if tabs try to edit same files (shouldn't happen with this workflow)

## Step 5: Use Composer for Batch Tasks (Optional)

For Phase 2 tasks that involve creating multiple files:

1. **Open Cursor Composer** (Cmd/Ctrl + I)
2. **Use this format:**

```
You are the Route Architecture Agent.

Create all 21 L2 detail pages as stubs per Task 2.2.

Reference:
- Docs/L2_DETAIL_PAGES.md (the authoritative list)
- Docs/Plans/PHASE2-COMPLETE-DASHBOARD-IMPLEMENTATION-PLAN.md

Requirements:
- Each page uses DashboardLayout
- Each page uses design system components (LiquidGlassCard or Card)
- Each page has title and description from L2_DETAIL_PAGES.md
- No raw 404s

Create pages for:
- Organizer: 7 routes
- Event Manager: 4 routes  
- HCP: 3 routes
- Vendor: 3 routes
- Regulator: 4 routes

After completion, update Docs/AGENT-HANDOFF.md.
```

3. **Composer will create all files** - Review the batch
4. **Accept/reject** as needed

---

## Workflow Pattern

### For Each Task:

1. **Copy role prompt** from blueprint (or use template above)
2. **Attach relevant files** (not whole repo)
3. **Let agent work**
4. **Review diff** (check against master plan)
5. **Accept/reject**
6. **Update AGENT-HANDOFF.md**:
   ```markdown
   ### [Timestamp] - Documentation Agent
   Goal: Task 1.1 completed
   Files: Docs/INDEX.md
   Next: Task 1.2 - Update IA-SITEMAP.md
   Blockers: None
   ```
7. **Move to next task**

---

## Tips

### ✅ DO:
- **Phase 1:** Use ONE chat tab (sequential, same files)
- **Phase 2:** Use MULTIPLE chat tabs (parallel, different files)
- Keep prompts focused (one task at a time)
- Attach only relevant files
- Review each diff before accepting
- Update AGENT-HANDOFF.md after each task
- Reference master plan frequently
- Use Cmd+T to create new tabs for Phase 2

### ❌ DON'T:
- Try to use multiple tabs for Phase 1 (will conflict on same files)
- Dump entire repo into context
- Skip diff reviews
- Let agent deviate from master plan
- Forget to update tracking file
- Move to next task without validation
- Edit same files in multiple tabs simultaneously (Cursor prevents this)

---

## When to Switch Tabs/Agents

**Phase 1:** 
- Use ONE chat tab for all 9 tasks
- Same tab, just continue with next task prompt
- Maintains context across sequential tasks

**Phase 2:** 
- **Tab 1:** Tasks 2.1, 2.2, 2.3 → Route Architecture Agent
- **Tab 2:** Task 2.4 → Data Integration Agent (start after Tab 1 completes 2.2)
- **Tab 3:** Task 2.5 → Action Wiring Agent (start after Tab 2 completes)
- **Tab 4:** Task 2.6 → Testing Agent (start after all tabs complete)

**How to switch tabs:**
1. Complete current task in Tab 1
2. Update AGENT-HANDOFF.md with hand-off
3. Press Cmd+T to create Tab 2
4. Use next agent's role prompt in new tab
5. Reference AGENT-HANDOFF.md for context
6. Tabs can work in parallel (if on different files)

---

## Example: Complete Task 1.1 Flow

1. **You:** Open Cursor Chat
2. **You:** Paste Documentation Agent prompt for Task 1.1
3. **You:** Attach Docs/INDEX.md, master plan, implementation plan
4. **Agent:** Reads context, makes changes
5. **Agent:** Proposes diff
6. **You:** Review diff - does it match master plan? ✅
7. **You:** Accept diff
8. **You:** Update AGENT-HANDOFF.md:
   ```markdown
   ### 2025-01-XX - Documentation Agent
   Goal: Task 1.1 - Updated INDEX.md with dashboard section
   Files: Docs/INDEX.md
   Next: Task 1.2 - Update IA-SITEMAP.md
   Blockers: None
   ```
9. **You:** Move to Task 1.2 (new prompt, same agent)

---

## Ready to Start?

**Next Action:** 
1. Open Cursor Chat
2. Copy the Task 1.1 prompt from above
3. Attach the files
4. Let's go! 🚀

---

**Status:** Ready for execution  
**First Task:** Task 1.1 - Update INDEX.md

