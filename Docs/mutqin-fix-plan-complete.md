# Mutqin Landing Page — Complete Technical Fix Plan

## Overview

Rebuild the landing page as a full marketing funnel with **self-service registration** (no human-in-the-loop). Use the existing design system already in the project.

---

## Personas (5 Total)

| Persona | Arabic | English | Route |
|---------|--------|---------|-------|
| Healthcare Professional | ممارس صحي | HCP | /register/hcp |
| CME Provider/Organizer | منظم / مقدم خدمة | Organizer | /register/organizer |
| Event Manager | مدير فعاليات | Event Manager | /register/event-manager |
| Vendor/Sponsor | راعٍ / مورد | Sponsor | /register/sponsor |
| Regulator | جهة رقابية | Regulator | /register/regulator |

---

## Critical Fixes Summary

| Issue | Action |
|-------|--------|
| Arabic copy corrupted/garbled | Fix encoding in `src/app/page.tsx` and `src/app/demo/page.tsx` |
| No marketing funnel structure | Rebuild landing page with sections |
| No self-service registration | Add 5-persona registration flow |
| Missing SCFHS trust signals | Add trust bar section |
| Missing social proof assets | Add logo strip (partners/clients/regulators) |
| Missing OG/Twitter image asset | Create `public/og-image.png` (and ar/en variants if needed) |
| No pricing visible | Add pricing section |
| No FAQ | Add FAQ section |
| Missing metadata/SEO | Add per-page metadata + JSON-LD |
| /demo page exposed | Hide from production nav |
| RTL inconsistencies | Use CSS logical properties |
| Accessibility gaps | Add focus states, ARIA labels |
| Form validation gaps | Add zod/react-hook-form validation + inline errors per persona |
| Legal/trust links missing | Ensure Privacy/Terms/Contact links exist and are linked in footer |
| Analytics/telemetry not addressed | Add optional analytics hook (feature-flagged) for landing conversions |

---

## Files to CREATE

### 1. Locale Files

```
src/locales/
├── ar.json              # Arabic translations
├── en.json              # English translations
└── index.ts             # Export helper
```

### 2. Registration Pages

```
src/app/register/
├── page.tsx                 # Role selection landing
├── layout.tsx               # Shared registration layout (optional)
├── hcp/
│   └── page.tsx             # HCP registration form
├── organizer/
│   └── page.tsx             # Organizer registration form
├── event-manager/
│   └── page.tsx             # Event Manager registration form
├── sponsor/
│   └── page.tsx             # Sponsor registration form
├── regulator/
│   └── page.tsx             # Regulator registration form
└── verify/
    └── page.tsx             # Email verification page
```

### 3. Post-Registration Pages

```
src/app/onboarding/
├── page.tsx                 # Onboarding wizard entry
└── [step]/
    └── page.tsx             # Multi-step onboarding (if needed)

src/app/reset-password/
├── page.tsx                 # Request reset
└── confirm/
    └── page.tsx             # Confirm new password (with token)
```

### 4. Landing Page Components

```
src/components/landing/
├── HeroSection.tsx
├── TrustBar.tsx
├── HowItWorksSection.tsx
├── RoleSolutionsSection.tsx    # 5 persona cards
├── FeaturesSection.tsx
├── PricingSection.tsx
├── TestimonialsSection.tsx
├── FAQSection.tsx
└── FinalCTASection.tsx
```

### 5. Registration Components

```
src/components/registration/
├── RoleSelector.tsx            # 5 persona selection grid
├── RegistrationForm.tsx        # Shared form component
├── VerificationForm.tsx        # OTP/code input
└── OnboardingWizard.tsx        # Post-registration flow
```

### 6. Shared Components (if not existing)

```
src/components/ui/
├── Accordion.tsx               # For FAQ
├── PricingCard.tsx             # For pricing section
├── StepIndicator.tsx           # For how-it-works & onboarding
└── TrustBadge.tsx              # For trust bar items
```

### 7. API Routes (if using Next.js API routes)

```
src/app/api/
├── auth/
│   ├── register/
│   │   └── route.ts            # POST: Create account
│   ├── verify/
│   │   └── route.ts            # POST: Verify email
│   ├── resend-verification/
│   │   └── route.ts            # POST: Resend code
│   ├── reset-password/
│   │   └── route.ts            # POST: Request reset
│   └── reset-password-confirm/
│       └── route.ts            # POST: Confirm new password
└── user/
    └── onboarding/
        └── route.ts            # POST/PUT: Save onboarding data
```

