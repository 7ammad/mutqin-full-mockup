"use client";
// cSpell:disable
// Spell checking disabled for this file - contains TypeScript type definitions and Arabic text

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/components/ui/toast-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { Ticket } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import { cn } from "@/lib/utils";
import type { DemoTicket, DemoEvent, DemoCertificate } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";

interface RegisteredEvent {
    event: Event;
    ticket: DemoTicket;
    certificate: DemoCertificate | undefined;
    status: EventStatus;
    registrationStatus: RegistrationStatus;
}

type YearFilter = 'all' | 'current' | 'last';
type StatusFilter = 'all' | 'upcoming' | 'past';
type EventStatus = 'upcoming' | 'today' | 'past';
type RegistrationStatus = 'confirmed' | 'attended' | 'missed';

export function HcpRegistrationsTab() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
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
            
            let status: EventStatus;
            if (eventDate) {
                const eventDateOnly = new Date(eventDate);
                eventDateOnly.setHours(0, 0, 0, 0);
                
                if (eventDateOnly.getTime() === now.getTime()) {
                    status = 'today';
                } else if (eventDateOnly > now) {
                    status = 'upcoming';
                } else {
                    status = 'past';
                }
            } else {
                status = 'upcoming';
            }

            const certificate = certificates.find(c => c.eventId === event.id);
            let displayStatus: RegistrationStatus = ticket.status as RegistrationStatus;
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
            const dateA = a.event?.date ? new Date(a.event.date).getTime() : 0;
            const dateB = b.event?.date ? new Date(b.event.date).getTime() : 0;
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

    const handleViewEvent = (eventId: string) => {
        router.push(buildRoute.hcpEvent(eventId));
    };

    const handleViewTicket = (ticketId: string, eventId: string) => {
        // Deep-link to My Files > Tickets
        const params = new URLSearchParams();
        params.set('tab', 'files');
        params.set('view', 'tickets');
        params.set('ticketId', ticketId);
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    const handleViewCertificate = (certificateId: string, eventId: string) => {
        // Deep-link to My Files > Certificates
        const params = new URLSearchParams();
        params.set('tab', 'files');
        params.set('view', 'certificates');
        params.set('certificateId', certificateId);
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8 text-[var(--secondary-label)]">
                    {language === 'ar' ? ' ...' : 'Loading registrations...'}
                </div>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <EmptyState
                title={language === 'ar' ? '  ' : 'No registrations'}
                description={language === 'ar' 
                    ? '    '
                    : 'Start by discovering and registering for events'}
                icon={Ticket}
                actionLabel={language === 'ar' ? ' ' : 'Discover events'}
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
            {/* Filters */}
            <div className="flex items-center justify-end gap-2">
                <Select value={yearFilter} onValueChange={(value) => setYearFilter(value as YearFilter)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? '' : 'All'}</SelectItem>
                        <SelectItem value="current">{language === 'ar' ? ' ' : 'This year'}</SelectItem>
                        <SelectItem value="last">{language === 'ar' ? ' ' : 'Last year'}</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? '' : 'All'}</SelectItem>
                        <SelectItem value="upcoming">{language === 'ar' ? '' : 'Upcoming'}</SelectItem>
                        <SelectItem value="past">{language === 'ar' ? '' : 'Past'}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredJourney.length > 0 ? (
                <div className="space-y-3">
                    {filteredJourney.map((item) => (
                        <div
                            key={item.event.id}
                            ref={(el) => {
                                if (el) cardRefs.current.set(item.event.id, el);
                            }}
                            data-event-id={item.event.id}
                            className="relative"
                        >
                            <div className="flex items-start gap-4">
                                {/* Timeline indicator */}
                                <div className="flex flex-col items-center pt-2">
                                    {/* Timeline dot */}
                                    {(() => {
                                        let dotColor = "bg-[var(--apple-blue)] border-[var(--apple-blue)]";
                                        if (item.status === 'past') {
                                            dotColor = item.registrationStatus === 'attended'
                                                ? "bg-[var(--apple-green)] border-[var(--apple-green)]"
                                                : "bg-red-500 border-red-500";
                                        }
                                        return (
                                            <div className={cn("w-3 h-3 rounded-full border-2 flex-shrink-0", dotColor)} />
                                        );
                                    })()}
                                    {/* Timeline connector line - only show if not the last item */}
                                    {filteredJourney.indexOf(item) < filteredJourney.length - 1 && (
                                        <div className="w-0.5 min-h-[60px] bg-[var(--separator)] mt-1" />
                                    )}
                                </div>

                                {/* Activity Card in row variant */}
                                <div className="flex-1">
                                    <ActivityCard
                                        event={item.event}
                                        context="hcp"
                                        variant="row"
                                        isRegistered={true}
                                        isPast={item.status === 'past'}
                                        registrationStatus={item.registrationStatus}
                                        hasCertificate={!!item.certificate}
                                        showDescription={false}
                                    />

                                    {/* Deep-link actions */}
                                    <div className="flex items-center gap-3 mt-2 ml-7 text-sm">
                                        <button onClick={() => handleViewEvent(item.event.id)}
                                            className="text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline"
                                        >
                                            {language === 'ar' ? ' ' : 'View event'}
                                        </button>
                                        {item.ticket && (
                                            <button onClick={() => handleViewTicket(item.ticket.id, item.event.id)}
                                                className="text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline"
                                            >
                                                {language === 'ar' ? ' ' : 'View ticket'}
                                            </button>
                                        )}
                                        {item.certificate && (
                                            <button onClick={() => handleViewCertificate(item.certificate!.id, item.event.id)}
                                                className="text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline"
                                            >
                                                {language === 'ar' ? ' ' : 'View certificate'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={language === 'ar' ? '  ' : 'No activities'}
                    description={language === 'ar' 
                        ? '     '
                        : 'No activities match the selected filters'}
                    icon={Ticket}
                />
            )}
        </div>
    );
}

