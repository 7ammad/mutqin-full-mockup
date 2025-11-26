# Plan Mode Prompt - Complete Project Implementation
## Use this prompt in Cursor Plan Mode to build the entire project

---

## Prompt to Use in Plan Mode

```
Create a comprehensive implementation plan for building the complete CME event management platform with all 5 personas (HCP, Organizer, Event Manager, Vendor, Regulator).

**IMPORTANT CONTEXT:**
- The implementation plan document (FULL_UX_UI_IMPLEMENTATION_PLAN.md) already includes Event Manager as the 5th persona in the planning
- However, the CURRENT CODEBASE only has 4 personas implemented (ORGANIZER, VENDOR, REGULATOR, HCP)
- Event Manager persona needs to be ADDED to the codebase (it's planned but not yet implemented)
- This plan should cover implementing Event Manager AND all other features from the plan

**Project Context:**
- Framework: Next.js 16 (App Router), TypeScript, React 19
- Design System: Apple Liquid Glass (iOS 18+) - ALREADY IMPLEMENTED
- Current Personas: 4 (ORGANIZER, VENDOR, REGULATOR, HCP) - NEED TO ADD EVENT_MANAGER
- Target Personas: 5 (HCP, Organizer, Event Manager, Vendor, Regulator)
- Bilingual: Arabic (RTL) + English - ALREADY IMPLEMENTED
- Mock Data Only: No backend calls
- Current State: Basic components exist, design system applied, need to expand to full feature set

**Current Codebase State:**
- PersonaContext supports 4 personas (needs EVENT_MANAGER added)
- Persona type: 'ORGANIZER' | 'VENDOR' | 'REGULATOR' | 'HCP' (needs 'EVENT_MANAGER')
- Navigation shows 4 personas (needs Event Manager added)
- No eventmanager/ folder exists (needs to be created)
- Mock data structure exists but needs Event Manager data
- Design system fully implemented (Apple Liquid Glass)
- **Current Architecture:** Single dashboard with persona switcher (demo mode)
- **Target Architecture:** Full website with landing page, role-based auth, dedicated dashboards

**CRITICAL: Website Restructuring (Must Complete First)**

Before building features, restructure from demo to full website:

**Phase 0: Website Restructuring (Priority: CRITICAL - Do First)**
- Current: Single dashboard with persona switcher (demo mode)
- Target: Full website with landing page, role-based auth, dedicated dashboards

**Restructuring Tasks:**
1. Create landing page (`src/app/page.tsx`) - Replace persona switcher with role selection cards
2. Create auth system (`src/context/AuthContext.tsx`) - Replace PersonaContext with AuthContext
3. Create login page (`src/app/auth/login/page.tsx`) - With role prefill from URL (`?role=HCP`)
4. Create route protection (`src/proxy.ts`) - Next.js 16 compatible (NOT middleware.ts)
5. Create dashboard routes (`src/app/dashboard/[role]/page.tsx`) - One route per persona
6. Update root layout - Wrap with AuthProvider instead of PersonaProvider
7. Remove persona switcher - Users login/logout instead of switching

**Key Requirements for Restructuring:**
- Use `proxy.ts` (NOT `middleware.ts`) for Next.js 16 compatibility
- Hybrid storage: localStorage (client) + cookie (server/proxy)
- Role prefill: Landing page links include `?role=HCP` → login form pre-fills
- Console logs for debugging: `[Auth]`, `[Proxy]` prefixes
- Session expiry: 7 days, auto-cleanup
- Mock users: Add MOCK_USERS array with passwords for demo

**File Structure Changes for Restructuring:**
```
src/app/
├── page.tsx                    → Landing Page (PUBLIC, role selection)
├── auth/login/page.tsx        → Login Page (with ?role= prefill)
├── dashboard/
│   ├── layout.tsx             → Protected layout (client-side guard)
│   ├── organizer/page.tsx     → Organizer dashboard
│   ├── vendor/page.tsx        → Vendor dashboard
│   ├── regulator/page.tsx     → Regulator dashboard
│   ├── hcp/page.tsx          → HCP dashboard
│   └── event-manager/page.tsx → Event Manager dashboard
src/
├── proxy.ts                   → Route protection (Next.js 16)
├── context/
│   └── AuthContext.tsx        → Authentication (replaces PersonaContext)
```

**After restructuring is complete, then proceed with feature building phases below.**

**Requirements:**
1. **FIRST: Complete Website Restructuring (Phase 0 - CRITICAL)**
   - Restructure from demo to full website (see Phase 0 details above)
   - This must be completed before any feature building
   - Creates foundation for role-based routing and authentication

2. Add Event Manager (5th persona) to codebase:
   - Update Persona type to include 'EVENT_MANAGER'
   - Add Event Manager to AuthContext (after restructuring)
   - Create eventmanager/ component folder
   - Add Event Manager to navigation (DashboardLayout)
   - Add Event Manager mock data
   - Create EventManagerView component
   - Create dashboard route (`src/app/dashboard/event-manager/page.tsx`)

3. Build all features from FULL_UX_UI_IMPLEMENTATION_PLAN.md (after restructuring):
   - Phase 1: Performance & Infrastructure
   - Phase 2: Foundation & Core Views (including Event Manager setup)
   - Phase 3: HCP Portal (complete)
   - Phase 4: Organizer Portal (complete)
   - Phase 5: Event Manager Portal (complete)
   - Phase 6: Vendor Portal (complete)
   - Phase 7: Regulator Portal (complete)
   - Phase 8: Shared Components & Polish

3. Mock Data Schema Expansion (CRITICAL):
   - Add Event Manager user data (see EXTENDED_BLUEPRINT_WITH_EVENT_MANAGERS.md for model)
   - Add Event Assignment model (EventAssignment interface)
   - Add Event Manager assignments to existing events
   - Add check-in/attendance data structures
   - Add certificate generation data structures
   - Add behavioral tracking data for personalization
   - Add registration management data
   - Add session management data
   - Add post-event reporting data
   - Expand mock data to: 50+ events, 20+ HCPs, 10+ Organizers, 5+ Event Managers, 10+ Vendors
   - Update PERSONA_DETAILS in mockData.ts to include EVENT_MANAGER
   - Add Event Manager-specific mock data arrays

**Constraints:**
- Must use Apple Liquid Glass design system (already implemented)
- Must support RTL/Arabic (already implemented)
- Mobile-responsive (enhance existing)
- Performance: < 3s load, < 100ms interaction
- No backend - all mock data
- Follow existing component patterns
- Use existing design system components (LiquidGlassCard, GlassButton)

**Please:**
1. **FIRST:** Plan the website restructuring (Phase 0) - this is critical and must be done before features
2. Analyze existing components in @components/[persona]/ to understand current patterns
3. Review @Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md for complete feature list
4. Review @Docs/EXTENDED_BLUEPRINT_WITH_EVENT_MANAGERS.md for Event Manager specifications
5. Review @Docs/PROJECT_BLUEPRINT.md for overall architecture
6. Research Next.js 16 App Router patterns for role-based routing and authentication
7. Research best practices for marketplace platforms
8. Create a comprehensive, phased implementation plan with:
   - Specific file paths for all components
   - Dependencies between tasks
   - Mock data schema updates needed
   - Type definitions to add/update
   - Integration points between personas
   - Design system compliance checks
   - Mobile optimization steps
   - Performance optimization tasks

7. Include detailed mock data schema (reference EXTENDED_BLUEPRINT_WITH_EVENT_MANAGERS.md):
   - Event Manager user model (EventManager interface)
   - Event Assignment model (EventAssignment interface)
   - Updated Event model (with assignment fields: assignedToEventManager, eventManagerId, executionStatus)
   - Check-in/attendance data structures (CheckInRecord, AttendanceRecord)
   - Certificate data structures (Certificate, CertificateTemplate)
   - Analytics data structures (EventManagerAnalytics, PerformanceMetrics)
   - Behavioral tracking data (UserBehavior, EventInteraction)
   - Registration management data (Registration, Ticket)
   - Session management data (Session, SessionAttendance)
   - Post-event data (PostEventReport, CMEHourSubmission)

8. Break down into actionable tasks with:
   - Task dependencies clearly marked
   - File-level changes specified
   - Code patterns to follow
   - Testing considerations
   - Verification steps

**Dependencies to Include:**
- **Restructuring Dependencies (Phase 0):**
  - Next.js 16 proxy.ts (route protection - NOT middleware.ts)
  - AuthContext (replaces PersonaContext for authentication)
  - localStorage + cookie session management
  - Next.js App Router route structure (landing, auth, dashboard routes)
- TypeScript type definitions for all new models
- React component dependencies (shared components, UI components)
- Context provider updates (AuthContext, LanguageContext)
- Routing dependencies (Next.js App Router)
- Design system dependencies (LiquidGlassCard, GlassButton, Apple colors)
- State management dependencies (React Context, local state)
- Form validation dependencies (Zod schemas if needed)
- Date/time handling (for events, check-ins, attendance)
- QR code generation/scanning libraries (for Event Manager check-in)
- PDF generation libraries (for certificates)
- Chart libraries (for analytics dashboards)

**Output Format:**
- Structured markdown plan
- Phases with clear dependencies
- File structure changes (complete directory tree)
- Mock data schema definitions (TypeScript interfaces)
- Component specifications (props, state, functionality)
- Integration points (how personas interact)
- Dependency list (npm packages needed)
- Type definitions file structure

Do NOT execute code - only create the comprehensive plan.
```

---

## Key Points This Prompt Covers

1. **CRITICAL: Website Restructuring First**: Phase 0 restructures from demo to full website (landing page, auth, role-based routing)
2. **Next.js 16 Compatibility**: Uses proxy.ts (NOT middleware.ts) for route protection
3. **Clarifies Current State**: Explains that Event Manager is in the plan but not in code yet
4. **Specifies What Needs Adding**: Event Manager persona, components, mock data
5. **References All Documents**: Points to the implementation plan, blueprint, and extended blueprint
6. **Includes Mock Data Schema**: Requests detailed schema for Event Manager and related data
7. **Covers All Phases**: References restructuring (Phase 0) + all feature phases (1-8)
8. **Design System Compliance**: Mentions existing design system implementation
9. **Dependencies**: Requests dependency mapping between tasks, with restructuring as foundation

---

## Usage Instructions

1. Open Cursor
2. Switch to Plan Mode (Shift+Tab or Cmd+M → Plan Mode)
3. Copy the prompt above (everything between the triple backticks)
4. Paste and send
5. Review the generated plan
6. Approve when ready
7. Exit plan mode and begin implementation

---

**Document Status:** Ready to Use  
**Last Updated:** 2025