### 8. Types

```
src/types/
├── user.ts                     # User types, roles enum
├── registration.ts             # Registration form types
└── locale.ts                   # i18n types
```

### 9. Structured Data

```
src/components/seo/
├── OrganizationSchema.tsx      # JSON-LD for Organization
├── MedicalOrganizationSchema.tsx
└── WebsiteSchema.tsx
```

---

## Files to MODIFY

### 1. Landing Page (Complete Rebuild)

```
src/app/page.tsx                # Replace entirely with new marketing funnel
```

### 2. Root Layout

- src/app/layout.tsx
  - Add root metadata (title, description, OG, Twitter)
  - Add JSON-LD structured data components
  - Ensure Cairo font is loaded
  - Ensure dir attribute switches for RTL
  - Reference OG image asset (/og-image.png) and ensure it exists

### 3. Language Hook

```
src/hooks/useLanguage.ts        # Update to consume locale files from src/locales/
```

### 4. Navigation/Header

- src/components/Header.tsx (or nav component)
  - Add "Create Account" CTA button
  - Remove /demo from nav links (or hide in production)
  - Ensure nav items come from locale files
  - Add optional top-level links to Pricing/FAQ (anchor or routes)

### 5. Footer

- src/components/Footer.tsx (or footer component)
  - Add Privacy Policy link
  - Add Terms & Conditions link
  - Add Contact/Support link
  - Ensure content comes from locale files
  - Add social/email/phone contact if available

### 6. Demo Page

```
src/app/demo/page.tsx           # Add production redirect
```

### 7. Middleware (if exists)

```
src/middleware.ts               # Check for:
├── Locale detection/routing
├── Auth redirects (protect dashboard, allow register)
└── Any route guards that might block new pages
```

### 8. Next.js Config

```
next.config.js                  # Check for:
├── i18n configuration (if using built-in)
├── Redirects (ensure no conflicts with new routes)
└── Any rewrites affecting /register/*
```

### 9. Tailwind Config (if RTL plugin needed)

```
tailwind.config.js              # Add RTL plugin if not present:
├── require('tailwindcss-rtl') in plugins
└── Or use native Tailwind RTL classes
```

### 10. Global CSS

```
src/app/globals.css             # (or equivalent)
├── Add focus-visible styles
├── Ensure logical properties used (margin-inline-start, etc.)
└── Verify Cairo font-family is set
```

---

## Routing Checklist

### New Public Routes (No Auth Required)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing page | Marketing funnel |
| `/register` | Role selection | Choose persona |
| `/register/hcp` | HCP form | Self-service registration |
| `/register/organizer` | Organizer form | Self-service registration |
| `/register/event-manager` | Event Manager form | Self-service registration |
| `/register/sponsor` | Sponsor form | Self-service registration |
| `/register/regulator` | Regulator form | Self-service registration |
| `/register/verify` | Email verification | Confirm account |
| `/reset-password` | Request reset | Forgot password |
| `/reset-password/confirm` | Set new password | With token |
| `/pricing` | Pricing page (optional) | If separate from landing |
| `/faq` | FAQ page (optional) | If separate from landing |
| `/privacy` | Privacy Policy | Legal/trust |
| `/terms` | Terms & Conditions | Legal/trust |
| `/contact` | Contact/Support | Legal/trust |

### Auth-Protected Routes (Existing - Verify No Conflicts)

| Route | Should Require Auth? |
|-------|---------------------|
| `/dashboard` | Yes |
| `/events` | Depends (browse public, manage protected) |
| `/profile` | Yes |
| `/settings` | Yes |

### Routes to Hide/Redirect

| Route | Action |
|-------|--------|
| `/demo` | Redirect to `/` in production |
| Any old `/login` or `/signup` | Redirect to `/register` if exists |

---

## Middleware Considerations

If `src/middleware.ts` exists, ensure:

