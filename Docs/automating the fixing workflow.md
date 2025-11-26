# 🎯 **APPROACH 3: HYBRID - COMPLETE IMPLEMENTATION GUIDE**

## ✅ **YES! Just Give This to Cursor**

Copy everything below and paste into **Cursor Composer (Cmd+I / Ctrl+I)**. Cursor will create all files and set everything up automatically.

***

## 📋 **PASTE THIS INTO CURSOR COMPOSER**

```
🎯 TASK: Implement Complete TypeScript Validation Workflow (Hybrid Approach)

You will set up a permanent, reusable TypeScript error validation workflow that works across ALL projects.

---

## PHASE 1: Create Global Template Repository

**Location:** ~/cursor-typescript-template/

Create this directory structure and files:

### File 1: `.cursor/rules/error-fixing.mdc`

```
***
title: TypeScript Error Fixing Protocol
description: Automated error detection and fixing workflow
tags: [typescript, debugging, validation]
alwaysApply: true
globs: ["src/**/*.ts", "src/**/*.tsx", "*.ts", "*.tsx", "**/*.ts", "**/*.tsx"]
***

# TypeScript Error Fixing Protocol

## Auto-Validation After Code Changes

After implementing code, automatically suggest:
"Validate TypeScript: npm run type-check (or tsc --noEmit)"

## Error-Fixing Workflow

When TypeScript errors are found:

### 1. Detection Phase
Suggest running:
- `tsc --noEmit` (standard TypeScript check)
- `npm run type-check` (if script exists)
- `next typegen && tsc --noEmit` (for Next.js)

### 2. Categorization Phase
Group errors by type:
- **Priority 1:** Missing imports (icons, components, types)
- **Priority 2:** Type mismatches (props, arguments)
- **Priority 3:** Complex errors (requires investigation)

Show summary:
"🔍 Found [X] errors across [Y] files:
- P1 (Missing imports): [count]
- P2 (Type mismatches): [count]
- P3 (Complex): [count]

Should we fix these now? Starting with P1..."

### 3. Batch Fixing Phase
- Fix similar errors together (use Composer for 3-5 files)
- Start with highest-priority/highest-count errors
- Validate after each batch
- Regenerate error list if needed

### 4. Validation Loop
After each fix batch:
- Re-run validation
- Check if errors decreased
- Continue until 0 errors
- Final build test

## Fix Patterns (Auto-Apply)

### Missing Imports
**Error:** `Cannot find name 'X'`

**Fix:**
1. Check if X should be imported
2. Find existing import statement from same package
3. Add X to that import (alphabetically)
4. If no import exists, add new import at top

**Example (Lucide React icons):**
```typescript
// Before
import { AlertCircle } from "lucide-react";

// After (adding FileText)
import { AlertCircle, FileText } from "lucide-react";
```

### Type Mismatches
**Error:** `Type 'X' is not assignable to 'Y'`

**Fix:**
1. Review type definitions
2. Identify mismatch (prop name, type, structure)
3. Ask user: "Fix component interface or calling code?"
4. Apply fix
5. Explain what was changed and why

### Prop Errors
**Error:** `Property 'X' does not exist on type 'Y'`

**Fix:**
1. Check component prop interface
2. Check all usages of component
3. Determine correct prop name
4. Update either:
   - Component interface (if prop missing)
   - Calling code (if wrong prop name)
5. Show before/after code

## Communication Protocol

### After Code Changes:
"✅ Code implemented. Ready to validate?

Run: [appropriate command based on project]"

### When Errors Found:
"🔴 Found [X] errors across [Y] files.

Priority breakdown:
- P1 (Missing imports): [X]
- P2 (Type issues): [Y]
- P3 (Complex): [Z]

Should we fix these now? Starting with P1..."

### After Each Batch:
"✅ Fixed [X] files. Re-validating...

Result: [X] errors remaining (decreased by [Y])
Next: [Action]"

### When Complete:
"✅ All TypeScript errors fixed!

Summary:
- Files fixed: [X]
- Errors resolved: [Y]
- Validation: PASSING ✓
- Build: [READY/TESTED/PASS]

Ready for next phase?"

## Rules Enforcement

