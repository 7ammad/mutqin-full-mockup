# Cursor Rules - Project Initialization, Compatibility & AI Behavior
# Type: User Rules (Global)
---

## 🎯 Purpose
Guide Cursor to:
- Initialize new projects with a modern, stable, scalable setup
- Generate PowerShell-compatible and cross-platform code
- Follow flexible best practices with clear fallbacks
- Communicate concisely with expert-level users

---

## 🔄 Project Initialization Protocol
- **ALWAYS** analyze the existing project structure before making changes.
- **AUTOMATICALLY DETECT** project type (web app, API, mobile, desktop).
- **GENERATE** scaffolding if missing, based on detected stack.
- **CREATE**:
  - `README.md`, `.gitignore`
  - Package files (`package.json`, `pyproject.toml`, etc.)
- **VERIFY** dependency compatibility before install.

---

## 🧠 Tech Stack Selection & Compatibility
- **SCAN** for package managers (`pnpm`, `npm`, `yarn`, `uv`, `pip`).
- **SUGGEST**: `pnpm > yarn > npm`, unless project already uses a specific one.
- **RECOMMEND** TypeScript where scalable or type-safe structure is beneficial.
- **VALIDATE** version compatibility of primary libraries (React+TS, Node+Express, etc).
- **FLAG** deprecated or insecure packages and suggest stable alternatives.

---

## 📦 Dependency and Version Management
- **FETCH** latest LTS versions from official registries.
- **PIN** semver (`^`) for libraries, **lock exact versions** for dev tools.
- **CROSS-REFERENCE** compatibility matrices for common frontend/backend stacks.
- **DOCUMENT** rationale for version decisions in code comments or `README`.

---

## 📁 File & Structure Standards
- Auto-generate ESLint + Prettier configs for JS/TS projects.
- For full-stack: create shared type folders, align port configs.

### ✅ Recommended Folder Layout (Baseline)
```
project-root/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── types/
├── docs/
│   ├── technical/
│   ├── implementation/
│   └── api/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── config/
├── scripts/
├── .cursor/
│   ├── rules/
│   └── environment.json
├── PRD.md
└── IMPLEMENTATION.md
```

---

## 🧪 Testing & QA
- Install and configure common test runners (`jest`, `vitest`, `pytest`, etc.)
- Add:
  - Pre-commit hooks (husky)
  - Linting + format checks
  - CI/CD templates

---

## 📖 Documentation
- Autogenerate `README.md` with:
  - Setup guide, env vars, workflow commands
- Setup `CHANGELOG.md` using `Keep a Changelog` format

---

## 🛡️ AI Behavior & Prompting Rules
- **ASK** for clarification if tech stack or intent is unclear.
- **DO NOT ASSUME** project tools unless detected.
- **EXPLAIN** complex changes or tools if non-obvious.
- **PREFER** readable, safe, cross-platform code over clever or short solutions.
- **INCLUDE** performance and security implications in architecture-level suggestions.
- **MODULARIZE** any function >150 LOC into multiple files or reusable pieces.
- **FALLBACK** if suggestion may fail → log pattern and suggest alt.

---

## 🧠 Developer Interaction Rules (Expert Mode)
- Provide direct code or fixes first. Clarify later only if needed.
- Skip summaries like "here's how you can..." unless explicitly asked.
- Be terse, accurate, and pragmatic.
- Suggest solutions I haven't considered.
- Respect `.prettierrc` settings for all formatting.
- For partial edits, use diff format or limited context.
- Split replies into multiple messages when long.
- Casual tone unless otherwise specified.
- Cite sources only when essential.
- Never disclose AI identity or cutoff.
- Only discuss safety if truly non-obvious.
- For policy blocks, offer closest valid output and move on.

---

## ⚙️ PowerShell Compatibility Rules
- **NEVER USE**: `&&`, `||`, `~`, `!`, `^`, unescaped `$`, or bash syntax.
- Use PowerShell-native equivalents:
  - Background: `Start-Job`
  - Conditionals: `if (...) {...}`
  - Paths: `$env:USERPROFILE`, `$PWD`
  - Redirection: `Out-File`, `>`
- Quote all paths with potential spaces.
- Use `;` to chain commands, `try {}` for error handling.

### 🚫 Examples of Invalid Bash Syntax
```bash
# Bad: Bash chaining
npm install && npm run build

# Bad: Bash-style conditionals
[ -f file.txt ] && echo "exists"

# Bad: Unix-style paths
cd ~/Desktop

# Bad: Bash variables
echo $HOME
```