```typescript
// src/middleware.ts

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  const publicRoutes = [
    '/',
    '/register',
    '/register/hcp',
    '/register/organizer',
    '/register/event-manager',
    '/register/sponsor',
    '/register/regulator',
    '/register/verify',
    '/reset-password',
    '/reset-password/confirm',
    '/events',  // if public browsing allowed
    '/pricing',
    '/faq',
    '/privacy',
    '/terms',
    '/contact',
  ];
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // ... rest of auth logic
}

export const config = {
  matcher: [
    // Ensure new routes are not accidentally blocked
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## i18n Key Strings (Both Languages)

### ar.json must include:

```json
{
  "brand": {
    "name": "مُتْقِن",
    "tagline": "مُوَحَّد. مُوثَّق. مُتاح."
  },
  "nav": { ... },
  "hero": { ... },
  "trust": {
    "scfhs": "متوافق مع معايير الهيئة السعودية للتخصصات الصحية",
    "data_residency": "بيانات مستضافة في المملكة العربية السعودية",
    "mumaris": "متوافق مع منصة ممارس بلس",
    "secure": "تشفير كامل وحماية للبيانات"
  },
  "roles": {
    "hcp": {
      "title": "الممارسون الصحيون",
      "description": "...",
      "benefits": [...],
      "cta": "سجل كممارس صحي"
    },
    "organizer": {
      "title": "مقدمو خدمات التعليم الطبي",
      "description": "...",
      "benefits": [...],
      "cta": "سجل كمنظم"
    },
    "event_manager": {
      "title": "مديرو الفعاليات",
      "description": "...",
      "benefits": [...],
      "cta": "سجل كمدير فعاليات"
    },
    "sponsor": {
      "title": "الرعاة والموردون",
      "description": "...",
      "benefits": [...],
      "cta": "سجل كراعٍ"
    },
    "regulator": {
      "title": "الجهات الرقابية",
      "description": "...",
      "benefits": [...],
      "cta": "سجل كجهة رقابية"
    }
  },
  "how_it_works": { ... },
  "features": { ... },
  "pricing": { ... },
  "faq": { ... },
  "cta": { ... },
  "registration": { ... },
  "verification": { ... },
  "footer": { ... }
}
```

### en.json must include:

```json
{
  "brand": {
    "name": "Mutqin",
    "tagline": "Unified. Verified. Accessible."
  },
  // ... mirror ar.json structure
}
```

---

## Landing Page Section Stack

```tsx
// src/app/page.tsx

export default function LandingPage() {
  return (
    <main>
      <Header />                    {/* With registration CTA */}
      <HeroSection />               {/* Headline + tagline + CTAs + stats */}
      <TrustBar />                  {/* SCFHS, data residency, security */}
      <HowItWorksSection />         {/* 5 steps */}
      <RoleSolutionsSection />      {/* 5 persona cards */}
      <FeaturesSection />           {/* Platform features grid */}
      <PricingSection />            {/* 3 tiers, self-service CTAs */}
      <TestimonialsSection />       {/* Social proof */}
      <FAQSection />                {/* Accordion - 6+ questions */}
      <FinalCTASection />           {/* Repeat primary CTA */}
      <Footer />                    {/* Links, contact, legal */}
    </main>
  );
}
```

---

## FAQ Content (Required - 6 Minimum)

| Question (AR) | Question (EN) | Answer Summary |
|---------------|---------------|----------------|
| هل مُتْقِن معتمد من الهيئة السعودية للتخصصات الصحية؟ | Is Mutqin recognized by SCFHS? | Aligned with SCFHS standards, events are accredited |
| كيف أتتبع ساعات التعليم المستمر؟ | How do I track my CME hours? | Dashboard + exportable reports for Mumaris Plus |
| هل بياناتي آمنة؟ | Is my data safe? | Encrypted, hosted in Saudi Arabia |
| هل يمكنني إلغاء حسابي؟ | Can I cancel my account? | Yes, anytime from settings |
| كيف أحصل على شهادتي؟ | How do I get my certificate? | Automatic after QR check-in at event |
| ما طرق الدفع المتاحة؟ | What payment methods are available? | Mada, Visa, Mastercard, Apple Pay |

---

## Pricing Section Structure

| Tier | Arabic | Price | CTA | Destination |
|------|--------|-------|-----|-------------|
| Free | مجاني | ر.س 0 | ابدأ مجاناً | /register/hcp |
| Organizer | المنظمين | يبدأ من ر.س X | ابدأ كمنظم | /register/organizer |
| Enterprise | المؤسسات | مخصص | تواصل معنا | mailto: or /contact |

**Note:** Free & Organizer tiers go directly to registration. Only Enterprise has contact CTA.

---

## Metadata Per Page

### Landing Page
```tsx
// src/app/page.tsx
export const metadata: Metadata = {
  title: 'مُتْقِن | منصة التعليم الطبي المستمر في السعودية',
  description: 'المنصة الموحدة للتعليم الطبي المستمر المعتمد. مُوَحَّد. مُوثَّق. مُتاح.',
  openGraph: {
    title: 'مُتْقِن | منصة التعليم الطبي المستمر',
    description: 'المنصة الموحدة للتعليم الطبي المستمر في المملكة',
    images: ['/og-image.png'],
  },
};
```

### Registration Pages
```tsx
// src/app/register/page.tsx
export const metadata: Metadata = {
  title: 'إنشاء حساب | مُتْقِن',
  description: 'سجل في مُتْقِن وابدأ رحلتك في التعليم الطبي المستمر',
};

