/**
 * Policy context types
 * Source: Docs/RBAC.md
 */

import type { ActionId } from '@/types/actions';

export type Role = 'hcp' | 'organizer' | 'event_manager' | 'vendor' | 'regulator';

/**
 * Minimal entity state used for policy decisions
 */
export interface PolicyContext {
  role: Role;
  userId?: string;
  event?: {
    status: 'draft' | 'pending_review' | 'approved' | 'published' | 'closed';
    organizerId?: string;
    eventManagerId?: string;
  };
  assignment?: {
    status: 'pending' | 'accepted' | 'declined';
    eventManagerId?: string;
  };
  ticket?: {
    status: 'confirmed' | 'attended';
    hcpId?: string;
  };
  attendance?: {
    finalized?: boolean;
  };
  action?: ActionId;
}

export interface PolicyResult {
  allowed: boolean;
  reason?: string;
}



