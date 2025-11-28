import type {
  CheckInRequest,
  CheckInResponse,
  CreateAssignmentRequest,
  CreateAssignmentResponse,
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  FinalizeAttendanceRequest,
  FinalizeAttendanceResponse,
  IssueCertificateRequest,
  IssueCertificateResponse,
  PurchaseSponsorshipRequest,
  PurchaseSponsorshipResponse,
  RespondAssignmentRequest,
  RespondAssignmentResponse,
  ReviewAccreditationRequest,
  ReviewAccreditationResponse,
  SubmitAccreditationRequest,
  SubmitAccreditationResponse,
  PublishEventRequest,
  PublishEventResponse,
} from './types';

type SuccessResponse = { ok: true };
type ErrorResponse = { ok: false; message?: string };

async function request<TResponse extends SuccessResponse>(
  path: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as TResponse | ErrorResponse;
  if (!res.ok || !json || (json as ErrorResponse).ok === false) {
    const message = (json as ErrorResponse).message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json as TResponse;
}

export const api = {
  submitAccreditation: (body: SubmitAccreditationRequest) =>
    request<SubmitAccreditationResponse>('/api/accreditation/submit', body),

  reviewAccreditation: (body: ReviewAccreditationRequest) =>
    request<ReviewAccreditationResponse>('/api/accreditation/review', body),

  createAssignment: (body: CreateAssignmentRequest) =>
    request<CreateAssignmentResponse>('/api/assignments/create', body),

  respondAssignment: (body: RespondAssignmentRequest) =>
    request<RespondAssignmentResponse>('/api/assignments/respond', body),

  createRegistration: (body: CreateRegistrationRequest) =>
    request<CreateRegistrationResponse>('/api/registrations/create', body),

  checkIn: (body: CheckInRequest) => request<CheckInResponse>('/api/attendance/checkin', body),

  finalizeAttendance: (body: FinalizeAttendanceRequest) =>
    request<FinalizeAttendanceResponse>('/api/attendance/finalize', body),

  issueCertificate: (body: IssueCertificateRequest) =>
    request<IssueCertificateResponse>('/api/certificates/issue', body),

  createReview: (body: CreateReviewRequest) =>
    request<CreateReviewResponse>('/api/reviews/create', body),

  purchaseSponsorship: (body: PurchaseSponsorshipRequest) =>
    request<PurchaseSponsorshipResponse>('/api/sponsorship/purchase', body),

  publishEvent: (body: PublishEventRequest) =>
    request<PublishEventResponse>('/api/events/publish', body),
};

export type { SuccessResponse as ApiSuccessResponse };
