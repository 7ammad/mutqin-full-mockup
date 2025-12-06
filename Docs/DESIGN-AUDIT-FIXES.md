# Comprehensive Design & Layout Audit - Fixes

## Status: IN PROGRESS
**Date:** 2025-11-30
**Priority:** CRITICAL

## Issues Found & Fixes Applied

### 1. Spacing Consistency Issues
**Problem:** Inconsistent use of spacing utilities across components
**Standard:** Use design system spacing scale (space-y-6, gap-4, p-6, etc.)
**Fixes:**
- [ ] Audit all `space-y-*` usage - ensure consistent values
- [ ] Audit all `gap-*` usage in grids - ensure consistent values  
- [ ] Audit all `p-*` padding - ensure consistent values
- [ ] Audit all `m-*` margins - ensure consistent values

### 2. Layout Issues
**Problem:** Inconsistent container widths, grid layouts, responsive breakpoints
**Standard:** 
- Container: `container mx-auto px-4 py-8 max-w-6xl` for detail pages
- Grid: `grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for card grids
- Spacing: `space-y-6` for vertical sections
**Fixes:**
- [ ] Standardize all L2 detail page containers
- [ ] Standardize all card grid layouts
- [ ] Ensure consistent responsive breakpoints

### 3. Design System Component Usage
**Problem:** Inconsistent use of LiquidGlassCard, GlassButton, EmptyState
**Standard:**
- Main content: `LiquidGlassCard` with `blurIntensity="lg"` and `p-6`
- Actions: `GlassButton` with proper variants
- Empty states: `EmptyState` component
**Fixes:**
- [ ] Verify all pages use LiquidGlassCard for main content
- [ ] Verify all buttons use GlassButton
- [ ] Verify all empty states use EmptyState component

### 4. Typography Consistency
**Problem:** Inconsistent heading sizes and text colors
**Standard:**
- H1: `text-3xl font-bold text-[var(--label)] mb-2`
- H2: `text-2xl font-bold text-[var(--label)] mb-4`
- H3: `text-lg font-semibold text-[var(--label)] mb-2`
- Body: `text-[var(--label)]` or `text-[var(--secondary-label)]`
**Fixes:**
- [ ] Standardize all heading styles
- [ ] Ensure all text uses CSS variables (no hardcoded colors)

### 5. Broken Links & Navigation
**Problem:** Links that don't work or point to wrong routes
**Fixes:**
- [ ] Verify all `buildRoute.*` calls use correct route builders
- [ ] Verify all `router.push()` calls use valid routes
- [ ] Test all navigation links in dashboard

## Fix Priority Order

1. **CRITICAL:** Fix broken links and non-functioning routes
2. **HIGH:** Standardize spacing and padding across all pages
3. **HIGH:** Fix layout inconsistencies (containers, grids)
4. **MEDIUM:** Ensure design system component usage
5. **MEDIUM:** Typography consistency

## Files to Audit

### L1 Dashboard Pages (5)
- `src/app/dashboard/hcp/page.tsx`
- `src/app/dashboard/organizer/page.tsx`
- `src/app/dashboard/vendor/page.tsx`
- `src/app/dashboard/regulator/page.tsx`
- `src/app/dashboard/event-manager/page.tsx`

### L2 Detail Pages (21)
- All `[id]/page.tsx` files in dashboard routes

### Key Components
- All persona view components
- All tab components
- All shared components

