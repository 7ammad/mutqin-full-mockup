# Landing Page Detailed Report

## Overview

The Mutqin landing page is a comprehensive marketing funnel designed to introduce the CME/CPD activities platform to healthcare stakeholders in Saudi Arabia. The page is fully bilingual (Arabic/English) with RTL support, responsive design, and follows the project's design system.

**Main Route:** `/` (src/app/page.tsx)

**Total Sections:** 8 (including Header and Footer)

**Component Architecture:**
- All landing components located in `src/app/_components/landing/`
- Global Header component: `src/components/Header.tsx`
- Uses Liquid Glass design system components
- Fully internationalized via `src/locales/en.json` and `src/locales/ar.json`

---

## Section 1: Header (Global Navigation)

**Component:** `src/components/Header.tsx`

**Type:** Fixed position header with scroll-based styling

### Visual Design

- **Initial State (Top of Page):**
  - Transparent background
  - White text for logo and navigation links
  - White/90 opacity for secondary elements
  - No border

- **Scrolled State (After 50px scroll):**
  - Liquid Glass effect: `bg-[var(--system-background)]/80 backdrop-blur-xl`
  - Border bottom: `border-b border-[var(--border)]`
  - Logo color: `text-[var(--apple-blue)]`
  - Navigation links: `text-[var(--label)]` with hover state `hover:text-[var(--apple-blue)]`
  - Active section highlighting: `text-[var(--apple-blue)]`

- **Auto-hide Behavior:**
  - Hides when scrolling down (after 100px)
  - Shows when scrolling up
  - Smooth animation via Framer Motion

### Navigation Links

All links use anchor hash navigation to scroll to sections:

| Link Key | Label (i18n) | Target Section | Href |
|----------|--------------|---------------|------|
| activities-preview | `nav.activities` | Activities Preview | `#activities-preview` |
| what-is-mutqin | `nav.whatIsMutqin` | What Is Mutqin | `#what-is-mutqin` |
| how-it-works | `nav.howItWorks` | How It Works | `#how-it-works` |
| who-we-serve | `nav.whoWeServe` | Who We Serve | `#who-we-serve` |
| why-it-matters | `nav.whyItMatters` | Why It Matters | `#why-it-matters` |
| demo | `nav.join` | Demo/Join Section | `#demo` |

### Actions

**Primary CTA:**
- Button: "Join us" (`nav.joinUs`)
- Action: Routes to `/register`
- Styling: GlassButton component

**Secondary Action:**
- Link: "Login" (`nav.login`)
- Action: Routes to `/auth/login`
- Hidden on small screens (`hidden sm:block`)

### Additional Controls

1. **Language Toggle:**
   - Icon: Languages (Lucide React)
   - Toggles between Arabic (`ar`) and English (`en`)
   - Updates entire page via LanguageContext

2. **Theme Toggle:**
   - Icons: Moon (dark mode) / Sun (light mode)
   - Toggles between light and dark themes
   - Uses next-themes

### Active Section Detection

The header automatically highlights the active section based on scroll position:
- Detects when section top is within 100px of viewport top
- Updates `activeSection` state
- Applies `text-[var(--apple-blue)]` to active nav link

### Copy (English)

- Brand name: "Mutqin" (from `brand.name`)
- Navigation labels: All from `nav.*` keys
- Join button: "Join us" (`nav.joinUs`)
- Login link: "Login" (`nav.login`)

### Copy (Arabic)

All navigation labels are translated in `src/locales/ar.json` under `nav.*` keys.

---

## Section 2: Hero Section

**Component:** `src/app/_components/landing/LandingHero.tsx`

**Type:** Full-screen hero with animated background

### Visual Design

- **Layout:** Full viewport height (`min-h-screen`)
- **Background Layers (Z-index stacking):**
  1. Base gradient: `bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900` (z-index: 0)
  2. FloatingLines animation: Animated line pattern (z-index: 1)
  3. Dark overlay: `bg-gradient-to-b from-slate-950/50 via-slate-950/40 to-slate-950/70` (z-index: 2)
  4. Content: Relative positioning (z-index: 10)

- **FloatingLines Configuration:**
  - Line distance: `[8]`
  - Line count: `[6]`
  - Creates animated network/connection visual

### Content Structure

**Headline:**
- Text: `landing.hero.headline` (i18n)
- Styling: `text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white`
- Responsive sizing: 3xl → 5xl → 6xl

**Subline:**
- Text: `landing.hero.subline` (i18n)
- Styling: `text-base md:text-lg lg:text-xl text-slate-200/90 max-w-3xl mx-auto`
- Max width constraint for readability

