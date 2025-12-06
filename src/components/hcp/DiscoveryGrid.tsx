"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Search, X } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/context/LanguageContext";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { buildRoute } from "@/lib/routes";
import type { DemoCertificate, DemoEvent, DemoReview, DemoTicket } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";

export default function DiscoveryGrid() {
    const router = useRouter();
    const { showToast } = useToast();
    const { t, language } = useLanguage();
    const [events, setEvents] = useState<DemoEvent[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
    const [eventsError, setEventsError] = useState<string>('');
    const [summary, setSummary] = useState<{ tickets: DemoTicket[]; certificates: DemoCertificate[]; reviews: DemoReview[] }>({
        tickets: [],
        certificates: [],
        reviews: [],
    });
    const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
    const [lastTicket, setLastTicket] = useState<{ ticketId: string; status: string } | null>(null);

    const mapToEventCard = (event: DemoEvent): Event => ({
        id: event.id,
        titleAr: event.titleAr ?? event.title ?? '',
        titleEn: event.titleEn ?? event.title ?? 'Event',
        organizerAr: event.organizerAr ?? '',
        organizerEn: event.organizerEn ?? 'Organizer',
        specialty: event.specialty ?? 'General',
        cme_hours: event.cme_hours ?? 0,
        date: event.date ?? new Date().toISOString(),
        locationAr: event.locationAr ?? '',
        locationEn: event.locationEn ?? 'Location',
        status:
            event.status === 'published'
                ? 'Published'
                : event.status === 'pending_review'
                ? 'Pending Approval'
                : 'Draft',
        is_sponsored: !!event.is_sponsored,
        needs_sponsorship: !!event.needs_sponsorship,
        sfda_license: event.sfda_license,
        descriptionAr: event.descriptionAr ?? '',
        descriptionEn: event.descriptionEn ?? '',
        assignedToEventManager: false,
    });

    const publishedEvents = useMemo(
        () => events.filter(e => e.status?.toLowerCase?.() === 'published').map(mapToEventCard),
        [events]
    );

    // Get unique specialties for filter buttons
    const uniqueSpecialties = useMemo(() => {
        const specialties = new Set(publishedEvents.map(e => e.specialty).filter(Boolean));
        return Array.from(specialties).sort();
    }, [publishedEvents]);

    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter events based on selected specialty and search query
    const filteredEvents = useMemo(() => {
        let filtered = publishedEvents;
        
        if (selectedSpecialty) {
            filtered = filtered.filter(e => e.specialty === selectedSpecialty);
        }
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e => {
                const titleAr = e.titleAr?.toLowerCase() || '';
                const titleEn = e.titleEn?.toLowerCase() || '';
                const organizerAr = e.organizerAr?.toLowerCase() || '';
                const organizerEn = e.organizerEn?.toLowerCase() || '';
                const locationAr = e.locationAr?.toLowerCase() || '';
                const locationEn = e.locationEn?.toLowerCase() || '';
                return titleAr.includes(query) || titleEn.includes(query) ||
                       organizerAr.includes(query) || organizerEn.includes(query) ||
                       locationAr.includes(query) || locationEn.includes(query);
            });
        }
        
        return filtered;
    }, [publishedEvents, selectedSpecialty, searchQuery]);
    const myRegistrations = summary.tickets;
    const myRegisteredEvents = useMemo(
        () =>
            events
                .filter((ev) => myRegistrations.some((t) => t.eventId === ev.id))
                .map(mapToEventCard),
        [events, myRegistrations]
    );
    const myCmeHours = useMemo(() => {
        return myRegistrations.reduce((acc, ticket) => {
            const ev = events.find((e) => e.id === ticket.eventId);
            const hours = ev?.cme_hours ?? 0;
            return ticket.status === 'attended' ? acc + hours : acc;
        }, 0);
    }, [events, myRegistrations]);

    const recommendedEvents = useMemo(() => {
        const registeredEventIds = Array.from(registeredIds);
        const registeredEvents = filteredEvents.filter(e => registeredEventIds.includes(e.id));
        const userSpecialties = new Set(registeredEvents.map(e => e.specialty));
        const now = Date.now();

        return filteredEvents
            .filter(e => !registeredEventIds.includes(e.id))
            .map(event => {
                let score = 0;
                if (userSpecialties.has(event.specialty)) score += 3;
                if (event.cme_hours >= 12) score += 2;
                const daysUntil = Math.floor((new Date(event.date).getTime() - now) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0 && daysUntil <= 60) score += 2;
                if (event.is_sponsored) score += 1;
                return { event, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.event);
    }, [filteredEvents, registeredIds]);

    const fetchEvents = async () => {
        setIsLoadingEvents(true);
        setEventsError('');
        try {
            // Use data source layer (demo mode or real API)
            const { getAllEventsFull } = await import('@/lib/dataSource');
            const events = await getAllEventsFull();
            // For demo mode, all events are considered published
            // In real mode, filter by status
            setEvents(events);
        } catch (err) {
            const message = err instanceof Error ? err.message : t('errors.generic');
            setEventsError(message);
            showToast(message, "info");
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const fetchSummary = async () => {
        try {
            // Use data source layer (demo mode or real API)
            const { getHcpSummaryFull } = await import('@/lib/dataSource');
            const summary = await getHcpSummaryFull('hcp-1');
            setSummary({ tickets: summary.tickets, certificates: summary.certificates, reviews: summary.reviews });
            setRegisteredIds(new Set(summary.tickets.map((ticket: DemoTicket) => ticket.eventId)));
        } catch (err) {
            const message = err instanceof Error ? err.message : t('errors.generic');
            showToast(message, "info");
        }
    };

    useEffect(() => {
        // Data layer works immediately, no MSW waiting needed
            fetchEvents();
            fetchSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRegister = async (eventId: string) => {
        try {
            const res = await api.createRegistration({ eventId, hcpId: 'hcp-1' });
            setRegisteredIds(prev => new Set(prev).add(eventId));
            setLastTicket({ ticketId: res.ticketId, status: res.status });
            await fetchSummary();
            showToast(t('hcp.registrationSuccess'), "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : t('errors.generic');
            showToast(message, "info");
        }
    };

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {eventsError && (
                <div className="text-sm text-[var(--apple-red)]">{eventsError}</div>
            )}

            {/* Specialty Filter Buttons */}
            {uniqueSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <GlassButton
                        variant={selectedSpecialty === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSpecialty(null)}
                        className="text-sm"
                    >
                        {language === 'ar' ? '' : 'All'}
                    </GlassButton>
                    {uniqueSpecialties.map((specialty) => (
                        <GlassButton
                            key={specialty}
                            variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSpecialty(specialty)}
                            className="text-sm"
                        >
                            {specialty}
                        </GlassButton>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--secondary-label)]" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('hcp.searchPlaceholder') || (language === 'ar' ? '  ...' : 'Search events...')}
                    className="pl-10 pr-10 w-full"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                        aria-label={language === 'ar' ? ' ' : 'Clear search'}
                    >
                        <X className="w-4 h-4 text-[var(--secondary-label)]" />
                    </button>
                )}
            </div>

            {/* AI Recommendations Section */}
            {recommendedEvents.length > 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="border-2 border-[var(--apple-purple)]/30">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[var(--apple-purple)]/10">
                                <Sparkles className="w-5 h-5 text-[var(--apple-purple)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--label)]">
                                    {language === 'ar' ? '   ' : 'Recommended for You'}
                                </h3>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' 
                                        ? '   ' 
                                        : 'Based on your interests and history'}
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {recommendedEvents.map((event) => {
                                const isRegistered = registeredIds.has(event.id);
                                const handleView = () => {
                                    if (isRegistered) {
                                        // Navigate to My Files tab (tickets section) with ticketId
                                        // First find the ticket for this event
                                        const ticket = summary.tickets.find(t => t.eventId === event.id);
                                        if (ticket) {
                                            const params = new URLSearchParams();
                                            params.set('tab', 'files');
                                            params.set('section', 'tickets');
                                            params.set('ticketId', ticket.id);
                                            router.push(`/dashboard/hcp?${params.toString()}`);
                                        } else {
                                            // Fallback to My Journey if no ticket found
                                            const params = new URLSearchParams();
                                            params.set('tab', 'registrations');
                                            params.set('eventId', event.id);
                                            router.push(`/dashboard/hcp?${params.toString()}`);
                                        }
                                    } else {
                                        // Navigate to event details
                                        router.push(buildRoute.hcpEvent(event.id));
                                    }
                                };
                                return (
                                    <ActivityCard
                                        key={event.id}
                                        event={event}
                                        context="hcp"
                                        variant="full"
                                        isRegistered={isRegistered}
                                        onRegister={() => handleRegister(event.id)}
                                        onView={handleView}
                                        showDescription={true}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </LiquidGlassCard>
            )}

            {/* Your Registrations */}
            {myRegisteredEvents.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                        {language === 'ar' ? '' : 'Your registrations'}
                    </h3>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {myRegisteredEvents.map((event) => {
                            const handleView = () => {
                                // Navigate to My Files tab (tickets section) with ticketId
                                const ticket = summary.tickets.find(t => t.eventId === event.id);
                                if (ticket) {
                                    const params = new URLSearchParams();
                                    params.set('tab', 'files');
                                    params.set('section', 'tickets');
                                    params.set('ticketId', ticket.id);
                                    router.push(`/dashboard/hcp?${params.toString()}`);
                                } else {
                                    // Fallback to My Journey if no ticket found
                                    const params = new URLSearchParams();
                                    params.set('tab', 'registrations');
                                    params.set('eventId', event.id);
                                    router.push(`/dashboard/hcp?${params.toString()}`);
                                }
                            };
                            return (
                                <ActivityCard
                                key={event.id}
                                event={event}
                                context="hcp"
                                variant="full"
                                    isRegistered={true}
                                    onView={handleView}
                                showDescription={true}
                            />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* All Events */}
            <div>
                <h3 className="text-xl font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? ' ' : 'All Events'}
                </h3>
                {isLoadingEvents ? (
                    <div className="text-center py-8 text-[var(--secondary-label)]">
                        {language === 'ar' ? ' ...' : 'Loading events...'}
                    </div>
                ) : eventsError ? (
                    <LiquidGlassCard blurIntensity="md" className="p-6 text-center">
                        <p className="text-[var(--apple-red)]">{eventsError}</p>
                    </LiquidGlassCard>
                ) : filteredEvents.length === 0 ? (
                    <EmptyState
                        title={language === 'ar' ? '   ' : 'No events available'}
                        description={language === 'ar' ? '     ' : 'No events match the selected filters'}
                        icon={Sparkles}
                    />
                ) : (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => {
                        const isRegistered = registeredIds.has(event.id);
                            const handleView = () => {
                                if (isRegistered) {
                                    // Navigate to My Registrations tab with eventId
                                    const params = new URLSearchParams();
                                    params.set('tab', 'registrations');
                                    params.set('eventId', event.id);
                                    router.push(`/dashboard/hcp?${params.toString()}`);
                                } else {
                                    // Navigate to event details
                                    router.push(buildRoute.hcpEvent(event.id));
                                }
                            };
                        return (
                                <ActivityCard
                                key={event.id}
                                event={event}
                                context="hcp"
                                variant="full"
                                    isRegistered={isRegistered}
                                    onRegister={() => handleRegister(event.id)}
                                    onView={handleView}
                                showDescription={true}
                            />
                        );
                    })}
                    </div>
                )}
            </div>

            {lastTicket && (
                <div className="rounded-lg border bg-white/70 p-3 text-sm">
                    <div className="font-semibold text-[var(--label)]">{t('hcp.ticketConfirmation') ?? 'Ticket confirmation'}</div>
                    <div className="text-[var(--secondary-label)]">
                        {t('hcp.ticketId') ?? 'Ticket'}: {lastTicket.ticketId} — {lastTicket.status}
                    </div>
                </div>
            )}
        </div>
    );
}
