# Technical Project Overview
## Mutqin - Unified CME Event Marketplace Platform

**Version:** 0.1.0 (Demo/Simulation Phase)  
**Last Updated:** January 2025  
**Status:** Active Development - Demo Ready

---

## Executive Summary

Mutqin is a **three-sided marketplace platform** for Continuing Medical Education (CME) events in Saudi Arabia. The platform connects:

- **350,000+ Healthcare Practitioners (HCPs)** seeking CME hours
- **396 Event Organizers** managing 10,500+ annual events
- **Pharmaceutical/MedTech Sponsors** with $160M+ sponsorship budget
- **SCFHS Regulators** overseeing accreditation
- **Event Managers** executing events

**Current State:** Demo/simulation with mock data, fully functional UI, ready for production API integration.

---

## 1. Project Architecture

### 1.1 Technology Stack

**Frontend Framework:**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5 (strict mode)

**Styling & Design:**
- Tailwind CSS v4
- Apple Liquid Glass design system
- shadcn/ui component library
- Framer Motion (spring animations)
- Cairo font (Arabic/Latin subsets)

**State Management:**
- React Context API (no external state library)
  - `AuthContext` - Authentication & user session
  - `PersonaContext` - Role-based state (deprecated, transitioning to AuthContext)
  - `LanguageContext` - i18n (Arabic/English)
  - `ThemeProvider` - Dark/Light mode

**UI Libraries:**
- Radix UI primitives (Dialog, Tooltip, Slot)
- Lucide React icons
- Recharts (data visualization)
- React Hook Form + Zod validation
- html5-qrcode (QR scanning)

**Internationalization:**
- Bilingual support (Arabic/English)
- RTL/LTR switching
- Language toggle in global header

**PWA Features:**
- Service worker (`public/sw.js`)
- Manifest.json
- Mobile-responsive design

**Testing:**
- Vitest (unit tests)
- Playwright (e2e tests)
- MSW (Mock Service Worker for API mocking)

**Development Tools:**
- ESLint
- TypeScript strict mode
- Bundle analyzer script

### 1.2 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (demo reset endpoint)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Persona-specific dashboards
│   │   ├── organizer/     # CPD Provider dashboard
│   │   ├── event-manager/ # Execution Vendor dashboard
│   │   ├── hcp/          # Healthcare Practitioner dashboard
│   │   ├── regulator/     # SCFHS Regulator dashboard
│   │   └── vendor/       # Sponsor/Vendor dashboard
│   ├── events/           # Public event pages
│   ├── onboarding/       # User onboarding flows
│   ├── register/         # Registration flows
│   └── layout.tsx        # Root layout with providers
├── components/            # React components
│   ├── organizer/        # Organizer-specific components
│   ├── eventmanager/     # Event Manager components
│   ├── hcp/             # HCP-specific components
│   ├── regulator/        # Regulator components
│   ├── vendor/          # Vendor/Sponsor components
│   ├── shared/          # Shared utility components
│   ├── ui/              # shadcn/ui base components
│   └── DashboardLayout.tsx # Global dashboard shell
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   ├── PersonaContext.tsx
│   ├── LanguageContext.tsx
│   ├── demoStore.ts      # Demo state management
│   ├── demoSeed.ts       # Seed data generator
│   └── demoPersistence.ts # LocalStorage persistence
├── lib/                  # Utilities and helpers
│   ├── api/             # API client (ready for integration)
│   ├── mockApi/         # MSW handlers
│   └── mockData.ts      # Static mock data
├── locales/             # i18n translation files
│   ├── ar.json
│   └── en.json
└── types/               # TypeScript type definitions
    ├── actions.ts
    └── registration.ts
