# Multi-Agent Implementation Blueprint

**Status:** Ready for Execution  
**Purpose:** Orchestrate Phase 1 & Phase 2 tasks using Cursor multi-agent workflows  
**Approach:** Role-based agents with structured hand-offs

---

## Core Principle

Cursor multi-agent = **Multiple chat tabs (Cmd+T)** with isolated context, OR **Cloud Agents** for true parallel execution.

**Key Facts:**
- **Chat Tabs:** Multiple tabs (Cmd+T), each with separate context/history, but Cursor prevents editing same files simultaneously
- **Cloud Agents:** True parallel execution in separate VMs, can work on different branches
- **Agent Modes:** Same AI with different tool configs (Agent/Ask/Plan modes)

**For This Project:**
- **Phase 1 (Documentation):** Sequential tasks, same files → Use **ONE chat tab** with role-based prompts
- **Phase 2 (Implementation):** Can be parallel → Use **multiple chat tabs** OR **Cloud Agents** for independent tasks

---

## Agent Roles

### 1. **Documentation Agent**
**Role:** Create and update documentation files  
**Responsibilities:**
- Write/update markdown files per Phase 1 tasks
- Ensure consistency across docs
- Follow master plan exactly
- Cross-reference between documents

**Hand-off Format:**
```
Goal: [Task completed]
Files Changed: [list]
Cross-References: [documents that reference this]
Next: [what needs to happen next]
```

### 2. **Route Architecture Agent**
**Role:** Implement routing structure and L2 pages  
**Responsibilities:**
- Create L2 page stubs (Task 2.2)
- Wire L1 to L2 navigation (Task 2.3)
- Implement route validation
- Ensure no 404s

**Hand-off Format:**
```
Routes Created: [list]
Navigation Wired: [L1 tab → L2 route mappings]
Validation: [route validation status]
Next: [data wiring or actions]
```

### 3. **Data Integration Agent**
**Role:** Wire data reads and API connections  
**Responsibilities:**
- Connect L2 pages to existing GET functions
- Implement missing GETs per CONTRACTS.md
- Ensure type safety (no `any`, no loose `unknown`)
- Handle loading/error states

**Hand-off Format:**
```
Data Reads Wired: [pages connected]
New GETs Created: [if any]
Type Safety: [verified]
Next: [action wiring]
```

### 4. **Action Wiring Agent**
**Role:** Connect UI actions to POST endpoints  
**Responsibilities:**
- Wire action buttons to existing POSTs
- Use typed API client
- Implement toast feedback
- Refresh UI after actions

**Hand-off Format:**
```
Actions Wired: [list]
POSTs Used: [endpoints]
Feedback: [toast implementation status]
Next: [testing]
```

### 5. **Review Agent**
**Role:** Quality assurance and validation for documentation  
**Responsibilities:**
- Review completed documentation tasks against master plan
- Verify acceptance criteria are met
- Check for consistency across documents
- Validate cross-references
- Identify missing items or deviations
- Ensure formatting and structure compliance

**Hand-off Format:**
```
Tasks Reviewed: [list]
Issues Found: [list with severity]
Recommendations: [suggestions]
Status: [approved / needs fixes]
Next: [continue or fix issues]
```

### 6. **Testing Agent**
**Role:** E2E tests and validation  
**Responsibilities:**
- Update E2E test per FLOWS.md
- Run type-check, unit tests, E2E
- Document failures as blockers
- Verify no 404s in happy path

**Hand-off Format:**
```
Tests Updated: [files]
Results: [pass/fail with details]
Blockers: [any failures]
Next: [fix blockers or mark complete]
```

---

## Task Distribution Strategy

### Phase 1: Documentation (Sequential - ONE Chat Tab)

**Why ONE Tab:**
- Tasks are sequential and may touch same files
- Cursor prevents multiple tabs from editing same files
- Need to maintain context across tasks
- Documentation builds on previous tasks

**Flow:**
```
Single Chat Tab: Documentation Agent
  → Task 1.1 (INDEX.md)
  → Task 1.2 (IA-SITEMAP.md)
  → Task 1.3 (L1_DASHBOARD_VIEWS.md)
  → Task 1.4 (L2_DETAIL_PAGES.md)
  → Task 1.5 (COMPLETE_SITEMAP.md)
  → Task 1.6 (FLOWS.md)
  → Task 1.7 (TEST-PLAN.md)
  → Task 1.8 (ACCEPTANCE.md)
  → Task 1.9 (Design System docs)
```

