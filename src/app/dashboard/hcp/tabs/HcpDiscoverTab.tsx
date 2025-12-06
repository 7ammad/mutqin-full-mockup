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
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";
import type { DemoCertificate, DemoEvent, DemoReview, DemoTicket } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";

export function HcpDiscoverTab() {
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
        titleAr: event.titleAr ?? event.title ?? 'الفعالية',
        titleEn: event.titleEn ?? event.title ?? 'Event',
        organizerAr: event.organizerAr ?? 'المنظم',
        organizerEn: event.organizerEn ?? 'Organizer',
        specialty: event.specialty ?? 'General',
        cme_hours: event.cme_hours ?? 0,
        date: event.date ?? new Date().toISOString(),
        locationAr: event.locationAr ?? 'الموقع',
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
                .filter(e => myRegistrations.some(t => t.eventId === e.id))
                .map(mapToEventCard),
        [events, myRegistrations]
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingEvents(true);
                setEventsError('');

                const { getHcpActivities, getHcpSummary } = await import('@/context/demoStore');
                const activitiesData = getHcpActivities("hcp-1");
                const summaryData = getHcpSummary("hcp-1");
                
                // Convert discover items to DemoEvent format
                const { getAllEventsFull } = await import('@/lib/dataSource');
                const allEvents = await getAllEventsFull();
                const discoverEventIds = new Set(activitiesData.discover.map((item: any) => item.activityId));
                const discoverEvents = allEvents.filter((e: DemoEvent) => discoverEventIds.has(e.id));
                setEvents(discoverEvents);

                setSummary({
                    tickets: summaryData.tickets || [],
                    certificates: summaryData.certificates || [],
                    reviews: summaryData.reviews || [],
                });
                const registeredSet = new Set((summaryData.tickets || []).map((t: DemoTicket) => t.eventId));
                setRegisteredIds(registeredSet);
            } catch (err) {
                console.error('Error loading discover data:', err);
                setEventsError(err instanceof Error ? err.message : 'Failed to load events');
            } finally {
                setIsLoadingEvents(false);
            }
        };

        loadData();
    }, []);

    const handleRegister = async (eventId: string) => {
        try {
            const res = await api.createRegistration({ eventId, hcpId: "hcp-1" });
            if (res.ok) {
                showToast(
                    t('common.registrationSuccessful'),
                    'success'
                );
                setRegisteredIds(prev => new Set([...prev, eventId]));
                setLastTicket({ ticketId: res.ticketId, status: res.status || 'confirmed' });
            } else {
                showToast(
                    t('common.registrationFailed'),
                    'info'
                );
            }
            } catch (err) {
                showToast(
                    t('common.registrationFailed'),
                    'info'
                );
            }
    };

    const handleView = (eventId: string, isRegistered: boolean) => {
        if (isRegistered) {
            // Navigate to My Journey tab with eventId
            const params = new URLSearchParams();
            params.set('tab', 'journey');
            params.set('eventId', eventId);
            router.push(`/dashboard/hcp?${params.toString()}`);
        } else {
            // Navigate to event details
            router.push(buildRoute.hcpEvent(eventId));
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
                <div className={cn(
                    "flex items-center gap-3",
                    language === 'ar' ? 'justify-end' : 'justify-start'
                )}>
                    <div className="relative flex-1 max-w-md">
                        <Search className={cn(
                            "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]",
                            language === 'ar' ? 'right-3' : 'left-3'
                        )} />
                        <Input
                            type="text"
                            placeholder={language === 'ar' ? 'ابحث عن فعالية...' : 'Search for an event...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                language === 'ar' ? 'pr-10' : 'pl-10',
                                language === 'ar' ? 'text-right' : 'text-left'
                            )}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}
                                className={cn(
                                    "absolute top-1/2 transform -translate-y-1/2",
                                    language === 'ar' ? 'left-3' : 'right-3'
                                )}
                            >
                                <X className="h-4 w-4 text-[var(--secondary-label)]" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Specialty Filter Buttons */}
                {uniqueSpecialties.length > 0 && (
                    <div className={cn(
                        "flex items-center gap-2 flex-wrap",
                        language === 'ar' ? 'justify-end' : 'justify-start'
                    )}>
                        <GlassButton
                            variant={selectedSpecialty === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSpecialty(null)}
                        >
                            {t('common.all')}
                        </GlassButton>
                        {uniqueSpecialties.map((specialty) => (
                            <GlassButton
                                key={specialty}
                                variant={selectedSpecialty === specialty ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty)}
                            >
                                {getSpecialtyLabel(specialty, language)}
                            </GlassButton>
                        ))}
                    </div>
                )}
            </div>

            {/* Events Grid */}
            {isLoadingEvents ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <LiquidGlassCard key={i} blurIntensity="lg" interactive={false} className="h-64">
                            <div />
                        </LiquidGlassCard>
                    ))}
                </div>
            ) : eventsError ? (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
                    <div className="text-center">
                        <p className="text-[var(--secondary-label)]">{eventsError}</p>
                    </div>
                </LiquidGlassCard>
            ) : filteredEvents.length === 0 ? (
                <EmptyState
                    title={language === 'ar' ? 'لا توجد فعاليات' : 'No events found'}
                    description={language === 'ar' 
                        ? 'لا توجد فعاليات تطابق البحث المحدد'
                        : 'No events match your search criteria'}
                    icon={Sparkles}
                />
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => {
                        const isRegistered = registeredIds.has(event.id);
                        return (
                            <ActivityCard
                                key={event.id}
                                event={event}
                                context="hcp"
                                variant="full"
                                isRegistered={isRegistered}
                                onRegister={() => handleRegister(event.id)}
                                onView={() => handleView(event.id, isRegistered)}
                                showDescription={true}
                            />
                        );
                    })}
                </div>
            )}

            {/* Your Registrations Section */}
            {myRegisteredEvents.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                        {language === 'ar' ? 'تسجيلاتك' : 'Your registrations'}
                    </h3>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {myRegisteredEvents.map((event) => {
                            const handleView = () => {
                                // Navigate to My Journey tab with eventId
                                const params = new URLSearchParams();
                                params.set('tab', 'journey');
                                params.set('eventId', event.id);
                                router.push(`/dashboard/hcp?${params.toString()}`);
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

            {/* Registration Success Toast */}
            {lastTicket && (
                <div
                    className="fixed bottom-4 right-4 bg-[var(--apple-green)] text-white px-4 py-2 rounded-lg shadow-lg z-50"
                    onClick={() => setLastTicket(null)}
                >
                    {t('common.registrationSuccessful')}
                </div>
            )}
        </div>
    );
}

