"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/components/ui/toast-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { Ticket, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import { getEventTitle, getEventLocation, formatDate } from "@/lib/eventTranslations";
import { cn } from "@/lib/utils";
import type { DemoTicket, DemoEvent, DemoCertificate } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";

interface RegisteredEvent {
    event: Event;
    ticket: DemoTicket;
    certificate: DemoCertificate | undefined;
    status: 'upcoming' | 'today' | 'past';
    registrationStatus: 'confirmed' | 'attended' | 'missed';
}

type YearFilter = 'all' | 'current' | 'last';
type StatusFilter = 'all' | 'upcoming' | 'past';

export default function MyTickets() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const [tickets, setTickets] = useState<DemoTicket[]>([]);
    const [events, setEvents] = useState<DemoEvent[]>([]);
    const [certificates, setCertificates] = useState<DemoCertificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState<YearFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const focusEventId = searchParams.get('eventId');
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { getHcpSummaryFull, getAllEventsFull } = await import('@/lib/dataSource');
                const summary = await getHcpSummaryFull('hcp-1');
                setTickets(summary.tickets);
                setCertificates(summary.certificates);
                
                const eventIds = summary.tickets.map((t: DemoTicket) => t.eventId);
                if (eventIds.length > 0) {
                    const allEvents = await getAllEventsFull();
                    const eventsData = allEvents.filter(e => eventIds.includes(e.id));
                    setEvents(eventsData);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load registrations';
                console.error('Error fetching registrations:', err);
                showToast(message, 'info');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    // Group registrations into next, upcoming, and past
    const groupedRegistrations = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const registeredEvents: RegisteredEvent[] = tickets.map(ticket => {
            const event = events.find(e => e.id === ticket.eventId);
            if (!event) return null;

            const eventDate = event.date ? new Date(event.date) : null;
            
            let status: 'upcoming' | 'today' | 'past';
            if (!eventDate) {
                status = 'upcoming';
            } else {
                const eventDateOnly = new Date(eventDate);
                eventDateOnly.setHours(0, 0, 0, 0);
                
                if (eventDateOnly.getTime() === now.getTime()) {
                    status = 'today';
                } else if (eventDateOnly > now) {
                    status = 'upcoming';
                } else {
                    status = 'past';
                }
            }

            const certificate = certificates.find(c => c.eventId === event.id);
            let displayStatus: 'confirmed' | 'attended' | 'missed' = ticket.status as 'confirmed' | 'attended' | 'missed';
            if (status === 'past' && ticket.status === 'confirmed') {
                displayStatus = 'missed';
            }

            return {
                event: convertDemoEventToEvent(event),
                ticket,
                certificate,
                status,
                registrationStatus: displayStatus,
            };
        }).filter((item): item is RegisteredEvent => item !== null);

        registeredEvents.sort((a, b) => {
            const dateA = a.event.date ? new Date(a.event.date).getTime() : 0;
            const dateB = b.event.date ? new Date(b.event.date).getTime() : 0;
            return dateA - dateB;
        });

        const nextRegistration = registeredEvents.find(e => e.status === 'upcoming' || e.status === 'today') || null;
        const upcomingRegistrations = registeredEvents.filter(e => 
            (e.status === 'upcoming' || e.status === 'today') && e !== nextRegistration
        );
        const pastRegistrations = registeredEvents.filter(e => e.status === 'past');

        return {
            nextRegistration,
            upcomingRegistrations,
            pastRegistrations,
            allRegistrations: registeredEvents,
        };
    }, [tickets, events, certificates]);

    // Apply filters
    const filteredJourney = useMemo(() => {
        let items = [...groupedRegistrations.allRegistrations];

        // Year filter
        if (yearFilter !== 'all') {
            const now = new Date();
            const currentYear = now.getFullYear();
            items = items.filter(item => {
                if (!item.event.date) return false;
                const eventYear = new Date(item.event.date).getFullYear();
                if (yearFilter === 'current') {
                    return eventYear === currentYear;
                } else if (yearFilter === 'last') {
                    return eventYear === currentYear - 1;
                }
                return true;
            });
        }

        // Status filter
        if (statusFilter === 'upcoming') {
            items = items.filter(item => item.status === 'upcoming' || item.status === 'today');
        } else if (statusFilter === 'past') {
            items = items.filter(item => item.status === 'past');
        }

        return items;
    }, [groupedRegistrations.allRegistrations, yearFilter, statusFilter]);

    // Deep-link: scroll to focused event
    useEffect(() => {
        if (!focusEventId || loading) return;

        const timer = setTimeout(() => {
            const cardElement = cardRefs.current.get(focusEventId);
            if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cardElement.classList.add('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                setTimeout(() => {
                    cardElement.classList.remove('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                }, 2000);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [focusEventId, loading]);

    const handleViewTicket = (ticketId: string, eventId: string) => {
        // Navigate to My Files > Tickets with eventId
        const params = new URLSearchParams();
        params.set('tab', 'files');
        params.set('view', 'tickets');
        params.set('eventId', eventId);
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    const handleViewDetails = (eventId: string) => {
        router.push(buildRoute.hcpEvent(eventId));
    };

    const handleViewCertificate = (certificateId: string, eventId: string) => {
        // Navigate to My Files > Certificates with eventId
        const params = new URLSearchParams();
        params.set('tab', 'files');
        params.set('view', 'certificates');
        params.set('eventId', eventId);
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8 text-[var(--secondary-label)]">
                    {language === 'ar' ? 'جاري التحميل...' : 'Loading registrations...'}
                </div>
            </div>
        );
    }

    const { nextRegistration } = groupedRegistrations;

    if (tickets.length === 0) {
        return (
            <EmptyState
                title={t('hcp.myTickets')}
                description={t('hcp.discover.noRegistrations')}
                icon={Ticket}
                actionLabel={language === 'ar' ? 'استكشف الفعاليات' : 'Discover events'}
                onAction={() => {
                    const params = new URLSearchParams();
                    params.set('tab', 'discover');
                    router.push(`/dashboard/hcp?${params.toString()}`);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Year Filter */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm text-[var(--secondary-label)]">
                        {language === 'ar' 
                            ? 'جميع الأنشطة التي سجّلت فيها، من الأولى إلى الأخيرة'
                            : 'All the activities you registered for, from first to latest.'}
                    </p>
                </div>
                <Select value={yearFilter} onValueChange={(value) => setYearFilter(value as YearFilter)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                        <SelectItem value="current">{language === 'ar' ? 'هذا العام' : 'This year'}</SelectItem>
                        <SelectItem value="last">{language === 'ar' ? 'العام الماضي' : 'Last year'}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Next Activity - Compact Horizontal Card */}
            {nextRegistration && (
                <div
                    ref={(el) => {
                        if (el) cardRefs.current.set(nextRegistration.event.id, el);
                    }}
                    data-event-id={nextRegistration.event.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--system-fill)]/30 dark:bg-[var(--system-fill)]/20 px-4 py-3 md:px-6 md:py-4"
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-[var(--label)] truncate mb-1">
                                {getEventTitle(nextRegistration.event, language)}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--secondary-label)]">
                                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{formatDate(nextRegistration.event.date, language)}</span>
                                <span className="mx-1">·</span>
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{getEventLocation(nextRegistration.event, language)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Badge className={cn(
                                "text-xs font-medium",
                                nextRegistration.status === 'today' 
                                    ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border border-[var(--apple-orange)]/30"
                                    : "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/30"
                            )}>
                                {nextRegistration.status === 'today' 
                                    ? (language === 'ar' ? 'اليوم' : 'Today')
                                    : (language === 'ar' ? 'قادم' : 'Upcoming')}
                            </Badge>
                            <Button
                                onClick={() => handleViewTicket(nextRegistration.ticket.id, nextRegistration.event.id)}
                                size="sm"
                                className="bg-[var(--apple-green)] hover:opacity-90 text-white dark:text-slate-900 h-8 px-3 text-xs"
                            >
                                {language === 'ar' ? 'فتح التذكرة' : 'View ticket'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <GlassButton
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className="text-xs"
                >
                    {language === 'ar' ? 'الكل' : 'All'}
                </GlassButton>
                <GlassButton
                    variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('upcoming')}
                    className="text-xs"
                >
                    {language === 'ar' ? 'قادمة' : 'Upcoming'}
                </GlassButton>
                <GlassButton
                    variant={statusFilter === 'past' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('past')}
                    className="text-xs"
                >
                    {language === 'ar' ? 'سابقة' : 'Past'}
                </GlassButton>
            </div>

            {/* Journey Cards Grid - Using HcpEventCard */}
            {filteredJourney.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJourney.map((item) => (
                        <div
                            key={item.event.id}
                            ref={(el) => {
                                if (el) cardRefs.current.set(item.event.id, el);
                            }}
                            data-event-id={item.event.id}
                        >
                            <ActivityCard
                                event={item.event}
                                context="hcp"
                                variant="full"
                                isRegistered={true}
                                isPast={item.status === 'past'}
                                onViewTicket={() => handleViewTicket(item.ticket.id, item.event.id)}
                                onViewDetails={() => handleViewDetails(item.event.id)}
                                onViewCertificate={item.certificate ? () => handleViewCertificate(item.certificate!.id, item.event.id) : undefined}
                                showDescription={true}
                                registrationStatus={item.registrationStatus}
                                hasCertificate={!!item.certificate}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={language === 'ar' ? 'لا توجد أنشطة' : 'No activities'}
                    description={language === 'ar' 
                        ? 'لا توجد أنشطة تطابق الفلاتر المحددة'
                        : 'No activities match the selected filters'}
                    icon={Ticket}
                />
            )}
        </div>
    );
}
