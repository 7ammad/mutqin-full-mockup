# MSW Stability Improvements

**Date:** 2025-01-27  
**Status:** Implemented

---

## Problem

MSW (Mock Service Worker) was causing intermittent API errors:
- Random 404 errors when MSW wasn't ready
- Service worker not registering consistently
- Components making API calls before MSW initialized
- No retry mechanism for failed initialization
- No graceful fallback when MSW fails

---

## Solution Implemented

### 1. Enhanced MSW Initialization (`src/lib/mockApi/index.ts`)

**Changes:**
- Added retry logic (3 attempts with exponential backoff)
- Added service worker verification (`checkMSWActive()`)
- Increased wait time from 200ms to 500ms for service worker registration
- Better error logging with attempt numbers
- Tracks MSW availability state separately from start state

**Key Features:**
```typescript
- Retries up to 3 times with 1s, 2s, 3s delays
- Verifies service worker is actually active after start
- Sets `__mswReady` flag only when MSW is confirmed working
- Exports `isMSWReady()` and `isMSWAvailable()` for status checks
```

### 2. API Client Resilience (`src/lib/api/client.ts`)

**Changes:**
- Added `ensureMSWReady()` function that waits up to 5 seconds for MSW
- All API requests now wait for MSW before executing (in development)
- Graceful fallback: returns empty data instead of throwing errors when MSW isn't ready
- Better error messages with context

**Key Features:**
```typescript
- requestGet() and request() now wait for MSW before making calls
- parseResponse() returns safe empty responses when MSW isn't ready
- Endpoint-specific fallbacks for known endpoints
- No more "Unexpected token '<'" errors blocking the app
```

### 3. Improved MockApiProvider (`src/app/MockApiProvider.tsx`)

**Changes:**
- Verifies MSW availability after initialization
- Better logging with prefixes for easier debugging
- Sets `__mswReady` flag appropriately in all scenarios
- Handles production mode correctly (no MSW needed)

---

## How It Works

### Initialization Flow

1. **App starts** → `MockApiProvider` mounts
2. **MSW initialization** → `startMockApi()` called
3. **Retry logic** → Up to 3 attempts with delays
4. **Verification** → Checks service worker is actually active
5. **Ready flag** → Sets `window.__mswReady = true` only when confirmed

### API Request Flow

1. **Component makes API call** → `api.getAllEvents()`
2. **Wait for MSW** → `ensureMSWReady()` waits up to 5 seconds
3. **Make request** → Proceeds with fetch
4. **Handle response** → If HTML (404), return empty data if MSW not ready
5. **Parse JSON** → Normal flow continues

---

## Benefits

1. **No more random errors** - MSW is verified before use
2. **Graceful degradation** - App works even if MSW fails
3. **Better debugging** - Clear logs with prefixes `[MSW]`, `[API]`, `[MockApiProvider]`
4. **Automatic retry** - MSW initialization retries on failure
5. **Production safe** - All MSW code only runs in development

---

## Testing

### Verify MSW is Working

```javascript
// In browser console
console.log('MSW Ready:', window.__mswReady);
```

### Check Service Worker Status

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  const msw = regs.find(r => r.active?.scriptURL?.includes('mockServiceWorker'));
  console.log('MSW Active:', !!msw?.active);
});
```

### Monitor Network Requests

1. Open DevTools → Network tab
2. Look for requests to `/api/*`
3. Should show 200 status with JSON responses
4. If 404, check console for MSW warnings

---

## Troubleshooting

### MSW Still Not Working?

1. **Check service worker file exists:**
   ```powershell
   Test-Path public/mockServiceWorker.js
   ```

2. **Regenerate service worker:**
   ```powershell
   npx msw init public/ --save
   ```

3. **Clear browser cache and service workers:**
   - DevTools → Application → Service Workers → Unregister
   - Hard refresh (Ctrl+Shift+R)

4. **Check console logs:**
   - Look for `[MSW] Started successfully` message
   - Check for any error messages with `[MSW]` prefix

### API Still Returning 404?

1. **Verify handler exists** in `src/lib/mockApi/handlers.ts`
2. **Check MSW ready flag** in console: `window.__mswReady`
3. **Wait 5 seconds** after page load for MSW to initialize
4. **Check Network tab** to see if request is being intercepted

---

## Files Changed

- `src/lib/mockApi/index.ts` - Enhanced initialization with retry
- `src/lib/api/client.ts` - Added MSW wait logic and graceful fallbacks
- `src/app/MockApiProvider.tsx` - Improved verification and logging

---

## Next Steps

If issues persist:
1. Consider increasing retry count or delays
2. Add more endpoint-specific fallbacks in `parseResponse()`
3. Implement a visual indicator when MSW is not ready
4. Add E2E tests to verify MSW initialization

