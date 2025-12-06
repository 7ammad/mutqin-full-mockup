# Troubleshooting: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**Error:** `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Date:** 2025-01-27  
**Status:** Fixed

---

## Root Cause

This error occurs when the API client tries to parse an HTML response (usually a 404 page from Next.js) as JSON. This happens when:

1. **MSW (Mock Service Worker) isn't ready yet** - API calls are made before MSW has initialized
2. **MSW handler missing** - The API route doesn't have a corresponding MSW handler
3. **Next.js 404 page** - The route doesn't exist and Next.js returns an HTML 404 page
4. **Service Worker not registered** - MSW service worker failed to register

---

## How It Happens

### Scenario 1: MSW Not Ready
```typescript
// Component makes API call immediately on mount
useEffect(() => {
  api.getAllEvents(); // Called before MSW is ready
}, []);

// MSW hasn't intercepted yet → Request goes to Next.js
// Next.js returns 404 HTML page → parseResponse tries to parse HTML as JSON → ERROR
```

### Scenario 2: Missing MSW Handler
```typescript
// API call to route that doesn't exist in handlers.ts
api.getSomeNewEndpoint(); // No handler in handlers.ts

// MSW doesn't intercept (no handler) → Request goes to Next.js
// Next.js returns 404 HTML page → ERROR
```

### Scenario 3: Service Worker Registration Failed
```typescript
// MSW service worker failed to register
// All requests bypass MSW → Go to Next.js → Return HTML → ERROR
```

---

## Solution Implemented

### 1. Enhanced Error Handling in `parseResponse`

**File:** `src/lib/api/client.ts`

**Changes:**
- Check response content before parsing JSON
- Detect HTML responses (starts with `<!DOCTYPE` or `<html`)
- Provide clear error messages with debugging info
- Include URL, status, and response preview in error

**Code:**
```typescript
async function parseResponse<TResponse extends SuccessResponse>(res: Response): Promise<TResponse> {
  // Always read as text first to check if it's HTML
  const text = await res.text();
  
  // Check if response is HTML (usually means 404 or error page)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
    throw new Error(`API endpoint returned HTML instead of JSON. This usually means:
1. MSW (Mock Service Worker) isn't ready yet - wait for __mswReady flag
2. The API route doesn't exist in MSW handlers
3. Next.js is returning a 404 HTML page

Status: ${res.status}, URL: ${res.url}
Check browser console for MSW initialization errors.`);
  }
  
  // Try to parse as JSON
  let json: TResponse | ErrorResponse;
  try {
    json = JSON.parse(text) as TResponse | ErrorResponse;
  } catch (parseError) {
    const contentType = res.headers.get('content-type') || '';
    throw new Error(`Failed to parse response as JSON. 
Content-Type: ${contentType}
Status: ${res.status}
URL: ${res.url}
Response preview: ${text.substring(0, 200)}...`);
  }

  // ... rest of validation
}
```

---

## Prevention Strategies

### 1. Always Wait for MSW Ready

**Pattern to use in components:**
```typescript
useEffect(() => {
  const waitForMSW = async () => {
    if (typeof window !== 'undefined') {
      const windowWithMSW = window as Window & { __mswReady?: boolean };
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds
      
      while (!windowWithMSW.__mswReady && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!windowWithMSW.__mswReady) {
        console.warn('MSW not ready after waiting, proceeding anyway');
      }
    }
    
    // Now safe to make API calls
    fetchData();
  };
  
  waitForMSW();
}, []);
```

### 2. Add MSW Handler for All API Routes

**Check:** `src/lib/mockApi/handlers.ts`

**Ensure:** Every API endpoint used has a corresponding handler:
```typescript
// If you add a new API call, add a handler:
http.get('/api/new-endpoint', async () => {
  return HttpResponse.json({ ok: true, data: [] });
});
```

### 3. Verify Service Worker Registration

**Check browser console for:**
- `MSW started successfully` - Good
- `Failed to start MSW: ...` - Problem
- `Service Worker registration failed` - Problem

**Verify:** `public/mockServiceWorker.js` exists

---

## Debugging Steps

### Step 1: Check MSW Status
```javascript
// In browser console
console.log('MSW Ready:', window.__mswReady);
```

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Find the failing request
3. Check:
   - **Status:** Should be 200 (if MSW intercepted) or 404 (if not)
   - **Response:** Should be JSON, not HTML
   - **Headers:** Check if MSW intercepted (look for MSW headers)

### Step 3: Verify Handler Exists
```typescript
// Check src/lib/mockApi/handlers.ts
// Search for the endpoint that's failing
// Example: If error is on /api/hcp/summary
// Look for: http.get('/api/hcp/summary', ...)
```

### Step 4: Check MSW Initialization
```typescript
// Check src/app/MockApiProvider.tsx
// Verify it's included in layout.tsx
// Check browser console for MSW logs
```

---

## Common Scenarios

### Scenario A: Component Loads Too Fast
**Symptom:** Error happens on first page load, then works on refresh

**Fix:** Add MSW wait logic (see Prevention Strategy #1)

### Scenario B: New API Endpoint Added
**Symptom:** Error only on specific endpoint

**Fix:** Add handler in `handlers.ts`

### Scenario C: Service Worker Not Registered
**Symptom:** Error on all API calls

**Fix:** 
1. Check `public/mockServiceWorker.js` exists
2. Check browser console for registration errors
3. Verify MSW is only enabled in development

---

## Error Message Format

**Before Fix:**
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**After Fix:**
```
Error: API endpoint returned HTML instead of JSON. This usually means:
1. MSW (Mock Service Worker) isn't ready yet - wait for __mswReady flag
2. The API route doesn't exist in MSW handlers
3. Next.js is returning a 404 HTML page

Status: 404, URL: http://localhost:3000/api/hcp/summary?hcpId=hcp-1
Check browser console for MSW initialization errors.
```

---

## Files Modified

1. **`src/lib/api/client.ts`** - Enhanced `parseResponse` function with HTML detection

---

## Testing

### Test Case 1: MSW Not Ready
```typescript
// Temporarily disable MSW wait
// Should get clear error message, not JSON parse error
```

### Test Case 2: Missing Handler
```typescript
// Call non-existent endpoint
api.getNonExistentEndpoint();
// Should get clear error about missing handler
```

### Test Case 3: HTML Response
```typescript
// Mock fetch to return HTML
// Should detect HTML and throw descriptive error
```

---

## Related Files

- `src/lib/api/client.ts` - API client with error handling
- `src/lib/mockApi/handlers.ts` - MSW request handlers
- `src/app/MockApiProvider.tsx` - MSW initialization
- `src/lib/mockApi/index.ts` - MSW bootstrap logic

---

## Status

✅ **Fixed** - Enhanced error handling provides clear diagnostics  
✅ **Prevention** - Components should wait for MSW ready  
⚠️ **Monitoring** - Watch for this error in production (shouldn't happen with real backend)

---

**Next Steps:**
1. Monitor error logs for this specific error
2. Ensure all components wait for MSW ready
3. Document all API endpoints in handlers.ts
