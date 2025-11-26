# Component Libraries Strategy
## What to Import vs. Build Custom

---

## ✅ Components We Can Import from Libraries

### 1. **Calendar Components**
- **Schedule-X** (`@schedule-x/react`) - Full-featured calendar with events
- **react-big-calendar** - Enterprise calendar component
- **react-day-picker** - Date picker (lightweight)
- **@heroui/react** - Calendar with RTL support

**Recommendation:** Use `react-day-picker` for date inputs, `Schedule-X` for full calendar views

### 2. **QR Code Components**
- **next-qrcode** (`next-qrcode`) - QR code generation
- **react-qr-barcode-scanner** - QR code scanning
- **qrcode.react** - Simple QR code display

**Recommendation:** Use `next-qrcode` for generation, `react-qr-barcode-scanner` for scanning

### 3. **PDF Components**
- **react-pdf** (`react-pdf`) - PDF viewer
- **jspdf** (`jspdf`) - PDF generation

**Recommendation:** Both are essential for certificates

### 4. **Chart Components**
- **recharts** - Already installed ✅
- Can add more chart types if needed

### 5. **Form Components**
- **react-hook-form** - Form management
- **zod** - Schema validation
- **@radix-ui/react-form** - Accessible form primitives

**Recommendation:** Use react-hook-form + zod (already planned)

### 6. **Additional shadcn/ui Components**
We can add more components via shadcn CLI:
- Calendar
- Date Picker
- Select
- Combobox
- Popover
- Command (for search)

---

## 🎨 What We Should Build Custom

### 1. **Persona-Specific Components**
- Event Manager assignment dashboard
- HCP learning profile
- Organizer event wizard
- Vendor marketplace
- Regulator review workflow

**Why:** These are domain-specific to CME events and need custom business logic

### 2. **Apple Liquid Glass Components**
- LiquidGlassCard ✅ (already built)
- GlassButton ✅ (already built)
- Custom glass effects

**Why:** Need to match Apple's specific design system

### 3. **Onboarding Flows**
- Persona-specific onboarding ✅ (already built)

**Why:** Custom to our platform's workflow

### 4. **Global Search & Filters**
- GlobalSearch ✅ (already built)
- FilterPanel ✅ (already built)

**Why:** Needs integration with our mock data structure

---

## 📦 Recommended Package Installation

```bash
# Calendar
npm install react-day-picker date-fns
npm install @schedule-x/react @schedule-x/calendar

# QR Codes
npm install next-qrcode react-qr-barcode-scanner

# PDF
npm install react-pdf jspdf

# Forms
npm install react-hook-form zod @hookform/resolvers

# Additional shadcn components (via CLI)
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add select
```

---

## 🔄 Integration Strategy

1. **Use Libraries for Generic Components:**
   - Calendar → Schedule-X or react-day-picker
   - QR Codes → next-qrcode + react-qr-barcode-scanner
   - PDF → react-pdf + jspdf
   - Charts → recharts (already installed)

2. **Build Custom for Domain-Specific:**
   - Event management workflows
   - CME tracking
   - Persona-specific dashboards
   - Onboarding flows

3. **Wrap Libraries with Our Design System:**
   - Apply Apple Liquid Glass styling
   - Ensure RTL/Arabic support
   - Match our color system

---

## 🚀 Quick Win: Add shadcn/ui Components

We can immediately add useful components:

```bash
# Add calendar component
npx shadcn@latest add calendar

# Add date picker
npx shadcn@latest add popover
npx shadcn@latest add calendar  # if not already added

# Add command palette (for search)
npx shadcn@latest add command

# Add select dropdown
npx shadcn@latest add select
```

These will automatically use our existing design system (Apple Liquid Glass) if we configure them correctly.

---

## 💡 Recommendation

**DO:**
- ✅ Import calendar, QR code, PDF libraries
- ✅ Use shadcn/ui for additional UI primitives
- ✅ Leverage react-hook-form + zod for forms

**DON'T:**
- ❌ Build calendar from scratch
- ❌ Build QR code scanner from scratch
- ❌ Build PDF viewer from scratch
- ❌ Rebuild form validation

**CUSTOM BUILD:**
- ✅ Persona-specific business logic components
- ✅ Apple Liquid Glass design system components
- ✅ Domain-specific workflows (CME tracking, event management)

---

## Next Steps

1. Install recommended packages
2. Integrate calendar component
3. Integrate QR code components
4. Integrate PDF components
5. Wrap them with our design system
6. Continue building custom domain components


