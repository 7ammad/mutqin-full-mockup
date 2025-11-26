# AI-Assisted Coding Planning Methodology
## Ensuring Pages Are Built, Not Just Components

**Based on:** Cursor IDE best practices, AI coding power user workflows, and UX/UI implementation strategies

---

## The Core Problem

**Symptom:** Components built, but pages/routes missing  
**Root Cause:** Planning focused on components, not on complete user journeys and route structure  
**Solution:** Route-first, page-first planning methodology

---

## Five-Phase Planning Workflow

### Phase 1: Requirements & Route Mapping (CRITICAL)

**Goal:** Define complete route structure BEFORE building components

#### Step 1.1: Route Inventory
```
1. List ALL user journeys
2. Map each journey to routes
3. Create route hierarchy
4. Identify route dependencies
```

**Example:**
```
User Journey: HCP discovers event
Routes Required:
  - /dashboard/hcp (dashboard)
  - /dashboard/hcp/events (discovery list)
  - /events/[id] (event detail - PUBLIC)
  - /events/[id]/register (registration)
  - /dashboard/hcp/tickets (my tickets)
  - /dashboard/hcp/tickets/[id] (ticket detail)
```

#### Step 1.2: Route-to-Component Mapping
```
For each route:
  - What components are needed?
  - What data is required?
  - What user actions are possible?
  - What are the dependencies?
```

**Template:**
```markdown
## Route: /dashboard/hcp/events/[id]

**Purpose:** HCP views event details

**Components Required:**
- EventDetails (main)
- EventCard (related events)
- RegistrationButton
- ShareButton

**Data Required:**
- Event data (from mockData)
- User registration status
- Related events

**User Actions:**
- View details
- Register
- Share
- Navigate to related events

**Dependencies:**
- Event ID from URL params
- Auth context (user role)
- Mock data service
```

#### Step 1.3: Route Protection & Auth
```
For each route:
  - Is it public or protected?
  - What role(s) can access?
  - What redirects are needed?
```

---

### Phase 2: Exhaustive Planning & Architecture

**Goal:** Create complete implementation plan with route-first approach

#### Step 2.1: Route Structure Planning
```
1. Create route tree diagram
2. List all page.tsx files needed
3. List all layout.tsx files needed
4. Identify shared layouts
5. Plan route protection strategy
```

**Route Tree Example:**
```
app/
├── page.tsx (landing)
├── layout.tsx (root)
├── not-found.tsx (404)
├── error.tsx (500)
│
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
│
├── dashboard/
│   ├── layout.tsx (protected)
│   ├── page.tsx (redirect to role)
│   │
│   ├── hcp/
│   │   ├── page.tsx
│   │   ├── events/
│   │   │   └── [id]/page.tsx
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── certificates/
│   │       └── [id]/page.tsx
│   │
│   └── [other roles...]
│
└── events/
    └── [id]/
        ├── page.tsx (public)
        └── register/page.tsx
```

#### Step 2.2: Component Planning (Route-Driven)
```
For each route, plan:
  1. What components are needed?
  2. What components are shared?
  3. What components are route-specific?
  4. Component hierarchy
```

**Key Principle:** Components serve routes, not the other way around

#### Step 2.3: Data Flow Planning
```
For each route:
  1. What data is needed?
  2. Where does data come from?
  3. What state management is needed?
  4. What API calls (or mock data) are required?
```

#### Step 2.4: Navigation Planning
```
1. How do users navigate between routes?
2. What breadcrumbs are needed?
3. What back buttons are needed?
4. What redirects are needed?
```

---

### Phase 3: User Validation & Plan Review

**Goal:** Validate plan before implementation

#### Step 3.1: Route Completeness Check
```
✅ All user journeys have routes
✅ All routes have page.tsx files planned
✅ All routes have components planned
✅ All routes have data sources planned
✅ All routes have navigation planned
```

#### Step 3.2: Component-to-Route Verification
```
For each component:
  ✅ Has a route where it's used
  ✅ Or is intentionally shared/utility
  ✅ Or is intentionally not routed (modal, etc.)
```

#### Step 3.3: Dependency Check
```
✅ Route dependencies identified
✅ Component dependencies identified
✅ Data dependencies identified
✅ Build order determined
```

---

### Phase 4: Implementation (Route-First)

**Goal:** Build routes first, then components

