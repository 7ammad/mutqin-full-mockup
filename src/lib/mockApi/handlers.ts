import { http, HttpResponse, type RequestHandler } from 'msw';
import { getState, setState } from '@/context/demoStore';

function jsonBadRequest(message: string) {
  return HttpResponse.json({ ok: false, message }, { status: 400 });
}

let assignmentCounter = 2;
let ticketCounter = 2;
let reviewCounter = 2;
let sponsorshipCounter = 2;
let certificateCounter = 2;

export const handlers: RequestHandler[] = [
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
    if (event.status !== 'approved') return jsonBadRequest('event must be approved to issue certificate');

    const ticket = state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId);
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
    const ticket = state.tickets.find((t) => t.eventId === eventId && t.hcpId === hcpId);
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
];