**Primary CTA:**
- Text: `landing.hero.ctaPrimary` (i18n)
- Action: Routes to `/register`
- Styling: `rounded-full px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20`

### Copy (English)

**Headline:**
"Seamless, integrated CME/CPD experience"

**Subline:**
"A single platform that unifies providers, accrediting bodies, execution partners, sponsors, and health practitioners in one clear activity journey."

**Primary CTA:**
"Explore accredited activities"

**Note:** The copy document (`LANDING_PAGE_COPY_EN.md`) shows different copy:
- Badge: "Integrated CME/CPD activities system for healthcare in Saudi Arabia"
- Headline: "Mutqin brings CME/CPD activities into one digital space."
- Subline: "Educational providers, accrediting bodies, hospitals, execution partners, sponsors, and health practitioners collaborate on the same CME/CPD activity in a clear digital journey from first idea to accredited hours."
- Support strip: "One activity – same regulations – a complete view of responsibilities and accredited hours across all parties."
- Primary CTA: "Join the founding members"
- Secondary CTA: "Explore activity pathways"

**Implementation Status:** The component currently uses i18n keys that may differ from the copy document. The copy document appears to be the source of truth for final content.

### Copy (Arabic)

All hero content is translated in `src/locales/ar.json` under `landing.hero.*` keys.

### Technical Implementation

- Uses `useRouter` for navigation
- Uses `useLanguage` context for i18n
- RTL support via `isRTL` flag (currently not used in this component)
- Fully responsive with mobile-first breakpoints

---

## Section 3: Activities Preview Section

**Component:** `src/app/_components/landing/LandingActivitiesPreview.tsx`

**Type:** Interactive activity grid with filtering

### Visual Design

- **Background:** `bg-[var(--system-background)]`
- **Padding:** `py-12 md:py-16 px-4`
- **Max Width:** `max-w-6xl mx-auto`

### Header Layout

**Desktop (RTL-aware):**
- Text block: Left side (RTL: right side), max-width: `md:max-w-xl`
- Filters: Right side (RTL: left side), flex-wrap layout

**Mobile:**
- Stacked vertically

### Content

**Title:**
- Text: `landing.activitiesPreview.title` (i18n)
- Styling: `text-2xl md:text-3xl font-semibold text-[var(--label)]`

**Description:**
- Currently not displayed in component (exists in copy document)

### Filters

Three primary filter dropdowns:

1. **Specialty Filter:**
   - Label: `landing.activitiesPreview.filters.specialty`
   - Options: Dynamically generated from activities data
   - Styling: `rounded-full border border-[var(--border)]`

2. **Format Filter:**
   - Label: `landing.activitiesPreview.filters.format`
   - Options: In-Person, Hybrid, Virtual (language-aware)
   - Styling: Same as specialty filter

3. **City Filter:**
   - Label: `landing.activitiesPreview.filters.city`
   - Options: Dynamically generated from activities data
   - Styling: Same as specialty filter

4. **More Filters Button:**
   - Label: `landing.activitiesPreview.filters.moreFilters`
   - Currently placeholder (no functionality)

### Activity Cards

**Card Structure:**
- Border: `border border-slate-200/80 dark:border-slate-800/80`
- Background: `bg-white/95 dark:bg-[var(--system-background)]/95`
- Shadow: `shadow-[0_10px_30px_rgba(15,23,42,0.06)]` with dark mode variant
- Hover: Enhanced shadow on hover
- Padding: `p-4 md:p-5`

**Card Content (Top to Bottom):**

1. **Tags Row:**
   - Format Badge: Shows activity format (In-Person/Hybrid/Virtual)
   - Specialty Badge: Shows medical specialty
   - Icons: None
   - Alignment: RTL-aware (`justify-end` for RTL, `justify-start` for LTR)

2. **Main Content:**
   - Activity Name: `text-lg font-bold text-[var(--label)] line-clamp-2`
   - Provider: Icon (Building2) + provider name
   - Styling: `text-sm text-[var(--secondary-label)]`

3. **Accredited Hours Strip:**
   - Background: Gradient with `var(--apple-green)` colors
   - Border: `border border-[var(--apple-green)]/40`
   - Content: Clock icon + "Accredited X hours" text
   - Styling: `rounded-lg` with backdrop blur

4. **Footer:**
   - Date: Calendar icon + date range
   - Location: MapPin icon + city and location
   - Border top: `border-t border-[var(--separator)]`

### Data Source

