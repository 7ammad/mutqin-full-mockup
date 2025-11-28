# RBAC (Source of Truth)

Roles:
- HCP
- Organizer
- Event Manager
- Vendor
- Regulator

Canonical Action IDs (must match src/types/actions.ts):
- org.manage_users
- org.manage_settings
- activity.create
- activity.edit_content
- activity.edit_logistics
- activity.submit_for_accreditation
- activity.respond_to_rejection
- activity.publish
- activity.complete
- activity.close
- assignment.create
- assignment.cancel
- assignment.accept
- assignment.decline
- ticket.register
- ticket.cancel
- attendance.checkin
- attendance.override_manual
- attendance.finalize
- compliance.submit_attendance_records
- compliance.submit_hours_registration
- compliance.request_extension
- sponsorship.create_packages
- sponsorship.purchase
- sponsorship.upload_assets
- sponsorship.submit_disclosure
- sponsorship.approve_for_display
- audit.view
- audit.export_pack
- hcp.event.read
- hcp.review
- certificate.issue
- regulator.accreditation.set_status
- organizer.event.publish

Gates (state/visibility):
- HCP visibility: events must be published for hcp.event.read and ticket.register.
- Assignments: only accepted assignments; EM must be assigned to manage attendance.
- Reviews: only attended tickets (checked in) by the same HCP.
- Certificates: issued only for finalized attendance and approved/accredited event.
- Sponsorship purchase: only when event is published.
- Publish: organizer can publish only approved event they own.
- Regulator accreditation status: only when event.status is pending_review.
