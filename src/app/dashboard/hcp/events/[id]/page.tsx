"use client";

import { use, useEffect, useState } from 'react';
import { EventDetails } from '@/components/hcp/EventDetails';
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

export default function HCPEventDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            // Data layer works immediately, no MSW waiting needed
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

    // Convert DemoEvent to Event format for EventDetails component
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
            <EventDetails event={eventForComponent} />
        </div>
    );
}






