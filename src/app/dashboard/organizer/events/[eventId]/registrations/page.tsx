"use client";

import { use, useEffect, useState } from 'react';
import RegistrationManagement from '@/components/eventmanager/RegistrationManagement';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default function EventRegistrationsPage({ params }: PageProps) {
    const { eventId } = use(params);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getEventById({ eventId });
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
    }, [eventId]);

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Manage registrations for {event.titleEn || event.titleAr || 'Event'}
                </p>
            </div>
            <RegistrationManagement eventId={eventId} />
        </div>
    );
}

