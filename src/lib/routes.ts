/**
 * Route Constants
 * 
 * Centralized route definitions for all dashboard routes.
 * All routes must match IA-SITEMAP.md and L2_DETAIL_PAGES.md.
 */

// Persona base routes
export const PERSONA_ROUTES = {
  ORGANIZER: '/dashboard/organizer',
  EVENT_MANAGER: '/dashboard/event-manager',
  HCP: '/dashboard/hcp',
  VENDOR: '/dashboard/vendor',
  REGULATOR: '/dashboard/regulator',
} as const;

// Valid tab keys per persona (from IA-SITEMAP.md)
export const PERSONA_TABS = {
  ORGANIZER: ['overview', 'activities', 'accreditation', 'execution', 'sponsors'] as const,
  EVENT_MANAGER: ['assignments', 'checkin', 'attendance', 'certificates', 'handover'] as const,
  HCP: ['discover', 'registrations', 'files', 'credits', 'certs_reviews'] as const,
  VENDOR: ['marketplace', 'purchases', 'assets', 'performance', 'billing'] as const,
  REGULATOR: ['review_queue', 'decision_workspace', 'compliance_monitor', 'audit_risk', 'analytics'] as const,
} as const;

// Default tabs per persona (from IA-SITEMAP.md)
export const DEFAULT_TABS = {
  ORGANIZER: 'overview',
  EVENT_MANAGER: 'assignments',
  HCP: 'discover',
  VENDOR: 'marketplace',
  REGULATOR: 'review_queue',
} as const;

// L2 Route patterns (from L2_DETAIL_PAGES.md)
export const L2_ROUTES = {
  // Organizer (7 routes)
  ORGANIZER_EVENT: '/dashboard/organizer/events/[eventId]',
  ORGANIZER_EVENT_EDIT: '/dashboard/organizer/events/[eventId]/edit',
  ORGANIZER_EVENT_REGISTRATIONS: '/dashboard/organizer/events/[eventId]/registrations',
  ORGANIZER_EVENT_ATTENDANCE: '/dashboard/organizer/events/[eventId]/attendance',
  ORGANIZER_EVENT_CERTIFICATES: '/dashboard/organizer/events/[eventId]/certificates',
  ORGANIZER_EVENT_SPONSORS: '/dashboard/organizer/events/[eventId]/sponsors',
  ORGANIZER_EVENT_ASSIGN: '/dashboard/organizer/events/[eventId]/assign',
  
  // Event Manager (4 routes)
  EVENT_MANAGER_EVENT: '/dashboard/event-manager/events/[eventId]',
  EVENT_MANAGER_EVENT_CHECKIN: '/dashboard/event-manager/events/[eventId]/checkin',
  EVENT_MANAGER_EVENT_ATTENDANCE: '/dashboard/event-manager/events/[eventId]/attendance',
  EVENT_MANAGER_EVENT_HANDOVER: '/dashboard/event-manager/events/[eventId]/handover',
  
  // HCP (3 routes)
  HCP_EVENT: '/dashboard/hcp/events/[eventId]',
  HCP_TICKET: '/dashboard/hcp/tickets/[ticketId]',
  HCP_CERTIFICATE: '/dashboard/hcp/certificates/[certificateId]',
  
  // Vendor (3 routes)
  VENDOR_EVENT: '/dashboard/vendor/events/[eventId]',
  VENDOR_SPONSORSHIP: '/dashboard/vendor/sponsorships/[sponsorshipId]',
  VENDOR_CAMPAIGN: '/dashboard/vendor/campaigns/[campaignId]',
  
  // Regulator (4 routes)
  REGULATOR_APPLICATION: '/dashboard/regulator/applications/[applicationId]',
  REGULATOR_APPLICATION_DECISION: '/dashboard/regulator/applications/[applicationId]/decision',
  REGULATOR_APPLICATION_CHECKLIST: '/dashboard/regulator/applications/[applicationId]/checklist',
  REGULATOR_PROVIDER: '/dashboard/regulator/providers/[providerId]',
} as const;