**Primary:** `getLandingEvents()` from `@/lib/dataSource`
**Fallback:** Mock activities array (6 sample activities)

**Mock Activities Include:**
1. Advanced Cardiology Conference 2025 (Riyadh, 18 hours)
2. Pediatric Emergency Medicine Workshop (Riyadh, 12 hours)
3. Family Medicine Update Seminar (Virtual, 6 hours)
4. Surgical Techniques Symposium (Jeddah, 24 hours)
5. Mental Health in Primary Care (Virtual, 8 hours)
6. Oncology Advances Conference (Dammam, 20 hours)

### Filtering Logic

- Filters are applied client-side
- All filters are AND conditions (must match all selected)
- Empty state shown when no activities match

### Copy (English)

**Title:**
"A single view of CME/CPD activities."

**Description (from copy document, not currently displayed):**
"See how activities move through the network from creation to completion in one connected digital system."

**CTA (from copy document, not currently displayed):**
"Explore activity journeys"

**Filter Labels:**
- Specialty: "Specialty"
- Format: "Format"
- City: "City"
- More filters: "More filters"

**Card Labels:**
- Accredited: "SCFHS Accredited"
- Hours: "hour" / "hours" (pluralization handled)

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.activitiesPreview.*` keys.

### Technical Implementation

- State management: `useState` for filters and activities
- Data loading: `useEffect` with async `getLandingEvents()`
- RTL support: Full RTL-aware layout and text direction
- Responsive: Grid layout `md:grid-cols-2 lg:grid-cols-3`
- Empty state: Conditional rendering when `filteredActivities.length === 0`

---

## Section 4: What Is Mutqin

**Component:** `src/app/_components/landing/LandingWhatIs.tsx`

**Type:** Two-column layout with pillars

### Visual Design

- **Background:** `bg-[var(--system-background)]`
- **Padding:** `py-20 px-4`
- **Max Width:** `max-w-7xl mx-auto`
- **Layout:** Grid `grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]`

### Left Column (Content)

**Badge:**
- Text: `landing.whatIs.badge` (i18n)
- Styling: Badge component with `bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/20`

**Headline:**
- Text: `landing.whatIs.headline` (i18n)
- Styling: `text-4xl md:text-5xl font-bold text-[var(--label)]`

**Subline:**
- Text: `landing.whatIs.subline` (i18n)
- Styling: `text-xl text-[var(--secondary-label)]`

**Pillars (3 Cards):**

Each pillar uses LiquidGlassCard with:
- Icon: Shield, Users, or Zap (Lucide React)
- Color: `var(--apple-blue)`, `var(--apple-green)`, or `var(--apple-purple)`
- Layout: Icon on left, text on right
- Padding: `p-6`

**Pillar 1:**
- Title: "One platform instead of scattered spreadsheets"
- Description: "Accreditation requests, scientific plans, attendance, and CME/CPD hours are managed in one place under the same regulations."

**Pillar 2:**
- Title: "Compliance built into every step"
- Description: "From accreditation request to final report, each step has a clear owner and an audit trail."

**Pillar 3:**
- Title: "Clear value for every stakeholder"
- Description: "Providers get smoother approvals, accrediting bodies control quality, and execution vendors, sponsors, and practitioners benefit from a cleaner way to run and track activities."

### Right Column (Visual)

**Placeholder:**
- Aspect ratio: `aspect-[4/5]`
- Background: Gradient `from-[var(--apple-blue)]/10 to-[var(--apple-purple)]/10`
- Border: `border border-[var(--border)]`
- Content: "Illustration placeholder" text
- Styling: `rounded-ios-lg`

**Status:** Visual placeholder - no actual illustration/image implemented

### Copy (English)

**Badge:**
"CME/CPD operating system"

**Headline:**
"Mutqin is the digital home for CME/CPD activities."

**Subline:**
"Mutqin connects CPD providers, accrediting bodies, execution vendors, sponsors, and health practitioners in one clear, auditable workflow for CME/CPD activities."

**Pillars:** See above for full text

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.whatIs.*` keys.

### Technical Implementation

- Uses LiquidGlassCard component for pillars
- Icon mapping: Array-based icon assignment
- Color mapping: Array-based color assignment
- Responsive: Stacks on mobile, side-by-side on desktop

---

## Section 5: How It Works

**Component:** `src/app/_components/landing/LandingHowItWorks.tsx`

**Type:** Step-by-step timeline (6 steps)

### Visual Design

- **Background:** `bg-[var(--secondary-system-background)]`
- **Padding:** `py-20 px-4`
- **Max Width:** `max-w-7xl mx-auto`

