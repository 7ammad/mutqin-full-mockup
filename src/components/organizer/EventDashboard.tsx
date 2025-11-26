"use client";


import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Calendar, Users, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';


interface EventDashboardProps {
    eventId: string;
}

export default function EventDashboard({ eventId }: EventDashboardProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    // Mock data
    const registrations = 145;
    const revenue = registrations * 500; // Mock: 500 SAR per registration
    const attendanceRate = 85; // Mock: 85% attendance
    const targetCapacity = 200;
    const registrationTimeline = [
        { name: language === 'ar' ? 'يناير' : 'Jan', value: 20 },
        { name: language === 'ar' ? 'فبراير' : 'Feb', value: 45 },
        { name: language === 'ar' ? 'مارس' : 'Mar', value: 80 },
    ];
    const demographics = [
        { name: 'Cardiology', value: 45 },
        { name: 'Family Medicine', value: 30 },
        { name: 'Emergency Medicine', value: 25 },
    ];

    const title = language === 'ar' ? 'لوحة تحكم الفعالية' : 'Event Dashboard';
    const registrationsText = language === 'ar' ? 'التسجيلات' : 'Registrations';
    const revenueText = language === 'ar' ? 'الإيرادات' : 'Revenue';
    const attendanceText = language === 'ar' ? 'معدل الحضور' : 'Attendance Rate';
    const capacityText = language === 'ar' ? 'السعة' : 'Capacity';
    const timelineText = language === 'ar' ? 'خط زمني التسجيلات' : 'Registration Timeline';
    const demographicsText = language === 'ar' ? 'ديموغرافيا الحضور' : 'Attendee Demographics';
    const statusText = language === 'ar' ? 'حالة الاعتماد' : 'Accreditation Status';
    const sponsorshipText = language === 'ar' ? 'حالة الرعاية' : 'Sponsorship Status';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">
                        {language === 'ar' ? event.titleAr : event.titleEn}
                    </h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {event.date} • {language === 'ar' ? event.locationAr : event.locationEn}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{registrationsText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{registrations}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'من' : 'of'} {targetCapacity}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Users className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{revenueText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">
                                {revenue.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">SAR</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <DollarSign className="w-8 h-8 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{attendanceText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{attendanceRate}%</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'متوقع' : 'Expected'}
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
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{capacityText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{targetCapacity}</p>
                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                {language === 'ar' ? 'الحد الأقصى' : 'Maximum'}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <Award className="w-8 h-8 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{timelineText}</h3>
                    <Chart
                        type="line"
                        data={registrationTimeline}
                        dataKey="value"
                        height={250}
                    />
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{demographicsText}</h3>
                    <Chart
                        type="pie"
                        data={demographics}
                        dataKey="value"
                        height={250}
                    />
                </LiquidGlassCard>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[var(--label)]">{statusText}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === 'Published'
                                ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                : event.status === 'Pending Approval'
                                ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
                        }`}>
                            {event.status}
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[var(--secondary-label)]">
                                {language === 'ar' ? 'ساعات CME' : 'CME Hours'}:
                            </span>
                            <span className="text-[var(--label)] font-medium">{event.cme_hours}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--secondary-label)]">
                                {language === 'ar' ? 'التخصص' : 'Specialty'}:
                            </span>
                            <span className="text-[var(--label)] font-medium">{event.specialty}</span>
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[var(--label)]">{sponsorshipText}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.is_sponsored
                                ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                : event.needs_sponsorship
                                ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
                        }`}>
                            {event.is_sponsored
                                ? (language === 'ar' ? 'ممول' : 'Sponsored')
                                : event.needs_sponsorship
                                ? (language === 'ar' ? 'يحتاج رعاية' : 'Needs Sponsorship')
                                : (language === 'ar' ? 'غير ممول' : 'Not Sponsored')
                            }
                        </div>
                    </div>
                    {event.sfda_license && (
                        <div className="text-sm">
                            <span className="text-[var(--secondary-label)]">
                                {language === 'ar' ? 'ترخيص SFDA' : 'SFDA License'}:
                            </span>
                            <span className="text-[var(--label)] font-medium ml-2">{event.sfda_license}</span>
                        </div>
                    )}
                </LiquidGlassCard>
            </div>
        </div>
    );
}

