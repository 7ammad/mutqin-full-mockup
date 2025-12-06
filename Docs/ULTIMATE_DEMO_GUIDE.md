# Ultimate Demo Guide - Comprehensive Dashboard System

## Overview

This guide documents the comprehensive demo system built with:
- **Mock API endpoints** (no backend required)
- **Full dashboard functionality** for all personas
- **Consistent design system** usage (Apple Liquid Glass)
- **Proper spacing, typography, alignment** throughout
- **Rich mock data** for realistic demonstrations

---

## New Components

### 1. KPICard Component
**Location:** `src/components/shared/KPICard.tsx`

A reusable KPI card component with:
- Liquid Glass design system styling
- Color variants (blue, green, purple, orange, red)
- Trend indicators
- Interactive hover states
- Proper spacing and typography

**Usage:**
```tsx
<KPICard
  title="Total Events"
  value={42}
  subtitle="This month"
  icon={FileText}
  color="blue"
  trend={{
    value: 12,
    label: "vs last month",
    isPositive: true
  }}
/>
```

### 2. DashboardSection Component
**Location:** `src/components/shared/DashboardSection.tsx`

A section wrapper for consistent dashboard layouts:
- Title and description
- Header actions
- Consistent spacing (sm, md, lg)
- Proper typography hierarchy

**Usage:**
```tsx
<DashboardSection
  title="Upcoming Events"
  description="Events that need attention"
  headerActions={<GlassButton>Create</GlassButton>}
  spacing="lg"
>
  {/* Content */}
</DashboardSection>
```

---

## New API Endpoints

### Dashboard Analytics
**Endpoint:** `GET /api/dashboard/analytics?persona={persona}&userId={userId}`

Returns comprehensive analytics data for the specified persona:
- Organizer: total events, draft, pending, approved, published, CME hours, approval rate
- HCP: registrations, attended events, CME hours, certificates, upcoming events
- Event Manager: assignments, accepted, pending, events managed, attendance metrics
- Vendor: sponsorships, active campaigns, investment, reach, impressions
- Regulator: queue size, reviewed, approval rate, review time, total events

**Example:**
```typescript
const res = await api.getDashboardAnalytics({
  persona: "ORGANIZER",
  userId: "org-1"
});
```

### Dashboard KPIs
**Endpoint:** `GET /api/dashboard/kpis?persona={persona}&userId={userId}`

Returns formatted KPI cards data:
- Array of KPI objects with id, title, value, subtitle, trend, color
- Ready to use with KPICard component
- Persona-specific metrics

**Example:**
```typescript
const res = await api.getDashboardKPIs({
  persona: "ORGANIZER",
  userId: "org-1"
});
// Returns: { ok: true, kpis: [...] }
```

---

## Enhanced Dashboard Components

### Organizer Dashboard - Overview Tab
**Location:** `src/components/organizer/OverviewTab.tsx`

New enhanced overview tab featuring:
- **KPI Cards** using the new KPICard component
- **Next Actions** section with actionable items
- **Compliance Alerts** with severity indicators
- **Upcoming Events** grid with proper spacing
- **Consistent design system** usage throughout

**Features:**
- Fetches KPIs from API endpoint
- Real-time data from demo store
- Proper loading states
- Empty states with helpful messages
- Responsive grid layouts

---

## Design System Usage

### Spacing
- **Section spacing:** `space-y-8` (32px) between major sections
- **Card spacing:** `gap-4` (16px) between cards in grids
- **Internal padding:** `p-6` (24px) for cards, `p-4` (16px) for compact items
- **Grid gaps:** `gap-4` for mobile, `gap-6` for desktop

### Typography
- **Section titles:** `text-2xl font-bold` (24px, bold)
- **Card titles:** `text-lg font-semibold` (18px, semibold)
- **KPI values:** `text-3xl font-bold` (30px, bold)
- **Labels:** `text-xs font-medium uppercase tracking-wide` (12px, uppercase)
- **Body text:** `text-sm` (14px) for descriptions

### Alignment
- **Text alignment:** Left-aligned (RTL-aware via language context)
- **Card content:** Flex layouts with `items-start justify-between`
- **Icons:** Consistent sizing (`h-5 w-5` for small, `h-6 w-6` for medium)
- **Grid layouts:** Responsive with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

