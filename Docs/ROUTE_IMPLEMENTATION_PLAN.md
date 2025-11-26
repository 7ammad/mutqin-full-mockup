# Route Implementation Plan
## Event-Med Platform - Complete Route Structure

**Status:** Planning Phase  
**Last Updated:** 2024  
**Methodology:** Route-First Development

---

## Route Structure Overview

```
app/
├── page.tsx                          ✅ EXISTS (Landing)
├── layout.tsx                        ✅ EXISTS
├── not-found.tsx                     ❌ MISSING
├── error.tsx                         ❌ MISSING
├── sitemap.ts                        ❌ MISSING
│
├── auth/
│   ├── login/
│   │   └── page.tsx                 ✅ EXISTS
│   ├── register/
│   │   └── page.tsx                 ❌ MISSING
│   ├── forgot-password/
│   │   └── page.tsx                 ❌ MISSING
│   └── reset-password/
│       └── page.tsx                 ❌ MISSING
│
├── dashboard/
│   ├── layout.tsx                   ✅ EXISTS
│   ├── page.tsx                     ❌ MISSING (CRITICAL)
│   ├── profile/
│   │   └── page.tsx                 ❌ MISSING
│   ├── settings/
│   │   ├── page.tsx                 ❌ MISSING
│   │   ├── notifications/
│   │   │   └── page.tsx             ❌ MISSING
│   │   └── security/
│   │       └── page.tsx             ❌ MISSING
│   │
│   ├── hcp/
│   │   ├── page.tsx                 ✅ EXISTS
│   │   ├── events/
│   │   │   └── [id]/
│   │   │       └── page.tsx         ❌ MISSING
│   │   ├── tickets/
│   │   │   ├── page.tsx             ❌ MISSING
│   │   │   └── [id]/
│   │   │       └── page.tsx         ❌ MISSING
│   │   └── certificates/
│   │       ├── page.tsx             ❌ MISSING
│   │       └── [id]/
│   │           └── page.tsx         ❌ MISSING
│   │
│   ├── organizer/
│   │   ├── page.tsx                 ✅ EXISTS
│   │   └── events/
│   │       └── [id]/
│   │           └── page.tsx         ❌ MISSING
│   │
│   ├── vendor/
│   │   ├── page.tsx                 ✅ EXISTS
│   │   └── campaigns/
│   │       └── [id]/
│   │           └── page.tsx         ❌ MISSING
│   │
│   ├── regulator/
│   │   ├── page.tsx                 ✅ EXISTS
│   │   └── applications/
│   │       └── [id]/
│   │           └── page.tsx         ❌ MISSING
│   │
│   └── event-manager/
│       ├── page.tsx                 ✅ EXISTS
│       └── events/
│           └── [id]/
│               └── page.tsx         ❌ MISSING
│
├── events/
│   └── [id]/
│       ├── page.tsx                 ❌ MISSING (public event view)
│       └── register/
│           └── page.tsx            ❌ MISSING
│
├── onboarding/
│   ├── hcp/
│   │   └── page.tsx                 ❌ MISSING
│   ├── organizer/
│   │   └── page.tsx                 ❌ MISSING
│   ├── vendor/
│   │   └── page.tsx                 ❌ MISSING
│   ├── regulator/
│   │   └── page.tsx                 ❌ MISSING
│   └── event-manager/
│       └── page.tsx                 ❌ MISSING
│
└── demo/
    └── page.tsx                     ✅ EXISTS
```

---

## Priority 1: Critical Routes (Fix Immediately)

### Route: /dashboard
- **File:** `src/app/dashboard/page.tsx`
- **Purpose:** Base dashboard route - redirects to role-specific dashboard
- **Components:** None (redirect only)
- **Data Required:** User role from auth context
- **User Actions:** Auto-redirect based on role
- **Protection:** Protected (requires auth)
- **Dependencies:** AuthContext
- **Status:** ❌ MISSING - **CRITICAL - BREAKS LOGIN REDIRECT**
- **Fix:** Create redirect page

### Route: /not-found
- **File:** `src/app/not-found.tsx`
- **Purpose:** 404 error page
- **Components:** ErrorBoundary, GlassButton
- **Data Required:** None
- **User Actions:** Navigate back or to home
- **Protection:** Public
- **Status:** ❌ MISSING
- **Fix:** Create 404 page

### Route: /error
- **File:** `src/app/error.tsx`
- **Purpose:** Global error boundary
- **Components:** ErrorBoundary
- **Data Required:** Error object
- **User Actions:** Retry or navigate away
- **Protection:** Public
- **Status:** ❌ MISSING
- **Fix:** Create error page

---

## Priority 2: High-Value Routes

### Route: /events/[id]
- **File:** `src/app/events/[id]/page.tsx`
- **Purpose:** Public event detail page
- **Components:** EventDetails, EventCard (related), ShareButton
- **Data Required:** Event data by ID, related events
- **User Actions:** View details, register (if authenticated), share
- **Protection:** Public
- **Dependencies:** EventDetails component exists
- **Status:** ❌ MISSING
- **Fix:** Create public event detail route