// src/app/register/hcp/page.tsx
export const metadata: Metadata = {
  title: 'تسجيل ممارس صحي | مُتْقِن',
  description: 'سجل كممارس صحي وتتبع ساعات التعليم المستمر',
};

// ... similar for other registration pages
```

---

## Registration Form Fields Per Persona

### HCP (Healthcare Professional)
- Full name (الاسم الكامل)
- Email (البريد الإلكتروني)
- Phone (رقم الجوال)
- Password (كلمة المرور)
- Specialty (التخصص) - dropdown
- SCFHS Number (رقم التسجيل في الهيئة) - optional
- Organization (جهة العمل) - optional

### Organizer (CME Provider)
- Organization name (اسم المنظمة)
- Contact person name (اسم المسؤول)
- Email (البريد الإلكتروني)
- Phone (رقم الجوال)
- Password (كلمة المرور)
- Organization type (نوع المنظمة) - dropdown
- SCFHS Provider ID (رقم اعتماد الهيئة) - optional

### Event Manager
- Full name (الاسم الكامل)
- Email (البريد الإلكتروني)
- Phone (رقم الجوال)
- Password (كلمة المرور)
- Associated organization (المنظمة التابع لها)
- Role (الدور الوظيفي)

### Sponsor/Vendor
- Company name (اسم الشركة)
- Contact person name (اسم المسؤول)
- Email (البريد الإلكتروني)
- Phone (رقم الجوال)
- Password (كلمة المرور)
- Industry (القطاع) - dropdown
- Sponsorship interest (نوع الرعاية المطلوبة)

### Regulator
- Organization name (اسم الجهة)
- Contact person name (اسم المسؤول)
- Official email (البريد الإلكتروني الرسمي)
- Phone (رقم الجوال)
- Password (كلمة المرور)
- Role/Title (المسمى الوظيفي)

---

## Validation Checklist

### Before Deployment

```bash
npm run type-check      # TypeScript errors
npm run lint            # ESLint issues
npm run build           # Build succeeds
```

### Manual Testing Matrix

| Test | Desktop | Mobile | RTL (AR) | LTR (EN) |
|------|---------|--------|----------|----------|
| Landing page renders | ☐ | ☐ | ☐ | ☐ |
| All 5 persona cards visible | ☐ | ☐ | ☐ | ☐ |
| Hero CTAs work | ☐ | ☐ | ☐ | ☐ |
| Trust bar displays | ☐ | ☐ | ☐ | ☐ |
| Pricing section visible | ☐ | ☐ | ☐ | ☐ |
| FAQ accordion works | ☐ | ☐ | ☐ | ☐ |
| /register loads | ☐ | ☐ | ☐ | ☐ |
| /register/hcp form works | ☐ | ☐ | ☐ | ☐ |
| /register/organizer form works | ☐ | ☐ | ☐ | ☐ |
| /register/event-manager form works | ☐ | ☐ | ☐ | ☐ |
| /register/sponsor form works | ☐ | ☐ | ☐ | ☐ |
| /register/regulator form works | ☐ | ☐ | ☐ | ☐ |
| Email verification flow | ☐ | ☐ | ☐ | ☐ |
| Password reset flow | ☐ | ☐ | ☐ | ☐ |
| Arabic text not garbled | ☐ | ☐ | ☐ | ☐ |
| Focus states visible | ☐ | ☐ | ☐ | ☐ |
| /demo redirects in prod | ☐ | ☐ | ☐ | ☐ |

---

## Dependencies to Check/Add

```bash
# Check if these are installed, add if missing:

# i18n (if not using custom solution)
npm install i18next react-i18next

# RTL support for Tailwind (if needed)
npm install tailwindcss-rtl

# Form handling (if not present)
npm install react-hook-form zod @hookform/resolvers

