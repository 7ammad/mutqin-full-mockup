# UI Fix Script - Automated Code Fixing

## Overview

The `ui-fix.mjs` script automatically fixes common UI issues detected by the UI Police audit. It uses safe, regex-based transformations to fix:

1. **Hardcoded Specialties** - Replaces specialty names with `getSpecialtyLabel()` calls
2. **Duplicate Dashboard Headings** - Removes duplicate H1/H2 titles in dashboard pages
3. **Button Alignment** - Adds proper alignment classes to buttons

## Usage

### Dry Run (Preview Changes)
```bash
npm run ui:fix:dry
```

### Fix All Issues
```bash
npm run ui:fix
```

### Fix Specific Issue Types
```bash
# Fix only hardcoded specialties
npm run ui:fix:specialties

# Fix only duplicate headings
npm run ui:fix:headings

# Fix only button alignment
npm run ui:fix:buttons

# Fix multiple types
node scripts/ui-fix.mjs --fix=specialties,headings
```

## What It Fixes

### 1. Hardcoded Specialties

**Before:**
```tsx
const specialties = ['Cardiology', 'Pediatrics', 'Family Medicine'];
```

**After:**
```tsx
import { getSpecialtyLabel } from "@/lib/i18n/specialties";
import { useLanguage } from "@/context/LanguageContext";

const { language } = useLanguage();
const specialties = ['cardiology', 'pediatrics', 'family_medicine'];
// Or in JSX: {getSpecialtyLabel('cardiology', language)}
```

### 2. Duplicate Dashboard Headings

**Before:**
```tsx
// In dashboard/page.tsx
<h1 className="text-3xl font-bold">My Page</h1>
<p className="text-sm">Subtitle</p>
```

**After:**
```tsx
// Removed (PageTitle component in DashboardLayout handles this)
```

### 3. Button Alignment

**⚠️ DISABLED** - Button alignment fixes have been disabled due to JSX parsing risks. Use manual fixes with Cursor instead.

## Safety Features

- **Dry Run Mode**: Preview changes before applying
- **Context-Aware**: Only fixes in appropriate contexts
- **Import Management**: Automatically adds required imports
- **Skip Comments**: Never modifies commented code
- **Preserve Existing**: Skips files already using proper patterns
- **Button Fixes Disabled**: Button alignment auto-fix has been disabled to prevent JSX parsing errors

## Limitations

- Regex-based (not AST), so some complex cases may need manual fixes
- Specialty fixes work best in arrays and simple JSX contexts
- **Button fixes are disabled** - use manual fixes with Cursor for button alignment issues
- Heading removal only works for standalone `page.tsx` files

## Important Notes

⚠️ **Button Alignment**: The button alignment fix was disabled after it caused JSX parsing errors by incorrectly modifying `onClick` handlers. Always fix button alignment issues manually using Cursor with focused prompts.

## Workflow

1. **Run UI Police** to find issues:
   ```bash
   npm run ui:police
   ```

2. **Preview fixes** with dry run:
   ```bash
   npm run ui:fix:dry
   ```

3. **Apply fixes**:
   ```bash
   npm run ui:fix
   ```

4. **Verify** with UI Police again:
   ```bash
   npm run ui:police
   ```

5. **Type check** and test:
   ```bash
   npm run type-check
   npm test
   ```

## Integration with Cursor

For complex fixes that require AST parsing or manual review:

1. Run `npm run ui:police` to get hit list
2. Feed specific files to Cursor:
   - "Fix hardcoded specialties in `src/components/organizer/AudienceTargeting.tsx`"
   - "Remove duplicate H1 from `src/app/dashboard/profile/page.tsx`"
3. Use the script for bulk, safe fixes
4. Re-run UI Police to verify

## Future Enhancements

- AST-based transformations using jscodeshift
- More sophisticated specialty replacement in object contexts
- RTL alignment fixes
- Card layout normalization

