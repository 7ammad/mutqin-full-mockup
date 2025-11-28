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
