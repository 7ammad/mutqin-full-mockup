# Persona Dashboard Deep Dive Report
## Comprehensive Analysis of L1/L2 Content, Data Flows, and CME/CPD Validation

**Generated:** 2025-01-27  
**Last Updated:** 2025-01-27  
**Scope:** All 5 Personas (Organizer, Event Manager, HCP, Vendor, Regulator)  
**Focus:** Dashboard content, data cycles, cross-persona flows, CME/CPD compliance

---

## Executive Summary

This report provides a comprehensive analysis of:
1. **Raw Data Inventory:** What each persona dashboard (L1) and detail page (L2) contains
2. **Function Mapping:** Purpose and capabilities of each page/tab
3. **Data Flow Analysis:** How data moves within personas and between personas
4. **CME/CPD Flow Validation:** Verification against the complete accreditation-to-certificate lifecycle
5. **Enhancement Recommendations:** UX improvements, feature gaps, and structural suggestions

**Key Findings:**
- All 5 personas have L1 dashboards with tab-based navigation
- 21 L2 detail routes are documented and mostly implemented
- Data flows exist but some cross-persona synchronization gaps identified
- CME/CPD flow is mostly complete but missing some compliance tracking features
- Vendor dashboard uses custom tab system instead of global sidebar tabs (inconsistency)
- **NEW:** HCP dashboard now includes `files` tab for quick access to tickets and certificates

---

## Part 1: Raw Data Analysis - Per Persona Dashboard Content

### 1.1 Organizer (CPD Provider) Dashboard

#### L1 Dashboard: `/dashboard/organizer`

**Tabs (from IA-SITEMAP.md):**
- `overview` (default)
- `activities`
- `accreditation`
- `execution`
- `sponsors`

**Tab: overview**
- **Purpose:** Pipeline snapshot and next actions
- **Content:**
  - KPI strip: draft events, pending accreditation, approved, upcoming, completed
  - Compliance KPIs: due soon, overdue
  - Next actions list (e.g., "3 activities ready to submit")
- **Functions:**
  - View event pipeline status
  - Quick access to actions requiring attention
  - Navigate to event master (O1)
- **Data Sources:**
  - `getOrganizerEvents(organizerId)` - filters events by organizerId
  - `getOrganizerCompliance(organizerId)` - compliance status per event
  - KPI calculations from event status counts
- **Implementation Status:** ✅ Implemented (`OverviewTab.tsx`)

**Tab: activities**
- **Purpose:** Workbench for all organizer events
- **Content:**
  - Table: event, date, city, lifecycle status
  - Filters: status, date, city, search query
- **Functions:**
  - View all events owned by organizer
  - Filter and search events
  - Navigate to event detail pages (O1-O6)
- **Data Sources:**
  - `getOrganizerEvents(organizerId)`
  - Event status normalization
- **Implementation Status:** ✅ Implemented (in `OrganizerView.tsx`)

**Tab: accreditation**
- **Purpose:** Track accreditation submissions and decisions
- **Content:**
  - Table: event, submission date, status, regulator notes
- **Functions:**
  - Submit for accreditation (POST `/api/write/accreditation/submit`)
  - View accreditation status
  - Navigate to event master (O1)
- **Data Sources:**
  - Events with status `pending_review`, `approved`, `rejected`
  - Accreditation decision artifacts from regulator
- **Implementation Status:** ✅ Implemented (in `OrganizerView.tsx`)

**Tab: execution**
- **Purpose:** Manage execution readiness and post-event status
- **Content:**
  - Table: event, assigned EM/vendor, execution date, attendance status, compliance status
- **Functions:**
  - Assign Event Manager/vendor (O7)
  - View registrations (O3)
  - View attendance (O4)
  - Navigate to event master (O1)
- **Data Sources:**
  - Events with assignments
  - Attendance records from Event Manager
  - Compliance status
- **Implementation Status:** ✅ Implemented (`ExecutionTab.tsx`)

**Tab: sponsors**
- **Purpose:** Overview of sponsorships across events
- **Content:**
  - Table: sponsor, event, package, amount, status
  - KPIs: total sponsored events, top sponsors
- **Functions:**
  - View event sponsorships (O6)
  - Navigate to event master (O1)
- **Data Sources:**
  - `getOrganizerSponsors(organizerId)`
  - Sponsorship deals and packages
- **Implementation Status:** ✅ Implemented (`SponsorsTab.tsx`)

#### L2 Detail Pages (Organizer)

**O1: `/dashboard/organizer/events/[eventId]` - Event Master**
- **Purpose:** Single source of truth for event
- **Content:** Event status, KPIs, quick links to all event functions
- **Functions:** Central hub for event management
- **Data Flow:** Reads event, provider org, execution vendor, audit trail
- **Status:** ✅ Implemented

**O2: `/dashboard/organizer/events/[eventId]/edit` - Event Edit**
- **Purpose:** Edit agenda, speakers, logistics, metadata
- **Content:** Event form with all editable fields
- **Functions:** Update event details, save changes
- **Data Flow:** Reads event, writes updates via `POST /api/write/activity/update`
- **Status:** ✅ Implemented

**O3: `/dashboard/organizer/events/[eventId]/registrations` - Event Registrations**
- **Purpose:** List of registered HCPs, registration status
- **Content:** Table of tickets/registrations
- **Functions:** View registrations, filter, export
- **Data Flow:** Reads tickets filtered by eventId
- **Status:** ✅ Implemented

**O4: `/dashboard/organizer/events/[eventId]/attendance` - Event Attendance**
- **Purpose:** Final attendance ledger and compliance readiness
- **Content:** Attendance records, exceptions, finalized status
- **Functions:** View attendance, finalize, submit compliance records
- **Data Flow:** Reads attendance scans from Event Manager, writes finalization
- **Status:** ✅ Implemented

**O5: `/dashboard/organizer/events/[eventId]/certificates` - Event Certificates**
- **Purpose:** Event-level view of certificate issuance and status
- **Content:** List of certificates, issuance status
- **Functions:** View certificates, generate certificates, track issuance
- **Data Flow:** Reads certificates filtered by eventId
- **Status:** ✅ Implemented

**O6: `/dashboard/organizer/events/[eventId]/sponsors` - Event Sponsors**
- **Purpose:** Sponsorship deals and packages for one event
- **Content:** Packages, deals, disclosures
- **Functions:** View sponsorships, manage packages
- **Data Flow:** Reads sponsorships filtered by eventId
- **Status:** ✅ Implemented

