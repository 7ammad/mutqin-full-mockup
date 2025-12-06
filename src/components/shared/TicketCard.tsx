"use client";

import { Event } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ShieldCheck, Building2 } from "lucide-react";
import { getEventTitle, getEventOrganizer, getEventLocation, formatDate } from "@/lib/eventTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface TicketCardProps {
    event: Event;
    status: 'upcoming' | 'past';
    registrationStatus?: 'confirmed' | 'attended' | 'missed';
    onOpenTicket?: () => void;
    onViewDetails?: () => void;
    className?: string;
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

export function TicketCard({
    event,
    status,
    registrationStatus,
    onOpenTicket,
    onViewDetails,
    className,
}: TicketCardProps) {
    const { t, language } = useLanguage();

    return (
        <div
            className={cn(
                "rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--system-background)] to-[var(--secondary-system-background)]/50 p-4 space-y-3 shadow-sm hover:shadow-md transition-all",
                className
            )}
        >
            {/* Top Chips Row */}
            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-medium border border-[var(--border)]/60">
                    {getSpecialtyLabel(event.specialty || '', language)}
                </Badge>
                <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30 text-xs font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {t('event.scfhsChip')}
                </Badge>
                {status === 'upcoming' && (
                    <Badge className="bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/30 text-xs font-medium ml-auto">
                        {language === 'ar' ? '' : 'Upcoming'}
                    </Badge>
                )}
                {status === 'past' && registrationStatus && (
                    <Badge className={cn(
                        "text-xs font-medium ml-auto",
                        registrationStatus === 'attended' && "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30",
                        registrationStatus === 'missed' && "bg-red-500/10 text-red-500 border border-red-500/30"
                    )}>
                        {registrationStatus === 'attended' 
                            ? (language === 'ar' ? '' : 'Attended')
                            : (language === 'ar' ? '' : 'Missed')}
                    </Badge>
                )}
            </div>

            {/* Main Content */}
            <div className="space-y-2">
                <h3 className="text-base font-semibold text-[var(--label)] line-clamp-2">
                    {getEventTitle(event, language)}
                </h3>
                <p className="text-sm text-[var(--secondary-label)] flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{getEventOrganizer(event, language)}</span>
                </p>
                <p className="text-xs text-[var(--tertiary-label)] flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                        {getEventLocation(event, language)} • {formatDate(event.date, language)}
                    </span>
                </p>
            </div>

            {/* Hours Pill */}
            {event.cme_hours > 0 && (
                <div className="flex items-center justify-center">
                    <Badge className="bg-gradient-to-r from-[var(--apple-green)]/10 to-[var(--apple-green)]/5 border border-[var(--apple-green)]/30 text-[var(--apple-green)] px-3 py-1.5 text-sm font-semibold">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {formatHours(event.cme_hours, language, t)}
                    </Badge>
                </div>
            )}

            {/* Actions Row */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]/50">
                {onOpenTicket && (
                    <Button
                        onClick={onOpenTicket}
                        size="sm"
                        className="flex-1 bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900 h-8 text-xs"
                    >
                        {language === 'ar' ? ' ' : 'Open ticket'}
                    </Button>
                )}
                {onViewDetails && (
                    <Button
                        onClick={onViewDetails}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 h-8 px-3"
                    >
                        {language === 'ar' ? ' ' : 'View details'}
                    </Button>
                )}
            </div>
        </div>
    );
}