# Icons (if not present)
npm install lucide-react
```

---

## Summary: All Files

### CREATE (New Files)
- `src/locales/ar.json`
- `src/locales/en.json`
- `src/locales/index.ts`
- `src/app/register/page.tsx`
- `src/app/register/layout.tsx` (optional)
- `src/app/register/hcp/page.tsx`
- `src/app/register/organizer/page.tsx`
- `src/app/register/event-manager/page.tsx`
- `src/app/register/sponsor/page.tsx`
- `src/app/register/regulator/page.tsx`
- `src/app/register/verify/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/reset-password/page.tsx`
- `src/app/reset-password/confirm/page.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/TrustBar.tsx`
- `src/components/landing/HowItWorksSection.tsx`
- `src/components/landing/RoleSolutionsSection.tsx`
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/PricingSection.tsx`
- `src/components/landing/TestimonialsSection.tsx`
- `src/components/landing/FAQSection.tsx`
- `src/components/landing/FinalCTASection.tsx`
- `src/components/registration/RoleSelector.tsx`
- `src/components/registration/RegistrationForm.tsx`
- `src/components/registration/VerificationForm.tsx`
- `src/components/seo/OrganizationSchema.tsx`
- `src/types/registration.ts` (if not exists)
- API routes as needed

### MODIFY (Existing Files)
- `src/app/page.tsx` — Complete rebuild
- `src/app/layout.tsx` — Add metadata, structured data
- `src/app/demo/page.tsx` — Add production redirect
- `src/hooks/useLanguage.ts` — Consume locale files
- `src/components/Header.tsx` — Add register CTA, remove demo link
- `src/components/Footer.tsx` — Add legal links
- `src/middleware.ts` — Ensure new routes are public
- `next.config.js` — Check i18n/redirects
- `tailwind.config.js` — Add RTL plugin if needed
- `src/app/globals.css` — Focus states, logical properties

### VERIFY (Check for Conflicts)
- Any existing auth/routing logic
- Any existing registration flows (redirect to new)
- Protected route middleware
- API route structure

---

## Implementation Order

### Phase 1: Foundation (Do First)
| Task | Files | Priority |
|------|-------|----------|
| Create locale files | `src/locales/ar.json`, `en.json`, `index.ts` | 🔴 Critical |
| Update useLanguage hook | `src/hooks/useLanguage.ts` | 🔴 Critical |
| Fix garbled Arabic in existing files | `src/app/page.tsx`, `src/app/demo/page.tsx` | 🔴 Critical |

### Phase 2: Registration Flow
| Task | Files | Priority |
|------|-------|----------|
| Role selector page | `src/app/register/page.tsx` | 🔴 Critical |
| HCP registration | `src/app/register/hcp/page.tsx` | 🔴 Critical |
| Organizer registration | `src/app/register/organizer/page.tsx` | 🔴 Critical |
| Event Manager registration | `src/app/register/event-manager/page.tsx` | 🔴 Critical |
| Sponsor registration | `src/app/register/sponsor/page.tsx` | 🔴 Critical |
| Regulator registration | `src/app/register/regulator/page.tsx` | 🔴 Critical |
| Email verification | `src/app/register/verify/page.tsx` | 🔴 Critical |
| Registration components | `src/components/registration/*` | 🔴 Critical |
| Password reset flow | `src/app/reset-password/*` | 🟡 High |
| Onboarding wizard | `src/app/onboarding/page.tsx` | 🟡 High |

### Phase 3: Landing Page Rebuild
| Task | Files | Priority |
|------|-------|----------|
| Hero section | `src/components/landing/HeroSection.tsx` | 🔴 Critical |
| Trust bar | `src/components/landing/TrustBar.tsx` | 🔴 Critical |
| Role solutions (5 personas) | `src/components/landing/RoleSolutionsSection.tsx` | 🔴 Critical |
| How it works | `src/components/landing/HowItWorksSection.tsx` | 🟡 High |
| Features grid | `src/components/landing/FeaturesSection.tsx` | 🟡 High |
| Pricing section | `src/components/landing/PricingSection.tsx` | 🔴 Critical |
| FAQ section | `src/components/landing/FAQSection.tsx` | 🔴 Critical |
| Testimonials | `src/components/landing/TestimonialsSection.tsx` | 🟠 Medium |
| Final CTA | `src/components/landing/FinalCTASection.tsx` | 🟡 High |
| Assemble landing page | `src/app/page.tsx` | 🔴 Critical |