### 🚫 NEVER Do:
- Skip validation after code changes
- Use `@ts-ignore` to hide errors (explain issue instead)
- Add `any` types (suggest proper types)
- Proceed to next phase with failing validation
- Commit code with TypeScript errors

### ✅ ALWAYS Do:
- Suggest validation after code changes
- Group similar errors for batch fixing
- Use Composer for multi-file fixes
- Use Chat for complex single-file issues
- Explain root cause when fixing complex errors
- Validate incrementally (after each batch)
- Re-validate until 0 errors

## Project Type Detection

Automatically detect project type and suggest appropriate commands:

**Next.js projects** (has `next` in package.json):
- Validation: `npx next typegen && tsc --noEmit`
- Build: `npm run build`

**React/Vite projects** (has `vite` in package.json):
- Validation: `tsc --noEmit`
- Build: `npm run build`

**Node.js projects:**
- Validation: `tsc --noEmit`
- Build: `tsc` or `npm run build`

**Any TypeScript project:**
- Validation: `tsc --noEmit`
- Watch mode: `tsc --noEmit --watch`

## Tool Selection

**Use Composer (Cmd+I) for:**
- Fixing 3-5 files with similar errors
- Batch icon import updates
- Multi-file type corrections
- Applying same pattern across files

**Use Chat (Cmd+L) for:**
- Single complex file with multiple error types
- Investigation and explanation needed
- User wants to review before applying
- Debugging unusual TypeScript issues
```

### File 2: `.cursor/rules/implementation.mdc`

```
***
title: Implementation Phase Workflow
description: Phase completion checklist and validation
tags: [workflow, phases, validation]
alwaysApply: true
***

# Implementation Phase Protocol

## Phase Completion Checklist

After implementing EACH feature/phase:

### 1. Code Review ✅
- [ ] Code matches implementation plan
- [ ] Follows existing patterns
- [ ] Comments added for complex logic
- [ ] No console.logs or debug code left

### 2. TypeScript Validation 🔍
```bash
npm run type-check
```
**Expected: 0 errors**

**If errors found:**
- Stop current work
- Enter error-fixing workflow (use @error-fixing.mdc)
- Fix all errors systematically
- Re-validate
- Only proceed when passing

### 3. Build Validation 🏗️
```bash
npm run build
```
**Expected: Successful build**

**If build fails:**
- Review build output
- Most likely TypeScript errors (run type-check)
- Fix and rebuild
- Only proceed when passing

### 4. Task Tracking 📋
- [ ] Update implementation task tracker
- [ ] Mark current phase complete
- [ ] Document any blockers or notes
- [ ] Update progress counter
- [ ] Move to next phase indicator

### 5. Optional: Commit Changes
```bash
git add .
git commit -m "feat: [phase name] - [brief description]"
```

## Phase Transition Rules

**Before starting NEXT phase:**

✅ Requirements:
1. Previous phase validation passes (0 TypeScript errors)
2. Build test passes
3. Task tracker updated
4. All blockers resolved or documented

❌ DO NOT:
- Skip validation steps
- Proceed with known errors
- Implement multiple phases simultaneously (unless explicitly requested)
- Commit code with errors

## Automatic Workflow Enforcement

After implementing code, automatically:

1. **Remind to validate:**
   "✅ Phase implementation complete. Ready to validate?
   
   Run: npm run type-check"

2. **If validation fails:**
   "🔴 Validation failed. Found [X] errors.
   
   Entering error-fixing workflow..."

3. **After fixing errors:**
   "✅ All errors fixed. Validation passing.
   
   Ready for build test? Run: npm run build"

4. **After successful build:**
   "✅ Build successful!
   
   Phase complete checklist:
   - [x] Code implemented
   - [x] Validation passed
   - [x] Build successful
   - [ ] Task tracker updated
   
   Ready to update tracker?"

5. **After tracker update:**
   "🎉 Phase [X] complete!
   
   Next phase: [Y]
   Ready to begin?"

## Integration with Error Fixing

When validation fails, automatically:
1. Reference error-fixing protocol
2. Categorize errors by priority
3. Guide systematic fixing
4. Re-validate after each batch
5. Prevent proceeding until clean

## This Protocol is ACTIVE