### Header

**Title:**
- Text: `landing.howItWorks.title` (i18n)
- Styling: `text-4xl font-bold text-[var(--label)] mb-4`

**Intro:**
- Text: `landing.howItWorks.intro` (i18n)
- Styling: `text-lg text-[var(--secondary-label)] max-w-2xl mx-auto`

### Steps Layout

**Desktop (lg breakpoint and above):**
- Horizontal flex layout
- Connector line: Horizontal line above cards (`h-0.5 bg-[var(--border)]`)
- Step numbers: Positioned above connector line (`absolute -top-4`)
- Equal width cards: `flex-1` distribution

**Mobile (below lg breakpoint):**
- Vertical stack
- Step numbers: Left side of card
- Icons: Inline with persona chip

### Step Structure

Each step card (LiquidGlassCard) contains:

1. **Step Number:**
   - Badge: `w-8 h-8 rounded-full bg-[var(--apple-blue)] text-white`
   - Position: Above card on desktop, left side on mobile

2. **Icon:**
   - Container: `p-4 rounded-full bg-[var(--apple-blue)]/20`
   - Icons: UserPlus, Search, CalendarCheck, QrCode, Award
   - Size: `w-8 h-8` (desktop), `w-5 h-5` (mobile)

3. **Persona Chip:**
   - Text: Persona name (e.g., "Provider", "Accrediting body")
   - Styling: `text-xs px-2 py-1 rounded-full bg-[var(--system-fill)]`

4. **Title:**
   - Text: Step title (e.g., "1. Design the CPD activity...")
   - Styling: `text-lg font-bold text-[var(--label)]`

5. **Description:**
   - Text: Step description
   - Styling: `text-sm text-[var(--secondary-label)]`

### Steps (6 Total)

**Step 0:**
- Number: 0
- Persona: System
- Title: "0. Activities flow in from trusted sources"
- Description: "CME/CPD activities are created and submitted through standardised workflows by accredited providers."
- Icon: UserPlus
- **Note:** Step 0 is hardcoded in component, not from i18n

**Step 1:**
- Number: 1
- Persona: Provider
- Title: "1. Design the CPD activity and submit for accreditation"
- Description: "The provider builds the scientific plan, chooses the activity type, and submits the accreditation request from inside Mutqin."
- Icon: Search

**Step 2:**
- Number: 2
- Persona: Accrediting body
- Title: "2. Review and approve the activity"
- Description: "The accrediting body receives a structured submission, reviews it against regulations, and approves it or returns it with clear comments."
- Icon: CalendarCheck

**Step 3:**
- Number: 3
- Persona: Provider + Execution vendor
- Title: "3. Publish the activity and assign execution"
- Description: "Once accredited, the activity is published through the right channels and an execution vendor is assigned with scoped permissions."
- Icon: QrCode

**Step 4:**
- Number: 4
- Persona: Event manager
- Title: "4. Run the event and capture attendance"
- Description: "The execution team manages registration, check-in, absences, and exceptions in one interface and records accredited hours."
- Icon: Award

**Step 5:**
- Number: 5
- Persona: HCP + Sponsor + Accrediting body
- Title: "5. Issue hours and close the loop"
- Description: "Practitioners receive their accredited hours and certificates, sponsorship is documented, and final reports are stored for audit."
- Icon: Award

### Copy (English)

**Title:**
"Mutqin runs each CME/CPD activity as part of a connected network."

**Intro:**
"Mutqin connects the same CME/CPD activity in a clear digital journey from first idea to issued hours and certificates."

