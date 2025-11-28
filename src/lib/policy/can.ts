/**
 * Policy Engine - RBAC + State Gating
 * Source: Docs/RBAC.md
 */

import type { ActionId } from '@/types/actions';
import type { PolicyContext, PolicyResult, Role } from './context';

export function can(role: Role, action: ActionId, ctx: PolicyContext): PolicyResult {
  if (ctx.role !== role) {
    return { allowed: false, reason: `Role mismatch: expected ${role}, got ${ctx.role}` };
  }

  switch (action) {
    // HCP
    case 'hcp.event.read':
      return allowIf(ctx.event?.status === 'published', 'HCP can read published events only');
    case 'ticket.register':
      return allowIf(ctx.event?.status === 'published', 'HCP can register for published events');
    case 'hcp.review': {
      const attended = ctx.ticket?.status === 'attended';
      const owner = !ctx.userId || ctx.ticket?.hcpId === ctx.userId;
      return allowIf(attended && owner, 'Reviews allowed only for attended tickets by the same HCP');
    }
    case 'ticket.cancel':
      return { allowed: role === 'hcp', reason: 'HCP can cancel own tickets' };

    // Organizer
    case 'activity.create':
    case 'activity.edit_content':
    case 'activity.edit_logistics':
    case 'activity.submit_for_accreditation':
    case 'activity.respond_to_rejection':
    case 'activity.complete':
    case 'activity.close':
      return { allowed: role === 'organizer', reason: 'Organizer activity actions allowed' };
    case 'activity.publish':
    case 'organizer.event.publish': {
      const approved = ctx.event?.status === 'approved';
      const owns = !ctx.event?.organizerId || ctx.event.organizerId === ctx.userId;
      return allowIf(role === 'organizer' && approved && owns, 'Organizer can publish approved events they own');
    }
    case 'assignment.create':
    case 'assignment.cancel':
      return { allowed: role === 'organizer', reason: 'Organizer can manage assignments' };

    // Event Manager
    case 'assignment.accept':
    case 'assignment.decline': {
      const pending = ctx.assignment?.status === 'pending';
      return allowIf(role === 'event_manager' && pending, 'Event Manager can respond to pending assignments');
    }
    case 'attendance.checkin':
    case 'attendance.finalize': {
      const assigned = ctx.assignment?.status === 'accepted';
      const matches = ctx.event?.eventManagerId ? ctx.assignment?.eventManagerId === ctx.event.eventManagerId : false;
      const published = ctx.event?.status === 'published';
      return allowIf(role === 'event_manager' && assigned && matches && published, 'Event Manager can manage attendance on assigned published events');
    }
    case 'certificate.issue': {
      const finalized = ctx.attendance?.finalized === true;
      const accredited = ctx.event?.status === 'approved';
      return allowIf(role === 'event_manager' && finalized && accredited, 'Certificates require finalized attendance and accredited event');
    }

    // Vendor
    case 'sponsorship.create_packages':
    case 'sponsorship.upload_assets':
    case 'sponsorship.submit_disclosure':
    case 'sponsorship.approve_for_display':
      return { allowed: role === 'vendor', reason: 'Vendor sponsorship actions allowed' };
    case 'sponsorship.purchase': {
      const published = ctx.event?.status === 'published';
      return allowIf(role === 'vendor' && published, 'Sponsorship purchase requires published event');
    }

    // Regulator
    case 'regulator.accreditation.set_status':
      return { allowed: role === 'regulator', reason: 'Regulator can set accreditation status' };
    case 'compliance.submit_attendance_records':
    case 'compliance.submit_hours_registration':
    case 'compliance.request_extension':
      return { allowed: role === 'regulator', reason: 'Regulator can handle compliance submissions' };
    case 'audit.view':
    case 'audit.export_pack':
      return { allowed: role === 'regulator', reason: 'Regulator can view/export audits' };

    // Org
    case 'org.manage_users':
    case 'org.manage_settings':
      return { allowed: role === 'organizer', reason: 'Organizer can manage org settings' };

    default:
      return { allowed: false, reason: 'Unknown action' };
  }
}

function allowIf(condition: boolean | undefined, reason: string): PolicyResult {
  return condition ? { allowed: true, reason } : { allowed: false, reason };
}
