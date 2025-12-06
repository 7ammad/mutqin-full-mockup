"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { ArrowLeft, CheckCircle2, FileText, Calendar, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import type { DemoEvent } from '@/context/demoSeed';
import { getEventAttendanceData } from '@/context/demoStore';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventHandoverPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get handover data from demoStore (attendance summary, exceptions, etc.)
    const attendanceData = event ? getEventAttendanceData(event.id) : null;

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
                        {language === 'ar' ? ' ' : 'Handover Pack'}
                    </h1>
                    <h2 className="text-2xl font-bold text-[var(--label)]">
                        {eventTitle}
                    </h2>
                    <p className="text-sm text-[var(--secondary-label)]">
                        {language === 'ar' 
                            ? '             .'
                            : 'Handover and audit pack overview with completion checklist and documentation for event closure.'}
                    </p>
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

                {/* Handover Summary */}
                {attendanceData && (
                    <LiquidGlassCard blurIntensity="lg" className="p-6 mb-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {language === 'ar' ? ' ' : 'Attendance Summary'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? ' ' : 'Total Tickets'}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{attendanceData.totalCount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? ' ' : 'Checked In'}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{attendanceData.checkedInCount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? '' : 'Status'}
                                </p>
                                <p className="text-lg font-semibold text-[var(--label)]">
                                    {attendanceData.finalized 
                                        ? (language === 'ar' ? '' : 'Finalized')
                                        : (language === 'ar' ? ' ' : 'In Progress')}
                                </p>
                            </div>
                        </div>
                    </LiquidGlassCard>
                )}

                {/* Handover Checklist */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? '   ' : 'Handover Checklist'}
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-[var(--system-fill)] rounded-lg">
                            <p className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' 
                                    ? '   .         .'
                                    : 'This page is under development. Handover checklist and audit pack will be added soon.'}
                            </p>
                        </div>
                    </div>
                </LiquidGlassCard>

                {/* Actions */}
                <div className="flex gap-4">
                    <GlassButton
                        variant="outline"
                        onClick={() => router.push(buildRoute.eventManagerEvent(id))}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {language === 'ar' ? '' : 'Go Back'}
                    </GlassButton>
                    <GlassButton
                        className="gap-2 flex items-center justify-center"
                        disabled
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {language === 'ar' ? ' ' : 'Complete Handover'}
                    </GlassButton>
                </div>
            </div>
    );
}
