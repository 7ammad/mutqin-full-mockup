# Environment Setup

## Overview

The application uses environment variables to control data source behavior. The implementation ensures production safety by defaulting to API mode in production environments.

## Required Environment Variable

Create `.env.local` in the project root with:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

## Why This Is Needed

The `dataSource.ts` layer uses the validated environment configuration (`src/lib/env.ts`) to decide whether to:
- Return static demo data (when `true`)
- Make HTTP calls to `/api/*` endpoints (when `false`)

## Default Behavior

### Development Mode

If `.env.local` is missing or `NEXT_PUBLIC_DEMO_MODE` is not set:
- **Defaults to demo mode** (uses static data)
- This makes local development easier

### Production Mode

If `NEXT_PUBLIC_DEMO_MODE` is not set:
- **Defaults to API mode** (makes HTTP calls)
- A warning is logged to ensure explicit configuration
- This prevents accidental demo data usage in production

### Explicit Configuration

| Environment | `NEXT_PUBLIC_DEMO_MODE` | Behavior |
|------------|-------------------------|----------|
| Development | Not set | Demo mode (default) |
| Development | `true` | Demo mode |
| Development | `false` | API mode |
| Production | Not set | API mode (default) + Warning |
| Production | `true` | Demo mode + Warning |
| Production | `false` | API mode |

## Environment Variable Validation

The application includes build-time validation to ensure proper configuration:

```bash
# Validate environment variables
npm run validate:env

# Build (includes validation)
npm run build
```

## After Creating .env.local

**Restart the dev server** for the environment variable to take effect:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

Next.js inlines `NEXT_PUBLIC_` variables at build/start time, so changes require a restart.

## Verification

### Development

Check the browser console for:
```
[dataSource] Environment: {
  nodeEnv: 'development',
  isDemoMode: true,
  isApiMocking: false,
  demoModeEnv: 'true',
  apiMockingEnv: 'undefined (disabled)'
}
```

### Production

In production, check for warnings:
- If demo mode is enabled: Warning will be logged
- If not explicitly set: Warning about defaulting to API mode

## Production Deployment

For production deployments:

1. **Set environment variable in deployment platform:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=false
   ```

2. **Or omit it** (will default to API mode with a warning)

3. **For demo deployments:**
   ```bash
   NEXT_PUBLIC_DEMO_MODE=true
   ```
   (Warning will be logged - this is expected for demo deployments)

## Additional Configuration

### API Mocking (MSW)

Optional: Enable MSW for API mocking in development:

```bash
NEXT_PUBLIC_API_MOCKING=enabled
```

**Note:** In demo mode, MSW is not needed as data comes from static files.

## Related Documentation

- `Docs/DATA_SOURCE_PRODUCTION_SAFETY.md` - Detailed production safety guide
- `Docs/DEMO_DATA_SOURCE_IMPLEMENTATION.md` - Demo data implementation details

