# Data Source Migration Complete

**Date:** 2025-01-27  
**Status:** Complete

---

## Summary

All HCP and regulator dashboards now use the `dataSource` layer directly instead of making HTTP calls through the API client. MSW is disabled by default and can be enabled via environment variable.

---

## Changes Made

### 1. Updated Components to Use DataSource

#### HCP Components
- ✅ `src/components/hcp/MyTickets.tsx`
  - Now uses `getHcpSummary()` and `getAllEvents()` from dataSource
  - Removed dependency on `api.getHcpSummary()`

- ✅ `src/components/hcp/DiscoveryGrid.tsx`
  - Already using dataSource (updated previously)

#### Regulator Components
- ✅ `src/components/regulator/RegulatorView.tsx`
  - Now uses `getAllEvents()` from dataSource
  - Filters events locally for queue (pending_review status)
  - Removed dependency on `api.getRegulatorQueue()` and `api.getAllEvents()`

#### Organizer Components
- ✅ `src/components/organizer/OrganizerView.tsx`
  - Now uses `getOrganizerEvents()` from dataSource
  - Removed dependency on `api.getOrganizerEvents()`

#### Event Manager Components
- ✅ `src/components/eventmanager/EventManagerView.tsx`
  - Now uses `getEventManagerAssignments()` from dataSource
  - Removed dependency on `api.getEventManagerAssignments()`

### 2. Enhanced DataSource Layer

Added new functions to `src/lib/dataSource.ts`:

```typescript
// New functions
getOrganizerEvents(organizerId: string): Promise<DemoEvent[]>
getEventManagerAssignments(eventManagerId: string): Promise<...>
```

### 3. Disabled MSW by Default

**`src/app/MockApiProvider.tsx`**
- MSW now only starts if `NEXT_PUBLIC_API_MOCKING=enabled`
- By default, MSW is disabled
- No more random 404s or service worker issues

**Environment Variable:**
```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
# MSW disabled by default - set this to enable:
# NEXT_PUBLIC_API_MOCKING=enabled
```

---

## Data Flow

### Before (Unstable)
```
Component → api.getHcpSummary() → HTTP fetch → MSW → demoStore
                ↓
          (Random 404s if MSW not ready)
```

### After (Stable)
```
Component → getHcpSummary() from dataSource
                ↓
          if DEMO: demoStore directly
          else: HTTP fetch to real API
```

---

## Benefits

### ✅ Zero Network in Demo Mode
- All read operations use local data
- No HTTP calls when `NEXT_PUBLIC_DEMO_MODE=true`
- Instant data loading

### ✅ No MSW Dependency
- MSW disabled by default
- No service worker registration issues
- No random 404s

### ✅ Simple & Explicit
- Components import dataSource functions directly
- Clear separation: demo data vs real APIs
- Easy to understand and maintain

### ✅ Easy to Switch
- Change `NEXT_PUBLIC_DEMO_MODE=false` to use real APIs
- Same component code works in both modes
- No code changes needed

---

## Usage Pattern

### In Components

```typescript
// Import dataSource functions
import { getHcpSummary, getAllEvents, getOrganizerEvents } from '@/lib/dataSource';

// Use in useEffect
useEffect(() => {
  getHcpSummary('hcp-1')
    .then(setSummary)
    .catch(console.error);
  
  getAllEvents()
    .then(setEvents)
    .catch(console.error);
}, []);
```

### Available Functions

- `getAllEvents()` - All events (for discovery, regulator)
- `getLandingEvents()` - Simplified events for landing page
- `getHcpSummary(hcpId)` - HCP tickets, certificates, reviews
- `getOrganizerEvents(organizerId)` - Organizer's events
- `getEventManagerAssignments(eventManagerId)` - Event manager assignments
- `isDemoMode()` - Check if demo mode is enabled

---

## MSW Status

### Disabled by Default
MSW is now disabled and won't start unless explicitly enabled:

```bash
# To enable MSW (not recommended in demo mode)
NEXT_PUBLIC_API_MOCKING=enabled
```

### Why Disabled?
- Demo mode uses static files - no MSW needed
- MSW caused random 404s and instability
- Service worker registration was unreliable
- Data source layer is simpler and more stable

### When to Enable MSW?
- Only if you need to test API mocking behavior
- When developing API integration features
- For E2E tests that require MSW

---

## Migration Checklist

- ✅ HCP dashboard uses dataSource
- ✅ Regulator dashboard uses dataSource
- ✅ Organizer dashboard uses dataSource
- ✅ Event manager dashboard uses dataSource
- ✅ Landing page uses dataSource
- ✅ MSW disabled by default
- ✅ All components updated
- ✅ TypeScript errors fixed
- ✅ No linter errors

---

## Testing

### Verify It Works

1. **Check environment:**
   ```bash
   # .env.local should have:
   NEXT_PUBLIC_DEMO_MODE=true
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Check browser console:**
   - No MSW initialization messages
   - No 404 errors for read operations
   - Data loads instantly

4. **Test components:**
   - HCP dashboard loads tickets
   - Regulator dashboard loads events
   - Organizer dashboard loads events
   - Event manager dashboard loads assignments
   - All data loads without waiting

---

## Result

✅ **All dashboards use dataSource**  
✅ **MSW disabled by default**  
✅ **Zero network calls in demo mode**  
✅ **No random 404s**  
✅ **Stable, predictable behavior**

The app is now in **"demo mode = zero network"** with all dashboards using the dataSource layer directly.

