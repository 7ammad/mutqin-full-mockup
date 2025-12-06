"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/toast-context";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import type { DemoEvent, DemoAssignment } from "@/context/demoSeed";
import { Activity, QrCode, Search, CheckCircle2, XCircle, Clock } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load QR scanner
const MobileQRScanner = dynamic(() => import("@/components/eventmanager/MobileQRScanner"), {
    ssr: false,
});

interface EventManagerLiveOpsTabProps {
    assignmentsData: Array<{ event: DemoEvent; assignment: DemoAssignment }>;
}

interface RecentScan {
    ticketId: string;
    result: "checked_in" | "duplicate" | "invalid";
    timestamp: Date;
}

export default function EventManagerLiveOpsTab({ assignmentsData }: EventManagerLiveOpsTabProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const { showToast } = useToast();
    
    const selectedEventId = searchParams.get("eventId");
    const [manualTicketId, setManualTicketId] = useState("");
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

    const acceptedAssignments = useMemo(() => {
        return assignmentsData.filter((a) => a.assignment.status === "accepted");
    }, [assignmentsData]);

    const selectedEvent = useMemo(() => {
        if (!selectedEventId) return null;
        const assignment = acceptedAssignments.find((a) => a.event.id === selectedEventId);
        return assignment ? assignment.event : null;
    }, [selectedEventId, acceptedAssignments]);

    const handleScan = async (result: string) => {
        try {
            const ticketId = result;
            await api.checkIn({ ticketId, eventManagerId: "em-1" });
            
            setRecentScans((prev) => [
                { ticketId, result: "checked_in", timestamp: new Date() },
                ...prev.slice(0, 9), // Keep last 10 scans
            ]);
            
            showToast(
                language === "ar" ? "تم تسجيل الوصول بنجاح" : "Check-in successful",
                "success"
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : "";
            const isDuplicate = message.includes("duplicate") || message.includes("already");
            const isInvalid = message.includes("invalid") || message.includes("not found");
            
            const result: RecentScan["result"] = isDuplicate ? "duplicate" : isInvalid ? "invalid" : "invalid";
            
            setRecentScans((prev) => [
                { ticketId: result, result, timestamp: new Date() },
                ...prev.slice(0, 9),
            ]);
            
            showToast(
                language === "ar" ? "فشل تسجيل الوصول" : "Check-in failed",
                "info"
            );
        }
    };

    const handleManualCheckIn = async () => {
        if (!manualTicketId.trim()) return;
        await handleScan(manualTicketId.trim());
        setManualTicketId("");
    };

    if (acceptedAssignments.length === 0) {
        return (
            <EmptyState
                title={language === "ar" ? "لا توجد تكليفات مقبولة" : "No accepted assignments"}
                titleAr={language === "ar" ? "لا توجد تكليفات مقبولة" : undefined}
                description={language === "ar" ? "لا توجد تكليفات مقبولة لفتح وحدة تسجيل الوصول. اقبل تكليفاً من صندوق الوارد أولاً." : "No accepted assignments to open check-in console. Accept an assignment from Inbox first."}
                descriptionAr={language === "ar" ? "لا توجد تكليفات مقبولة لفتح وحدة تسجيل الوصول. اقبل تكليفاً من صندوق الوارد أولاً." : undefined}
                icon={Activity}
            />
        );
    }

    // Guard: if eventId is provided but doesn't match any accepted assignment
    if (selectedEventId && !selectedEvent) {
        return (
            <EmptyState
                title={language === "ar" ? "فعالية غير موجودة" : "Event not found"}
                titleAr={language === "ar" ? "فعالية غير موجودة" : undefined}
                description={language === "ar" ? "الفعالية المحددة غير موجودة أو غير مقبولة. اختر فعالية من صندوق الوارد." : "The selected event does not exist or is not accepted. Select an event from Inbox."}
                descriptionAr={language === "ar" ? "الفعالية المحددة غير موجودة أو غير مقبولة. اختر فعالية من صندوق الوارد." : undefined}
                icon={Activity}
                actionLabel={language === "ar" ? "فتح صندوق الوارد" : "Open Inbox"}
                actionLabelAr={language === "ar" ? "فتح صندوق الوارد" : undefined}
                onAction={() => {
                    const params = new URLSearchParams();
                    params.set("tab", "inbox");
                    router.push(`/dashboard/event-manager?${params.toString()}`);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Event Selection */}
            {!selectedEvent && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === "ar" ? "اختر الفعالية" : "Select Event"}
                    </h2>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {acceptedAssignments.map(({ assignment, event }) => {
                            const eventData = convertDemoEventToEvent(event);
                            return (
                                <div key={assignment.id}>
                                    <ActivityCard
                                        event={eventData}
                                        context="event-manager"
                                        variant="compact"
                                        actionButton={{
                                            label: language === "ar" ? "فتح تسجيل الوصول" : "Open Check-In",
                                            onClick: () => router.push(`/dashboard/event-manager?tab=live-ops&eventId=${event.id}`),
                                            variant: "default",
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Check-In Interface */}
            {selectedEvent && (
                <div className="space-y-6">
                    {/* Event Info */}
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--label)] mb-2">
                                    {language === "ar" ? selectedEvent?.titleAr || selectedEvent?.title : selectedEvent?.titleEn || selectedEvent?.title}
                                </h2>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === "ar" ? selectedEvent?.organizerAr : selectedEvent?.organizerEn}
                                </p>
                            </div>
                            <GlassButton
                                variant="outline"
                                size="sm"
                                onClick={() => router.push("/dashboard/event-manager?tab=live-ops")}
                            >
                                {language === "ar" ? "تغيير الفعالية" : "Change Event"}
                            </GlassButton>
                        </div>
                    </LiquidGlassCard>

                    {/* QR Scanner */}
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            {language === "ar" ? "ماسح QR" : "QR Scanner"}
                        </h3>
                        <MobileQRScanner onScan={handleScan} />
                    </LiquidGlassCard>

                    {/* Manual Check-In */}
                    <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            {language === "ar" ? "بحث يدوي" : "Manual Search"}
                        </h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder={language === "ar" ? "أدخل رقم التذكرة" : "Enter ticket ID"}
                                value={manualTicketId}
                                onChange={(e) => setManualTicketId(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleManualCheckIn();
                                    }
                                }}
                                className="flex-1"
                            />
                            <GlassButton
                                variant="default"
                                onClick={handleManualCheckIn}
                                disabled={!manualTicketId.trim()}
                            >
                                {language === "ar" ? "تسجيل" : "Check In"}
                            </GlassButton>
                        </div>
                    </LiquidGlassCard>

                    {/* Recent Scans */}
                    {recentScans.length > 0 && (
                        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                                {language === "ar" ? "المسوحات الأخيرة" : "Recent Scans"}
                            </h3>
                            <div className="space-y-2">
                                {recentScans.map((scan, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            {scan.result === "checked_in" ? (
                                                <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)]" />
                                            ) : scan.result === "duplicate" ? (
                                                <Clock className="h-5 w-5 text-[var(--apple-orange)]" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-[var(--apple-red)]" />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-[var(--label)]">
                                                    {scan.ticketId.slice(-8)}
                                                </div>
                                                <div className="text-xs text-[var(--secondary-label)]">
                                                    {scan.timestamp.toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US")}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                scan.result === "checked_in"
                                                    ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30"
                                                    : scan.result === "duplicate"
                                                    ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30"
                                                    : "bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/30"
                                            }
                                        >
                                            {scan.result === "checked_in"
                                                ? language === "ar" ? "تم التسجيل" : "Checked In"
                                                : scan.result === "duplicate"
                                                ? language === "ar" ? "مكرر" : "Duplicate"
                                                : language === "ar" ? "غير صالح" : "Invalid"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </LiquidGlassCard>
                    )}
                </div>
            )}
        </div>
    );
}

