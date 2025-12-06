# UI/UX Best Practices with AI Coding Agents

## Core Principles

### 1. Component-First Approach
- **Start with existing components** - Read similar components before creating new ones
- **Follow design system patterns** - Use established components (shadcn/ui, your design system)
- **Maintain consistency** - Match existing styling, structure, and naming conventions

### 2. Iterative Design Process
```
1. Provide wireframe/mockup → AI implements initial version
2. Review and provide feedback → AI iterates
3. Test and refine → Repeat until perfect
```

### 3. Clear Specifications
- **Provide visual references** - Screenshots, wireframes, or design mockups
- **Specify design tokens** - Use existing design system tokens, don't invent new ones
- **Define responsive breakpoints** - Consistent with existing patterns
- **List required components** - Explicitly state which components to use

### 4. Code Patterns for AI

**Pattern Matching:**
```
"Generate a [component type] following this pattern:
[paste example component]

Requirements:
- Maintain consistent styling and structure
- Follow same pattern for props and state
- Use same error handling and validation
- Match coding conventions and naming"
```

**Visual Implementation:**
```
"Implement this wireframe using our existing design system:
- Use only current design tokens and components
- Maintain visual hierarchy
- Fully responsive with consistent breakpoints
- Act as both Designer and Engineer"
```

### 5. Task Management
- **Break down complex UI** - Use TodoWrite for multi-step component development
- **Track progress** - Build → Test → Document phases
- **One component at a time** - Complete fully before moving to next

### 6. Error Prevention
- **Check dependencies first** - Examine imports and package.json
- **Follow conventions** - Match existing code style
- **Test immediately** - Run test suite after changes
- **Type safety** - Ensure proper TypeScript interfaces

### 7. File Operations
- **Prefer editing** existing files over creating new ones
- **Read files first** to understand context
- **Follow naming conventions** established in codebase
- **Use MultiEdit** for multiple changes in same file

### 8. Design System Integration
- **Use component library** - shadcn/ui, Tailwind CSS utilities
- **Leverage existing patterns** - Don't reinvent common UI patterns
- **Maintain consistency** - Visual hierarchy, spacing, typography
- **Mobile-first** - Responsive design from the start

## Workflow

1. **Plan** - Define component structure and requirements
2. **Reference** - Show AI existing similar components
3. **Implement** - Generate code following patterns
4. **Test** - Verify rendering and interactions
5. **Iterate** - Refine based on feedback
6. **Document** - Update component docs

## Common Mistakes to Avoid

- ❌ Creating new components when similar ones exist
- ❌ Using custom styles instead of design tokens
- ❌ Skipping responsive design considerations
- ❌ Not testing after implementation
- ❌ Ignoring existing code patterns
- ❌ Vague specifications without examples

















