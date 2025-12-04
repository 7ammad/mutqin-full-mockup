"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, BarChart3, CheckCircle2, Download, Calendar, Award } from "lucide-react";
import { Chart } from "@/components/shared/Chart";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

export default function NationalAnalytics() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [timeRange, setTimeRange] = useState<string>("ytd");
    const [selectedRegion, setSelectedRegion] = useState<string>("all");

    // Mock national analytics data
    const mockAnalytics = {
        totalEvents: 1250,
        totalCMEHours: 45000,
        totalHCPs: 8500,
        totalOrganizers: 120,
        averageEventSize: 68,
        approvalRate: 87.5,
        averageReviewTime: 3.2,
    };

    const eventsByRegion = [
        { name: language === 'ar' ? 'الرياض' : 'Riyadh', value: 450 },
        { name: language === 'ar' ? 'جدة' : 'Jeddah', value: 320 },
        { name: language === 'ar' ? 'الدمام' : 'Dammam', value: 280 },
        { name: language === 'ar' ? 'أخرى' : 'Other', value: 200 },
    ];

    const eventsBySpecialty = [
        { name: language === 'ar' ? 'طب القلب' : getSpecialtyLabel('cardiology', language), value: 280 },
        { name: language === 'ar' ? 'طب الأطفال' : 'Pediatrics', value: 220 },
        { name: language === 'ar' ? 'الجراحة العامة' : 'General Surgery', value: 180 },
        { name: language === 'ar' ? 'طب الأسرة' : 'Family Medicine', value: 250 },
        { name: language === 'ar' ? 'الطوارئ' : 'Emergency', value: 120 },
        { name: language === 'ar' ? 'أخرى' : 'Other', value: 200 },
    ];

    const monthlyTrend = [
        { month: language === 'ar' ? 'يناير' : 'Jan', events: 95, cmeHours: 3400 },
        { month: language === 'ar' ? 'فبراير' : 'Feb', events: 110, cmeHours: 3950 },
        { month: language === 'ar' ? 'مارس' : 'Mar', events: 125, cmeHours: 4500 },
        { month: language === 'ar' ? 'أبريل' : 'Apr', events: 105, cmeHours: 3800 },
        { month: language === 'ar' ? 'مايو' : 'May', events: 130, cmeHours: 4700 },
        { month: language === 'ar' ? 'يونيو' : 'Jun', events: 140, cmeHours: 5050 },
    ];

    const approvalTrend = [
        { month: language === 'ar' ? 'يناير' : 'Jan', approved: 85, rejected: 10, pending: 5 },
        { month: language === 'ar' ? 'فبراير' : 'Feb', approved: 95, rejected: 8, pending: 7 },
        { month: language === 'ar' ? 'مارس' : 'Mar', approved: 110, rejected: 12, pending: 3 },
        { month: language === 'ar' ? 'أبريل' : 'Apr', approved: 90, rejected: 10, pending: 5 },
        { month: language === 'ar' ? 'مايو' : 'May', approved: 115, rejected: 10, pending: 5 },
        { month: language === 'ar' ? 'يونيو' : 'Jun', approved: 120, rejected: 15, pending: 5 },
    ];

    const title = language === 'ar' ? 'التحليلات الوطنية' : 'National Analytics';
    const totalEventsText = language === 'ar' ? 'إجمالي الفعاليات' : 'Total Events';
    const totalCMEHoursText = language === 'ar' ? 'إجمالي ساعات التعليم' : 'Total CME Hours';
    const totalHCPsText = language === 'ar' ? 'إجمالي الممارسين' : 'Total HCPs';
    const totalOrganizersText = language === 'ar' ? 'إجمالي المنظمين' : 'Total Organizers';
    const averageEventSizeText = language === 'ar' ? 'متوسط حجم الفعالية' : 'Average Event Size';
    const approvalRateText = language === 'ar' ? 'معدل الموافقة' : 'Approval Rate';
    const averageReviewTimeText = language === 'ar' ? 'متوسط وقت المراجعة' : 'Average Review Time';
    const eventsByRegionText = language === 'ar' ? 'الفعاليات حسب المنطقة' : 'Events by Region';
    const eventsBySpecialtyText = language === 'ar' ? 'الفعاليات حسب التخصص' : 'Events by Specialty';
    const monthlyTrendText = language === 'ar' ? 'الاتجاه الشهري' : 'Monthly Trend';
    const approvalTrendText = language === 'ar' ? 'اتجاه الموافقات' : 'Approval Trend';
    const daysText = language === 'ar' ? 'أيام' : 'days';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-[var(--apple-blue)]" />
                        {title}
                    </h2>
                    <div className="flex gap-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="mtd">{language === 'ar' ? 'هذا الشهر' : 'MTD'}</SelectItem>
                                <SelectItem value="ytd">{language === 'ar' ? 'هذه السنة' : 'YTD'}</SelectItem>
                                <SelectItem value="12m">{language === 'ar' ? '12 شهر' : '12 Months'}</SelectItem>
                            </SelectContent>
                        </Select>
                        <GlassButton variant="outline" className="gap-2 flex items-center justify-center">
                            <Download className="h-4 w-4" />
                            {language === 'ar' ? 'تصدير' : 'Export'}
                        </GlassButton>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Calendar className="h-6 w-6 text-[var(--apple-blue)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{totalEventsText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">
                            {mockAnalytics.totalEvents.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Award className="h-6 w-6 text-[var(--apple-green)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{totalCMEHoursText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">
                            {mockAnalytics.totalCMEHours.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Users className="h-6 w-6 text-[var(--apple-purple)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{totalHCPsText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">
                            {mockAnalytics.totalHCPs.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <BarChart3 className="h-6 w-6 text-[var(--apple-orange)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{totalOrganizersText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">{mockAnalytics.totalOrganizers}</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Users className="h-6 w-6 text-[var(--apple-blue)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{averageEventSizeText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">{mockAnalytics.averageEventSize}</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <TrendingUp className="h-6 w-6 text-[var(--apple-green)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{approvalRateText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">{mockAnalytics.approvalRate}%</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Calendar className="h-6 w-6 text-[var(--apple-orange)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{averageReviewTimeText}</p>
                        <p className="text-xl font-bold text-[var(--label)]">
                            {mockAnalytics.averageReviewTime} {daysText}
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {eventsByRegionText}
                        </h3>
                        <Chart
                            type="pie"
                            data={eventsByRegion}
                            dataKey="value"
                            nameKey="name"
                            height={300}
                        />
                    </LiquidGlassCard>
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {eventsBySpecialtyText}
                        </h3>
                        <Chart
                            type="bar"
                            data={eventsBySpecialty}
                            dataKey="value"
                            nameKey="name"
                            height={300}
                            colors={['var(--apple-blue)']}
                        />
                    </LiquidGlassCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {monthlyTrendText}
                        </h3>
                        <Chart
                            type="line"
                            data={monthlyTrend.map(t => ({ month: t.month, events: t.events, cmeHours: t.cmeHours }))}
                            dataKey="events"
                            nameKey="month"
                            height={300}
                            colors={['var(--apple-blue)', 'var(--apple-green)']}
                        />
                    </LiquidGlassCard>
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {approvalTrendText}
                        </h3>
                        <Chart
                            type="bar"
                            data={approvalTrend.map(t => ({ month: t.month, approved: t.approved, rejected: t.rejected, pending: t.pending }))}
                            dataKey="approved"
                            nameKey="month"
                            height={300}
                            colors={['var(--apple-green)', 'var(--apple-red)', 'var(--apple-orange)']}
                        />
                    </LiquidGlassCard>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

