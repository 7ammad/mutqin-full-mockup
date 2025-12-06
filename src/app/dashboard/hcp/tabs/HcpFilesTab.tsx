"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/components/ui/toast-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { Ticket, Award, Calendar, MapPin, Clock, ExternalLink, Download, ShieldCheck, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from "@/components/shared/TicketCard";
import { CertificateCard } from "@/components/shared/CertificateCard";
import { buildRoute } from "@/lib/routes";
import { getHcpActivities, getHcpSummary, getState } from "@/context/demoStore";
import { formatDate } from "@/lib/eventTranslations";
import { cn } from "@/lib/utils";
import { getEventTitle, getEventLocation, getEventOrganizer } from "@/lib/eventTranslations";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import type { DemoEvent, DemoTicket, DemoCertificate } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";

type UpcomingTicketFilter = 'all' | 'this_week' | 'this_month';
type PastTicketFilter = 'all' | string; // year string or 'all'
type CertFilter = 'all' | 'this_year' | 'last_year';
type CertSort = 'date' | 'hours';
type ViewMode = 'tickets' | 'certificates';

interface TicketWithEvent {
    ticket: DemoTicket;
    event: Event;
    status: 'upcoming' | 'past';
}

interface CertificateWithEvent {
    certificate: DemoCertificate;
    event: Event;
}

