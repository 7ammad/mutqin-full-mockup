"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { DollarSign, TrendingUp, TrendingDown, Target, Download, FileText } from "lucide-react";
import { Chart } from "@/components/shared/Chart";

export default function ROIReporting() {
    const { t, language } = useLanguage();
    const [reportType, setReportType] = useState<string>("summary");
    const [timeRange, setTimeRange] = useState<string>("ytd");

    // Mock ROI data
    const mockROIData = {
        totalInvestment: 150000,
        totalRevenue: 425000,
        netProfit: 275000,
        roi: 183.3,
        roiPercentage: '+183.3%',
        costPerAcquisition: 357,
        lifetimeValue: 1012,
        paybackPeriod: 2.1, // months
        breakEvenPoint: 148,
    };

    const campaignROI = [
        { name: language === 'ar' ? 'حملة القلب' : 'Cardiology Campaign', investment: 50000, revenue: 150000, roi: 200 },
        { name: language === 'ar' ? 'حملة طب الأطفال' : 'Pediatrics Campaign', investment: 40000, revenue: 120000, roi: 200 },
        { name: language === 'ar' ? 'حملة الجراحة' : 'Surgery Campaign', investment: 35000, revenue: 95000, roi: 171.4 },
        { name: language === 'ar' ? 'حملة الطوارئ' : 'Emergency Campaign', investment: 25000, revenue: 60000, roi: 140 },
    ];

    const monthlyROI = [
        { month: language === 'ar' ? 'يناير' : 'Jan', investment: 12000, revenue: 35000, roi: 191.7 },
        { month: language === 'ar' ? 'فبراير' : 'Feb', investment: 15000, revenue: 42000, roi: 180 },
        { month: language === 'ar' ? 'مارس' : 'Mar', investment: 18000, revenue: 52000, roi: 188.9 },
        { month: language === 'ar' ? 'أبريل' : 'Apr', investment: 20000, revenue: 58000, roi: 190 },
        { month: language === 'ar' ? 'مايو' : 'May', investment: 22000, revenue: 65000, roi: 195.5 },
        { month: language === 'ar' ? 'يونيو' : 'Jun', investment: 25000, revenue: 75000, roi: 200 },
    ];

    const title = language === 'ar' ? 'تقارير عائد الاستثمار' : 'ROI Reporting';
    const summaryText = language === 'ar' ? 'ملخص' : 'Summary';
    const detailedText = language === 'ar' ? 'مفصل' : 'Detailed';
    const comparisonText = language === 'ar' ? 'مقارنة' : 'Comparison';
    const totalInvestmentText = language === 'ar' ? 'إجمالي الاستثمار' : 'Total Investment';
    const totalRevenueText = language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue';
    const netProfitText = language === 'ar' ? 'صافي الربح' : 'Net Profit';
    const roiText = language === 'ar' ? 'عائد الاستثمار' : 'ROI';
    const cpaText = language === 'ar' ? 'تكلفة الاكتساب' : 'Cost Per Acquisition';
    const ltvText = language === 'ar' ? 'القيمة مدى الحياة' : 'Lifetime Value';
    const paybackText = language === 'ar' ? 'فترة الاسترداد' : 'Payback Period';
    const breakEvenText = language === 'ar' ? 'نقطة التعادل' : 'Break-Even Point';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-[var(--apple-green)]" />
                        {title}
                    </h2>
                    <div className="flex gap-3">
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="summary">{summaryText}</SelectItem>
                                <SelectItem value="detailed">{detailedText}</SelectItem>
                                <SelectItem value="comparison">{comparisonText}</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <GlassButton variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
                        </GlassButton>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-[var(--secondary-label)]">{totalInvestmentText}</p>
                            <DollarSign className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--label)]">
                            {mockROIData.totalInvestment.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </LiquidGlassCard>
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-[var(--secondary-label)]">{totalRevenueText}</p>
                            <TrendingUp className="h-5 w-5 text-[var(--apple-green)]" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--label)]">
                            {mockROIData.totalRevenue.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </LiquidGlassCard>
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-[var(--secondary-label)]">{netProfitText}</p>
                            <Target className="h-5 w-5 text-[var(--apple-orange)]" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--label)]">
                            {mockROIData.netProfit.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </LiquidGlassCard>
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-[var(--secondary-label)]">{roiText}</p>
                            <TrendingUp className="h-5 w-5 text-[var(--apple-green)]" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--apple-green)]">
                            {mockROIData.roiPercentage}
                        </p>
                    </LiquidGlassCard>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{cpaText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockROIData.costPerAcquisition.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{ltvText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockROIData.lifetimeValue.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t('currency.sar')}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{paybackText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockROIData.paybackPeriod} {language === 'ar' ? 'شهر' : 'months'}
                        </p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{breakEvenText}</p>
                        <p className="text-lg font-bold text-[var(--label)]">
                            {mockROIData.breakEvenPoint} {language === 'ar' ? 'عميل' : 'customers'}
                        </p>
                    </div>
                </div>

                {/* Campaign ROI Comparison */}
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? 'مقارنة عائد الاستثمار للحملات' : 'Campaign ROI Comparison'}
                    </h3>
                    <Chart
                        type="bar"
                        data={campaignROI.map(c => ({ name: c.name, value: c.roi }))}
                        dataKey="value"
                        nameKey="name"
                        height={300}
                        colors={['var(--apple-green)']}
                    />
                </LiquidGlassCard>

                {/* Monthly ROI Trend */}
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? 'اتجاه عائد الاستثمار الشهري' : 'Monthly ROI Trend'}
                    </h3>
                    <Chart
                        type="line"
                        data={monthlyROI.map(m => ({ month: m.month, roi: m.roi }))}
                        dataKey="roi"
                        nameKey="month"
                        height={300}
                        colors={['var(--apple-green)']}
                    />
                </LiquidGlassCard>
            </LiquidGlassCard>
        </div>
    );
}

