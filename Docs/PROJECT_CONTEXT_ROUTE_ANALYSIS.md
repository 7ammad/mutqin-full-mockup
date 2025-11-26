# Project Context Route Analysis
## Event-Med Platform - Missing Pages Identified from Project Context

**Date:** 2024  
**Method:** Project context analysis (user journeys, components, marketplace requirements)  
**Purpose:** Identify missing routes that wouldn't be obvious from route-only analysis

---

## Executive Summary

**Analysis Method:** 
- ✅ User journey mapping → Required routes
- ✅ Component inventory → Missing routes
- ✅ Marketplace functionality → Required pages
- ✅ Medical events platform requirements → Missing pages

**Findings:**
- **Missing Routes Identified:** 25+ routes
- **Components Without Routes:** 15+ components
- **User Journeys Broken:** 4+ critical journeys
- **Marketplace Features Missing:** 8+ features

---

## 1. USER JOURNEY ANALYSIS → MISSING ROUTES

### Journey 1: HCP Discovers and Registers for Event

**Blueprint Flow:**
```
1. HCP logs in → Dashboard shows personalized recommendations
2. Clicks "Browse All Events" → Advanced search page
3. Applies filters (Specialty, Date, Location)
4. Views event card → Clicks to see details
5. Event details page (reads description, agenda, speakers, reviews, accreditation)
6. Clicks "Register Now"
7. Registration form (auto-filled from profile)
8. Payment processing
9. Confirmation (QR code ticket, calendar export)
10. Pre-event reminders
```

**Routes Required:**
- ✅ `/dashboard/hcp` - EXISTS
- ❌ `/dashboard/hcp/events` - **MISSING** (Browse All Events page)
- ❌ `/events/[id]` - **MISSING** (Public event detail - Component: EventDetails.tsx exists)
- ❌ `/events/[id]/register` - **MISSING** (Registration flow - Component: RegistrationFlow.tsx exists)
- ❌ `/dashboard/hcp/tickets` - **MISSING** (My Tickets - Component: MyTickets.tsx exists)
- ❌ `/dashboard/hcp/tickets/[id]` - **MISSING** (Ticket detail with QR code)
- ❌ `/dashboard/hcp/certificates` - **MISSING** (Certificate portfolio - Component: CertificatePortfolio.tsx exists)
- ❌ `/dashboard/hcp/certificates/[id]` - **MISSING** (Certificate detail/PDF viewer)

**Status:** ❌ **5/8 routes missing** - Journey is broken

---

### Journey 2: Organizer Creates and Publishes Event

**Blueprint Flow:**
```
1. Organizer logs in → Dashboard
2. Clicks "Create New Event"
3. Event Creation Wizard (7 steps)
4. Event saved as "Draft" or "Pending Approval"
5. SCFHS review process (status updates)
6. Upon approval: Event published
7. Real-time dashboard shows registrations
```

**Routes Required:**
- ✅ `/dashboard/organizer` - EXISTS
- ❌ `/dashboard/organizer/events/create` - **MISSING** (Event creation wizard - Component: EnhancedEventWizard.tsx exists)
- ❌ `/dashboard/organizer/events/[id]` - **MISSING** (Event management dashboard - Component: EventDashboard.tsx exists)
- ❌ `/dashboard/organizer/events/[id]/edit` - **MISSING** (Edit event)
- ❌ `/dashboard/organizer/events/[id]/assign` - **MISSING** (Event assignment - Component: EventAssignment.tsx exists)
- ❌ `/dashboard/organizer/events/[id]/registrations` - **MISSING** (View registrations)
- ❌ `/dashboard/organizer/events/[id]/attendance` - **MISSING** (QR check-in, attendance list)
- ❌ `/dashboard/organizer/events/[id]/certificates` - **MISSING** (Certificate generation)

**Status:** ❌ **7/8 routes missing** - Journey is broken

---

### Journey 3: Event Day - QR Check-In

**Blueprint Flow:**
```
1. HCP arrives at event venue
2. Opens mobile app → "My Events" → Selects event
3. Shows QR code ticket to organizer
4. Organizer scans QR code with mobile app
5. System verifies registration
6. Check-in confirmed
7. Session-specific check-ins (optional)
8. Post-event: Certificates auto-generated
```

**Routes Required:**
- ❌ `/dashboard/hcp/tickets/[id]` - **MISSING** (QR code ticket display)
- ❌ `/dashboard/organizer/events/[id]/checkin` - **MISSING** (QR scanner page - Component: QRScanner exists in EventManagerView)
- ❌ `/dashboard/organizer/events/[id]/attendance` - **MISSING** (Live attendance list)
- ❌ `/dashboard/event-manager/events/[id]/checkin` - **MISSING** (Event manager QR scanner)
- ❌ `/dashboard/event-manager/events/[id]/attendance` - **MISSING** (Event manager attendance)

