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
        { name: language === 'ar' ? '' : 'Riyadh', value: 450 },
        { name: language === 'ar' ? '' : 'Jeddah', value: 320 },
        { name: language === 'ar' ? '' : 'Dammam', value: 280 },
        { name: language === 'ar' ? '' : 'Other', value: 200 },
    ];

    const eventsBySpecialty = [
        { name: language === 'ar' ? ' ' : getSpecialtyLabel('cardiology', language), value: 280 },
        { name: language === 'ar' ? ' ' : 'Pediatrics', value: 220 },
        { name: language === 'ar' ? ' ' : 'General Surgery', value: 180 },
        { name: language === 'ar' ? ' ' : 'Family Medicine', value: 250 },
        { name: language === 'ar' ? '' : 'Emergency', value: 120 },
        { name: language === 'ar' ? '' : 'Other', value: 200 },
    ];

    const monthlyTrend = [
        { month: language === 'ar' ? '' : 'Jan', events: 95, cmeHours: 3400 },
        { month: language === 'ar' ? '' : 'Feb', events: 110, cmeHours: 3950 },
        { month: language === 'ar' ? '' : 'Mar', events: 125, cmeHours: 4500 },
        { month: language === 'ar' ? '' : 'Apr', events: 105, cmeHours: 3800 },
        { month: language === 'ar' ? '' : 'May', events: 130, cmeHours: 4700 },
        { month: language === 'ar' ? '' : 'Jun', events: 140, cmeHours: 5050 },
    ];

    const approvalTrend = [
        { month: language === 'ar' ? '' : 'Jan', approved: 85, rejected: 10, pending: 5 },
        { month: language === 'ar' ? '' : 'Feb', approved: 95, rejected: 8, pending: 7 },
        { month: language === 'ar' ? '' : 'Mar', approved: 110, rejected: 12, pending: 3 },
        { month: language === 'ar' ? '' : 'Apr', approved: 90, rejected: 10, pending: 5 },
        { month: language === 'ar' ? '' : 'May', approved: 115, rejected: 10, pending: 5 },
        { month: language === 'ar' ? '' : 'Jun', approved: 120, rejected: 15, pending: 5 },
    ];

    const title = language === 'ar' ? ' ' : 'National Analytics';
    const totalEventsText = language === 'ar' ? ' ' : 'Total Events';
    const totalCMEHoursText = language === 'ar' ? '  ' : 'Total CME Hours';
    const totalHCPsText = language === 'ar' ? ' ' : 'Total HCPs';
    const totalOrganizersText = language === 'ar' ? ' ' : 'Total Organizers';
    const averageEventSizeText = language === 'ar' ? '  ' : 'Average Event Size';
    const approvalRateText = language === 'ar' ? ' ' : 'Approval Rate';
    const averageReviewTimeText = language === 'ar' ? '  ' : 'Average Review Time';
    const eventsByRegionText = language === 'ar' ? '  ' : 'Events by Region';
    const eventsBySpecialtyText = language === 'ar' ? '  ' : 'Events by Specialty';
    const monthlyTrendText = language === 'ar' ? ' ' : 'Monthly Trend';
    const approvalTrendText = language === 'ar' ? ' ' : 'Approval Trend';
    const daysText = language === 'ar' ? '' : 'days';

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
                                <SelectItem value="mtd">{language === 'ar' ? ' ' : 'MTD'}</SelectItem>
                                <SelectItem value="ytd">{language === 'ar' ? ' ' : 'YTD'}</SelectItem>
                                <SelectItem value="12m">{language === 'ar' ? '12 ' : '12 Months'}</SelectItem>
                            </SelectContent>
                        </Select>
                        <GlassButton variant="outline" className="gap-2 flex items-center justify-center">
                            <Download className="h-4 w-4" />
                            {language === 'ar' ? '' : 'Export'}
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

