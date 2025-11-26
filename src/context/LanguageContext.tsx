"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTranslation, getNestedTranslation, type Locale } from '@/locales';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Legacy translations for backward compatibility (dashboard and existing features)
const legacyTranslations: Record<Language, Record<string, string>> = {
    ar: {
        // Navbar
        'app.name': 'MedEvent KSA',
        'persona.organizer': 'المنظم',
        'persona.vendor': 'الداعم',
        'persona.regulator': 'المعتمد',
        'persona.hcp': 'الممارس الصحي',
        // Page Titles
        'page.organizer.title': 'لوحة تحكم المنظم',
        'page.organizer.subtitle': 'إدارة الفعاليات وطلبات الرعاية',
        'page.vendor.title': 'فرص الرعاية المتاحة',
        'page.vendor.subtitle': 'تصفح الفعاليات التي تحتاج إلى دعم',
        'page.regulator.title': 'بوابة الاعتماد (SCFHS)',
        'page.regulator.subtitle': 'مراجعة واعتماد الفعاليات الممولة',
        'page.hcp.title': 'استكشاف الفعاليات',
        'page.hcp.subtitle': 'سجل في المؤتمرات وورش العمل المعتمدة',
        // Common
        'common.loading': 'جاري التحميل...',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء',
        'common.submit': 'إرسال',
        'common.search': 'بحث',
        'common.profile': 'الملف الشخصي',
        'common.settings': 'الإعدادات',
        'common.logout': 'تسجيل الخروج',
        'common.pending': 'قيد الانتظار',
        'common.approval': 'اعتماد',
        'common.sponsorship': 'رعاية',
        // Dashboard Stats
        'stats.totalEvents': 'إجمالي الفعاليات',
        'stats.registrations': 'التسجيلات',
        'stats.cmeHours': 'ساعات CME',
        'stats.pendingApprovals': 'بانتظار الاعتماد',
        'stats.activeEvents': 'الفعاليات النشطة',
        'stats.published': 'منشورة',
        'stats.underReview': 'قيد المراجعة',
        'organizer.createEvent': 'إنشاء فعالية جديدة',
        'organizer.status.published': 'منشورة',
        'organizer.status.pendingApproval': 'قيد الاعتماد',
        'organizer.status.pendingFunding': 'بانتظار التمويل',
        'organizer.status.draft': 'مسودة',
        'organizer.sponsored': 'مدعوم',
        'organizer.needsSponsorship': 'يطلب رعاية',
        // HCP
        'hcp.discoverEvents': 'استكشاف الفعاليات',
        'hcp.accreditedEvents': 'فعالية معتمدة متاحة',
        'hcp.searchPlaceholder': 'ابحث عن فعالية، تخصص، أو موقع...',
        'hcp.registerNow': 'تسجيل الآن',
        'hcp.registered': 'تم التسجيل',
        'hcp.registrationSuccess': 'تم التسجيل في الفعالية بنجاح',
        'hcp.cmeTracking': 'تتبع ساعات التعليم الطبي المستمر (CME)',
        'hcp.hoursEarned': 'ساعة مكتسبة من',
        'hcp.events': 'فعالية',
        'hcp.annualGoal': 'من الهدف السنوي',
        'hcp.goal': 'الهدف',
        'hcp.hoursPerYear': 'ساعة/سنة',
        'hcp.remaining': 'متبقي',
        'hcp.hours': 'ساعة',
        'hcp.goalAchieved': 'تم تحقيق الهدف! ✓',
        'hcp.myTickets': 'تذاكري',
        'hcp.tracking': 'التتبع',
        'hcp.noEvents': 'لم تقم بالتسجيل في أي فعالية بعد',
        'hcp.checkIn': 'محاكاة مسح الكود (Check-in)',
        'hcp.checkedIn': 'تم التحضير ورصد الساعات',
        'hcp.checkInSuccess': 'تم تأكيد الحضور! تم رصد',
        'hcp.hoursInMumaris': 'ساعة تعليم طبي في ممارس+',
        'hcp.allEvents': 'جميع الفعاليات',
        'hcp.cmeAccredited': 'معتمد CME',
        // Regulator
        'regulator.sharing': 'جاري المشاركة... يتم نشر الفعالية على LinkedIn...',
        'regulator.approvalSuccess': 'تم الاعتماد بنجاح. تم نشر الفعالية واعتماد الساعات رسمياً.',
        'regulator.pendingApproval': 'بانتظار الاعتماد',
        'regulator.approved': 'تم الاعتماد',
        'regulator.totalHours': 'إجمالي الساعات',
        'regulator.approvalQueue': 'قائمة طلبات الاعتماد',
        'regulator.noPendingRequests': 'لا توجد طلبات معلقة حالياً',
        'regulator.pendingReview': 'بانتظار المراجعة',
        'regulator.license': 'رخصه',
        'regulator.accreditedHours': 'ساعات معتمدة',
        'regulator.approveAndPublish': 'اعتماد ونشر',
        'regulator.viewDetails': 'عرض التفاصيل',
        'regulator.nationalReport': 'التقرير الوطني',
        'regulator.eventDistribution': 'توزيع الفعاليات حسب المنطقة',
        'regulator.riyadh': 'الرياض',
        'regulator.jeddah': 'جدة',
        'regulator.eastern': 'الشرقية',
        'regulator.other': 'أخرى',
        // Vendor
        'vendor.sponsorshipOpportunities': 'فرص الرعاية المتاحة',
        'vendor.activeOpportunities': 'فرص نشطة',
        'vendor.noOpportunities': 'لا توجد فرص رعاية متاحة حالياً',
        'vendor.needsSponsorship': 'مطلوب رعاية',
        'vendor.goldPackage': 'حزمة الرعاية الذهبية',
        'vendor.sponsorshipValue': 'قيمة الرعاية',
        'vendor.sponsorEvent': 'رعاية هذه الفعالية',
        'vendor.cmeHours': 'ساعات تعليم طبي',
    },
    en: {
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
        'hcp.goalAchieved': 'Goal achieved! ✓',
        'hcp.myTickets': 'My Tickets',
        'hcp.tracking': 'Tracking',
        'hcp.noEvents': 'You have not registered for any events yet',
        'hcp.checkIn': 'Simulate Check-in',
        'hcp.checkedIn': 'Checked in & Hours Recorded',
        'hcp.checkInSuccess': 'Attendance confirmed! Recorded',
        'hcp.hoursInMumaris': 'CME hours in Mumaris Plus',
        'hcp.allEvents': 'All Events',
        'hcp.cmeAccredited': 'CME Accredited',
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
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language;
            if (saved && (saved === 'ar' || saved === 'en')) {
                return saved;
            }
        }
        return 'ar';
    });

    useEffect(() => {
        // Update HTML dir and lang attributes
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        // Store preference
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    const t = (key: string): string => {
        // First try new locale files (nested structure)
        const localeTranslation = getTranslation(language, key);
        if (localeTranslation !== key) {
            return localeTranslation;
        }
        
        // Fallback to legacy translations for backward compatibility
        return legacyTranslations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

