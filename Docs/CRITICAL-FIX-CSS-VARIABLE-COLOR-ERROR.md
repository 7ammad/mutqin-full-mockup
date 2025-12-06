# Critical Fix: CSS Variable Color Error

## Issue
**Error:** `Invalid hex color: var(--label)`  
**Location:** `src/components/shared/QRCode.tsx`  
**Impact:** L1 HCP dashboard page crashing on registrations tab

## Root Cause
The `QRCode` component was passing `"var(--label)"` directly to the `next-qrcode` library's `color.dark` option. The library expects a hex color value (e.g., `#000000`), not a CSS variable reference.

## Fix Applied
Updated `src/components/shared/QRCode.tsx` to:
1. Use `useEffect` to compute the actual color value from the CSS variable at runtime
2. Convert the computed RGB value to hex format
3. Pass the hex color to the QR code library

## Code Changes
- Added `rgbToHex` utility function to convert RGB/RGBA to hex
- Added `useEffect` hook to get computed color from CSS variable
- Changed `color.dark` from `"var(--label)"` to computed `darkColor` state

## Prevention
### Review Checklist Addition
When reviewing components that use third-party libraries with color props:
- [ ] Verify color props accept CSS variables or require hex/RGB values
- [ ] Check if library documentation specifies color format requirements
- [ ] Test components that use color props in both light and dark modes
- [ ] Verify no CSS variables are passed to libraries expecting parsed color values

### Testing Addition
- Add visual regression tests for components using third-party color libraries
- Test QR code generation in both light and dark themes
- Verify color values are correctly computed from CSS variables

## Related Components
Other components using CSS variables with third-party libraries:
- `src/components/shared/Chart.tsx` - Uses Recharts (should work, SVG resolves CSS vars)
- Chart components in analytics tabs - Use Chart component (should work)

## Status
✅ **FIXED** - QRCode component now correctly converts CSS variables to hex colors

## Date
2025-11-30

