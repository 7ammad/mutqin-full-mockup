# Event Card Design Analysis & Information Hierarchy

## Information Needs by Persona

### 1. ORGANIZER Dashboard
**Primary Goal:** Manage events, track status, monitor performance

**Critical Information:**
- ✅ **Status** (Most Important) - Needs to know workflow position
- ✅ **Title** - Event identification
- ✅ **Date & Location** - Logistics planning
- ✅ **CME Hours** - Accreditation details
- ✅ **Registration Count** - Performance metric (NEW)
- ✅ **Sponsorship Status** - Funding tracking
- ✅ **Description** - Quick context

**Information Priority:**
1. Status (with visual indicator)
2. Title
3. Registration count (for published events)
4. Date, Location, CME Hours
5. Sponsorship indicators
6. Description

---

### 2. VENDOR Dashboard
**Primary Goal:** Find sponsorship opportunities, evaluate ROI

**Critical Information:**
- ✅ **Title** - Event identification
- ✅ **Date & Location** - Event logistics
- ✅ **CME Hours** - Event scale indicator
- ✅ **Sponsorship Package** - Value proposition (NEW)
- ✅ **Sponsorship Value** - Investment amount
- ✅ **Needs Sponsorship Badge** - Opportunity indicator
- ✅ **Description** - Event context

**Information Priority:**
1. Needs Sponsorship indicator
2. Title
3. Sponsorship package details (value, type)
4. Date, Location, CME Hours
5. Description

---

### 3. REGULATOR Dashboard
**Primary Goal:** Review and approve events, ensure compliance

**Critical Information:**
- ✅ **Title** - Event identification
- ✅ **Date & Location** - Event details
- ✅ **CME Hours** - Accreditation hours
- ✅ **SFDA License** - Compliance tracking (NEW - Critical)
- ✅ **Status** - Approval workflow
- ✅ **Description** - Event content review
- ✅ **Action Buttons** - Approve/Reject

**Information Priority:**
1. SFDA License number (most critical)
2. Status (Pending Approval)
3. Title
4. Date, Location, CME Hours
5. Description
6. Action buttons

---

### 4. HCP Dashboard
**Primary Goal:** Discover events, register, track CME hours

**Critical Information:**
- ✅ **Title** - Event identification
- ✅ **Date & Location** - Attendance planning
- ✅ **CME Hours** - Primary decision factor (HIGHLIGHTED)
- ✅ **CME Accredited Badge** - Quality indicator
- ✅ **Description** - Event content
- ✅ **Registration Status** - Already registered?
- ✅ **Action Button** - Register/Registered

**Information Priority:**
1. CME Hours (most important - decision driver)
2. CME Accredited badge
3. Title
4. Date, Location
5. Description
6. Registration status & action

---

## Card Structure with Dividers

### Visual Hierarchy:
```
┌─────────────────────────────────┐
│ [Status Border - Left 4px]      │
│ ┌─────────────────────────────┐ │
│ │ HEADER SECTION              │ │
│ │ • Badges (Specialty, Status)│ │
│ │ • Title (Large, Bold)       │ │
│ │ • Organizer (Icon + Name)   │ │
│ └─────────────────────────────┘ │
│ ─────────────────────────────── │ ← Divider 1
│ ┌─────────────────────────────┐ │
│ │ CONTENT SECTION              │ │
│ │ • Description (2 lines)     │ │
│ ─────────────────────────────── │ ← Divider 2
│ │ DETAILS SECTION             │ │
│ │ 📅 Date (with label)        │ │
│ │ 📍 Location (with label)    │ │
│ │ ⏰ CME Hours (highlighted)  │ │
│ │ 👥 Registrations (if org)    │ │
│ │ 📄 License (if regulator)   │ │
│ └─────────────────────────────┘ │
│ ─────────────────────────────── │ ← Divider 3
│ ┌─────────────────────────────┐ │
│ │ FOOTER SECTION               │ │
│ │ [Action Button]              │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Design Enhancements Implemented

### 1. Dividers/Sub-containers
- ✅ Header section (badges, title, organizer)
- ✅ Content section (description)
- ✅ Details section (date, location, CME hours)
- ✅ Persona-specific info (registrations, license)
- ✅ Footer section (action buttons)
- ✅ Visual dividers between sections

### 2. Information Icons with Containers
- ✅ Each info item has icon in rounded container
- ✅ Label above value for clarity
- ✅ Consistent spacing and alignment

### 3. Persona-Specific Information
- ✅ **Organizer:** Registration count with Users icon
- ✅ **Regulator:** SFDA License with FileText icon
- ✅ **Vendor:** Sponsorship package (shown below card)
- ✅ **HCP:** CME hours highlighted, accredited badge

### 4. Visual Structure
- ✅ Clear section separation with dividers
- ✅ Icon containers for visual grouping
- ✅ Label + Value pattern for clarity
- ✅ Consistent padding and spacing

---

## Key Information Summary

| Persona | Most Important | Secondary | Tertiary |
|---------|---------------|-----------|----------|
| **Organizer** | Status, Registrations | Title, Date/Location | CME Hours, Sponsorship |
| **Vendor** | Sponsorship Package | Title, CME Hours | Date/Location, Description |
| **Regulator** | SFDA License | Status, Title | Date/Location, CME Hours |
| **HCP** | CME Hours | Accredited Badge, Title | Date/Location, Description |

---

## Next Steps
- [x] Add dividers between sections
- [x] Add icon containers for info items
- [x] Add labels for date/location/CME
- [x] Add registration count for organizers
- [x] Add SFDA license for regulators
- [x] Enhance CME hours display
- [ ] Consider adding more metrics (views, engagement, etc.)
- [ ] Add quick actions (edit, duplicate, etc.) for organizers

