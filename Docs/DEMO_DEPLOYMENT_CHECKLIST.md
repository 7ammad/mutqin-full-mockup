# Demo Deployment Checklist - Saudi Health Council Presentation

**Date:** December 4, 2025  
**Purpose:** Demo deployment for SHC presentation  
**Status:** Demo-only (backend integration pending approval)

---

## Pre-Deployment Checks

### 1. Build Verification
- [ ] Production build completes successfully (`npm run build`)
- [ ] No build errors or warnings
- [ ] All routes compile correctly

### 2. Type Safety
- [ ] TypeScript compilation passes (known pre-existing errors in other files are acceptable)
- [ ] No new type errors in landing page components

### 3. Linting
- [ ] ESLint passes for critical files
- [ ] No blocking lint errors

### 4. Security
- [ ] No high/critical vulnerabilities (`npm audit`)
- [ ] Dependencies are up-to-date

### 5. Visual Verification
- [ ] Landing page renders correctly
- [ ] Activities section has proper panel/background
- [ ] RTL/LTR switching works
- [ ] Dark mode works
- [ ] Responsive design works on mobile/tablet/desktop

### 6. Runtime Test
- [ ] Production server starts (`npm run start`)
- [ ] No runtime errors in console
- [ ] All demo data displays correctly

---

## Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test production build locally:**
   ```bash
   npm run start
   ```

3. **Verify in browser:**
   - Check landing page loads
   - Test navigation
   - Verify all demo content displays
   - Test language switching
   - Test dark mode

4. **Deploy to hosting platform:**
   - Push to GitHub
   - Deploy via Vercel/Netlify/etc.
   - Verify deployed URL works

---

## Known Limitations (Demo Only)

- **Backend:** No backend integration yet (pending SHC approval)
- **Data:** Using mock/demo data only
- **Authentication:** Demo mode (no real auth)
- **Type Errors:** Some pre-existing TypeScript errors in organizer/regulator components (not affecting demo)

---

## Files Changed for This Demo

- `src/app/_components/landing/LandingActivitiesPreview.tsx` - Visual improvements (panel, background)
- `package.json` - Updated Next.js to 16.0.7, fixed vulnerabilities

---

## Post-Demo (After SHC Approval)

Once approved, we'll need to:
1. Integrate backend API
2. Add real authentication
3. Connect to database
4. Fix remaining TypeScript errors
5. Add error monitoring (Sentry)
6. Set up production logging
7. Configure production environment variables

---

## Quick Commands

```bash
# Full check
npm run build && npm run start

# Type check (will show pre-existing errors - OK for demo)
npm run type-check

# Lint check
npm run lint

# Security audit
npm audit
```

