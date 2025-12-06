"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Chart } from '@/components/shared/Chart';
import { Calendar, Award, Target, TrendingUp, RefreshCw } from 'lucide-react';

export default function CMETrackingDashboard() {
    const { language } = useLanguage();
    const { myTickets, events } = usePersona();
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

    // Calculate CME hours from registered events
    const registeredEvents = events.filter(e => myTickets.includes(e.id));
    const totalHours = registeredEvents.reduce((sum, e) => sum + e.cme_hours, 0);
    const annualGoal = 50; // CME hours per year
    const progress = Math.min((totalHours / annualGoal) * 100, 100);
    const remaining = Math.max(annualGoal - totalHours, 0);

    // Group by specialty
    const hoursBySpecialty = registeredEvents.reduce((acc, event) => {
        acc[event.specialty] = (acc[event.specialty] || 0) + event.cme_hours;
        return acc;
    }, {} as Record<string, number>);

    const handleSyncMumaris = async () => {
        setSyncStatus('syncing');
        // Mock sync
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const chartData = Object.entries(hoursBySpecialty).map(([specialty, hours]) => ({
        name: specialty,
        value: hours,
    }));

    const title = language === 'ar' ? 'تتبع ساعات التعليم الطبي المستمر' : 'CME Hours Tracking';
    const totalHoursText = language === 'ar' ? 'إجمالي الساعات' : 'Total Hours';
    const annualGoalText = language === 'ar' ? 'الهدف السنوي' : 'Annual Goal';
    const remainingText = language === 'ar' ? 'متبقي' : 'Remaining';
    const syncText = language === 'ar' ? 'مزامنة مع ممارس+' : 'Sync with Mumaris Plus';
    const syncingText = language === 'ar' ? 'جاري المزامنة...' : 'Syncing...';
    const syncedText = language === 'ar' ? 'تمت المزامنة' : 'Synced';
    const bySpecialtyText = language === 'ar' ? 'حسب التخصص' : 'By Specialty';
    const recentActivityText = language === 'ar' ? 'النشاط الأخير' : 'Recent Activity';

    return (
        <div className="space-y-6">
            {/* Header with Sync */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                <GlassButton
                    variant="outline"
                    onClick={handleSyncMumaris}
                    disabled={syncStatus === 'syncing'}
                 className="flex items-center justify-center gap-2">
                    <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    {syncStatus === 'syncing' ? syncingText : syncStatus === 'success' ? syncedText : syncText}
                </GlassButton>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalHoursText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{totalHours}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'ساعة' : 'hours'}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Award className="w-6 h-6 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{annualGoalText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{annualGoal}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'ساعة/سنة' : 'hours/year'}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <Target className="w-6 h-6 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{remainingText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{remaining}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'ساعة' : 'hours'}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <TrendingUp className="w-6 h-6 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Progress Bar */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--label)]">
                            {language === 'ar' ? 'التقدم نحو الهدف' : 'Progress to Goal'}
                        </span>
                        <span className="text-sm font-bold text-[var(--apple-green)]">
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-[var(--system-fill)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--apple-green)] transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {progress >= 100 && (
                        <p className="text-sm text-[var(--apple-green)] font-medium text-center">
                            {language === 'ar' ? 'تم تحقيق الهدف! ✓' : 'Goal achieved! ✓'}
                        </p>
                    )}
                </div>
            </LiquidGlassCard>

            {/* Chart */}
            {chartData.length > 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{bySpecialtyText}</h3>
                    <Chart
                        type="pie"
                        data={chartData}
                        dataKey="value"
                        height={300}
                    />
                </LiquidGlassCard>
            )}

            {/* Recent Activity */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{recentActivityText}</h3>
                <div className="space-y-3">
                    {registeredEvents.slice(0, 5).map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--system-fill)]/30"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-[var(--apple-blue)]" />
                                <div>
                                    <p className="text-sm font-medium text-[var(--label)]">
                                        {language === 'ar' ? event.titleAr : event.titleEn}
                                    </p>
                                    <p className="text-xs text-[var(--secondary-label)]">
                                        {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[var(--apple-green)]">
                                    +{event.cme_hours}
                                </p>
                                <p className="text-xs text-[var(--tertiary-label)]">
                                    {language === 'ar' ? 'ساعة' : 'hours'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {registeredEvents.length === 0 && (
                        <p className="text-center text-[var(--secondary-label)] py-8">
                            {language === 'ar' ? 'لا توجد ساعات مسجلة بعد' : 'No hours recorded yet'}
                        </p>
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

