"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Users, CheckCircle2, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';
import { getEventAttendanceData } from '@/context/demoStore';

interface LiveAttendanceDashboardProps {
    eventId: string;
}

export default function LiveAttendanceDashboard({ eventId }: LiveAttendanceDashboardProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const event = events.find(e => e.id === eventId);

    // Get real attendance data from demoStore
    const attendanceDataFromStore = getEventAttendanceData(eventId);
    const [attendanceData, setAttendanceData] = useState({
        totalExpected: attendanceDataFromStore.totalCount,
        checkedIn: attendanceDataFromStore.checkedInCount,
        checkedInLastHour: 0, // Will be updated by interval
        averageCheckInTime: 2.5, // Mock - would come from real data
        peakHour: '09:00 - 10:00', // Mock - would come from real data
    });

    // Update from store periodically (simulating real-time updates)
    useEffect(() => {
        const interval = setInterval(() => {
            const latest = getEventAttendanceData(eventId);
            setAttendanceData(prev => ({
                ...prev,
                totalExpected: latest.totalCount,
                checkedIn: latest.checkedInCount,
                checkedInLastHour: Math.max(0, latest.checkedInCount - prev.checkedIn), // Calculate diff
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, [eventId]);

    const attendanceRate = (attendanceData.checkedIn / attendanceData.totalExpected) * 100;
    const checkInTimeline = [
        { name: '08:00', value: 20 },
        { name: '09:00', value: 65 },
        { name: '10:00', value: 95 },
        { name: '11:00', value: 120 },
        { name: '12:00', value: 145 },
    ];

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? '  ' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? '  ' : 'Live Attendance Dashboard';
    const totalExpectedText = language === 'ar' ? '' : 'Expected';
    const checkedInText = language === 'ar' ? ' ' : 'Checked In';
    const attendanceRateText = language === 'ar' ? ' ' : 'Attendance Rate';
    const lastHourText = language === 'ar' ? ' ' : 'Last Hour';
    const averageTimeText = language === 'ar' ? '  ' : 'Avg Check-In Time';
    const peakHourText = language === 'ar' ? ' ' : 'Peak Hour';
    const timelineText = language === 'ar' ? '  ' : 'Check-In Timeline';
    const liveText = language === 'ar' ? '' : 'LIVE';
    const minutesText = language === 'ar' ? '' : 'minutes';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--apple-red)]/10">
                    <div className="w-2 h-2 rounded-full bg-[var(--apple-red)] animate-pulse" />
                    <span className="text-sm font-medium text-[var(--apple-red)]">{liveText}</span>
                </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalExpectedText}</p>
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
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{checkedInText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{attendanceData.checkedIn}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                +{attendanceData.checkedInLastHour} {lastHourText}
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
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{attendanceRateText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{attendanceRate.toFixed(0)}%</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                            <TrendingUp className="w-8 h-8 text-[var(--apple-purple)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{averageTimeText}</p>
                            <p className="text-2xl font-bold text-[var(--label)]">
                                {attendanceData.averageCheckInTime} {minutesText}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <Clock className="w-8 h-8 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Chart */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{timelineText}</h3>
                <Chart
                    type="line"
                    data={checkInTimeline}
                    dataKey="value"
                    height={300}
                />
            </LiquidGlassCard>

            {/* Peak Hour Info */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--secondary-label)] mb-1">{peakHourText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">{attendanceData.peakHour}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-[var(--apple-orange)]" />
                </div>
            </LiquidGlassCard>
        </div>
    );
}

