# Data Source Production Safety Guide

**Date:** 2025-01-27  
**Status:** Implemented

---

## Overview

This document describes the production-safe data source implementation that ensures deployed versions do not accidentally use demo data in production environments.

---

## Key Principles

1. **Production Defaults to API Mode**: Production deployments default to using real API endpoints unless explicitly configured otherwise
2. **Explicit Configuration Required**: Production deployments require explicit environment variable configuration
3. **Development Safety**: Development defaults to demo mode for easier local development
4. **Runtime Validation**: Environment configuration is validated at module load time
5. **Build-Time Validation**: Pre-build validation ensures production safety

---

## Architecture

### Environment Validation Layer

**File:** `src/lib/env.ts`

This module provides:
- Type-safe environment variable access
- Environment-specific defaults (development vs production)
- Runtime validation and warnings
- Single source of truth for data source decisions

**Key Functions:**
- `shouldUseDemoData()`: Returns whether to use demo data (single source of truth)
- `getEnvInfo()`: Returns environment info for debugging (development only)
- `env.isDemoMode`: Validated demo mode flag
- `env.isProduction`: Production environment flag

### Data Source Layer

**File:** `src/lib/dataSource.ts`

All data fetching functions now:
- Use `shouldUseDemoData()` from `env.ts` (not direct env var access)
- Include proper cache control for production API calls
- Have consistent error handling

---

## Environment Variable Behavior

### Development Mode (`NODE_ENV=development`)

| `NEXT_PUBLIC_DEMO_MODE` | Behavior |
|------------------------|----------|
| Not set / undefined | **Defaults to `true`** (demo mode) |
| `true` | Demo mode (static data) |
| `false` | API mode (real endpoints) |

### Production Mode (`NODE_ENV=production`)

| `NEXT_PUBLIC_DEMO_MODE` | Behavior |
|------------------------|----------|
| Not set / undefined | **Defaults to `false`** (API mode) + Warning logged |
| `true` | Demo mode + Warning logged (for demo deployments) |
| `false` | API mode (normal production) |

**Critical:** Production defaults to API mode to prevent accidental demo data usage.

### Test Mode (`NODE_ENV=test`)

| `NEXT_PUBLIC_DEMO_MODE` | Behavior |
|------------------------|----------|
| Not set / undefined | **Defaults to `false`** (API mode) |
| `true` | Demo mode |
| `false` | API mode |

---

## Configuration Files

### `.env.example`

Template file showing all available environment variables with documentation.

**Location:** Project root  
**Status:** Should be committed to version control

### `.env.local`

Local environment configuration (not committed to version control).

**Example for Development:**
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

**Example for Production:**
```bash
NEXT_PUBLIC_DEMO_MODE=false
```

---

## Build-Time Validation

### Validation Script

**File:** `scripts/validate-env.js`

Runs automatically before `npm run build` to:
- Validate environment variable values
- Warn about production demo mode usage
- Error on invalid configurations

### Usage

```bash
# Validate environment (runs automatically on build)
npm run validate:env

# Build with validation (default)
npm run build

# Build without validation (if needed)
npm run build:skip-validation
```

---

## Deployment Checklist

### For Production Deployments

1. **Set Environment Variable:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=false
   ```

2. **Verify in Deployment Platform:**
   - Vercel: Settings → Environment Variables
   - Other platforms: Set in deployment configuration

3. **Run Build Validation:**
   ```bash
   npm run validate:env
   npm run build
   ```

4. **Verify After Deployment:**
   - Check browser console for environment warnings
   - Verify API calls are being made (not using demo data)
   - Check network tab for API requests

### For Demo Deployments

1. **Set Environment Variable:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=true
   ```

2. **Note:** A warning will be logged in production with demo mode enabled. This is expected for demo deployments.

---

## Runtime Safety Checks

### Automatic Warnings

The environment validation layer automatically logs warnings/errors:

1. **Production with Demo Mode:**
   ```
   [ENV] WARNING: Demo mode is enabled in production. 
   This should only be used for demo deployments, not production systems.
   ```

2. **Production without Explicit Config:**
   ```
   [ENV] CRITICAL: NEXT_PUBLIC_DEMO_MODE is not set in production. 
   Defaulting to API mode. If you need demo mode, explicitly set NEXT_PUBLIC_DEMO_MODE=true
   ```

### Development Logging

In development, environment info is logged to console:
```javascript
[dataSource] Environment: {
  nodeEnv: 'development',
  isDemoMode: true,
  isApiMocking: false,
  demoModeEnv: 'true',
  apiMockingEnv: 'undefined (disabled)'
}
```

---

## Migration from Old Implementation

### Before (Unsafe)

```typescript
// Old: Defaulted to demo mode if env var was undefined
const DEMO = DEMO_ENV !== 'false' && (DEMO_ENV === 'true' || DEMO_ENV === undefined);
```

**Problem:** Production would default to demo mode if env var was missing.

### After (Safe)

```typescript
// New: Uses validated environment configuration
import { shouldUseDemoData } from '@/lib/env';
const DEMO = shouldUseDemoData();
```

**Solution:** Production defaults to API mode, requires explicit configuration.

---

## Best Practices

1. **Always Set Environment Variables in Production:**
   - Don't rely on defaults in production
   - Use deployment platform environment variable configuration

2. **Use `.env.example` as Documentation:**
   - Keep it up to date
   - Document all available variables

3. **Run Validation Before Deploying:**
   ```bash
   npm run validate:env
   ```

4. **Monitor Console Warnings:**
   - Check browser console after deployment
   - Address any environment warnings

5. **Separate Demo and Production Deployments:**
   - Use different environment variable sets
   - Clearly label demo deployments

---

## Troubleshooting

### Issue: Production Using Demo Data

**Symptoms:**
- Production shows demo data instead of real data
- No API calls in network tab

**Solution:**
1. Check `NEXT_PUBLIC_DEMO_MODE` environment variable
2. Ensure it's set to `false` in production
3. Verify in deployment platform settings
4. Rebuild and redeploy

### Issue: Development Not Using Demo Data

**Symptoms:**
- Development shows API errors
- No demo data available

**Solution:**
1. Check `.env.local` file exists
2. Ensure `NEXT_PUBLIC_DEMO_MODE=true`
3. Restart dev server after changing env vars

### Issue: Build Fails with Validation Error

**Symptoms:**
- Build fails with environment validation error

**Solution:**
1. Check error message for specific issue
2. Fix environment variable value
3. Re-run build

---

## Related Documentation

- `Docs/ENV_SETUP.md` - Basic environment setup
- `Docs/DEMO_DATA_SOURCE_IMPLEMENTATION.md` - Original demo data implementation
- `Docs/DATASOURCE_MIGRATION_COMPLETE.md` - Migration details

---

## Summary

The new implementation ensures:
- ✅ Production defaults to API mode (safe)
- ✅ Development defaults to demo mode (convenient)
- ✅ Explicit configuration required for production
- ✅ Runtime validation and warnings
- ✅ Build-time validation
- ✅ Type-safe environment access
- ✅ Single source of truth for data source decisions

