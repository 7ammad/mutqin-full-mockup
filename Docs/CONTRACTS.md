## `docs/CONTRACTS.md`

````md
# Mutqin — Contracts (Source of Truth for Demo + Build)

This file is the **single source of truth** for:
- Demo store shapes (entities + read models)
- Mock API request/response (MSW or route handlers)
- UI expectations (what each dashboard can read/write)

Rules:
1) **No UI screen ships without a read model** defined here.
2) **No write action ships without a command** defined here.
3) If an agent needs a new field/endpoint: **update this file first**, then implement.

Terminology:
- UI may say **CME**; domain model is **CPD**.
- We use **Activity** (domain) and alias it as “Event” in UI copy if needed.

Date/time:
- All timestamps are ISO strings: `YYYY-MM-DDTHH:mm:ss.sssZ`
- All “dates” are ISO date strings: `YYYY-MM-DD`

---

## 0) Primitive Types

- `ID` = string (ulid/uuid/slug ok for demo)
- `MoneySAR` = number (SAR)
- `Percent` = number (0..100)

---

## 1) Enums (DO NOT invent new ones elsewhere)

### 1.1 Org + Roles

```ts
type OrgType = "cpd_provider" | "execution_vendor" | "sponsor" | "regulator";

type UserRole =
  // CPD Provider internal
  | "provider_admin"
  | "event_owner"
  | "scientific_committee"
  | "finance_sponsorship"
  | "compliance_officer"
  | "ops_liaison"
  // Execution Vendor
  | "vendor_ops_admin"
  | "vendor_event_ops_lead"
  | "vendor_checkin_staff"
  | "vendor_reporting_lead"
  // Sponsor
  | "sponsor_admin"
  | "sponsor_campaign_manager"
  | "sponsor_compliance_approver"
  // Regulator
  | "regulator_reviewer"
  | "regulator_approver"
  | "regulator_audit_analyst"
  // HCP
  | "hcp";
````

### 1.2 Lifecycle + Decisions

```ts
type ActivityStatus =
  | "draft"
  | "submitted"
  | "pending_review"
  | "approved"
  | "rejected"
  | "published"
  | "completed"
  | "closed";

type AccreditationDecision = "approved" | "rejected";

type AssignmentStatus = "pending" | "accepted" | "declined";
type TicketStatus = "confirmed" | "cancelled";
type AttendanceStatus = "not_checked_in" | "checked_in" | "finalized";

type AttendanceRecordsStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "returned_for_fix"
  | "overdue";

type HoursRegistrationStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "returned_for_fix"
  | "overdue";

type SponsorshipStatus =
  | "offered"
  | "reserved"
  | "paid"
  | "disclosed"
  | "approved_for_display"
  | "completed";
```

---

## 2) Canonical Entities

### 2.1 Org

```ts
type Org = {
  id: ID;
  type: OrgType;
  name: string;
  city?: string;
};
```

### 2.2 User

```ts
type User = {
  id: ID;
  orgId?: ID;        // HCP may not have orgId
  role: UserRole;
  displayName: string;
  email?: string;
};
```

### 2.3 Activity (Event)

```ts
type Activity = {
  id: ID;

  // ownership
  providerOrgId: ID;       // CPD Provider org
  ownerUserId: ID;         // event_owner (or provider_admin)

  // assignment
  executionVendorOrgId?: ID;  // vendor org (if assigned)

  // info shown on cards
  title: string;
  specialty: string;       // e.g., Cardiology
  city: string;            // e.g., Riyadh
  venue?: string;
  modality: "onsite" | "online" | "hybrid";

  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  creditHours: number;     // displayed as CPD/CME hours

  status: ActivityStatus;

  // regulator decision artifact (only if reviewed)
  accreditation?: {
    decision?: AccreditationDecision;
    decidedAt?: string;          // ISO timestamp
    decidedByUserId?: ID;        // regulator user
    reasonCode?: string;         // short code for demo
    reasonNote?: string;         // optional narrative
  };

  // post-activity compliance tracks (must stay separate)
  compliance: {
    attendanceRecords: {
      status: AttendanceRecordsStatus;
      dueAt?: string;            // computed from endDate (+ windows)
      submittedAt?: string;
      acceptedAt?: string;
      extensionUsed?: boolean;   // demo flag
    };
    hoursRegistration: {
      status: HoursRegistrationStatus;
      dueAt?: string;            // demo / manual modeled window
      submittedAt?: string;
      acceptedAt?: string;
      extensionUsed?: boolean;   // demo flag
    };
  };

  // sponsorship
  sponsorship: {
    status?: SponsorshipStatus;
    packagesEnabled?: boolean;
  };
};
```

### 2.4 Assignment (Provider → Execution Vendor)

```ts
type Assignment = {
  id: ID;
  activityId: ID;
  executionVendorOrgId: ID;
  status: AssignmentStatus;
  requestedAt: string;
  respondedAt?: string;
  responseByUserId?: ID;
  declineReason?: string;
};
```

### 2.5 Registration + Attendance

```ts
type Ticket = {
  id: ID;
  activityId: ID;
  hcpUserId: ID;
  status: TicketStatus;
  qrToken: string;          // demo-safe token
  createdAt: string;
};