**O7: `/dashboard/organizer/events/[eventId]/assign` - Event Assignment**
- **Purpose:** Assign execution vendor / Event Manager
- **Content:** Vendor selection, assignment form
- **Functions:** Create assignment, assign vendor
- **Data Flow:** Writes assignment via `POST /api/write/assignment/request`
- **Status:** ✅ Implemented

---

### 1.2 Event Manager (Execution Vendor) Dashboard

#### L1 Dashboard: `/dashboard/event-manager`

**Tabs (from IA-SITEMAP.md):**
- `assignments` (should be default, currently `inbox`)
- `checkin`
- `attendance`
- `certificates`
- `handover`

**Tab: assignments (implemented as `inbox`)**
- **Purpose:** Inbox of assigned events requiring acceptance
- **Content:**
  - Table: event, date, venue, assignment status, priority
- **Functions:**
  - Accept / Decline assignment (POST `/api/write/assignment/respond`)
  - Navigate to ops overview (EM1)
- **Data Sources:**
  - `getEventManagerAssignments(eventManagerId)`
  - Assignment status: `pending`, `accepted`, `declined`
- **Implementation Status:** ✅ Implemented (as `inbox` tab, needs alignment with IA-SITEMAP)

**Tab: checkin**
- **Purpose:** Launch live check-in for events in execution
- **Content:**
  - List/dropdown of "today / upcoming" events with small stats
- **Functions:**
  - Open check-in console (EM2)
- **Data Sources:**
  - Events with accepted assignments
  - Today's events filter
- **Implementation Status:** ⚠️ Partially implemented (exists as `live-ops`, needs alignment)

**Tab: attendance**
- **Purpose:** Manage attendance ledger for each event and its finalize status
- **Content:**
  - Table: event, registered vs attended, exceptions count, finalized flag
- **Functions:**
  - Open attendance ledger (EM3)
  - Finalize attendance
- **Data Sources:**
  - Attendance scans, overrides, finalized status
- **Implementation Status:** ✅ Implemented (`EventManagerAttendanceTab.tsx`)

**Tab: certificates**
- **Purpose:** EM view into certificate readiness
- **Content:**
  - Table: event, eligible count, issued count
- **Functions:**
  - View certificate status
  - Navigate to organizer certificates (O5)
- **Data Sources:**
  - Certificates filtered by event
- **Implementation Status:** ⚠️ Not clearly implemented (may be in analytics tab)

**Tab: handover**
- **Purpose:** Post-event handover status for each event
- **Content:**
  - Table: event, date, handover status (pending, in_progress, completed)
- **Functions:**
  - Open handover pack (EM4)
- **Data Sources:**
  - Handover artifacts, status
- **Implementation Status:** ✅ Implemented (`HandoverPackTab.tsx`)

#### L2 Detail Pages (Event Manager)

**EM1: `/dashboard/event-manager/events/[eventId]` - Ops Overview**
- **Purpose:** High-level operational view: event info, assignment status, quick links
- **Content:** Event details, assignment info, links to check-in, attendance, handover
- **Functions:** Central hub for event operations
- **Data Flow:** Reads event, assignment, provides navigation
- **Status:** ✅ Implemented

**EM2: `/dashboard/event-manager/events/[eventId]/checkin` - Check-In Console**
- **Purpose:** Live check-in via QR/manual entry with counters
- **Content:** QR scanner, manual entry, scan history, counters
- **Functions:** Scan tickets, check-in HCPs, view recent scans
- **Data Flow:** Reads tickets, writes attendance scans via `POST /api/write/ticket/checkin`
- **Status:** ✅ Implemented

**EM3: `/dashboard/event-manager/events/[eventId]/attendance` - Attendance Ledger**
- **Purpose:** Detailed attendance list, exceptions, finalize action
- **Content:** Attendance records, overrides, finalized status
- **Functions:** View attendance, request overrides, finalize attendance
- **Data Flow:** Reads attendance scans, writes finalization via `POST /api/write/attendance/finalize`
- **Status:** ✅ Implemented

**EM4: `/dashboard/event-manager/events/[eventId]/handover` - Handover Pack**
- **Purpose:** View / confirm handover artifacts (summary, exceptions, logs)
- **Content:** Handover summary, exceptions, audit logs
- **Functions:** View handover, confirm completion
- **Data Flow:** Reads handover artifacts, writes confirmation
- **Status:** ✅ Implemented

---

### 1.3 HCP (Healthcare Professional) Dashboard

#### L1 Dashboard: `/dashboard/hcp`

**Tabs (from IA-SITEMAP.md):**
- `discover` (default)
- `registrations` (My Journey)
- `files` (NEW - Quick access to tickets and certificates)
- `credits` (CME Credits)
- `certs_reviews` (alias redirects to `credits`)

**Tab: discover**
- **Purpose:** Browse accredited activities
- **Content:**
  - Cards: event, date, city, credits, organizer
  - Filters: specialty, city, date
  - Compact CME tracker (mobile only)
- **Functions:**
  - Register for event (in-page modal)
  - Navigate to event detail (H1)
- **Data Sources:**
  - `getHcpActivities(hcpId).discover` - published events not yet registered
  - Filters events by status `published`
- **Implementation Status:** ✅ Implemented (`DiscoveryGrid.tsx`)

**Tab: registrations (My Journey)**
- **Purpose:** Chronological timeline of all activity registrations
- **Content:**
  - Timeline view: event, date, status (upcoming, completed, cancelled)
  - Chronological organization of registrations
- **Functions:**
  - View registration timeline
  - Navigate to event detail (H1)
  - Navigate to files tab for ticket/certificate access
- **Data Sources:**
  - `getHcpActivities(hcpId).myTickets`
  - Tickets filtered by hcpId
- **Implementation Status:** ✅ Implemented (`MyTickets.tsx`)

**Tab: files (NEW)**
- **Purpose:** Quick access to tickets (QR codes) and certificates for on-site/verification use
- **Content:**
  - Two view modes: `tickets` and `certificates`
  - Tickets section: Upcoming tickets with QR codes, past tickets
  - Certificates section: All certificates with download/verification links
  - Filters: Upcoming/past tickets, certificate filters and sorting
  - Quick access for on-site check-in and verification