**Status:** ❌ **5/5 routes missing** - Journey is broken

---

### Journey 4: Vendor Sponsors Event

**Blueprint Flow:**
```
1. Vendor logs in → Marketplace
2. Browses events seeking sponsorship
3. Filters by specialty, attendance, date, location
4. Views event details (target audience, past performance, sponsorship tiers)
5. Selects sponsorship package
6. Sponsorship request sent to organizer
7. Organizer reviews and approves
8. Contract generated
9. Payment processing
10. Sponsorship activated
```

**Routes Required:**
- ✅ `/dashboard/vendor` - EXISTS
- ❌ `/dashboard/vendor/marketplace` - **MISSING** (Marketplace view - Component: AdvancedMarketplace.tsx exists)
- ❌ `/dashboard/vendor/events/[id]` - **MISSING** (Event sponsorship details)
- ❌ `/dashboard/vendor/campaigns/[id]` - **MISSING** (Campaign management - Component: CampaignAnalytics.tsx exists)
- ❌ `/dashboard/organizer/events/[id]/sponsors` - **MISSING** (Sponsorship requests management)
- ❌ `/dashboard/organizer/events/[id]/sponsors/[id]` - **MISSING** (Sponsor approval page)

**Status:** ❌ **5/6 routes missing** - Journey is broken

---

### Journey 5: Regulator Reviews Application

**Blueprint Flow:**
```
1. Regulator logs in → Queue
2. Views pending applications
3. Opens application for review
4. Reviews checklist (compliance, standards)
5. Makes decision (approve/reject/request changes)
6. Decision logged and notified
7. Analytics dashboard shows trends
```

**Routes Required:**
- ✅ `/dashboard/regulator` - EXISTS
- ❌ `/dashboard/regulator/applications/[id]` - **MISSING** (Application review - Component: ReviewWorkflow.tsx exists)
- ❌ `/dashboard/regulator/applications/[id]/decision` - **MISSING** (Decision management - Component: DecisionManagement.tsx exists)
- ❌ `/dashboard/regulator/applications/[id]/checklist` - **MISSING** (Standards checklist - Component: StandardsChecklist.tsx exists)
- ❌ `/dashboard/regulator/analytics` - **MISSING** (National analytics - Component: NationalAnalytics.tsx exists)
- ❌ `/dashboard/regulator/audit` - **MISSING** (Audit tools - Component: AuditTools.tsx exists)

**Status:** ❌ **5/6 routes missing** - Journey is broken

---

## 2. COMPONENT-TO-ROUTE MAPPING

### Components That Need Routes

#### HCP Components
1. **EventDetails.tsx** → ❌ Needs: `/events/[id]` or `/dashboard/hcp/events/[id]`
2. **MyTickets.tsx** → ❌ Needs: `/dashboard/hcp/tickets`
3. **CertificatePortfolio.tsx** → ❌ Needs: `/dashboard/hcp/certificates`
4. **RegistrationFlow.tsx** → ❌ Needs: `/events/[id]/register`

#### Organizer Components
5. **EventDashboard.tsx** → ❌ Needs: `/dashboard/organizer/events/[id]`
6. **EventAssignment.tsx** → ❌ Needs: `/dashboard/organizer/events/[id]/assign`
7. **EnhancedEventWizard.tsx** → ❌ Needs: `/dashboard/organizer/events/create`

#### Vendor Components
8. **AdvancedMarketplace.tsx** → ❌ Needs: `/dashboard/vendor/marketplace`
9. **CampaignAnalytics.tsx** → ❌ Needs: `/dashboard/vendor/campaigns/[id]`
10. **ContentCreation.tsx** → ❌ Needs: `/dashboard/vendor/content` or `/dashboard/vendor/campaigns/[id]/content`

#### Regulator Components
11. **ReviewWorkflow.tsx** → ❌ Needs: `/dashboard/regulator/applications/[id]`
12. **DecisionManagement.tsx** → ❌ Needs: `/dashboard/regulator/applications/[id]/decision`
13. **StandardsChecklist.tsx** → ❌ Needs: `/dashboard/regulator/applications/[id]/checklist`
14. **NationalAnalytics.tsx** → ❌ Needs: `/dashboard/regulator/analytics`
15. **AuditTools.tsx** → ❌ Needs: `/dashboard/regulator/audit`

#### Onboarding Components (ALL MISSING ROUTES)
16. **HCPOnboarding.tsx** → ❌ Needs: `/onboarding/hcp`
17. **OrganizerOnboarding.tsx** → ❌ Needs: `/onboarding/organizer`
18. **VendorOnboarding.tsx** → ❌ Needs: `/onboarding/vendor`
19. **RegulatorOnboarding.tsx** → ❌ Needs: `/onboarding/regulator`
20. **EventManagerOnboarding.tsx** → ❌ Needs: `/onboarding/event-manager`

