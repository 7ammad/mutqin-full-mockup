"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Users, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface AttendanceData {
    date: string;
    checkedIn: number;
    total: number;
}

export default function AttendanceDashboard() {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [selectedEvent, setSelectedEvent] = useState<string>('');

    // Mock attendance data
    const attendanceData: AttendanceData[] = [
        { date: '2025-03-20', checkedIn: 145, total: 200 },
        { date: '2025-03-21', checkedIn: 178, total: 200 },
        { date: '2025-03-22', checkedIn: 192, total: 200 },
    ];

    const _selectedEventData = events.find((e) => e.id === selectedEvent);
    const totalAttendees = 200;
    const checkedIn = 192;
    const attendanceRate = (checkedIn / totalAttendees) * 100;
    const averageCheckInTime = '09:15 AM';

    const chartData = attendanceData.map((d) => ({
        name: new Date(d.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' }),
        value: d.checkedIn,
        total: d.total,
    }));

    const title = language === 'ar' ? ' ' : 'Attendance Dashboard';
    const selectEventText = language === 'ar' ? ' ' : 'Select Event';
    const totalAttendeesText = language === 'ar' ? ' ' : 'Total Attendees';
    const checkedInText = language === 'ar' ? ' ' : 'Checked In';
    const attendanceRateText = language === 'ar' ? ' ' : 'Attendance Rate';
    const averageCheckInText = language === 'ar' ? '  ' : 'Average Check-In Time';
    const attendanceTimelineText = language === 'ar' ? '  ' : 'Attendance Timeline';


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
            </div>

            {/* Event Selection */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <label className="block text-sm font-medium text-[var(--label)] mb-2">
                    {selectEventText}
                </label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                >
                    <option value="">{selectEventText}</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {language === 'ar' ? event.titleAr : event.titleEn}
                        </option>
                    ))}
                </select>
            </LiquidGlassCard>

            {selectedEvent && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{totalAttendeesText}</p>
                                    <p className="text-3xl font-bold text-[var(--label)]">{totalAttendees}</p>
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
                                    <p className="text-3xl font-bold text-[var(--label)]">{checkedIn}</p>
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
                                    <p className="text-sm text-[var(--secondary-label)] mb-1">{averageCheckInText}</p>
                                    <p className="text-2xl font-bold text-[var(--label)]">{averageCheckInTime}</p>
                                </div>
                                <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                                    <Clock className="w-8 h-8 text-[var(--apple-orange)]" />
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>

                    {/* Chart */}
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{attendanceTimelineText}</h3>
                        <Chart
                            type="bar"
                            data={chartData}
                            dataKey="value"
                            height={300}
                        />
                    </LiquidGlassCard>
                </>
            )}
        </div>
    );
}