I will enforce this workflow automatically for every phase implementation.
You don't need to remember the steps—I'll guide you through them.
```

### File 3: `.cursorrules`

```
# TypeScript Validation Workflow - Project Template

This is the project-level rules file. It works together with:
- Global User Rules (in Cursor Settings)
- .cursor/rules/ directory (project-specific automation)

***

## Project Context

**Type:** [TypeScript/Next.js/React/Node.js - Auto-detected]
**Validation Command:** [Auto-detected from package.json or defaults to tsc --noEmit]
**Build Command:** [Auto-detected or defaults to npm run build]

***

## Workflow Integration

This project uses the Hybrid TypeScript Validation Workflow:

1. **User Rules (Global):** Provide workflow enforcement across ALL projects
2. **Project Rules (Local):** Provide project-specific context and automation
3. **This File (.cursorrules):** Project-specific overrides and customization

***

## Validation Commands

Available in this project:
- `npm run type-check` - Validate TypeScript without building
- `npm run type-check:watch` - Watch mode for continuous validation
- `npm run build` - Production build with validation

***

## Customization

Add project-specific rules below this line:

***

[Project-specific rules go here]
```

### File 4: `scripts/setup-validation.sh`

```
#!/bin/bash

echo "🚀 Setting up TypeScript validation workflow..."
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "⚠️  No package.json found. This doesn't appear to be a Node.js project."
  echo "   If this is a new project, run: npm init -y"
  exit 1
fi

echo "✅ Node.js project detected"
echo ""

# Backup package.json
echo "📦 Backing up package.json..."
cp package.json package.json.backup

# Check if TypeScript is installed
if ! grep -q '"typescript"' package.json; then
  echo "⚠️  TypeScript not found in dependencies."
  echo "   Install with: npm install --save-dev typescript"
  echo "   Continuing anyway..."
fi

# Add type-check scripts if they don't exist
echo "📝 Checking for validation scripts..."

if ! grep -q '"type-check"' package.json; then
  echo "   Adding type-check script..."
  npm pkg set scripts.type-check="tsc --noEmit"
  npm pkg set scripts.type-check:watch="tsc --noEmit --watch"
  echo "   ✅ Scripts added"
else
  echo "   ✅ Scripts already exist"
fi

# Check for Next.js
if grep -q '"next"' package.json; then
  echo ""
  echo "🎯 Next.js project detected!"
  echo "   Updating type-check for Next.js..."
  npm pkg set scripts.type-check="next typegen && tsc --noEmit"
  echo "   ✅ Next.js validation configured"
fi

# Check for tsconfig.json
if [ ! -f "tsconfig.json" ]; then
  echo ""
  echo "⚠️  No tsconfig.json found."
  echo "   TypeScript needs this file to work properly."
  echo "   Create one with: npx tsc --init"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Available commands:"
echo "   npm run type-check         Validate TypeScript"
echo "   npm run type-check:watch   Watch mode"
echo "   npm run build              Production build"
echo ""
echo "💡 Tip: Run 'npm run type-check' to test validation now"
echo ""
echo "🎉 Your project is ready for Cursor's validation workflow!"
```

### File 5: `scripts/apply-to-current-project.sh`

```
#!/bin/bash

echo "🔄 Applying TypeScript validation workflow to current project..."
echo ""

TEMPLATE_DIR=~/cursor-typescript-template

# Check if template exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "❌ Template not found at: $TEMPLATE_DIR"
  echo "   Please run the setup first to create the template."
  exit 1
fi

# Check if we're in a project directory
if [ ! -d ".git" ] && [ ! -f "package.json" ]; then
  echo "⚠️  This doesn't look like a project directory."
  echo "   Make sure you're in the project root (has .git or package.json)"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Copy template files
echo "📁 Copying template files..."

# .cursor/rules directory
if [ ! -d ".cursor/rules" ]; then
  echo "   Creating .cursor/rules/"
  mkdir -p .cursor/rules
fi

echo "   Copying error-fixing.mdc..."
cp "$TEMPLATE_DIR/.cursor/rules/error-fixing.mdc" .cursor/rules/

echo "   Copying implementation.mdc..."
cp "$TEMPLATE_DIR/.cursor/rules/implementation.mdc" .cursor/rules/

