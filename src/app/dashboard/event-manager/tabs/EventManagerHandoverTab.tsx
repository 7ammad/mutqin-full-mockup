"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/toast-context";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { getEventAttendanceData } from "@/context/demoStore";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import type { DemoEvent, DemoAssignment } from "@/context/demoSeed";
import { FileText, Download, Eye, CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";

interface EventManagerHandoverTabProps {
    assignmentsData: Array<{ event: DemoEvent; assignment: DemoAssignment }>;
}

export default function EventManagerHandoverTab({ assignmentsData }: EventManagerHandoverTabProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [generatedPacks, setGeneratedPacks] = useState<Set<string>>(new Set());

    const acceptedAssignments = useMemo(
        () => assignmentsData.filter((a) => a.assignment.status === "accepted"),
        [assignmentsData]
    );

    const packDataByEvent = useMemo(() => {
        return acceptedAssignments.map(({ event, assignment }) => {
            const attendanceData = getEventAttendanceData(event.id);
            
            // Mock audit log snippet
            const logSnippet = [
                {
                    timestamp: new Date().toISOString(),
                    action: language === "ar" ? "تم إنشاء حزمة التسليم" : "Handover pack generated",
                    actor: language === "ar" ? "مدير الفعاليات" : "Event Manager",
                },
                {
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    action: language === "ar" ? "تم إتمام الحضور" : "Attendance finalized",
                    actor: language === "ar" ? "مدير الفعاليات" : "Event Manager",
                },
            ];

            return {
                event,
                assignment,
                attendanceData,
                logSnippet,
                exceptionsCount: 0,
            };
        });
    }, [acceptedAssignments, language]);

    const handleGeneratePack = (eventId: string) => {
        setGeneratedPacks((prev) => new Set(prev).add(eventId));
        showToast(
            language === "ar" ? "تم إنشاء حزمة التسليم" : "Handover pack generated",
            "success"
        );
    };

    if (acceptedAssignments.length === 0) {
        return (
            <EmptyState
                title={language === "ar" ? "لا توجد تكليفات مقبولة" : "No accepted assignments"}
                description={
                    language === "ar"
                        ? "اقبل تكليفاً من صندوق الوارد لإنشاء حزمة التسليم"
                        : "Accept an assignment from Inbox to generate handover pack"
                }
                icon={FileText}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                    {language === "ar" ? "حزمة التسليم" : "Handover Pack"}
                </h2>
            </div>

            <div className="space-y-4">
                {packDataByEvent.map(({ event, assignment, attendanceData, logSnippet, exceptionsCount }) => {
                    const isGenerated = generatedPacks.has(event.id);
                    const eventData = convertDemoEventToEvent(event);

                    return (
                        <LiquidGlassCard key={event.id} blurIntensity="lg" interactive={false} className="p-6">
                            <div className="space-y-6">
                                {/* Event Identity */}
                                <ActivityCard
                                    event={eventData}
                                    context="event-manager"
                                    variant="compact"
                                    showDescription={false}
                                />

                                {/* Handover Status */}
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--system-fill)]">
                                    <div className="flex items-center gap-2">
                                        {isGenerated ? (
                                            <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                {language === "ar" ? "تم الإنشاء" : "Generated"}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                {language === "ar" ? "مسودة" : "Draft"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Artifacts Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="h-5 w-5 text-[var(--apple-blue)]" />
                                            <h4 className="font-semibold text-[var(--label)]">
                                                {language === "ar" ? "سجل الحضور" : "Attendance Ledger"}
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--secondary-label)]">
                                                    {language === "ar" ? "تم التحقق" : "Checked In"}
                                                </span>
                                                <span className="font-medium text-[var(--label)]">
                                                    {attendanceData.checkedInCount} / {attendanceData.totalCount}
                                                </span>
                                            </div>
                                            <Badge
                                                variant={attendanceData.finalized ? "default" : "outline"}
                                                className={
                                                    attendanceData.finalized
                                                        ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                                                        : ""
                                                }
                                            >
                                                {attendanceData.finalized
                                                    ? language === "ar" ? "منتهي" : "Finalized"
                                                    : language === "ar" ? "قيد المعالجة" : "In Progress"}
                                            </Badge>
                                        </div>
                                    </LiquidGlassCard>

                                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
                                            <h4 className="font-semibold text-[var(--label)]">
                                                {language === "ar" ? "الاستثناءات" : "Exceptions"}
                                            </h4>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-[var(--label)]">{exceptionsCount}</span>
                                            <span className="text-[var(--secondary-label)] ml-2">
                                                {language === "ar" ? "استثناء" : "exception(s)"}
                                            </span>
                                        </div>
                                    </LiquidGlassCard>

                                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock className="h-5 w-5 text-[var(--apple-blue)]" />
                                            <h4 className="font-semibold text-[var(--label)]">
                                                {language === "ar" ? "سجل الأحداث" : "Event Log"}
                                            </h4>
                                        </div>
                                        <div className="text-xs text-[var(--secondary-label)]">
                                            {language === "ar" ? "آخر حدث" : "Last event"}: {logSnippet[0]?.action}
                                        </div>
                                    </LiquidGlassCard>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-[var(--system-fill)]">
                                    {isGenerated ? (
                                        <>
                                            <GlassButton
                                                variant="default"
                                                size="sm"
                                                onClick={() => router.push(buildRoute.eventManagerEventHandover(event.id))}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                {language === "ar" ? "عرض التفاصيل" : "View Details"}
                                            </GlassButton>
                                            <GlassButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    showToast(
                                                        language === "ar" ? "سيتم تنزيل الحزمة قريباً" : "Download coming soon",
                                                        "info"
                                                    );
                                                }}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                {language === "ar" ? "تنزيل" : "Download"}
                                            </GlassButton>
                                        </>
                                    ) : (
                                        <GlassButton
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleGeneratePack(event.id)}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            {language === "ar" ? "إنشاء حزمة التسليم" : "Generate Pack"}
                                        </GlassButton>
                                    )}
                                </div>
                            </div>
                        </LiquidGlassCard>
                    );
                })}
            </div>
        </div>
    );
}




