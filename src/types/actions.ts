/**
 * Action catalog for Mutqin CPD Ecosystem
 * Source of Truth: Docs/RBAC.md
 *
 * Stable string IDs for permissions and audit logging.
 */

export type OrgAction =
  | 'org.manage_users'
  | 'org.manage_settings';

export type ActivityAction =
  | 'activity.create'
  | 'activity.edit_content'
  | 'activity.edit_logistics'
  | 'activity.submit_for_accreditation'
  | 'activity.respond_to_rejection'
  | 'activity.publish'
  | 'activity.complete'
  | 'activity.close';

export type AssignmentAction =
  | 'assignment.create'
  | 'assignment.cancel'
  | 'assignment.accept'
  | 'assignment.decline';

export type TicketAction =
  | 'ticket.register'
  | 'ticket.cancel';

export type AttendanceAction =
  | 'attendance.checkin'
  | 'attendance.override_manual'
  | 'attendance.finalize';

export type ComplianceAction =
  | 'compliance.submit_attendance_records'
  | 'compliance.submit_hours_registration'
  | 'compliance.request_extension';

export type SponsorshipAction =
  | 'sponsorship.create_packages'
  | 'sponsorship.purchase'
  | 'sponsorship.upload_assets'
  | 'sponsorship.submit_disclosure'
  | 'sponsorship.approve_for_display';

export type AuditAction =
  | 'audit.view'
  | 'audit.export_pack';

export type HCPAction =
  | 'hcp.event.read'
  | 'hcp.review';

export type CertificateAction =
  | 'certificate.issue';

export type RegulatorAction =
  | 'regulator.accreditation.set_status';

export type OrganizerAction =
  | 'organizer.event.publish';

export type ActionId =
  | OrgAction
  | ActivityAction
  | AssignmentAction
  | TicketAction
  | AttendanceAction
  | ComplianceAction
  | SponsorshipAction
  | AuditAction
  | HCPAction
  | CertificateAction
  | RegulatorAction
  | OrganizerAction;