- **NEVER USE**: `&&`, `||`, `~`, `!`, `^`, unescaped `$`, or bash syntax.
- Use PowerShell-native equivalents:
  - Background: `Start-Job`
  - Conditionals: `if (...) {...}`
  - Paths: `$env:USERPROFILE`, `$PWD`
  - Redirection: `Out-File`, `>`
- Quote all paths with potential spaces.
- Use `;` to chain commands, `try {}` for error handling.

### ✅ Examples
```powershell
npm install; npm run build
if ($LASTEXITCODE -eq 0) { npm run test }
try { npm install } catch { Write-Error "fail" }
Set-Location "$env:USERPROFILE\Desktop\project"
```

---

## 🔄 Version Control Standards
- **INIT** `.gitignore` for detected language
- **ADD** commit template (conventional commits style)
- **ENFORCE** branches: `feature/`, `bugfix/`, `hotfix/`, `release/`

---

## 🚨 Error Recovery Protocol
- **LOG** known break patterns (build, shell, parsing)
- **ROLLBACK** to last known good if output causes major break
- **OFFER** fallback implementation if initial fails

---

## 🔁 Performance Guidelines
- Limit operations to affected files only
- Avoid loading unreferenced files
- Offer async or deferred ops if operation is heavy

---

## 🚫 Known Error Prevention
- Don't mix multiple package managers
- Don't hallucinate file paths or config names
- Don't suggest bash syntax in PowerShell contexts

---

## ✅ Emergency Exit Conditions
- STOP and ask if context is missing
- Don't generate unsafe CI-breaking code
- ALWAYS fallback to simplest safe structure when uncertain

---

## 📅 Long-Term Maintenance Rules
- Suggest regular upgrade reviews
- Monitor deprecation logs
- Auto-create migration notes when breaking changes are detected

---

## 🔍 Documentation & Research Tools

### API/Library/Function Queries
- **When the user asks about an API/library/function** → always use @ref first

### How-To & Example Queries
- **When the user asks "how to", "best way", "examples", "real-world"** → use @exa

---

## 🎨 Design System Standards

### Default Design System: Apple Liquid Glass (iOS 18+)

**ALWAYS USE** Apple's Liquid Glass design system as the default for all UI components in this project.

**Core Principles:**
- **Layered Design**: Use Background → Middle → Foreground layer structure
- **System-Handled Effects**: Apply reflection, refraction, shadow, blur, highlights automatically
- **Interactive Elements**: Enable 3D tilt and fluid responses for interactive components
- **Tint Colors**: Use tint prop for prominence (important elements)
- **Glass Variants**: Use "regular" (default) or "prominent" variants

**Component Usage:**
- **Cards/Panels**: Use `<LiquidGlassCard>` component with appropriate blur intensity
- **Buttons**: Use `<GlassButton>` component with variant and size props
- **Custom Elements**: Apply glass utility classes (`.glass-md`, `.glass-lg`, `.liquid-glass`)
- **Interactive Elements**: Always set `interactive={true}` for cards that benefit from 3D tilt

**Design Tokens:**
- Import from `@/lib/design-system` for consistent values
- Use `getGlassClasses()` helper for dynamic glass effects
- Follow `designTokens.animations.spring` for iOS-like spring physics

**Reference Documents:**
- `Docs/IOS_DESIGN_SYSTEM.md` - Implementation guide
- `Docs/APPLE_LIQUID_GLASS_REFERENCE.md` - Apple's official principles

**When Creating New Components:**
1. **ALWAYS** use Liquid Glass styling (don't use solid backgrounds)
2. **ALWAYS** use `<LiquidGlassCard>` for card-like components
3. **ALWAYS** use `<GlassButton>` for buttons
4. **ALWAYS** apply appropriate blur intensity (xl for cards, md for buttons)
5. **ALWAYS** enable interactive effects for user-touchable elements
6. **ALWAYS** use spring animations (not linear/ease)

**Color System (Apple Official):**
- **ALWAYS** use semantic color names (`--label`, `--system-background`, etc.)
- **ALWAYS** use Apple system colors (`--apple-blue`, `--apple-red`, etc.)
- **ALWAYS** ensure colors adapt to light/dark mode automatically
- **ALWAYS** use CSS variables from `globals.css` (never hardcode colors)
- **ALWAYS** use OKLCH color space for better perceptual uniformity
- **NEVER** use fixed RGB values - use semantic/system colors instead
- Import from `@/lib/apple-colors` for programmatic color access

**Exceptions:**
- Only use solid backgrounds if explicitly requested by user
- Only skip glass effects if component is purely decorative (no interaction)
- Only use custom colors if Apple system colors don't fit the use case

---

