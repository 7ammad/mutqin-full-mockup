"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { GlassButton } from "@/components/ui/glass-button";
import { ClipboardList, Users, AlertCircle, CheckCircle2, Clock, Eye } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { getEventAttendanceData } from "@/context/demoStore";
import type { DemoEvent } from "@/context/demoSeed";
import { buildRoute } from "@/lib/routes";

interface EventManagerAttendanceTabProps {
  assignments: Array<{
    event: DemoEvent;
    assignment: { id: string; eventId: string; organizerId: string; eventManagerId: string; status: "pending" | "accepted" | "declined" };
  }>;
  language: "ar" | "en";
}

export default function EventManagerAttendanceTab({
  assignments,
  language,
}: EventManagerAttendanceTabProps) {
  const router = useRouter();
  // Get all accepted assignments
  const acceptedAssignments = useMemo(
    () => assignments.filter((a) => a.assignment.status === "accepted"),
    [assignments]
  );

  // Get attendance data for all accepted events
  const attendanceDataByEvent = useMemo(() => {
    return acceptedAssignments.map(({ event, assignment }) => {
      const attendanceData = getEventAttendanceData(event.id);
      return {
        event,
        assignment,
        ...attendanceData,
      };
    });
  }, [acceptedAssignments]);

  const totalCheckedIn = attendanceDataByEvent.reduce((sum, data) => sum + data.checkedInCount, 0);
  const totalTickets = attendanceDataByEvent.reduce((sum, data) => sum + data.totalCount, 0);
  const finalizedCount = attendanceDataByEvent.filter((data) => data.finalized).length;

  // Mock exceptions (read-only for now, as per CONTRACTS.md AttendanceOverride exists but no endpoint yet)
  type Exception = {
    id: string;
    activityId: string;
    ticketId: string;
    reason: string;
    status: "requested" | "approved" | "rejected";
  };
  const exceptions = useMemo<Exception[]>(() => {
    // Return empty for now - exceptions would come from AttendanceOverride API
    return [];
  }, []);

  if (acceptedAssignments.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          title={language === "ar" ? "لا توجد تكليفات مقبولة" : "No accepted assignments"}
          description={
            language === "ar"
              ? "اقبل تكليفاً من صندوق الوارد لعرض بيانات الحضور"
              : "Accept an assignment from Inbox to view attendance data"
          }
          icon={ClipboardList}
          actionLabel={language === "ar" ? "إعادة تعيين البيانات التجريبية" : "Reset demo data"}
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
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "إجمالي التحقق" : "Total Checked In"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">{totalCheckedIn}</p>
              <p className="text-xs text-[var(--secondary-label)] mt-1">
                {language === "ar" ? `من ${totalTickets}` : `of ${totalTickets}`}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[var(--apple-blue)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "منتهي" : "Finalized"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">{finalizedCount}</p>
              <p className="text-xs text-[var(--secondary-label)] mt-1">
                {language === "ar" ? `من ${acceptedAssignments.length}` : `of ${acceptedAssignments.length}`}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "الاستثناءات" : "Exceptions"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">{exceptions.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-orange)]/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Attendance Table */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-[var(--apple-blue)]" />
          <h2 className="text-xl font-semibold text-[var(--label)]">
            {language === "ar" ? "جدول الحضور" : "Attendance Table"}
          </h2>
        </div>

        {attendanceDataByEvent.length === 0 ? (
          <EmptyState
            title={language === "ar" ? "لا توجد بيانات حضور" : "No attendance data"}
            description={
              language === "ar"
                ? "لا توجد تذاكر مسجلة لهذه الفعاليات بعد"
                : "No tickets registered for these events yet"
            }
            icon={Users}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--system-fill)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--label)]">
                    {language === "ar" ? "الفعالية" : "Event"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--label)]">
                    {language === "ar" ? "التاريخ" : "Date"}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                    {language === "ar" ? "تم التحقق" : "Checked In"}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                    {language === "ar" ? "الإجمالي" : "Total"}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--label)]">
                    {language === "ar" ? "الحالة" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceDataByEvent.map(({ event, checkedInCount, totalCount, finalized }) => (
                  <tr 
                    key={event.id} 
                    className="border-b border-[var(--system-fill)] hover:bg-[var(--system-fill)]/30 transition-colors cursor-pointer"
                    onClick={() => router.push(buildRoute.eventManagerEventAttendance(event.id))}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--label)]">
                          {language === "ar" ? event.titleAr || event.title : event.titleEn || event.title}
                        </p>
                        <p className="text-xs text-[var(--secondary-label)]">
                          {language === "ar" ? event.organizerAr : event.organizerEn}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--label)]">
                      {event.date
                        ? new Date(event.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-[var(--label)] font-medium">
                      {checkedInCount}
                    </td>
                    <td className="py-3 px-4 text-center text-[var(--secondary-label)]">
                      {totalCount}
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <Badge
                          variant={finalized ? "default" : "outline"}
                          className={
                            finalized
                              ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                              : ""
                          }
                        >
                          {finalized
                            ? language === "ar"
                              ? "منتهي"
                              : "Finalized"
                            : language === "ar"
                            ? "قيد المعالجة"
                            : "In Progress"}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LiquidGlassCard>

      {/* Exceptions List */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
          <h2 className="text-xl font-semibold text-[var(--label)]">
            {language === "ar" ? "الاستثناءات" : "Exceptions"}
          </h2>
        </div>

        {exceptions.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[var(--secondary-label)] opacity-50" />
            <p className="text-sm text-[var(--secondary-label)]">
              {language === "ar"
                ? "لا توجد استثناءات حالياً. الاستثناءات تظهر هنا عند الحاجة إلى تجاوزات في الحضور."
                : "No exceptions currently. Exceptions appear here when attendance overrides are needed."}
            </p>
            <p className="text-xs text-[var(--secondary-label)] mt-2 opacity-75">
              {language === "ar"
                ? "(ميزة إنشاء الاستثناءات قيد التطوير)"
                : "(Exception creation feature coming soon)"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className="p-4 rounded-lg border border-[var(--system-fill)] bg-[var(--system-fill)]/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--label)] mb-1">
                      {language === "ar" ? "استثناء الحضور" : "Attendance Override"}
                    </p>
                    <p className="text-sm text-[var(--secondary-label)]">
                      {language === "ar" ? "السبب" : "Reason"}: {exception.reason}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {exception.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </LiquidGlassCard>
    </div>
  );
}

