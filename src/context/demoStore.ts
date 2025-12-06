import {
  seedDemoState,
  type DemoAssignment,
  type DemoAttendance,
  type DemoCertificate,
  type DemoEvent,
  type DemoReview,
  type DemoState,
  type DemoTicket,
  type DemoSponsorship,
} from './demoSeed';
import { loadState, saveState, clearState } from './demoPersistence';

type Listener = (state: DemoState) => void;

let state: DemoState = loadState();
const listeners = new Set<Listener>();
let saveTimeout: ReturnType<typeof setTimeout> | undefined;

function notify() {
  listeners.forEach((listener) => listener(state));
}

function persist(next: DemoState) {
  state = next;
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => saveState(state), 10);
  notify();
}

export function getState(): DemoState {
  return state;
}

export function setState(updater: (prev: DemoState) => DemoState): void {
  const next = updater(state);
  persist(next);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetDemo(): void {
  clearState();
  const seeded = seedDemoState();
  persist(seeded);
}

export function getOrganizerEvents(organizerId: string): DemoEvent[] {
  const current = getState();
  return current.events.filter((event) => event.organizerId === organizerId);
}

export function getRegulatorQueue(): DemoEvent[] {
  const current = getState();
  return current.events.filter((event) => event.status === 'pending_review');
}

export function getEventManagerAssignments(
  eventManagerId: string
): { event: DemoEvent; assignment: DemoAssignment }[] {
  const current = getState();
  return current.assignments
    .filter((assignment) => assignment.eventManagerId === eventManagerId)
    .map((assignment) => {
      const event = current.events.find((e) => e.id === assignment.eventId);
      if (!event) {
        throw new Error(`Event not found for assignment ${assignment.id}`);
      }
      return { event, assignment };
    });
}

export function getHcpSummary(hcpId: string): {
  tickets: DemoTicket[];
  certificates: DemoCertificate[];
  reviews: DemoReview[];
} {
  const current = getState();
  return {
    tickets: current.tickets.filter((ticket) => ticket.hcpId === hcpId),
    certificates: current.certificates.filter((cert) => cert.hcpId === hcpId),
    reviews: current.reviews.filter((review) => review.hcpId === hcpId),
  };
}

export function getVendorSponsorships(vendorId: string): DemoSponsorship[] {
  const current = getState();
  return current.sponsorships.filter((sponsorship) => sponsorship.vendorId === vendorId);
}

// Single entity getters for L2 pages
export function getEventById(eventId: string): DemoEvent | undefined {
  const current = getState();
  return current.events.find((event) => event.id === eventId);
}

export function getTicketById(ticketId: string): DemoTicket | undefined {
  const current = getState();
  return current.tickets.find((ticket) => ticket.id === ticketId);
}

export function getCertificateById(certificateId: string): DemoCertificate | undefined {
  const current = getState();
  return current.certificates.find((cert) => cert.id === certificateId);
}

export function getSponsorshipById(sponsorshipId: string): DemoSponsorship | undefined {
  const current = getState();
  return current.sponsorships.find((sponsorship) => sponsorship.id === sponsorshipId);
}

export function getAssignmentById(assignmentId: string): DemoAssignment | undefined {
  const current = getState();
  return current.assignments.find((assignment) => assignment.id === assignmentId);
}

// HCP data helpers (matching CONTRACTS.md)
export function getHcpActivities(hcpId: string): {
  discover: Array<{
    activityId: string;
    title: string;
    city: string;
    specialty: string;
    startDate: string;
    creditHours: number;
    accredited: boolean;
  }>;
  myTickets: Array<{
    ticketId: string;
    activityId: string;
    title: string;
    status: string;
    qrCode?: string;
  }>;
} {
  const current = getState();
  const hcpTickets = current.tickets.filter((t) => t.hcpId === hcpId);
  const registeredEventIds = new Set(hcpTickets.map((t) => t.eventId));
  
  // Discover: published events not yet registered
  const discover = current.events
    .filter((e) => e.status === 'published' && !registeredEventIds.has(e.id))
    .map((event) => ({
      activityId: event.id,
      title: event.titleEn || event.titleAr || event.title || 'Event',
      city: event.city || 'Unknown',
      specialty: event.specialty || 'General',
      startDate: event.date || new Date().toISOString(),
      creditHours: event.cme_hours || 0,
      accredited: true, // All published events are accredited in demo
    }));
  
  // My Tickets
  const myTickets = hcpTickets.map((ticket) => {
    const event = current.events.find((e) => e.id === ticket.eventId);
    return {
      ticketId: ticket.id,
      activityId: ticket.eventId,
      title: event?.titleEn || event?.titleAr || event?.title || 'Event',
      status: ticket.status || 'confirmed',
    };
  });
  
  return { discover, myTickets };
}

export function getHcpCredits(hcpId: string): {
  earned: number;
  pending: number;
  posted: number;
  items: Array<{ 
    activityId: string; 
    title: string; 
    status: 'earned' | 'pending' | 'posted'; 
    hours: number;
    providerName?: string;
    dateCompleted?: string;
    specialty?: string;
  }>;
} {
  const current = getState();
  const hcpTickets = current.tickets.filter((t) => t.hcpId === hcpId);
  const hcpCertificates = current.certificates.filter((c) => c.hcpId === hcpId);
  const hcpAttendance = current.attendanceRecords.filter((a) => {
    const ticket = hcpTickets.find((t) => t.id === a.ticketId);
    return ticket !== undefined;
  });
  
  const items: Array<{ 
    activityId: string; 
    title: string; 
    status: 'earned' | 'pending' | 'posted'; 
    hours: number;
    providerName?: string;
    dateCompleted?: string;
    specialty?: string;
  }> = [];
  
  hcpTickets.forEach((ticket) => {
    const event = current.events.find((e) => e.id === ticket.eventId);
    if (!event) return;
    
    const attendance = hcpAttendance.find((a) => a.ticketId === ticket.id);
    const certificate = hcpCertificates.find((c) => c.eventId === ticket.eventId);
    const hours = event.cme_hours || 0;
    
    // Status logic:
    // - posted: has certificate (hours registered)
    // - earned: attendance finalized but no certificate yet
    // - pending: ticket exists but attendance not finalized
    let status: 'earned' | 'pending' | 'posted';
    if (certificate) {
      status = 'posted';
    } else if (attendance?.finalized) {
      status = 'earned';
    } else {
      status = 'pending';
    }
    
    // Use certificate date if available, otherwise event date
    // If attendance is finalized but no certificate, use event date as completion date
    const dateCompleted = certificate?.issuedAt 
      ? certificate.issuedAt 
      : attendance?.finalized 
        ? (event.date || new Date().toISOString())
        : event.date;
    
    items.push({
      activityId: event.id,
      title: event.titleEn || event.titleAr || event.title || 'Event',
      status,
      hours,
      providerName: event.organizerEn || event.organizerAr,
      dateCompleted,
      specialty: event.specialty,
    });
  });
  
  const earned = items.filter((i) => i.status === 'earned').reduce((sum, i) => sum + i.hours, 0);
  const pending = items.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.hours, 0);
  const posted = items.filter((i) => i.status === 'posted').reduce((sum, i) => sum + i.hours, 0);
  
  return { earned, pending, posted, items };
}