- **Functions:**
  - View tickets with QR codes (for event check-in)
  - Download/verify certificates
  - Filter and search tickets and certificates
  - Navigate to ticket detail (H2) or certificate detail (H3)
  - Deep linking: Can navigate to specific ticket/certificate via URL params
- **Data Sources:**
  - `getHcpSummaryFull(hcpId).tickets` - all tickets for HCP
  - `getHcpSummaryFull(hcpId).certificates` - all certificates for HCP
  - Events linked to tickets/certificates
- **Implementation Status:** ✅ Implemented (`HcpFilesTab.tsx`)
- **URL Parameters:**
  - `?tab=files&view=tickets` - tickets view (default)
  - `?tab=files&view=certificates` - certificates view
  - `?tab=files&eventId=[id]` - focus on specific event
  - `?tab=files&ticketId=[id]` - scroll to specific ticket

**Tab: credits (CME Credits)**
- **Purpose:** Analytical history of accumulated credits/hours with breakdowns
- **Content:**
  - KPI strip: total this period, pending, posted hours
  - Annual progress bar: SCFHS target (40 hours) with progress
  - Credits log: Grouped by year with filters
  - Specialty breakdown: Top 5 specialties by hours
  - Filters: Period (all, this year, last 12 months), Status (all, posted, pending)
  - Merged with certificates and reviews data
- **Functions:**
  - View credit history with year grouping
  - Filter by period and status
  - View specialty breakdown
  - Open event (H1)
  - Navigate to certificate in files tab (H3)
  - Export hours statement (planned, currently disabled)
- **Data Sources:**
  - `getHcpCredits(hcpId)` - earned, pending, posted credits
  - `getHcpSummary(hcpId).certificates` - certificate data
  - `getHcpSummary(hcpId).reviews` - review data
- **Implementation Status:** ✅ Implemented (`CreditsTab` component in `HCPView.tsx`)
- **Enhancements:**
  - Credit status badges (earned, pending, posted)
  - Year-based grouping for ledger display
  - Specialty breakdown visualization
  - Direct navigation to certificates in files tab

**Tab: certs_reviews**
- **Purpose:** Alias tab that redirects to `credits` tab
- **Content:** Same as `credits` tab
- **Functions:** Same as `credits` tab
- **Data Sources:** Same as `credits` tab
- **Implementation Status:** ✅ Implemented (alias redirects to `credits` tab via `effectiveTab` logic)
- **Note:** This tab exists for backward compatibility and URL routing. The actual content is merged into the `credits` tab.

#### L2 Detail Pages (HCP)

**H1: `/dashboard/hcp/events/[eventId]` - Event Detail**
- **Purpose:** Full event information for HCP (agenda, credits, logistics)
- **Content:** Event details, agenda, speakers, registration form
- **Functions:** View event, register, view ticket context
- **Data Flow:** Reads event, provides in-page registration
- **Status:** ✅ Implemented

**H2: `/dashboard/hcp/tickets/[ticketId]` - Ticket Detail**
- **Purpose:** Ticket/QR code, instructions, minimal event info
- **Content:** QR code, ticket details, event link
- **Functions:** View ticket, download QR, navigate to event
- **Data Flow:** Reads ticket by ticketId
- **Status:** ✅ Implemented

**H3: `/dashboard/hcp/certificates/[certificateId]` - Certificate Detail**
- **Purpose:** Certificate view/download/verification and sharing
- **Content:** Certificate PDF, verification link, event link
- **Functions:** View certificate, download, share, verify
- **Data Flow:** Reads certificate by certificateId
- **Status:** ✅ Implemented

---

### 1.4 Vendor/Sponsor Dashboard

#### L1 Dashboard: `/dashboard/vendor`

**Tabs (from IA-SITEMAP.md):**
- `marketplace` (default)
- `purchases`
- `assets`
- `performance`
- `billing`

**⚠️ CRITICAL INCONSISTENCY:** Vendor dashboard uses custom tab system (`MARKETPLACE`, `ADVANCED_MARKETPLACE`, `PACKAGES`, etc.) instead of global sidebar tabs. This violates the global sidebar architecture.

**Tab: marketplace**
- **Purpose:** Discover sponsorship opportunities
- **Content:**
  - Cards: event, audience profile/size, base packages
- **Functions:**
  - View event (V1)
  - Sponsor this event (in-page modal)
- **Data Sources:**
  - Events with status `approved` or `published`
  - Sponsor packages
- **Implementation Status:** ✅ Implemented (`MarketplaceFeed.tsx`, but uses custom tabs)

**Tab: purchases**
- **Purpose:** List of purchased sponsorships
- **Content:**
  - Table: event, package, amount, payment status
- **Functions:**
  - Open sponsorship (V2)
- **Data Sources:**
  - `getVendorSponsorships(vendorId)`
- **Implementation Status:** ⚠️ Not clearly separated (may be in marketplace view)

**Tab: assets**
- **Purpose:** Manage creative assets & compliance files
- **Content:**
  - List of assets per campaign/event
- **Functions:**
  - Upload/replace assets (in-page)
- **Data Sources:**
  - Asset storage (not clearly defined in contracts)
- **Implementation Status:** ⚠️ Not clearly implemented

**Tab: performance**
- **Purpose:** See sponsor ROI across campaigns and events
- **Content:**
  - KPIs and charts: events sponsored, attendees reached, specialties
  - Table: campaigns with period and metrics
- **Functions:**
  - Open campaign (V3)
  - Open event performance (V1)
- **Data Sources:**
  - Campaign analytics, event performance metrics
- **Implementation Status:** ✅ Implemented (`CampaignAnalytics.tsx`, `ROIReporting.tsx`)

**Tab: billing**
- **Purpose:** Invoices and payment history
- **Content:**
  - Table: invoice, event/campaign, amount, status
- **Functions:**
  - View invoices, payment history
- **Data Sources:**
  - Invoice data (not clearly defined in contracts)
- **Implementation Status:** ⚠️ Not clearly implemented

#### L2 Detail Pages (Vendor)

**V1: `/dashboard/vendor/events/[eventId]` - Sponsor Event View**
- **Purpose:** Event information from sponsor perspective: audience, packages, performance
- **Content:** Event details, audience profile, packages, performance metrics
- **Functions:** View event, sponsor event, view performance
- **Data Flow:** Reads event, packages, performance data
- **Status:** ✅ Implemented