**Steps:** See above for full step details

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.howItWorks.*` keys.

### Technical Implementation

- Step 0 is hardcoded in component (not from i18n)
- Steps 1-5 loaded from i18n `landing.howItWorks.steps` array
- Icon mapping: Array-based assignment
- Responsive: Different layouts for mobile vs desktop
- Connector line: Absolute positioning on desktop only

---

## Section 6: Who We Serve

**Component:** `src/app/_components/landing/LandingWhoWeServe.tsx`

**Type:** Persona cards grid

### Visual Design

- **Background:** `bg-[var(--system-background)]`
- **Padding:** `py-20 px-4`
- **Max Width:** `max-w-7xl mx-auto`

### Header

**Title:**
- Text: `landing.whoWeServe.title` (i18n)
- Styling: `text-4xl font-bold text-[var(--label)] mb-4`

**Intro:**
- Text: `landing.whoWeServe.intro` (i18n)
- Styling: `text-lg text-[var(--secondary-label)] max-w-2xl mx-auto`

### Persona Cards Grid

**Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Card Structure (LiquidGlassCard):**
- Padding: `p-6`
- Layout: Icon on left, text on right
- Icon container: `p-3 rounded-full bg-[var(--apple-blue)]/20`
- Icon: `w-6 h-6 text-[var(--apple-blue)]`
- Icons: Building2, Shield, Calendar, Briefcase, Stethoscope

### Personas (5 Total)

**Persona 1: CPD providers**
- Icon: Building2
- Label: "CPD providers"
- Value: "Submit and manage CME/CPD activities through a clear path that reduces rejections, delays, and scattered communication."

**Persona 2: Accrediting bodies**
- Icon: Shield
- Label: "Accrediting bodies"
- Value: "Receive CPD activity applications in a unified format with a clear audit trail and ready-to-use reports."

**Persona 3: Execution vendors & event managers**
- Icon: Calendar
- Label: "Execution vendors & event managers"
- Value: "Run registration, attendance, and CME/CPD hours from a single interface instead of paper and scattered files."

**Persona 4: Sponsors**
- Icon: Briefcase
- Label: "Sponsors"
- Value: "Sponsor CME/CPD activities within a clear, transparent framework with documented regulatory requirements and constraints."

**Persona 5: Health practitioners**
- Icon: Stethoscope
- Label: "Health practitioners"
- Value: "Discover relevant CME/CPD activities, register, and track accredited hours and certificates in one place."

### Copy (English)

**Title:**
"Mutqin supports every role in the CME/CPD ecosystem."

**Intro:**
"Mutqin unifies the CME/CPD activity workflow across all parties in the healthcare ecosystem."

**Personas:** See above for full details

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.whoWeServe.*` keys.

### Technical Implementation

- Personas loaded from i18n `landing.whoWeServe.personas` array
- Icon mapping: Array-based assignment (5 icons for 5 personas)
- Responsive: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)

---

## Section 7: Why It Matters

**Component:** `src/app/_components/landing/LandingWhyItMatters.tsx`

**Type:** Benefits grid (2x2 layout)

### Visual Design

- **Background:** `bg-[var(--system-background)]`
- **Padding:** `py-20 px-4`
- **Max Width:** `max-w-7xl mx-auto`

### Header

**Title:**
- Text: `landing.whyItMatters.title` (i18n)
- Styling: `text-4xl font-bold text-[var(--label)] mb-4`

**Intro:**
- Text: `landing.whyItMatters.intro` (i18n)
- Styling: `text-lg text-[var(--secondary-label)] max-w-2xl mx-auto`

### Benefits Grid

**Layout:** `grid grid-cols-1 md:grid-cols-2 gap-6`

**Card Structure (LiquidGlassCard):**
- Padding: `p-6`
- Layout: Icon on top, title and description below
- Icon container: `p-3 rounded-full bg-[var(--apple-blue)]/20 w-fit`
- Icon: `w-6 h-6 text-[var(--apple-blue)]`
- Icons: TrendingUp, Award, Shield, Zap

### Benefits (4 Total)

**Benefit 1: Fewer rejections and delays**
- Icon: TrendingUp
- Title: "Fewer rejections and delays"
- Description: "Applications reach the accrediting body complete and standardised, reducing back-and-forth and late comments."

**Benefit 2: Clear ownership at every step**
- Icon: Award
- Title: "Clear ownership at every step"
- Description: "Each step in the activity lifecycle is tied to a specific party and visible in a single audit trail."

**Benefit 3: Stronger compliance and audit readiness**
- Icon: Shield
- Title: "Stronger compliance and audit readiness"
- Description: "All requirements and documentation for CME/CPD activities live in one place, ready for review and audits."

**Benefit 4: Better experience for practitioners and sponsors**
- Icon: Zap
- Title: "Better experience for practitioners and sponsors"
- Description: "Practitioners follow a clean path to attend activities and track hours, while sponsors gain clearer visibility into impact."

### Copy (English)

**Title:**
"Mutqin elevates how organisations manage CME/CPD."

**Intro:**
"CME/CPD activities involve many parties and details. Mutqin gives organisations one digital workflow that keeps the same regulations while making collaboration clearer and easier to run."