// Organizer data helpers (matching CONTRACTS.md)
export function getOrganizerCompliance(organizerId: string): Array<{
  activityId: string;
  title: string;
  endedAt: string;
  attendanceRecords: { status: string; dueAt?: string };
  hoursRegistration: { status: string; dueAt?: string };
}> {
  const current = getState();
  const organizerEvents = current.events.filter((e) => e.organizerId === organizerId);
  const now = new Date();
  
  return organizerEvents
    .filter((e) => e.status === 'published' || e.status === 'closed')
    .map((event) => {
      const eventDate = event.date ? new Date(event.date) : now;
      const attendanceDue = new Date(eventDate);
      attendanceDue.setDate(attendanceDue.getDate() + 21);
      const hoursDue = new Date(eventDate);
      hoursDue.setDate(hoursDue.getDate() + 21);
      
      const eventTickets = current.tickets.filter((t) => t.eventId === event.id);
      const attendanceRecords = current.attendanceRecords.filter((a) => {
        return eventTickets.some((t) => t.id === a.ticketId);
      });
      
      const hasFinalized = attendanceRecords.length > 0 && attendanceRecords.every((a) => a.finalized);
      
      return {
        activityId: event.id,
        title: event.titleEn || event.titleAr || event.title || 'Event',
        endedAt: event.date || now.toISOString(),
        attendanceRecords: {
          status: hasFinalized ? 'submitted' : now > attendanceDue ? 'overdue' : 'not_started',
          dueAt: attendanceDue.toISOString(),
        },
        hoursRegistration: {
          status: hasFinalized ? 'submitted' : now > hoursDue ? 'overdue' : 'not_started',
          dueAt: hoursDue.toISOString(),
        },
      };
    });
}

