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

    // Calculate KPIs based on persona
    let kpis: Array<{
      id: string;
      title: string;
      value: string | number;
      subtitle?: string;
      trend?: {
        value: number;
        label: string;
        isPositive: boolean;
      };
      color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    }> = [];

    switch (persona) {
      case 'ORGANIZER':
        const organizerEvents = state.events.filter((e) => e.organizerId === userId);
        kpis = [
          {
            id: 'total-events',
            title: 'Total Events',
            value: organizerEvents.length,
            color: 'blue',
          },
          {
            id: 'pending-approval',
            title: 'Pending Approval',
            value: organizerEvents.filter((e) => e.status === 'pending_review').length,
            color: 'orange',
          },
          {
            id: 'published',
            title: 'Published',
            value: organizerEvents.filter((e) => e.status === 'published').length,
            color: 'green',
          },
          {
            id: 'total-hours',
            title: 'Total CME Hours',
            value: organizerEvents.reduce((sum, e) => sum + (e.cme_hours || 0), 0),
            subtitle: 'Accredited',
            color: 'purple',
          },
        ];
        break;

      case 'HCP':
        const hcpTickets = state.tickets.filter((t) => t.hcpId === userId);
        const hcpCertificates = state.certificates.filter((c) => c.hcpId === userId);
        kpis = [
          {
            id: 'registrations',
            title: 'Registrations',
            value: hcpTickets.length,
            color: 'blue',
          },
          {
            id: 'cme-hours',
            title: 'CME Hours',
            value: hcpCertificates.reduce((sum, c) => sum + (c.cme_hours || 0), 0),
            subtitle: 'Earned',
            color: 'green',
          },
          {
            id: 'certificates',
            title: 'Certificates',
            value: hcpCertificates.length,
            color: 'purple',
          },
          {
            id: 'upcoming',
            title: 'Upcoming',
            value: hcpTickets.filter((t) => {
              const event = state.events.find((e) => e.id === t.eventId);
              return event && event.status === 'published' && t.status === 'confirmed';
            }).length,
            color: 'orange',
          },
        ];
        break;

      case 'EVENT_MANAGER':
        const managerAssignments = state.assignments.filter((a) => a.eventManagerId === userId);
        kpis = [
          {
            id: 'assignments',
            title: 'Assignments',
            value: managerAssignments.length,
            color: 'blue',
          },
          {
            id: 'accepted',
            title: 'Accepted',
            value: managerAssignments.filter((a) => a.status === 'accepted').length,
            color: 'green',
          },
          {
            id: 'pending',
            title: 'Pending',
            value: managerAssignments.filter((a) => a.status === 'pending').length,
            color: 'orange',
          },
          {
            id: 'events-managed',
            title: 'Events Managed',
            value: managerAssignments.filter((a) => a.status === 'accepted').length,
            color: 'purple',
          },
        ];
        break;

      case 'VENDOR':
        const vendorSponsorships = state.sponsorships.filter((s) => s.vendorId === userId);
        kpis = [
          {
            id: 'sponsorships',
            title: 'Sponsorships',
            value: vendorSponsorships.length,
            color: 'blue',
          },
          {
            id: 'active',
            title: 'Active',
            value: vendorSponsorships.length,
            color: 'green',
          },
          {
            id: 'events',
            title: 'Events Sponsored',
            value: vendorSponsorships.length,
            color: 'purple',
          },
          {
            id: 'reach',
            title: 'Reach',
            value: '12.5K',
            subtitle: 'Estimated',
            color: 'orange',
          },
        ];
        break;

      case 'REGULATOR':
        kpis = [
          {
            id: 'queue',
            title: 'Queue',
            value: state.events.filter((e) => e.status === 'pending_review').length,
            color: 'orange',
          },
          {
            id: 'reviewed',
            title: 'Reviewed',
            value: state.events.filter((e) => e.decisionAt).length,
            color: 'blue',
          },
          {
            id: 'total-events',
            title: 'Total Events',
            value: state.events.length,
            color: 'purple',
          },
          {
            id: 'cme-hours',
            title: 'CME Hours',
            value: state.events.reduce((sum, e) => sum + (e.cme_hours || 0), 0),
            subtitle: 'Accredited',
            color: 'green',
          },
        ];
        break;
    }

    return NextResponse.json({ ok: true, kpis });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

