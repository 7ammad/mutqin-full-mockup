# Cursor Plan Mode Guide
## Power User Implementation Planning

**Status:** Active Feature (Beta)  
**Last Updated:** 2025  
**Reference:** Cursor Official Documentation

---

## What is Plan Mode?

**Plan Mode** is a Cursor feature that helps break down complex tasks into manageable, structured steps. It's designed for power users who need comprehensive implementation planning before execution.

### Key Features:
- ✅ Automatically creates to-do lists for intricate tasks
- ✅ Establishes dependencies between tasks
- ✅ Updates the list in real-time as work progresses
- ✅ Marks completed tasks automatically
- ✅ Researches context files
- ✅ Performs web searches when needed
- ✅ Creates structured plan documents
- ✅ **Read-only mode** - No code execution, only planning

---

## How to Activate Plan Mode

### Method 1: Command Prompt
Simply ask Cursor to create an implementation plan:

```
"Create an implementation plan for [your feature/task]"
```

**Examples:**
- "Create an implementation plan for a user management system"
- "Create an implementation plan for adding authentication to the login page"
- "Create an implementation plan for refactoring the payment processing flow"

### Method 2: Keyboard Shortcut
- Press `Shift+Tab` to toggle Plan Mode on/off
- Or use `Cmd+M` (Mac) / `Ctrl+M` (Windows/Linux) to open command palette and select Plan Mode

### Method 3: Explicit Request
```
"Plan mode: [describe what you want to plan]"
```

---

## Power User Prompt Template

### Basic Template
```
Create a comprehensive implementation plan for [FEATURE/TASK NAME].

Context:
- Current state: [describe current implementation]
- Requirements: [list key requirements]
- Constraints: [any technical/business constraints]
- Timeline: [if applicable]

Please:
1. Analyze the existing codebase
2. Research best practices
3. Create a structured, phased approach
4. Identify dependencies between tasks
5. List all files that need to be created/modified
6. Provide verification steps
7. Identify potential risks

Do NOT execute code - only create the plan.
```

### Advanced Template (For Complex Projects)
```
I need a comprehensive implementation plan for [FEATURE/TASK].

**Project Context:**
- Project Type: [e.g., Next.js 16, TypeScript, React 19]
- Current Architecture: [describe current structure]
- Design System: [mention if using specific design system]
- Key Dependencies: [list important libraries/frameworks]

**Requirements:**
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

**Constraints:**
- [Constraint 1]
- [Constraint 2]

**Success Criteria:**
- [How to verify completion]
- [Performance targets]
- [Quality gates]

**Please:**
1. Search the codebase to understand current patterns
2. Research industry best practices for similar features
3. Create a phased implementation plan with:
   - Phase overview
   - Detailed task breakdown
   - File-level changes
   - Dependencies between phases
   - Testing strategy
   - Risk assessment
4. Identify reusable components/utilities
5. Suggest performance optimizations
6. Consider accessibility and internationalization

**Output Format:**
- Markdown document with clear sections
- Task list with dependencies
- File structure changes
- Code examples (if helpful for understanding)

Do NOT write or execute code - only planning.
```

---

## Example: Your Project Context

### For Your Event Management Platform

```
Create a comprehensive implementation plan for [FEATURE NAME] in our CME event management platform.

**Project Context:**
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, Tailwind CSS v4, shadcn/ui
- Design System: Apple Liquid Glass (iOS 18+)
- State Management: React Context + Zustand
- Personas: HCP, Organizer, Event Manager, Vendor, Regulator (5 personas)
- Bilingual: Arabic (RTL) + English
- Dark Mode: Full support

**Current Architecture:**
- Component structure: `/components/[persona]/` + `/components/ui/`
- Context: PersonaContext, LanguageContext
- Mock Data: `/lib/mockData.ts`
- Design System: LiquidGlassCard, GlassButton, Apple semantic colors

**Requirements:**
[Your specific requirements here]

**Constraints:**
- No backend calls (mock data only)
- Must use Apple Liquid Glass design system
- Must support RTL/Arabic
- Must be mobile-responsive
- Performance: < 3s load, < 100ms interaction

**Please:**
1. Analyze existing components in `/components/[persona]/`
2. Research best practices for [feature type]
3. Create phased plan aligned with our implementation structure
4. Identify which persona(s) this affects
5. List all components to create/modify
6. Consider design system compliance
7. Include mobile optimization steps
8. Add accessibility considerations

**Output:**
- Structured markdown plan
- Task breakdown with dependencies
- File structure changes
- Component specifications

Do NOT execute - only plan.
```

---

## Plan Mode Workflow

### Step-by-Step Process

1. **Activate Plan Mode**
   ```
   "Create an implementation plan for [feature]"
   ```

2. **AI Analysis Phase**
   - Searches codebase for relevant files
   - Analyzes existing patterns
   - Researches best practices (web search)
   - Understands dependencies

3. **Plan Generation**
   - Creates structured markdown document
   - Breaks down into phases/tasks
   - Identifies file changes
   - Lists dependencies

4. **Review & Approval**
   - Review the generated plan
   - Ask questions or request modifications
   - Approve when ready

5. **Exit Plan Mode**
   ```
   /exit-plan-mode
   ```
   Or: "Exit plan mode and start implementation"

6. **Execution**
   - Switch to Agent Mode or Manual Mode
   - Begin implementing based on the plan

---

## Plan Mode vs Other Modes