**V2: `/dashboard/vendor/sponsorships/[sponsorshipId]` - Sponsorship Detail**
- **Purpose:** Contract/package details, payment status, disclosures
- **Content:** Sponsorship details, package info, payment status, disclosures
- **Functions:** View sponsorship, manage disclosure, view payment
- **Data Flow:** Reads sponsorship by sponsorshipId
- **Status:** ✅ Implemented

**V3: `/dashboard/vendor/campaigns/[campaignId]` - Campaign Detail**
- **Purpose:** Campaign overview, constituent events, ROI metrics
- **Content:** Campaign details, events, ROI charts
- **Functions:** View campaign, view event performance (V1)
- **Data Flow:** Reads campaign by campaignId
- **Status:** ✅ Implemented

---

### 1.5 Regulator Dashboard

#### L1 Dashboard: `/dashboard/regulator`

**Tabs (from IA-SITEMAP.md):**
- `review_queue` (default, implemented as `queue`)
- `decision_workspace` (implemented as `review`)
- `compliance_monitor` (implemented as `monitoring`)
- `audit_risk` (implemented as `decisions`)
- `analytics`

**Tab: review_queue (implemented as `queue`)**
- **Purpose:** Triage for all new accreditation applications
- **Content:**
  - Table: applicationId, event, provider, status, submitted date
- **Functions:**
  - Open application (R1)
  - Review (R2)
- **Data Sources:**
  - `getRegulatorQueue()` - events with status `pending_review`
- **Implementation Status:** ✅ Implemented (`RegulatorQueueTab.tsx`)

**Tab: decision_workspace (implemented as `review`)**
- **Purpose:** Focused workspace of "in review" applications
- **Content:**
  - List of active application rows
- **Functions:**
  - Open decision workspace (R2)
- **Data Sources:**
  - Events in review state
- **Implementation Status:** ✅ Implemented (`RegulatorReviewTab.tsx`)

**Tab: compliance_monitor (implemented as `monitoring`)**
- **Purpose:** Monitor provider/event compliance (attendance/hours etc.)
- **Content:**
  - Provider table: name, compliance score, flags
  - Event table: event, provider, compliance status, last submission date
- **Functions:**
  - Navigate to provider (R4)
  - Navigate to application (R1)
- **Data Sources:**
  - Compliance data from events (attendance records, hours registration)
- **Implementation Status:** ✅ Implemented (`RegulatorAuditTab.tsx`)

**Tab: audit_risk (implemented as `decisions`)**
- **Purpose:** Focus on high-risk providers/events
- **Content:**
  - Table: provider, risk level, last audit date, unresolved issues
- **Functions:**
  - Navigate to provider (R4)
- **Data Sources:**
  - Risk scoring, audit history
- **Implementation Status:** ✅ Implemented (`RegulatorDecisionsTab.tsx`)

**Tab: analytics**
- **Purpose:** Ecosystem-level metrics for the regulator
- **Content:**
  - Charts: events/year, credits issued, provider performance
- **Functions:**
  - View analytics, export reports
- **Data Sources:**
  - Aggregated event data, provider statistics
- **Implementation Status:** ✅ Implemented (`RegulatorAnalyticsTab.tsx`)

#### L2 Detail Pages (Regulator)

**R1: `/dashboard/regulator/applications/[applicationId]` - Application Detail**
- **Purpose:** Full application view: event info, provider, status, history
- **Content:** Application details, event info, provider info, status history
- **Functions:** View application, navigate to decision (R2), checklist (R3)
- **Data Flow:** Reads application/event, provides navigation
- **Status:** ✅ Implemented

**R2: `/dashboard/regulator/applications/[applicationId]/decision` - Decision Workspace**
- **Purpose:** Decision screen with form, status change, comments
- **Content:** Decision form, checklist, comments, approve/reject actions
- **Functions:** Make decision, add comments, change status
- **Data Flow:** Writes decision via `POST /api/write/regulator/decision`
- **Status:** ✅ Implemented

**R3: `/dashboard/regulator/applications/[applicationId]/checklist` - Checklist View**
- **Purpose:** Detailed rubric and scoring inputs/outputs
- **Content:** Checklist items, scoring, notes
- **Functions:** Complete checklist, score application
- **Data Flow:** Reads/writes checklist data
- **Status:** ✅ Implemented

**R4: `/dashboard/regulator/providers/[providerId]` - Provider Profile**
- **Purpose:** Provider profile, event history, compliance score, risk flags
- **Content:** Provider details, event history, compliance metrics, risk indicators
- **Functions:** View provider, navigate to applications (R1)
- **Data Flow:** Reads provider data, event history
- **Status:** ✅ Implemented

---

## Part 2: Data Flow Analysis

### 2.1 Within-Persona Data Flows

#### Organizer Data Flow
```
Organizer Dashboard (L1)
  ├─> Overview Tab
  │   └─> Reads: events, compliance status
  │   └─> Calculates: KPIs, next actions
  │
  ├─> Activities Tab
  │   └─> Reads: getOrganizerEvents(organizerId)
  │   └─> Filters: status, date, city
  │   └─> Navigates: O1-O6 (L2 pages)
  │
  ├─> Accreditation Tab
  │   └─> Reads: events with accreditation status
  │   └─> Writes: POST /api/write/accreditation/submit
  │   └─> Receives: regulator decision updates
  │
  ├─> Execution Tab
  │   └─> Reads: events, assignments, attendance
  │   └─> Writes: POST /api/write/assignment/request (O7)
  │   └─> Reads: attendance from Event Manager
  │
  └─> Sponsors Tab
      └─> Reads: getOrganizerSponsors(organizerId)
      └─> Navigates: O6 (sponsors detail)

Event Detail (L2 - O1)
  └─> Central hub
  └─> Reads: event, provider, vendor, audit trail
  └─> Provides navigation to all event functions
```

