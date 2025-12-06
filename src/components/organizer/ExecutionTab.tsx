"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Users, FileText, UserPlus, Award, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { getOrganizerCompliance, getEventAttendanceData } from "@/context/demoStore";
import type { DemoEvent } from "@/context/demoSeed";
import { buildRoute } from "@/lib/routes";

interface ExecutionTabProps {
  events: DemoEvent[];
  language: "ar" | "en";
  router: ReturnType<typeof useRouter>;
  loading: boolean;
}

export default function ExecutionTab({ events, language, router, loading }: ExecutionTabProps) {
  const compliance = useMemo(() => getOrganizerCompliance("org-1"), []);
  
  const publishedEvents = useMemo(
    () => events.filter((e) => e.status === "published" || e.status === "closed"),
    [events]
  );

  if (loading) {
    return (
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-8 text-center">
        <p className="text-[var(--secondary-label)]">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </LiquidGlassCard>
    );
  }

  if (publishedEvents.length === 0) {
    return (
      <EmptyState
        title={language === "ar" ? "لا توجد أنشطة منشورة" : "No published activities"}
        description={language === "ar" ? "لا توجد أنشطة منشورة لعرض معلومات التنفيذ" : "No published activities to show execution information"}
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "التكليفات المقبولة" : "Accepted Assignments"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">
                {publishedEvents.length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[var(--apple-blue)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "الحضور المنتهي" : "Finalized Attendance"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">
                {compliance.filter((c) => c.attendanceRecords.status === "submitted").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                {language === "ar" ? "متأخر" : "Overdue"}
              </p>
              <p className="text-2xl font-bold text-[var(--label)]">
                {compliance.filter((c) => c.attendanceRecords.status === "overdue" || c.hoursRegistration.status === "overdue").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-red)]/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[var(--apple-red)]" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Compliance Submissions */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-[var(--apple-blue)]" />
          <h2 className="text-2xl font-bold text-[var(--label)]">
            {language === "ar" ? "تقديمات الامتثال" : "Compliance Submissions"}
          </h2>
        </div>

        {compliance.length === 0 ? (
          <EmptyState
            title={language === "ar" ? "لا توجد بيانات امتثال" : "No compliance data"}
            description={language === "ar" ? "لا توجد أنشطة منتهية تتطلب تقديمات امتثال" : "No completed activities requiring compliance submissions"}
            icon={FileText}
          />
        ) : (
          <div className="space-y-6">
            {compliance.map((item) => {
              const event = publishedEvents.find((e) => e.id === item.activityId);
              if (!event) return null;
              
              const attendanceData = getEventAttendanceData(item.activityId);
              const eventTitle = language === "ar" ? event.titleAr || event.title : event.titleEn || event.title;

              return (
                <LiquidGlassCard key={item.activityId} blurIntensity="md" interactive={false} className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--label)] mb-1">{eventTitle}</h3>
                        <p className="text-xs text-[var(--secondary-label)]">
                          {language === "ar" ? "انتهى في" : "Ended"}: {new Date(item.endedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Attendance Records */}
                      <div className="p-3 rounded-lg bg-[var(--system-fill)]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-[var(--secondary-label)] font-medium">
                            {language === "ar" ? "سجلات الحضور" : "Attendance Records"}
                          </p>
                          <Badge
                            variant={item.attendanceRecords.status === "submitted" ? "default" : item.attendanceRecords.status === "overdue" ? "outline" : "outline"}
                            className={
                              item.attendanceRecords.status === "submitted"
                                ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                                : item.attendanceRecords.status === "overdue"
                                ? "bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/20"
                                : ""
                            }
                          >
                            {item.attendanceRecords.status === "submitted"
                              ? language === "ar" ? "مقدم" : "Submitted"
                              : item.attendanceRecords.status === "overdue"
                              ? language === "ar" ? "متأخر" : "Overdue"
                              : language === "ar" ? "غير مبدئ" : "Not Started"}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--secondary-label)]">
                          {item.attendanceRecords.dueAt
                            ? `${language === "ar" ? "مستحق" : "Due"}: ${new Date(item.attendanceRecords.dueAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}`
                            : ""}
                        </p>
                        <p className="text-sm text-[var(--label)] mt-1">
                          {attendanceData.checkedInCount} / {attendanceData.totalCount} {language === "ar" ? "تم التحقق" : "checked in"}
                        </p>
                      </div>

                      {/* Hours Registration */}
                      <div className="p-3 rounded-lg bg-[var(--system-fill)]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-[var(--secondary-label)] font-medium">
                            {language === "ar" ? "تسجيل الساعات" : "Hours Registration"}
                          </p>
                          <Badge
                            variant={item.hoursRegistration.status === "submitted" ? "default" : item.hoursRegistration.status === "overdue" ? "outline" : "outline"}
                            className={
                              item.hoursRegistration.status === "submitted"
                                ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20"
                                : item.hoursRegistration.status === "overdue"
                                ? "bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/20"
                                : ""
                            }
                          >
                            {item.hoursRegistration.status === "submitted"
                              ? language === "ar" ? "مقدم" : "Submitted"
                              : item.hoursRegistration.status === "overdue"
                              ? language === "ar" ? "متأخر" : "Overdue"
                              : language === "ar" ? "غير مبدئ" : "Not Started"}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--secondary-label)]">
                          {item.hoursRegistration.dueAt
                            ? `${language === "ar" ? "مستحق" : "Due"}: ${new Date(item.hoursRegistration.dueAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}`
                            : ""}
                        </p>
                        <p className="text-sm text-[var(--label)] mt-1">
                          {event.cme_hours || 0} {language === "ar" ? "ساعة" : "hours"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(buildRoute.organizerEvent(item.activityId, 'execution'))}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </GlassButton>
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </LiquidGlassCard>
    </div>
  );
}

