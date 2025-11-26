"use client";

import { usePersona } from "@/context/PersonaContext";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/context/LanguageContext";
import EventCard from "@/components/EventCard";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { useMemo } from "react";

export default function DiscoveryGrid() {
    const { events, registerForEvent, myTickets } = usePersona();
    const { showToast } = useToast();
    const { t, language } = useLanguage();
    const publishedEvents = events.filter(e => e.status === 'Published');

    // AI-powered recommendations based on user's registered events
    const recommendedEvents = useMemo(() => {
        const registeredEventIds = myTickets;
        const registeredEvents = events.filter(e => registeredEventIds.includes(e.id));

        // Get specialties from registered events
        const userSpecialties = new Set(registeredEvents.map(e => e.specialty));

        // Capture current time once outside of the map
        const now = Date.now();

        // Recommend events with matching specialties, high CME hours, and upcoming dates
        const recommendations = publishedEvents
            .filter(e => !registeredEventIds.includes(e.id))
            .map(event => {
                let score = 0;
                if (userSpecialties.has(event.specialty)) score += 3;
                if (event.cme_hours >= 12) score += 2;
                const daysUntil = Math.floor((new Date(event.date).getTime() - now) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0 && daysUntil <= 60) score += 2; // Upcoming within 60 days
                if (event.is_sponsored) score += 1; // Sponsored events get bonus
                return { event, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.event);

        return recommendations;
    }, [events, myTickets, publishedEvents]);

    const handleRegister = (eventId: string) => {
        registerForEvent(eventId);
        showToast(t('hcp.registrationSuccess'), "success");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{t('hcp.discoverEvents')}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {publishedEvents.length} {t('hcp.accreditedEvents')}
                    </p>
                </div>
            </div>

            {/* Global Search */}
            <GlobalSearch
                onSelect={(result) => {
                    if (result && 'id' in result) {
                        // Handle search result selection
                        console.log('Selected event:', result);
                    }
                }}
                placeholder={t('hcp.searchPlaceholder')}
            />

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
                                    {language === 'ar' ? 'فعاليات موصى بها لك' : 'Recommended for You'}
                                </h3>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' 
                                        ? 'بناءً على اهتماماتك وتاريخك' 
                                        : 'Based on your interests and history'}
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {recommendedEvents.map((event) => {
                                const isRegistered = myTickets.includes(event.id);
                                return (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        variant="default"
                                        showDescription={true}
                                        actionButton={{
                                            label: isRegistered ? t('hcp.registered') : t('hcp.registerNow'),
                                            onClick: () => handleRegister(event.id),
                                            variant: isRegistered ? 'disabled' : 'default',
                                            icon: isRegistered ? <CheckCircle2 className="h-4 w-4" /> : undefined,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </LiquidGlassCard>
            )}

            {/* All Events */}
            <div>
                <h3 className="text-xl font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? 'جميع الفعاليات' : 'All Events'}
                </h3>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {publishedEvents.map((event) => {
                        const isRegistered = myTickets.includes(event.id);
                        return (
                            <EventCard
                                key={event.id}
                                event={event}
                                variant="default"
                                showDescription={true}
                                actionButton={{
                                    label: isRegistered ? t('hcp.registered') : t('hcp.registerNow'),
                                    onClick: () => handleRegister(event.id),
                                    variant: isRegistered ? 'disabled' : 'default',
                                    icon: isRegistered ? <CheckCircle2 className="h-4 w-4" /> : undefined,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
