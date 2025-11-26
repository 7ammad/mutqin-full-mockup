"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function PageTitle() {
    const { role } = useAuth();
    const { t } = useLanguage();

    const getTitle = () => {
        switch (role) {
            case 'ORGANIZER': return t('page.organizer.title');
            case 'VENDOR': return t('page.vendor.title');
            case 'REGULATOR': return t('page.regulator.title');
            case 'HCP': return t('page.hcp.title');
            case 'EVENT_MANAGER': return t('page.eventmanager.title') || 'Event Manager Portal';
            default: return '';
        }
    };

    const getSubtitle = () => {
        switch (role) {
            case 'ORGANIZER': return t('page.organizer.subtitle');
            case 'VENDOR': return t('page.vendor.subtitle');
            case 'REGULATOR': return t('page.regulator.subtitle');
            case 'HCP': return t('page.hcp.subtitle');
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

