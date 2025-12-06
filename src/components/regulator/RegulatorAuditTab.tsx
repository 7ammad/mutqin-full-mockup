"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Calendar, AlertCircle, CheckCircle2, Clock, XCircle, Eye, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { buildRoute } from "@/lib/routes";
import type { DemoEvent } from "@/context/demoSeed";

interface Props {
  allEvents: DemoEvent[];
}

type AttendanceRecordsStatus = "not_started" | "in_progress" | "submitted" | "accepted" | "returned_for_fix" | "overdue";
type HoursRegistrationStatus = "not_started" | "in_progress" | "submitted" | "accepted" | "returned_for_fix" | "overdue";

interface ComplianceItem {
  activityId: string;
  title: string;
  providerName: string;
  endedAt: string;
  attendanceRecords: { status: AttendanceRecordsStatus; dueAt?: string };
  hoursRegistration: { status: HoursRegistrationStatus; dueAt?: string };
  exceptionRate?: number;
}

export default function RegulatorAuditTab({ allEvents }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const complianceData = useMemo(() => {
    // Filter for recently ended activities (published or closed)
    const endedEvents = allEvents.filter(e => 
      e.status === 'published' || e.status === 'closed'
    );

    // Mock compliance data based on event status and dates
    const compliance: ComplianceItem[] = endedEvents.map(event => {
      const eventDate = event.date ? new Date(event.date) : new Date();
      const endedAt = eventDate.toISOString();
      
      // Calculate due dates (21 days for attendance, 30 days for hours)
      const attendanceDueDate = new Date(eventDate);
      attendanceDueDate.setDate(attendanceDueDate.getDate() + 21);
      
      const hoursDueDate = new Date(eventDate);
      hoursDueDate.setDate(hoursDueDate.getDate() + 30);
      
      const now = new Date();
      const isAttendanceOverdue = now > attendanceDueDate;
      const isHoursOverdue = now > hoursDueDate;
      
      // Mock statuses based on event age and status
      const daysSinceEnd = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
      
      let attendanceStatus: AttendanceRecordsStatus = "not_started";
      if (isAttendanceOverdue && daysSinceEnd > 25) {
        attendanceStatus = "overdue";
      } else if (daysSinceEnd > 21) {
        attendanceStatus = "submitted";
      } else if (daysSinceEnd > 10) {
        attendanceStatus = "in_progress";
      }
      
      let hoursStatus: HoursRegistrationStatus = "not_started";
      if (isHoursOverdue && daysSinceEnd > 35) {
        hoursStatus = "overdue";
      } else if (daysSinceEnd > 30) {
        hoursStatus = "submitted";
      } else if (daysSinceEnd > 15) {
        hoursStatus = "in_progress";
      }
      
      // Deterministic exception rate based on event ID hash (0-10%)
      const eventIdHash = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const exceptionRate = eventIdHash % 11;
      
      return {
        activityId: event.id,
        title: (language === 'ar' ? event.titleAr : event.titleEn) ?? event.title ?? 'Event',
        providerName: (language === 'ar' ? event.organizerAr : event.organizerEn) ?? 'Organizer',
        endedAt,
        attendanceRecords: {
          status: attendanceStatus,
          dueAt: attendanceDueDate.toISOString()
        },
        hoursRegistration: {
          status: hoursStatus,
          dueAt: hoursDueDate.toISOString()
        },
        exceptionRate: exceptionRate > 0 ? exceptionRate : undefined
      };
    });

    return compliance.sort((a, b) => 
      new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
    );
  }, [allEvents, language]);

  const getStatusBadge = (status: AttendanceRecordsStatus | HoursRegistrationStatus) => {
    const statusLabels: Record<string, { ar: string; en: string; variant: "default" | "destructive" | "outline" }> = {
      not_started: { ar: 'لم يبدأ', en: 'Not Started', variant: 'outline' },
      in_progress: { ar: 'قيد التنفيذ', en: 'In Progress', variant: 'default' },
      submitted: { ar: 'مقدّم', en: 'Submitted', variant: 'default' },
      accepted: { ar: 'مقبول', en: 'Accepted', variant: 'default' },
      returned_for_fix: { ar: 'مطلوب تصحيح', en: 'Returned for Fix', variant: 'outline' },
      overdue: { ar: 'متأخر', en: 'Overdue', variant: 'destructive' }
    };

    const label = statusLabels[status] || statusLabels.not_started;
    return (
      <Badge variant={label.variant} className="text-xs">
        {language === 'ar' ? label.ar : label.en}
      </Badge>
    );
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        'Activity ID',
        'Title',
        'Provider',
        'Ended At',
        'Attendance Records Status',
        'Attendance Due Date',
        'Hours Registration Status',
        'Hours Due Date',
        'Exception Rate %'
      ];

      const rows = complianceData.map(item => [
        item.activityId,
        item.title,
        item.providerName,
        new Date(item.endedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
        item.attendanceRecords.status,
        item.attendanceRecords.dueAt ? new Date(item.attendanceRecords.dueAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '',
        item.hoursRegistration.status,
        item.hoursRegistration.dueAt ? new Date(item.hoursRegistration.dueAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '',
        item.exceptionRate?.toString() || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `regulator-monitoring-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showToast(language === 'ar' ? 'تم تصدير CSV بنجاح' : 'CSV exported successfully', 'success');
    } catch (error) {
      showToast(language === 'ar' ? 'فشل التصدير' : 'Export failed', 'info');
    }
  };

  const title = language === 'ar' ? 'المتابعة والالتزام' : 'Monitoring';

  if (complianceData.length === 0) {
    return (
      <div className="space-y-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
          <EmptyState
            title={language === 'ar' ? 'لا توجد بيانات متاحة' : 'No compliance data available'}
            description={language === 'ar' ? 'لا توجد فعاليات منتهية للمتابعة' : 'No ended activities to monitor'}
            icon={Shield}
            actionLabel={language === 'ar' ? 'إعادة تعيين البيانات التجريبية' : 'Reset demo data'}
            onAction={async () => {
              try {
                await fetch('/api/demo/reset', { method: 'POST' });
                window.location.reload();
              } catch (error) {
                console.error('Failed to reset demo data:', error);
              }
            }}
          />
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--apple-blue)]" />
            {title}
          </h2>
          <GlassButton
            variant="default"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 flex items-center justify-center"
          >
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </GlassButton>
        </div>

        {/* Compliance Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--separator)]">
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'الفعالية' : 'Activity'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'المنظم' : 'Provider'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'تاريخ الانتهاء' : 'Ended At'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'سجلات الحضور' : 'Attendance Records'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'استحقاق الحضور' : 'Attendance Due'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'تسجيل الساعات' : 'Hours Registration'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'استحقاق الساعات' : 'Hours Due'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'معدل الاستثناءات' : 'Exception Rate'}
                </th>
                <th className="text-left p-3 text-sm font-semibold text-[var(--label)]">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map((item) => {
                // Extract provider ID from provider name (mock - would come from actual data)
                const providerId = `provider-${item.providerName.toLowerCase().replace(/\s+/g, '-')}`;
                const attendanceDue = item.attendanceRecords.dueAt 
                  ? new Date(item.attendanceRecords.dueAt)
                  : null;
                const hoursDue = item.hoursRegistration.dueAt
                  ? new Date(item.hoursRegistration.dueAt)
                  : null;
                const isAttendanceOverdue = attendanceDue && new Date() > attendanceDue;
                const isHoursOverdue = hoursDue && new Date() > hoursDue;

                return (
                  <tr key={item.activityId} className="border-b border-[var(--separator)] hover:bg-[var(--system-fill)]/30 transition-colors">
                    <td className="p-3 text-sm text-[var(--label)]">
                      <div className="font-medium">{item.title}</div>
                    </td>
                    <td className="p-3 text-sm text-[var(--secondary-label)]">
                      {item.providerName}
                    </td>
                    <td className="p-3 text-sm text-[var(--secondary-label)]">
                      {new Date(item.endedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(item.attendanceRecords.status)}
                    </td>
                    <td className="p-3 text-sm text-[var(--secondary-label)]">
                      {attendanceDue ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className={isAttendanceOverdue ? 'text-[var(--apple-red)] font-medium' : ''}>
                            {attendanceDue.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                          {isAttendanceOverdue && (
                            <AlertCircle className="h-3 w-3 text-[var(--apple-red)]" />
                          )}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(item.hoursRegistration.status)}
                    </td>
                    <td className="p-3 text-sm text-[var(--secondary-label)]">
                      {hoursDue ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className={isHoursOverdue ? 'text-[var(--apple-red)] font-medium' : ''}>
                            {hoursDue.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                          {isHoursOverdue && (
                            <AlertCircle className="h-3 w-3 text-[var(--apple-red)]" />
                          )}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="p-3 text-sm text-[var(--secondary-label)]">
                      {item.exceptionRate !== undefined ? (
                        <div className="flex items-center gap-1">
                          {item.exceptionRate > 5 ? (
                            <AlertCircle className="h-3 w-3 text-[var(--apple-orange)]" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-[var(--apple-green)]" />
                          )}
                          <span>{item.exceptionRate}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/regulator?tab=review&itemId=${item.activityId}`)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {language === 'ar' ? 'عرض الطلب' : 'View Application'}
                        </GlassButton>
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(buildRoute.regulatorProvider(providerId))}
                          className="gap-2"
                        >
                          <Building2 className="h-4 w-4" />
                          {language === 'ar' ? 'عرض المزود' : 'View Provider'}
                        </GlassButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
