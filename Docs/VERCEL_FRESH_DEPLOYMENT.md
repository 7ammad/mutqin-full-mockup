# Fresh Vercel Deployment Guide

**Date:** 2025-01-27  
**Status:** Ready for Deployment

---

## Current Situation

- **Project:** event-med
- **Existing Deployments:** 3 (2 days old, 16 days old)
- **New Changes:** Production-safe data source flow with environment validation

---

## Deployment Options

### Option 1: Deploy Fresh Version (Recommended)

Deploying a new version will automatically make it the active production deployment. Old deployments remain for rollback purposes but won't be active.

**Steps:**
1. Ensure environment variables are set in Vercel
2. Deploy fresh version
3. Verify deployment

### Option 2: Remove Old Deployments First

If you want to clean up old deployments:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on each old deployment
3. Click "..." menu → "Delete Deployment"
4. Then deploy fresh version

**Note:** You don't need to delete old deployments - they're useful for rollback.

---

## Pre-Deployment Checklist

### 1. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

**For Demo Deployment:**
```
NEXT_PUBLIC_DEMO_MODE=true
```

**For Production Deployment:**
```
NEXT_PUBLIC_DEMO_MODE=false
```

### 2. Verify Local Build

```bash
npm run validate:env
npm run build
```

### 3. Commit Changes (if using Git integration)

```bash
git add .
git commit -m "feat: Production-safe data source flow with environment validation"
git push
```

---

## Deployment Commands

### Deploy to Production

```powershell
# Deploy fresh version to production
vercel --prod
```

### Deploy Preview (Test First)

```powershell
# Deploy preview version first to test
vercel
```

---

## Post-Deployment Verification

1. **Check Deployment URL:**
   - Visit the deployment URL provided by Vercel
   - Verify the application loads correctly

2. **Check Environment:**
   - Open browser console
   - Look for environment logs (development only) or warnings (production)

3. **Verify Data Source:**
   - Check network tab for API calls (if not in demo mode)
   - Verify demo data loads (if in demo mode)

4. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Your deployment → Build Logs
   - Verify environment validation passed

---

## Troubleshooting

### Build Fails with Environment Validation Error

**Solution:**
1. Check environment variables in Vercel Dashboard
2. Ensure `NEXT_PUBLIC_DEMO_MODE` is set correctly
3. Redeploy

### Production Shows Demo Data When It Shouldn't

**Solution:**
1. Check `NEXT_PUBLIC_DEMO_MODE` in Vercel Dashboard
2. Set to `false` for production
3. Redeploy

### Old Deployment Still Active

**Solution:**
1. New deployment should automatically become active
2. If not, go to Vercel Dashboard → Deployments
3. Click "..." on new deployment → "Promote to Production"

---

## Next Steps After Deployment

1. **Monitor:**
   - Check for any console warnings
   - Verify data source behavior
   - Test key functionality

2. **Update Documentation:**
   - Note deployment date
   - Document any environment variable changes

3. **Set Up Monitoring (Optional):**
   - Vercel Analytics
   - Error tracking
   - Performance monitoring

---

## Summary

**Recommended Approach:**
1. Set environment variables in Vercel Dashboard
2. Run `vercel --prod` to deploy fresh version
3. Verify deployment works correctly
4. Old deployments can remain (useful for rollback)

**No need to manually delete old deployments** - they're automatically superseded by the new deployment.