#### Step 4.1: Route Scaffolding
```
1. Create all page.tsx files (even if empty)
2. Create all layout.tsx files
3. Set up route protection
4. Test route navigation
```

**Implementation Order:**
```
Priority 1: Core Routes
  - Landing page (/)
  - Auth routes (/auth/*)
  - Base dashboard (/dashboard)

Priority 2: Role-Specific Routes
  - /dashboard/hcp
  - /dashboard/organizer
  - etc.

Priority 3: Feature Routes
  - /events/[id]
  - /dashboard/hcp/tickets
  - etc.

Priority 4: Nested Routes
  - /dashboard/hcp/events/[id]
  - /dashboard/hcp/tickets/[id]
  - etc.
```

#### Step 4.2: Component Implementation (Route-Driven)
```
For each route:
  1. Implement components needed for that route
  2. Test route with components
  3. Verify navigation works
  4. Move to next route
```

**Key Principle:** One route at a time, complete before moving on

#### Step 4.3: Integration Testing
```
After each route:
  ✅ Route loads without errors
  ✅ Components render correctly
  ✅ Navigation works
  ✅ Data loads correctly
  ✅ User actions work
```

---

### Phase 5: Validation & Gap Analysis

**Goal:** Ensure nothing is missing

#### Step 5.1: Route Inventory Verification
```
1. List all actual routes (file system scan)
2. Compare with planned routes
3. Identify missing routes
4. Identify orphaned components
```

#### Step 5.2: Reference Verification
```
1. Grep for all router.push() calls
2. Verify all targets exist
3. Grep for all href/Link references
4. Verify all targets exist
```

#### Step 5.3: Component Accessibility Check
```
For each component:
  ✅ Has a route, OR
  ✅ Is used in a routed component, OR
  ✅ Is intentionally not routed
```

#### Step 5.4: User Journey Testing
```
Test each user journey:
  1. Start at entry point
  2. Follow complete flow
  3. Verify all routes work
  4. Verify all actions work
```

---

## Cursor-Specific Implementation Strategy

### 1. Create Route Plan Document First

**File:** `docs/ROUTE_PLAN.md`

```markdown
# Route Implementation Plan

## Route Structure
[Complete route tree]

## Route Details
### Route: /dashboard/hcp
- File: src/app/dashboard/hcp/page.tsx
- Components: HCPView
- Data: User profile, events
- Protection: HCP role required
- Status: [ ] Planned [ ] Scaffolded [ ] Implemented [ ] Tested

[Repeat for each route]
```

### 2. Use Cursor Rules for Route-First Development

**File:** `.cursorrules` or `docs/cursor-rules.md`

```markdown
## Route-First Development Rules

1. **Always create route structure first**
   - Create page.tsx files before components
   - Test route navigation before component implementation

2. **Component planning is route-driven**
   - Components are created to serve routes
   - Every component must have a route where it's used

3. **Route verification checklist**
   - [ ] Route file exists (page.tsx)
   - [ ] Route is accessible via navigation
   - [ ] Route protection is configured
   - [ ] Components are implemented
   - [ ] Data loading works
   - [ ] User actions work

4. **Never assume routes exist**
   - Always verify route exists before using
   - Always check route references (router.push, href, Link)
   - Always verify redirect targets

5. **Systematic route inventory**
   - After each phase, inventory all routes
   - Compare planned vs actual
   - Identify gaps immediately
```

### 3. Use Cursor Composer with Route Plan

**Workflow:**
```
1. Reference @ROUTE_PLAN.md
2. Select route to implement
3. Create page.tsx file first
4. Implement components for that route
5. Test route
6. Update ROUTE_PLAN.md status
7. Move to next route
```

### 4. Create Route Verification Commands

**File:** `scripts/verify-routes.ts`

```typescript
// Script to verify all routes exist
// Run after each implementation phase
```

---

## Planning Template for UX/UI Implementation

### Template: Route Implementation Plan

