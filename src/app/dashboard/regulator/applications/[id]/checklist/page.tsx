"use client";

import { use, useEffect, useState } from 'react';
import StandardsChecklist from '@/components/regulator/StandardsChecklist';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ComplianceChecklistPage({ params }: PageProps) {
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
                const message = err instanceof Error ? err.message : 'Failed to load application';
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Verify standards compliance for {event.titleEn || event.titleAr || 'Event'}
                </p>
            </div>
            <StandardsChecklist />
        </div>
    );
}