**Status:** ❌ **20 components without routes**

---

## 3. MARKETPLACE FUNCTIONALITY → MISSING PAGES

### Public Discovery Pages
1. ❌ `/events` - **MISSING** (Public event listing/browse page)
   - **Required for:** SEO, public discovery, unauthenticated browsing
   - **Component:** DiscoveryGrid.tsx exists but only in dashboard

2. ❌ `/events/[id]` - **MISSING** (Public event detail page)
   - **Required for:** SEO, shareable links, public event information
   - **Component:** EventDetails.tsx exists

3. ❌ `/events/[id]/register` - **MISSING** (Public registration flow)
   - **Required for:** Event registration without login requirement
   - **Component:** RegistrationFlow.tsx exists

### Search & Filter Pages
4. ❌ `/events/search` - **MISSING** (Advanced search page)
   - **Required for:** User journey step 2 (Browse All Events with filters)
   - **Blueprint mentions:** "Advanced search page" with filters

5. ❌ `/events/browse` - **MISSING** (Browse events by category/specialty)
   - **Required for:** Marketplace discovery

### Category/Specialty Pages
6. ❌ `/events/specialty/[specialty]` - **MISSING** (Specialty-specific event listings)
   - **Required for:** SEO, specialty-based discovery
   - **Example:** `/events/specialty/cardiology`

7. ❌ `/events/location/[location]` - **MISSING** (Location-based event listings)
   - **Required for:** Location-based discovery
   - **Example:** `/events/location/riyadh`

**Status:** ❌ **7 marketplace pages missing**

---

## 4. MEDICAL EVENTS PLATFORM REQUIREMENTS → MISSING PAGES

### SCFHS Integration Pages
1. ❌ `/dashboard/organizer/events/[id]/accreditation` - **MISSING** (SCFHS application form)
   - **Required for:** Journey 2, Step 2 (Accreditation application)

2. ❌ `/dashboard/organizer/events/[id]/accreditation/status` - **MISSING** (Accreditation status tracking)
   - **Required for:** Journey 2, Step 5 (SCFHS review process)

### Certificate Pages
3. ❌ `/dashboard/hcp/certificates/[id]` - **MISSING** (Certificate detail/PDF viewer)
   - **Component:** CertificatePortfolio.tsx has PDF viewer but no route
   - **Required for:** Certificate viewing, downloading, verification

4. ❌ `/certificates/[certificateNumber]` - **MISSING** (Public certificate verification)
   - **Required for:** Certificate verification without login

### Mumaris Plus Integration
5. ❌ `/dashboard/hcp/mumaris` - **MISSING** (Mumaris Plus sync status)
   - **Blueprint mentions:** CME hours synced to Mumaris Plus

### Profile & Settings
6. ❌ `/dashboard/profile` - **MISSING** (User profile page)
   - **Required for:** Auto-fill registration forms (Journey 1, Step 7)

7. ❌ `/dashboard/settings` - **MISSING** (Account settings)
8. ❌ `/dashboard/settings/notifications` - **MISSING** (Notification preferences)
9. ❌ `/dashboard/settings/security` - **MISSING** (Security settings)

**Status:** ❌ **9 platform-specific pages missing**

---

## 5. PAYMENT & TRANSACTION PAGES

### Payment Processing
1. ❌ `/events/[id]/register/payment` - **MISSING** (Payment page)
   - **Required for:** Journey 1, Step 8 (Payment processing)
   - **Blueprint mentions:** Credit card or SADAD payment

2. ❌ `/dashboard/hcp/payments` - **MISSING** (Payment history)
3. ❌ `/dashboard/hcp/payments/[id]` - **MISSING** (Payment receipt)

### Sponsorship Payments
4. ❌ `/dashboard/vendor/sponsorships/[id]/payment` - **MISSING** (Sponsorship payment)
   - **Required for:** Journey 4, Step 9 (Payment processing)

**Status:** ❌ **4 payment pages missing**

---

## 6. NOTIFICATION & COMMUNICATION PAGES

### Email Verification
1. ❌ `/auth/verify-email` - **MISSING** (Email verification page)
   - **Required for:** New user registration flow

### Notifications
2. ❌ `/dashboard/notifications` - **MISSING** (Notification center)
   - **Blueprint mentions:** Status updates via notifications

**Status:** ❌ **2 notification pages missing**

---

## 7. SUMMARY: MISSING ROUTES BY CATEGORY