#### Event Manager Data Flow
```
Event Manager Dashboard (L1)
  ├─> Assignments Tab (inbox)
  │   └─> Reads: getEventManagerAssignments(eventManagerId)
  │   └─> Writes: POST /api/write/assignment/respond
  │   └─> Navigates: EM1 (ops overview)
  │
  ├─> Check-in Tab
  │   └─> Reads: events with accepted assignments
  │   └─> Navigates: EM2 (check-in console)
  │
  ├─> Attendance Tab
  │   └─> Reads: attendance scans, overrides
  │   └─> Writes: POST /api/write/attendance/finalize
  │   └─> Navigates: EM3 (attendance ledger)
  │
  ├─> Certificates Tab
  │   └─> Reads: certificate status per event
  │   └─> Navigates: O5 (organizer certificates)
  │
  └─> Handover Tab
      └─> Reads: handover artifacts
      └─> Writes: handover confirmation
      └─> Navigates: EM4 (handover pack)

Check-in Console (L2 - EM2)
  └─> Reads: tickets for event
  └─> Writes: POST /api/write/ticket/checkin (attendance scans)
  └─> Updates: attendance counters in real-time
```

#### HCP Data Flow
```
HCP Dashboard (L1)
  ├─> Discover Tab
  │   └─> Reads: getHcpActivities(hcpId).discover
  │   └─> Filters: published events not registered
  │   └─> Writes: POST /api/write/registration/create (in-page modal)
  │   └─> Navigates: H1 (event detail)
  │
  ├─> Registrations Tab
  │   └─> Reads: getHcpActivities(hcpId).myTickets
  │   └─> Navigates: H2 (ticket detail), H1 (event detail)
  │
  └─> Credits Tab (merged with certs_reviews)
      └─> Reads: getHcpCredits(hcpId), getHcpSummary(hcpId)
      └─> Merges: credits, certificates, reviews
      └─> Navigates: H1 (event detail), H3 (certificate detail)

Ticket Detail (L2 - H2)
  └─> Reads: getTicketById(ticketId)
  └─> Displays: QR code, event link
```

#### Vendor Data Flow
```
Vendor Dashboard (L1) - ⚠️ Uses custom tabs, not global sidebar
  ├─> Marketplace View
  │   └─> Reads: published events with packages
  │   └─> Writes: POST /api/write/sponsorship/deal_created (in-page modal)
  │   └─> Navigates: V1 (event view)
  │
  ├─> Purchases View
  │   └─> Reads: getVendorSponsorships(vendorId)
  │   └─> Navigates: V2 (sponsorship detail)
  │
  ├─> Performance View
  │   └─> Reads: campaign analytics, ROI data
  │   └─> Navigates: V3 (campaign detail), V1 (event view)
  │
  └─> Assets/Billing Views
      └─> Reads: assets, invoices (not clearly defined)
```

#### Regulator Data Flow
```
Regulator Dashboard (L1)
  ├─> Review Queue Tab
  │   └─> Reads: getRegulatorQueue() (pending_review events)
  │   └─> Navigates: R1 (application detail), R2 (decision)
  │
  ├─> Decision Workspace Tab
  │   └─> Reads: events in review
  │   └─> Navigates: R2 (decision workspace)
  │
  ├─> Compliance Monitor Tab
  │   └─> Reads: compliance data from events
  │   └─> Navigates: R4 (provider profile), R1 (application)
  │
  ├─> Audit Risk Tab
  │   └─> Reads: risk scoring, audit history
  │   └─> Navigates: R4 (provider profile)
  │
  └─> Analytics Tab
      └─> Reads: aggregated event data, provider statistics

Decision Workspace (L2 - R2)
  └─> Reads: application/event details
  └─> Writes: POST /api/write/regulator/decision
  └─> Updates: event status (approved/rejected)
```

### 2.2 Cross-Persona Data Flows

#### Flow 1: Event Creation → Accreditation → Execution → Certificates

```
1. Organizer creates event
   └─> Writes: POST /api/write/activity/create
   └─> State: event.status = "draft"
   └─> Location: O2 (edit page)

2. Organizer submits for accreditation
   └─> Writes: POST /api/write/accreditation/submit
   └─> State: event.status = "pending_review"
   └─> Triggers: Event appears in Regulator queue

3. Regulator reviews
   └─> Reads: R1 (application detail)
   └─> Writes: POST /api/write/regulator/decision
   └─> State: event.status = "approved" or "rejected"
   └─> Updates: event.accreditation.decision

4. Organizer sees approval
   └─> Reads: event.status = "approved"
   └─> Can publish: POST /api/write/activity/publish
   └─> State: event.status = "published"
   └─> Triggers: Event appears in HCP discover, Vendor marketplace

5. Organizer assigns Event Manager
   └─> Writes: POST /api/write/assignment/request (O7)
   └─> Creates: Assignment entity
   └─> Triggers: Assignment appears in Event Manager inbox

6. Event Manager accepts assignment
   └─> Reads: Assignment in inbox
   └─> Writes: POST /api/write/assignment/respond
   └─> State: assignment.status = "accepted"
   └─> Updates: event.executionVendorOrgId

7. HCP registers
   └─> Reads: Published events in discover
   └─> Writes: POST /api/write/registration/create
   └─> Creates: Ticket entity
   └─> Updates: HCP myTickets list

8. Event day - Check-in
   └─> Event Manager: Reads tickets, scans QR (EM2)
   └─> Writes: POST /api/write/ticket/checkin
   └─> Creates: AttendanceScan entity
   └─> Updates: Attendance counters

9. Event Manager finalizes attendance
   └─> Writes: POST /api/write/attendance/finalize
   └─> State: attendance.status = "finalized"
   └─> Triggers: Organizer can see attendance (O4)

10. Certificates issued
    └─> Organizer/EM: Generates certificates (O5)
    └─> Creates: Certificate entities
    └─> Updates: HCP certificates list (H3)
    └─> Updates: HCP credits (credits tab)
```

#### Flow 2: Sponsorship Flow

```
1. Organizer enables sponsorship
   └─> Updates: event.sponsorship.packagesEnabled = true
   └─> Creates: SponsorPackage entities

2. Vendor discovers event
   └─> Reads: Published events with packages (marketplace)
   └─> Navigates: V1 (event view)

3. Vendor sponsors event
   └─> Writes: POST /api/write/sponsorship/deal_created
   └─> Creates: SponsorDeal entity
   └─> State: deal.status = "reserved" or "paid"
   └─> Updates: Organizer sponsors tab (O6)

4. Vendor submits disclosure
   └─> Writes: POST /api/write/sponsorship/disclosure_submitted
   └─> Creates: Disclosure entity
   └─> State: disclosure.status = "submitted"
   └─> Triggers: Organizer compliance review

5. Organizer approves disclosure
   └─> Writes: POST /api/write/sponsorship/disclosure_decided
   └─> State: disclosure.status = "approved"
   └─> Updates: Vendor can see approved disclosure (V2)
```

