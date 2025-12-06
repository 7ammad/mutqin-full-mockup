/**
 * Centralized Data Access Layer
 * 
 * This layer provides deterministic demo data without requiring MSW or HTTP calls.
 * Components should use this instead of calling /api/... directly.
 * 
 * Later, we can switch this to real API calls by changing the implementation.
 */

import {
  getState,
  getHcpSummary as getHcpSummaryFromStore,
  getRegulatorQueue as getRegulatorQueueFromStore,
  getOrganizerEvents as getOrganizerEventsFromStore,
  getEventManagerAssignments as getEventManagerAssignmentsFromStore,
  getVendorSponsorships as getVendorSponsorshipsFromStore,
  getRegulatorQueueData,
  getRegulatorDecisionsData,
  getRegulatorMonitoringData,
  getRegulatorAnalyticsData,
  getEventById,
  getTicketById,
  getCertificateById,
  getSponsorshipById,
  getAssignmentById,
} from '@/context/demoStore';

import type {
  GetAllEventsResponse,
  GetHcpSummaryRequest,
  GetHcpSummaryResponse,
  GetRegulatorQueueResponse,
  GetOrganizerEventsRequest,
  GetOrganizerEventsResponse,
  GetEventManagerAssignmentsRequest,
  GetEventManagerAssignmentsResponse,
  GetVendorSponsorshipsRequest,
  GetVendorSponsorshipsResponse,
  GetRegulatorQueueReadResponse,
  GetRegulatorDecisionsReadResponse,
  GetRegulatorMonitoringReadResponse,
  GetRegulatorAnalyticsReadResponse,
  GetEventByIdRequest,
  GetEventByIdResponse,
  GetTicketByIdRequest,
  GetTicketByIdResponse,
  GetCertificateByIdRequest,
  GetCertificateByIdResponse,
  GetSponsorshipByIdRequest,
  GetSponsorshipByIdResponse,
  GetAssignmentByIdRequest,
  GetAssignmentByIdResponse,
} from '../api/types';

/**
 * Data access functions that return the same types as the API client
 * but use local demo store instead of HTTP calls.
 */
export const data = {
  /**
   * Get all events (for regulator view)
   */
  getAllEvents: async (): Promise<GetAllEventsResponse> => {
    const state = getState();
    return {
      ok: true,
      events: state.events,
    };
  },

  /**
   * Get regulator accreditation queue
   */
  getRegulatorQueue: async (): Promise<GetRegulatorQueueResponse> => {
    const events = getRegulatorQueueFromStore();
    return {
      ok: true,
      events,
    };
  },

  /**
   * Get HCP summary (tickets, certificates, reviews)
   */
  getHcpSummary: async (params: GetHcpSummaryRequest): Promise<GetHcpSummaryResponse> => {
    const summary = getHcpSummaryFromStore(params.hcpId);
    return {
      ok: true,
      ...summary,
    };
  },

  /**
   * Get organizer events
   */
  getOrganizerEvents: async (params: GetOrganizerEventsRequest): Promise<GetOrganizerEventsResponse> => {
    const events = getOrganizerEventsFromStore(params.organizerId);
    return {
      ok: true,
      events,
    };
  },

  /**
   * Get event manager assignments
   */
  getEventManagerAssignments: async (
    params: GetEventManagerAssignmentsRequest
  ): Promise<GetEventManagerAssignmentsResponse> => {
    const assignments = getEventManagerAssignmentsFromStore(params.eventManagerId);
    return {
      ok: true,
      assignments,
    };
  },

  /**
   * Get vendor sponsorships
   */
  getVendorSponsorships: async (params: GetVendorSponsorshipsRequest): Promise<GetVendorSponsorshipsResponse> => {
    const sponsorships = getVendorSponsorshipsFromStore(params.vendorId);
    return {
      ok: true,
      sponsorships,
    };
  },

  /**
   * Regulator read endpoints
   */
  getRegulatorQueueRead: async (params?: {
    status?: string;
    q?: string;
    city?: string;
    specialty?: string;
    page?: number;
  }): Promise<GetRegulatorQueueReadResponse> => {
    const queueData = getRegulatorQueueData(params);
    return {
      ok: true,
      data: queueData,
    };
  },

  getRegulatorDecisionsRead: async (params?: {
    decision?: 'approved' | 'rejected' | 'all';
    from?: string;
    to?: string;
  }): Promise<GetRegulatorDecisionsReadResponse> => {
    const items = getRegulatorDecisionsData(params);
    return {
      ok: true,
      data: { items },
    };
  },

  getRegulatorMonitoringRead: async (): Promise<GetRegulatorMonitoringReadResponse> => {
    const compliance = getRegulatorMonitoringData();
    return {
      ok: true,
      data: { compliance },
    };
  },

  getRegulatorAnalyticsRead: async (params?: {
    from?: string;
    to?: string;
    groupBy?: string;
    metric?: string;
  }): Promise<GetRegulatorAnalyticsReadResponse> => {
    const analyticsData = getRegulatorAnalyticsData(params);
    return {
      ok: true,
      data: analyticsData,
    };
  },

  /**
   * Single entity getters
   */
  getEventById: async (params: GetEventByIdRequest): Promise<GetEventByIdResponse> => {
    const event = getEventById(params.eventId);
    if (!event) {
      throw new Error(`Event not found: ${params.eventId}`);
    }
    return {
      ok: true,
      event,
    };
  },

  getTicketById: async (params: GetTicketByIdRequest): Promise<GetTicketByIdResponse> => {
    const ticket = getTicketById(params.ticketId);
    if (!ticket) {
      throw new Error(`Ticket not found: ${params.ticketId}`);
    }
    return {
      ok: true,
      ticket,
    };
  },

  getCertificateById: async (params: GetCertificateByIdRequest): Promise<GetCertificateByIdResponse> => {
    const certificate = getCertificateById(params.certificateId);
    if (!certificate) {
      throw new Error(`Certificate not found: ${params.certificateId}`);
    }
    return {
      ok: true,
      certificate,
    };
  },

  getSponsorshipById: async (params: GetSponsorshipByIdRequest): Promise<GetSponsorshipByIdResponse> => {
    const sponsorship = getSponsorshipById(params.sponsorshipId);
    if (!sponsorship) {
      throw new Error(`Sponsorship not found: ${params.sponsorshipId}`);
    }
    return {
      ok: true,
      sponsorship,
    };
  },

  getAssignmentById: async (params: GetAssignmentByIdRequest): Promise<GetAssignmentByIdResponse> => {
    const assignment = getAssignmentById(params.assignmentId);
    if (!assignment) {
      throw new Error(`Assignment not found: ${params.assignmentId}`);
    }
    return {
      ok: true,
      assignment,
    };
  },
};