```

---

## 2. Core Features & Pages (As Built)

### 2.1 Authentication System

**Implementation Status:** Functional (mock authentication)

**Features:**
- Role-based login (`/auth/login`)
- Session persistence (localStorage + cookies)
- 7-day session expiry
- Role prefill from URL (`?role=HCP`)
- Mock user credentials for demo:
  - `hcp@demo.com` / `demo123` (HCP)
  - `organizer@demo.com` / `demo123` (Organizer)
  - `vendor@demo.com` / `demo123` (Vendor)
  - `regulator@demo.com` / `demo123` (Regulator)
  - `eventmanager@demo.com` / `demo123` (Event Manager)

**Files:**
- `src/context/AuthContext.tsx` - Auth state management
- `src/app/auth/login/page.tsx` - Login page
- `src/proxy.ts` - Route protection (Next.js 16 compatible)

### 2.2 Dashboard Architecture

**Global Dashboard Shell:**
- `DashboardLayout.tsx` - Single layout for all personas
- Global sidebar navigation (persona-specific tabs)
- Global header (user dropdown, language toggle, theme toggle)
- No per-persona headers/sidebars (architectural constraint)

**Navigation Pattern:**
- Base route: `/dashboard/<persona>`
- Tab switching: `?tab=<tabKey>`
- Detail routes: `/dashboard/<persona>/<entity>/[id]`

**Information Architecture:**
- Defined in `Docs/IA-SITEMAP.md`
- Canonical tab keys per persona
- Deep link normalization rules

### 2.3 Organizer Dashboard (CPD Provider)

**Base Route:** `/dashboard/organizer`

**Tabs:**
- `overview` - KPIs, next actions, pipeline view
- `activities` - Event lifecycle management
- `accreditation` - Submissions and decisions
- `execution` - Vendor assignments, attendance
- `sponsors` - Sponsorship packages and disclosures

**Detail Routes:**
- `/dashboard/organizer/events/[eventId]` - Event detail
- `/dashboard/organizer/events/[eventId]/edit` - Edit event
- `/dashboard/organizer/events/[eventId]/assign` - Assign vendor
- `/dashboard/organizer/events/[eventId]/registrations` - Registration management
- `/dashboard/organizer/events/[eventId]/attendance` - Attendance tracking
- `/dashboard/organizer/events/[eventId]/certificates` - Certificate generation
- `/dashboard/organizer/events/[eventId]/sponsors` - Sponsorship management

**Key Components:**
- `CreateEventWizard.tsx` - Multi-step event creation
- `EventDashboard.tsx` - Event overview
- `AttendanceDashboard.tsx` - Attendance tracking
- `CertificateGenerator.tsx` - Certificate creation
- `QRCheckInSystem.tsx` - QR code check-in

**Features:**
- Event creation wizard (5 steps)
- Event lifecycle management (Draft → Pending Approval → Published → Completed)
- Vendor assignment workflow
- Sponsorship package creation
- Attendance records submission
- Hours registration submission
- Compliance tracking

### 2.4 Event Manager Dashboard (Execution Vendor)

**Base Route:** `/dashboard/event-manager`

**Tabs:**
- `assignments` - Inbox of assigned events (accept/decline)
- `checkin` - Live check-in console (QR/manual)
- `attendance` - Attendance ledger and exceptions
- `certificates` - Certificate issuance/readiness
- `handover` - Handover/audit pack overview

**Detail Routes:**
- `/dashboard/event-manager/events/[eventId]` - Event ops overview
- `/dashboard/event-manager/events/[eventId]/checkin` - Check-in console
- `/dashboard/event-manager/events/[eventId]/attendance` - Attendance management

**Key Components:**
- `AssignmentDashboard.tsx` - Assignment inbox
- `LiveAttendanceDashboard.tsx` - Real-time check-in
- `MobileQRScanner.tsx` - QR code scanner
- `PostEventProcessing.tsx` - Post-event workflow
- `RegistrationManagement.tsx` - Registration handling

**Features:**
- Assignment acceptance/decline
- QR code check-in system
- Manual attendance override
- Attendance finalization
- Certificate generation
- Handover pack creation

### 2.5 HCP Dashboard (Healthcare Practitioner)

**Base Route:** `/dashboard/hcp`

**Tabs:**
- `discover` - Browse accredited activities
- `registrations` - Upcoming and past registrations/tickets
- `credits` - Credits/hours tracker
- `certs_reviews` - Certificates list and reviews

**Detail Routes:**
- `/dashboard/hcp/events/[eventId]` - Event view
- `/dashboard/hcp/tickets/[ticketId]` - Ticket detail
- `/dashboard/hcp/certificates/[certificateId]` - Certificate detail

**Key Components:**
- `DiscoveryGrid.tsx` - Event discovery with search/filters
- `MyTickets.tsx` - Registered events list
- `CMETrackingDashboard.tsx` - CME hours tracking
- `CertificatePortfolio.tsx` - Certificate collection
- `RegistrationFlow.tsx` - One-click registration
- `ReviewsRatings.tsx` - Post-event reviews

**Features:**
- Event discovery (search, filters, specialty)
- One-click registration
- QR code ticket display
- CME hours tracking (progress toward 40-hour requirement)
- Certificate portfolio
- Post-event reviews and ratings

### 2.6 Regulator Dashboard (SCFHS)

**Base Route:** `/dashboard/regulator`

**Tabs:**
- `review_queue` - Accreditation queue (applications waiting for review)
- `decision_workspace` - Detailed application review + decision UI
- `compliance_monitor` - Attendance/hours compliance monitoring
- `audit_risk` - Provider-level audits and risk flags
- `analytics` - Ecosystem-level analytics and exports

**Detail Routes:**
- `/dashboard/regulator/applications/[applicationId]` - Application detail
- `/dashboard/regulator/applications/[applicationId]/decision` - Decision view
- `/dashboard/regulator/applications/[applicationId]/checklist` - Checklist view

**Key Components:**
- `RegulatorQueueTab.tsx` - Application queue
- `RegulatorReviewTab.tsx` - Review workspace
- `RegulatorDecisionsTab.tsx` - Decision history
- `ComplianceMonitoring.tsx` - Compliance tracking
- `RegulatorAuditTab.tsx` - Audit tools
- `RegulatorAnalyticsTab.tsx` - Analytics dashboard
- `StandardsChecklist.tsx` - Accreditation checklist

**Features:**
- Application review workflow
- Approval/rejection decisions
- Compliance monitoring (attendance records, hours registration)
- Risk flagging
- National analytics
- Export functionality (CSV/JSON)

### 2.7 Vendor/Sponsor Dashboard

**Base Route:** `/dashboard/vendor` (or `/dashboard/sponsor`)

**Tabs:**
- `marketplace` - Browse sponsorship opportunities/packages
- `purchases` - List of sponsorship deals purchased
- `assets` - Creative assets and disclosures
- `performance` - Sponsorship performance and analytics
- `billing` - Invoices, receipts, payments

**Detail Routes:**
- `/dashboard/vendor/marketplace` - Marketplace list view
- `/dashboard/vendor/campaigns/[campaignId]` - Campaign detail
- `/dashboard/vendor/events/[eventId]` - Event sponsorship view
- `/dashboard/vendor/sponsorships/[sponsorshipId]` - Sponsorship detail

**Key Components:**
- `MarketplaceFeed.tsx` - Sponsorship opportunities
- `SponsorModal.tsx` - Sponsorship transaction modal
- `SponsorshipPackages.tsx` - Package details
- `CampaignAnalytics.tsx` - ROI tracking
- `HCPTargeting.tsx` - Audience targeting
- `ComplianceManagement.tsx` - Disclosure management

**Features:**
- Browse events seeking sponsorship
- Package selection (Gold, Silver, Bronze)
- SFDA license input
- Sponsorship purchase flow
- Disclosure submission
- Performance analytics

---

## 3. Data Models & Contracts

### 3.1 Type Definitions

**Source of Truth:** `Docs/CONTRACTS.md`

**Core Entities:**
- `Activity` (Event) - Main event entity
- `Org` - Organization (CPD Provider, Execution Vendor, Sponsor, Regulator)
- `User` - User account with role
- `Assignment` - Provider → Execution Vendor assignment
- `Ticket` - HCP registration
- `AttendanceScan` - QR check-in record
- `SponsorPackage` - Sponsorship package
- `SponsorDeal` - Sponsorship transaction
- `Disclosure` - Regulatory disclosure
- `AuditEvent` - Immutable audit log

**Status Enums:**
- `ActivityStatus`: `draft` | `submitted` | `pending_review` | `approved` | `rejected` | `published` | `completed` | `closed`
- `AccreditationDecision`: `approved` | `rejected`
- `AssignmentStatus`: `pending` | `accepted` | `declined`
- `TicketStatus`: `confirmed` | `cancelled`
- `AttendanceStatus`: `not_checked_in` | `checked_in` | `finalized`
- `SponsorshipStatus`: `offered` | `reserved` | `paid` | `disclosed` | `approved_for_display` | `completed`

### 3.2 Mock Data Structure

**Primary Seed Data:** `src/context/demoSeed.ts`

**Demo State:**
```typescript
interface DemoState {
  version: number;
  events: DemoEvent[];
  assignments: DemoAssignment[];
  tickets: DemoTicket[];
  attendanceRecords: DemoAttendance[];
  certificates: DemoCertificate[];
  reviews: DemoReview[];
  sponsorships: DemoSponsorship[];
}
```

**Static Mock Data:** `src/lib/mockData.ts`

**Includes:**
- `INITIAL_EVENTS` - 8+ events with various statuses
- `MOCK_USERS` - 5 demo users (one per persona)
- `MOCK_EVENT_MANAGERS` - 2 event manager profiles
- `MOCK_EVENT_ASSIGNMENTS` - Assignment records
- `PERSONA_DETAILS` - User session details per persona
- `DEMO_STATS` - Dashboard statistics

**Event Lifecycle States:**
- **Draft** - Organizer creating event
- **Pending Funding** - Awaiting sponsorship
- **Pending Approval** - In regulator queue
- **Published** - Visible to HCPs
- **Completed** - Event finished, compliance pending
- **Closed** - All compliance submitted

### 3.3 Data Persistence

**Current Implementation:**
- `localStorage` for demo state (`mutqin.demo.v1`)
- Session storage for auth (`auth_session`)
- No backend database (ready for API integration)

**Persistence Layer:**
- `src/context/demoStore.ts` - State management with localStorage sync
- `src/context/demoPersistence.ts` - Persistence utilities
- `src/context/demoSeed.ts` - Deterministic seed data

**API Readiness:**
- `src/lib/api/client.ts` - API client structure (ready for real endpoints)
- `src/lib/api/types.ts` - API type definitions
- `src/lib/mockApi/handlers.ts` - MSW handlers (can be replaced with real API)

---

## 4. User Flows & Workflows

### 4.1 Complete Event Lifecycle

**Step 1: Organizer Creates Event**
1. Navigate to `/dashboard/organizer`
2. Click "Create New Event"
3. Complete wizard (5 steps):
   - Basic Information
   - Accreditation Details
   - CME Hours
   - Sponsorship (optional)
   - Review & Submit
4. Event created with status: `draft` or `pending_review` or `pending_funding`

**Step 2: Vendor Sponsors Event (if needed)**
1. Navigate to `/dashboard/vendor`
2. View marketplace (`marketplace` tab)
3. Click "Sponsor This Event"
4. Enter SFDA License
5. Confirm sponsorship
6. Event status: `pending_funding` → `pending_review`

**Step 3: Regulator Reviews & Approves**
1. Navigate to `/dashboard/regulator`
2. View queue (`review_queue` tab)
3. Open application detail
4. Review checklist
5. Make decision: Approve or Reject
6. Event status: `pending_review` → `approved` or `rejected`
7. If approved, event auto-publishes: `approved` → `published`

**Step 4: HCP Discovers & Registers**
1. Navigate to `/dashboard/hcp`
2. View discovery (`discover` tab)
3. Search/filter events
4. Click "Register Now"
5. Ticket created, QR code generated
6. Event added to "My Tickets"

**Step 5: Event Execution**
1. Event Manager accepts assignment
2. On event day: HCP checks in via QR code
3. Event Manager scans QR codes
4. Attendance finalized
5. Certificates generated

**Step 6: Post-Event Compliance**
1. Organizer submits attendance records
2. Organizer submits hours registration
3. Regulator monitors compliance
4. HCP hours posted to Mumaris Plus (simulated)

### 4.2 Key User Journeys

**Organizer Journey:**
- Create event → Request sponsorship (optional) → Submit for accreditation → Assign vendor → Execute event → Submit compliance

**HCP Journey:**
- Discover events → Register → Receive ticket → Check in → Earn CME hours → View certificate

**Vendor Journey:**
- Browse marketplace → Select event → Purchase package → Submit disclosure → Track performance

**Regulator Journey:**
- Review queue → Open application → Review checklist → Make decision → Monitor compliance → Export analytics

**Event Manager Journey:**
- View assignments → Accept/decline → Prepare event → Check-in attendees → Finalize attendance → Generate handover pack

---

## 5. Design System & UI Components

### 5.1 Design Language

**Apple Liquid Glass:**
- Glassmorphism effects
- Blur backgrounds
- Translucent surfaces
- Spring animations (Framer Motion)

**Color System:**
- System colors (light/dark mode)
- Semantic colors (primary, secondary, success, warning, error)
- Defined in `Docs/APPLE_COLOR_SYSTEM.md`

**Typography:**
- Cairo font (Arabic/Latin)
- RTL/LTR support
- Responsive text sizing

### 5.2 Component Library

**Base Components (shadcn/ui):**
- Button, Card, Dialog, Input, Select, Textarea
- Badge, Checkbox, Tooltip, Accordion
- Progress, Slider

**Custom Components:**
- `LiquidGlassCard` - Glassmorphism card
- `GlassButton` - Glass effect button
- `EventCard` - Event display card
- `LoadingSkeleton` - Loading states
- `EmptyState` - Empty state displays
- `ErrorBoundary` - Error handling
- `QRCode` - QR code generation
- `QRScanner` - QR code scanning

**Shared Components:**
- `Calendar` - Date picker
- `Chart` - Data visualization (Recharts wrapper)
- `FilterPanel` - Advanced filtering
- `GlobalSearch` - Search functionality
- `FileUpload` - File upload handler
- `PDFViewer` - PDF display

### 5.3 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Collapsible sidebar
- Touch-friendly buttons
- Mobile QR scanner
- Responsive grids

---

## 6. Internationalization (i18n)

### 6.1 Language Support

**Languages:**
- Arabic (ar) - Primary, RTL
- English (en) - Secondary, LTR

**Implementation:**
- `src/context/LanguageContext.tsx` - Language state
- `src/locales/ar.json` - Arabic translations
- `src/locales/en.json` - English translations
- Global language toggle in header

**Rules:**
- Never show both languages simultaneously
- All labels use i18n keys (no hardcoded bilingual strings)
- RTL/LTR switching automatic based on language

### 6.2 Translation Structure

**Key Format:**
```json
{
  "dashboard.organizer.overview.title": "نظرة عامة",
  "dashboard.organizer.overview.titleEn": "Overview"
}
```

**Usage:**
- Components use `useLanguage()` hook
- Access translations via `t(key)`
- Fallback to English if translation missing

---

## 7. Testing Infrastructure

### 7.1 Test Setup

**Unit Tests:**
- Vitest configuration (`vitest.config.ts`)
- Test files: `**/*.test.ts`, `**/*.test.tsx`

**E2E Tests:**
- Playwright configuration (`playwright.config.ts`)
- Test file: `tests/e2e/demo-happy-path.spec.ts`

**Mock API:**
- MSW (Mock Service Worker)
- Handlers: `src/lib/mockApi/handlers.ts`
- Service worker: `public/mockServiceWorker.js`

### 7.2 Test Coverage

**Current Tests:**
- Demo happy path (e2e)
- Component rendering (unit)
- API mocking (MSW)

**Test Commands:**
- `npm test` - Run Vitest
- `npx playwright test` - Run e2e tests
- `npx playwright test tests/e2e/demo-happy-path.spec.ts` - Run specific test

---

## 8. Build & Deployment

### 8.1 Build Configuration

**Next.js:**
- App Router enabled
- TypeScript strict mode
- Path aliases (`@/*` → `src/*`)

**Scripts:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run type-check` - TypeScript validation
- `npm run lint` - ESLint

### 8.2 Deployment

**Target Platform:**
- Vercel (production)
- Next.js static/dynamic rendering

**Environment Variables:**
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata

**Build Output:**
- `.next/` - Next.js build output
- Static assets in `public/`

---

## 9. Known Limitations & Technical Debt

### 9.1 Current Limitations

**Authentication:**
- Mock authentication only (no real backend)
- Session stored in localStorage (not secure for production)
- No password hashing/encryption

**Data Persistence:**
- No database (localStorage only)
- Data lost on browser clear
- No data synchronization

**API Integration:**
- Mock API handlers (MSW)
- Ready for real API integration
- API client structure exists but not connected

**Features:**
- Search functionality (visual only, not functional)
- QR code generation (placeholder, not real QR)
- Certificate generation (UI only, no PDF generation)
- Payment processing (not implemented)
- Email/SMS notifications (not implemented)

### 9.2 TypeScript Issues

**Current Status:**
- Some TypeScript errors exist
- Type checking scripts available
- Fix workflow documented in `Docs/typescript-fix-plan.md`

**Error Tracking:**
- `typescript-errors-report.json` - Current errors
- `TYPESCRIPT-FIX-TASKS.md` - Fix progress
- `CURSOR-FIX-PLAN.md` - Generated fix plan

### 9.3 Architectural Constraints

**Hard Rules (from workspace rules):**
- Global header/sidebar only (no per-persona headers)
- Tabs must match `IA-SITEMAP.md` exactly
- No empty screens (must show seeded data or empty state)
- Type safety non-negotiable (no `any`, no new status strings without contract update)
- i18n required (no hardcoded bilingual strings)

---

## 10. Production Readiness Checklist

### 10.1 Completed (Demo Ready)

- [x] Multi-persona dashboard system
- [x] Event creation wizard
- [x] Event discovery and registration
- [x] Sponsorship marketplace
- [x] Regulatory approval workflow
- [x] CME hours tracking
- [x] Bilingual UI (Arabic/English)
- [x] Dark/Light theme
- [x] Mobile-responsive design
- [x] Mock data and state management
- [x] Route protection
- [x] Basic error handling

### 10.2 Required for Production

- [ ] Real authentication system (OAuth, JWT)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real API layer (REST/GraphQL)
- [ ] SCFHS/CPD Platform integration
- [ ] Mumaris Plus API integration
- [ ] Payment processing (SADAD, credit cards)
- [ ] QR code generation (real QR codes)
- [ ] Certificate PDF generation
- [ ] Email/SMS notifications
- [ ] File upload/storage (S3/Cloudinary)
- [ ] Search functionality (Elasticsearch/Algolia)
- [ ] Real-time features (WebSockets)
- [ ] Analytics integration
- [ ] Security hardening (CORS, rate limiting, etc.)
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility (WCAG compliance)

### 10.3 Nice to Have

- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] AI-powered recommendations
- [ ] Blockchain certificate verification
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] Integration with other medical platforms

---

## 11. Documentation Structure

### 11.1 Key Documentation Files

**Architecture & Planning:**
- `Docs/PROJECT_BLUEPRINT.md` - Overall project vision
- `Docs/STACK_OVERVIEW.md` - Tech stack details
- `Docs/IA-SITEMAP.md` - Information architecture
- `Docs/CONTRACTS.md` - Data contracts (source of truth)

**Implementation:**
- `Docs/DEMO_FEATURES_SUMMARY.md` - Feature list
- `Docs/DEMO_FLOW_DIAGRAM.md` - User flow diagrams
- `Docs/ROUTE_IMPLEMENTATION_PLAN.md` - Route structure
- `Docs/FULL_UX_UI_IMPLEMENTATION_PLAN.md` - UI/UX plan

**Design:**
- `Docs/APPLE_COLOR_SYSTEM.md` - Color system
- `Docs/APPLE_LIQUID_GLASS_REFERENCE.md` - Design system
- `Docs/IOS_DESIGN_SYSTEM.md` - iOS design patterns

**Domain Knowledge:**
- `Docs/CME Event Lifecycle in Saudi Arabia.md` - Domain context
- `Docs/Medical Education & Medical Events Landscape in Saudi Arabia.md` - Market research

**Process:**
- `Docs/AI_CODING_USER_RULES.md` - Development rules
- `Docs/typescript-fix-plan.md` - TypeScript fix workflow

### 11.2 Documentation Rules

**From Workspace Rules:**
- Only trust docs listed in `docs/INDEX.md`
- Ignore `docs/_archive/**` completely
- If detail missing/ambiguous, request doc update (do not invent)
- All planning docs go in `Docs/` folder
- Never create docs in project root

---

## 12. Development Workflow

### 12.1 Code Standards

**TypeScript:**
- Strict mode enabled
- No `any` types allowed
- All types defined before implementation
- Type safety non-negotiable

**Component Structure:**
- Functional components with hooks
- Props interfaces defined
- Error boundaries for error handling
- Loading states for async operations

**File Organization:**
- Components by persona/feature
- Shared components in `shared/`
- UI primitives in `ui/`
- Utilities in `lib/`

### 12.2 Git Workflow

**Branches:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `release/` - Release preparation

**Commit Style:**
- Conventional commits preferred
- Clear, descriptive messages

### 12.3 Verification Commands

**Required (unless task excludes):**
- `npm run type-check` - TypeScript validation
- `npm test` - Unit tests
- `npx playwright test tests/e2e/demo-happy-path.spec.ts` - E2E test

**If skipped, must state "NOT RUN" and why.**

---

## 13. Integration Points (Ready for Implementation)

### 13.1 API Client Structure

**Location:** `src/lib/api/`

**Files:**
- `client.ts` - API client (fetch wrapper)
- `types.ts` - API request/response types
- `index.ts` - Exports

**Ready for:**
- REST API endpoints
- Authentication headers
- Error handling
- Request/response transformation

### 13.2 Mock API Handlers

**Location:** `src/lib/mockApi/handlers.ts`

**Current:**
- MSW handlers for demo
- Can be replaced with real API calls
- Same interface maintained

### 13.3 Context Providers

**Ready for:**
- Real authentication (replace mock login)
- Real data fetching (replace mock data)
- Real-time updates (WebSocket integration)
- Cache management (React Query/SWR)

---

## 14. Security Considerations

### 14.1 Current Security

**Authentication:**
- Mock authentication (not secure)
- Session in localStorage (XSS vulnerable)
- No password hashing

**Route Protection:**
- Client-side only (`proxy.ts`)
- No server-side validation

### 14.2 Production Security Requirements

**Authentication:**
- JWT tokens
- HttpOnly cookies
- Refresh token rotation
- Password hashing (bcrypt)

**Authorization:**
- RBAC (Role-Based Access Control)
- Permission checks on API endpoints
- Row-level security

**Data Protection:**
- Input validation (Zod schemas)
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting

**Compliance:**
- GDPR compliance (if applicable)
- Data residency (Saudi Arabia)
- Audit logging

---

## 15. Performance Considerations

### 15.1 Current Performance

**Optimizations:**
- Next.js App Router (automatic code splitting)
- Image optimization (Next.js Image)
- Font optimization (next/font)
- Lazy loading components

**Potential Issues:**
- Large bundle size (many components)
- No API caching
- No database query optimization

### 15.2 Production Optimizations Needed

**Frontend:**
- Bundle analysis and optimization
- Code splitting improvements
- Image CDN
- Service worker caching

**Backend (Future):**
- Database indexing
- Query optimization
- API response caching
- CDN for static assets

**Monitoring:**
- Performance metrics
- Error tracking (Sentry)
- Analytics (Google Analytics/Plausible)

---

## 16. Next Steps & Roadmap

### 16.1 Immediate Next Steps

1. **Fix TypeScript Errors**
   - Complete type checking
   - Resolve all type errors
   - Update contracts as needed

2. **Complete Dashboard Tabs**
   - Ensure all tabs render meaningful UI
   - Add seeded data for empty states
   - Verify tab navigation

3. **API Integration Preparation**
   - Finalize API contracts
   - Set up API client
   - Replace MSW with real endpoints

4. **Testing**
   - Complete e2e test coverage
   - Add unit tests for critical paths
   - Test all user flows

### 16.2 Short-Term Roadmap

**Phase 1: Production Foundation**
- Real authentication
- Database setup
- API layer
- Basic security

**Phase 2: Core Integrations**
- SCFHS/CPD Platform
- Mumaris Plus
- Payment processing
- Email/SMS

**Phase 3: Advanced Features**
- Real-time updates
- Advanced analytics
- Mobile apps
- AI features

---

## 17. Summary

**Project Status:** Demo/Simulation phase, fully functional UI, ready for backend integration

**Key Strengths:**
- Complete UI implementation for all personas
- Well-structured codebase
- Comprehensive documentation
- Type-safe architecture
- Bilingual support
- Modern design system

**Key Gaps:**
- No real backend/database
- Mock authentication
- Limited test coverage
- Some TypeScript errors
- Missing production features (payments, real-time, etc.)

**Ready For:**
- Backend API integration
- Database implementation
- Production deployment (after backend completion)
- User acceptance testing (with mock data)

**Not Ready For:**
- Production deployment (no backend)
- Real user authentication
- Payment processing
- Production data handling

---

**Document Purpose:** This overview provides a comprehensive technical summary for LLM review, codebase understanding, and onboarding new developers or AI agents to the project.

**Maintenance:** Update this document when major architectural changes occur or when moving between development phases.