type AttendanceScan = {
  id: ID;
  activityId: ID;
  ticketId: ID;
  scannerUserId: ID;        // vendor_checkin_staff
  scannedAt: string;
  result: "ok" | "duplicate" | "invalid" | "late";
};

type AttendanceOverride = {
  id: ID;
  activityId: ID;
  ticketId: ID;
  requestedByUserId: ID;    // vendor lead
  requestedAt: string;
  reason: string;
  approvedByUserId?: ID;    // compliance_officer
  approvedAt?: string;
  status: "requested" | "approved" | "rejected";
};
```

### 2.6 Sponsorship

```ts
type SponsorPackage = {
  id: ID;
  activityId: ID;
  title: string;
  priceSAR: MoneySAR;
  benefits: string[];
  spotsTotal: number;
  spotsRemaining: number;
};

type SponsorDeal = {
  id: ID;
  activityId: ID;
  sponsorOrgId: ID;
  packageId: ID;
  status: SponsorshipStatus;
  createdAt: string;
  paidAt?: string;
};

type Disclosure = {
  id: ID;
  dealId: ID;
  submittedAt: string;
  approvedAt?: string;
  approvedByUserId?: ID;      // provider compliance officer
  status: "submitted" | "approved" | "returned";
  notes?: string;
};
```

### 2.7 Audit Log (immutable append-only)

```ts
type AuditEvent = {
  id: ID;
  at: string;
  actorUserId: ID;
  actorOrgId?: ID;
  action:
    | "activity.created"
    | "activity.updated"
    | "activity.submitted"
    | "accreditation.decided"
    | "activity.published"
    | "assignment.requested"
    | "assignment.responded"
    | "ticket.created"
    | "attendance.scanned"
    | "attendance.override_requested"
    | "attendance.override_decided"
    | "attendance.finalized"
    | "compliance.attendance_records_submitted"
    | "compliance.hours_registration_submitted"
    | "sponsorship.package_created"
    | "sponsorship.deal_created"
    | "sponsorship.disclosure_submitted"
    | "sponsorship.disclosure_decided"
    | "report.exported";

  entityType:
    | "activity"
    | "assignment"
    | "ticket"
    | "attendance"
    | "compliance"
    | "sponsorship"
    | "report";
  entityId: ID;

  meta?: Record<string, any>;
};
```

---

## 3) Standard API Envelope

```ts
type ApiOk<T> = { ok: true; data: T };
type ApiErr = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "CONFLICT"
      | "DEADLINE_PASSED"
      | "PRECONDITION_FAILED"
      | "INTERNAL";
    message: string;
    details?: Record<string, any>;
  };
};
type ApiResponse<T> = ApiOk<T> | ApiErr;
```

---

## 4) Read Models (what dashboards render)

### 4.1 Common

GET `/api/read/me`

```ts
type MeRead = {
  user: User;
  org?: Org;
  now: string;
};
```

GET `/api/read/activity/:activityId`

```ts
type ActivityDetailRead = {
  activity: Activity;
  providerOrg: Org;
  executionVendorOrg?: Org;
  auditTail: AuditEvent[];          // last 30
};
```

---

### 4.2 Regulator Dashboard

GET `/api/read/regulator/queue`
Query: `status=pending_review|submitted|all`, `q?`, `city?`, `specialty?`, `page?`

```ts
type RegulatorQueueItem = {
  activityId: ID;
  title: string;
  providerName: string;
  city: string;
  specialty: string;
  startDate: string;
  endDate: string;
  status: ActivityStatus; // should be pending_review/submitted here
  submittedAt?: string;
  riskFlags: string[];    // demo: ["high-volume-provider", "missing-objectives"] etc
};

