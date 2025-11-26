"use client";

import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/EventCard";

interface MarketplaceFeedProps {
    onSponsorClick: (eventId: string) => void;
}

export default function MarketplaceFeed({ onSponsorClick }: MarketplaceFeedProps) {
    const { events } = usePersona();
    const { t, language } = useLanguage();

    // Filter events that need sponsorship
    const opportunities = events.filter(e => e.needs_sponsorship && !e.is_sponsored);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{t('vendor.sponsorshipOpportunities')}</h2>
                <Badge variant="secondary" className="text-sm">
                    {opportunities.length} {t('vendor.activeOpportunities')}
                </Badge>
            </div>

            {opportunities.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[var(--separator)] rounded-ios">
                    <p className="text-[var(--secondary-label)]">{t('vendor.noOpportunities')}</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            variant="vendor"
                            showDescription={true}
                            sponsorshipPackage={{
                                name: t('vendor.goldPackage'),
                                value: 50000,
                            }}
                            actionButton={{
                                label: t('vendor.sponsorEvent'),
                                onClick: () => onSponsorClick(event.id),
                                variant: 'blue',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