| Mode | Purpose | Can Execute Code | Best For |
|------|---------|------------------|----------|
| **Plan Mode** | Structured planning | ❌ No | Complex features, refactoring, architecture decisions |
| **Agent Mode** | Autonomous execution | ✅ Yes | Implementing approved plans, routine tasks |
| **Ask Mode** | Read-only analysis | ❌ No | Understanding codebase, debugging analysis |
| **Manual Mode** | Direct editing | ✅ Yes | Quick fixes, precise edits |

---

## Best Practices for Plan Mode

### 1. Provide Rich Context
- Reference existing files: `@file.tsx`
- Mention related features: `@component.tsx`
- Include project documentation: `@Docs/PROJECT_BLUEPRINT.md`

### 2. Be Specific
❌ Bad: "Add search functionality"  
✅ Good: "Add global search component that searches across events, users, and certificates with autocomplete, filters, and search history"

### 3. Reference Existing Patterns
```
"Create an implementation plan for [feature] following the same patterns used in @EventCard.tsx and @Dashboard.tsx"
```

### 4. Include Constraints
```
"Plan must:
- Use Apple Liquid Glass design system
- Support RTL/Arabic
- Be mobile-responsive
- Follow existing component structure"
```

### 5. Request Phased Approach
```
"Break down into phases:
- Phase 1: Foundation (Week 1)
- Phase 2: Core Features (Week 2)
- Phase 3: Polish (Week 3)"
```

---

## Example Prompts for Your Project

### For Adding New Persona Feature
```
Create an implementation plan for adding [FEATURE] to the [PERSONA] portal.

Context:
- Existing persona views: @components/[persona]/[Persona]View.tsx
- Design system: Apple Liquid Glass (see @Docs/IOS_DESIGN_SYSTEM.md)
- Mock data structure: @lib/mockData.ts
- Current implementation plan: @Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md

Requirements:
[Your requirements]

Please create a phased plan that:
1. Follows existing component patterns
2. Uses LiquidGlassCard and GlassButton
3. Integrates with PersonaContext
4. Supports Arabic/English
5. Includes mobile optimization
```

### For Refactoring
```
Create an implementation plan for refactoring [COMPONENT/FEATURE].

Current implementation: @path/to/current.tsx
Target architecture: [describe desired structure]
Design system compliance: Must use Apple colors and glass effects

Please:
1. Analyze current code
2. Identify refactoring opportunities
3. Create migration plan
4. Ensure no breaking changes
5. Update all related components
```

### For Performance Optimization
```
Create an implementation plan for optimizing [FEATURE] performance.

Current performance: [metrics if known]
Target: < 3s load, < 100ms interaction
Framework: Next.js 16 App Router

Please:
1. Analyze current implementation
2. Identify bottlenecks
3. Plan code splitting strategy
4. Optimize images/assets
5. Add performance monitoring
```

---

## Plan Output Structure

A good plan should include:

### 1. Overview
- What we're implementing
- Why it's needed
- High-level approach

### 2. Current State Analysis
- What exists now
- What's missing
- Key constraints

### 3. Desired End State
- Specification of final state
- How to verify completion
- Success criteria

### 4. Implementation Phases
- Phase 1: [Name]
  - Overview
  - Tasks with dependencies
  - Files to create/modify
  - Verification steps
- Phase 2: [Name]
  - ...

### 5. File Structure Changes
```
New files:
- src/components/[persona]/NewComponent.tsx
- src/lib/newUtility.ts

Modified files:
- src/components/[persona]/ExistingComponent.tsx
- src/lib/mockData.ts
```

### 6. Dependencies
- Task A must complete before Task B
- Component X depends on Component Y

### 7. Testing Strategy
- Unit tests
- Integration tests
- Manual testing checklist

### 8. Risks & Mitigation
- Potential issues
- How to address them

---

## Exiting Plan Mode

### Command
```
/exit-plan-mode
```

Or simply:
```
"Exit plan mode and start implementing Phase 1"
```

### What Happens
- Plan Mode restrictions are removed
- You can now execute code
- Switch to Agent Mode for autonomous execution
- Or use Manual Mode for direct editing

---

## Tips for Power Users

1. **Chain Plans**: Create a master plan, then detailed plans for each phase
2. **Reference Plans**: Use `@Docs/IMPLEMENTATION_PLAN.md` in future planning
3. **Iterate**: Refine plans based on discoveries during implementation
4. **Document Decisions**: Ask Plan Mode to document architectural decisions
5. **Risk Assessment**: Always request risk analysis for complex features

---

## Integration with Your Workflow

### Recommended Workflow

1. **Planning Phase**
   ```
   "Create implementation plan for [feature]"
   → Review plan
   → Refine if needed
   → Approve
   ```

2. **Implementation Phase**
   ```
   /exit-plan-mode
   "Implement Phase 1 of the approved plan"
   → Agent Mode executes
   → Review changes
   → Continue to Phase 2
   ```

3. **Documentation Phase**
   ```
   "Update @Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md with completed tasks"
   ```

---

## Resources

- **Official Docs**: https://docs.cursor.com/agent/planning
- **Cursor Forum**: https://forum.cursor.com
- **Your Project Docs**: 
  - `@Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md`
  - `@Docs/MARKETPLACE_UX_UI_BEST_PRACTICES_ANALYSIS.md`
  - `@Docs/EXTENDED_BLUEPRINT_WITH_EVENT_MANAGERS.md`

---

**Ready to Use?** Try this prompt:

```
Create a comprehensive implementation plan for [YOUR FEATURE] following the structure and patterns in @Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md. Use Apple Liquid Glass design system and ensure mobile-first, bilingual support.
```

---

**Document Status:** Ready to Use  
**Last Updated:** 2025

