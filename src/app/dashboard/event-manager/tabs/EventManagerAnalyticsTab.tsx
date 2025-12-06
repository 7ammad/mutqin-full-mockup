"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Chart } from "@/components/shared/Chart";
import { getEventAttendanceData } from "@/context/demoStore";
import type { DemoEvent, DemoAssignment } from "@/context/demoSeed";

interface EventManagerAnalyticsTabProps {
    assignmentsData: Array<{ event: DemoEvent; assignment: DemoAssignment }>;
}

export default function EventManagerAnalyticsTab({ assignmentsData }: EventManagerAnalyticsTabProps) {
    const { language } = useLanguage();

    const acceptedAssignments = useMemo(
        () => assignmentsData.filter((a) => a.assignment.status === "accepted"),
        [assignmentsData]
    );

    const analyticsData = useMemo(() => {
        const attendanceDataByEvent = acceptedAssignments.map(({ event, assignment }) => {
            const attendanceData = getEventAttendanceData(event.id);
            return {
                event,
                assignment,
                ...attendanceData,
            };
        });

        const totalCheckedIn = attendanceDataByEvent.reduce((sum, data) => sum + data.checkedInCount, 0);
        const totalTickets = attendanceDataByEvent.reduce((sum, data) => sum + data.totalCount, 0);
        const attendanceRate = totalTickets > 0 ? (totalCheckedIn / totalTickets) * 100 : 0;
        const exceptionRate = 0; // Mock - would come from AttendanceOverride API
        const finalizedCount = attendanceDataByEvent.filter((data) => data.finalized).length;

        // Group by city (with optional chaining)
        const byCity = attendanceDataByEvent.reduce((acc, { event, checkedInCount, totalCount }) => {
            const city = event?.city || (language === "ar" ? "غير محدد" : "Unknown");
            if (!acc[city]) {
                acc[city] = { checkedIn: 0, total: 0, events: 0 };
            }
            acc[city].checkedIn += checkedInCount;
            acc[city].total += totalCount;
            acc[city].events += 1;
            return acc;
        }, {} as Record<string, { checkedIn: number; total: number; events: number }>);

        // Group by event (with optional chaining)
        const byEvent = attendanceDataByEvent.map(({ event, checkedInCount, totalCount }) => {
            const eventTitle = language === "ar" ? event?.titleAr || event?.title : event?.titleEn || event?.title || 'Event';
            const rate = totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0;
            return {
                name: eventTitle.length > 30 ? eventTitle.substring(0, 30) + "..." : eventTitle,
                checkedIn: checkedInCount,
                total: totalCount,
                rate: Math.round(rate * 10) / 10,
            };
        });

        return {
            totalCheckedIn,
            totalTickets,
            attendanceRate: Math.round(attendanceRate * 10) / 10,
            exceptionRate,
            finalizedCount,
            byCity,
            byEvent,
        };
    }, [acceptedAssignments, language]);

    const cityChartData = useMemo(() => {
        return Object.entries(analyticsData.byCity).map(([city, data]) => ({
            name: city,
            value: data.total > 0 ? Math.round((data.checkedIn / data.total) * 100) : 0,
            checkedIn: data.checkedIn,
            total: data.total,
        }));
    }, [analyticsData.byCity]);

    const eventChartData = useMemo(() => {
        return analyticsData.byEvent.map((event) => ({
            name: event.name,
            rate: event.rate,
            checkedIn: event.checkedIn,
            total: event.total,
        }));
    }, [analyticsData.byEvent]);

    if (acceptedAssignments.length === 0) {
        return (
            <EmptyState
                title={language === "ar" ? "لا توجد تكليفات مقبولة" : "No accepted assignments"}
                description={
                    language === "ar"
                        ? "اقبل تكليفاً من صندوق الوارد لعرض التحليلات"
                        : "Accept an assignment from Inbox to view analytics"
                }
                icon={BarChart3}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "معدل الحضور" : "Attendance Rate"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{analyticsData.attendanceRate}%</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {analyticsData.totalCheckedIn} / {analyticsData.totalTickets}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "معدل الاستثناءات" : "Exception Rate"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{analyticsData.exceptionRate}%</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? "لا توجد استثناءات" : "No exceptions"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-orange)]/10 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "الفعاليات المنتهية" : "Finalized Events"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{analyticsData.finalizedCount}</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? `من ${acceptedAssignments.length}` : `of ${acceptedAssignments.length}`}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "إجمالي الفعاليات" : "Total Events"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{acceptedAssignments.length}</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? "نشطة" : "Active"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-[var(--apple-blue)]" />
                        <h3 className="text-lg font-semibold text-[var(--label)]">
                            {language === "ar" ? "معدل الحضور حسب المدينة" : "Attendance Rate by City"}
                        </h3>
                    </div>
                    {cityChartData.length > 0 ? (
                        <Chart
                            type="bar"
                            data={cityChartData}
                            dataKey="value"
                            nameKey="name"
                            height={300}
                            colors={['var(--apple-blue)']}
                        />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-[var(--secondary-label)]">
                            {language === "ar" ? "لا توجد بيانات" : "No data available"}
                        </div>
                    )}
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-[var(--apple-green)]" />
                        <h3 className="text-lg font-semibold text-[var(--label)]">
                            {language === "ar" ? "معدل الحضور حسب الفعالية" : "Attendance Rate by Event"}
                        </h3>
                    </div>
                    {eventChartData.length > 0 ? (
                        <Chart
                            type="bar"
                            data={eventChartData}
                            dataKey="rate"
                            nameKey="name"
                            height={300}
                            colors={['var(--apple-green)']}
                        />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-[var(--secondary-label)]">
                            {language === "ar" ? "لا توجد بيانات" : "No data available"}
                        </div>
                    )}
                </LiquidGlassCard>
            </div>

            {/* Performance Details Table */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-[var(--apple-blue)]" />
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {language === "ar" ? "تفاصيل الأداء" : "Performance Details"}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--system-fill)]">
                                <th className="text-left py-3 px-4 font-semibold text-[var(--label)]">
                                    {language === "ar" ? "الفعالية" : "Event"}
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-[var(--label)]">
                                    {language === "ar" ? "المدينة" : "City"}
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                                    {language === "ar" ? "تم التحقق" : "Checked In"}
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                                    {language === "ar" ? "الإجمالي" : "Total"}
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                                    {language === "ar" ? "المعدل" : "Rate"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {acceptedAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[var(--secondary-label)]">
                                        {language === "ar" ? "لا توجد بيانات" : "No data available"}
                                    </td>
                                </tr>
                            ) : (
                                acceptedAssignments.map(({ event, assignment }) => {
                                    if (!event) return null;
                                    const attendanceData = getEventAttendanceData(event.id);
                                    const rate = attendanceData.totalCount > 0 
                                        ? Math.round((attendanceData.checkedInCount / attendanceData.totalCount) * 100) 
                                        : 0;
                                    const eventTitle = language === "ar" ? event?.titleAr || event?.title : event?.titleEn || event?.title || 'Event';

                                    return (
                                        <tr key={event.id} className="border-b border-[var(--system-fill)] hover:bg-[var(--system-fill)]/30 transition-colors">
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-[var(--label)]">{eventTitle}</p>
                                            </td>
                                            <td className="py-3 px-4 text-[var(--label)]">{event?.city || "-"}</td>
                                        <td className="py-3 px-4 text-center text-[var(--label)] font-medium">
                                            {attendanceData.checkedInCount}
                                        </td>
                                        <td className="py-3 px-4 text-center text-[var(--secondary-label)]">
                                            {attendanceData.totalCount}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge
                                                variant={rate >= 80 ? "default" : "outline"}
                                                className={
                                                    rate >= 80
                                                        ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                                                        : rate >= 50
                                                        ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/20"
                                                        : ""
                                                }
                                            >
                                                {rate}%
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </LiquidGlassCard>
        </div>
    );
}



