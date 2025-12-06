import type { DemoEvent } from '@/context/demoSeed';
import type { EventStatus } from '@/lib/mockData';

/**
 * Converts DemoEvent status to EventStatus format
 */
export function convertDemoStatusToEventStatus(
  demoStatus: DemoEvent['status']
): EventStatus {
  const statusMap: Record<DemoEvent['status'], EventStatus> = {
    'draft': 'Draft',
    'pending_review': 'Pending Approval',
    'approved': 'Published',
    'published': 'Published',
    'closed': 'Completed',
  };
  
  return statusMap[demoStatus] || 'Draft';
}

/**
 * Converts EventStatus to DemoEvent status format
 */
export function convertEventStatusToDemoStatus(
  eventStatus: EventStatus
): DemoEvent['status'] {
  const statusMap: Record<EventStatus, DemoEvent['status']> = {
    'Draft': 'draft',
    'Pending Approval': 'pending_review',
    'Published': 'approved',
    'Completed': 'closed',
  };
  
  return statusMap[eventStatus] || 'draft';
}