### Phase 4: Navigation & Layout
| Task | Files | Priority |
|------|-------|----------|
| Update header with register CTA | `src/components/Header.tsx` | 🔴 Critical |
| Update footer with legal links | `src/components/Footer.tsx` | 🟡 High |
| Hide demo page in production | `src/app/demo/page.tsx` | 🟡 High |
| Update middleware for new routes | `src/middleware.ts` | 🔴 Critical |

### Phase 5: SEO & Metadata
| Task | Files | Priority |
|------|-------|----------|
| Root layout metadata | `src/app/layout.tsx` | 🟡 High |
| Landing page metadata | `src/app/page.tsx` | 🟡 High |
| Registration pages metadata | `src/app/register/*/page.tsx` | 🟡 High |
| JSON-LD structured data | `src/components/seo/*` | 🟠 Medium |

### Phase 6: Polish & Accessibility
| Task | Files | Priority |
|------|-------|----------|
| Focus-visible styles | `src/app/globals.css` | 🟡 High |
| ARIA labels on icon buttons | Various components | 🟡 High |
| RTL logical properties | Various CSS | 🟡 High |
| FAQ accordion accessibility | `src/components/landing/FAQSection.tsx` | 🟡 High |

---

## Estimated Time

| Phase | Estimated Hours |
|-------|-----------------|
| Phase 1: Foundation | 2-3 hours |
| Phase 2: Registration Flow | 6-8 hours |
| Phase 3: Landing Page | 5-6 hours |
| Phase 4: Navigation & Layout | 1-2 hours |
| Phase 5: SEO & Metadata | 1-2 hours |
| Phase 6: Polish & Accessibility | 2-3 hours |
| Testing & Fixes | 2-3 hours |
| **Total** | **19-27 hours** |

---

## Success Criteria

The implementation is complete when:

### Functional Requirements
- [ ] User can access landing page in Arabic and English
- [ ] User can select from 5 persona types on /register
- [ ] User can complete registration for any persona without human interaction
- [ ] User receives email verification after registration
- [ ] User can reset password without human interaction
- [ ] User is redirected to onboarding after verification
- [ ] All CTAs on landing page lead to /register or /register/[role]
- [ ] No "Book Demo" or "Contact Sales" CTAs (except Enterprise tier)
- [ ] /demo is not accessible in production

### Content Requirements
- [ ] Arabic text displays correctly (no garbled characters)
- [ ] All 5 personas have visible cards on landing page
- [ ] Trust bar shows SCFHS alignment, data residency, security
- [ ] FAQ has minimum 6 questions answered
- [ ] Pricing section shows 3 tiers with clear CTAs

### Technical Requirements
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] All new routes are accessible (not blocked by middleware)
- [ ] RTL layout works correctly in Arabic mode
- [ ] Focus states visible on all interactive elements

### Testing Requirements
- [ ] Landing page tested on Desktop + Mobile
- [ ] Landing page tested in Arabic (RTL) + English (LTR)
- [ ] All 5 registration forms submit successfully
- [ ] Email verification flow works end-to-end
- [ ] Password reset flow works end-to-end

---

## Important Notes for Agent

### Do NOT
- Change existing color palette or design system
- Add "Book Demo" or "Contact Sales" CTAs for non-Enterprise users
- Skip any of the 5 personas
- Leave demo page accessible in production
- Hardcode Arabic/English strings (use locale files)

### Do
- Use existing design system components where available
- Pull all strings from locale files
- Ensure all new routes are added to middleware whitelist
- Test RTL layout for all new components
- Include proper TypeScript types for form data

### Watch Out For
- Existing auth logic that might redirect /register routes
- Middleware that might block new public routes
- Any hardcoded strings in existing components that need locale support
- Form validation that might differ per persona

### If Stuck
- Check `src/middleware.ts` for route blocking
- Check `next.config.js` for redirects
- Check existing auth context/providers for redirect logic
- Verify API routes exist for registration endpoints

---

## Handoff Checklist

Before marking complete, verify:

```
[ ] All 28 new files created
[ ] All 10 existing files modified
[ ] Locale files have all required keys
[ ] All 5 persona registration forms work
[ ] Landing page has all 10 sections
[ ] Middleware allows all new public routes
[ ] npm run build passes
[ ] Manual testing matrix completed
[ ] No TypeScript errors
[ ] No console errors in browser
```
