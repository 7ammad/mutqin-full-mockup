import { describe, it, expect } from 'vitest';
import { can } from '../can';
import type { PolicyContext } from '../context';

const publishedEvent = {
  status: 'published' as const,
  organizerId: 'org1',
  eventManagerId: 'em1',
};

const approvedEvent = {
  status: 'approved' as const,
  organizerId: 'org1',
  eventManagerId: 'em1',
};

describe('policy engine can()', () => {
  it('hcp.event.read: allow only published, deny draft', () => {
    const allowCtx: PolicyContext = { role: 'hcp', event: { ...publishedEvent } };
    const denyCtx: PolicyContext = { role: 'hcp', event: { ...publishedEvent, status: 'draft' } };
    expect(can('hcp', 'hcp.event.read', allowCtx).allowed).toBe(true);
    expect(can('hcp', 'hcp.event.read', denyCtx).allowed).toBe(false);
  });

  it('ticket.register: allow only published', () => {
    const allowCtx: PolicyContext = { role: 'hcp', event: { ...publishedEvent } };
    const denyCtx: PolicyContext = { role: 'hcp', event: { ...publishedEvent, status: 'draft' } };
    expect(can('hcp', 'ticket.register', allowCtx).allowed).toBe(true);
    expect(can('hcp', 'ticket.register', denyCtx).allowed).toBe(false);
  });

  it('hcp.review: allow only attended + same hcpId; deny confirmed; deny different hcpId', () => {
    const allowCtx: PolicyContext = {
      role: 'hcp',
      userId: 'hcp1',
      ticket: { status: 'attended', hcpId: 'hcp1' },
    };
    const denyStatusCtx: PolicyContext = {
      role: 'hcp',
      userId: 'hcp1',
      ticket: { status: 'confirmed', hcpId: 'hcp1' },
    };
    const denyOwnerCtx: PolicyContext = {
      role: 'hcp',
      userId: 'hcp2',
      ticket: { status: 'attended', hcpId: 'hcp1' },
    };
    expect(can('hcp', 'hcp.review', allowCtx).allowed).toBe(true);
    expect(can('hcp', 'hcp.review', denyStatusCtx).allowed).toBe(false);
    expect(can('hcp', 'hcp.review', denyOwnerCtx).allowed).toBe(false);
  });

  it('organizer.event.publish: allow only approved + owned; deny draft; deny wrong owner', () => {
    const allowCtx: PolicyContext = {
      role: 'organizer',
      userId: 'org1',
      event: { ...approvedEvent, organizerId: 'org1' },
    };
    const denyStatusCtx: PolicyContext = {
      role: 'organizer',
      userId: 'org1',
      event: { ...approvedEvent, status: 'draft', organizerId: 'org1' },
    };
    const denyOwnerCtx: PolicyContext = {
      role: 'organizer',
      userId: 'org2',
      event: { ...approvedEvent, organizerId: 'org1' },
    };
    expect(can('organizer', 'organizer.event.publish', allowCtx).allowed).toBe(true);
    expect(can('organizer', 'organizer.event.publish', denyStatusCtx).allowed).toBe(false);
    expect(can('organizer', 'organizer.event.publish', denyOwnerCtx).allowed).toBe(false);
  });

  it('assignment accept/decline: allow EM only if pending; deny accepted/declined', () => {
    const allowCtx: PolicyContext = {
      role: 'event_manager',
      assignment: { status: 'pending', eventManagerId: 'em1' },
    };
    const denyAccepted: PolicyContext = {
      role: 'event_manager',
      assignment: { status: 'accepted', eventManagerId: 'em1' },
    };
    const denyDeclined: PolicyContext = {
      role: 'event_manager',
      assignment: { status: 'declined', eventManagerId: 'em1' },
    };
    expect(can('event_manager', 'assignment.accept', allowCtx).allowed).toBe(true);
    expect(can('event_manager', 'assignment.accept', denyAccepted).allowed).toBe(false);
    expect(can('event_manager', 'assignment.decline', denyDeclined).allowed).toBe(false);
  });

  it('attendance checkin/finalize: allow only published + accepted + assignment bound to EM; deny missing binding', () => {
    const allowCtx: PolicyContext = {
      role: 'event_manager',
      event: { ...publishedEvent, eventManagerId: 'em1' },
      assignment: { status: 'accepted', eventManagerId: 'em1' },
    };
    const denyBinding: PolicyContext = {
      role: 'event_manager',
      event: { ...publishedEvent, eventManagerId: 'em2' },
      assignment: { status: 'accepted', eventManagerId: 'em1' },
    };
    const denyStatus: PolicyContext = {
      role: 'event_manager',
      event: { ...publishedEvent, status: 'draft', eventManagerId: 'em1' },
      assignment: { status: 'accepted', eventManagerId: 'em1' },
    };
    expect(can('event_manager', 'attendance.checkin', allowCtx).allowed).toBe(true);
    expect(can('event_manager', 'attendance.finalize', allowCtx).allowed).toBe(true);
    expect(can('event_manager', 'attendance.checkin', denyBinding).allowed).toBe(false);
    expect(can('event_manager', 'attendance.checkin', denyStatus).allowed).toBe(false);
  });

  it('certificate.issue: allow only attendance.finalized true + event approved; deny otherwise', () => {
    const allowCtx: PolicyContext = {
      role: 'event_manager',
      event: { ...approvedEvent },
      attendance: { finalized: true },
    };
    const denyUnfinalized: PolicyContext = {
      role: 'event_manager',
      event: { ...approvedEvent },
      attendance: { finalized: false },
    };
    const denyUnapproved: PolicyContext = {
      role: 'event_manager',
      event: { ...publishedEvent },
      attendance: { finalized: true },
    };
    expect(can('event_manager', 'certificate.issue', allowCtx).allowed).toBe(true);
    expect(can('event_manager', 'certificate.issue', denyUnfinalized).allowed).toBe(false);
    expect(can('event_manager', 'certificate.issue', denyUnapproved).allowed).toBe(false);
  });

  it('sponsorship.purchase: allow only published; deny draft', () => {
    const allowCtx: PolicyContext = { role: 'vendor', event: { ...publishedEvent } };
    const denyCtx: PolicyContext = { role: 'vendor', event: { ...publishedEvent, status: 'draft' } };
    expect(can('vendor', 'sponsorship.purchase', allowCtx).allowed).toBe(true);
    expect(can('vendor', 'sponsorship.purchase', denyCtx).allowed).toBe(false);
  });

  it('unknown action: deny with "Unknown action"', () => {
    const res = can('hcp', 'unknown.action' as any, { role: 'hcp' });
    expect(res.allowed).toBe(false);
    expect(res.reason).toBe('Unknown action');
  });
});
