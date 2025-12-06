"use client";

import { Event } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Clock, Building2, FileText, DollarSign, ShieldCheck, CheckCircle } from "lucide-react";
import { getEventTitle, getEventOrganizer, getEventLocation, getEventDescription } from "@/lib/eventTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface EventCardProps {
    event: Event;
    variant?: 'default' | 'vendor' | 'ticket' | 'regulator' | 'organizer';
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
    showDescription?: boolean;
    className?: string;
    // Persona-specific data
    registrationCount?: number;
    capacity?: number;
    sfdaLicense?: string;
    sponsorshipPackage?: {
        name: string;
        value: number;
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

// Get status border color
function getStatusBorderColor(status: Event['status']): string {
    const colors = {
        'Published': 'border-l-[var(--apple-green)]',
        'Pending Approval': 'border-l-[var(--apple-orange)]',
        'Draft': 'border-l-[var(--border)]',
        'Completed': 'border-l-[var(--border)]',
    };
    return colors[status] || 'border-l-[var(--border)]';
}

// Get pending reason text based on event status and language
function getPendingReason(event: Event, language: 'ar' | 'en'): string {
    if (event.status === 'Pending Approval') {
        return language === 'ar' ? '' : 'Approval';
    }
    if (event.needs_sponsorship) {
        return language === 'ar' ? '' : 'Sponsorship';
    }
    return '';
}

export default function EventCard({
    event,
    variant = 'default',
    actionButton,
    secondaryButton,
    showDescription = true,
    className,
    registrationCount,
    capacity,
    sfdaLicense,
    sponsorshipPackage,
}: Readonly<EventCardProps>) {
    const { t, language } = useLanguage();

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

    // Determine if status is pending (for unified pending badge)
    const isPending = event.status === 'Pending Approval' || (event.status === 'Draft' && event.needs_sponsorship);
    const pendingReason = getPendingReason(event, language);

    // Variant-specific styling (only affects colors, not layout)
    const variantStyles = {
        default: 'border-[var(--border)]',
        vendor: 'border-[var(--apple-blue)]/30',
        ticket: 'border-[var(--apple-green)]/30',
        regulator: 'border-[var(--apple-orange)]/30',
        organizer: 'border-[var(--border)]',
    };

    const variantHeaderBg = {
        default: 'from-[var(--secondary-system-background)] to-[var(--system-background)] group-hover:from-[var(--apple-green)]/5',
        vendor: 'from-[var(--apple-blue)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-blue)]/10',
        ticket: 'from-[var(--apple-green)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-green)]/10',
        regulator: 'from-[var(--apple-orange)]/5 to-[var(--system-background)] group-hover:from-[var(--apple-orange)]/10',
        organizer: 'from-[var(--secondary-system-background)] to-[var(--system-background)] group-hover:from-[var(--apple-green)]/5',
    };

    // Calculate registration percentage for organizer
    const registrationPercentage = variant === 'organizer' && registrationCount !== undefined && capacity !== undefined
        ? Math.min((registrationCount / capacity) * 100, 100)
        : undefined;

    return (
        <Card
            glass={true}
            interactive={true}
            className={cn(
                "overflow-hidden border-l-4 group flex flex-col h-full",
                getStatusBorderColor(event.status),
                variantStyles[variant],
                className
            )}
        >

            {/* Header Section - Fixed Structure with Fixed Height */}
            <CardHeader className={cn("p-3 sm:p-4 bg-gradient-to-br transition-colors flex flex-col", variantHeaderBg[variant])} style={{ overflow: 'visible', minHeight: '136px', height: '136px', paddingTop: '1rem', paddingBottom: '1.5rem' }}>
                {/* Badges Row - Always present, fixed height */}
                <div className="flex items-center gap-2 flex-wrap h-6 mb-3 relative flex-shrink-0" style={{ overflow: 'visible', zIndex: 1000 }}>
                    <Badge variant="outline" className="text-xs font-medium">
                        {getSpecialtyLabel(event.specialty || '', language)}
                    </Badge>
                    
                    {/* Unified Pending Badge (Yellow) with hover tooltip */}
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

                    {/* Sponsored badge - All published events have sponsors */}
                    {event.is_sponsored && (
                        <Badge variant="emerald" className="text-xs">
                            ✓ {t('organizer.sponsored')}
                        </Badge>
                    )}

                    {/* Needs Sponsorship - Only show for non-published events that need sponsorship */}
                    {event.needs_sponsorship && !isPending && event.status !== 'Published' && (
                        <Badge variant="blue" className="text-xs">
                            {t('organizer.needsSponsorship')}
                        </Badge>
                    )}

                    {/* Trust Indicators - SCFHS Accreditation Badge */}
                    {/* Note: Not shown when Published - accreditation is implied by Published status */}
                    {variant === 'default' && event.status !== 'Published' && event.sfda_license && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium cursor-help flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" />
                                        {language === 'ar' ? ' SCFHS' : 'SCFHS Accredited'}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="z-[9999]">
                                    <p>{language === 'ar' ? '     ' : 'Accredited by Saudi Commission for Health Specialties'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {/* Verified Organizer Badge */}
                    {/* Note: Not shown when Published - verification is implied by Published status */}
                    {variant === 'default' && event.status !== 'Published' && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge className="bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/30 text-xs font-medium cursor-help flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        {language === 'ar' ? '' : 'Verified'}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="z-[9999]">
                                    <p>{language === 'ar' ? '  ' : 'Verified and accredited organizer'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                </div>

                {/* Title and Organizer Group - Always together, flexible container with proper auto-centering */}
                <div className="flex-1 flex flex-col justify-center items-start">
                    {/* Title - Always present, 2 lines max with proper line height */}
                    <CardTitle className="text-lg font-bold leading-tight mb-2 text-[var(--label)] line-clamp-2" style={{ lineHeight: '1.5rem' }}>
                        {getEventTitle(event, language)}
                    </CardTitle>

                    {/* Organizer - Always present, half line spacing from title */}
                    <CardDescription className="flex items-center gap-1.5 text-sm mt-0 text-[var(--secondary-label)] flex-shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-[var(--tertiary-label)] flex-shrink-0" />
                        <span className="truncate">{getEventOrganizer(event, language)}</span>
                    </CardDescription>
                </div>
            </CardHeader>

            {/* Divider 1 - Always present */}
            <div className="border-t border-[var(--separator)]" />

            {/* Content Section - Fixed Structure, Variable Content */}
            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Description Section - Conditional, spacing adjusts based on content */}
                {showDescription && (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-[var(--secondary-label)] line-clamp-2 leading-relaxed">
                                {getEventDescription(event, language)}
                            </p>
                        </div>
                        {/* Divider 2 - Only if description shown */}
                        <div className="border-t border-[var(--separator)] mb-4" />
                    </>
                )}

                {/* HCP: CME Hours Tablet Container - Card-wide with liquid glass effect */}
                {variant === 'default' && event.status === 'Published' && (
                    <div className="mb-4 -mx-6 px-6">
                        <div className="relative overflow-hidden rounded-xl border border-[var(--apple-green)]/30 bg-gradient-to-b from-[var(--apple-green)]/10 via-[var(--apple-green)]/5 to-[var(--apple-green)]/10 backdrop-blur-sm shadow-lg">
                            {/* Inner glow from bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--apple-green)]/20 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Content */}
                            <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[var(--apple-green)] flex-shrink-0" />
                                <span className="text-base font-bold text-[var(--label)]">
                                    {language === 'ar' ? '' : 'Accredited'} {event.cme_hours} {t('hcp.hours')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Organizer: Registration Meter Tablet Container - Card-wide with liquid glass effect */}
                {variant === 'organizer' && registrationCount !== undefined && capacity !== undefined && event.status === 'Published' && (
                    <div className="mb-4 -mx-6 px-6">
                        <div className="relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-b from-blue-50/80 via-blue-50/60 to-blue-100/80 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-blue-900/40 backdrop-blur-sm shadow-lg">
                            {/* Inner glow from bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-400/20 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Content */}
                            <div className="relative px-4 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                                        {language === 'ar' ? '' : 'Registration'}
                                    </span>
                                    <span className="text-base font-bold text-blue-900 dark:text-blue-100">
                                        {registrationCount.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} / {capacity.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                    </span>
                                </div>
                                {/* Progress bar with percentage */}
                                <div className="relative">
                                    <Progress value={registrationPercentage} max={100} className="h-2.5 bg-blue-200/50 dark:bg-blue-900/50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                                            {Math.round(registrationPercentage || 0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Event Details Section - Always present, same structure */}
                <div className="space-y-3 flex-1">
                    {/* Date - Always present, icon only */}
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-[var(--secondary-label)] flex-shrink-0" />
                        <span className="font-medium text-[var(--label)]">{formatDate(event.date, language)}</span>
                    </div>

                    {/* Location - Always present, icon only */}
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[var(--secondary-label)] flex-shrink-0" />
                        <span className="font-medium text-[var(--label)] truncate">{getEventLocation(event, language)}</span>
                    </div>

                    {/* CME Hours - For non-HCP or non-published events, show regular format */}
                    {!(variant === 'default' && event.status === 'Published') && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <span className="text-base font-bold text-red-600 dark:text-red-400">
                                    {event.cme_hours} {t('hcp.hours')} CME
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Persona-Specific Information - Conditional but same structure */}
                    {/* Regulator: SFDA License */}
                    {variant === 'regulator' && sfdaLicense && (
                        <>
                            <div className="border-t border-[var(--separator)] my-3" />
                            <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-[var(--apple-orange)] flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs text-[var(--secondary-label)] block">{t('regulator.license')}</span>
                                    <span className="font-mono text-xs font-semibold text-[var(--apple-orange)] break-all">{sfdaLicense}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Vendor: Sponsorship Package */}
                    {variant === 'vendor' && sponsorshipPackage && (
                        <>
                            <div className="border-t border-[var(--separator)] my-3" />
                            <div className="p-3 bg-[var(--apple-blue)]/10 rounded-ios-sm border border-[var(--apple-blue)]/30 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/40 flex-shrink-0">
                                        <DollarSign className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
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
                </div>
            </CardContent>

            {/* Footer with Action Buttons - Conditional but same structure when present */}
            {(actionButton || secondaryButton) && (
                <>
                    <div className="border-t border-[var(--separator)]" />
                    <CardFooter className="p-3 sm:p-4 pt-3">
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
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
