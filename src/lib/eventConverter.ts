import type { DemoEvent } from '@/context/demoSeed';
import type { Event } from '@/lib/mockData';
import { convertDemoStatusToEventStatus } from './eventStatusConverter';

/**
 * Converts DemoEvent to Event format
 */
export function convertDemoEventToEvent(demoEvent: DemoEvent): Event {
  // Helper to detect if a string is likely Arabic (contains Arabic characters)
  const isArabic = (str: string): boolean => {
    return /[\u0600-\u06FF]/.test(str);
  };

  // For titleEn: only use title if it's not Arabic, otherwise use empty string or a fallback
  const titleEn = demoEvent.titleEn || (!isArabic(demoEvent.title || '') ? demoEvent.title : '');
  // For titleAr: prefer titleAr, fallback to title if it's Arabic, otherwise empty
  const titleAr = demoEvent.titleAr || (isArabic(demoEvent.title || '') ? demoEvent.title : '');

  return {
    id: demoEvent.id,
    titleEn: titleEn || '',
    titleAr: titleAr || '',
    descriptionEn: demoEvent.descriptionEn || '',
    descriptionAr: demoEvent.descriptionAr || '',
    date: demoEvent.date || new Date().toISOString(),
    locationEn: demoEvent.locationEn || '',
    locationAr: demoEvent.locationAr || '',
    cme_hours: demoEvent.cme_hours || 0,
    status: convertDemoStatusToEventStatus(demoEvent.status),
    // organizerId removed - Event type doesn't have it
    specialty: demoEvent.specialty || '',
    organizerAr: demoEvent.organizerAr || '',
    organizerEn: demoEvent.organizerEn || '',
    is_sponsored: demoEvent.is_sponsored || false,
    needs_sponsorship: demoEvent.needs_sponsorship || false,
    sfda_license: demoEvent.sfda_license,
  };
}

