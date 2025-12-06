// Event translations helper
import { Event } from './mockData';

export function getEventTitle(event: Event, language: 'ar' | 'en'): string {
    if (language === 'ar') {
        return event.titleAr || event.titleEn || '';
    }
    // For English, prefer titleEn, but if missing and titleAr exists, show a fallback
    return event.titleEn || (event.titleAr ? 'Event' : '');
}

export function getEventOrganizer(event: Event, language: 'ar' | 'en'): string {
    return language === 'ar' ? event.organizerAr : event.organizerEn;
}

export function getEventLocation(event: Event, language: 'ar' | 'en'): string {
    return language === 'ar' ? event.locationAr : event.locationEn;
}

export function getEventDescription(event: Event, language: 'ar' | 'en'): string {
    return language === 'ar' ? event.descriptionAr : event.descriptionEn;
}

export function formatDate(dateString: string, language: 'ar' | 'en'): string {
    const date = new Date(dateString);
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsAr = ['', '', '', '', '', '', '', '', '', '', '', ''];
    
    if (language === 'ar') {
        return `${date.getDate()} ${monthsAr[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${monthsEn[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