#### Flow 3: Compliance Flow

```
1. Event completed
   └─> State: event.status = "completed"
   └─> Triggers: Compliance windows open

2. Event Manager submits attendance records
   └─> Writes: POST /api/write/compliance/attendance-records/submit
   └─> State: event.compliance.attendanceRecords.status = "submitted"
   └─> Updates: Organizer execution tab (compliance status)

3. Organizer submits hours registration
   └─> Writes: POST /api/write/compliance/hours-registration/submit
   └─> State: event.compliance.hoursRegistration.status = "submitted"
   └─> Updates: Regulator compliance monitor (R monitoring tab)

4. Regulator monitors compliance
   └─> Reads: Compliance status in monitoring tab
   └─> Flags: Overdue submissions
   └─> Navigates: R4 (provider profile) for compliance score
```

### 2.3 Data Synchronization Gaps Identified

**Gap 1: Event Status Updates**
- ✅ Organizer → Regulator: Status change from `pending_review` to `approved` is synchronized
- ⚠️ Regulator → Organizer: Decision updates may not trigger real-time notifications
- ⚠️ Organizer → Event Manager: Assignment creation may not trigger real-time inbox update

**Gap 2: Attendance Data Flow**
- ✅ Event Manager → Organizer: Attendance finalization is synchronized
- ⚠️ Event Manager → HCP: Certificate issuance may not immediately update HCP credits tab
- ⚠️ Real-time check-in updates: May not be reflected immediately in attendance tab

**Gap 3: Sponsorship Flow**
- ✅ Vendor → Organizer: Sponsorship deals are synchronized
- ⚠️ Disclosure workflow: May not have clear status updates across personas
- ⚠️ Payment status: May not be clearly tracked in data flow

**Gap 4: Compliance Tracking**
- ⚠️ Compliance deadlines: Due dates may not be clearly calculated and displayed
- ⚠️ Overdue notifications: May not be automatically flagged
- ⚠️ Compliance submission status: May not be clearly visible to all relevant personas

---

## Part 3: CME/CPD Flow Validation

### 3.1 Complete CME/CPD Lifecycle Validation

#### Step 1: Activity Design & Submission ✅
- **Organizer:** Can create event (O2), submit for accreditation (accreditation tab)
- **Data:** Event created with status `draft` → `pending_review`
- **Validation:** ✅ Complete

#### Step 2: Accreditation Review ✅
- **Regulator:** Can review application (R1), make decision (R2)
- **Data:** Event status `pending_review` → `approved` or `rejected`
- **Validation:** ✅ Complete

#### Step 3: Publication & Assignment ✅
- **Organizer:** Can publish event (after approval), assign Event Manager (O7)
- **Data:** Event status `approved` → `published`, assignment created
- **Validation:** ✅ Complete

#### Step 4: Event Execution ✅
- **Event Manager:** Can accept assignment, run check-in (EM2), manage attendance (EM3)
- **Data:** Assignment accepted, attendance scans recorded, attendance finalized
- **Validation:** ✅ Complete

#### Step 5: Certificate Issuance ✅
- **Organizer/EM:** Can generate certificates (O5)
- **HCP:** Can view certificates (H3), see credits (credits tab)
- **Data:** Certificates created, credits updated
- **Validation:** ✅ Complete

#### Step 6: Compliance Submission ⚠️
- **Organizer:** Can submit attendance records and hours registration
- **Regulator:** Can monitor compliance (monitoring tab)
- **Data:** Compliance status tracked
- **Validation:** ⚠️ Partially complete - compliance deadlines and overdue tracking need enhancement

### 3.2 CME/CPD Flow Gaps

**Gap 1: Credit Calculation**
- ✅ Credits are assigned to events (`creditHours` field)
- ✅ Credits are tracked in HCP credits tab
- ⚠️ Credit posting timing: May not be clearly defined (when are credits "posted" vs "pending"?)
- ⚠️ Specialty-specific credits: May not be clearly tracked per specialty

**Gap 2: Certificate Generation**
- ✅ Certificates can be generated (O5)
- ✅ Certificates are linked to events and HCPs
- ⚠️ Certificate generation trigger: May not be clearly automated (when should certificates be generated?)
- ⚠️ Certificate verification: May not have public verification link

**Gap 3: Compliance Windows**
- ⚠️ Attendance records deadline: May not be clearly calculated from event end date
- ⚠️ Hours registration deadline: May not be clearly defined
- ⚠️ Extension requests: May not be clearly supported
- ⚠️ Overdue notifications: May not be automatically sent

**Gap 4: Accreditation Requirements**
- ✅ Accreditation decision is tracked
- ✅ Accreditation reason codes are stored
- ⚠️ Accreditation checklist: May not be clearly linked to decision (R3 exists but may not be fully integrated)
- ⚠️ Accreditation history: May not be clearly tracked per provider

---

## Part 4: Enhancement Recommendations

### 4.1 UX Enhancements

#### 4.1.1 Navigation Consistency
**Issue:** Vendor dashboard uses custom tabs instead of global sidebar tabs
**Recommendation:**
- Align Vendor dashboard with global sidebar architecture
- Use tabs: `marketplace | purchases | assets | performance | billing`
- Remove custom tab system from `VendorView.tsx`
- **Priority:** High

#### 4.1.2 Tab Naming Alignment
**Issue:** Some tabs use different names than IA-SITEMAP.md
- Event Manager: `inbox` vs `assignments`, `live-ops` vs `checkin`
- Regulator: `queue` vs `review_queue`, `review` vs `decision_workspace`, `monitoring` vs `compliance_monitor`, `decisions` vs `audit_risk`
**Recommendation:**
- Align all tab keys with IA-SITEMAP.md exactly
- Update `DashboardLayout.tsx` navigation items
- Update component tab handling
- **Priority:** Medium

#### 4.1.3 Default Tab Behavior
**Issue:** Default tabs may not match IA-SITEMAP.md
**Recommendation:**
- Verify default tabs match documentation:
  - Organizer: `overview` ✅
  - Event Manager: `assignments` (currently `inbox`)
  - HCP: `discover` ✅
  - Vendor: `marketplace` (needs verification)
  - Regulator: `review_queue` (currently `queue`)
