"use client";

import { Event } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Building2, ShieldCheck, CheckCircle2, Ticket, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getEventTitle, getEventOrganizer, getEventLocation, getEventDescription } from "@/lib/eventTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ActivityCardVariant = "full" | "compact" | "row" | "journey";
type ActivityCardContext = "hcp" | "organizer" | "event-manager" | "sponsor" | "regulator";
type ActivityCardDisplayVariant = "default" | "featured";

interface ActivityCardProps {
    event: Event;
    variant?: ActivityCardVariant;
    displayVariant?: ActivityCardDisplayVariant;
    context?: ActivityCardContext;
    // HCP-specific props
    isRegistered?: boolean;
    isPast?: boolean;
    registrationStatus?: 'confirmed' | 'attended' | 'upcoming' | 'today' | 'past' | 'missed';
    hasCertificate?: boolean;
    // Journey variant props
    journeyStatus?: 'registered' | 'attended' | 'missed';
    ticketId?: string;
    certificateId?: string;
    onSelect?: () => void;
    // Action callbacks
    onView?: () => void;
    onRegister?: () => void;
    onViewTicket?: () => void;
    onViewDetails?: () => void;
    onViewCertificate?: () => void;
    // Display options
    showDescription?: boolean;
    className?: string;
    // Organizer-specific props
    registrationCount?: number;
    capacity?: number;
    // Regulator-specific props
    sfdaLicense?: string;
    // Sponsor-specific props
    sponsorshipPackage?: {
        name: string;
        value: number;
    };
    // Action buttons (for non-HCP contexts)
    actionButton?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'disabled' | 'emerald' | 'blue';
        icon?: React.ReactNode;
    };
    secondaryButton?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'outline' | 'ghost';
        icon?: React.ReactNode;
    };
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
    
    if (language === 'ar') {
        const arabicDigits = ['', '', '', '', '', '', '', '', '', ''];
        const hoursStr = hours.toString().split('').map(d => {
            const digit = parseInt(d);
            return isNaN(digit) ? d : arabicDigits[digit];
        }).join('');
        return template.replace('{hours}', hoursStr);
    }
    return template.replace('{hours}', hours.toString());
}

// Get status border color based on event status
function getStatusBorderColor(status: Event['status']): string {
    const colors = {
        'Published': 'border-l-[var(--apple-green)]',
        'Pending Approval': 'border-l-[var(--apple-orange)]',
        'Draft': 'border-l-[var(--border)]',
        'Completed': 'border-l-[var(--border)]',
    };
    return colors[status] || 'border-l-[var(--border)]';
}

// Get pending reason text
function getPendingReason(event: Event, language: 'ar' | 'en'): string {
    if (event.status === 'Pending Approval') {
        return language === 'ar' ? '' : 'Approval';
    }
    if (event.needs_sponsorship) {
        return language === 'ar' ? '' : 'Sponsorship';
    }
    return '';
}