**Recommendation:** Use ONE chat tab for all Phase 1 tasks to avoid file conflicts and maintain context.

### Phase 2: Implementation (Parallel with Multiple Tabs)

**Why Multiple Tabs:**
- Tasks work on different files (routes vs data vs actions)
- Can work in parallel without conflicts
- Each tab maintains isolated context

**Parallel Workflow:**
```
Tab 1: Route Architecture Agent
  → Task 2.1 (404 Safety)
  → Task 2.2 (Create 21 L2 stubs)
  → Task 2.3 (Wire L1 to L2 navigation)

Tab 2: Data Integration Agent (starts after 2.2)
  → Task 2.4 (Wire data reads)
  → Works on completed L2 pages from Tab 1

Tab 3: Action Wiring Agent (starts after 2.4)
  → Task 2.5 (Wire actions)
  → Works on pages with data from Tab 2

Tab 4: Testing Agent (starts after all complete)
  → Task 2.6 (E2E testing)
  → Validates all work from Tabs 1-3
```

**Execution Strategy:**
1. **Tab 1:** Complete Tasks 2.1, 2.2, 2.3 (all routing work)
2. **Tab 2:** Start Task 2.4 after Tab 1 completes 2.2 (data wiring)
3. **Tab 3:** Start Task 2.5 after Tab 2 completes (action wiring)
4. **Tab 4:** Start Task 2.6 after all tabs complete (testing)

**Alternative: Cloud Agents**
- If you want true parallel execution on separate branches
- Each cloud agent works in isolated VM
- Good for completely independent features
- Overkill for this tightly-coupled workflow

---

## Communication Protocols

### Single Source of Truth

**File:** `Docs/AGENT-HANDOFF.md` (create this)

**Purpose:** Track agent hand-offs, current state, and blockers

**Format:**
```markdown
## Current State
- Phase: [1 or 2]
- Active Agent: [role]
- Current Task: [task number and name]

## Hand-offs
### [Timestamp] - [Agent Role]
Goal: [what was done]
Files: [list]
Next: [what needs to happen]
Blockers: [any issues]

## Blockers
- [Issue description]
- [Who needs to resolve]
```

### Context Management

**Rules:**
- Each agent receives only relevant files (not whole repo)
- Pin role description at start of each agent session
- Reference `AGENT-HANDOFF.md` for current state
- Keep prompts under 500 tokens when possible

**Context Files Per Agent:**

**Documentation Agent:**
- Master plan: `Docs/Plans/guiding docs and full dashboard implementation phases.md`
- Target doc being created/updated
- Related docs for cross-references

**Route Architecture Agent:**
- `Docs/L2_DETAIL_PAGES.md`
- `Docs/IA-SITEMAP.md`
- `src/components/DashboardLayout.tsx`
- Target route files

**Data Integration Agent:**
- `Docs/CONTRACTS.md`
- `src/lib/api/*` (existing GETs)
- `src/lib/mockApi/*`
- Target L2 page files

**Action Wiring Agent:**
- `Docs/CONTRACTS.md`
- `src/lib/api/*` (existing POSTs)
- Target component files with actions

**Testing Agent:**
- `Docs/FLOWS.md`
- `Docs/TEST-PLAN.md`
- `tests/e2e/demo-happy-path.spec.ts`
- All modified files

---

## Review Gates

### After Each Agent Pass

1. **Diff Review:**
   - Max 200 lines per diff (break larger changes)
   - Review for correctness
   - Check against master plan

2. **Validation:**
   - Run `npm run type-check` (if code changed)
   - Verify no broken imports
   - Check file paths are correct

3. **Hand-off Update:**
   - Update `AGENT-HANDOFF.md`
   - Document what changed
   - Note any blockers

### Phase Completion Gates

**Phase 1 Complete When:**
- All 9 tasks done
- All files created/modified
- Cross-references verified
- No conflicts between docs

**Phase 2 Complete When:**
- All 6 tasks done
- All 21 L2 pages created
- Navigation wired
- Data reads connected
- Actions wired
- E2E test passes
- `npm run type-check` passes
- `npm test` passes

---

## Execution Plan

### Phase 1 Execution (2-3 days)

