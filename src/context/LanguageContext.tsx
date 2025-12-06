"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTranslation } from '@/locales';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isHydrated: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Legacy translations for backward compatibility (dashboard and existing features)
const legacyTranslationsEn: Record<string, string> = {
    // Navbar
    'app.name': 'MedEvent KSA',
    'persona.organizer': 'Organizer',
    'persona.vendor': 'Vendor',
    'persona.regulator': 'Regulator',
    'persona.hcp': 'HCP',
    // Page Titles
    'page.organizer.title': 'Organizer Dashboard',
    'page.organizer.subtitle': 'Manage events and sponsorship requests',
    'page.vendor.title': 'Sponsorship Opportunities',
    'page.vendor.subtitle': 'Browse events seeking funding',
    'page.regulator.title': 'Accreditation Portal (SCFHS)',
    'page.regulator.subtitle': 'Review and approve funded events',
    'page.hcp.title': 'Discover Events',
    'page.hcp.subtitle': 'Register for accredited conferences and workshops',
    'page.hcp.registrations.subtitle': 'All the activities you registered for, from first to latest.',
    'page.hcp.files.subtitle': 'Quick access to your tickets and certificates.',
    'page.eventmanager.title': 'Event Manager Dashboard',
    'page.eventmanager.subtitle': 'Manage event assignments and execution',
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    // Dashboard Stats
    'stats.totalEvents': 'Total Events',
    'stats.registrations': 'Registrations',
    'stats.cmeHours': 'CME Hours',
    'stats.pendingApprovals': 'Pending Approvals',
    'stats.activeEvents': 'Active Events',
    'stats.published': 'Published',
    'stats.underReview': 'Under Review',
    'organizer.createEvent': 'Create New Event',
    'organizer.status.published': 'Published',
    'organizer.status.pendingApproval': 'Pending Approval',
    'organizer.status.draft': 'Draft',
    'organizer.sponsored': 'Sponsored',
    'organizer.needsSponsorship': 'Needs Sponsorship',
    // HCP
    'hcp.discoverEvents': 'Discover Events',
    'hcp.accreditedEvents': 'accredited events available',
    'hcp.searchPlaceholder': 'Search for event, specialty, or location...',
    'hcp.registerNow': 'Register Now',
    'hcp.registered': 'Registered',
    'hcp.registrationSuccess': 'Successfully registered for event',
    'hcp.cmeTracking': 'CME Hours Tracking',
    'hcp.hoursEarned': 'hours earned from',
    'hcp.events': 'events',
    'hcp.annualGoal': 'of annual goal',
    'hcp.goal': 'Goal',
    'hcp.hoursPerYear': 'hours/year',
    'hcp.remaining': 'Remaining',
    'hcp.hours': 'hours',
    'hcp.goalAchieved': 'Goal achieved!',
    'hcp.myTickets': 'My Tickets',
    'hcp.tracking': 'Tracking',
    'hcp.noEvents': 'You have not registered for any events yet',
    'hcp.checkIn': 'Simulate Check-in',
    'hcp.checkedIn': 'Checked in & Hours Recorded',
    'hcp.checkInSuccess': 'Attendance confirmed! Recorded',
    'hcp.hoursInMumaris': 'CME hours in Mumaris Plus',
    'hcp.allEvents': 'All Events',
    'hcp.cmeAccredited': 'CME Accredited',
    // HCP Discover
    'hcp.discover.registeredChip': 'Registered',
    'hcp.discover.viewEvent': 'View Event',
    'hcp.discover.viewTicket': 'View ticket',
    'hcp.discover.viewDetails': 'View details',
    'hcp.discover.viewCertificate': 'View certificate',
    'hcp.discover.hoursFormat': '{hours} CME hours',
    'hcp.discover.upcomingRegistrations': 'Upcoming registrations',
    'hcp.discover.pastRegistrations': 'Past registrations',
    'hcp.discover.noRegistrations': 'You have no registrations yet. Discover accredited activities that match your CPD goals.',
    'event.scfhsChip': 'SCFHS',
    // Regulator
    'regulator.sharing': 'Sharing... Publishing event on LinkedIn...',
    'regulator.approvalSuccess': 'Approved successfully. Event published and hours officially accredited.',
    'regulator.pendingApproval': 'Pending Approval',
    'regulator.approved': 'Approved',
    'regulator.totalHours': 'Total Hours',
    'regulator.approvalQueue': 'Approval Queue',
    'regulator.noPendingRequests': 'No pending requests at this time',
    'regulator.pendingReview': 'Pending Review',
    'regulator.license': 'License',
    'regulator.accreditedHours': 'Accredited Hours',
    'regulator.approveAndPublish': 'Approve & Publish',
    'regulator.viewDetails': 'View Details',
    'regulator.nationalReport': 'National Report',
    'regulator.eventDistribution': 'Event Distribution by Region',
    'regulator.riyadh': 'Riyadh',
    'regulator.jeddah': 'Jeddah',
    'regulator.eastern': 'Eastern Province',
    'regulator.other': 'Other',
    // Vendor
    'vendor.sponsorshipOpportunities': 'Sponsorship Opportunities',
    'vendor.activeOpportunities': 'active opportunities',
    'vendor.noOpportunities': 'No sponsorship opportunities available at this time',
    'vendor.needsSponsorship': 'Needs Sponsorship',
    'vendor.goldPackage': 'Gold Sponsorship Package',
    'vendor.sponsorshipValue': 'Sponsorship Value',
    'vendor.sponsorEvent': 'Sponsor This Event',
    'vendor.cmeHours': 'CME Hours',
};

const legacyTranslations: Record<Language, Record<string, string>> = {
    ar: legacyTranslationsEn,
    en: legacyTranslationsEn,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always start with English; Arabic is no longer supported
    const [language, setLanguageState] = useState<Language>('en');
    const [isHydrated, setIsHydrated] = useState(false);

    // Sync with localStorage after mount to prevent hydration mismatch
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language;
            if (saved === 'en') {
                setLanguageState('en');
            }
            setIsHydrated(true);
        }
    }, []);

    useEffect(() => {
        // Update HTML dir and lang attributes
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
    }, []);

    const setLanguage = (_lang: Language) => {
        const nextLang: Language = 'en';
        setLanguageState(nextLang);
        // Store preference
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', nextLang);
        }
    };

    const t = (key: string): string => {
        // First try new locale files (nested structure)
        const localeTranslation = getTranslation(language, key);
        if (localeTranslation !== key) {
            return localeTranslation;
        }
        
        // Fallback to legacy translations for backward compatibility
        return legacyTranslationsEn[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isHydrated }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