export function ActivityCard({
    event,
    variant = "full",
    displayVariant = "default",
    context = "hcp",
    isRegistered = false,
    isPast = false,
    registrationStatus,
    hasCertificate = false,
    journeyStatus,
    ticketId,
    certificateId,
    onSelect,
    onView,
    onRegister,
    onViewTicket,
    onViewDetails,
    onViewCertificate,
    showDescription = true,
    className,
    registrationCount,
    capacity,
    sfdaLicense,
    sponsorshipPackage,
    actionButton,
    secondaryButton,
}: ActivityCardProps) {
    const { t, language } = useLanguage();
    const router = useRouter();

    // Status colors and labels
    const statusColors: Record<Event['status'], string> = {
        'Published': 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30',
        'Pending Approval': 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30',
        'Draft': 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]',
        'Completed': 'bg-[var(--secondary-system-fill)] text-[var(--tertiary-label)] border-[var(--border)]',
    };

    const statusLabels: Record<Event['status'], string> = {
        'Published': t('organizer.status.published'),
        'Pending Approval': t('organizer.status.pendingApproval'),
        'Draft': t('organizer.status.draft'),
        'Completed': 'Completed',
    };

    const isPending = event.status === 'Pending Approval' || (event.status === 'Draft' && event.needs_sponsorship);
    const pendingReason = getPendingReason(event, language);

    // Context-specific header background
    const contextHeaderBg = {
        hcp: 'from-[var(--secondary-system-background)] to-[var(--system-background)] group-hover:from-[var(--apple-green)]/5',
        organizer: 'from-[var(--secondary-system-background)] to-[var(--system-background)] group-hover:from-[var(--apple-green)]/5',
        'event-manager': 'from-[var(--apple-blue)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-blue)]/10',
        sponsor: 'from-[var(--apple-blue)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-blue)]/10',
        regulator: 'from-[var(--apple-orange)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-orange)]/10',
    };

    // Calculate registration percentage for organizer
    const registrationPercentage = context === 'organizer' && registrationCount !== undefined && capacity !== undefined
        ? Math.min((registrationCount / capacity) * 100, 100)
        : undefined;

    // For HCP context, only show published events in discover
    if (context === 'hcp' && event.status !== 'Published') {
        return null;
    }

    // Journey variant - timeline card layout
    if (variant === 'journey') {
        const handleTicketClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (ticketId) {
                const params = new URLSearchParams();
                params.set('tab', 'files');
                params.set('view', 'tickets');
                params.set('activityId', event.id);
                router.push(`/dashboard/hcp?${params.toString()}`);
            }
        };

        const handleCertificateClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (certificateId) {
                const params = new URLSearchParams();
                params.set('tab', 'files');
                params.set('view', 'certificates');
                params.set('activityId', event.id);
                router.push(`/dashboard/hcp?${params.toString()}`);
            }
        };

        const handleViewDetailsClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onSelect) {
                onSelect();
            }
            if (onViewDetails) {
                onViewDetails();
            }
        };

        const journeyStatusColors = {
            registered: 'bg-[var(--system-fill)] text-[var(--secondary-label)] border border-[var(--border)]',
            attended: 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30',
            missed: 'bg-red-500/10 text-red-500 border border-red-500/30 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/30',
        };

        const status = journeyStatus || (registrationStatus === 'attended' ? 'attended' : registrationStatus === 'missed' ? 'missed' : 'registered');

        return (
            <Card
                glass={false}
                interactive={false}
                className={cn(
                    "border border-[var(--border)] bg-[var(--system-background)] hover:shadow-md transition-all cursor-pointer",
                    className
                )}
                onClick={onSelect}
            >
                <CardHeader className="p-4">
                    {/* Header Row: Status + CME Hours */}
                    <div className="flex items-center justify-between mb-3">
                        <Badge className={cn("text-xs font-medium", journeyStatusColors[status])}>
                            {t(`myJourney.status.${status}`)}
                        </Badge>
                        {event.cme_hours > 0 && (
                            <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatHours(event.cme_hours, language, t)}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <CardTitle className="text-base font-semibold text-[var(--label)] line-clamp-2 mb-2">
                        {getEventTitle(event, language)}
                    </CardTitle>

                    {/* Subline: City · Venue · Date */}
                    <CardDescription className="text-sm text-[var(--secondary-label)] flex items-center gap-2 flex-wrap">
                        <span>{getEventLocation(event, language)}</span>
                        <span>·</span>
                        <span>{formatDate(event.date, language)}</span>
                    </CardDescription>
                </CardHeader>

                {/* Footer: View Details + Ticket/Certificate Chips */}
                <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
                    <button onClick={handleViewDetailsClick}
                        className="text-sm text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline inline-flex items-center justify-center"
                    >
                        {t('myJourney.actions.viewDetails')}
                    </button>
                    <div className="flex items-center gap-2">
                        {ticketId ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={handleTicketClick}
                                            className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--secondary-system-fill)] transition-colors flex items-center gap-1 inline-flex items-center justify-center"
                                        >
                                            <Ticket className="h-3 w-3" />
                                            {t('myJourney.ticket.label')}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('myJourney.actions.openTicket')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button disabled
                                            className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--system-fill)] text-[var(--tertiary-label)] opacity-50 cursor-not-allowed flex items-center gap-1 inline-flex items-center justify-center"
                                        >
                                            <Ticket className="h-3 w-3" />
                                            {t('myJourney.ticket.label')}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('myJourney.ticket.unavailable')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {certificateId ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={handleCertificateClick}
                                            className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--secondary-system-fill)] transition-colors flex items-center gap-1 inline-flex items-center justify-center"
                                        >
                                            <FileText className="h-3 w-3" />
                                            {t('myJourney.certificate.label')}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('myJourney.actions.downloadCertificate')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button disabled
                                            className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--system-fill)] text-[var(--tertiary-label)] opacity-50 cursor-not-allowed flex items-center gap-1 inline-flex items-center justify-center"
                                        >
                                            <FileText className="h-3 w-3" />
                                            {t('myJourney.certificate.label')}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('myJourney.certificate.unavailable')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardFooter>
            </Card>
        );
    }

    // Row variant - simplified horizontal layout
    if (variant === 'row') {
        return (
            <div
                className={cn(
                    "rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--system-background)] to-[var(--secondary-system-background)]/50 p-4 space-y-2 shadow-sm hover:shadow-md transition-all",
                    className
                )}
            >
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs font-medium">
                        {getSpecialtyLabel(event.specialty || '', language as 'ar' | 'en')}
                    </Badge>
                    {event.status === 'Published' && (
                        <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            {t('event.scfhsChip')}
                        </Badge>
                    )}
                    <Badge className={cn("text-xs font-medium ml-auto", statusColors[event.status])}>
                        {statusLabels[event.status]}
                    </Badge>
                </div>
                <h3 className="text-base font-semibold text-[var(--label)] line-clamp-1">
                    {getEventTitle(event, language)}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[var(--secondary-label)]">
                    <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {getEventOrganizer(event, language)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {getEventLocation(event, language)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(event.date, language)}
                    </span>
                </div>
            </div>
        );
    }

    // Full and compact variants use card layout
    const displayClasses = displayVariant === 'featured'
        ? "lg:row-span-2 lg:col-span-2"
        : "";

    return (
        <Card
            glass={true}
            interactive={true}
            className={cn(
                "overflow-hidden border-l-4 group flex flex-col h-full",
                getStatusBorderColor(event.status),
                displayClasses,
                className
            )}
            data-event-id={event.id}
        >
            {/* Header Section */}
            <CardHeader className={cn(
                "bg-gradient-to-br transition-colors flex flex-col",
                contextHeaderBg[context],
                displayVariant === 'featured' ? "p-4 sm:p-5" : "p-3 sm:p-4"
            )} style={{ overflow: 'visible', minHeight: displayVariant === 'featured' ? '160px' : '136px', height: displayVariant === 'featured' ? '160px' : '136px', paddingTop: '1rem', paddingBottom: '1.5rem' }}>
                {/* Badges Row */}
                <div className="flex items-center gap-2 flex-wrap h-6 mb-3 relative flex-shrink-0" style={{ overflow: 'visible', zIndex: 1000 }}>
                    {/* Specialty Badge */}
                    <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60 dark:border-[var(--border)]/40">
                        {getSpecialtyLabel(event.specialty || '', language as 'ar' | 'en')}
                    </Badge>
                    
                    {/* SCFHS Accreditation Badge - Only for published events or HCP context */}
                    {(event.status === 'Published' || context === 'hcp') && (
                        <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            {t('event.scfhsChip')}
                        </Badge>
                    )}

                    {/* Status Badge */}
                    {isPending ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge className="bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30 text-xs font-medium cursor-help">
                                        {language === 'ar' ? ' ' : 'Pending'}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="z-[9999]">
                                    <p>{pendingReason}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Badge className={cn("text-xs font-medium", statusColors[event.status])}>
                            {statusLabels[event.status]}
                        </Badge>
                    )}

                    {/* HCP Registration Status Chip */}
                    {context === 'hcp' && isRegistered && (
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

                    {/* Sponsored badge */}
                    {event.is_sponsored && context !== 'hcp' && (
                        <Badge variant="emerald" className="text-xs">
                            ✓ {t('organizer.sponsored')}
                        </Badge>
                    )}

                    {/* Needs Sponsorship */}
                    {event.needs_sponsorship && !isPending && event.status !== 'Published' && context !== 'hcp' && (
                        <Badge variant="blue" className="text-xs">
                            {t('organizer.needsSponsorship')}
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
            <CardContent className={cn(
                "flex-1 flex flex-col",
                displayVariant === 'featured' ? "p-6 sm:p-7" : "p-6"
            )}>
                {/* Description Section */}
                {showDescription && variant === 'full' && (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-[var(--secondary-label)] line-clamp-2 leading-relaxed">
                                {getEventDescription(event, language)}
                            </p>
                        </div>
                        <div className="border-t border-[var(--separator)] mb-4" />
                    </>
                )}

                {/* CME Hours Pill - For HCP context or published events */}
                {(context === 'hcp' || event.status === 'Published') && variant === 'full' && (
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
                )}

                {/* Organizer: Registration Meter */}
                {context === 'organizer' && registrationCount !== undefined && capacity !== undefined && event.status === 'Published' && variant === 'full' && (
                    <div className="mb-4 -mx-6 px-6">
                        <div className="relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-b from-blue-50/80 via-blue-50/60 to-blue-100/80 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-blue-900/40 backdrop-blur-sm shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-400/20 via-transparent to-transparent pointer-events-none" />
                            
                            <div className="relative px-4 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                                        {language === 'ar' ? '' : 'Registration'}
                                    </span>
                                    <span className="text-base font-bold text-blue-900 dark:text-blue-100">
                                        {registrationCount.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} / {capacity.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

                    {/* CME Hours - For non-HCP or non-published events */}
                    {!(context === 'hcp' && event.status === 'Published') && variant === 'full' && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <span className="text-base font-bold text-red-600 dark:text-red-400">
                                    {event.cme_hours} {t('hcp.hours')} CME
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Regulator: SFDA License */}
                    {context === 'regulator' && sfdaLicense && variant === 'full' && (
                        <>
                            <div className="border-t border-[var(--separator)] my-3" />
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-xs text-[var(--secondary-label)] block">{t('regulator.license')}</span>
                                <span className="font-mono text-xs font-semibold text-[var(--apple-orange)] break-all">{sfdaLicense}</span>
                            </div>
                        </>
                    )}

                    {/* Sponsor: Sponsorship Package */}
                    {context === 'sponsor' && sponsorshipPackage && variant === 'full' && (
                        <>
                            <div className="border-t border-[var(--separator)] my-3" />
                            <div className="p-3 bg-[var(--apple-blue)]/10 rounded-ios-sm border border-[var(--apple-blue)]/30 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                        {sponsorshipPackage.name}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                        {sponsorshipPackage.value.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {language === 'ar' ? '.' : 'SAR'}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Small inline ticket link for past events (HCP) */}
                    {context === 'hcp' && isPast && isRegistered && onViewTicket && variant === 'full' && (
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
            {(onRegister || onView || onViewTicket || onViewDetails || onViewCertificate || actionButton || secondaryButton) && (
                <>
                    <div className="border-t border-[var(--separator)]" />
                    <CardFooter className="p-3 sm:p-4 pt-3">
                        <div className="w-full flex items-center gap-3">
                            {/* HCP Context: Not Registered */}
                            {context === 'hcp' && !isRegistered && (
                                <>
                                    {onRegister && (
                                        <Button
                                            onClick={onRegister}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium h-9 sm:h-10 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900"
                                        >
                                            {t('hcp.registerNow')}
                                        </Button>
                                    )}
                                    {onView && (
                                        <Button
                                            onClick={onView}
                                            variant="ghost"
                                            className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 h-9 sm:h-10"
                                        >
                                            {t('hcp.discover.viewEvent')}
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* HCP Context: Future events */}
                            {context === 'hcp' && isRegistered && !isPast && (
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

                            {/* HCP Context: Past events */}
                            {context === 'hcp' && isRegistered && isPast && (
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

                            {/* Non-HCP Context: Action buttons */}
                            {context !== 'hcp' && (actionButton || secondaryButton) && (
                                <div className={cn(
                                    "w-full gap-2 flex items-stretch",
                                    actionButton && secondaryButton ? "grid grid-cols-2" : ""
                                )}>
                                    {actionButton && (
                                        <Button
                                            onClick={actionButton.onClick}
                                            disabled={actionButton.variant === 'disabled'}
                                            className={cn(
                                                "font-medium h-9 sm:h-10 text-sm sm:text-base flex items-center justify-center",
                                                actionButton.variant === 'disabled' && "bg-[var(--system-fill)] text-[var(--tertiary-label)]",
                                                actionButton.variant === 'emerald' && "bg-[var(--apple-green)] hover:opacity-90 text-white",
                                                actionButton.variant === 'blue' && "bg-[var(--apple-blue)] hover:opacity-90 text-white",
                                                secondaryButton ? "" : "w-full"
                                            )}
                                        >
                                            {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
                                            {actionButton.label}
                                        </Button>
                                    )}
                                    {secondaryButton && (
                                        <Button
                                            onClick={secondaryButton.onClick}
                                            variant={secondaryButton.variant === 'outline' ? 'outline' : secondaryButton.variant === 'ghost' ? 'ghost' : 'default'}
                                            className={cn(
                                                "font-medium h-9 sm:h-10 text-sm sm:text-base flex items-center justify-center",
                                                secondaryButton.variant === 'outline' && "border-[var(--apple-blue)] bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] hover:bg-[var(--apple-blue)]/20 border-2",
                                                secondaryButton.variant === 'ghost' && "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] hover:bg-[var(--apple-blue)]/20",
                                                !secondaryButton.variant && "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] hover:bg-[var(--apple-blue)]/20",
                                                actionButton ? "" : "w-full"
                                            )}
                                        >
                                            {secondaryButton.label}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

