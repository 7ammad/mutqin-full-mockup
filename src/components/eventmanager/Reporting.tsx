"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Chart } from '@/components/shared/Chart';
import { FileText, Download, Send, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';

interface ReportingProps {
    eventId: string;
}

export default function Reporting({ eventId }: ReportingProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [reportGenerated, setReportGenerated] = useState(false);

    const event = events.find(e => e.id === eventId);

    // Mock report data
    const reportData = {
        totalAttendees: 192,
        checkedIn: 185,
        attendanceRate: 96.4,
        averageCheckInTime: 2.5,
        certificateGenerationTime: 15,
        cmeHoursSubmitted: event?.cme_hours || 0,
        performanceScore: 98,
    };

    const performanceMetrics = [
        { name: language === 'ar' ? 'الكفاءة' : 'Efficiency', value: 98 },
        { name: language === 'ar' ? 'الدقة' : 'Accuracy', value: 96 },
        { name: language === 'ar' ? 'السرعة' : 'Speed', value: 95 },
    ];

    const handleGenerateReport = () => {
        setReportGenerated(true);
    };

    const handleDownloadReport = () => {
        console.log('Downloading report...');
    };

    const handleSendToOrganizer = () => {
        console.log('Sending report to organizer...');
    };

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? 'التقارير' : 'Reporting';
    const performanceMetricsText = language === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics';
    const generateReportText = language === 'ar' ? 'إنشاء التقرير' : 'Generate Report';
    const downloadReportText = language === 'ar' ? 'تحميل التقرير' : 'Download Report';
    const sendToOrganizerText = language === 'ar' ? 'إرسال إلى المنظم' : 'Send to Organizer';
    const totalAttendeesText = language === 'ar' ? 'إجمالي الحضور' : 'Total Attendees';
    const attendanceRateText = language === 'ar' ? 'معدل الحضور' : 'Attendance Rate';
    const averageCheckInText = language === 'ar' ? 'متوسط وقت التسجيل' : 'Avg Check-In Time';
    const certificateTimeText = language === 'ar' ? 'وقت إنشاء الشهادات' : 'Certificate Generation Time';
    const cmeHoursText = language === 'ar' ? 'ساعات CME' : 'CME Hours';
    const performanceScoreText = language === 'ar' ? 'نقاط الأداء' : 'Performance Score';
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
                {!reportGenerated && (
                    <GlassButton
                        variant="default"
                        onClick={handleGenerateReport}
                     className="flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4 mr-2" />
                        {generateReportText}
                    </GlassButton>
                )}
            </div>

            {/* Performance Metrics */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{performanceMetricsText}</h3>
                <Chart
                    type="bar"
                    data={performanceMetrics}
                    dataKey="value"
                    height={250}
                />
            </LiquidGlassCard>

            {/* Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{totalAttendeesText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{reportData.totalAttendees}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <BarChart3 className="w-8 h-8 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{attendanceRateText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{reportData.attendanceRate}%</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <TrendingUp className="w-8 h-8 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">{performanceScoreText}</p>
                            <p className="text-3xl font-bold text-[var(--label)]">{reportData.performanceScore}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
                            <Clock className="w-8 h-8 text-[var(--apple-purple)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Detailed Stats */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? 'تفاصيل التقرير' : 'Report Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--system-fill)]/30">
                        <span className="text-[var(--secondary-label)]">{averageCheckInText}</span>
                        <span className="text-[var(--label)] font-medium">
                            {reportData.averageCheckInTime} {minutesText}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--system-fill)]/30">
                        <span className="text-[var(--secondary-label)]">{certificateTimeText}</span>
                        <span className="text-[var(--label)] font-medium">
                            {reportData.certificateGenerationTime} {minutesText}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--system-fill)]/30">
                        <span className="text-[var(--secondary-label)]">{cmeHoursText}</span>
                        <span className="text-[var(--label)] font-medium">{reportData.cmeHoursSubmitted}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--system-fill)]/30">
                        <span className="text-[var(--secondary-label)]">
                            {language === 'ar' ? 'تم التسجيل' : 'Checked In'}
                        </span>
                        <span className="text-[var(--label)] font-medium">{reportData.checkedIn}</span>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Actions */}
            {reportGenerated && (
                <div className="flex gap-4">
                    <GlassButton
                        variant="default"
                        onClick={handleDownloadReport}
                        className="flex-1 items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {downloadReportText}
                    </GlassButton>
                    <GlassButton
                        variant="outline"
                        onClick={handleSendToOrganizer}
                        className="flex-1 items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {sendToOrganizerText}
                    </GlassButton>
                </div>
            )}
        </div>
    );
}

