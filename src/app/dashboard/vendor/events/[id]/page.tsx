"use client";

import { use, useEffect, useState } from 'react';
import { EventDetails } from '@/components/hcp/EventDetails';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Building2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoEvent } from '@/context/demoSeed';
import type { Event } from '@/lib/mockData';
import { convertDemoStatusToEventStatus } from '@/lib/eventStatusConverter';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function VendorEventSponsorshipPage({ params }: PageProps) {
    const { id } = use(params);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getEventById({ eventId: id });
                setEvent(res.event);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load event';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return <LoadingSkeleton variant="card" />;
    }

    if (error) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--apple-red)]">
                    {error}
                </div>
            </LiquidGlassCard>
        );
    }

    if (!event) {
        notFound();
    }

    // Convert DemoEvent to Event format
    const eventForComponent: Event = {
        id: event.id,
        titleEn: event.titleEn || '',
        titleAr: event.titleAr || '',
        descriptionEn: event.descriptionEn || '',
        descriptionAr: event.descriptionAr || '',
        date: event.date || new Date().toISOString(),
        locationEn: event.locationEn || '',
        locationAr: event.locationAr || '',
        cme_hours: event.cme_hours || 0,
        status: convertDemoStatusToEventStatus(event.status || 'draft'),
        specialty: event.specialty || '',
        organizerAr: event.organizerAr || '',
        organizerEn: event.organizerEn || '',
        is_sponsored: event.is_sponsored || false,
        needs_sponsorship: event.needs_sponsorship || false,
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Event Sponsorship
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Review event details and sponsorship opportunities
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EventDetails event={eventForComponent} variant="vendor" />
                </div>

                <Card className="p-6 lg:col-span-1">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                            Sponsorship Packages
                        </h2>
                        <div className="space-y-3">
                            <div className="p-4 border border-[var(--separator)] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-[var(--label)]">Gold</span>
                                    <span className="text-sm text-[var(--secondary-label)] flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        50,000 SAR
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    Premium visibility and branding
                                </p>
                            </div>
                            <div className="p-4 border border-[var(--separator)] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-[var(--label)]">Silver</span>
                                    <span className="text-sm text-[var(--secondary-label)] flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        30,000 SAR
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    Standard sponsorship package
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full flex items-center justify-center gap-2" size="lg">
                        <Building2 className="h-4 w-4 mr-2" />
                        Sponsor This Event
                    </Button>
                </Card>
            </div>
        </div>
    );
}