### Route: /onboarding/[role]
- **Files:** 
  - `src/app/onboarding/hcp/page.tsx`
  - `src/app/onboarding/organizer/page.tsx`
  - `src/app/onboarding/vendor/page.tsx`
  - `src/app/onboarding/regulator/page.tsx`
  - `src/app/onboarding/event-manager/page.tsx`
- **Purpose:** Role-specific onboarding flows
- **Components:** 
  - HCPOnboarding (exists)
  - OrganizerOnboarding (exists)
  - VendorOnboarding (exists)
  - RegulatorOnboarding (exists)
  - EventManagerOnboarding (exists)
- **Data Required:** User role, onboarding state
- **User Actions:** Complete onboarding steps
- **Protection:** Protected (role-specific)
- **Dependencies:** All onboarding components exist but no routes
- **Status:** ❌ MISSING - **ALL COMPONENTS EXIST BUT INACCESSIBLE**
- **Fix:** Create onboarding routes for each role

### Route: /dashboard/profile
- **File:** `src/app/dashboard/profile/page.tsx`
- **Purpose:** User profile management
- **Components:** ProfileForm, AvatarUpload
- **Data Required:** User profile data
- **User Actions:** Edit profile, upload avatar, update preferences
- **Protection:** Protected
- **Status:** ❌ MISSING
- **Fix:** Create profile page

---

## Priority 3: Feature Routes

### Route: /dashboard/hcp/events/[id]
- **File:** `src/app/dashboard/hcp/events/[id]/page.tsx`
- **Purpose:** HCP view of event details (with registration)
- **Components:** EventDetails, RegistrationButton, MyTickets link
- **Data Required:** Event data, user registration status
- **User Actions:** View details, register, navigate to tickets
- **Protection:** Protected (HCP role)
- **Dependencies:** EventDetails component exists
- **Status:** ❌ MISSING
- **Fix:** Create HCP event detail route

### Route: /dashboard/hcp/tickets
- **File:** `src/app/dashboard/hcp/tickets/page.tsx`
- **Purpose:** HCP ticket list
- **Components:** MyTickets (exists)
- **Data Required:** User tickets
- **User Actions:** View tickets, navigate to ticket detail
- **Protection:** Protected (HCP role)
- **Dependencies:** MyTickets component exists
- **Status:** ❌ MISSING
- **Fix:** Create tickets list route

### Route: /dashboard/hcp/tickets/[id]
- **File:** `src/app/dashboard/hcp/tickets/[id]/page.tsx`
- **Purpose:** HCP ticket detail
- **Components:** TicketDetail, QRCode, CheckInButton
- **Data Required:** Ticket data by ID
- **User Actions:** View ticket, check in, download
- **Protection:** Protected (HCP role)
- **Status:** ❌ MISSING
- **Fix:** Create ticket detail route

### Route: /dashboard/hcp/certificates
- **File:** `src/app/dashboard/hcp/certificates/page.tsx`
- **Purpose:** HCP certificate portfolio
- **Components:** CertificatePortfolio (exists)
- **Data Required:** User certificates
- **User Actions:** View certificates, download, share
- **Protection:** Protected (HCP role)
- **Dependencies:** CertificatePortfolio component exists
- **Status:** ❌ MISSING
- **Fix:** Create certificates list route

### Route: /dashboard/hcp/certificates/[id]
- **File:** `src/app/dashboard/hcp/certificates/[id]/page.tsx`
- **Purpose:** HCP certificate detail
- **Components:** PDFViewer, CertificateDetail
- **Data Required:** Certificate data by ID
- **User Actions:** View certificate, download, verify
- **Protection:** Protected (HCP role)
- **Status:** ❌ MISSING
- **Fix:** Create certificate detail route

### Route: /events/[id]/register
- **File:** `src/app/events/[id]/register/page.tsx`
- **Purpose:** Public event registration flow
- **Components:** RegistrationFlow (exists)
- **Data Required:** Event data, registration form data
- **User Actions:** Fill form, submit registration, payment
- **Protection:** Public (but requires auth for submission)
- **Dependencies:** RegistrationFlow component exists
- **Status:** ❌ MISSING
- **Fix:** Create registration route

---

## Priority 4: Organizer Routes

### Route: /dashboard/organizer/events/[id]
- **File:** `src/app/dashboard/organizer/events/[id]/page.tsx`
- **Purpose:** Organizer event management
- **Components:** EventDashboard (exists), EventAssignment, CertificateGenerator
- **Data Required:** Event data, registrations, analytics
- **User Actions:** Manage event, view analytics, assign manager, generate certificates
- **Protection:** Protected (ORGANIZER role)
- **Dependencies:** EventDashboard component exists
- **Status:** ❌ MISSING
- **Fix:** Create organizer event detail route

---

## Priority 5: Settings Routes

