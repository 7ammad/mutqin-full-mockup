/**
 * API Endpoint Tests
 * 
 * Comprehensive testing of all API endpoints including:
 * - GET endpoints (data reads)
 * - POST endpoints (data writes)
 * - Error handling
 * - Validation
 * - Edge cases
 * 
 * Uses MSW (Mock Service Worker) for API mocking
 */

import { describe, test, expect, beforeAll, beforeEach, vi, type Mock } from 'vitest';
import { api } from '@/lib/api/client';

// Mock fetch for API calls
global.fetch = vi.fn() as Mock;

describe('API Endpoint Tests', () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockClear();
  });

  describe('GET Endpoints - Data Reads', () => {
    describe('Single Entity GET Endpoints', () => {
      test('GET /api/events/:eventId - Success', async () => {
        const mockEvent = {
          id: 'evt-1',
          titleEn: 'Test Event',
          status: 'published',
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, event: mockEvent }),
        });

        const result = await api.getEventById({ eventId: 'evt-1' });
        expect(result.ok).toBe(true);
        expect(result.event).toEqual(mockEvent);
        expect(global.fetch).toHaveBeenCalledWith('/api/events/evt-1', { method: 'GET' });
      });

      test('GET /api/events/:eventId - Not Found', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: { code: 'NOT_FOUND', message: 'Event not found' },
          }),
        });

        await expect(api.getEventById({ eventId: 'invalid-id' })).rejects.toThrow('Event not found');
      });

      test('GET /api/tickets/:ticketId - Success', async () => {
        const mockTicket = {
          id: 'tkt-1',
          eventId: 'evt-1',
          hcpId: 'hcp-1',
          status: 'confirmed',
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, ticket: mockTicket }),
        });

        const result = await api.getTicketById({ ticketId: 'tkt-1' });
        expect(result.ok).toBe(true);
        expect(result.ticket).toEqual(mockTicket);
      });

      test('GET /api/tickets/:ticketId - Not Found', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: { code: 'NOT_FOUND', message: 'Ticket not found' },
          }),
        });

        await expect(api.getTicketById({ ticketId: 'invalid-id' })).rejects.toThrow('Ticket not found');
      });

      test('GET /api/certificates/:certificateId - Success', async () => {
        const mockCertificate = {
          id: 'cert-1',
          eventId: 'evt-1',
          hcpId: 'hcp-1',
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, certificate: mockCertificate }),
        });

        const result = await api.getCertificateById({ certificateId: 'cert-1' });
        expect(result.ok).toBe(true);
        expect(result.certificate).toEqual(mockCertificate);
      });

      test('GET /api/sponsorships/:sponsorshipId - Success', async () => {
        const mockSponsorship = {
          id: 'spon-1',
          eventId: 'evt-1',
          vendorId: 'vendor-1',
          status: 'purchased',
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, sponsorship: mockSponsorship }),
        });

        const result = await api.getSponsorshipById({ sponsorshipId: 'spon-1' });
        expect(result.ok).toBe(true);
        expect(result.sponsorship).toEqual(mockSponsorship);
      });

      test('GET /api/assignments/:assignmentId - Success', async () => {
        const mockAssignment = {
          id: 'assign-1',
          eventId: 'evt-1',
          eventManagerId: 'em-1',
          status: 'pending',
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, assignment: mockAssignment }),
        });

        const result = await api.getAssignmentById({ assignmentId: 'assign-1' });
        expect(result.ok).toBe(true);
        expect(result.assignment).toEqual(mockAssignment);
      });
    });

    describe('List GET Endpoints', () => {
      test('GET /api/organizer/events - Success', async () => {
        const mockEvents = [
          { id: 'evt-1', titleEn: 'Event 1', status: 'published' },
          { id: 'evt-2', titleEn: 'Event 2', status: 'draft' },
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, events: mockEvents }),
        });

        const result = await api.getOrganizerEvents({ organizerId: 'org-1' });
        expect(result.ok).toBe(true);
        expect(result.events).toEqual(mockEvents);
        expect(global.fetch).toHaveBeenCalledWith('/api/organizer/events?organizerId=org-1', { method: 'GET' });
      });

      test('GET /api/organizer/events - Missing organizerId', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: { code: 'VALIDATION_ERROR', message: 'organizerId is required' },
          }),
        });

        await expect(api.getOrganizerEvents({ organizerId: '' })).rejects.toThrow();
      });

      test('GET /api/regulator/accreditation-queue - Success', async () => {
        const mockEvents = [
          { id: 'evt-1', titleEn: 'Event 1', status: 'pending_review' },
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, events: mockEvents }),
        });

        const result = await api.getRegulatorQueue();
        expect(result.ok).toBe(true);
        expect(result.events).toEqual(mockEvents);
      });

      test('GET /api/regulator/all-events - Success', async () => {
        const mockEvents = [
          { id: 'evt-1', titleEn: 'Event 1', status: 'published' },
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, events: mockEvents }),
        });

        const result = await api.getAllEvents();
        expect(result.ok).toBe(true);
        expect(result.events).toEqual(mockEvents);
      });

      test('GET /api/event-manager/assignments - Success', async () => {
        const mockAssignments = [
          {
            event: { id: 'evt-1', titleEn: 'Event 1' },
            assignment: { id: 'assign-1', status: 'pending' },
          },
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, assignments: mockAssignments }),
        });

        const result = await api.getEventManagerAssignments({ eventManagerId: 'em-1' });
        expect(result.ok).toBe(true);
        expect(result.assignments).toEqual(mockAssignments);
      });

      test('GET /api/hcp/summary - Success', async () => {
        const mockSummary = {
          tickets: [{ id: 'tkt-1', eventId: 'evt-1' }],
          certificates: [{ id: 'cert-1', eventId: 'evt-1' }],
          reviews: [{ id: 'rev-1', eventId: 'evt-1' }],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, ...mockSummary }),
        });

        const result = await api.getHcpSummary({ hcpId: 'hcp-1' });
        expect(result.ok).toBe(true);
        expect(result.tickets).toEqual(mockSummary.tickets);
        expect(result.certificates).toEqual(mockSummary.certificates);
        expect(result.reviews).toEqual(mockSummary.reviews);
      });

      test('GET /api/vendor/sponsorships - Success', async () => {
        const mockSponsorships = [
          { id: 'spon-1', eventId: 'evt-1', status: 'purchased' },
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, sponsorships: mockSponsorships }),
        });

        const result = await api.getVendorSponsorships({ vendorId: 'vendor-1' });
        expect(result.ok).toBe(true);
        expect(result.sponsorships).toEqual(mockSponsorships);
      });
    });

    describe('Regulator Read Endpoints', () => {
      test('GET /api/read/regulator/queue - Success', async () => {
        const mockData = {
          counts: { pending: 5, dueSoon: 2, overdueCompliance: 1 },
          items: [
            {
              activityId: 'evt-1',
              title: 'Test Event',
              providerName: 'Test Provider',
              city: 'Riyadh',
              specialty: 'Cardiology',
              startDate: '2025-02-01',
              endDate: '2025-02-01',
              status: 'pending_review',
              riskFlags: [],
            },
          ],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, data: mockData }),
        });

        const result = await api.getRegulatorQueueRead();
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockData);
      });

      test('GET /api/read/regulator/queue - With Filters', async () => {
        const mockData = {
          counts: { pending: 2, dueSoon: 0, overdueCompliance: 0 },
          items: [],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, data: mockData }),
        });

        const result = await api.getRegulatorQueueRead({
          status: 'pending_review',
          city: 'Riyadh',
          specialty: 'Cardiology',
          page: 1,
        });
        expect(result.ok).toBe(true);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/read/regulator/queue?status=pending_review&city=Riyadh&specialty=Cardiology&page=1',
          { method: 'GET' }
        );
      });

      test('GET /api/read/regulator/queue - Invalid Status', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid status: invalid_status. Must be one of: pending_review, submitted, all',
            },
          }),
        });

        await expect(
          api.getRegulatorQueueRead({ status: 'invalid_status' as any })
        ).rejects.toThrow();
      });

      test('GET /api/read/regulator/decisions - Success', async () => {
        const mockData = {
          items: [
            {
              activityId: 'evt-1',
              title: 'Test Event',
              providerName: 'Test Provider',
              decision: 'approved' as const,
              decidedAt: '2025-01-01T00:00:00Z',
            },
          ],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, data: mockData }),
        });

        const result = await api.getRegulatorDecisionsRead();
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockData);
      });

      test('GET /api/read/regulator/monitoring - Success', async () => {
        const mockData = {
          compliance: [
            {
              activityId: 'evt-1',
              title: 'Test Event',
              providerName: 'Test Provider',
              endedAt: '2025-01-01',
              attendanceRecords: { status: 'submitted' as const },
              hoursRegistration: { status: 'submitted' as const },
              exceptionRate: 0,
            },
          ],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, data: mockData }),
        });

        const result = await api.getRegulatorMonitoringRead();
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockData);
      });

      test('GET /api/read/regulator/analytics - Success', async () => {
        const mockData = {
          summary: {
            totalActivities: 10,
            approvedRate: 80,
            avgDecisionTimeDays: 5,
            overdueAttendanceRecords: 2,
            overdueHoursRegistration: 1,
          },
          breakdown: [
            { key: 'Riyadh', value: 5 },
            { key: 'Jeddah', value: 3 },
          ],
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, data: mockData }),
        });

        const result = await api.getRegulatorAnalyticsRead();
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockData);
      });
    });
  });

  describe('POST Endpoints - Data Writes', () => {
    describe('Accreditation Endpoints', () => {
      test('POST /api/accreditation/submit - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, eventId: 'evt-1', status: 'pending_review' }),
        });

        const result = await api.submitAccreditation({ eventId: 'evt-1' });
        expect(result.ok).toBe(true);
        expect(result.eventId).toBe('evt-1');
        expect(result.status).toBe('pending_review');
        expect(global.fetch).toHaveBeenCalledWith('/api/accreditation/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: 'evt-1' }),
        });
      });

      test('POST /api/accreditation/submit - Missing eventId', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: { code: 'VALIDATION_ERROR', message: 'eventId is required' },
          }),
        });

        await expect(api.submitAccreditation({ eventId: '' })).rejects.toThrow();
      });

      test('POST /api/accreditation/review - Approve', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, eventId: 'evt-1', status: 'approved' }),
        });

        const result = await api.reviewAccreditation({
          eventId: 'evt-1',
          decision: 'approve',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('approved');
      });

      test('POST /api/accreditation/review - Reject', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, eventId: 'evt-1', status: 'draft', reason: 'Incomplete information' }),
        });

        const result = await api.reviewAccreditation({
          eventId: 'evt-1',
          decision: 'reject',
          reason: 'Incomplete information',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('draft');
        expect(result.reason).toBe('Incomplete information');
      });
    });

    describe('Assignment Endpoints', () => {
      test('POST /api/assignments/create - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, assignmentId: 'assign-1' }),
        });

        const result = await api.createAssignment({
          eventId: 'evt-1',
          eventManagerId: 'em-1',
        });
        expect(result.ok).toBe(true);
        expect(result.assignmentId).toBe('assign-1');
      });

      test('POST /api/assignments/respond - Accept', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, assignmentId: 'assign-1', status: 'accepted' }),
        });

        const result = await api.respondAssignment({
          assignmentId: 'assign-1',
          decision: 'accept',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('accepted');
      });

      test('POST /api/assignments/respond - Decline', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, assignmentId: 'assign-1', status: 'declined', reason: 'Schedule conflict' }),
        });

        const result = await api.respondAssignment({
          assignmentId: 'assign-1',
          decision: 'decline',
          reason: 'Schedule conflict',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('declined');
      });
    });

    describe('Registration & Attendance Endpoints', () => {
      test('POST /api/registrations/create - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, ticketId: 'tkt-1', status: 'confirmed' }),
        });

        const result = await api.createRegistration({
          eventId: 'evt-1',
          hcpId: 'hcp-1',
        });
        expect(result.ok).toBe(true);
        expect(result.ticketId).toBe('tkt-1');
        expect(result.status).toBe('confirmed');
      });

      test('POST /api/attendance/checkin - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, ticketId: 'tkt-1', status: 'attended' }),
        });

        const result = await api.checkIn({
          ticketId: 'tkt-1',
          eventManagerId: 'em-1',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('attended');
      });

      test('POST /api/attendance/finalize - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, eventId: 'evt-1', finalized: true }),
        });

        const result = await api.finalizeAttendance({
          eventId: 'evt-1',
          eventManagerId: 'em-1',
        });
        expect(result.ok).toBe(true);
        expect(result.finalized).toBe(true);
      });
    });

    describe('Certificate & Review Endpoints', () => {
      test('POST /api/certificates/issue - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, certificateId: 'cert-1', url: '/certs/cert-1.pdf' }),
        });

        const result = await api.issueCertificate({
          eventId: 'evt-1',
          hcpId: 'hcp-1',
        });
        expect(result.ok).toBe(true);
        expect(result.certificateId).toBe('cert-1');
        expect(result.url).toBe('/certs/cert-1.pdf');
      });

      test('POST /api/reviews/create - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, reviewId: 'rev-1' }),
        });

        const result = await api.createReview({
          eventId: 'evt-1',
          hcpId: 'hcp-1',
          rating: 5,
          text: 'Great event!',
        });
        expect(result.ok).toBe(true);
        expect(result.reviewId).toBe('rev-1');
      });

      test('POST /api/reviews/create - Missing Rating', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: false,
            error: { code: 'VALIDATION_ERROR', message: 'eventId, hcpId, rating are required' },
          }),
        });

        await expect(
          api.createReview({
            eventId: 'evt-1',
            hcpId: 'hcp-1',
            rating: undefined as any,
          })
        ).rejects.toThrow();
      });
    });

    describe('Event & Sponsorship Endpoints', () => {
      test('POST /api/events/publish - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, eventId: 'evt-1', status: 'published' }),
        });

        const result = await api.publishEvent({
          eventId: 'evt-1',
          organizerId: 'org-1',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('published');
      });

      test('POST /api/sponsorship/purchase - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, sponsorshipId: 'spon-1', status: 'purchased' }),
        });

        const result = await api.purchaseSponsorship({
          eventId: 'evt-1',
          vendorId: 'vendor-1',
          package: 'premium',
        });
        expect(result.ok).toBe(true);
        expect(result.sponsorshipId).toBe('spon-1');
        expect(result.status).toBe('purchased');
      });
    });

    describe('Regulator Write Endpoints', () => {
      test('POST /api/write/regulator/decision - Approve', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, activityId: 'evt-1', status: 'approved' }),
        });

        const result = await api.regulatorDecision({
          activityId: 'evt-1',
          decision: 'approved',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('approved');
      });

      test('POST /api/write/regulator/decision - Reject', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({ ok: true, activityId: 'evt-1', status: 'rejected' }),
        });

        const result = await api.regulatorDecision({
          activityId: 'evt-1',
          decision: 'rejected',
          reasonCode: 'INCOMPLETE',
          note: 'Missing required documents',
        });
        expect(result.ok).toBe(true);
        expect(result.status).toBe('rejected');
      });

      test('POST /api/write/regulator/export - Success', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: () => 'application/json' },
          json: async () => ({
            ok: true,
            exportId: 'export-123',
            createdAt: '2025-01-27T00:00:00Z',
            rows: 100,
          }),
        });

        const result = await api.regulatorExport({
          report: 'queue',
          format: 'csv',
        });
        expect(result.ok).toBe(true);
        expect(result.exportId).toBe('export-123');
        expect(result.rows).toBe(100);
      });
    });
  });

  describe('Error Handling', () => {
    test('Handles Network Errors', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getEventById({ eventId: 'evt-1' })).rejects.toThrow('Network error');
    });

    test('Handles Invalid JSON Response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'text/plain' },
        text: async () => 'Invalid response',
      });

      await expect(api.getEventById({ eventId: 'evt-1' })).rejects.toThrow();
    });

    test('Handles HTML Response (404)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: { get: () => 'text/html' },
        text: async () => '<!DOCTYPE html><html>...</html>',
      });

      await expect(api.getEventById({ eventId: 'evt-1' })).rejects.toThrow('API endpoint returned HTML');
    });

    test('Handles Error Response with Message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: 'Custom error message' },
        }),
      });

      await expect(api.getEventById({ eventId: 'evt-1' })).rejects.toThrow('Custom error message');
    });
  });

  describe('Request Validation', () => {
    test('Validates Required Parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: 'eventId is required' },
        }),
      });

      await expect(api.submitAccreditation({ eventId: '' })).rejects.toThrow();
    });

    test('Validates Parameter Types', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: 'rating must be a number' },
        }),
      });

      await expect(
        api.createReview({
          eventId: 'evt-1',
          hcpId: 'hcp-1',
          rating: 'invalid' as any,
        })
      ).rejects.toThrow();
    });
  });
});
