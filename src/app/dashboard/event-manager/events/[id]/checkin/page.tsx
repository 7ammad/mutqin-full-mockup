"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import MobileQRScanner from '@/components/eventmanager/MobileQRScanner';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';
import { useToast } from '@/components/ui/toast-context';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventCheckInPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Data layer works immediately, no MSW waiting needed
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

    const eventTitle = language === 'ar' ? (event.titleAr || event.title) : (event.titleEn || event.title);
    const eventDate = event.date ? new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '-';
    const eventLocation = language === 'ar' ? (event.locationAr || event.locationEn) : (event.locationEn || event.locationAr);

    const handleScan = async (result: string) => {
        try {
            // Extract ticket ID from QR code result
            const ticketId = result;
            await api.checkIn({ ticketId, eventManagerId: "em-1" });
            showToast(
                language === 'ar' ? '   ' : 'Check-in successful',
                'success'
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === 'ar' ? '  ' : 'Check-in failed');
            showToast(message, 'info');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
                {/* Title Area */}
                <div className="space-y-2">
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(buildRoute.eventManagerEvent(id))}
                        className="gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'ar' ? '' : 'Back to Overview'}
                    </GlassButton>
                    <h1 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? '  ' : 'Check-In Console'}
                    </h1>
                    <h2 className="text-2xl font-bold text-[var(--label)]">
                        {eventTitle}
                    </h2>
                </div>

                {/* Event Meta */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? '' : 'Date'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{eventDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? '' : 'Location'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{eventLocation || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? ' ' : 'CME Hours'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{event.cme_hours || '-'}</p>
                            </div>
                        </div>
                    </div>
                </LiquidGlassCard>

                {/* QR Scanner */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? '  QR' : 'Scan QR Code'}
                    </h3>
                    <MobileQRScanner 
                        eventId={id}
                        onScan={handleScan}
                    />
                </LiquidGlassCard>
            </div>
    );
}