# .cursorrules file (don't overwrite if exists)
if [ ! -f ".cursorrules" ]; then
  echo "   Creating .cursorrules..."
  cp "$TEMPLATE_DIR/.cursorrules" .
else
  echo "   ⚠️  .cursorrules already exists, skipping (not overwriting)"
fi

# scripts directory
if [ ! -d "scripts" ]; then
  echo "   Creating scripts/"
  mkdir -p scripts
fi

echo "   Copying setup script..."
cp "$TEMPLATE_DIR/scripts/setup-validation.sh" scripts/
chmod +x scripts/setup-validation.sh

# docs directory
if [ ! -d "docs" ]; then
  echo "   Creating docs/"
  mkdir -p docs
fi

if [ -f "$TEMPLATE_DIR/docs/cursor-workflow.md" ]; then
  echo "   Copying documentation..."
  cp "$TEMPLATE_DIR/docs/cursor-workflow.md" docs/
fi

echo ""
echo "✅ Template files copied!"
echo ""

# Run validation setup
echo "🔧 Setting up validation scripts..."
bash scripts/setup-validation.sh

echo ""
echo "🎉 Workflow applied to current project!"
echo ""
echo "📋 Next steps:"
echo "   1. Open project in Cursor: cursor ."
echo "   2. Test validation: npm run type-check"
echo "   3. Start coding - Cursor will guide validation automatically"
echo ""
```

### File 6: `docs/cursor-workflow.md`

```
# Cursor TypeScript Validation Workflow

This project is configured with automatic TypeScript validation through Cursor AI.

## Overview

The workflow combines:
- **User Rules (Global):** Applied automatically in Cursor Settings
- **Project Rules (Local):** Stored in `.cursor/rules/` directory
- **Validation Scripts:** Added to `package.json`

## Available Commands