export function getOrganizerSponsors(organizerId: string): {
  packages: Array<{ id: string; activityId: string; title: string; priceSAR: number; benefits: string[]; spotsTotal: number; spotsRemaining: number }>;
  deals: Array<{ id: string; activityId: string; sponsorOrgId: string; packageId: string; status: string; createdAt: string; paidAt?: string }>;
  disclosures: Array<{ id: string; dealId: string; submittedAt: string; approvedAt?: string; approvedByUserId?: string; status: string; notes?: string }>;
} {
  const current = getState();
  const organizerEvents = current.events.filter((e) => e.organizerId === organizerId);
  
  // Mock packages for events that need sponsorship
  const packages = organizerEvents
    .filter((e) => e.needs_sponsorship || e.is_sponsored)
    .map((event, idx) => ({
      id: `pkg-${event.id}`,
      activityId: event.id,
      title: `Gold Package - ${event.titleEn || event.title}`,
      priceSAR: 50000 + (idx * 10000),
      benefits: ['Logo on event materials', 'Booth space', 'Speaking opportunity'],
      spotsTotal: 1,
      spotsRemaining: event.is_sponsored ? 0 : 1,
    }));
  
  // Mock deals from sponsorships
  const deals = current.sponsorships
    .filter((sp) => organizerEvents.some((e) => e.id === sp.eventId))
    .map((sp, idx) => ({
      id: `deal-${sp.id}`,
      activityId: sp.eventId,
      sponsorOrgId: sp.vendorId,
      packageId: `pkg-${sp.eventId}`,
      status: sp.status === 'purchased' ? 'paid' : 'reserved',
      createdAt: new Date().toISOString(),
      paidAt: sp.status === 'purchased' ? new Date().toISOString() : undefined,
    }));
  
  // Mock disclosures
  const disclosures = deals
    .filter((d) => d.status === 'paid')
    .map((deal, idx) => ({
      id: `disclosure-${deal.id}`,
      dealId: deal.id,
      submittedAt: new Date(Date.now() - idx * 86400000).toISOString(),
      approvedAt: idx === 0 ? new Date().toISOString() : undefined,
      approvedByUserId: idx === 0 ? 'compliance-1' : undefined,
      status: idx === 0 ? 'approved' : 'submitted',
      notes: idx === 0 ? 'Disclosure approved' : undefined,
    }));
  
  return { packages, deals, disclosures };
}

export function getEventAttendanceData(eventId: string): {
  tickets: DemoTicket[];
  attendanceRecords: DemoAttendance[];
  checkedInCount: number;
  totalCount: number;
  finalized: boolean;
} {
  const current = getState();
  const tickets = current.tickets.filter((t) => t.eventId === eventId);
  const attendanceRecords = current.attendanceRecords.filter((a) => {
    const ticket = tickets.find((t) => t.id === a.ticketId);
    return ticket !== undefined;
  });
  const checkedInCount = tickets.filter((t) => t.status === 'attended').length;
  const finalized = attendanceRecords.some((a) => a.finalized);
  return {
    tickets,
    attendanceRecords,
    checkedInCount,
    totalCount: tickets.length,
    finalized,
  };
}

