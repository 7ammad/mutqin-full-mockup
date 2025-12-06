"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { BarChart3, Download, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { buildRoute } from "@/lib/routes";
import type { DemoEvent } from "@/context/demoSeed";

interface Props {
  allEvents: DemoEvent[];
}

export default function RegulatorAnalyticsTab({ allEvents }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const analytics = useMemo(() => {
    const totalSubmissions = allEvents.length;
    const approved = allEvents.filter(e => e.status === 'approved').length;
    const rejected = allEvents.filter(e => e.status === 'draft' && e.rejectionReason).length;
    const pending = allEvents.filter(e => e.status === 'pending_review').length;
    const approvalRate = totalSubmissions > 0 ? Math.round((approved / totalSubmissions) * 100) : 0;

    // Calculate overdue counts for attendance records and hours registration
    const now = new Date();
    const endedEvents = allEvents.filter(e => e.status === 'published' || e.status === 'closed');
    
    let overdueAttendanceRecords = 0;
    let overdueHoursRegistration = 0;

    endedEvents.forEach(event => {
      if (!event.date) return;
      const eventDate = new Date(event.date);
      
      // Attendance records due 21 days after event end
      const attendanceDueDate = new Date(eventDate);
      attendanceDueDate.setDate(attendanceDueDate.getDate() + 21);
      if (now > attendanceDueDate) {
        overdueAttendanceRecords++;
      }
      
      // Hours registration due 30 days after event end
      const hoursDueDate = new Date(eventDate);
      hoursDueDate.setDate(hoursDueDate.getDate() + 30);
      if (now > hoursDueDate) {
        overdueHoursRegistration++;
      }
    });

    const eventsWithTime = allEvents.filter(e => e.submittedAt && e.decisionAt);
    const decisionTimes = eventsWithTime.map(e => {
      const submitted = new Date(e.submittedAt!).getTime();
      const decided = new Date(e.decisionAt!).getTime();
      return (decided - submitted) / (1000 * 60 * 60 * 24);
    });
    const medianDecisionTime = decisionTimes.length > 0
      ? decisionTimes.sort((a, b) => a - b)[Math.floor(decisionTimes.length / 2)]
      : null;

    const bySpecialty = allEvents.reduce((acc, e) => {
      if (e.specialty) {
        acc[e.specialty] = (acc[e.specialty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const byCity = allEvents.reduce((acc, e) => {
      if (e.city) {
        acc[e.city] = (acc[e.city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const byType = allEvents.reduce((acc, e) => {
      if (e.activityType) {
        acc[e.activityType] = (acc[e.activityType] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topSpecialties = Object.entries(bySpecialty)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topCities = Object.entries(byCity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topTypes = Object.entries(byType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const specialtyDecisionTimes = eventsWithTime.reduce((acc, e) => {
      if (e.specialty && e.submittedAt && e.decisionAt) {
        const time = (new Date(e.decisionAt).getTime() - new Date(e.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (!acc[e.specialty]) {
          acc[e.specialty] = [];
        }
        acc[e.specialty].push(time);
      }
      return acc;
    }, {} as Record<string, number[]>);

    const slowestSpecialties = Object.entries(specialtyDecisionTimes)
      .map(([spec, times]) => ({
        specialty: spec,
        median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
      }))
      .sort((a, b) => b.median - a.median)
      .slice(0, 5);

    const providerDecisionTimes = eventsWithTime.reduce((acc, e) => {
      const provider = e.organizerEn || 'Unknown';
      if (e.submittedAt && e.decisionAt) {
        const time = (new Date(e.decisionAt).getTime() - new Date(e.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (!acc[provider]) {
          acc[provider] = [];
        }
        acc[provider].push(time);
      }
      return acc;
    }, {} as Record<string, number[]>);

    const slowestProviders = Object.entries(providerDecisionTimes)
      .map(([prov, times]) => ({
        provider: prov,
        median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
      }))
      .sort((a, b) => b.median - a.median)
      .slice(0, 5);

    const providerRejections = allEvents
      .filter(e => e.status === 'draft' && e.rejectionReason)
      .reduce((acc, e) => {
        const provider = e.organizerEn || 'Unknown';
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const providerTotals = allEvents.reduce((acc, e) => {
      const provider = e.organizerEn || 'Unknown';
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rejectionRates = Object.entries(providerRejections).map(([provider, rejCount]) => ({
      provider,
      rejectionRate: Math.round((rejCount / providerTotals[provider]) * 100)
    })).sort((a, b) => b.rejectionRate - a.rejectionRate).slice(0, 5);

    const topRejectionReasons = allEvents
      .filter(e => e.status === 'draft' && e.rejectionCategory)
      .reduce((acc, e) => {
        acc[e.rejectionCategory!] = (acc[e.rejectionCategory!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topReasons = Object.entries(topRejectionReasons)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const missingFields: string[] = [];
    if (!byCity || Object.keys(byCity).length === 0) missingFields.push('city');
    if (!bySpecialty || Object.keys(bySpecialty).length === 0) missingFields.push('specialty');
    if (!byType || Object.keys(byType).length === 0) missingFields.push('activityType');
    if (decisionTimes.length === 0) missingFields.push('submittedAt/decisionAt');
    if (topReasons.length === 0) missingFields.push('rejectionCategory');

    return {
      totalSubmissions,
      approvalRate,
      pending,
      medianDecisionTime,
      overdueAttendanceRecords,
      overdueHoursRegistration,
      topSpecialties,
      topCities,
      topTypes,
      slowestSpecialties,
      slowestProviders,
      rejectionRates,
      topReasons,
      missingFields,
      hasTimeData: decisionTimes.length > 0,
      hasDistributionData: topSpecialties.length > 0 || topCities.length > 0 || topTypes.length > 0,
      hasQualityData: rejectionRates.length > 0 || topReasons.length > 0
    };
  }, [allEvents]);

  const handleExportCSV = () => {
    try {
      const headers = [
        'ID',
        'Title',
        'Organizer',
        'City',
        'Specialty',
        'Activity Type',
        'Status',
        'Submitted At',
        'Decision At',
        'Rejection Category',
        'Rejection Reason'
      ];

      const rows = allEvents.map(e => [
        e.id,
        e.titleEn || e.title,
        e.organizerEn || '',
        e.city || '',
        e.specialty || '',
        e.activityType || '',
        e.status,
        e.submittedAt || '',
        e.decisionAt || '',
        e.rejectionCategory || '',
        e.rejectionReason || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `regulator-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showToast(language === 'ar' ? '  CSV ' : 'CSV exported successfully', 'success');
    } catch (error) {
      showToast(language === 'ar' ? ' ' : 'Export failed', 'info');
    }
  };

  const title = language === 'ar' ? ' ' : 'Analytics & Insights';

  return (
    <div className="space-y-6">
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[var(--apple-blue)]" />
            {title}
          </h2>
          <GlassButton
            variant="default"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 flex items-center justify-center"
          >
            <Download className="h-4 w-4" />
            {language === 'ar' ? ' CSV' : 'Export CSV'}
          </GlassButton>
        </div>

        {analytics.missingFields.length > 0 && (
          <div className="mb-6 p-4 bg-[var(--apple-yellow)]/10 border border-[var(--apple-yellow)]/30 rounded-ios">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[var(--apple-yellow)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[var(--label)]">
                  {language === 'ar' ? '    ' : 'Missing data in demo seed'}
                </p>
                <p className="text-xs text-[var(--secondary-label)] mt-1">
                  {language === 'ar' ? ' :' : 'Missing fields:'} {analytics.missingFields.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? ' ' : 'Total Submissions'}
                </p>
                <p className="text-2xl font-bold text-[var(--label)] mt-1">
                  {analytics.totalSubmissions}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-[var(--apple-blue)]" />
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? ' ' : 'Approval Rate'}
                </p>
                <p className="text-2xl font-bold text-[var(--apple-green)] mt-1">
                  {analytics.approvalRate}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-[var(--apple-green)]" />
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? '  ' : 'Pending Now'}
                </p>
                <p className="text-2xl font-bold text-[var(--apple-orange)] mt-1">
                  {analytics.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-[var(--apple-orange)]" />
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? '  ' : 'Median Decision Time'}
                </p>
                <p className="text-2xl font-bold text-[var(--label)] mt-1">
                  {analytics.medianDecisionTime !== null
                    ? `${analytics.medianDecisionTime.toFixed(1)}d`
                    : '—'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-[var(--secondary-label)]" />
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? '  ' : 'Overdue Attendance'}
                </p>
                <p className="text-2xl font-bold text-[var(--apple-red)] mt-1">
                  {analytics.overdueAttendanceRecords}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-[var(--apple-red)]" />
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard blurIntensity="sm" interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                  {language === 'ar' ? '  ' : 'Overdue Hours'}
                </p>
                <p className="text-2xl font-bold text-[var(--apple-red)] mt-1">
                  {analytics.overdueHoursRegistration}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-[var(--apple-red)]" />
            </div>
          </LiquidGlassCard>
        </div>

        {/* Distribution */}
        {analytics.hasDistributionData && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? '' : 'Distribution'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.topSpecialties.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? ' ' : 'By Specialty'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.topSpecialties.map(([spec, count]) => (
                      <div key={spec} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios">
                        <span className="text-sm text-[var(--label)] truncate">{spec}</span>
                        <span className="text-sm font-bold text-[var(--apple-blue)] ml-2">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.topCities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? ' ' : 'By City'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.topCities.map(([city, count]) => (
                      <div key={city} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios">
                        <span className="text-sm text-[var(--label)] truncate">{city}</span>
                        <span className="text-sm font-bold text-[var(--apple-blue)] ml-2">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.topTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? ' ' : 'By Type'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.topTypes.map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios">
                        <span className="text-sm text-[var(--label)] truncate">{type}</span>
                        <span className="text-sm font-bold text-[var(--apple-blue)] ml-2">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottlenecks */}
        {analytics.hasTimeData && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? '' : 'Bottlenecks'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analytics.slowestSpecialties.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? ' ' : 'Slowest Specialties'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.slowestSpecialties.map(({ specialty, median }) => (
                      <div key={specialty} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios">
                        <span className="text-sm text-[var(--label)] truncate">{specialty}</span>
                        <span className="text-sm font-bold text-[var(--apple-orange)] ml-2">{median.toFixed(1)}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.slowestProviders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? '  ' : 'Slowest Providers'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.slowestProviders.map(({ provider, median }) => {
                      const providerId = `provider-${provider.toLowerCase().replace(/\s+/g, '-')}`;
                      return (
                        <div key={provider} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios gap-2">
                          <span className="text-sm text-[var(--label)] truncate flex-1">{provider}</span>
                          <span className="text-sm font-bold text-[var(--apple-orange)] ml-2">{median.toFixed(1)}d</span>
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(buildRoute.regulatorProvider(providerId))}
                            className="gap-1"
                          >
                            <Building2 className="h-3 w-3" />
                            {language === 'ar' ? '' : 'View'}
                          </GlassButton>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quality */}
        {analytics.hasQualityData && (
          <div>
            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? '' : 'Quality'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analytics.rejectionRates.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? '   ' : 'Rejection Rate by Provider'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.rejectionRates.map(({ provider, rejectionRate }) => {
                      const providerId = `provider-${provider.toLowerCase().replace(/\s+/g, '-')}`;
                      return (
                        <div key={provider} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios gap-2">
                          <span className="text-sm text-[var(--label)] truncate flex-1">{provider}</span>
                          <span className="text-sm font-bold text-[var(--apple-red)] ml-2">{rejectionRate}%</span>
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(buildRoute.regulatorProvider(providerId))}
                            className="gap-1"
                          >
                            <Building2 className="h-3 w-3" />
                            {language === 'ar' ? '' : 'View'}
                          </GlassButton>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {analytics.topReasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--secondary-label)] mb-3">
                    {language === 'ar' ? '   ' : 'Top Rejection Reasons'}
                  </h4>
                  <div className="space-y-2">
                    {analytics.topReasons.map(([reason, count]) => (
                      <div key={reason} className="flex items-center justify-between p-2 bg-[var(--system-fill)]/50 rounded-ios">
                        <span className="text-sm text-[var(--label)] truncate">{reason}</span>
                        <span className="text-sm font-bold text-[var(--apple-red)] ml-2">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </LiquidGlassCard>
    </div>
  );
}