export function HcpFilesTab() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const [tickets, setTickets] = useState<DemoTicket[]>([]);
    const [events, setEvents] = useState<DemoEvent[]>([]);
    const [certificates, setCertificates] = useState<DemoCertificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [upcomingTicketFilter, setUpcomingTicketFilter] = useState<UpcomingTicketFilter>('all');
    const [pastTicketFilter, setPastTicketFilter] = useState<PastTicketFilter>('all');
    const [certFilter, setCertFilter] = useState<CertFilter>('all');
    const [certSort, setCertSort] = useState<CertSort>('date');
    
    // Get view mode from URL or default to tickets (defensive: unknown view -> tickets)
    const urlView = searchParams.get('view') as ViewMode | null;
    const [viewMode, setViewMode] = useState<ViewMode>(
        urlView === 'certificates' || urlView === 'tickets' ? urlView : 'tickets'
    );
    
    // Deep-link params
    const focusEventId = searchParams.get('eventId');
    const focusTicketId = searchParams.get('ticketId');
    const focusCertificateId = searchParams.get('certificateId');
    
    const ticketRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const certRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Sync view mode with URL
    useEffect(() => {
        if (urlView === 'certificates' || urlView === 'tickets') {
            setViewMode(urlView);
        }
    }, [urlView]);

    // Auto-switch view mode based on deep-link params
    useEffect(() => {
        if (focusTicketId && viewMode !== 'tickets') {
            setViewMode('tickets');
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', 'tickets');
            router.replace(`/dashboard/hcp?${params.toString()}`, { scroll: false });
        } else if (focusCertificateId && viewMode !== 'certificates') {
            setViewMode('certificates');
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', 'certificates');
            router.replace(`/dashboard/hcp?${params.toString()}`, { scroll: false });
        }
    }, [focusTicketId, focusCertificateId, viewMode, searchParams, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hcpId = "hcp-1";
                const { getAllEventsFull, getHcpSummaryFull } = await import('@/lib/dataSource');
                
                const summary = await getHcpSummaryFull(hcpId);
                setTickets(summary.tickets);
                setCertificates(summary.certificates);
                
                const eventIds = summary.tickets.map((t: DemoTicket) => t.eventId);
                if (eventIds.length > 0) {
                    const allEvents = await getAllEventsFull();
                    const eventsData = allEvents.filter(e => eventIds.includes(e.id));
                    setEvents(eventsData);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load files';
                console.error('Error fetching files:', err);
                showToast(message, 'info');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    // Process tickets with events and split into upcoming/past
    const { upcomingTickets, pastTickets } = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const ticketsWithEvents: TicketWithEvent[] = tickets
            .map(ticket => {
                const event = events.find(e => e.id === ticket.eventId);
                if (!event) return null;

                const eventDate = event.date ? new Date(event.date) : null;
                let status: 'upcoming' | 'past' = 'upcoming';
                
                if (eventDate) {
                    const eventDateOnly = new Date(eventDate);
                    eventDateOnly.setHours(0, 0, 0, 0);
                    status = eventDateOnly >= now ? 'upcoming' : 'past';
                }

                return {
                    ticket,
                    event: convertDemoEventToEvent(event),
                    status,
                };
            })
            .filter((item): item is TicketWithEvent => item !== null);

        const upcoming = ticketsWithEvents.filter(t => t.status === 'upcoming');
        const past = ticketsWithEvents.filter(t => t.status === 'past');

        return {
            upcomingTickets: upcoming.sort((a, b) => {
                const dateA = a.event.date ? new Date(a.event.date).getTime() : 0;
                const dateB = b.event.date ? new Date(b.event.date).getTime() : 0;
                return dateA - dateB; // Soonest first
            }),
            pastTickets: past.sort((a, b) => {
                const dateA = a.event.date ? new Date(a.event.date).getTime() : 0;
                const dateB = b.event.date ? new Date(b.event.date).getTime() : 0;
                return dateB - dateA; // Most recent first
            }),
        };
    }, [tickets, events]);

    // Filter upcoming tickets
    const filteredUpcomingTickets = useMemo(() => {
        let filtered = upcomingTickets;
        
        if (upcomingTicketFilter === 'this_week') {
            const now = new Date();
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(t => {
                if (!t.event.date) return false;
                const eventDate = new Date(t.event.date);
                return eventDate >= now && eventDate <= weekFromNow;
            });
        } else if (upcomingTicketFilter === 'this_month') {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            filtered = filtered.filter(t => {
                if (!t.event.date) return false;
                const eventDate = new Date(t.event.date);
                return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
            });
        }
        
        return filtered;
    }, [upcomingTickets, upcomingTicketFilter]);

    // Filter past tickets
    const filteredPastTickets = useMemo(() => {
        let filtered = pastTickets;
        
        if (pastTicketFilter !== 'all') {
            const year = parseInt(pastTicketFilter);
            if (!isNaN(year)) {
                filtered = filtered.filter(t => {
                    if (!t.event.date) return false;
                    return new Date(t.event.date).getFullYear() === year;
                });
            }
        }
        
        return filtered;
    }, [pastTickets, pastTicketFilter]);

    // Get available years for past tickets filter
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        pastTickets.forEach(t => {
            if (t.event.date) {
                const year = new Date(t.event.date).getFullYear();
                years.add(year);
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [pastTickets]);

    // Process certificates with events
    const certificatesWithEvents = useMemo(() => {
        const current = getState();
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        return certificates
            .map(cert => {
                const event = current.events.find(e => e.id === cert.eventId);
                if (!event) return null;
                
                // Filter out certificates for future events
                const eventDate = event.date ? new Date(event.date) : null;
                if (eventDate && eventDate > now) {
                    return null;
                }
                
                return {
                    certificate: cert,
                    event: convertDemoEventToEvent(event),
                } as CertificateWithEvent;
            })
            .filter((item): item is CertificateWithEvent => item !== null && item.event !== null);
    }, [certificates]);

    // Filter and sort certificates
    const filteredCertificates = useMemo(() => {
        let filtered = certificatesWithEvents.filter(item => item.event !== null);
        
        // Year filter
        if (certFilter === 'this_year') {
            const currentYear = new Date().getFullYear();
            filtered = filtered.filter(item => {
                if (!item.certificate.issuedAt || !item.event) return false;
                return new Date(item.certificate.issuedAt).getFullYear() === currentYear;
            });
        } else if (certFilter === 'last_year') {
            const lastYear = new Date().getFullYear() - 1;
            filtered = filtered.filter(item => {
                if (!item.certificate.issuedAt || !item.event) return false;
                return new Date(item.certificate.issuedAt).getFullYear() === lastYear;
            });
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (certSort === 'date') {
                const dateA = a.certificate.issuedAt ? new Date(a.certificate.issuedAt).getTime() : 0;
                const dateB = b.certificate.issuedAt ? new Date(b.certificate.issuedAt).getTime() : 0;
                return dateB - dateA; // Most recent first
            } else {
                const hoursA = a.event?.cme_hours || 0;
                const hoursB = b.event?.cme_hours || 0;
                return hoursB - hoursA; // Most hours first
            }
        });
        
        return filtered;
    }, [certificatesWithEvents, certFilter, certSort]);

    // Deep-link: scroll to focused ticket/certificate
    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(() => {
            if (viewMode === 'tickets' && focusTicketId) {
                const ticketElement = ticketRefs.current.get(focusTicketId);
                if (ticketElement) {
                    ticketElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ticketElement.classList.add('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                    setTimeout(() => {
                        ticketElement.classList.remove('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                    }, 2000);
                }
            } else if (viewMode === 'tickets' && focusEventId) {
                const ticketItem = [...upcomingTickets, ...pastTickets].find(t => t.event.id === focusEventId);
                if (ticketItem) {
                    const ticketElement = ticketRefs.current.get(ticketItem.ticket.id);
                    if (ticketElement) {
                        ticketElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        ticketElement.classList.add('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                        setTimeout(() => {
                            ticketElement.classList.remove('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                        }, 2000);
                    }
                }
            } else if (viewMode === 'certificates' && focusCertificateId) {
                const certElement = certRefs.current.get(focusCertificateId);
                if (certElement) {
                    certElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    certElement.classList.add('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                    setTimeout(() => {
                        certElement.classList.remove('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                    }, 2000);
                }
            } else if (viewMode === 'certificates' && focusEventId) {
                const certItem = certificatesWithEvents.find(c => c.event && c.event.id === focusEventId);
                if (certItem && certItem.event) {
                    const certElement = certRefs.current.get(certItem.certificate.id);
                    if (certElement) {
                        certElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        certElement.classList.add('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                        setTimeout(() => {
                            certElement.classList.remove('ring-2', 'ring-[var(--apple-green)]', 'ring-offset-2');
                        }, 2000);
                    }
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [focusTicketId, focusCertificateId, focusEventId, viewMode, loading, upcomingTickets, pastTickets, certificatesWithEvents]);

    const handleOpenTicket = (ticketId: string) => {
        router.push(buildRoute.hcpTicket(ticketId));
    };

    const handleOpenCertificate = (certificateId: string) => {
        router.push(buildRoute.hcpCertificate(certificateId));
    };

    const handleViewDetails = (eventId: string) => {
        router.push(buildRoute.hcpEvent(eventId));
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', 'files');
        params.set('view', mode);
        // Clear deep-link params when switching views
        params.delete('ticketId');
        params.delete('certificateId');
        params.delete('eventId');
        router.replace(`/dashboard/hcp?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8 text-[var(--secondary-label)]">
                    {language === 'ar' ? ' ...' : 'Loading files...'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Segmented Control */}
            <div className="flex items-center justify-center">
                <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--system-fill)]/30 dark:bg-[var(--system-fill)]/20 p-1">
                    <GlassButton
                        variant={viewMode === 'tickets' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewModeChange('tickets')}
                        className={cn(
                            "text-xs px-4 gap-2",
                            viewMode === 'tickets' && "bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]"
                        )}
                    >
                        <Ticket className="h-3.5 w-3.5" />
                        {language === 'ar' ? '' : 'My Tickets'}
                    </GlassButton>
                    <GlassButton
                        variant={viewMode === 'certificates' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleViewModeChange('certificates')}
                        className={cn(
                            "text-xs px-4 gap-2",
                            viewMode === 'certificates' && "bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]"
                        )}
                    >
                        <Award className="h-3.5 w-3.5" />
                        {language === 'ar' ? '' : 'My Certificates'}
                    </GlassButton>
                </div>
            </div>

            {/* Tickets View */}
            {viewMode === 'tickets' && (
                <div className="space-y-8">
                    {/* Upcoming Tickets */}
                    {filteredUpcomingTickets.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h3 className="text-lg font-semibold text-[var(--label)]">
                                    {language === 'ar' ? ' ' : 'Upcoming tickets'}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <GlassButton
                                        variant={upcomingTicketFilter === 'all' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setUpcomingTicketFilter('all')}
                                        className="text-xs"
                                    >
                                        {language === 'ar' ? '' : 'All'}
                                    </GlassButton>
                                    <GlassButton
                                        variant={upcomingTicketFilter === 'this_week' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setUpcomingTicketFilter('this_week')}
                                        className="text-xs"
                                    >
                                        {language === 'ar' ? ' ' : 'This week'}
                                    </GlassButton>
                                    <GlassButton
                                        variant={upcomingTicketFilter === 'this_month' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setUpcomingTicketFilter('this_month')}
                                        className="text-xs"
                                    >
                                        {language === 'ar' ? ' ' : 'This month'}
                                    </GlassButton>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredUpcomingTickets.map((item) => (
                                    <div
                                        key={item.ticket.id}
                                        ref={(el) => {
                                            if (el) ticketRefs.current.set(item.ticket.id, el);
                                        }}
                                        data-ticket-id={item.ticket.id}
                                        data-event-id={item.event.id}
                                    >
                                        <TicketCard
                                            event={item.event}
                                            status="upcoming"
                                            registrationStatus="confirmed"
                                            onOpenTicket={() => handleOpenTicket(item.ticket.id)}
                                            onViewDetails={() => handleViewDetails(item.event.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Tickets */}
                    {filteredPastTickets.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h3 className="text-lg font-semibold text-[var(--label)]">
                                    {language === 'ar' ? ' ' : 'Past tickets'}
                                </h3>
                                <Select value={pastTicketFilter} onValueChange={setPastTicketFilter}>
                                    <SelectTrigger className="w-[140px] h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{language === 'ar' ? '' : 'All'}</SelectItem>
                                        {availableYears.map(year => (
                                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredPastTickets.map((item) => {
                                    const registrationStatus: 'attended' | 'missed' = item.ticket.status === 'attended' ? 'attended' : 'missed';
                                    return (
                                        <div
                                            key={item.ticket.id}
                                            ref={(el) => {
                                                if (el) ticketRefs.current.set(item.ticket.id, el);
                                            }}
                                            data-ticket-id={item.ticket.id}
                                            data-event-id={item.event.id}
                                        >
                                            <TicketCard
                                                event={item.event}
                                                status="past"
                                                registrationStatus={registrationStatus}
                                                onOpenTicket={() => handleOpenTicket(item.ticket.id)}
                                                onViewDetails={() => handleViewDetails(item.event.id)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredUpcomingTickets.length === 0 && filteredPastTickets.length === 0 && (
                        <EmptyState
                            title={language === 'ar' ? '  ' : 'No tickets'}
                            description={language === 'ar' 
                                ? '     '
                                : 'Register for an event to start viewing tickets'}
                            icon={Ticket}
                            actionLabel={language === 'ar' ? ' ' : 'Discover activities'}
                            onAction={() => {
                                const params = new URLSearchParams();
                                params.set('tab', 'discover');
                                router.push(`/dashboard/hcp?${params.toString()}`);
                            }}
                        />
                    )}
                </div>
            )}

            {/* Certificates View */}
            {viewMode === 'certificates' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h3 className="text-lg font-semibold text-[var(--label)]">
                            {language === 'ar' ? ' ' : 'Certificates library'}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                                <GlassButton
                                    variant={certFilter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCertFilter('all')}
                                    className="text-xs"
                                >
                                    {language === 'ar' ? '' : 'All'}
                                </GlassButton>
                                <GlassButton
                                    variant={certFilter === 'this_year' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCertFilter('this_year')}
                                    className="text-xs"
                                >
                                    {language === 'ar' ? ' ' : 'This year'}
                                </GlassButton>
                                <GlassButton
                                    variant={certFilter === 'last_year' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCertFilter('last_year')}
                                    className="text-xs"
                                >
                                    {language === 'ar' ? ' ' : 'Last year'}
                                </GlassButton>
                            </div>
                            <Select value={certSort} onValueChange={(value) => setCertSort(value as CertSort)}>
                                <SelectTrigger className="w-[120px] h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">{language === 'ar' ? '' : 'Date'}</SelectItem>
                                    <SelectItem value="hours">{language === 'ar' ? '' : 'Hours'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Certificates Grid */}
                    {filteredCertificates.length === 0 ? (
                        <EmptyState
                            title={language === 'ar' ? '  ' : 'No certificates'}
                            description={language === 'ar' 
                                ? '       '
                                : 'Attend events and complete attendance requirements to earn certificates'}
                            icon={Award}
                            actionLabel={language === 'ar' ? ' ' : 'Discover activities'}
                            onAction={() => {
                                const params = new URLSearchParams();
                                params.set('tab', 'discover');
                                router.push(`/dashboard/hcp?${params.toString()}`);
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCertificates.map((item) => {
                                if (!item.event) return null;
                                return (
                                    <div
                                        key={item.certificate.id}
                                        ref={(el) => {
                                            if (el) certRefs.current.set(item.certificate.id, el);
                                        }}
                                        data-certificate-id={item.certificate.id}
                                        data-event-id={item.event.id}
                                    >
                                        <CertificateCard
                                            event={item.event}
                                            issuedAt={item.certificate.issuedAt}
                                            onDownload={() => handleOpenCertificate(item.certificate.id)}
                                            onViewDetails={() => handleViewDetails(item.event.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

