"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, CheckCircle2, AlertCircle, Clock, Users, Calendar } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { getEventAttendanceData } from "@/context/demoStore";
import type { DemoEvent } from "@/context/demoSeed";
import { useToast } from "@/components/ui/toast-context";
import { buildRoute } from "@/lib/routes";

interface HandoverPackTabProps {
  assignments: Array<{
    event: DemoEvent;
    assignment: { id: string; eventId: string; organizerId: string; eventManagerId: string; status: "pending" | "accepted" | "declined" };
  }>;
  language: "ar" | "en";
}

export default function HandoverPackTab({ assignments, language }: HandoverPackTabProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [generatedPacks, setGeneratedPacks] = useState<Set<string>>(new Set());

  // Get all accepted assignments
  const acceptedAssignments = useMemo(
    () => assignments.filter((a) => a.assignment.status === "accepted"),
    [assignments]
  );

  // Get attendance data for all accepted events
  const packDataByEvent = useMemo(() => {
    return acceptedAssignments.map(({ event, assignment }) => {
      const attendanceData = getEventAttendanceData(event.id);
      
      // Generate timestamped log snippet (mock audit events)
      const logSnippet = [
        {
          timestamp: new Date().toISOString(),
          action: language === "ar" ? "   " : "Handover pack generated",
          actor: language === "ar" ? " " : "Event Manager",
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: language === "ar" ? "  " : "Attendance finalized",
          actor: language === "ar" ? " " : "Event Manager",
        },
        {
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: language === "ar" ? "   " : "Attendance verified",
          actor: language === "ar" ? " " : "Event Manager",
        },
      ];

      return {
        event,
        assignment,
        attendanceData,
        logSnippet,
        exceptionsCount: 0, // Mock - would come from AttendanceOverride API
      };
    });
  }, [acceptedAssignments, language]);

  const handleGeneratePack = (eventId: string) => {
    setGeneratedPacks((prev) => new Set(prev).add(eventId));
    showToast(
      language === "ar" ? "   " : "Handover pack generated",
      "success"
    );
  };

  const handlePreviewPack = (eventId: string) => {
    // Preview is just showing the data - already visible
    showToast(
      language === "ar" ? "  " : "Previewing handover pack",
      "info"
    );
  };

  if (acceptedAssignments.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          title={language === "ar" ? "   " : "No accepted assignments"}
          description={
            language === "ar"
              ? "       "
              : "Accept an assignment from Inbox to generate handover pack"
          }
          icon={FileText}
          actionLabel={language === "ar" ? "   " : "Reset demo data"}
          onAction={async () => {
            try {
              await fetch('/api/demo/reset', { method: 'POST' });
              window.location.reload();
            } catch (error) {
              console.error('Failed to reset demo data:', error);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
          <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
          {language === "ar" ? " " : "Handover Pack"}
        </h2>
      </div>

      {packDataByEvent.map(({ event, assignment, attendanceData, logSnippet, exceptionsCount }) => {
        const isGenerated = generatedPacks.has(event.id);
        const eventTitle = language === "ar" ? event.titleAr || event.title : event.titleEn || event.title;

        return (
          <div
            key={event.id}
            onClick={() => router.push(buildRoute.eventManagerEventHandover(event.id))}
            className="cursor-pointer"
          >
          <LiquidGlassCard 
            blurIntensity="lg" 
            interactive={true}
            className="p-6"
          >
            <div className="space-y-6">
              {/* Event Header */}
              <div className="flex items-start justify-between border-b border-[var(--system-fill)] pb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[var(--label)] mb-2">{eventTitle}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--secondary-label)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date
                        ? new Date(event.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {language === "ar" ? "" : "City"}: {event.city || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isGenerated ? (
                    <Badge
                      variant="default"
                      className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {language === "ar" ? " " : "Generated"}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {language === "ar" ? "" : "Draft"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Artifacts Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Attendance Ledger */}
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[var(--apple-blue)]" />
                      <h4 className="font-semibold text-[var(--label)]">
                        {language === "ar" ? " " : "Attendance Ledger"}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-label)]">
                        {language === "ar" ? " " : "Checked In"}
                      </span>
                      <span className="font-medium text-[var(--label)]">
                        {attendanceData.checkedInCount} / {attendanceData.totalCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-label)]">
                        {language === "ar" ? "" : "Status"}
                      </span>
                      <Badge
                        variant={attendanceData.finalized ? "default" : "outline"}
                        className={
                          attendanceData.finalized
                            ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                            : ""
                        }
                      >
                        {attendanceData.finalized
                          ? language === "ar"
                            ? ""
                            : "Finalized"
                          : language === "ar"
                          ? " "
                          : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                </LiquidGlassCard>

                {/* Exceptions Summary */}
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
                      <h4 className="font-semibold text-[var(--label)]">
                        {language === "ar" ? " " : "Exceptions Summary"}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-label)]">
                        {language === "ar" ? " " : "Total Exceptions"}
                      </span>
                      <span className="font-medium text-[var(--label)]">{exceptionsCount}</span>
                    </div>
                    {exceptionsCount === 0 && (
                      <p className="text-xs text-[var(--secondary-label)] italic">
                        {language === "ar" ? "  " : "No exceptions"}
                      </p>
                    )}
                  </div>
                </LiquidGlassCard>

                {/* Timestamped Log */}
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[var(--apple-blue)]" />
                      <h4 className="font-semibold text-[var(--label)]">
                        {language === "ar" ? " " : "Event Log"}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--secondary-label)]">
                      {language === "ar" ? " 3 " : "Last 3 events"}
                    </p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {logSnippet.slice(0, 3).map((log, idx) => (
                        <div key={idx} className="text-xs text-[var(--secondary-label)]">
                          <div className="font-medium text-[var(--label)]">{log.action}</div>
                          <div className="text-[10px] opacity-75">
                            {new Date(log.timestamp).toLocaleString(language === "ar" ? "ar-SA" : "en-US")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </LiquidGlassCard>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-[var(--system-fill)]" onClick={(e) => e.stopPropagation()}>
                {isGenerated ? (
                  <>
                    <GlassButton
                      variant="default"
                      size="sm"
                      onClick={() => handlePreviewPack(event.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {language === "ar" ? "" : "Preview"}
                    </GlassButton>
                    <GlassButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In real implementation, this would download the pack
                        showToast(
                          language === "ar" ? "   " : "Download coming soon",
                          "info"
                        );
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {language === "ar" ? "" : "Download"}
                    </GlassButton>
                  </>
                ) : (
                  <GlassButton
                    variant="default"
                    size="sm"
                    onClick={() => handleGeneratePack(event.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {language === "ar" ? "  " : "Generate Pack"}
                  </GlassButton>
                )}
              </div>
            </div>
          </LiquidGlassCard>
          </div>
        );
      })}
    </div>
  );
}


