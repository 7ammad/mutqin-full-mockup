# Project Rules

## Workflow: Plan → Act → Review

- For complex features, ALWAYS plan first in `Docs/` before writing code
- Break large features into smaller, focused subtasks
- Complete one task fully before starting the next
- Treat all AI-generated code as draft; verify before accepting

## Documentation

- Create planning docs in `Docs/` folder before implementing complex features
- Update `Docs/STACK_OVERVIEW.md` and `Docs/ROUTE_IMPLEMENTATION_PLAN.md` as needed
- Store temporary context in `Docs/` (e.g., `feature-design.md`, `current-state.md`)
- Before ending chat sessions, update relevant documentation files

## Code Standards

- Define ALL types (request, response, component, database) before implementation
- For new features, start with failing tests as checkpoints
- Match existing code style exactly
- Prefer straightforward, maintainable code over clever solutions
- Include error handling, validation, and edge case handling in all generated code

## Task Execution

- Complete current task fully before starting next task
- For frontend features, create routes first, then components
- Build features incrementally; verify each step before proceeding
- Keep chat sessions focused on single issues/tasks

## Specifications (CARE Framework)

When creating specifications, you MUST include:
- Context: Background, purpose, architecture decisions
- Action: Functional requirements with 2-3 concrete examples
- Result: Measurable, testable acceptance criteria
- Evaluation: Validation requirements, testing approaches

## File Organization

- NEVER create documentation or analysis files in project root
- All docs go in `Docs/` folder
- Only allowed root files: `README.md`, `CHANGELOG.md`, config files, system files
- If unsure where a file belongs, ask the user before creating

## Session Management

- For large changes, persist plans to disk in `Docs/` before starting
- Start fresh chat sessions for each new issue/task to prevent context drift

## PRD Requirements

When user requests features, ensure requirements include:
- Specific, actionable acceptance criteria (not vague statements)
- User stories in format: "As a [user type], I want [capability] so that [benefit]"
- Technical constraints and non-negotiables in separate section
- Edge cases and error scenarios explicitly listed

## Code Review

- Always include verification steps in generated code
- Write unit tests for each acceptance criterion
- Review AI-generated code thoroughly before accepting
- Ensure consistency between documentation and implementation