```markdown
# [Feature Name] Route Implementation Plan

## User Journeys
1. [Journey description]
   - Entry: [route]
   - Steps: [routes]
   - Exit: [route]

## Route Structure
```
[Route tree]
```

## Route Details

### Route: [path]
- **File:** [file path]
- **Purpose:** [what user does here]
- **Components:**
  - [Component 1] - [purpose]
  - [Component 2] - [purpose]
- **Data Required:**
  - [Data source 1]
  - [Data source 2]
- **User Actions:**
  - [Action 1] → [result/route]
  - [Action 2] → [result/route]
- **Protection:** [public/protected/role]
- **Dependencies:** [other routes/components]
- **Status:** [ ] Planned [ ] Scaffolded [ ] Implemented [ ] Tested

## Implementation Order
1. [Route 1] - [reason for priority]
2. [Route 2] - [reason for priority]
3. [Route 3] - [reason for priority]

## Verification Checklist
- [ ] All routes have page.tsx files
- [ ] All routes are accessible via navigation
- [ ] All route references (router.push, href) resolve
- [ ] All components have routes where used
- [ ] All user journeys are testable
- [ ] Route protection is configured
- [ ] Error handling is in place
```

---

## Anti-Patterns to Avoid

### ❌ Component-First Development
```
Bad: Build components → Hope routes appear
Good: Plan routes → Build components for routes
```

### ❌ Assumption-Based Planning
```
Bad: "Components exist, so routes must exist"
Good: "Verify routes exist, then verify components"
```

### ❌ Build Success = Completeness
```
Bad: "It builds, so it's complete"
Good: "It builds AND all routes work AND all journeys work"
```

### ❌ Partial Route Planning
```
Bad: Plan only main routes, assume nested routes
Good: Plan complete route tree, including nested routes
```

### ❌ No Route Verification
```
Bad: Build and hope
Good: Build, verify, test, iterate
```

---

## Success Criteria

### Route Implementation is Complete When:

1. ✅ **All planned routes exist**
   - Every route in plan has page.tsx file
   - No missing routes

2. ✅ **All route references resolve**
   - All router.push() targets exist
   - All href/Link targets exist
   - All redirects work

3. ✅ **All components are accessible**
   - Every component has a route (or is used in routed component)
   - No orphaned components

4. ✅ **All user journeys work**
   - Can complete each journey end-to-end
   - No broken links
   - No 404 errors

5. ✅ **Route protection works**
   - Protected routes require auth
   - Role-based routing works
   - Redirects work correctly

6. ✅ **Error handling is in place**
   - 404 page exists
   - Error boundaries exist
   - Broken links handled gracefully

---

## Implementation Checklist

### Before Starting Implementation:
- [ ] Route plan document created
- [ ] All routes planned and documented
- [ ] Route tree diagram created
- [ ] Component-to-route mapping complete
- [ ] Data flow planned
- [ ] Navigation flow planned
- [ ] Route protection strategy defined

### During Implementation:
- [ ] Create route files first (page.tsx)
- [ ] Test route navigation
- [ ] Implement components for route
- [ ] Test route with components
- [ ] Update route plan status
- [ ] Verify no broken references

### After Implementation:
- [ ] Route inventory verification
- [ ] Reference verification (grep router.push, href)
- [ ] Component accessibility check
- [ ] User journey testing
- [ ] Gap analysis
- [ ] Documentation update

---

## Tools & Scripts

### Route Verification Script
```bash
# Find all routes
find src/app -name "page.tsx" -type f

# Find all route references
grep -r "router.push\|href=\|Link.*to" src/

# Find broken references (manual check)
```

### Route Planning Template
See `docs/templates/ROUTE_PLAN_TEMPLATE.md`

### Cursor Rules
See `.cursorrules` or `docs/cursor-rules.md`

---

## References

1. **Five-Phase Workflow** - rulebook-ai methodology
2. **Explore-Plan-Code** - Claude Code workflow
3. **Route-First Development** - Next.js best practices
4. **Systematic Planning** - AI coding assistant best practices

---

## Key Takeaways

1. **Route-first, not component-first**
   - Plan routes before components
   - Build routes before components
   - Verify routes before claiming completion

2. **Systematic planning required**
   - Don't assume routes exist
   - Don't assume components = pages
   - Always verify systematically

3. **Route inventory is critical**
   - List all routes
   - Verify all references
   - Check component accessibility

4. **User journey focus**
   - Plan complete journeys
   - Test complete journeys
   - Verify journeys work end-to-end

5. **Documentation is essential**
   - Route plan document
   - Status tracking
   - Gap analysis

---

**Last Updated:** 2024  
**Status:** Planning methodology for AI-assisted coding with Cursor IDE

