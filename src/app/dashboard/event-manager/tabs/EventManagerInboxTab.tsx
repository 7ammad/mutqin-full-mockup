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
import { api } from "@/lib/api";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import type { DemoEvent, DemoAssignment } from "@/context/demoSeed";
import { Inbox, Calendar, Clock, CheckCircle } from "lucide-react";

interface EventManagerInboxTabProps {
    assignmentsData: Array<{ event: DemoEvent; assignment: DemoAssignment }>;
}

export default function EventManagerInboxTab({ assignmentsData }: EventManagerInboxTabProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const stats = useMemo(() => {
        const active = assignmentsData.filter((a) => a.assignment.status === "accepted").length;
        const pending = assignmentsData.filter((a) => a.assignment.status === "pending").length;
        const declined = assignmentsData.filter((a) => a.assignment.status === "declined").length;
        return { active, pending, declined };
    }, [assignmentsData]);

    const handleAccept = async (assignmentId: string) => {
        setLoading(prev => ({ ...prev, [assignmentId]: true }));
        try {
            await api.respondAssignment({ assignmentId, decision: "accept" });
            showToast(language === "ar" ? "تم قبول التكليف" : "Assignment accepted", "success");
            // Refresh will be handled by parent
            window.location.reload();
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === "ar" ? "فشل قبول التكليف" : "Unable to accept assignment");
            showToast(message, "info");
        } finally {
            setLoading(prev => ({ ...prev, [assignmentId]: false }));
        }
    };

    const handleDecline = async (assignmentId: string) => {
        setLoading(prev => ({ ...prev, [assignmentId]: true }));
        try {
            await api.respondAssignment({ assignmentId, decision: "decline" });
            showToast(language === "ar" ? "تم رفض التكليف" : "Assignment declined", "success");
            window.location.reload();
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === "ar" ? "فشل رفض التكليف" : "Unable to decline assignment");
            showToast(message, "info");
        } finally {
            setLoading(prev => ({ ...prev, [assignmentId]: false }));
        }
    };

    const handleViewEvent = (eventId: string) => {
        router.push(buildRoute.eventManagerEvent(eventId));
    };

    const handleViewLiveOps = (eventId: string) => {
        router.push(`/dashboard/event-manager?tab=live-ops&eventId=${eventId}`);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === "ar" ? "التكليفات النشطة" : "Active Assignments"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{stats.active}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Calendar className="w-6 h-6 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === "ar" ? "قيد الانتظار" : "Pending"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{stats.pending}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <Clock className="w-6 h-6 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === "ar" ? "مرفوض" : "Declined"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{stats.declined}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <CheckCircle className="w-6 h-6 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Assignments List */}
            {assignmentsData.length === 0 ? (
                <EmptyState
                    title={language === "ar" ? "لا توجد مهام حالياً" : "No assignments"}
                    description={language === "ar" ? "لا توجد تكليفات جديدة في صندوق الوارد. ستظهر المهام الجديدة هنا عند إنشاء المنظمين تكليفات جديدة." : "No new assignments in inbox. New tasks will appear here when organizers create assignments."}
                    icon={Inbox}
                />
            ) : (
                <div className="space-y-4">
                    {assignmentsData.map(({ assignment, event }) => {
                        const eventData = convertDemoEventToEvent(event);
                        const statusLabel =
                            assignment.status === "accepted"
                                ? language === "ar" ? "نشط" : "Active"
                                : assignment.status === "pending"
                                ? language === "ar" ? "قيد الانتظار" : "Pending"
                                : language === "ar" ? "مرفوض" : "Declined";

                        return (
                            <div key={assignment.id} className="relative">
                                <ActivityCard
                                    event={eventData}
                                    context="event-manager"
                                    variant="row"
                                    showDescription={false}
                                    actionButton={
                                        assignment.status === "pending"
                                            ? undefined
                                            : assignment.status === "accepted"
                                            ? {
                                                  label: language === "ar" ? "فتح التشغيل المباشر" : "Open Live Ops",
                                                  onClick: () => handleViewLiveOps(event.id),
                                                  variant: "default",
                                              }
                                            : undefined
                                    }
                                />
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <Badge
                                        className={
                                            assignment.status === "accepted"
                                                ? "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/30"
                                                : assignment.status === "pending"
                                                ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30"
                                                : "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30"
                                        }
                                    >
                                        {statusLabel}
                                    </Badge>
                                </div>
                                {assignment.status === "pending" && (
                                    <div className="mt-2 flex gap-2">
                                        <GlassButton
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleAccept(assignment.id)}
                                            disabled={loading[assignment.id]}
                                        >
                                            {language === "ar" ? "قبول" : "Accept"}
                                        </GlassButton>
                                        <GlassButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDecline(assignment.id)}
                                            disabled={loading[assignment.id]}
                                        >
                                            {language === "ar" ? "رفض" : "Decline"}
                                        </GlassButton>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}




