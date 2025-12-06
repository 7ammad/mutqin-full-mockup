"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";

export default function PageTitle() {
    const { role } = useAuth();
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");

    const getTitle = () => {
        // Dynamic titles for HCP tabs
        if (role === 'HCP') {
            if (tab === 'discover') {
                return language === 'ar' ? ' ' : 'Discover Events';
            }
            if (tab === 'registrations' || tab === 'journey') {
                return language === 'ar' ? '  ' : 'My Journey';
            }
            if (tab === 'files') {
                return language === 'ar' ? '' : 'My Files';
            }
            if (tab === 'credits' || tab === 'certs_reviews') {
                return language === 'ar' ? ' ' : 'CME Credits';
            }
            return t('page.hcp.title');
        }
        
        // Dynamic titles for Organizer tabs
        if (role === 'ORGANIZER') {
            if (tab === 'overview') {
                return language === 'ar' ? '  ' : 'Organizer Dashboard';
            }
            return t('page.organizer.title');
        }
        
        switch (role) {
            case 'VENDOR': return t('page.vendor.title');
            case 'REGULATOR': return t('page.regulator.title');
            case 'EVENT_MANAGER': return t('page.eventmanager.title') || 'Event Manager Portal';
            default: return '';
        }
    };

    const getSubtitle = () => {
        // Dynamic subtitles for HCP tabs
        if (role === 'HCP') {
            if (tab === 'discover') {
                return t('page.hcp.subtitle');
            }
            if (tab === 'registrations' || tab === 'journey') {
                return language === 'ar' 
                    ? '        '
                    : 'All the activities you registered for, from first to latest.';
            }
            if (tab === 'files') {
                return language === 'ar' 
                    ? '    '
                    : 'Quick access to your tickets and certificates.';
            }
            if (tab === 'credits' || tab === 'certs_reviews') {
                return language === 'ar' 
                    ? '     '
                    : 'Your accredited activities, certificates, and CME balance';
            }
            return t('page.hcp.subtitle');
        }
        
        // Dynamic subtitles for Organizer tabs
        if (role === 'ORGANIZER') {
            if (tab === 'overview') {
                return language === 'ar' 
                    ? '   '
                    : 'Manage events, accreditations, and sponsorships';
            }
            return t('page.organizer.subtitle');
        }
        
        switch (role) {
            case 'VENDOR': return t('page.vendor.subtitle');
            case 'REGULATOR': return t('page.regulator.subtitle');
            case 'EVENT_MANAGER': return t('page.eventmanager.subtitle') || 'Manage event assignments and execution';
            default: return '';
        }
    };

    return (
        <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--label)] leading-tight">
                {getTitle()}
            </h1>
            <p className="text-xs sm:text-xs lg:text-sm text-[var(--secondary-label)] mt-0.5 leading-tight">
                {getSubtitle()}
            </p>
        </div>
    );
}