// Helper functions to build routes with IDs
export const buildRoute = {
  organizerEvent: (eventId: string, view?: 'summary' | 'execution' | 'certificates' | 'sponsors') => {
    const base = `/dashboard/organizer/events/${eventId}`;
    return view ? `${base}?view=${view}` : base;
  },
  organizerEventEdit: (eventId: string) => `/dashboard/organizer/events/${eventId}/edit`,
  organizerEventRegistrations: (eventId: string) => `/dashboard/organizer/events/${eventId}/registrations`,
  organizerEventAttendance: (eventId: string) => `/dashboard/organizer/events/${eventId}?view=execution`,
  organizerEventCertificates: (eventId: string) => `/dashboard/organizer/events/${eventId}?view=certificates`,
  organizerEventSponsors: (eventId: string) => `/dashboard/organizer/events/${eventId}?view=sponsors`,
  organizerEventAssign: (eventId: string) => `/dashboard/organizer/events/${eventId}/assign`,
  
  eventManagerEvent: (eventId: string) => `/dashboard/event-manager/events/${eventId}`,
  eventManagerEventCheckin: (eventId: string) => `/dashboard/event-manager/events/${eventId}/checkin`,
  eventManagerEventAttendance: (eventId: string) => `/dashboard/event-manager/events/${eventId}/attendance`,
  eventManagerEventHandover: (eventId: string) => `/dashboard/event-manager/events/${eventId}/handover`,
  
  hcpEvent: (eventId: string) => `/dashboard/hcp/events/${eventId}`,
  hcpTicket: (ticketId: string) => `/dashboard/hcp/tickets/${ticketId}`,
  hcpCertificate: (certificateId: string) => `/dashboard/hcp/certificates/${certificateId}`,
  
  vendorEvent: (eventId: string) => `/dashboard/vendor/events/${eventId}`,
  vendorSponsorship: (sponsorshipId: string) => `/dashboard/vendor/sponsorships/${sponsorshipId}`,
  vendorCampaign: (campaignId: string) => `/dashboard/vendor/campaigns/${campaignId}`,
  
  regulatorApplication: (applicationId: string) => `/dashboard/regulator/applications/${applicationId}`,
  regulatorApplicationDecision: (applicationId: string) => `/dashboard/regulator/applications/${applicationId}/decision`,
  regulatorApplicationChecklist: (applicationId: string) => `/dashboard/regulator/applications/${applicationId}/checklist`,
  regulatorProvider: (providerId: string) => `/dashboard/regulator/providers/${providerId}`,
  
  // L1 routes with tabs
  organizerTab: (tab: string) => `/dashboard/organizer?tab=${tab}`,
  eventManagerTab: (tab: string) => `/dashboard/event-manager?tab=${tab}`,
  hcpTab: (tab: string) => `/dashboard/hcp?tab=${tab}`,
  vendorTab: (tab: string) => `/dashboard/vendor?tab=${tab}`,
  regulatorTab: (tab: string) => `/dashboard/regulator?tab=${tab}`,
};

// Route validation patterns
export const L2_ROUTE_PATTERNS = [
  // Organizer patterns
  /^\/dashboard\/organizer\/events\/[^/]+$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/edit$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/registrations$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/attendance$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/certificates$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/sponsors$/,
  /^\/dashboard\/organizer\/events\/[^/]+\/assign$/,
  
  // Event Manager patterns
  /^\/dashboard\/event-manager\/events\/[^/]+$/,
  /^\/dashboard\/event-manager\/events\/[^/]+\/checkin$/,
  /^\/dashboard\/event-manager\/events\/[^/]+\/attendance$/,
  /^\/dashboard\/event-manager\/events\/[^/]+\/handover$/,
  
  // HCP patterns
  /^\/dashboard\/hcp\/events\/[^/]+$/,
  /^\/dashboard\/hcp\/tickets\/[^/]+$/,
  /^\/dashboard\/hcp\/certificates\/[^/]+$/,
  
  // Vendor patterns
  /^\/dashboard\/vendor\/events\/[^/]+$/,
  /^\/dashboard\/vendor\/sponsorships\/[^/]+$/,
  /^\/dashboard\/vendor\/campaigns\/[^/]+$/,
  
  // Regulator patterns
  /^\/dashboard\/regulator\/applications\/[^/]+$/,
  /^\/dashboard\/regulator\/applications\/[^/]+\/decision$/,
  /^\/dashboard\/regulator\/applications\/[^/]+\/checklist$/,
  /^\/dashboard\/regulator\/providers\/[^/]+$/,
] as const;

// L1 route patterns (persona base routes)
export const L1_ROUTE_PATTERNS = [
  /^\/dashboard\/organizer(\?tab=[^&]+)?$/,
  /^\/dashboard\/event-manager(\?tab=[^&]+)?$/,
  /^\/dashboard\/hcp(\?tab=[^&]+)?$/,
  /^\/dashboard\/vendor(\?tab=[^&]+)?$/,
  /^\/dashboard\/regulator(\?tab=[^&]+)?$/,
] as const;

/**
 * Validates if a path is a valid L1 dashboard route
 */
export function isValidL1Route(path: string): boolean {
  return L1_ROUTE_PATTERNS.some(pattern => pattern.test(path));
}

/**
 * Validates if a path is a valid L2 detail route
 */
export function isValidL2Route(path: string): boolean {
  return L2_ROUTE_PATTERNS.some(pattern => pattern.test(path));
}

/**
 * Validates if a tab key is valid for a given persona
 */
export function isValidTab(persona: keyof typeof PERSONA_TABS, tab: string): boolean {
  return (PERSONA_TABS[persona] as readonly string[]).includes(tab);
}

/**
 * Gets the default tab for a persona
 */
export function getDefaultTab(persona: keyof typeof DEFAULT_TABS): string {
  return DEFAULT_TABS[persona];
}
