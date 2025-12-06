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
  GetEventManagerAssignmentsRequest,
  GetEventManagerAssignmentsResponse,
  GetHcpSummaryRequest,
  GetHcpSummaryResponse,
  GetOrganizerEventsRequest,
  GetOrganizerEventsResponse,
  GetRegulatorQueueResponse,
  GetAllEventsResponse,
  GetVendorSponsorshipsRequest,
  GetVendorSponsorshipsResponse,
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
  GetRegulatorQueueReadResponse,
  GetRegulatorDecisionsReadResponse,
  GetRegulatorMonitoringReadResponse,
  GetRegulatorAnalyticsReadResponse,
  RegulatorDecisionRequest,
  RegulatorDecisionResponse,
  RegulatorExportRequest,
  RegulatorExportResponse,
  GetEventByIdRequest,
  GetEventByIdResponse,
  GetTicketByIdRequest,
  GetTicketByIdResponse,
  GetCertificateByIdRequest,
  GetCertificateByIdResponse,
  GetSponsorshipByIdRequest,
  GetSponsorshipByIdResponse,
  GetAssignmentByIdRequest,
  GetAssignmentByIdResponse,
  GetDashboardAnalyticsRequest,
  GetDashboardAnalyticsResponse,
  GetDashboardKPIsRequest,
  GetDashboardKPIsResponse,
} from './types';

type SuccessResponse = { ok: true };
type ErrorResponse = { ok: false; message?: string };

async function parseResponse<TResponse extends SuccessResponse>(res: Response): Promise<TResponse> {
  // Read as text first to check if it's HTML (prevents "Unexpected token '<'" error)
  const text = await res.text();
  
  // Check if response is HTML (usually means 404 or error page from Next.js)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
    // Provide a more helpful error message
    const errorMsg = res.status === 404 
      ? `API endpoint not found (404): ${res.url}. This endpoint should use the data layer instead of HTTP.`
      : `API endpoint returned HTML instead of JSON. Status: ${res.status}, URL: ${res.url}`;
    throw new Error(errorMsg);
  }
  
  // Parse as JSON
  let json: TResponse | ErrorResponse;
  try {
    json = JSON.parse(text) as TResponse | ErrorResponse;
  } catch (parseError) {
    throw new Error(`Failed to parse response as JSON. Status: ${res.status}, URL: ${res.url}`);
  }

  if (!res.ok || !json || (json as ErrorResponse).ok === false) {
    const message = (json as ErrorResponse).message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json as TResponse;
}

async function request<TResponse extends SuccessResponse>(
  path: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return parseResponse<TResponse>(res);
}

async function requestGet<TResponse extends SuccessResponse>(path: string): Promise<TResponse> {
  const res = await fetch(path, {
    method: 'GET',
  });

  return parseResponse<TResponse>(res);
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

  getOrganizerEvents: (params: GetOrganizerEventsRequest) =>
    requestGet<GetOrganizerEventsResponse>(`/api/organizer/events?organizerId=${params.organizerId}`),

  // Read operations use local data layer (no HTTP, no MSW dependency)
  getRegulatorQueue: async () => {
    const { data } = await import('../data');
    return data.getRegulatorQueue();
  },

  getAllEvents: async () => {
    const { data } = await import('../data');
    return data.getAllEvents();
  },

  getEventManagerAssignments: async (params: GetEventManagerAssignmentsRequest) => {
    const { data } = await import('../data');
    return data.getEventManagerAssignments(params);
  },

  getHcpSummary: async (params: GetHcpSummaryRequest) => {
    const { data } = await import('../data');
    return data.getHcpSummary(params);
  },

  getVendorSponsorships: async (params: GetVendorSponsorshipsRequest) => {
    const { data } = await import('../data');
    return data.getVendorSponsorships(params);
  },

  // Regulator endpoints (matching CONTRACTS.md) - using local data layer
  getRegulatorQueueRead: async (params?: { status?: string; q?: string; city?: string; specialty?: string; page?: number }) => {
    const { data } = await import('../data');
    return data.getRegulatorQueueRead(params);
  },

  getRegulatorDecisionsRead: async (params?: { decision?: 'approved' | 'rejected' | 'all'; from?: string; to?: string }) => {
    const { data } = await import('../data');
    return data.getRegulatorDecisionsRead(params);
  },

  getRegulatorMonitoringRead: async () => {
    const { data } = await import('../data');
    return data.getRegulatorMonitoringRead();
  },

  getRegulatorAnalyticsRead: async (params?: { from?: string; to?: string; groupBy?: string; metric?: string }) => {
    const { data } = await import('../data');
    return data.getRegulatorAnalyticsRead(params);
  },

  regulatorDecision: (body: RegulatorDecisionRequest) =>
    request<RegulatorDecisionResponse>('/api/write/regulator/decision', body),

  regulatorExport: (body: RegulatorExportRequest) =>
    request<RegulatorExportResponse>('/api/write/regulator/export', body),

  // Single entity GET endpoints for L2 pages - using local data layer
  getEventById: async (params: GetEventByIdRequest) => {
    const { data } = await import('../data');
    return data.getEventById(params);
  },

  getTicketById: async (params: GetTicketByIdRequest) => {
    const { data } = await import('../data');
    return data.getTicketById(params);
  },

  getCertificateById: async (params: GetCertificateByIdRequest) => {
    const { data } = await import('../data');
    return data.getCertificateById(params);
  },

  getSponsorshipById: async (params: GetSponsorshipByIdRequest) => {
    const { data } = await import('../data');
    return data.getSponsorshipById(params);
  },

  getAssignmentById: async (params: GetAssignmentByIdRequest) => {
    const { data } = await import('../data');
    return data.getAssignmentById(params);
  },

  // Dashboard endpoints
  getDashboardAnalytics: (params: GetDashboardAnalyticsRequest) => {
    const query = new URLSearchParams();
    query.set('persona', params.persona);
    query.set('userId', params.userId);
    return requestGet<GetDashboardAnalyticsResponse>(`/api/dashboard/analytics?${query.toString()}`);
  },

  getDashboardKPIs: (params: GetDashboardKPIsRequest) => {
    const query = new URLSearchParams();
    query.set('persona', params.persona);
    query.set('userId', params.userId);
    return requestGet<GetDashboardKPIsResponse>(`/api/dashboard/kpis?${query.toString()}`);
  },
};

export type { SuccessResponse as ApiSuccessResponse };
