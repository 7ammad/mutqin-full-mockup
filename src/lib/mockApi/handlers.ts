import { http, HttpResponse, type RequestHandler } from 'msw';
import { getState, setState } from '@/context/demoStore';

function jsonBadRequest(message: string) {
  return HttpResponse.json({ ok: false, message }, { status: 400 });
}

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

    const assignmentId = `assign-${Date.now()}`;
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

    const ticketId = `tkt-${Date.now()}`;
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
];