type RegulatorQueueRead = {
  counts: {
    pending: number;
    dueSoon: number;
    overdueCompliance: number; // across activities (monitoring)
  };
  items: RegulatorQueueItem[];
};
```

GET `/api/read/regulator/decisions`
Query: `decision=approved|rejected|all`, `from?`, `to?`

```ts
type RegulatorDecisionsRead = {
  items: Array<{
    activityId: ID;
    title: string;
    providerName: string;
    decision: AccreditationDecision;
    decidedAt: string;
    reasonCode?: string;
  }>;
};
```

GET `/api/read/regulator/monitoring`

```ts
type RegulatorMonitoringRead = {
  compliance: Array<{
    activityId: ID;
    title: string;
    providerName: string;
    endedAt: string;
    attendanceRecords: { status: AttendanceRecordsStatus; dueAt?: string };
    hoursRegistration: { status: HoursRegistrationStatus; dueAt?: string };
    exceptionRate: Percent; // scans duplicates/invalids for demo
  }>;
};
```

GET `/api/read/regulator/analytics`
Query: `from?`, `to?`, `groupBy=city|specialty|provider`, `metric=submissions|approvals|rejections|compliance_overdue`

```ts
type RegulatorAnalyticsRead = {
  summary: {
    totalActivities: number;
    approvedRate: Percent;
    avgDecisionTimeDays: number;
    overdueAttendanceRecords: number;
    overdueHoursRegistration: number;
  };
  breakdown: Array<{ key: string; value: number }>;
};
```

POST `/api/write/regulator/export`

```ts
type ExportRequest = {
  report: "queue" | "decisions" | "monitoring" | "analytics";
  format: "csv" | "json";
  filters?: Record<string, any>;
};
type ExportResponse = { exportId: ID; createdAt: string; rows: number };
```

---

### 4.3 Organizer (CPD Provider) Dashboard

GET `/api/read/organizer/overview`

```ts
type OrganizerOverviewRead = {
  kpis: {
    draft: number;
    pendingReview: number;
    approved: number;
    published: number;
    completed: number;
    complianceDueSoon: number;
    complianceOverdue: number;
  };
  nextActions: Array<{
    activityId: ID;
    title: string;
    action:
      | "submit_for_accreditation"
      | "publish"
      | "assign_vendor"
      | "submit_attendance_records"
      | "submit_hours_registration"
      | "fix_returned_submission";
    dueAt?: string;
  }>;
};
```

GET `/api/read/organizer/activities`
Query: `status?`, `q?`, `city?`, `specialty?`

```ts
type OrganizerActivitiesRead = {
  items: Array<{
    activityId: ID;
    title: string;
    status: ActivityStatus;
    city: string;
    specialty: string;
    dates: { startDate: string; endDate: string };
    creditHours: number;
    tags: string[]; // demo: ["needs_sponsorship","vendor_assigned"]
  }>;
};
```

GET `/api/read/organizer/compliance`

```ts
type OrganizerComplianceRead = {
  items: Array<{
    activityId: ID;
    title: string;
    endedAt: string;
    attendanceRecords: { status: AttendanceRecordsStatus; dueAt?: string };
    hoursRegistration: { status: HoursRegistrationStatus; dueAt?: string };
  }>;
};
```

GET `/api/read/organizer/sponsors`

```ts
type OrganizerSponsorsRead = {
  packages: SponsorPackage[];
  deals: SponsorDeal[];
  disclosures: Disclosure[];
};
```

---

### 4.4 Execution Vendor (“Event Manager”) Dashboard

GET `/api/read/vendor/assignments`

```ts
type VendorAssignmentsRead = {
  items: Array<{
    assignmentId: ID;
    activityId: ID;
    title: string;
    city: string;
    dates: { startDate: string; endDate: string };
    status: AssignmentStatus;
  }>;
};
```

GET `/api/read/vendor/checkin`
Query: `activityId`

```ts
type VendorCheckinRead = {
  activityId: ID;
  title: string;
  stats: { totalTickets: number; checkedIn: number; duplicates: number; invalid: number };
  recentScans: AttendanceScan[];
  overrides: AttendanceOverride[];
};
```

---

### 4.5 Sponsor Dashboard

GET `/api/read/sponsor/marketplace`

```ts
type SponsorMarketplaceRead = {
  items: Array<{
    activityId: ID;
    title: string;
    city: string;
    specialty: string;
    startDate: string;
    status: ActivityStatus; // MUST be approved/published only
    packages: SponsorPackage[];
  }>;
};
```

GET `/api/read/sponsor/deals`

```ts
type SponsorDealsRead = { deals: SponsorDeal[]; disclosures: Disclosure[] };
```

---

### 4.6 HCP Dashboard

GET `/api/read/hcp/activities`

```ts
type HcpActivitiesRead = {
  discover: Array<{
    activityId: ID;
    title: string;
    city: string;
    specialty: string;
    startDate: string;
    creditHours: number;
    accredited: boolean;
  }>;
  myTickets: Ticket[];
};
```

GET `/api/read/hcp/credits`

```ts
type HcpCreditsRead = {
  earned: number;
  pending: number;
  posted: number;
  items: Array<{ activityId: ID; title: string; status: "earned" | "pending" | "posted"; hours: number }>;
};
```

---

## 5) Write Commands (state-changing actions)

### 5.1 Organizer (CPD Provider)

POST `/api/write/activity/create`

```ts
type CreateActivityReq = {
  title: string;
  specialty: string;
  city: string;
  modality: "onsite" | "online" | "hybrid";
  startDate: string;
  endDate: string;
  creditHours: number;
};
type CreateActivityRes = { activityId: ID };
```

POST `/api/write/activity/update`

```ts
type UpdateActivityReq = { activityId: ID; patch: Partial<CreateActivityReq> };
type UpdateActivityRes = { activityId: ID };
```

POST `/api/write/accreditation/submit`

```ts
type SubmitAccreditationReq = { activityId: ID };
type SubmitAccreditationRes = { activityId: ID; status: "pending_review" };
```

POST `/api/write/activity/publish`

```ts
type PublishReq = { activityId: ID };
type PublishRes = { activityId: ID; status: "published" };
```

POST `/api/write/assignment/request`

```ts
type RequestAssignmentReq = { activityId: ID; executionVendorOrgId: ID };
type RequestAssignmentRes = { assignmentId: ID; status: "pending" };
```

POST `/api/write/compliance/attendance-records/submit`

```ts
type SubmitAttendanceRecordsReq = { activityId: ID; artifactId: ID }; // demo: artifactId references generated pack
type SubmitAttendanceRecordsRes = { activityId: ID; status: "submitted" };
```

POST `/api/write/compliance/hours-registration/submit`

```ts
type SubmitHoursRegistrationReq = { activityId: ID; artifactId: ID };
type SubmitHoursRegistrationRes = { activityId: ID; status: "submitted" };
```

### 5.2 Regulator

POST `/api/write/regulator/decision`

```ts
type RegulatorDecisionReq = {
  activityId: ID;
  decision: AccreditationDecision;
  reasonCode?: string;
  reasonNote?: string;
};
type RegulatorDecisionRes = { activityId: ID; status: "approved" | "rejected" };
```

### 5.3 Execution Vendor

POST `/api/write/assignment/respond`

```ts
type RespondAssignmentReq = { assignmentId: ID; decision: "accept" | "decline"; reason?: string };
type RespondAssignmentRes = { assignmentId: ID; status: AssignmentStatus };
```

POST `/api/write/ticket/checkin`

```ts
type CheckinReq = { ticketId: ID; activityId: ID };
type CheckinRes = { ticketId: ID; attendanceStatus: "checked_in" };
```

POST `/api/write/attendance/finalize`

```ts
type FinalizeAttendanceReq = { activityId: ID };
type FinalizeAttendanceRes = { activityId: ID; attendanceStatus: "finalized" };
```

POST `/api/write/attendance/override/request`

```ts
type RequestOverrideReq = { activityId: ID; ticketId: ID; reason: string };
type RequestOverrideRes = { overrideId: ID; status: "requested" };
```

### 5.4 HCP

POST `/api/write/registration/create`

```ts
type CreateRegistrationReq = { activityId: ID };
type CreateRegistrationRes = { ticketId: ID; status: "confirmed" };
```

---

## 6) Hard Preconditions (enforced by demoStore + tests)

* Publish requires `activity.status === "approved"`.
* Sponsor marketplace only shows activities where status is `approved` or `published` and disclosure gate is satisfied.
* Attendance Records submission and Hours Registration submission are **separate** and can be independently overdue.
* Compliance submissions require `activity.status === "completed"` (or `published` + ended, if your demo uses endedAt).
* Read models must not return empty arrays for seeded personas in demo mode (seed must include at least 3–5 items per major list).

---

## 7) Legacy Compatibility (for existing code paths)

These are legacy aliases ONLY. New code should use the canonical types above.

* `organizerId` → `providerOrgId`
* `eventId` → `activityId`
* `eventManagerId` → vendor userId (role in execution vendor org)
* Old endpoints under `/api/accreditation/*`, `/api/events/*` may be kept as wrappers that call the canonical commands.

```

### What you do with it (agent instruction)
- Replace `docs/CONTRACTS.md` بالكامل بهذا المحتوى.
- ثم أي endpoint / demoStore action لازم يطابق **الـ Read Models + Write Commands** هنا حرفيًا (الحقول/الأسماء/الـ enums).
- ممنوع إنشاء dashboards جديدة أو tabs جديدة بدون إضافة read model هنا أولًا.

::contentReference[oaicite:0]{index=0}
```
