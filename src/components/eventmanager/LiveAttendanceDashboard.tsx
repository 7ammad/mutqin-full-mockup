"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Users, CheckCircle2, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';

interface LiveAttendanceDashboardProps {
    eventId: string;
}

export default function LiveAttendanceDashboard({ eventId }: LiveAttendanceDashboardProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const event = events.find(e => e.id === eventId);

    // Mock live data
    const [attendanceData, setAttendanceData] = useState({
        totalExpected: 200,
        checkedIn: 145,
        checkedInLastHour: 12,
        averageCheckInTime: 2.5,
        peakHour: '09:00 - 10:00',
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setAttendanceData(prev => ({
                ...prev,
                checkedIn: Math.min(prev.checkedIn + Math.floor(Math.random() * 2), prev.totalExpected),
                checkedInLastHour: Math.floor(Math.random() * 20),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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
                    {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? 'لوحة الحضور المباشر' : 'Live Attendance Dashboard';
    const totalExpectedText = language === 'ar' ? 'المتوقع' : 'Expected';
    const checkedInText = language === 'ar' ? 'تم التسجيل' : 'Checked In';
    const attendanceRateText = language === 'ar' ? 'معدل الحضور' : 'Attendance Rate';
    const lastHourText = language === 'ar' ? 'آخر ساعة' : 'Last Hour';
    const averageTimeText = language === 'ar' ? 'متوسط وقت التسجيل' : 'Avg Check-In Time';
    const peakHourText = language === 'ar' ? 'ساعة الذروة' : 'Peak Hour';
    const timelineText = language === 'ar' ? 'خط زمني التسجيل' : 'Check-In Timeline';
    const liveText = language === 'ar' ? 'مباشر' : 'LIVE';
    const minutesText = language === 'ar' ? 'دقيقة' : 'minutes';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {getEventTitle(event, language)}
                    </p>
                </div>
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