// Regulator data helpers (matching CONTRACTS.md shapes)
export function getRegulatorQueueData(params?: {
  status?: string;
  q?: string;
  city?: string;
  specialty?: string;
}): {
  counts: { pending: number; dueSoon: number; overdueCompliance: number };
  items: Array<{
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
  }>;
} {
  const current = getState();
  let events = current.events.filter((e) => e.status === 'pending_review');

  // Apply filters
  if (params?.city) {
    events = events.filter((e) => e.city === params.city);
  }
  if (params?.specialty) {
    events = events.filter((e) => e.specialty === params.specialty);
  }
  if (params?.q) {
    const q = params.q.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.titleAr?.toLowerCase().includes(q) ||
        e.titleEn?.toLowerCase().includes(q) ||
        e.organizerAr?.toLowerCase().includes(q) ||
        e.organizerEn?.toLowerCase().includes(q)
    );
  }

  const now = new Date();
  const dueSoonThreshold = 3 * 24 * 60 * 60 * 1000; // 3 days

  const pending = events.length;
  const dueSoon = events.filter((e) => {
    if (!e.submittedAt) return false;
    const submitted = new Date(e.submittedAt);
    const daysSinceSubmission = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSubmission >= 4 && daysSinceSubmission < 7;
  }).length;

  // Count overdue compliance across all ended activities
  const endedEvents = current.events.filter((e) => e.status === 'published' || e.status === 'closed');
  const overdueCompliance = endedEvents.filter((e) => {
    if (!e.date) return false;
    const eventDate = new Date(e.date);
    const attendanceDue = new Date(eventDate);
    attendanceDue.setDate(attendanceDue.getDate() + 21);
    return now > attendanceDue;
  }).length;

  const items = events.map((e) => {
    const riskFlags: string[] = [];
    if (!e.sfda_license) riskFlags.push('missing-sfda-license');
    if (!e.descriptionAr && !e.descriptionEn) riskFlags.push('missing-description');
    if (e.submittedAt) {
      const daysSinceSubmission = (now.getTime() - new Date(e.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceSubmission > 5) riskFlags.push('due-soon');
    }
    const providerEvents = current.events.filter(
      (ev) => (ev.organizerAr === e.organizerAr || ev.organizerEn === e.organizerEn) && ev.status === 'pending_review'
    );
    if (providerEvents.length > 3) riskFlags.push('high-volume-provider');

    return {
      activityId: e.id,
      title: e.titleEn || e.titleAr || e.title || 'Event',
      providerName: e.organizerEn || e.organizerAr || 'Organizer',
      city: e.city || 'Unknown',
      specialty: e.specialty || 'General',
      startDate: e.date || new Date().toISOString(),
      endDate: e.date || new Date().toISOString(),
      status: e.status,
      submittedAt: e.submittedAt,
      riskFlags,
    };
  });

  return {
    counts: { pending, dueSoon, overdueCompliance },
    items,
  };
}

export function getRegulatorDecisionsData(params?: {
  decision?: 'approved' | 'rejected' | 'all';
  from?: string;
  to?: string;
}): Array<{
  activityId: string;
  title: string;
  providerName: string;
  decision: 'approved' | 'rejected';
  decidedAt: string;
  reasonCode?: string;
}> {
  const current = getState();
  let events = current.events.filter((e) => e.decisionAt && (e.status === 'approved' || (e.status === 'draft' && e.rejectionReason)));

  // Filter by decision
  if (params?.decision === 'approved') {
    events = events.filter((e) => e.status === 'approved');
  } else if (params?.decision === 'rejected') {
    events = events.filter((e) => e.status === 'draft' && e.rejectionReason);
  }

  // Filter by date range
  if (params?.from || params?.to) {
    events = events.filter((e) => {
      if (!e.decisionAt) return false;
      const decisionDate = new Date(e.decisionAt);
      if (params.from && decisionDate < new Date(params.from)) return false;
      if (params.to) {
        const toDate = new Date(params.to);
        toDate.setHours(23, 59, 59, 999);
        if (decisionDate > toDate) return false;
      }
      return true;
    });
  }

  return events
    .sort((a, b) => {
      const dateA = a.decisionAt ? new Date(a.decisionAt).getTime() : 0;
      const dateB = b.decisionAt ? new Date(b.decisionAt).getTime() : 0;
      return dateB - dateA;
    })
    .map((e) => ({
      activityId: e.id,
      title: e.titleEn || e.titleAr || e.title || 'Event',
      providerName: e.organizerEn || e.organizerAr || 'Organizer',
      decision: e.status === 'approved' ? ('approved' as const) : ('rejected' as const),
      decidedAt: e.decisionAt!,
      reasonCode: e.rejectionCategory,
    }));
}

