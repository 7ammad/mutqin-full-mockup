import type {
  DemoAssignment,
  DemoCertificate,
  DemoEvent,
  DemoReview,
  DemoTicket,
  DemoSponsorship,
} from '@/context/demoSeed';

export type SubmitAccreditationRequest = { eventId: string };
export type SubmitAccreditationResponse = { ok: true; eventId: string; status: 'pending_review' };

export type ReviewAccreditationRequest = {
  eventId: string;
  decision: 'approve' | 'reject';
  accreditationId?: string;
  reason?: string;
};
export type ReviewAccreditationResponse = {
  ok: true;
  eventId: string;
  status: 'approved' | 'draft';
  accreditationId?: string;
  reason?: string;
};

export type CreateAssignmentRequest = { eventId: string; eventManagerId: string };
export type CreateAssignmentResponse = { ok: true; assignmentId: string };

export type RespondAssignmentRequest = {
  assignmentId: string;
  decision: 'accept' | 'decline';
  reason?: string;
};
export type RespondAssignmentResponse = {
  ok: true;
  assignmentId: string;
  status: 'accepted' | 'declined';
  reason?: string;
};

export type CreateRegistrationRequest = { eventId: string; hcpId: string };
export type CreateRegistrationResponse = { ok: true; ticketId: string; status: 'confirmed' };

export type CheckInRequest = { ticketId: string; eventManagerId: string };
export type CheckInResponse = { ok: true; ticketId: string; status: 'attended' };

export type FinalizeAttendanceRequest = { eventId: string; eventManagerId: string };
export type FinalizeAttendanceResponse = { ok: true; eventId: string; finalized: true };

export type IssueCertificateRequest = { eventId: string; hcpId: string };
export type IssueCertificateResponse = { ok: true; certificateId: string; url: string };

export type CreateReviewRequest = { eventId: string; hcpId: string; rating: number; text?: string };
export type CreateReviewResponse = { ok: true; reviewId: string };

export type PurchaseSponsorshipRequest = { eventId: string; vendorId: string; package: string };
export type PurchaseSponsorshipResponse = { ok: true; sponsorshipId: string; status: 'purchased' };

export type PublishEventRequest = { eventId: string; organizerId: string };
export type PublishEventResponse = { ok: true; eventId: string; status: 'published' };

export type GetOrganizerEventsRequest = { organizerId: string };
export type GetOrganizerEventsResponse = { ok: true; events: DemoEvent[] };

export type GetRegulatorQueueResponse = { ok: true; events: DemoEvent[] };
export type GetAllEventsResponse = { ok: true; events: DemoEvent[] };

export type GetEventManagerAssignmentsRequest = { eventManagerId: string };
export type GetEventManagerAssignmentsResponse = {
  ok: true;
  assignments: { event: DemoEvent; assignment: DemoAssignment }[];
};

export type GetHcpSummaryRequest = { hcpId: string };
export type GetHcpSummaryResponse = {
  ok: true;
  tickets: DemoTicket[];
  certificates: DemoCertificate[];
  reviews: DemoReview[];
};

export type GetVendorSponsorshipsRequest = { vendorId: string };
export type GetVendorSponsorshipsResponse = { ok: true; sponsorships: DemoSponsorship[] };

// Single entity GET types for L2 pages
export type GetEventByIdRequest = { eventId: string };
export type GetEventByIdResponse = { ok: true; event: DemoEvent };

export type GetTicketByIdRequest = { ticketId: string };
export type GetTicketByIdResponse = { ok: true; ticket: DemoTicket; event?: DemoEvent };

export type GetCertificateByIdRequest = { certificateId: string };
export type GetCertificateByIdResponse = { ok: true; certificate: DemoCertificate; event?: DemoEvent };

export type GetSponsorshipByIdRequest = { sponsorshipId: string };
export type GetSponsorshipByIdResponse = { ok: true; sponsorship: DemoSponsorship; event?: DemoEvent };

export type GetAssignmentByIdRequest = { assignmentId: string };
export type GetAssignmentByIdResponse = { ok: true; assignment: DemoAssignment; event?: DemoEvent };

// Dashboard Analytics types
export type GetDashboardAnalyticsRequest = { persona: string; userId: string };
export type GetDashboardAnalyticsResponse = {
  ok: true;
  analytics: Record<string, any>;
};

// Dashboard KPIs types
export type GetDashboardKPIsRequest = { persona: string; userId: string };
export type GetDashboardKPIsResponse = {
  ok: true;
  kpis: Array<{
    id: string;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { value: number; label: string; isPositive: boolean };
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }>;
};

// Regulator API types (matching CONTRACTS.md)
export type RegulatorQueueItem = {
  activityId: string;
  title: string;
  providerName: string;
  city: string;
  specialty: string;
  startDate: string;
  endDate: string;
  status: 'pending_review' | 'approved' | 'draft' | 'published' | 'closed';
  submittedAt?: string;
  riskFlags: string[];
};

export type RegulatorQueueRead = {
  counts: {
    pending: number;
    dueSoon: number;
    overdueCompliance: number;
  };
  items: RegulatorQueueItem[];
};

export type GetRegulatorQueueReadResponse = { ok: true; data: RegulatorQueueRead };

export type RegulatorDecisionsItem = {
  activityId: string;
  title: string;
  providerName: string;
  decision: 'approved' | 'rejected';
  decidedAt: string;
  reasonCode?: string;
};

export type RegulatorDecisionsRead = {
  items: RegulatorDecisionsItem[];
};

export type GetRegulatorDecisionsReadResponse = { ok: true; data: RegulatorDecisionsRead };

export type AttendanceRecordsStatus = 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue';
export type HoursRegistrationStatus = 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue';

export type RegulatorMonitoringItem = {
  activityId: string;
  title: string;
  providerName: string;
  endedAt: string;
  attendanceRecords: { status: AttendanceRecordsStatus; dueAt?: string };
  hoursRegistration: { status: HoursRegistrationStatus; dueAt?: string };
  exceptionRate: number; // 0-100
};

export type RegulatorMonitoringRead = {
  compliance: RegulatorMonitoringItem[];
};

export type GetRegulatorMonitoringReadResponse = { ok: true; data: RegulatorMonitoringRead };

export type RegulatorAnalyticsSummary = {
  totalActivities: number;
  approvedRate: number; // 0-100
  avgDecisionTimeDays: number;
  overdueAttendanceRecords: number;
  overdueHoursRegistration: number;
};

export type RegulatorAnalyticsRead = {
  summary: RegulatorAnalyticsSummary;
  breakdown: Array<{ key: string; value: number }>;
};

export type GetRegulatorAnalyticsReadResponse = { ok: true; data: RegulatorAnalyticsRead };

export type RegulatorDecisionRequest = {
  activityId: string;
  decision: 'approved' | 'rejected';
  reasonCode?: string;
  note?: string;
};

export type RegulatorDecisionResponse = { ok: true; activityId: string; status: 'approved' | 'rejected' };

export type RegulatorExportRequest = {
  report: 'queue' | 'decisions' | 'monitoring' | 'analytics';
  format: 'csv' | 'json';
  filters?: Record<string, any>;
};

export type RegulatorExportResponse = { ok: true; exportId: string; createdAt: string; rows: number };
