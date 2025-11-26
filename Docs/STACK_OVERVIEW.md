# Stack Overview & Project Context

## Tech Stack

**Frontend Framework:**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5

**Styling:**
- Tailwind CSS v4
- Apple Liquid Glass design system
- shadcn/ui components
- Framer Motion (spring animations)

**State Management:**
- React Context API (PersonaContext, LanguageContext, AuthContext)
- Client-side state (no external state library)

**UI Libraries:**
- Radix UI primitives (Dialog, Tooltip, Slot)
- Lucide React icons
- Recharts (data visualization)
- React Hook Form + Zod validation

**Internationalization:**
- Bilingual support (Arabic/English)
- RTL/LTR switching
- Cairo font (Arabic/Latin subsets)

**PWA Features:**
- Service worker
- Manifest.json
- Mobile-responsive design

**Deployment:**
- Vercel (production)
- Next.js static/dynamic rendering

## Project Context

**Purpose:**
Unified CME (Continuing Medical Education) event marketplace for Saudi Arabia connecting:
- Healthcare Practitioners (HCPs) - discover and register for events
- Event Organizers - create and manage events
- Vendors/Sponsors - sponsor events
- Regulators (SCFHS) - approve and monitor events
- Event Managers - execute events

**Current State:**
- Demo/simulation with mock data
- Four persona dashboards implemented
- Bilingual UI (Arabic/English)
- Dark/Light theme support
- Mobile-responsive
- Event lifecycle workflow (Draft → Pending Approval → Published → Completed)

**Key Features:**
- Event creation wizard
- Event discovery and search
- Sponsorship marketplace
- Regulatory approval workflow
- CME hours tracking
- Registration management
- QR code check-in system
- Certificate generation
- Registration meters and analytics

**Architecture:**
- Route-first development approach
- Component-based architecture
- Context-based global state
- Mock data layer (ready for API integration)
- Design system with reusable components

**Data Flow:**
1. Organizer creates event → Draft
2. Vendor sponsors event → Pending Approval
3. Regulator reviews → Approved/Rejected
4. Event published → HCPs can register
5. Event execution → Check-in, attendance, certificates

**File Structure:**
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components by persona
├── context/          # React Context providers
├── lib/              # Utilities, mock data, design system
└── ui/               # shadcn/ui components
```

**Next Steps (Production):**
- Authentication system
- Database integration
- API layer
- Real-time features
- Payment processing
- Mobile apps

