# Extended Blueprint: Full 5-Persona System
## Including Event Management Companies

---

## Overview

**Complete Ecosystem:**
1. **HCPs** - Attend events, earn CME hours
2. **Organizers** - Create events, get accreditation, market
3. **Event Managers** - Execute events, handle logistics, check-in, certificates
4. **Vendors** - Sponsor events, target HCPs
5. **Regulators** - Approve accreditation, monitor compliance

---

## Event Management Company Persona

### Role in Ecosystem

**Event Management Companies** are specialized service providers that execute events on behalf of organizers. They handle the operational aspects while organizers focus on content, accreditation, and strategic planning.

**Current State:**
- Companies like Samaaro provide registration/ticketing platforms
- **No integration** with CPD Platform or Mumaris Plus
- Manual processes for attendance and certificates
- Fragmented communication with organizers

**Platform Vision:**
- Integrated execution partner in the ecosystem
- Seamless handoff from organizer to event manager
- Automated check-in, attendance, and certificate generation
- Real-time reporting back to organizer

---

## Module 6: Event Manager Portal

### 6.1 Event Assignment & Onboarding

**Flow:**
1. Organizer creates event and gets SCFHS accreditation
2. Organizer assigns event to Event Manager (via platform)
3. Event Manager receives notification and accepts assignment
4. Event Manager gets full access to event details
5. Event Manager sets up execution plan

**Features:**
- **Assignment Dashboard:**
  - View all assigned events
  - Filter by status (upcoming, in-progress, completed)
  - Event details summary
  - Organizer contact information
  - Assignment acceptance/rejection