**Benefits:** See above for full details

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.whyItMatters.*` keys.

### Technical Implementation

- Benefits loaded from i18n `landing.whyItMatters.benefits` array
- Icon mapping: Array-based assignment (4 icons for 4 benefits)
- Responsive: 1 column (mobile) → 2 columns (desktop)

---

## Section 8: Demo/FAQ Section

**Component:** `src/app/_components/landing/LandingDemoFaq.tsx`

**Type:** Two-column layout (Demo CTA + FAQ Accordion)

### Visual Design

- **Background:** `bg-gradient-to-b from-[var(--system-background)] to-[var(--secondary-system-background)]`
- **Padding:** `py-20 px-4`
- **Max Width:** `max-w-7xl mx-auto`
- **Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-12`

### Left Column: Demo CTA

**Card (LiquidGlassCard):**
- Padding: `p-8`
- Blur: `blurIntensity="md"`

**Title:**
- Text: `landing.demoFaq.demo.title` (i18n)
- Styling: `text-3xl font-bold text-[var(--label)] mb-4`

**Subline:**
- Text: `landing.demoFaq.demo.subline` (i18n)
- Styling: `text-lg text-[var(--secondary-label)] mb-6`

**What We Cover Section:**
- Heading: `landing.demoFaq.demo.whatWeCover` (i18n)
- Styling: `text-sm font-semibold text-[var(--label)] mb-3`
- Bullets: Array from `landing.demoFaq.demo.bullets` (i18n)
- Bullet styling: `text-sm text-[var(--secondary-label)]` with bullet point (`•`)

**Bullet Points:**
1. "Creating a CPD activity and submitting a standardised accreditation request."
2. "How the accrediting body receives the request and reviews content against its regulations."
3. "Managing registration, attendance, and accredited hours during the event."
4. "Issuing reports, hours, and certificates and closing the activity lifecycle."

**CTAs:**
- Primary: GlassButton "Join us" (`landing.demoFaq.demo.ctaPrimary`)
  - Action: Routes to `/register`
  - Styling: `size="lg" w-fit`
- Secondary: Text link "Review activity journeys" (`landing.demoFaq.demo.ctaSecondary`)
  - Action: Smooth scroll to `#how-it-works`
  - Styling: `text-sm text-[var(--apple-blue)] hover:underline`

### Right Column: FAQ Accordion

**Title:**
- Text: `landing.demoFaq.faq.title` (i18n)
- Styling: `text-3xl font-bold text-[var(--label)] mb-6`

**FAQ Items:**
- Layout: `space-y-4` vertical stack
- Card: LiquidGlassCard with `p-6`
- State: `useState` for `openFaq` (number | null)

**FAQ Item Structure:**
- Button: Full width, flex layout with question and chevron
- Question: `text-lg font-semibold text-[var(--label)] pr-4`
- Chevron: `ChevronDown` icon, rotates 180deg when open
- Answer: Conditional rendering when `openFaq === index`
  - Styling: `mt-4 text-sm text-[var(--secondary-label)]`

### FAQ Questions (4 Total)

**FAQ 1:**
- Question: "Does Mutqin replace SCFHS portals or existing systems?"
- Answer: "No. Mutqin does not change SCFHS regulations or replace official portals. Its role is to connect CPD providers, execution vendors, sponsors, and practitioners in a single organized workflow that follows the same requirements defined by the accrediting body."

**FAQ 2:**
- Question: "Who is Mutqin primarily built for?"
- Answer: "Mutqin is designed for CPD providers, execution vendors, and accrediting bodies that handle a high volume of CME/CPD activities and need a single clear workflow instead of scattered spreadsheets and emails."

**FAQ 3:**
- Question: "Do health practitioners need a separate account in Mutqin?"
- Answer: "It depends on how Mutqin is implemented for each organization. In some setups, practitioners use Mutqin mainly to register, attend CPD activities, and track their hours, while most of the complexity is handled between providers, accrediting bodies, and execution teams."

**FAQ 4:**
- Question: "How does Mutqin handle data for CME/CPD activities and hours?"
- Answer: "Mutqin's goal is to organize CME/CPD activity and hour data into a single structured model that is easier to review and audit internally. Any concrete policies or integrations with other systems are configured with each organization according to its own regulations."

### Copy (English)

**Demo Title:**
"Join the founding network for digital CME/CPD activities."

**Demo Subline:**
"A practical session with the Mutqin team where we walk through a full CME/CPD activity journey, from accreditation request to issuing hours and certificates."

**What We Cover:**
"What we cover in the session"

**CTAs:**
- Primary: "Join us"
- Secondary: "Review activity journeys"

**FAQ Title:**
"Frequently Asked Questions"

**FAQ Items:** See above for full Q&A

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `landing.demoFaq.*` keys.

### Technical Implementation