\`\`\`bash
npm run type-check         # Validate TypeScript without building
npm run type-check:watch   # Watch mode for continuous validation
npm run build              # Production build with validation
\`\`\`

## How It Works

### 1. During Development

After implementing code, Cursor automatically:
1. Suggests validation: "Ready to validate? Run: npm run type-check"
2. Detects errors if validation fails
3. Categorizes errors by priority
4. Guides you through systematic fixing
5. Re-validates until 0 errors

### 2. Error Fixing Workflow

When errors are found:

**Detection:** Cursor shows error summary with priorities
\`\`\`
🔍 Found 8 errors across 3 files:
- P1 (Missing imports): 5
- P2 (Type mismatches): 2
- P3 (Complex): 1
\`\`\`

**Fixing:** Cursor fixes similar errors in batches
- Uses Composer for 3-5 files at once
- Uses Chat for complex single-file issues
- Validates after each batch

**Completion:** All errors resolved
\`\`\`
✅ All TypeScript errors fixed!
- Files fixed: 3
- Errors resolved: 8
- Validation: PASSING ✓
\`\`\`

### 3. Phase Completion

After each implementation phase:

1. ✅ Code review
2. 🔍 TypeScript validation (npm run type-check)
3. 🏗️ Build validation (npm run build)
4. 📋 Task tracker update
5. ✅ Ready for next phase

Cursor enforces this checklist automatically.

## Rules Files

### `.cursor/rules/error-fixing.mdc`
- Automatic validation reminders
- Error categorization and prioritization
- Batch fixing workflows
- Communication protocols

### `.cursor/rules/implementation.mdc`
- Phase completion checklists
- Build validation
- Task tracking integration
- Phase transition rules

### `.cursorrules`
- Project-specific overrides
- Custom rules for this project
- Context information

## Customization

### Add Project-Specific Rules

Edit `.cursorrules`:
\`\`\`markdown
## Custom Rule: [Your Rule Name]

[Your rule description and instructions]
\`\`\`

### Adjust Workflow

Edit `.cursor/rules/*.mdc` files to modify:
- Validation commands
- Error priorities
- Communication style
- Workflow steps

## For Teams

### Initial Setup (One-Time per Developer)

Each team member should configure User Rules in Cursor once:
1. Open Cursor Settings (Cmd+,)
2. Go to: Rules for AI
3. Add global validation workflow rules
4. Save

### Project Setup (Automatic)

Project rules are committed to git:
- `.cursor/` directory
- `.cursorrules` file
- `scripts/` validation scripts

When team members clone the project, everything works automatically.

## Troubleshooting

### "Validation command not found"

Run setup again:
\`\`\`bash
bash scripts/setup-validation.sh
\`\`\`

### "TypeScript not installed"

Install TypeScript:
\`\`\`bash
npm install --save-dev typescript
npx tsc --init  # Creates tsconfig.json
\`\`\`

### "Cursor not suggesting validation"

Check User Rules are configured:
1. Cursor Settings → Rules for AI
2. Verify global rules are present
3. Restart Cursor if needed

## Learn More

- [Cursor Rules Documentation](https://cursor.com/docs/context/rules)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript) (if using Next.js)
```

### File 7: `README.md`

```
# Cursor TypeScript Validation Template

A complete, reusable workflow for automatic TypeScript validation in Cursor AI.

## Features

✅ Automatic validation reminders after code changes  
✅ Error detection and categorization by priority  
✅ Batch fixing workflows (3-5 files at once)  
✅ Phase completion checklists  
✅ Pre-configured npm scripts  
✅ Works across all TypeScript projects  
✅ Team-shareable via git  

## Quick Start

### For New Projects

\`\`\`bash
# Using shell alias (if configured):
cursor-init my-new-project

# Or manually:
cp -r ~/cursor-typescript-template/.cursor my-new-project/
cp -r ~/cursor-typescript-template/scripts my-new-project/
cp ~/cursor-typescript-template/.cursorrules my-new-project/
cd my-new-project
bash scripts/setup-validation.sh
\`\`\`

### For Existing Projects

\`\`\`bash
cd your-existing-project
bash ~/cursor-typescript-template/scripts/apply-to-current-project.sh
\`\`\`

## What Gets Created

\`\`\`
your-project/
├── .cursor/
│   └── rules/
│       ├── error-fixing.mdc      # Error detection & fixing workflow
│       └── implementation.mdc     # Phase completion protocol
├── scripts/
│   └── setup-validation.sh       # Auto-setup validation scripts
├── docs/
│   └── cursor-workflow.md        # Documentation
└── .cursorrules                   # Project-specific rules
\`\`\`

## How It Works

### 1. User Rules (Global)
Configured once in Cursor Settings → applies to ALL projects

### 2. Project Rules (Local)
Stored in `.cursor/rules/` → specific to each project → committed to git

### 3. Validation Scripts
Added to `package.json`:
- `npm run type-check` - Validate TypeScript
- `npm run type-check:watch` - Watch mode
- Auto-detects Next.js, React, Node.js

## Usage

After implementing code:

1. Cursor suggests: "Ready to validate?"
2. Run: `npm run type-check`
3. If errors: Cursor enters fix workflow
4. Errors categorized by priority
5. Cursor fixes in batches
6. Re-validates until 0 errors
7. Build test
8. Phase complete

## Shell Alias (Optional)

Add to `~/.zshrc` or `~/.bashrc`:

\`\`\`bash
cursor-init() {
  mkdir "$1" && cd "$1"
  cp -r ~/cursor-typescript-template/{.cursor,scripts,docs,.cursorrules} .
  [ -f scripts/setup-validation.sh ] && bash scripts/setup-validation.sh
  git init
  echo "✅ Project initialized with Cursor workflow!"
}
\`\`\`

Reload: `source ~/.zshrc`

Usage: `cursor-init my-project`

## Team Setup

### Individual Setup (One-Time)
Each developer configures User Rules once:
1. Open Cursor
2. Settings → Rules for AI
3. Add global validation workflow
4. Save

### Project Setup (Automatic)
Project rules are committed to git:
- Team clones repository
- `.cursor/rules/` and scripts are included
- Workflow active immediately

## Customization

### Adjust Workflow
Edit `.cursor/rules/*.mdc` files to modify:
- Validation commands
- Error priorities
- Communication style

### Add Project Rules
Edit `.cursorrules` for project-specific overrides

## Commands

\`\`\`bash
# Validation
npm run type-check         # Check TypeScript
npm run type-check:watch   # Watch mode

# Build
npm run build              # Production build

# Setup
bash scripts/setup-validation.sh              # Add validation scripts
bash scripts/apply-to-current-project.sh      # Apply to existing project
\`\`\`

## Files Explained

| File | Purpose | Committed? |
|------|---------|-----------|
| `.cursor/rules/error-fixing.mdc` | Error workflow automation | ✅ Yes (git) |
| `.cursor/rules/implementation.mdc` | Phase completion checklist | ✅ Yes (git) |
| `.cursorrules` | Project overrides | ✅ Yes (git) |
| `scripts/setup-validation.sh` | Auto-add npm scripts | ✅ Yes (git) |
| `docs/cursor-workflow.md` | Documentation | ✅ Yes (git) |
| User Rules (Cursor Settings) | Global workflow | ❌ No (per-user) |

## Benefits

### For Solo Developers
- ✅ Consistent workflow across all projects
- ✅ Automatic error prevention
- ✅ Faster debugging
- ✅ Zero-config for new projects

### For Teams
- ✅ Shared workflow via git
- ✅ Onboarding: Set User Rules once
- ✅ Consistent code quality
- ✅ Reduced review cycles

## Learn More

- [Cursor Rules Documentation](https://cursor.com/docs/context/rules)
- [Workflow Guide](docs/cursor-workflow.md)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

MIT - Use freely in any project

***

**Created:** [Date]  
**Version:** 1.0  
**Cursor AI:** Optimized for Cursor AI workflows
\`\`\`

***

## PHASE 2: Apply to Current Project

After creating the template, apply it to the CURRENT project:

1. Copy `.cursor/rules/` directory to current project
2. Copy `scripts/` directory to current project
3. Copy `.cursorrules` to current project root (if doesn't exist)
4. Run `scripts/setup-validation.sh` to add npm scripts
5. Create `docs/cursor-workflow.md` for documentation

***

## PHASE 3: Setup Shell Alias (Optional)

Add this to `~/.zshrc` or `~/.bashrc`:

\`\`\`bash
# Cursor TypeScript Project Initializer
cursor-init() {
  if [ -z "$1" ]; then
    echo "Usage: cursor-init <project-name>"
    return 1
  fi
  
  echo "🚀 Creating Cursor-enabled TypeScript project: $1"
  
  mkdir "$1"
  cd "$1"
  
  # Copy template
  cp -r ~/cursor-typescript-template/.cursor .
  cp -r ~/cursor-typescript-template/scripts .
  cp -r ~/cursor-typescript-template/docs .
  cp ~/cursor-typescript-template/.cursorrules .
  
  # Initialize git
  git init
  
  # Setup validation
  if [ -f "scripts/setup-validation.sh" ]; then
    bash scripts/setup-validation.sh
  fi
  
  echo ""
  echo "✅ Project initialized with Cursor TypeScript workflow!"
  echo "   Next: cursor ."
}

# Apply template to existing project
cursor-apply-workflow() {
  if [ ! -d ~/cursor-typescript-template ]; then
    echo "❌ Template not found. Run setup first."
    return 1
  fi
  
  echo "🔄 Applying workflow to current project..."
  
  mkdir -p .cursor/rules scripts docs
  
  cp ~/cursor-typescript-template/.cursor/rules/*.mdc .cursor/rules/
  cp ~/cursor-typescript-template/scripts/*.sh scripts/
  chmod +x scripts/*.sh
  
  if [ ! -f .cursorrules ]; then
    cp ~/cursor-typescript-template/.cursorrules .
  fi
  
  if [ -f scripts/setup-validation.sh ]; then
    bash scripts/setup-validation.sh
  fi
  
  echo "✅ Workflow applied! Run: npm run type-check"
}
\`\`\`

Then reload: `source ~/.zshrc` or `source ~/.bashrc`

***

## PHASE 4: Create User Rules (Global)

Show instructions for user to configure Cursor Settings manually:

\`\`\`
⚠️ MANUAL STEP REQUIRED:

I've created all the project files, but you need to configure User Rules (global) in Cursor Settings manually.

Here's how:

1. Open Cursor Settings:
   - Mac: Cmd+, (Comma)
   - Windows: Ctrl+, (Comma)
   
2. Navigate to: General → Rules for AI

3. Click "+ Add Rule"

4. Paste this:

***

# TypeScript Error Validation Workflow (ALL PROJECTS)

## Core Principle
Validate TypeScript errors before and after code changes in ANY project.

## 🔴 Automatic Validation Reminders

After ANY code implementation, automatically remind:
"Would you like to validate? Run: npm run type-check (or tsc --noEmit)"

## 🔄 Error Detection & Fixing Protocol

When TypeScript errors are found:

### 1. Detection Phase
Suggest running:
- `tsc --noEmit` (standard TypeScript check)
- `npm run type-check` (if script exists)
- Project-specific validation command

### 2. Categorization Phase
Group errors by type:
- **Priority 1:** Missing imports (icons, components, types)
- **Priority 2:** Type mismatches (props, arguments)
- **Priority 3:** Complex errors (requires investigation)

### 3. Batch Fixing Phase
- Fix similar errors together (use Composer for 3-5 files)
- Start with highest-priority/highest-count errors
- Validate after each batch
- Regenerate error list if needed

### 4. Validation Loop
After each fix batch:
- Re-run validation
- Check if errors decreased
- Continue until 0 errors
- Final build test

## 📋 Phase Completion Checklist

After implementing ANY feature/phase:

1. [ ] Code implementation complete
2. [ ] TypeScript validation passes (0 errors)
3. [ ] Build test passes (if applicable)
4. [ ] Task tracker updated
5. [ ] Ready for next phase

**Automatically enforce:** Do not proceed to next phase if validation fails.

## 🎯 Fix Patterns (Auto-Apply)

### Missing Imports
**Error:** `Cannot find name 'X'`

**Fix:**
1. Check if X should be imported
2. Add to appropriate import statement
3. Maintain alphabetical order in imports

### Type Mismatches
**Error:** `Type 'X' is not assignable to 'Y'`

**Fix:**
1. Review type definitions
2. Fix at the most logical level (prefer component definition)
3. Explain the fix to user

### Prop Errors
**Error:** `Property 'X' does not exist on type 'Y'`

**Fix:**
1. Check component interface
2. Check calling code
3. Match prop names exactly
4. Update either interface or caller (ask user which)

## 🚫 Never Do

- ❌ Skip validation after code changes
- ❌ Use `@ts-ignore` to hide errors (explain issue instead)
- ❌ Add `any` types (suggest proper types)
- ❌ Proceed to next phase with failing validation
- ❌ Commit code with TypeScript errors

## ✅ Always Do

- ✅ Suggest validation after code changes
- ✅ Group similar errors for batch fixing
- ✅ Use Composer for multi-file fixes
- ✅ Use Chat for complex single-file issues
- ✅ Explain root cause when fixing complex errors
- ✅ Validate incrementally (after each batch)

## 🔧 Project Detection

Automatically detect project type and suggest appropriate commands:

**Next.js projects:**
- Validation: `npx next typegen && tsc --noEmit`
- Build: `npm run build`

**React/Vite projects:**
- Validation: `tsc --noEmit`
- Build: `npm run build`

**Node.js projects:**
- Validation: `tsc --noEmit`
- Build: `npm run build` or `tsc`

**Any TypeScript project:**
- Validation: `tsc --noEmit`
- Watch mode: `tsc --noEmit --watch`

## 💡 Communication Style

### After Code Changes:
"✅ Code implemented. Ready to validate? Run: [appropriate command]"

### When Errors Found:
"🔴 Found [X] errors across [Y] files.
Priority breakdown:
- P1 (Missing imports): [X]
- P2 (Type issues): [Y]
- P3 (Complex): [Z]

Should we fix these now? Starting with P1..."

### After Each Batch:
"✅ Fixed [X] files. Re-validating...
[Result]: [X] errors remaining.
Next: [Action]"

### When Complete:
"✅ All TypeScript errors fixed!
- Files fixed: [X]
- Errors resolved: [Y]
- Validation: PASSING ✓
- Build: [TEST/SKIP/PASS]

Ready for next phase?"

## 🎯 Composer vs Chat

**Use Composer (Cmd+I) for:**
- Batch fixes (3-5 similar files)
- Multi-file import updates
- Consistent pattern across files

**Use Chat (Cmd+L) for:**
- Single complex file
- Investigation/explanation needed
- User wants to review before applying

## 🔄 This Rule is Active

Every time you write TypeScript code in ANY project, I will:
1. Remind you to validate after changes
2. Automatically suggest error-fixing workflow if errors found
3. Guide you through systematic fixes
4. Prevent proceeding with unresolved errors
5. Maintain this workflow consistently

**You don't need to ask—I'll enforce it automatically.**

***

5. Click Save

6. Done! This now applies to ALL your projects.
\`\`\`

***

## SUMMARY

After completion, report:

\`\`\`
✅ HYBRID WORKFLOW SETUP COMPLETE!

📁 Template Created: ~/cursor-typescript-template/
   ├── .cursor/rules/
   │   ├── error-fixing.mdc
   │   └── implementation.mdc
   ├── scripts/
   │   ├── setup-validation.sh
   │   └── apply-to-current-project.sh
   ├── docs/
   │   └── cursor-workflow.md
   ├── .cursorrules
   └── README.md

📋 Current Project Updated:
   ├── .cursor/rules/ (copied)
   ├── scripts/ (copied)
   ├── docs/ (copied)
   ├── .cursorrules (created)
   └── package.json (validation scripts added)

🔧 Shell Aliases Added:
   - cursor-init <name>        Create new project with workflow
   - cursor-apply-workflow     Apply to existing project

⚠️ MANUAL STEP REMAINING:
   Configure User Rules in Cursor Settings (instructions shown above)

🎉 READY TO USE:
   - New projects: cursor-init my-project
   - Existing projects: cd project && cursor-apply-workflow
   - Current project: Already configured!

💡 Next Steps:
   1. Complete User Rules setup in Cursor Settings
   2. Test: npm run type-check
   3. Start coding - Cursor will guide validation automatically
\`\`\`

***

✅ START IMPLEMENTATION NOW
```

---

## 🎯 **HOW TO USE THIS**

### **Step 1: Copy Everything Above**

Select and copy the entire implementation guide (from "🎯 TASK" to "✅ START IMPLEMENTATION NOW")

### **Step 2: Open Cursor Composer**

- **Mac:** Cmd+I
- **Windows:** Ctrl+I

### **Step 3: Paste and Let Cursor Work**

Paste the entire thing into Composer. Cursor will:

1. ✅ Create `~/cursor-typescript-template/` directory
2. ✅ Create all template files (.cursor/rules, scripts, docs, etc.)
3. ✅ Apply template to current project
4. ✅ Add validation scripts to package.json
5. ✅ Create shell aliases in ~/.zshrc or ~/.bashrc
6. ✅ Generate complete documentation

### **Step 4: One Manual Step (5 minutes)**

Cursor will show you instructions to configure **User Rules** in Cursor Settings. This is a one-time setup that makes the workflow work in ALL projects.

---

## ✅ **RESULT**

After Cursor finishes:

✅ **Template created** → Use for all future projects  
✅ **Current project configured** → Ready to use immediately  
✅ **Shell aliases added** → `cursor-init` command available  
✅ **Documentation generated** → Complete guides in `docs/`  
✅ **User Rules instructions** → Copy-paste into Cursor Settings  

**Total time:** 
- Cursor setup: 2-3 minutes (automatic)
- User Rules: 5 minutes (one-time manual)
- **You're done!** Works forever across all projects.

---

## 💡 **WHAT CURSOR WILL CREATE**

```
~/cursor-typescript-template/
├── .cursor/rules/
│   ├── error-fixing.mdc           ✅ Error workflow
│   └── implementation.mdc          ✅ Phase checklist
├── scripts/
│   ├── setup-validation.sh         ✅ Auto-setup
│   └── apply-to-current-project.sh ✅ Quick apply
├── docs/
│   └── cursor-workflow.md          ✅ Documentation
├── .cursorrules                     ✅ Project template
└── README.md                        ✅ Complete guide

~/.zshrc (or ~/.bashrc)
└── cursor-init alias               ✅ Quick start command
└── cursor-apply-workflow alias     ✅ Apply to existing

[Current Project]/
├── .cursor/rules/                  ✅ Applied
├── scripts/                        ✅ Applied
├── docs/                           ✅ Applied
├── .cursorrules                    ✅ Applied
└── package.json                    ✅ Scripts added
```

---

**Just paste into Composer and let Cursor handle everything! 🚀**