### Colors
- **KPI colors:** Semantic colors (blue, green, purple, orange, red)
- **Status colors:** Apple color system (green for success, orange for warning, red for error)
- **Backgrounds:** System colors with proper opacity (`bg-[var(--system-fill)]/30`)

---

## Mock Data Structure

All mock data is stored in:
- **Demo Store:** `src/context/demoStore.ts`
- **Seed Data:** `src/context/demoSeed.ts`
- **MSW Handlers:** `src/lib/mockApi/handlers.ts`

**Data includes:**
- Events (8+ with various statuses)
- Assignments (Event Manager assignments)
- Tickets (HCP registrations)
- Attendance records
- Certificates
- Reviews
- Sponsorships

---

## Testing the Demo

### 1. Start Development Server
```bash
npm run dev
```

### 2. Login as Different Personas
- **Organizer:** Use demo credentials (org-1)
- **HCP:** Use demo credentials (hcp-1)
- **Event Manager:** Use demo credentials (em-1)
- **Vendor:** Use demo credentials (vendor-1)
- **Regulator:** Use demo credentials (regulator-1)

### 3. Navigate to Dashboards
- `/dashboard/organizer?tab=overview` - Enhanced overview with KPIs
- `/dashboard/hcp` - HCP dashboard
- `/dashboard/event-manager` - Event Manager dashboard
- `/dashboard/vendor` - Vendor dashboard
- `/dashboard/regulator` - Regulator dashboard

### 4. Test API Endpoints
All endpoints work through MSW (Mock Service Worker):
- No backend required
- All data persisted in localStorage
- Reset demo: `POST /api/demo/reset`

---

## Key Features

### ✅ Comprehensive API Coverage
- Dashboard analytics endpoints
- Dashboard KPI endpoints
- All CRUD operations for events, tickets, assignments, etc.
- Regulator-specific endpoints
- Export functionality

### ✅ Design System Consistency
- Liquid Glass cards throughout
- Consistent spacing and typography
- Proper color usage
- Responsive layouts
- RTL/LTR support

### ✅ Rich Mock Data
- Multiple events in various states
- Realistic relationships between entities
- Proper status transitions
- Compliance tracking

### ✅ Interactive Components
- Hover states on cards
- Click handlers for navigation
- Loading states
- Empty states
- Error handling

---

## Next Steps

To extend the demo:

1. **Add more KPIs** - Extend the KPI calculation logic in API endpoints
2. **Add charts** - Use the existing Chart component with new data
3. **Enhance other dashboards** - Apply the same patterns to HCP, Vendor, etc.
4. **Add more mock data** - Expand seed data for richer scenarios
5. **Add animations** - Enhance with Framer Motion animations

---

## Files Changed

### New Files
- `src/components/shared/KPICard.tsx`
- `src/components/shared/DashboardSection.tsx`
- `src/components/organizer/OverviewTab.tsx`
- `src/app/api/dashboard/analytics/route.ts`
- `src/app/api/dashboard/kpis/route.ts`

### Modified Files
- `src/lib/mockApi/handlers.ts` - Added dashboard endpoints
- `src/lib/api/types.ts` - Added dashboard types
- `src/lib/api/client.ts` - Added dashboard API methods
- `src/components/organizer/OrganizerView.tsx` - Uses new OverviewTab

---

## Design System Reference

### Spacing Scale
- `space-y-3` = 12px (compact)
- `space-y-4` = 16px (default)
- `space-y-6` = 24px (medium)
- `space-y-8` = 32px (large)

### Typography Scale
- `text-xs` = 12px (labels, captions)
- `text-sm` = 14px (body, descriptions)
- `text-base` = 16px (default)
- `text-lg` = 18px (card titles)
- `text-2xl` = 24px (section titles)
- `text-3xl` = 30px (KPI values)

### Border Radius
- `rounded-ios-sm` = 8px (small elements)
- `rounded-ios-lg` = 16px (cards, buttons)
- `rounded-2xl` = 16px (large cards)
- `24px` = Custom (LiquidGlassCard default)

---

## Conclusion

The ultimate demo system is now ready with:
- ✅ Comprehensive API endpoints
- ✅ Reusable components (KPICard, DashboardSection)
- ✅ Enhanced dashboard views
- ✅ Consistent design system usage
- ✅ Proper spacing, typography, alignment
- ✅ Rich mock data
- ✅ No backend required

All dashboards now follow the same patterns and can be easily extended.