- Accordion state: `useState<number | null>` for open FAQ index
- Smooth scroll: Uses `document.getElementById().scrollIntoView()`
- FAQ data: Loaded from i18n `landing.demoFaq.faq.items` array
- Responsive: Stacks on mobile, side-by-side on desktop

---

## Section 9: Footer

**Component:** `src/app/_components/landing/LandingFooter.tsx`

**Type:** Multi-column footer with animated background

### Visual Design

- **Background:** `bg-[var(--secondary-system-background)]`
- **Border:** `border-t border-[var(--border)]`
- **Padding:** `py-12 px-4`
- **Max Width:** `max-w-7xl mx-auto`

### Animated Background

**ECG Line Animation:**
- Two SVG paths with animated gradients
- Colors: `var(--apple-blue)`, `var(--apple-green)`, `var(--apple-purple)`
- Animation: Horizontal scroll (`x: [-1200, 0]`)
- Duration: 20s and 25s (different speeds for layered effect)
- Opacity: `opacity-[0.03]` (very subtle)
- Library: Framer Motion

### Footer Layout

**Grid:** `grid grid-cols-1 md:grid-cols-4 gap-8`

**Column 1-2: Brand & Description (col-span-2)**
- Brand name: `text-xl font-bold text-[var(--label)]`
- Description: `text-sm text-[var(--secondary-label)]`
- Contact info: Email and phone with icons

**Column 3: Quick Links**
- Heading: "Quick Links" (hardcoded, not i18n)
- Links:
  - Home (`nav.home`)
  - Pricing (`nav.pricing`) - links to `#pricing`
  - FAQ (`nav.faq`) - links to `#faq`
  - Create Account (`nav.createAccount`) - links to `/register`

**Column 4: Legal Links**
- Heading: "Legal" (hardcoded, not i18n)
- Links:
  - Privacy (`footer.links.privacy`) - links to `/privacy`
  - Terms (`footer.links.terms`) - links to `/terms`
  - Contact (`footer.links.contact`) - links to `/contact`

### Contact Information

**Email:**
- Address: `contact@mutqin.sa`
- Link: `mailto:contact@mutqin.sa`
- Icon: Mail (Lucide React)
- Styling: `hover:text-[var(--apple-blue)]`

**Phone:**
- Number: `+966 11 234 5678`
- Link: `tel:+966112345678`
- Icon: Phone (Lucide React)
- Styling: `hover:text-[var(--apple-blue)]`

### Copyright

- Text: `© {year} Mutqin. {footer.copyright}`
- Styling: `text-sm text-[var(--tertiary-label)] text-center`
- Border top: `border-t border-[var(--border)]`
- Padding: `mt-8 pt-8`

### Copy (English)

**Description:**
"The unified platform for CME/CPD activities in Saudi healthcare."

**Quick Links Heading:**
"Quick Links" (hardcoded)

**Legal Heading:**
"Legal" (hardcoded)

**Copyright:**
From `footer.copyright` i18n key

### Copy (Arabic)

All content translated in `src/locales/ar.json` under `footer.*` keys.

**Note:** "Quick Links" and "Legal" headings are hardcoded and not i18n-aware.

### Technical Implementation

- Animated SVG: Framer Motion for ECG line effect
- Contact links: `mailto:` and `tel:` protocols
- Navigation: Next.js Link component for internal routes
- Responsive: 1 column (mobile) → 4 columns (desktop)
- Year: Dynamic via `new Date().getFullYear()`

---

## Technical Architecture

### Component Structure

```
src/app/page.tsx (Main Landing Page)
├── Header (Global)
├── LandingHero
├── LandingActivitiesPreview
├── LandingWhatIs
├── LandingHowItWorks
├── LandingWhoWeServe
├── LandingWhyItMatters
├── LandingDemoFaq
└── LandingFooter
```

### Design System

**Components Used:**
- `LiquidGlassCard`: Primary card component with blur effect
- `GlassButton`: Button with glass morphism effect
- `Badge`: Small badge component
- `FloatingLines`: Animated background component

**Color System:**
- `var(--system-background)`: Main background
- `var(--secondary-system-background)`: Alternate background
- `var(--label)`: Primary text color
- `var(--secondary-label)`: Secondary text color
- `var(--tertiary-label)`: Tertiary text color
- `var(--apple-blue)`: Primary brand color
- `var(--apple-green)`: Accent color
- `var(--apple-purple)`: Accent color
- `var(--border)`: Border color
- `var(--separator)`: Separator color
- `var(--system-fill)`: Fill color

### Internationalization (i18n)

