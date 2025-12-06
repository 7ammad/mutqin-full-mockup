# Demo Data Source Implementation

**Date:** 2025-01-27  
**Status:** Complete

---

## Overview

Implemented a simple, centralized data source layer that switches between static demo data files and real API calls based on the `NEXT_PUBLIC_DEMO_MODE` environment variable.

**Key Principle:** "Demo mode = zero network" - when enabled, all data comes from static TypeScript files with no HTTP calls.

---

## Architecture

```
Components
    ↓
Data Source Layer (src/lib/dataSource.ts)
    ↓
    ├─ Demo Mode: Static files (src/demo-data/*.ts)
    └─ Real Mode: HTTP fetch to /api/*
```

---

## Files Created

### 1. Demo Data Files

#### `src/demo-data/events.ts`
- Contains 8 demo events for landing page
- Simple structure: `id`, `name`, `provider`, `specialty`, `format`, `hours`, `city`, `location`
- Bilingual (Arabic/English)

#### `src/demo-data/hcpSummary.ts`
- Contains HCP summary data: `tickets`, `certificates`, `reviews`
- Includes `targetHours`, `completedHours`, `inProgressHours`

### 2. Data Source Layer

#### `src/lib/dataSource.ts`
- `getAllEvents()` - Returns `DemoEvent[]` from demoSeed (for discovery, regulator)
- `getLandingEvents()` - Returns simplified events for landing page
- `getHcpSummary(hcpId)` - Returns HCP summary data
- `isDemoMode()` - Check if demo mode is enabled

**Switching Logic:**
```typescript
const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

if (DEMO) {
  return demoData; // Static file
} else {
  return fetch('/api/...'); // Real API
}
```

### 3. Environment Configuration

#### `.env.local`
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

Set to `true` for demo mode, `false` or remove for real APIs.

---

## Components Updated

### `src/app/_components/landing/LandingActivitiesPreview.tsx`
- Now uses `getLandingEvents()` from dataSource
- Falls back to local `mockActivities` on error
- No direct API calls

### `src/components/hcp/DiscoveryGrid.tsx`
- Now uses `getAllEvents()` and `getHcpSummary()` from dataSource
- No direct API calls through `api` client

---

## Benefits

### ✅ Zero Network in Demo Mode
- No HTTP calls when `NEXT_PUBLIC_DEMO_MODE=true`
- No MSW dependency
- No random 404s
- Instant data loading

### ✅ Simple & Explicit
- Clear separation: demo data vs real APIs
- Easy to understand and maintain
- No complex service worker logic

### ✅ Easy to Switch
- Change one env variable to toggle modes
- Same component code works in both modes
- No code changes needed

### ✅ Type-Safe
- Full TypeScript support
- Type definitions for all data structures
- Compile-time error checking

---

## Usage

### In Components

```typescript
import { getAllEvents, getHcpSummary } from '@/lib/dataSource';

// Get events
const events = await getAllEvents();

// Get HCP summary
const summary = await getHcpSummary('hcp-1');
```

### Switching Modes

**Demo Mode (default):**
```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

**Real API Mode:**
```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=false
# or remove the variable
```

---

## Migration Path

When ready to connect to real APIs:

1. **Set environment variable:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=false
   ```

2. **Ensure API endpoints exist:**
   - `/api/regulator/all-events`
   - `/api/hcp/summary?hcpId=...`

3. **Components automatically switch** - no code changes needed!

---

## Comparison with Previous Approach

### Before (MSW-based)
- ❌ Random 404s when MSW not ready
- ❌ Complex waiting logic in components
- ❌ Service worker dependency
- ❌ Unstable during hot reloads

### After (Data Source Layer)
- ✅ Zero network calls in demo mode
- ✅ No waiting logic needed
- ✅ No service worker dependency
- ✅ Stable and predictable

---

## Future Enhancements

1. **Add more demo data files:**
   - `src/demo-data/regulatorSummary.ts`
   - `src/demo-data/organizerEvents.ts`
   - etc.

2. **Add caching layer:**
   - Cache API responses in real mode
   - Reduce redundant calls

3. **Add error boundaries:**
   - Graceful fallback to demo data on API errors
   - Better error messages

---

## Files Changed

### Created
- `src/demo-data/events.ts`
- `src/demo-data/hcpSummary.ts`
- `src/lib/dataSource.ts`
- `.env.local` (if not exists)

### Modified
- `src/app/_components/landing/LandingActivitiesPreview.tsx`
- `src/components/hcp/DiscoveryGrid.tsx`

---

## Testing

### Verify Demo Mode Works

1. **Check `.env.local`:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=true
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Check browser console:**
   - No network calls to `/api/*` for read operations
   - Data loads instantly
   - No 404 errors

4. **Test components:**
   - Landing page shows activities
   - HCP discovery shows events
   - All data loads without waiting

---

## Result

✅ **Zero network calls in demo mode**  
✅ **No MSW dependency**  
✅ **No random 404s**  
✅ **Simple, explicit data source**  
✅ **Easy to switch to real APIs**

The app is now in **"demo mode = zero network"** as requested.