**Setup:**
- **ONE Chat Tab** (Cmd+T to create if needed)
- Use role-based prompts for "Documentation Agent"
- Keep same tab for all 9 tasks

**Day 1:**
- Tab: Single Documentation Tab
- Tasks: 1.1, 1.2, 1.3 (start)
- Review: After each task
- Note: All in same tab to maintain context

**Day 2:**
- Tab: Same Documentation Tab (continue)
- Tasks: 1.3 (complete), 1.4, 1.5
- Review: After each task

**Day 3:**
- Tab: Same Documentation Tab (continue)
- Tasks: 1.6, 1.7, 1.8, 1.9
- Review: After each task
- Final: Cross-reference verification

### Phase 2 Execution (2-3 weeks)

**Setup:**
- **Multiple Chat Tabs** (Cmd+T for each)
- Tab 1: Route Architecture
- Tab 2: Data Integration (starts after Tab 1 completes 2.2)
- Tab 3: Action Wiring (starts after Tab 2 completes)
- Tab 4: Testing (starts after all complete)

**Week 1:**
- Tab 1: Route Architecture Agent
- Tasks: 2.1, 2.2, 2.3
- Review: After 2.1, after 2.2, after 2.3
- Hand-off: Update AGENT-HANDOFF.md when 2.2 complete

**Week 2:**
- Tab 1: Complete Task 2.3
- Tab 2: Data Integration Agent (starts)
- Tasks: 2.4
- Review: After each persona's pages wired
- Hand-off: Update AGENT-HANDOFF.md when complete

**Week 2-3:**
- Tab 3: Action Wiring Agent (starts)
- Tasks: 2.5
- Review: After each persona's actions wired
- Hand-off: Update AGENT-HANDOFF.md when complete

**Week 3:**
- Tab 4: Testing Agent (starts)
- Tasks: 2.6
- Review: After test updates
- Final: All tests passing

---

## Best Practices

### Prompt Engineering

**Role Definition Template:**
```
You are the [Agent Role] for the Mutqin CPD Ecosystem project.

Your responsibilities:
- [List 3-5 key responsibilities]

Current task: [Task number and name from master plan]

Reference documents:
- [List 2-3 key docs]

Single source of truth: [AGENT-HANDOFF.md or specific doc]

Definition of done:
- [List 3-5 acceptance criteria]
```

### Hand-off Protocol

**Before hand-off:**
1. Update `AGENT-HANDOFF.md` with current state
2. List files changed
3. Note any blockers
4. Specify next agent and task

**After hand-off:**
1. Next agent reads `AGENT-HANDOFF.md`
2. Reviews previous agent's changes
3. Confirms understanding
4. Starts task

### Conflict Resolution

**If agents conflict:**
1. Check master plan for authoritative answer
2. If unclear, document conflict in `AGENT-HANDOFF.md`
3. Human resolves conflict
4. Update master plan if needed
5. Continue

### Token Management

**Optimize context:**
- Attach only relevant files (not whole folders)
- Use file references instead of pasting large code blocks
- Summarize previous work instead of full chat history
- Trim chat history periodically

---

## Quick Start Checklist

**Before Starting:**
- [ ] Create `Docs/AGENT-HANDOFF.md`
- [ ] Verify master plan is accessible
- [ ] Confirm all reference docs exist
- [ ] Set up role prompts (save as snippets)

**For Each Agent Session:**
- [ ] Load role prompt
- [ ] Attach relevant files only
- [ ] Reference `AGENT-HANDOFF.md`
- [ ] Execute task
- [ ] Review diff
- [ ] Update `AGENT-HANDOFF.md`
- [ ] Hand off to next agent

**After Each Phase:**
- [ ] Run validation commands
- [ ] Verify all acceptance criteria met
- [ ] Update project status
- [ ] Document lessons learned

---

## Success Metrics

**Phase 1 Success:**
- All 9 documentation tasks complete
- Zero conflicts between docs
- All cross-references valid

**Phase 2 Success:**
- All 21 L2 pages created and styled
- Zero 404s in happy path
- All tests passing
- Type check clean

**Overall Success:**
- Time saved vs sequential approach: ~30-40%
- Quality maintained (all reviews passed)
- Clear audit trail in `AGENT-HANDOFF.md`

---

**Status:** Ready for Execution  
**Next Step:** Create `Docs/AGENT-HANDOFF.md` and start Phase 1 with Documentation Agent

