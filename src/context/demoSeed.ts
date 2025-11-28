export const DEMO_STORAGE_KEY = 'mutqin.demo.v1';
export const DEMO_STATE_VERSION = 1;

export interface DemoEvent {
  id: string;
  title: string;
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'closed';
  organizerId: string;
}

export interface DemoAssignment {
  id: string;
  eventId: string;
  organizerId: string;
  eventManagerId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface DemoTicket {
  id: string;
  eventId: string;
  hcpId: string;
  status: 'confirmed' | 'attended';
}

export interface DemoAttendance {
  id: string;
  ticketId: string;
  finalized: boolean;
}

export interface DemoCertificate {
  id: string;
  eventId: string;
  ticketId: string;
  hcpId: string;
}

export interface DemoReview {
  id: string;
  eventId: string;
  hcpId: string;
  rating: number;
}

export interface DemoSponsorship {
  id: string;
  eventId: string;
  vendorId: string;
  status: 'purchased';
}

export interface DemoState {
  version: number;
  events: DemoEvent[];
  assignments: DemoAssignment[];
  tickets: DemoTicket[];
  attendanceRecords: DemoAttendance[];
  certificates: DemoCertificate[];
  reviews: DemoReview[];
  sponsorships: DemoSponsorship[];
}

/**
 * Deterministic seed data for the demo store.
 * Contains a single happy-path scenario across roles.
 */
export function seedDemoState(): DemoState {
  const organizerId = 'org-1';
  const eventManagerId = 'em-1';
  const hcpId = 'hcp-1';
  const vendorId = 'vendor-1';
  const eventId = 'evt-1';
  const assignmentId = 'assign-1';
  const ticketId = 'tkt-1';
  const attendanceId = 'att-1';
  const certificateId = 'cert-1';
  const reviewId = 'rev-1';
  const sponsorshipId = 'spon-1';

  return {
    version: DEMO_STATE_VERSION,
    events: [
      {
        id: eventId,
        title: 'Accredited Event',
        status: 'published',
        organizerId,
      },
    ],
    assignments: [
      {
        id: assignmentId,
        eventId,
        organizerId,
        eventManagerId,
        status: 'pending',
      },
    ],
    tickets: [
      {
        id: ticketId,
        eventId,
        hcpId,
        status: 'confirmed',
      },
    ],
    attendanceRecords: [
      {
        id: attendanceId,
        ticketId,
        finalized: false,
      },
    ],
    certificates: [
      {
        id: certificateId,
        eventId,
        ticketId,
        hcpId,
      },
    ],
    reviews: [
      {
        id: reviewId,
        eventId,
        hcpId,
        rating: 5,
      },
    ],
    sponsorships: [
      {
        id: sponsorshipId,
        eventId,
        vendorId,
        status: 'purchased',
      },
    ],
  };
}
