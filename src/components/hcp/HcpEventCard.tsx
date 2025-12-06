"use client";

import { Event } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getEventTitle, getEventOrganizer, getEventLocation, getEventDescription } from "@/lib/eventTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface HcpEventCardProps {
    event: Event;
    isRegistered: boolean;
    isPast?: boolean;
    onView?: () => void;
    onRegister?: () => void;
    onViewTicket?: () => void;
    onViewDetails?: () => void;
    onViewCertificate?: () => void;
    showDescription?: boolean;
    className?: string;
    registrationStatus?: 'confirmed' | 'attended' | 'upcoming' | 'today' | 'past' | 'missed';
    hasCertificate?: boolean;
}

// Format date from YYYY-MM-DD to "Mar 15, 2025"
function formatDate(dateString: string, language: 'ar' | 'en'): string {
    const date = new Date(dateString);
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsAr = ['', '', '', '', '', '', '', '', '', '', '', ''];
    
    if (language === 'ar') {
        return `${date.getDate()} ${monthsAr[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${monthsEn[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Format hours with proper Arabic number formatting
function formatHours(hours: number, language: 'ar' | 'en', t: (key: string) => string): string {
    const formatKey = 'hcp.discover.hoursFormat';
    const template = t(formatKey);
    
    // Replace {hours} placeholder
    if (language === 'ar') {
        // Convert to Arabic-Indic numerals
        const arabicDigits = ['', '', '', '', '', '', '', '', '', ''];
        const hoursStr = hours.toString().split('').map(d => {
            const digit = parseInt(d);
            return isNaN(digit) ? d : arabicDigits[digit];
        }).join('');
        return template.replace('{hours}', hoursStr);
    }
    return template.replace('{hours}', hours.toString());
}

export default function HcpEventCard({
    event,
    isRegistered,
    isPast = false,
    onView,
    onRegister,
    onViewTicket,
    onViewDetails,
    onViewCertificate,
    showDescription = true,
    className,
    registrationStatus,
    hasCertificate = false,
}: HcpEventCardProps) {
    const { t, language } = useLanguage();

    // Only show published events in HCP Discover
    if (event.status !== 'Published') {
        return null;
    }

    return (
        <Card
            glass={true}
            interactive={true}
            className={cn(
                "overflow-hidden border-l-4 border-l-[var(--apple-green)] group flex flex-col h-full",
                "border-[var(--border)]",
                className
            )}
            data-event-id={event.id}
        >
            {/* Header Section */}
            <CardHeader className="p-3 sm:p-4 bg-gradient-to-br from-[var(--secondary-system-background)] to-[var(--system-background)] group-hover:from-[var(--apple-green)]/5 transition-colors flex flex-col relative" style={{ overflow: 'visible', minHeight: '136px', height: '136px', paddingTop: '1rem', paddingBottom: '1.5rem' }}>
                {/* Badges Row - Specialty + SCFHS + Registered chip */}
                <div className="flex items-center gap-2 flex-wrap h-6 mb-3 relative flex-shrink-0" style={{ overflow: 'visible', zIndex: 1000 }}>
                    {/* Specialty Badge */}
                    <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 dark:border-[var(--border)]/40">
                        {getSpecialtyLabel(event.specialty || '', language)}
                    </Badge>
                    
                    {/* SCFHS Accreditation Badge - Only "SCFHS" / "" */}
                    <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        {t('event.scfhsChip')}
                    </Badge>

                    {/* Registration Status Chip - Only shown when registered */}
                    {isRegistered && (
                        <Badge className={cn(
                            "text-xs font-medium ml-auto",
                            isPast && registrationStatus === 'attended' && "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30",
                            isPast && registrationStatus === 'missed' && "bg-red-500/10 text-red-500 border border-red-500/30 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/30",
                            isPast && registrationStatus !== 'attended' && registrationStatus !== 'missed' && "bg-[var(--system-fill)] text-[var(--secondary-label)] border border-[var(--border)]",
                            !isPast && "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30"
                        )}>
                            {isPast && registrationStatus === 'attended' && (language === 'ar' ? '' : 'Attended')}
                            {isPast && registrationStatus === 'missed' && (language === 'ar' ? '' : 'Missed')}
                            {!isPast && t('hcp.discover.registeredChip')}
                        </Badge>
                    )}
                </div>

                {/* Title and Organizer Group */}
                <div className="flex-1 flex flex-col justify-center items-start">
                    <CardTitle className="text-lg font-bold leading-tight mb-2 text-[var(--label)] line-clamp-2" style={{ lineHeight: '1.5rem' }}>
                        {getEventTitle(event, language)}
                    </CardTitle>

                    <CardDescription className="flex items-center gap-1.5 text-sm mt-0 text-[var(--secondary-label)] flex-shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-[var(--tertiary-label)] flex-shrink-0" />
                        <span className="truncate">{getEventOrganizer(event, language)}</span>
                    </CardDescription>
                </div>
            </CardHeader>

            {/* Divider */}
            <div className="border-t border-[var(--separator)]" />

            {/* Content Section */}
            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Description Section */}
                {showDescription && (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-[var(--secondary-label)] line-clamp-2 leading-relaxed">
                                {getEventDescription(event, language)}
                            </p>
                        </div>
                        <div className="border-t border-[var(--separator)] mb-4" />
                    </>
                )}

                {/* CME Hours Pill - Big green pill */}
                <div className="mb-4 -mx-6 px-6">
                    <div className="relative overflow-hidden rounded-xl border border-[var(--apple-green)]/30 bg-gradient-to-b from-[var(--apple-green)]/10 via-[var(--apple-green)]/5 to-[var(--apple-green)]/10 backdrop-blur-sm shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--apple-green)]/20 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-[var(--apple-green)] flex-shrink-0" />
                            <span className="text-base font-bold text-[var(--label)]">
                                {formatHours(event.cme_hours || 0, language, t)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="space-y-3 flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-[var(--secondary-label)] flex-shrink-0" />
                        <span className="font-medium text-[var(--label)]">{formatDate(event.date, language)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[var(--secondary-label)] flex-shrink-0" />
                        <span className="font-medium text-[var(--label)] truncate">{getEventLocation(event, language)}</span>
                    </div>

                    {/* Small inline ticket link for past events */}
                    {isPast && isRegistered && onViewTicket && (
                        <div className="pt-2">
                            <button onClick={onViewTicket}
                                className="text-xs text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline inline-flex items-center justify-center"
                            >
                                {t('hcp.discover.viewTicket')}
                            </button>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer with Action Buttons */}
            <div className="border-t border-[var(--separator)]" />
            <CardFooter className="p-3 sm:p-4 pt-3">
                <div className="w-full flex items-center gap-3">
                    {/* Not Registered: Register Now + View Event */}
                    {!isRegistered && (
                        <>
                            <Button
                                onClick={onRegister}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium h-9 sm:h-10 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900"
                            >
                                {t('hcp.registerNow')}
                            </Button>
                            <Button
                                onClick={onView}
                                variant="ghost"
                                className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 h-9 sm:h-10"
                            >
                                {t('hcp.discover.viewEvent')}
                            </Button>
                        </>
                    )}

                    {/* Future events (Next activity + Upcoming): View Ticket + View Details */}
                    {isRegistered && !isPast && (
                        <>
                            {onViewTicket && (
                                <Button
                                    onClick={onViewTicket}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium h-9 sm:h-10 min-w-0 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900"
                                >
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{t('hcp.discover.viewTicket')}</span>
                                </Button>
                            )}
                            {onViewDetails && (
                                <Button
                                    onClick={onViewDetails}
                                    variant="ghost"
                                    className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 h-9 sm:h-10 flex-shrink-0"
                                >
                                    {t('hcp.discover.viewDetails')}
                                </Button>
                            )}
                        </>
                    )}

                    {/* Past events: View Certificate (if available) + View Details */}
                    {isRegistered && isPast && (
                        <>
                            {hasCertificate && onViewCertificate ? (
                                <>
                                    <Button
                                        onClick={onViewCertificate}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium h-9 sm:h-10 min-w-0 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900"
                                    >
                                        <span className="truncate">{t('hcp.discover.viewCertificate')}</span>
                                    </Button>
                                    {onViewDetails && (
                                        <Button
                                            onClick={onViewDetails}
                                            variant="ghost"
                                            className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 h-9 sm:h-10 flex-shrink-0"
                                        >
                                            {t('hcp.discover.viewDetails')}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {onViewDetails && (
                                        <Button
                                            onClick={onViewDetails}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium h-9 sm:h-10 min-w-0 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900"
                                        >
                                            <span className="truncate">{t('hcp.discover.viewDetails')}</span>
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

