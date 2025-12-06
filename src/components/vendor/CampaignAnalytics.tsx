"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart3, TrendingUp, Eye, MousePointerClick, Users, DollarSign, Download } from "lucide-react";
import { Chart } from "@/components/shared/Chart";
import { buildRoute } from "@/lib/routes";

export default function CampaignAnalytics() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
    const [timeRange, setTimeRange] = useState<string>("30d");

    // Mock campaign data
    const campaigns = [
        { id: 'camp1', name: language === 'ar' ? '  2025' : 'Cardiology Campaign 2025' },
        { id: 'camp2', name: language === 'ar' ? '  ' : 'Pediatrics Campaign' },
        { id: 'camp3', name: language === 'ar' ? '  ' : 'General Surgery Campaign' },
    ];

    // Mock analytics data
    const mockAnalytics = {
        impressions: 125000,
        clicks: 8500,
        clickThroughRate: 6.8,
        conversions: 420,
        conversionRate: 4.9,
        cost: 45000,
        revenue: 125000,
        roi: 177.8,
        engagementRate: 12.5,
        reach: 85000,
        audienceGrowth: 15.2,
    };

    const performanceData = [
        { date: '2025-01-01', impressions: 5000, clicks: 340, conversions: 18 },
        { date: '2025-01-08', impressions: 7500, clicks: 510, conversions: 25 },
        { date: '2025-01-15', impressions: 10000, clicks: 680, conversions: 33 },
        { date: '2025-01-22', impressions: 12000, clicks: 816, conversions: 40 },
        { date: '2025-01-29', impressions: 15000, clicks: 1020, conversions: 50 },
    ];

    const channelData = [
        { name: language === 'ar' ? ' ' : 'Email', value: 45000 },
        { name: language === 'ar' ? ' ' : 'Social Media', value: 35000 },
        { name: language === 'ar' ? ' ' : 'Website', value: 25000 },
        { name: language === 'ar' ? '' : 'Events', value: 20000 },
    ];

    const title = language === 'ar' ? ' ' : 'Campaign Analytics';
    const selectCampaignText = language === 'ar' ? ' ' : 'Select Campaign';
    const timeRangeText = language === 'ar' ? ' ' : 'Time Range';
    const impressionsText = language === 'ar' ? '' : 'Impressions';
    const clicksText = language === 'ar' ? '' : 'Clicks';
    const ctrText = language === 'ar' ? ' ' : 'CTR';
    const conversionsText = language === 'ar' ? '' : 'Conversions';
    const costText = language === 'ar' ? '' : 'Cost';
    const revenueText = language === 'ar' ? '' : 'Revenue';
    const roiText = language === 'ar' ? ' ' : 'ROI';
    const engagementText = language === 'ar' ? ' ' : 'Engagement Rate';
    const reachText = language === 'ar' ? '' : 'Reach';
    const growthText = language === 'ar' ? ' ' : 'Audience Growth';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-[var(--apple-blue)]" />
                        {title}
                    </h2>
                    <div className="flex gap-3">
                        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder={selectCampaignText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="all">{language === 'ar' ? ' ' : 'All Campaigns'}</SelectItem>
                                {campaigns.map((campaign) => (
                                    <SelectItem key={campaign.id} value={campaign.id}>
                                        {campaign.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedCampaign !== "all" && (
                            <GlassButton
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(buildRoute.vendorCampaign(selectedCampaign))}
                                className="gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                {language === 'ar' ? ' ' : 'View Campaign'}
                            </GlassButton>
                        )}
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={timeRangeText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="7d">{language === 'ar' ? '7 ' : '7 Days'}</SelectItem>
                                <SelectItem value="30d">{language === 'ar' ? '30 ' : '30 Days'}</SelectItem>
                                <SelectItem value="90d">{language === 'ar' ? '90 ' : '90 Days'}</SelectItem>
                                <SelectItem value="1y">{language === 'ar' ? ' ' : '1 Year'}</SelectItem>
                            </SelectContent>
                        </Select>
                        <GlassButton variant="outline" className="gap-2 flex items-center justify-center">
                            <Download className="h-4 w-4" />
                            {language === 'ar' ? '' : 'Export'}
                        </GlassButton>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Eye className="h-6 w-6 text-[var(--apple-blue)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{impressionsText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockAnalytics.impressions.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <MousePointerClick className="h-6 w-6 text-[var(--apple-green)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{clicksText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockAnalytics.clicks.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <TrendingUp className="h-6 w-6 text-[var(--apple-orange)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{ctrText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">{mockAnalytics.clickThroughRate}%</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <Users className="h-6 w-6 text-[var(--apple-purple)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{conversionsText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockAnalytics.conversions.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <DollarSign className="h-6 w-6 text-[var(--apple-green)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{costText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockAnalytics.cost.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <TrendingUp className="h-6 w-6 text-[var(--apple-yellow)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{roiText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">{mockAnalytics.roi}%</p>
                    </div>
                </div>

                {/* Performance Over Time Chart */}
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? '  ' : 'Performance Over Time'}
                    </h3>
                    <Chart
                        type="line"
                        data={performanceData}
                        dataKey="impressions"
                        nameKey="date"
                        height={300}
                        colors={['var(--apple-blue)', 'var(--apple-green)', 'var(--apple-orange)']}
                    />
                </LiquidGlassCard>

                {/* Channel Distribution */}
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? '  ' : 'Distribution by Channel'}
                    </h3>
                    <Chart
                        type="pie"
                        data={channelData}
                        dataKey="value"
                        nameKey="name"
                        height={300}
                    />
                </LiquidGlassCard>
            </LiquidGlassCard>
        </div>
    );
}