### Critical (Breaks User Journeys)
- ❌ `/events/[id]` - Public event detail
- ❌ `/events/[id]/register` - Registration flow
- ❌ `/dashboard/hcp/tickets` - My tickets
- ❌ `/dashboard/hcp/tickets/[id]` - Ticket detail
- ❌ `/dashboard/organizer/events/[id]` - Event management
- ❌ `/dashboard/organizer/events/create` - Event creation
- ❌ `/onboarding/[role]` - Onboarding (5 routes)

**Total Critical:** 10 routes

### High Priority (Core Features)
- ❌ `/dashboard/hcp/certificates` - Certificate portfolio
- ❌ `/dashboard/hcp/certificates/[id]` - Certificate detail
- ❌ `/dashboard/organizer/events/[id]/assign` - Event assignment
- ❌ `/dashboard/organizer/events/[id]/attendance` - Attendance management
- ❌ `/dashboard/vendor/marketplace` - Marketplace
- ❌ `/dashboard/regulator/applications/[id]` - Application review
- ❌ `/events` - Public event listing
- ❌ `/events/search` - Advanced search

**Total High Priority:** 8 routes

### Medium Priority (Enhanced Features)
- ❌ `/dashboard/profile` - User profile
- ❌ `/dashboard/settings/*` - Settings (3 routes)
- ❌ `/dashboard/vendor/campaigns/[id]` - Campaign management
- ❌ `/dashboard/regulator/analytics` - Analytics
- ❌ `/events/[id]/register/payment` - Payment page
- ❌ `/auth/verify-email` - Email verification

**Total Medium Priority:** 7 routes

### Low Priority (Nice to Have)
- ❌ `/events/specialty/[specialty]` - Specialty pages
- ❌ `/events/location/[location]` - Location pages
- ❌ `/certificates/[certificateNumber]` - Public certificate verification
- ❌ `/dashboard/hcp/mumaris` - Mumaris sync

**Total Low Priority:** 4 routes

---

## 8. COMPONENT ACCESSIBILITY ANALYSIS

### Components Currently Inaccessible (No Route)
1. EventDetails.tsx - ❌ No route
2. MyTickets.tsx - ❌ No route
3. CertificatePortfolio.tsx - ❌ No route
4. RegistrationFlow.tsx - ❌ No route
5. EventDashboard.tsx - ❌ No route
6. EventAssignment.tsx - ❌ No route
7. EnhancedEventWizard.tsx - ❌ No route
8. AdvancedMarketplace.tsx - ❌ No route
9. CampaignAnalytics.tsx - ❌ No route
10. ReviewWorkflow.tsx - ❌ No route
11. DecisionManagement.tsx - ❌ No route
12. StandardsChecklist.tsx - ❌ No route
13. NationalAnalytics.tsx - ❌ No route
14. AuditTools.tsx - ❌ No route
15. HCPOnboarding.tsx - ❌ No route
16. OrganizerOnboarding.tsx - ❌ No route
17. VendorOnboarding.tsx - ❌ No route
18. RegulatorOnboarding.tsx - ❌ No route
19. EventManagerOnboarding.tsx - ❌ No route

**Total Inaccessible Components:** 19 components

---

## 9. USER JOURNEY COMPLETENESS

### Journey 1: HCP Discovers and Registers
- **Status:** ❌ **BROKEN** (5/8 routes missing)
- **Blockers:** No event detail page, no registration page, no tickets page

### Journey 2: Organizer Creates Event
- **Status:** ❌ **BROKEN** (7/8 routes missing)
- **Blockers:** No event creation page, no event management page

### Journey 3: QR Check-In
- **Status:** ❌ **BROKEN** (5/5 routes missing)
- **Blockers:** No QR scanner page, no attendance page

### Journey 4: Vendor Sponsors Event
- **Status:** ❌ **BROKEN** (5/6 routes missing)
- **Blockers:** No marketplace page, no sponsorship management

### Journey 5: Regulator Reviews
- **Status:** ❌ **BROKEN** (5/6 routes missing)
- **Blockers:** No application review page, no decision page

**Overall:** ❌ **ALL 5 user journeys are broken**

---

## 10. RECOMMENDATIONS

### Immediate Action Required
1. **Create critical routes** that break user journeys (10 routes)
2. **Map components to routes** (19 components need routes)
3. **Create public event pages** for SEO and discovery (3 routes)
4. **Create onboarding routes** (5 routes - components exist but inaccessible)

### Priority Order
1. **Phase 1:** Critical routes (10) - Fixes broken journeys
2. **Phase 2:** High priority routes (8) - Core features
3. **Phase 3:** Medium priority routes (7) - Enhanced features
4. **Phase 4:** Low priority routes (4) - Nice to have

### Total Missing Routes Identified
**29 routes** identified from project context analysis

---

**Last Updated:** 2024  
**Next Review:** After implementing critical routes