- **Priority:** Medium

#### 4.1.4 CME Tracker Placement
**Issue:** CME tracker implementation may not match design constraints
**Recommendation:**
- Review `UI_REVAMP_CME_TRACKER.md` for design constraints
- Ensure compact design with strategic placement per tab
- Verify mobile-only display in discover tab
- **Priority:** Low

### 4.2 Feature Enhancements

#### 4.2.1 Real-Time Updates
**Recommendation:**
- Implement WebSocket or polling for real-time status updates
- Event status changes should propagate immediately
- Assignment notifications should appear in Event Manager inbox immediately
- Certificate issuance should update HCP credits tab immediately
- **Priority:** High

#### 4.2.2 Compliance Deadline Tracking
**Recommendation:**
- Calculate compliance deadlines from event end date
- Display deadline countdown in Organizer execution tab
- Send automated reminders for upcoming deadlines
- Flag overdue submissions prominently
- **Priority:** High

#### 4.2.3 Credit Posting Workflow
**Recommendation:**
- Define clear credit statuses: `earned`, `pending`, `posted`
- Automate credit posting after certificate issuance
- Track specialty-specific credits separately
- Provide credit history with filters
- **Priority:** Medium

#### 4.2.4 Certificate Verification
**Recommendation:**
- Add public verification link to certificates
- Enable certificate sharing with verification URL
- Add certificate verification page (public route)
- **Priority:** Medium

#### 4.2.5 Accreditation Checklist Integration
**Recommendation:**
- Link R3 (checklist) more clearly to R2 (decision)
- Pre-populate checklist from application data
- Store checklist scores with decision
- **Priority:** Low

### 4.3 L1/L2/L3 Structure Recommendations

#### 4.3.1 Current Structure Assessment
- **L1 (Dashboard Tabs):** ✅ Well-defined, mostly implemented
- **L2 (Detail Pages):** ✅ Well-defined, mostly implemented
- **L3 (Sub-details):** ❌ Not currently defined

#### 4.3.2 L3 Recommendations

**Consider L3 for:**
1. **Event Edit Sub-sections (O2):**
   - `/dashboard/organizer/events/[eventId]/edit/agenda`
   - `/dashboard/organizer/events/[eventId]/edit/speakers`
   - `/dashboard/organizer/events/[eventId]/edit/logistics`
   - **Rationale:** Event edit form is complex, sub-sections improve UX

2. **Check-in Sub-views (EM2):**
   - `/dashboard/event-manager/events/[eventId]/checkin/scanner` (QR scanner view)
   - `/dashboard/event-manager/events/[eventId]/checkin/manual` (manual entry view)
   - `/dashboard/event-manager/events/[eventId]/checkin/history` (scan history)
   - **Rationale:** Check-in console has multiple modes, L3 improves organization

3. **Attendance Detail Views (EM3, O4):**
   - `/dashboard/event-manager/events/[eventId]/attendance/exceptions` (exceptions only)
   - `/dashboard/event-manager/events/[eventId]/attendance/overrides` (override requests)
   - **Rationale:** Attendance ledger can be complex, filtered views help

4. **Analytics Sub-sections (Regulator, Vendor):**
   - `/dashboard/regulator/analytics/providers` (provider analytics)
   - `/dashboard/regulator/analytics/events` (event analytics)
   - `/dashboard/vendor/performance/campaigns` (campaign performance)
   - `/dashboard/vendor/performance/events` (event performance)
   - **Rationale:** Analytics can be deep, sub-sections improve navigation

**Recommendation:** Implement L3 only if L1/L2 become too complex. Current structure is sufficient for most use cases.

### 4.4 Data Flow Enhancements

#### 4.4.1 Event Status Synchronization
**Recommendation:**
- Implement event status change notifications
- Update all relevant dashboards when status changes
- Show status change history in event master (O1)
- **Priority:** High

#### 4.4.2 Assignment Workflow
**Recommendation:**
- Add assignment notifications to Event Manager
- Show assignment timeline in event master (O1)
- Add assignment status indicators in Organizer execution tab
- **Priority:** Medium

#### 4.4.3 Attendance Real-Time Updates
**Recommendation:**
- Implement real-time attendance counter updates in check-in console
- Show live attendance stats in attendance tab
- Update Organizer attendance view when Event Manager finalizes
- **Priority:** Medium

#### 4.4.4 Certificate Generation Workflow
**Recommendation:**
- Automate certificate generation after attendance finalization
- Add certificate generation queue in Organizer certificates tab
- Show certificate generation status in Event Manager certificates tab
- **Priority:** Low

### 4.5 Missing Features Identified

#### 4.5.1 Vendor Dashboard
- ⚠️ Assets management: Not clearly implemented
- ⚠️ Billing/invoices: Not clearly implemented
- ⚠️ Custom tab system: Should use global sidebar

#### 4.5.2 Event Manager Dashboard
- ⚠️ Certificates tab: Not clearly separated (may be in analytics)
- ⚠️ Tab naming: Needs alignment with IA-SITEMAP.md

#### 4.5.3 Compliance Tracking
- ⚠️ Deadline calculations: Not clearly implemented
- ⚠️ Overdue notifications: Not clearly implemented
- ⚠️ Extension requests: Not clearly supported

#### 4.5.4 HCP Dashboard
- ✅ All tabs implemented
- ✅ **NEW:** `files` tab implemented for quick access to tickets and certificates
- ✅ Credits tab enhanced with filters, year grouping, and specialty breakdown
- ✅ Certs_reviews tab: Alias redirects to credits (properly documented)
- ✅ Deep linking support: Files tab supports URL parameters for navigation

---

## Part 5: Implementation Priority Matrix

### High Priority (Critical for CME/CPD Flow)
1. **Vendor Dashboard Tab Alignment** - Fix custom tabs to use global sidebar
2. **Real-Time Status Updates** - Ensure cross-persona synchronization
3. **Compliance Deadline Tracking** - Calculate and display deadlines
4. **Tab Naming Alignment** - Align all tabs with IA-SITEMAP.md

### Medium Priority (Important for UX)
1. **Default Tab Verification** - Ensure defaults match documentation
2. **Credit Posting Workflow** - Define and implement credit status workflow
3. **Certificate Verification** - Add public verification links
4. **Assignment Workflow** - Enhance assignment notifications and status

