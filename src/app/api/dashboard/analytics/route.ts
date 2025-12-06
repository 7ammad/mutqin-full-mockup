import { NextResponse } from 'next/server';
import { getState } from '@/context/demoStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get('persona');
    const userId = searchParams.get('userId');

    if (!persona || !userId) {
      return NextResponse.json(
        { ok: false, error: 'persona and userId are required' },
        { status: 400 }
      );
    }

    const state = getState();

    // Calculate analytics based on persona
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
          averageEventSize: 0, // Calculate from tickets
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
          totalAttendees: 0, // Calculate from tickets
          averageAttendanceRate: 0, // Calculate from attendance records
        };
        break;

      case 'VENDOR':
        const vendorSponsorships = state.sponsorships.filter((s) => s.vendorId === userId);
        analytics = {
          totalSponsorships: vendorSponsorships.length,
          activeSponsorships: vendorSponsorships.length,
          totalInvestment: 0, // Mock value
          eventsSponsored: vendorSponsorships.length,
          reach: 0, // Mock value
          impressions: 0, // Mock value
        };
        break;

      case 'REGULATOR':
        analytics = {
          queueSize: state.events.filter((e) => e.status === 'pending_review').length,
          totalReviewed: state.events.filter((e) => e.decisionAt).length,
          approvalRate: 0, // Calculate
          averageReviewTime: 0, // Calculate
          totalEvents: state.events.length,
          totalCMEHours: state.events.reduce((sum, e) => sum + (e.cme_hours || 0), 0),
        };
        break;
    }

    return NextResponse.json({ ok: true, analytics });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