**Structure:**
- Locale files: `src/locales/en.json` and `src/locales/ar.json`
- Context: `LanguageContext` via `useLanguage()` hook
- Function: `getNestedTranslation(language, ...keys)`
- Language toggle: Available in header

**Translation Keys:**
All landing page content under `landing.*` namespace:
- `landing.hero.*`
- `landing.activitiesPreview.*`
- `landing.whatIs.*`
- `landing.howItWorks.*`
- `landing.whoWeServe.*`
- `landing.whyItMatters.*`
- `landing.demoFaq.*`

### Responsive Breakpoints

- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### RTL Support

- Language detection: `language === 'ar'`
- Text direction: `dir={isRTL ? 'rtl' : 'ltr'}`
- Layout adjustments: Flex direction and alignment reversed for RTL
- Text alignment: `text-right` for RTL, `text-left` for LTR

### Accessibility

- Semantic HTML: Proper use of `<section>`, `<header>`, `<footer>`, `<nav>`
- ARIA labels: On interactive elements (language toggle, theme toggle)
- Focus states: Built into design system components
- Screen reader support: Proper heading hierarchy

### Performance

- Code splitting: Each component is a separate file
- Lazy loading: Not currently implemented (all components load on page load)
- Image optimization: No images currently used (placeholders only)
- Animation: Framer Motion for smooth animations

---

## Content Discrepancies

### Copy Document vs Implementation

The copy document (`LANDING_PAGE_COPY_EN.md`) contains some content that differs from what's currently implemented:

1. **Hero Section:**
   - Copy doc has: Badge, Support strip, Secondary CTA
   - Implementation: Only headline, subline, primary CTA

2. **Activities Preview:**
   - Copy doc has: Description and CTA
   - Implementation: Only title and filters

3. **Footer:**
   - Copy doc: Simple description
   - Implementation: Full multi-column footer with links

**Recommendation:** Review and align implementation with copy document, or update copy document to match current implementation.

---

## Known Issues / TODOs

1. **Visual Placeholders:**
   - What Is Mutqin section: Right column has "Illustration placeholder" text
   - No actual illustrations/images implemented

2. **Missing Content:**
   - Hero section: Badge and support strip not displayed
   - Activities Preview: Description and CTA not displayed
   - Secondary CTA in hero not implemented

3. **Hardcoded Text:**
   - Footer: "Quick Links" and "Legal" headings not i18n-aware
   - Step 0 in How It Works: Hardcoded in component, not from i18n

4. **Functionality:**
   - "More filters" button in Activities Preview: Placeholder only
   - FAQ accordion: Working but could have smooth expand/collapse animation

5. **Data:**
   - Activities Preview: Uses mock data as fallback
   - No real-time activity data integration documented

---

## File Reference

### Components
- `src/app/page.tsx` - Main landing page
- `src/components/Header.tsx` - Global header
- `src/app/_components/landing/LandingHero.tsx` - Hero section
- `src/app/_components/landing/LandingActivitiesPreview.tsx` - Activities preview
- `src/app/_components/landing/LandingWhatIs.tsx` - What Is Mutqin
- `src/app/_components/landing/LandingHowItWorks.tsx` - How It Works
- `src/app/_components/landing/LandingWhoWeServe.tsx` - Who We Serve
- `src/app/_components/landing/LandingWhyItMatters.tsx` - Why It Matters
- `src/app/_components/landing/LandingDemoFaq.tsx` - Demo/FAQ section
- `src/app/_components/landing/LandingFooter.tsx` - Footer

### Locales
- `src/locales/en.json` - English translations
- `src/locales/ar.json` - Arabic translations

### Documentation
- `Docs/LANDING_PAGE_COPY_EN.md` - Source copy document
- `Docs/LANDING_PAGE_FIXES_SUMMARY.md` - Fix history
- `Docs/LANDING_PAGE_DETAILED_REPORT.md` - This document

---

## Summary

The Mutqin landing page is a comprehensive, fully bilingual marketing funnel with 8 main sections (plus header and footer). It uses a modern design system with Liquid Glass effects, smooth animations, and responsive layouts. The page is fully internationalized and supports RTL for Arabic.

**Key Strengths:**
- Complete section coverage
- Full i18n support
- Responsive design
- Modern UI/UX
- Accessibility considerations

**Areas for Improvement:**
- Add missing visual assets (illustrations)
- Implement missing copy elements (badge, support strip, secondary CTA)
- Complete "More filters" functionality
- Add smooth animations to FAQ accordion
- Make footer headings i18n-aware

---

*Report generated: 2025*
*Last updated: Based on current codebase state*