### Low Priority (Nice to Have)
1. **L3 Structure** - Consider for complex forms/views
2. **Accreditation Checklist Integration** - Better link R3 to R2
3. **Certificate Generation Automation** - Automate after attendance finalization
4. **Analytics Sub-sections** - Consider L3 for deep analytics

---

## Part 6: Summary & Next Steps

### Summary
- **L1 Dashboards:** 5 personas, 25 tabs total (HCP now has 5 tabs including new `files` tab), mostly implemented
- **L2 Detail Pages:** 21 routes documented, mostly implemented
- **Data Flows:** Within-persona flows complete, cross-persona flows mostly complete with some gaps
- **CME/CPD Flow:** Core flow complete, compliance tracking needs enhancement
- **UX Issues:** Vendor dashboard inconsistency, tab naming misalignment
- **Recent Updates:**
  - ✅ HCP `files` tab implemented for quick ticket/certificate access
  - ✅ HCP `credits` tab enhanced with filters, year grouping, and specialty breakdown
  - ✅ Deep linking support added to HCP files tab

### Recommended Next Steps
1. **Immediate:** Fix Vendor dashboard to use global sidebar tabs
2. **Short-term:** Align all tab names with IA-SITEMAP.md
3. **Short-term:** Implement compliance deadline tracking
4. **Medium-term:** Add real-time status update mechanism
5. **Medium-term:** Enhance credit posting workflow
6. **Long-term:** Consider L3 structure for complex views

---

## Part 7: Recent Updates (2025-01-27)

### HCP Dashboard Enhancements

#### New `files` Tab Implementation
- **Status:** ✅ Fully implemented
- **Component:** `src/components/hcp/HcpFilesTab.tsx`
- **Purpose:** Quick access to tickets (QR codes) and certificates for on-site/verification use
- **Features:**
  - Dual view modes: Tickets and Certificates
  - Tickets section:
    - Upcoming tickets with QR codes for event check-in
    - Past tickets with historical access
    - Filters: All, This Week, This Month
    - Year-based grouping for past tickets
  - Certificates section:
    - All certificates with download/verification links
    - Filters: All, This Year, Last Year
    - Sorting: By date or by hours
    - Quick access for verification
  - Deep linking support:
    - `?tab=files&view=tickets` - tickets view
    - `?tab=files&view=certificates` - certificates view
    - `?tab=files&eventId=[id]` - focus on specific event
    - `?tab=files&ticketId=[id]` - scroll to specific ticket
  - Auto-scroll to focused items when navigating from other tabs
- **Data Sources:**
  - `getHcpSummaryFull(hcpId).tickets`
  - `getHcpSummaryFull(hcpId).certificates`
  - Events linked to tickets/certificates
- **Integration Points:**
  - Discovery tab navigates to files tab when viewing registered events
  - Credits tab has "Open certificate" buttons that navigate to files tab
  - My Journey (registrations) tab can navigate to files tab for ticket access

#### Enhanced `credits` Tab
- **Status:** ✅ Enhanced with new features
- **Component:** `CreditsTab` in `src/components/hcp/HCPView.tsx`
- **New Features:**
  - Enhanced KPI display: Total hours, Pending, Posted with visual cards
  - Annual progress bar: SCFHS target (40 hours) with progress visualization
  - Year-based grouping: Credits log grouped by year for better organization
  - Specialty breakdown: Top 5 specialties by hours with visualization
  - Advanced filters:
    - Period filter: All, This Year, Last 12 Months
    - Status filter: All, Posted, Pending
  - Credit status badges: Visual indicators for earned, pending, posted status
  - Direct navigation: "Open certificate" buttons link to files tab
  - Export functionality: "Download hours statement" button (planned, currently disabled)
- **Data Enhancements:**
  - Merged credits and certificates into unified ledger
  - Enhanced with certificate information (certificateId, issued dates)
  - Status calculation: Automatically determines posted status from certificates

#### Tab Structure Updates
- **HCP Tabs (Current):**
  1. `discover` - Browse and register for accredited activities
  2. `registrations` (My Journey) - Chronological timeline of registrations
  3. `files` (NEW) - Quick access to tickets and certificates
  4. `credits` (CME Credits) - Analytical history of credits/hours
  5. `certs_reviews` - Alias that redirects to `credits` tab
- **Total HCP Tabs:** 5 (4 unique + 1 alias)
- **Alignment:** ✅ Matches IA-SITEMAP.md specification

### Implementation Details

#### Files Tab Component Architecture
```typescript
HcpFilesTab.tsx
├── View Mode Toggle (Tickets / Certificates)
├── Tickets View
│   ├── Upcoming Tickets Section
│   │   ├── Filter: All / This Week / This Month
│   │   └── Ticket Cards with QR Codes
│   └── Past Tickets Section
│       ├── Filter: All / By Year
│       └── Ticket Cards (historical)
└── Certificates View
    ├── Filters: All / This Year / Last Year
    ├── Sort: By Date / By Hours
    └── Certificate Cards with Download/Verify
```

#### Deep Linking Implementation
- URL parameters are parsed on component mount
- View mode syncs with URL parameter `view`
- Event focus: Scrolls to specific event when `eventId` is provided
- Ticket focus: Scrolls to specific ticket when `ticketId` is provided
- Navigation from other tabs uses URL parameters for seamless UX

#### Data Flow Enhancements
- `getHcpSummaryFull()` function provides complete HCP data
- Tickets and certificates are linked to events for full context
- Real-time updates when navigating between tabs
- Efficient data loading with proper memoization

### Impact on Overall System

#### User Experience Improvements
- ✅ Quick access to QR codes for event check-in (no need to navigate to ticket detail)
- ✅ Centralized certificate access for verification
- ✅ Better organization of tickets and certificates
- ✅ Seamless navigation between related content

#### Data Flow Improvements
- ✅ Enhanced data fetching with `getHcpSummaryFull()`
- ✅ Better integration between tabs (discover → files, credits → files)
- ✅ Deep linking support for better navigation

#### Code Quality
- ✅ New component follows existing patterns
- ✅ Proper TypeScript typing
- ✅ Internationalization support (Arabic/English)
- ✅ Responsive design with mobile considerations

---

**Report End**