- **Event Briefing:**
  - Full event information (dates, venue, capacity)
  - Registration list (from organizer's marketing)
  - Scientific program
  - Speaker requirements
  - Special requirements (AV, catering, etc.)
  - Budget and payment information

### 6.2 Registration Management

**Features:**
- **Registration Oversight:**
  - View all registrations (from organizer's marketing)
  - Manual registration entry (for walk-ins)
  - Registration status tracking
  - Waitlist management
  - Cancellation handling

- **Ticket Management:**
  - Generate QR codes for all attendees
  - Bulk ticket printing
  - Ticket distribution (email, SMS)
  - Ticket validation

### 6.3 Event Day Operations

**Features:**
- **Check-In System:**
  - QR code scanner (mobile app)
  - Real-time verification against Mumaris Plus
  - Instant eligibility checks (specialty, conflicts)
  - Walk-in registration
  - Bulk check-in for groups
  - Check-out tracking (optional)

- **Live Attendance Dashboard:**
  - Real-time attendance count
  - Check-in timeline
  - Missing attendees list
  - Attendance by session (if multi-session)
  - Export attendance reports

- **Session Management:**
  - Session-specific check-ins
  - Track attendance per session
  - Calculate CME hours per attendee
  - Handle partial attendance

- **Logistics Coordination:**
  - Venue setup checklist
  - AV equipment management
  - Catering coordination
  - Speaker arrival tracking
  - Emergency contact management

### 6.4 Post-Event Processing

**Features:**
- **Attendance Finalization:**
  - Review and verify all check-ins
  - Handle disputes or corrections
  - Finalize attendance list
  - Calculate final CME hours per attendee

- **Certificate Generation:**
  - Bulk certificate creation from attendance list
  - SCFHS-compliant templates
  - Digital signatures
  - Blockchain hash generation
  - Quality check before distribution

- **CME Hour Registration:**
  - Auto-populate SCFHS format from attendance
  - One-click submission to CPD Platform
  - Track submission status
  - Handle rejections/resubmissions
  - Sync to Mumaris Plus

- **Reporting to Organizer:**
  - Final attendance report
  - Revenue summary (if handled payments)
  - Feedback summary
  - Certificate distribution confirmation
  - CME hour registration status

### 6.5 Analytics & Performance

**Features:**
- **Event Performance Metrics:**
  - Attendance rate (registered vs. attended)
  - Check-in efficiency
  - Session attendance breakdown
  - Certificate generation time
  - CME hour registration success rate

- **Operational Metrics:**
  - Average check-in time
  - Walk-in registration count
  - Technical issues encountered
  - Staff efficiency

- **Client Reporting:**
  - Generate reports for organizers
  - Historical performance tracking
  - Comparative analytics across events

---

## Updated User Flow: Organizer → Event Manager

### Flow: Organizer Assigns Event to Event Manager

```
1. Organizer creates event → Gets SCFHS accreditation
2. Organizer clicks "Assign Event Manager"
3. Platform shows:
   - List of available Event Managers
   - Ratings and past performance
   - Pricing/contract terms
   - Availability calendar
4. Organizer selects Event Manager
5. Event Manager receives notification:
   - Event details
   - Assignment request
   - Deadline to accept
6. Event Manager reviews and accepts
7. Event Manager gets full access:
   - Event dashboard
   - Registration list
   - Scientific program
   - Organizer contact
8. Event Manager sets up execution plan
9. Pre-event coordination (optional meetings)
10. Event day execution
11. Post-event processing
12. Final report delivered to organizer
```

### Flow: Event Manager Executes Event

```
1. Event Manager receives assignment
2. Reviews event details and requirements
3. Sets up check-in system:
   - Generates QR codes for all registrations
   - Prepares mobile scanner app
   - Tests Mumaris Plus verification
4. Pre-event preparation:
   - Coordinates with venue
   - Confirms AV/catering
   - Prepares registration materials
5. Event day:
   - Opens check-in station
   - Scans QR codes
   - Verifies attendees
   - Tracks session attendance
   - Handles walk-ins
   - Monitors live dashboard
6. Post-event (within 24 hours):
   - Finalizes attendance list
   - Generates certificates
   - Submits CME hours to SCFHS
   - Syncs to Mumaris Plus
7. Reports to organizer:
   - Final attendance count
   - Certificate distribution
   - CME hour registration status
```

---

## Updated Data Models

### Event Manager User Model

```typescript
interface EventManager {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'EVENT_MANAGER';
  
  // Profile
  companyName: string;
  companyNameAr?: string;
  contactPerson: string;
  licenseNumber?: string;
  businessRegistration?: string;
  
  // Capabilities
  specialties: string[]; // Events they can handle
  maxEventCapacity: number;
  serviceAreas: string[]; // Cities/regions
  languages: ('ar' | 'en')[];
  
  // Performance
  rating: number; // Average rating from organizers
  totalEventsManaged: number;
  completionRate: number;
  averageCheckInTime: number; // minutes
  
  // Financial
  pricingModel: 'Fixed' | 'PerAttendee' | 'Custom';
  baseFee?: number;
  perAttendeeFee?: number;
  
  // Status
  verified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event Assignment Model

```typescript
interface EventAssignment {
  id: string;
  eventId: string;
  organizerId: string;
  eventManagerId: string;
  
  // Assignment Details
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Active' | 'Completed' | 'Cancelled';
  assignedAt: Date;
  acceptedAt?: Date;
  contractTerms?: string;
  agreedFee?: number;
  
  // Execution
  checkInStarted: boolean;
  checkInStartedAt?: Date;
  attendanceFinalized: boolean;
  attendanceFinalizedAt?: Date;
  certificatesGenerated: boolean;
  certificatesGeneratedAt?: Date;
  cmeHoursSubmitted: boolean;
  cmeHoursSubmittedAt?: Date;
  
  // Performance
  finalAttendanceCount?: number;
  checkInEfficiency?: number; // percentage
  certificateGenerationTime?: number; // minutes
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Updated Event Model

```typescript
interface Event {
  // ... existing fields ...
  
  // Event Manager Assignment
  assignedToEventManager?: boolean;
  eventManagerId?: string;
  eventManagerAssignmentId?: string;
  executionStatus?: 'Unassigned' | 'Assigned' | 'InProgress' | 'Completed';
}
```

---

## Integration Points

### Organizer ↔ Event Manager

- **Assignment Interface:** Organizer can assign events
- **Shared Dashboard:** Both can view event status
- **Communication:** In-platform messaging
- **Reporting:** Event Manager reports to Organizer

### Event Manager ↔ HCP

- **Check-In:** QR code scanning and verification
- **Certificates:** Distribution after event
- **Support:** Handle attendee questions/issues

### Event Manager ↔ Regulator

- **CME Hour Submission:** Submit attendance to SCFHS
- **Compliance:** Ensure proper documentation
- **Reporting:** Provide audit trail

---

## Benefits of Including Event Managers

1. **Complete Ecosystem:** Covers full lifecycle from ideation to certificate delivery
2. **Specialization:** Organizers focus on content, Event Managers on execution
3. **Scalability:** Organizers can manage multiple events without operational burden
4. **Quality:** Professional event execution with standardized processes
5. **Integration:** Seamless data flow from check-in to certificate to Mumaris Plus
6. **Market Reality:** Reflects actual industry structure (many organizers use event management companies)

---

## Implementation Priority

**Phase 1 (MVP):**
- Basic Event Manager persona
- Assignment workflow
- Check-in system
- Certificate generation

**Phase 2:**
- Advanced analytics
- Performance ratings
- Marketplace for Event Managers
- Contract management

**Phase 3:**
- AI-powered Event Manager matching
- Automated workflows
- Advanced reporting
- Multi-event management

---

## Updated Persona Count

**Before:** 4 personas (HCP, Organizer, Vendor, Regulator)  
**After:** 5 personas (HCP, Organizer, Event Manager, Vendor, Regulator)

**Complete Coverage:**
- ✅ Content creation (Organizer)
- ✅ Event execution (Event Manager)
- ✅ Sponsorship (Vendor)
- ✅ Regulation (Regulator)
- ✅ Participation (HCP)

---

**Status:** Ready for UX/UI implementation  
**Next Step:** Design Event Manager portal based on this specification

