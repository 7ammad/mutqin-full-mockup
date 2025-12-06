import { http, HttpResponse, type RequestHandler } from 'msw';
import {
  getEventManagerAssignments,
  getHcpSummary,
  getOrganizerEvents,
  getRegulatorQueue,
  getState,
  getVendorSponsorships,
  setState,
  resetDemo,
  getRegulatorQueueData,
  getRegulatorDecisionsData,
  getRegulatorMonitoringData,
  getRegulatorAnalyticsData,
  getEventById,
  getTicketById,
  getCertificateById,
  getSponsorshipById,
  getAssignmentById,
} from '@/context/demoStore';

function jsonBadRequest(message: string, code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'FORBIDDEN' = 'VALIDATION_ERROR') {
  return HttpResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    { status: 400 }
  );
}

let assignmentCounter = 2;
let ticketCounter = 2;
let reviewCounter = 2;
let sponsorshipCounter = 2;
let certificateCounter = 2;
let attendanceCounter = 2;

export const handlers: RequestHandler[] = [
  http.post('/api/demo/reset', async () => {
    resetDemo();
    return HttpResponse.json({ ok: true });
  }),

  http.get('/api/organizer/events', async ({ request }) => {
    const url = new URL(request.url);
    const organizerId = url.searchParams.get('organizerId');
    if (!organizerId) return jsonBadRequest('organizerId is required');

    const events = getOrganizerEvents(organizerId);
    return HttpResponse.json({ ok: true, events });
  }),

  http.get('/api/regulator/accreditation-queue', async () => {
    const events = getRegulatorQueue();
    return HttpResponse.json({ ok: true, events });
  }),

  http.get('/api/regulator/all-events', async () => {
    const state = getState();
    return HttpResponse.json({ ok: true, events: state.events });
  }),

  http.get('/api/event-manager/assignments', async ({ request }) => {
    const url = new URL(request.url);
    const eventManagerId = url.searchParams.get('eventManagerId');
    if (!eventManagerId) return jsonBadRequest('eventManagerId is required');

    try {
      const assignments = getEventManagerAssignments(eventManagerId);
      return HttpResponse.json({ ok: true, assignments });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fetch assignments';
      return jsonBadRequest(message);
    }
  }),

  http.get('/api/hcp/summary', async ({ request }) => {
    const url = new URL(request.url);
    const hcpId = url.searchParams.get('hcpId');
    if (!hcpId) return jsonBadRequest('hcpId is required');

    const summary = getHcpSummary(hcpId);
    return HttpResponse.json({ ok: true, ...summary });
  }),

  http.get('/api/vendor/sponsorships', async ({ request }) => {
    const url = new URL(request.url);
    const vendorId = url.searchParams.get('vendorId');
    if (!vendorId) return jsonBadRequest('vendorId is required');

    const sponsorships = getVendorSponsorships(vendorId);
    return HttpResponse.json({ ok: true, sponsorships });
  }),

  // Single entity GET handlers for L2 pages
  http.get('/api/events/:eventId', async ({ params }) => {
    const eventId = params.eventId as string;
    if (!eventId) return jsonBadRequest('eventId is required');

    const event = getEventById(eventId);
    if (!event) return jsonBadRequest('Event not found', 'NOT_FOUND');

    return HttpResponse.json({ ok: true, event });
  }),

  http.get('/api/tickets/:ticketId', async ({ params }) => {
    const ticketId = params.ticketId as string;
    if (!ticketId) return jsonBadRequest('ticketId is required');

    const ticket = getTicketById(ticketId);
    if (!ticket) return jsonBadRequest('Ticket not found', 'NOT_FOUND');

    const state = getState();
    const event = state.events.find((e) => e.id === ticket.eventId);

    return HttpResponse.json({ ok: true, ticket, event });
  }),

  http.get('/api/certificates/:certificateId', async ({ params }) => {
    const certificateId = params.certificateId as string;
    if (!certificateId) return jsonBadRequest('certificateId is required');

    const certificate = getCertificateById(certificateId);
    if (!certificate) return jsonBadRequest('Certificate not found', 'NOT_FOUND');

    const state = getState();
    const event = state.events.find((e) => e.id === certificate.eventId);

    return HttpResponse.json({ ok: true, certificate, event });
  }),

  http.get('/api/sponsorships/:sponsorshipId', async ({ params }) => {
    const sponsorshipId = params.sponsorshipId as string;
    if (!sponsorshipId) return jsonBadRequest('sponsorshipId is required');

    const sponsorship = getSponsorshipById(sponsorshipId);
    if (!sponsorship) return jsonBadRequest('Sponsorship not found', 'NOT_FOUND');

    const state = getState();
    const event = state.events.find((e) => e.id === sponsorship.eventId);

    return HttpResponse.json({ ok: true, sponsorship, event });
  }),

  http.get('/api/assignments/:assignmentId', async ({ params }) => {
    const assignmentId = params.assignmentId as string;
    if (!assignmentId) return jsonBadRequest('assignmentId is required');

    const assignment = getAssignmentById(assignmentId);
    if (!assignment) return jsonBadRequest('Assignment not found', 'NOT_FOUND');

    const state = getState();
    const event = state.events.find((e) => e.id === assignment.eventId);

    return HttpResponse.json({ ok: true, assignment, event });
  }),

  http.post('/api/events/publish', async ({ request }) => {
    const body = await request.json();
    const { eventId, organizerId } = body as { eventId?: string; organizerId?: string };
    if (!eventId || !organizerId) return jsonBadRequest('eventId and organizerId are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');
    if (event.organizerId !== organizerId) return jsonBadRequest('organizer mismatch');
    if (event.status !== 'approved') return jsonBadRequest('event must be approved before publish');

    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: 'published' } : e
      ),
    }));

    return HttpResponse.json({ ok: true, eventId, status: 'published' });
  }),

  http.post('/api/accreditation/submit', async ({ request }) => {
    const body = await request.json();
    const { eventId } = body as { eventId?: string };
    if (!eventId) return jsonBadRequest('eventId is required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');

    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: 'pending_review' } : e
      ),
    }));

    return HttpResponse.json({ ok: true, eventId, status: 'pending_review' });
  }),

  http.post('/api/accreditation/review', async ({ request }) => {
    const body = await request.json();
    const { eventId, decision, accreditationId, reason } = body as {
      eventId?: string;
      decision?: 'approve' | 'reject';
      accreditationId?: string;
      reason?: string;
    };
    if (!eventId || !decision) return jsonBadRequest('eventId and decision are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');

    if (decision === 'approve') {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === eventId ? { ...e, status: 'approved' } : e
        ),
      }));
      return HttpResponse.json({ ok: true, eventId, status: 'approved', accreditationId });
    }

    // decision === 'reject'
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: 'draft' } : e
      ),
    }));
    return HttpResponse.json({ ok: true, eventId, status: 'draft', reason });
  }),

  http.post('/api/assignments/create', async ({ request }) => {
    const body = await request.json();
    const { eventId, eventManagerId } = body as { eventId?: string; eventManagerId?: string };
    if (!eventId || !eventManagerId) return jsonBadRequest('eventId and eventManagerId are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');

    const assignmentId = `assign-${assignmentCounter++}`;
    setState((prev) => ({
      ...prev,
      assignments: [
        ...prev.assignments,
        {
          id: assignmentId,
          eventId,
          organizerId: event.organizerId,
          eventManagerId,
          status: 'pending',
        },
      ],
    }));

    return HttpResponse.json({ ok: true, assignmentId });
  }),

  http.post('/api/assignments/respond', async ({ request }) => {
    const body = await request.json();
    const { assignmentId, decision, reason } = body as {
      assignmentId?: string;
      decision?: 'accept' | 'decline';
      reason?: string;
    };
    if (!assignmentId || !decision) return jsonBadRequest('assignmentId and decision are required');

    const state = getState();
    const assignment = state.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return jsonBadRequest('assignment not found');

    const nextStatus = decision === 'accept' ? 'accepted' : 'declined';
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId ? { ...a, status: nextStatus } : a
      ),
    }));

    return HttpResponse.json({ ok: true, assignmentId, status: nextStatus, reason });
  }),

  http.post('/api/registrations/create', async ({ request }) => {
    const body = await request.json();
    const { eventId, hcpId } = body as { eventId?: string; hcpId?: string };
    if (!eventId || !hcpId) return jsonBadRequest('eventId and hcpId are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');

    const ticketId = `tkt-${ticketCounter++}`;
    const attendanceId = `att-${attendanceCounter++}`;
    setState((prev) => ({
      ...prev,
      tickets: [
        ...prev.tickets,
        {
          id: ticketId,
          eventId,
          hcpId,
          status: 'confirmed',
        },
      ],
      attendanceRecords: [
        ...prev.attendanceRecords,
        {
          id: attendanceId,
          ticketId,
          finalized: false,
        },
      ],
    }));

    return HttpResponse.json({ ok: true, ticketId, status: 'confirmed' });
  }),

  http.post('/api/attendance/checkin', async ({ request }) => {
    const body = await request.json();
    const { ticketId, eventManagerId } = body as { ticketId?: string; eventManagerId?: string };
    if (!ticketId || !eventManagerId) return jsonBadRequest('ticketId and eventManagerId are required');

    const state = getState();
    const ticket = state.tickets.find((t) => t.id === ticketId);
    if (!ticket) return jsonBadRequest('ticket not found');
    if (ticket.status !== 'confirmed') return jsonBadRequest('ticket must be confirmed');

    const event = state.events.find((e) => e.id === ticket.eventId);
    if (!event) return jsonBadRequest('event not found');
    if (event.status === 'draft' || event.status === 'pending_review') {
      return jsonBadRequest('event not eligible for check-in');
    }

    const assignment = state.assignments.find((a) => a.eventId === event.id && a.status === 'accepted');
    if (!assignment || assignment.eventManagerId !== eventManagerId) {
      return jsonBadRequest('no accepted assignment for this event/eventManager');
    }

    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: 'attended' } : t
      ),
    }));

    return HttpResponse.json({ ok: true, ticketId, status: 'attended' });
  }),

  http.post('/api/attendance/finalize', async ({ request }) => {
    const body = await request.json();
    const { eventId, eventManagerId } = body as { eventId?: string; eventManagerId?: string };
    if (!eventId || !eventManagerId) return jsonBadRequest('eventId and eventManagerId are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');

    const assignment = state.assignments.find((a) => a.eventId === eventId && a.status === 'accepted');
    if (!assignment || assignment.eventManagerId !== eventManagerId) {
      return jsonBadRequest('no accepted assignment for this event/eventManager');
    }

    setState((prev) => ({
      ...prev,
      attendanceRecords: prev.attendanceRecords.map((a) =>
        a.ticketId.startsWith('tkt-') && prev.tickets.find((t) => t.id === a.ticketId && t.eventId === eventId)
          ? { ...a, finalized: true }
          : a
      ),
    }));

    return HttpResponse.json({ ok: true, eventId, finalized: true });
  }),

  http.post('/api/certificates/issue', async ({ request }) => {
    const body = await request.json();
    const { eventId, hcpId } = body as { eventId?: string; hcpId?: string };
    if (!eventId || !hcpId) return jsonBadRequest('eventId and hcpId are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');
    if (event.status !== 'approved' && event.status !== 'published') {
      return jsonBadRequest('event must be approved or published to issue certificate');
    }

    const ticket =
      state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId && t.status === 'attended') ||
      state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId);
    if (!ticket) return jsonBadRequest('ticket not found for hcp');
    if (ticket.status !== 'attended') return jsonBadRequest('ticket must be attended');

    const attendance = state.attendanceRecords.find((a) => a.ticketId === ticket.id);
    if (!attendance || !attendance.finalized) return jsonBadRequest('attendance not finalized');

    const certId = `cert-${certificateCounter++}`;
    const certUrl = `/certs/${certId}.pdf`;

    setState((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        {
          id: certId,
          eventId,
          ticketId: ticket.id,
          hcpId,
        },
      ],
    }));

    return HttpResponse.json({ ok: true, certificateId: certId, url: certUrl });
  }),

  http.post('/api/reviews/create', async ({ request }) => {
    const body = await request.json();
    const { eventId, hcpId, rating, text } = body as { eventId?: string; hcpId?: string; rating?: number; text?: string };
    if (!eventId || !hcpId || typeof rating !== 'number') return jsonBadRequest('eventId, hcpId, rating are required');

    const state = getState();
    const ticket =
      state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId && t.status === 'attended') ||
      state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId);
    if (!ticket || ticket.status !== 'attended') return jsonBadRequest('attended ticket required for review');

    const reviewId = `rev-${reviewCounter++}`;
    setState((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          id: reviewId,
          eventId,
          hcpId,
          rating,
          text,
        } as any,
      ],
    }));

    return HttpResponse.json({ ok: true, reviewId });
  }),

  http.post('/api/sponsorship/purchase', async ({ request }) => {
    const body = await request.json();
    const { eventId, vendorId, package: pkg } = body as { eventId?: string; vendorId?: string; package?: string };
    if (!eventId || !vendorId || !pkg) return jsonBadRequest('eventId, vendorId and package are required');

    const state = getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return jsonBadRequest('event not found');
    if (event.status !== 'published') return jsonBadRequest('event must be published for sponsorship purchase');

    const sponsorshipId = `spon-${sponsorshipCounter++}`;
    setState((prev) => ({
      ...prev,
      sponsorships: [
        ...prev.sponsorships,
        {
          id: sponsorshipId,
          eventId,
          vendorId,
          status: 'purchased',
          package: pkg,
        } as any,
      ],
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, is_sponsored: true } : e
      ),
    }));

    return HttpResponse.json({ ok: true, sponsorshipId, status: 'purchased' });
  }),

  // Regulator endpoints (matching CONTRACTS.md)
  http.get('/api/read/regulator/queue', async ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q');
    const city = url.searchParams.get('city');
    const specialty = url.searchParams.get('specialty');
    const page = url.searchParams.get('page');

    // Validate status param if provided
    if (status && !['pending_review', 'submitted', 'all'].includes(status)) {
      return jsonBadRequest(`Invalid status: ${status}. Must be one of: pending_review, submitted, all`);
    }

    // Validate page if provided
    if (page) {
      const pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return jsonBadRequest(`Invalid page: ${page}. Must be a positive integer`);
      }
    }

    const data = getRegulatorQueueData({
      status: status || undefined,
      q: q || undefined,
      city: city || undefined,
      specialty: specialty || undefined,
    });
    return HttpResponse.json({ ok: true, data });
  }),

  http.get('/api/read/regulator/decisions', async ({ request }) => {
    const url = new URL(request.url);
    const decision = url.searchParams.get('decision');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    // Validate decision param if provided
    if (decision && !['approved', 'rejected', 'all'].includes(decision)) {
      return jsonBadRequest(`Invalid decision: ${decision}. Must be one of: approved, rejected, all`);
    }

    // Validate date format if provided
    if (from && isNaN(Date.parse(from))) {
      return jsonBadRequest(`Invalid from date: ${from}. Must be ISO date string`);
    }
    if (to && isNaN(Date.parse(to))) {
      return jsonBadRequest(`Invalid to date: ${to}. Must be ISO date string`);
    }

    const items = getRegulatorDecisionsData({
      decision: (decision as 'approved' | 'rejected' | 'all') || undefined,
      from: from || undefined,
      to: to || undefined,
    });
    return HttpResponse.json({ ok: true, data: { items } });
  }),

  http.get('/api/read/regulator/monitoring', async () => {
    const compliance = getRegulatorMonitoringData();
    return HttpResponse.json({ ok: true, data: { compliance } });
  }),

  http.get('/api/read/regulator/analytics', async ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const groupBy = url.searchParams.get('groupBy');
    const metric = url.searchParams.get('metric');

    // Validate date format if provided
    if (from && isNaN(Date.parse(from))) {
      return jsonBadRequest(`Invalid from date: ${from}. Must be ISO date string`);
    }
    if (to && isNaN(Date.parse(to))) {
      return jsonBadRequest(`Invalid to date: ${to}. Must be ISO date string`);
    }

    // Validate groupBy if provided
    if (groupBy && !['city', 'specialty', 'provider'].includes(groupBy)) {
      return jsonBadRequest(`Invalid groupBy: ${groupBy}. Must be one of: city, specialty, provider`);
    }

    // Validate metric if provided
    if (metric && !['submissions', 'approvals', 'rejections', 'compliance_overdue'].includes(metric)) {
      return jsonBadRequest(`Invalid metric: ${metric}. Must be one of: submissions, approvals, rejections, compliance_overdue`);
    }

    const data = getRegulatorAnalyticsData({
      from: from || undefined,
      to: to || undefined,
      groupBy: groupBy || undefined,
      metric: metric || undefined,
    });
    return HttpResponse.json({ ok: true, data });
  }),

  http.post('/api/write/regulator/decision', async ({ request }) => {
    const body = await request.json();
    const { activityId, decision, reasonCode, note } = body as {
      activityId?: string;
      decision?: 'approved' | 'rejected';
      reasonCode?: string;
      note?: string;
    };
    if (!activityId || !decision) return jsonBadRequest('activityId and decision are required');

    const state = getState();
    const event = state.events.find((e) => e.id === activityId);
    if (!event) return jsonBadRequest('event not found');

    if (decision === 'approved') {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === activityId ? { ...e, status: 'approved', decisionAt: new Date().toISOString() } : e
        ),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === activityId
            ? {
                ...e,
                status: 'draft',
                decisionAt: new Date().toISOString(),
                rejectionReason: note,
                rejectionCategory: reasonCode,
              }
            : e
        ),
      }));
    }

    return HttpResponse.json({ ok: true, activityId, status: decision === 'approved' ? 'approved' : 'rejected' });
  }),

  http.post('/api/write/regulator/export', async ({ request }) => {
    const body = await request.json();
    const { report, format, filters } = body as {
      report?: 'queue' | 'decisions' | 'monitoring' | 'analytics';
      format?: 'csv' | 'json';
      filters?: Record<string, any>;
    };
    if (!report || !format) return jsonBadRequest('report and format are required');

    // Mock export - in real implementation, this would generate and return file
    const exportId = `export-${Date.now()}`;
    const rows = 100; // Mock row count

    return HttpResponse.json({
      ok: true,
      exportId,
      createdAt: new Date().toISOString(),
      rows,
    });
  }),

  // Dashboard Analytics endpoint
  http.get('/api/dashboard/analytics', async ({ request }) => {
    const url = new URL(request.url);
    const persona = url.searchParams.get('persona');
    const userId = url.searchParams.get('userId');
    if (!persona || !userId) return jsonBadRequest('persona and userId are required');

    const state = getState();
    let analytics: Record<string, any> = {};

    switch (persona) {
      case 'ORGANIZER':
        const organizerEvents = state.events.filter((e) => e.organizerId === userId);
        analytics = {
          totalEvents: organizerEvents.length,
          draftEvents: organizerEvents.filter((e) => e.status === 'draft').length,
          pendingEvents: organizerEvents.filter((e) => e.status === 'pending_review').length,
          approvedEvents: organizerEvents.filter((e) => e.status === 'approved').length,
          publishedEvents: organizerEvents.filter((e) => e.status === 'published').length,
          totalCMEHours: organizerEvents.reduce((sum, e) => sum + (e.cme_hours || 0), 0),
          averageEventSize: 0,
          approvalRate: organizerEvents.length > 0
            ? (organizerEvents.filter((e) => e.status === 'approved' || e.status === 'published').length / organizerEvents.length) * 100
            : 0,
        };
        break;
      case 'HCP':
        const hcpTickets = state.tickets.filter((t) => t.hcpId === userId);
        const hcpCertificates = state.certificates.filter((c) => c.hcpId === userId);
        analytics = {
          totalRegistrations: hcpTickets.length,
          attendedEvents: hcpTickets.filter((t) => t.status === 'attended').length,
          totalCMEHours: hcpCertificates.reduce((sum, c) => sum + (c.cme_hours || 0), 0),
          certificatesEarned: hcpCertificates.length,
          upcomingEvents: hcpTickets.filter((t) => {
            const event = state.events.find((e) => e.id === t.eventId);
            return event && event.status === 'published' && t.status === 'confirmed';
          }).length,
        };
        break;
      case 'EVENT_MANAGER':
        const managerAssignments = state.assignments.filter((a) => a.eventManagerId === userId);
        const acceptedAssignments = managerAssignments.filter((a) => a.status === 'accepted');
        analytics = {
          totalAssignments: managerAssignments.length,
          acceptedAssignments: acceptedAssignments.length,
          pendingAssignments: managerAssignments.filter((a) => a.status === 'pending').length,
          eventsManaged: acceptedAssignments.length,
          totalAttendees: 0,
          averageAttendanceRate: 0,
        };
        break;
      case 'VENDOR':
        const vendorSponsorships = state.sponsorships.filter((s) => s.vendorId === userId);
        analytics = {
          totalSponsorships: vendorSponsorships.length,
          activeSponsorships: vendorSponsorships.length,
          totalInvestment: 0,
          eventsSponsored: vendorSponsorships.length,
          reach: 0,
          impressions: 0,
        };
        break;
      case 'REGULATOR':
        analytics = {
          queueSize: state.events.filter((e) => e.status === 'pending_review').length,
          totalReviewed: state.events.filter((e) => e.decisionAt).length,
          approvalRate: 0,
          averageReviewTime: 0,
          totalEvents: state.events.length,
          totalCMEHours: state.events.reduce((sum, e) => sum + (e.cme_hours || 0), 0),
        };
        break;
    }

    return HttpResponse.json({ ok: true, analytics });
  }),

  // Dashboard KPIs endpoint
  http.get('/api/dashboard/kpis', async ({ request }) => {
    const url = new URL(request.url);
    const persona = url.searchParams.get('persona');
    const userId = url.searchParams.get('userId');
    if (!persona || !userId) return jsonBadRequest('persona and userId are required');

    const state = getState();
    let kpis: Array<{
      id: string;
      title: string;
      value: string | number;
      subtitle?: string;
      trend?: { value: number; label: string; isPositive: boolean };
      color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    }> = [];

    switch (persona) {
      case 'ORGANIZER':
        const organizerEvents = state.events.filter((e) => e.organizerId === userId);
        kpis = [
          { id: 'total-events', title: 'Total Events', value: organizerEvents.length, color: 'blue' },
          { id: 'pending-approval', title: 'Pending Approval', value: organizerEvents.filter((e) => e.status === 'pending_review').length, color: 'orange' },
          { id: 'published', title: 'Published', value: organizerEvents.filter((e) => e.status === 'published').length, color: 'green' },
          { id: 'total-hours', title: 'Total CME Hours', value: organizerEvents.reduce((sum, e) => sum + (e.cme_hours || 0), 0), subtitle: 'Accredited', color: 'purple' },
        ];
        break;
      case 'HCP':
        const hcpTickets = state.tickets.filter((t) => t.hcpId === userId);
        const hcpCertificates = state.certificates.filter((c) => c.hcpId === userId);
        kpis = [
          { id: 'registrations', title: 'Registrations', value: hcpTickets.length, color: 'blue' },
          { id: 'cme-hours', title: 'CME Hours', value: hcpCertificates.reduce((sum, c) => sum + (c.cme_hours || 0), 0), subtitle: 'Earned', color: 'green' },
          { id: 'certificates', title: 'Certificates', value: hcpCertificates.length, color: 'purple' },
          { id: 'upcoming', title: 'Upcoming', value: hcpTickets.filter((t) => {
            const event = state.events.find((e) => e.id === t.eventId);
            return event && event.status === 'published' && t.status === 'confirmed';
          }).length, color: 'orange' },
        ];
        break;
      case 'EVENT_MANAGER':
        const managerAssignments = state.assignments.filter((a) => a.eventManagerId === userId);
        kpis = [
          { id: 'assignments', title: 'Assignments', value: managerAssignments.length, color: 'blue' },
          { id: 'accepted', title: 'Accepted', value: managerAssignments.filter((a) => a.status === 'accepted').length, color: 'green' },
          { id: 'pending', title: 'Pending', value: managerAssignments.filter((a) => a.status === 'pending').length, color: 'orange' },
          { id: 'events-managed', title: 'Events Managed', value: managerAssignments.filter((a) => a.status === 'accepted').length, color: 'purple' },
        ];
        break;
      case 'VENDOR':
        const vendorSponsorships = state.sponsorships.filter((s) => s.vendorId === userId);
        kpis = [
          { id: 'sponsorships', title: 'Sponsorships', value: vendorSponsorships.length, color: 'blue' },
          { id: 'active', title: 'Active', value: vendorSponsorships.length, color: 'green' },
          { id: 'events', title: 'Events Sponsored', value: vendorSponsorships.length, color: 'purple' },
          { id: 'reach', title: 'Reach', value: '12.5K', subtitle: 'Estimated', color: 'orange' },
        ];
        break;
      case 'REGULATOR':
        kpis = [
          { id: 'queue', title: 'Queue', value: state.events.filter((e) => e.status === 'pending_review').length, color: 'orange' },
          { id: 'reviewed', title: 'Reviewed', value: state.events.filter((e) => e.decisionAt).length, color: 'blue' },
          { id: 'total-events', title: 'Total Events', value: state.events.length, color: 'purple' },
          { id: 'cme-hours', title: 'CME Hours', value: state.events.reduce((sum, e) => sum + (e.cme_hours || 0), 0), subtitle: 'Accredited', color: 'green' },
        ];
        break;
    }

    return HttpResponse.json({ ok: true, kpis });
  }),
];
