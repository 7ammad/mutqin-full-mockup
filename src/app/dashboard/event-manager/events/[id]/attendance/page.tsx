"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Calendar, MapPin, Clock, ArrowLeft, Users, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';
import { useToast } from '@/components/ui/toast-context';
import { getEventAttendanceData } from '@/context/demoStore';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventAttendanceDashboardPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attendanceFinalized, setAttendanceFinalized] = useState(false);
    const [attendanceData, setAttendanceData] = useState({
        totalExpected: 0,
        checkedIn: 0,
        checkedInLastHour: 0,
        averageCheckInTime: 2.5,
        peakHour: '09:00 - 10:00',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Data layer works immediately, no MSW waiting needed
                const res = await api.getEventById({ eventId: id });
                setEvent(res.event);
                // Get attendance data
                const attendanceDataFromStore = getEventAttendanceData(id);
                setAttendanceFinalized(attendanceDataFromStore.finalized);
                setAttendanceData({
                    totalExpected: attendanceDataFromStore.totalCount,
                    checkedIn: attendanceDataFromStore.checkedInCount,
                    checkedInLastHour: 0,
                    averageCheckInTime: 2.5,
                    peakHour: '09:00 - 10:00',
                });
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
                        {language === 'ar' ? ' ' : 'Attendance Ledger'}
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

                {/* Live Attendance Stats */}
                <div className="space-y-6">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--apple-red)]/10">
                            <div className="w-2 h-2 rounded-full bg-[var(--apple-red)] animate-pulse" />
                            <span className="text-sm font-medium text-[var(--apple-red)]">
                                {language === 'ar' ? '' : 'LIVE'}
                            </span>
                        </div>
                    </div>

                    {/* Live Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">
                                        {language === 'ar' ? '' : 'Expected'}
                                    </p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{attendanceData.totalExpected}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                                    <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">
                                        {language === 'ar' ? ' ' : 'Checked In'}
                                    </p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{attendanceData.checkedIn}</p>
                                    <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                        +{attendanceData.checkedInLastHour} {language === 'ar' ? ' ' : 'Last Hour'}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                                    <CheckCircle2 className="w-8 h-8 text-[var(--apple-green)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">
                                        {language === 'ar' ? ' ' : 'Attendance Rate'}
                                    </p>
                                    <p className="text-3xl font-bold text-[var(--label)]">
                                        {attendanceData.totalExpected > 0 
                                            ? ((attendanceData.checkedIn / attendanceData.totalExpected) * 100).toFixed(0)
                                            : 0}%
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                                    <TrendingUp className="w-8 h-8 text-[var(--apple-purple)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>

                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">
                                        {language === 'ar' ? '  ' : 'Avg Check-In Time'}
                                    </p>
                                    <p className="text-2xl font-bold text-[var(--label)]">
                                        {attendanceData.averageCheckInTime} {language === 'ar' ? '' : 'minutes'}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                                    <Clock className="w-8 h-8 text-[var(--apple-orange)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>

                    {/* Peak Hour Info */}
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--secondary-label)] mb-1">
                                    {language === 'ar' ? ' ' : 'Peak Hour'}
                                </p>
                                <p className="text-xl font-bold text-[var(--label)]">{attendanceData.peakHour}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-[var(--apple-orange)]" />
                        </div>
                    </LiquidGlassCard>
                </div>

                {/* Finalize Attendance Action */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                                {language === 'ar' ? ' ' : 'Finalize Attendance'}
                            </h3>
                            <p className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' 
                                    ? attendanceFinalized 
                                        ? '  .     .'
                                        : '         .'
                                    : attendanceFinalized
                                    ? 'Attendance has been finalized. No further changes can be made.'
                                    : 'After verifying all attendance, finalize attendance to close the list.'}
                            </p>
                        </div>
                        <GlassButton
                            variant={attendanceFinalized ? "outline" : "default"}
                            onClick={async () => {
                                if (attendanceFinalized) return;
                                try {
                                    await api.finalizeAttendance({ eventId: id, eventManagerId: "em-1" });
                                    setAttendanceFinalized(true);
                                    showToast(
                                        language === 'ar' ? '   ' : 'Attendance finalized successfully',
                                        'success'
                                    );
                                    // Refresh page data
                                    router.refresh();
                                } catch (err) {
                                    const message = err instanceof Error ? err.message : (language === 'ar' ? '  ' : 'Failed to finalize attendance');
                                    showToast(message, 'info');
                                }
                            }}
                            disabled={attendanceFinalized}
                            className="gap-2 flex items-center justify-center"
                        >
                            {attendanceFinalized 
                                ? (language === 'ar' ? '' : 'Finalized')
                                : (language === 'ar' ? ' ' : 'Finalize Attendance')}
                        </GlassButton>
                    </div>
                </LiquidGlassCard>
            </div>
    );
}