### Route: /dashboard/settings
- **File:** `src/app/dashboard/settings/page.tsx`
- **Purpose:** Account settings overview
- **Components:** SettingsMenu, ProfileSection
- **Data Required:** User settings
- **User Actions:** Navigate to sub-settings
- **Protection:** Protected
- **Status:** ❌ MISSING
- **Fix:** Create settings page

### Route: /dashboard/settings/notifications
- **File:** `src/app/dashboard/settings/notifications/page.tsx`
- **Purpose:** Notification preferences
- **Components:** NotificationSettings
- **Data Required:** User notification preferences
- **User Actions:** Toggle notifications, set preferences
- **Protection:** Protected
- **Status:** ❌ MISSING
- **Fix:** Create notifications settings page

### Route: /dashboard/settings/security
- **File:** `src/app/dashboard/settings/security/page.tsx`
- **Purpose:** Security settings
- **Components:** SecuritySettings, PasswordChange, TwoFactor
- **Data Required:** User security settings
- **User Actions:** Change password, enable 2FA
- **Protection:** Protected
- **Status:** ❌ MISSING
- **Fix:** Create security settings page

---

## Implementation Order

### Phase 1: Critical Fixes (Week 1)
1. ✅ `/dashboard` - Fix broken redirect
2. ✅ `/not-found` - Error handling
3. ✅ `/error` - Error boundary

### Phase 2: Core Routes (Week 2)
4. ✅ `/events/[id]` - Public event view
5. ✅ `/onboarding/[role]` - All 5 onboarding routes
6. ✅ `/dashboard/profile` - User profile

### Phase 3: HCP Routes (Week 3)
7. ✅ `/dashboard/hcp/events/[id]` - Event detail
8. ✅ `/dashboard/hcp/tickets` - Ticket list
9. ✅ `/dashboard/hcp/tickets/[id]` - Ticket detail
10. ✅ `/dashboard/hcp/certificates` - Certificate list
11. ✅ `/dashboard/hcp/certificates/[id]` - Certificate detail

### Phase 4: Feature Routes (Week 4)
12. ✅ `/events/[id]/register` - Registration flow
13. ✅ `/dashboard/organizer/events/[id]` - Organizer event management
14. ✅ `/dashboard/settings/*` - Settings pages

---

## Component-to-Route Mapping

### Components with Routes ✅
- HCPView → `/dashboard/hcp`
- OrganizerView → `/dashboard/organizer`
- VendorView → `/dashboard/vendor`
- RegulatorView → `/dashboard/regulator`
- EventManagerView → `/dashboard/event-manager`

### Components WITHOUT Routes ❌
- EventDetails → **NEEDS:** `/events/[id]` or `/dashboard/hcp/events/[id]`
- MyTickets → **NEEDS:** `/dashboard/hcp/tickets`
- CertificatePortfolio → **NEEDS:** `/dashboard/hcp/certificates`
- RegistrationFlow → **NEEDS:** `/events/[id]/register`
- HCPOnboarding → **NEEDS:** `/onboarding/hcp`
- OrganizerOnboarding → **NEEDS:** `/onboarding/organizer`
- VendorOnboarding → **NEEDS:** `/onboarding/vendor`
- RegulatorOnboarding → **NEEDS:** `/onboarding/regulator`
- EventManagerOnboarding → **NEEDS:** `/onboarding/event-manager`
- EventDashboard → **NEEDS:** `/dashboard/organizer/events/[id]`

---

## Route Verification Checklist

### Before Implementation:
- [ ] Route plan document complete
- [ ] All routes planned
- [ ] Component-to-route mapping complete
- [ ] Implementation order determined

### During Implementation:
- [ ] Create route file (page.tsx)
- [ ] Test route navigation
- [ ] Implement components
- [ ] Test route with components
- [ ] Update status in this document

### After Implementation:
- [ ] Route inventory verification
- [ ] Reference verification (grep router.push, href)
- [ ] Component accessibility check
- [ ] User journey testing

---

## Status Tracking

### Critical Routes
- [ ] `/dashboard` - **CRITICAL**
- [ ] `/not-found`
- [ ] `/error`

### High-Value Routes
- [ ] `/events/[id]`
- [ ] `/onboarding/*` (5 routes)
- [ ] `/dashboard/profile`

### Feature Routes
- [ ] `/dashboard/hcp/events/[id]`
- [ ] `/dashboard/hcp/tickets`
- [ ] `/dashboard/hcp/tickets/[id]`
- [ ] `/dashboard/hcp/certificates`
- [ ] `/dashboard/hcp/certificates/[id]`
- [ ] `/events/[id]/register`
- [ ] `/dashboard/organizer/events/[id]`
- [ ] `/dashboard/settings`
- [ ] `/dashboard/settings/notifications`
- [ ] `/dashboard/settings/security`

---

**Total Routes Needed:** ~25  
**Routes Implemented:** 8  
**Routes Missing:** ~17  
**Completion:** 32%

---

**Next Steps:**
1. Fix critical routes (Priority 1)
2. Implement high-value routes (Priority 2)
3. Complete feature routes (Priority 3-5)
4. Verify all routes work
5. Update documentation