export function getRegulatorMonitoringData(): Array<{
  activityId: string;
  title: string;
  providerName: string;
  endedAt: string;
  attendanceRecords: { status: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue'; dueAt?: string };
  hoursRegistration: { status: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue'; dueAt?: string };
  exceptionRate: number;
}> {
  const current = getState();
  const now = new Date();
  const endedEvents = current.events.filter((e) => e.status === 'published' || e.status === 'closed');

  return endedEvents
    .map((e) => {
      if (!e.date) return null;
      const eventDate = new Date(e.date);
      const endedAt = eventDate.toISOString();

      const attendanceDueDate = new Date(eventDate);
      attendanceDueDate.setDate(attendanceDueDate.getDate() + 21);

      const hoursDueDate = new Date(eventDate);
      hoursDueDate.setDate(hoursDueDate.getDate() + 30);

      const daysSinceEnd = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);

      let attendanceStatus: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue' = 'not_started';
      if (now > attendanceDueDate && daysSinceEnd > 25) {
        attendanceStatus = 'overdue';
      } else if (daysSinceEnd > 21) {
        attendanceStatus = 'submitted';
      } else if (daysSinceEnd > 10) {
        attendanceStatus = 'in_progress';
      }

      let hoursStatus: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'returned_for_fix' | 'overdue' = 'not_started';
      if (now > hoursDueDate && daysSinceEnd > 35) {
        hoursStatus = 'overdue';
      } else if (daysSinceEnd > 30) {
        hoursStatus = 'submitted';
      } else if (daysSinceEnd > 15) {
        hoursStatus = 'in_progress';
      }

      // Deterministic exception rate based on event ID hash (0-10%)
      const eventIdHash = e.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const exceptionRate = eventIdHash % 11; // 0-10%

      return {
        activityId: e.id,
        title: e.titleEn || e.titleAr || e.title || 'Event',
        providerName: e.organizerEn || e.organizerAr || 'Organizer',
        endedAt,
        attendanceRecords: {
          status: attendanceStatus,
          dueAt: attendanceDueDate.toISOString(),
        },
        hoursRegistration: {
          status: hoursStatus,
          dueAt: hoursDueDate.toISOString(),
        },
        exceptionRate,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
}

export function getRegulatorAnalyticsData(params?: {
  from?: string;
  to?: string;
  groupBy?: string;
  metric?: string;
}): {
  summary: {
    totalActivities: number;
    approvedRate: number;
    avgDecisionTimeDays: number;
    overdueAttendanceRecords: number;
    overdueHoursRegistration: number;
  };
  breakdown: Array<{ key: string; value: number }>;
} {
  const current = getState();
  let events = [...current.events];

  // Filter by date range if provided
  if (params?.from || params?.to) {
    events = events.filter((e) => {
      const eventDate = e.date ? new Date(e.date) : null;
      if (!eventDate) return false;
      if (params.from && eventDate < new Date(params.from)) return false;
      if (params.to) {
        const toDate = new Date(params.to);
        toDate.setHours(23, 59, 59, 999);
        if (eventDate > toDate) return false;
      }
      return true;
    });
  }

  const totalActivities = events.length;
  const approved = events.filter((e) => e.status === 'approved').length;
  const approvedRate = totalActivities > 0 ? Math.round((approved / totalActivities) * 100) : 0;

  const eventsWithTime = events.filter((e) => e.submittedAt && e.decisionAt);
  const decisionTimes = eventsWithTime.map((e) => {
    const submitted = new Date(e.submittedAt!).getTime();
    const decided = new Date(e.decisionAt!).getTime();
    return (decided - submitted) / (1000 * 60 * 60 * 24);
  });
  const avgDecisionTimeDays =
    decisionTimes.length > 0 ? decisionTimes.reduce((a, b) => a + b, 0) / decisionTimes.length : 0;

  const now = new Date();
  const endedEvents = events.filter((e) => e.status === 'published' || e.status === 'closed');
  let overdueAttendanceRecords = 0;
  let overdueHoursRegistration = 0;

  endedEvents.forEach((e) => {
    if (!e.date) return;
    const eventDate = new Date(e.date);
    const attendanceDue = new Date(eventDate);
    attendanceDue.setDate(attendanceDue.getDate() + 21);
    if (now > attendanceDue) overdueAttendanceRecords++;

    const hoursDue = new Date(eventDate);
    hoursDue.setDate(hoursDue.getDate() + 30);
    if (now > hoursDue) overdueHoursRegistration++;
  });

  // Build breakdown based on groupBy (default to city if not specified)
  let breakdown: Array<{ key: string; value: number }> = [];
  const groupByKey = params?.groupBy || 'city'; // Default to city for non-empty breakdown
  
  if (groupByKey === 'city') {
    const byCity = events.reduce((acc, e) => {
      const city = e.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    breakdown = Object.entries(byCity).map(([key, value]) => ({ key, value }));
  } else if (groupByKey === 'specialty') {
    const bySpecialty = events.reduce((acc, e) => {
      const spec = e.specialty || 'General';
      acc[spec] = (acc[spec] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    breakdown = Object.entries(bySpecialty).map(([key, value]) => ({ key, value }));
  } else if (groupByKey === 'provider') {
    const byProvider = events.reduce((acc, e) => {
      const provider = e.organizerEn || e.organizerAr || 'Unknown';
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    breakdown = Object.entries(byProvider).map(([key, value]) => ({ key, value }));
  }

  return {
    summary: {
      totalActivities,
      approvedRate,
      avgDecisionTimeDays,
      overdueAttendanceRecords,
      overdueHoursRegistration,
    },
    breakdown,
  };
}
