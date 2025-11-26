# AI Coding User Rules - Global Best Practices

These are global rules for effective AI-assisted development with Cursor. Apply these practices across all projects.

## Workflow Principles

### Plan → Act → Review Cycle
1. **Plan Phase**: Keep agent in discussion mode, provide context through documentation
2. **Act Phase**: Execute plan while monitoring; halt if problems arise
3. **Review Phase**: Thoroughly review output; make corrections directly or ask agent

### Time Allocation (40/20/40 Framework)
- 40% setting up prompt and context
- 20% waiting for code generation
- 40% reviewing and verifying code

## Documentation Structure

Maintain these essential documentation files in every project:

| File | Purpose |
|------|---------|
| `project-overview.md` | Core vision, goals, high-level explanation |
| `requirements.md` | Functional and technical requirements |
| `project-structure.md` | System blueprint, database structure, data flow |
| `tech-stack.md` | Technology choices with justifications |
| `features.md` | Feature deep-dives with edge cases |
| `implementation.md` | Development approach, coding standards |
| `user-flow.md` | Complete user and data journeys |

## PRD Best Practices

### Structure PRDs with:
- **Problem Statement**: Clear problem articulation, measurable objectives, KPIs
- **User Stories**: Format: "As a [user type], I want [capability] so that [benefit]"
- **Acceptance Criteria**: Bullet points, testable conditions
- **Constraints**: Technical/business non-negotiables in separate section
- **Technical Specs**: Architecture, data models, APIs, algorithms in plain language

### PRD Template
```markdown
# [Project Name] PRD

## Overview
- Project Description
- Goals and Objectives
- Success Criteria

## User Requirements
- User Personas
- User Stories
- Use Cases

## Technical Requirements
- Architecture
- APIs
- Data Models
- Security

## Design Requirements
- UI/UX Guidelines
- Wireframes

## Timeline
- Phases
- Milestones
- Dependencies

## Success Metrics
- KPIs
- Measurement Plan
```

## Cursor Rules Best Practices

### 10 Tips for Effective Rules:
1. Choose right rule type (Always/Auto Attached/Agent Requested)
2. Start with high-level overview
3. Specify essential code elements (SDK versions, imports, error handling)
4. Mark deprecated patterns explicitly
5. Create example patterns with descriptions
6. Include verification steps
7. Organize by category/feature
8. Test thoroughly with edge cases
9. Document common pitfalls
10. Keep rules updated with project changes

## AGENTS.md Standard

Create `AGENTS.md` in project root with:
- Build & Test commands
- Architecture Overview
- Security (auth flows, API keys)
- Git Workflows
- Conventions & Patterns

For monorepos, use nested `AGENTS.md` files (closest file takes precedence).

## Context Management

### Documentation Strategy
- Include PRD in project repository (Cursor indexes by default)
- Use `PR.md` pattern: maintain PR file with issue instructions and implementation checklist
- Store context in markdown files (e.g., `docs/temp/feature-design.md`, `current-state.md`)
- Update context files before ending chat sessions
- Add context files when starting new chats

## Task Breakdown

### Test-Driven Development with AI
1. Start with failing test as checkpoint
2. Implement feature with test as success metric
3. Wait to add more tests until interface is stable
4. Use test as feedback loop

### Task Structure
- Plan first, then divide into incremental tasks
- Keep tasks straightforward and simple
- Focus on iterative tasks (AI performs better with focused objectives)
- Create focused integration tests for each design document step

## Types and Reliability

- **Types are critical**: Define all types correctly (request, response, component, database)
- Types act as anchors, reducing hallucination
- Complete type definitions leave little room for errors

## Specification Templates (CARE Framework)

Every specification needs:
1. **Context**: Background, purpose, assumptions
2. **Action**: Functional requirements + few-shot examples (2-3 scenarios)
3. **Result**: Output specs and acceptance criteria (measurable, testable)
4. **Evaluation**: Validation, non-functional requirements, testing

## Common Mistakes to Avoid

- **Vague PRDs**: Make requirements actionable with specific acceptance criteria
- **PRD Not Accessible**: Ensure PRD is in repository, not excluded by `.cursorignore`
- **Overloading Rules**: Keep rules focused; too many consume context and cause contradictions
- **Conflicting Instructions**: Ensure consistency between PRD and rules
- **No Verification**: Always review AI code; write unit tests for acceptance criteria

## Quick Reference Checklist

### Documentation & Planning
- [ ] Use AI to document (10x cost reduction)
- [ ] Leverage AI for planning
- [ ] Reference examples explicitly
- [ ] Persist large change plans to disk

### Session Management
- [ ] Commit code frequently
- [ ] Keep chat sessions short
- [ ] Start fresh chats for each issue/task

### Task Structure
- [ ] Plan first, then divide into tasks
- [ ] Keep tasks simple and straightforward
- [ ] Focus on iterative, focused objectives

### Coding Approach
- [ ] Maintain consistent code style
- [ ] Avoid clever solutions (prefer boring code)
- [ ] Use well-known idioms
- [ ] Use AI for test generation/modification

