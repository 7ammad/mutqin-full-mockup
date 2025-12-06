"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { History, CheckCircle2, XCircle, Users, Calendar, AlertCircle, Download, Filter, Eye, CheckSquare, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/components/ui/toast-context";
import { buildRoute } from "@/lib/routes";
import type { DemoEvent } from "@/context/demoSeed";

interface Props {
  allEvents: DemoEvent[];
}

export default function RegulatorDecisionsTab({ allEvents }: Props) {
  const { language } = useLanguage();
  const router = useRouter();
  const { showToast } = useToast();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const decidedEvents = useMemo(() => {
    let filtered = allEvents
      .filter(e => (e.status === 'approved' || e.status === 'draft') && e.decisionAt);

    // Apply date range filter
    if (dateFrom || dateTo) {
      filtered = filtered.filter(e => {
        if (!e.decisionAt) return false;
        const decisionDate = new Date(e.decisionAt);
        if (dateFrom && decisionDate < new Date(dateFrom)) return false;
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999); // Include entire end date
          if (decisionDate > toDate) return false;
        }
        return true;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = a.decisionAt ? new Date(a.decisionAt).getTime() : 0;
      const dateB = b.decisionAt ? new Date(b.decisionAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allEvents, dateFrom, dateTo]);

  const title = language === 'ar' ? ' ' : 'Decision History';

  const handleOpenDetail = (eventId: string) => {
    router.push(`/dashboard/regulator?tab=review&itemId=${eventId}`);
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        'ID',
        'Title',
        'Organizer',
        'Decision',
        'Decision Date',
        'Rejection Category',
        'Rejection Reason'
      ];

      const rows = decidedEvents.map(e => [
        e.id,
        (language === 'ar' ? e.titleAr : e.titleEn) ?? e.title ?? '',
        (language === 'ar' ? e.organizerAr : e.organizerEn) ?? '',
        e.status === 'approved' ? (language === 'ar' ? ' ' : 'Approved') : (language === 'ar' ? '' : 'Rejected'),
        e.decisionAt ? new Date(e.decisionAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') : '',
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
      a.download = `regulator-decisions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showToast(language === 'ar' ? '  CSV ' : 'CSV exported successfully', 'success');
    } catch (error) {
      showToast(language === 'ar' ? ' ' : 'Export failed', 'info');
    }
  };

  if (decidedEvents.length === 0) {
    return (
      <div className="space-y-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
          <EmptyState
            title={language === 'ar' ? '   ' : 'No decisions yet'}
            description={language === 'ar' ? '       ' : 'Review items from Queue to generate history'}
            icon={History}
            actionLabel={language === 'ar' ? '   ' : 'Reset demo data'}
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
            <History className="h-6 w-6 text-[var(--apple-blue)]" />
            {title}
          </h2>
          <div className="flex gap-2">
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {language === 'ar' ? '' : 'Filters'}
            </GlassButton>
            <GlassButton
              variant="default"
              size="sm"
              onClick={handleExportCSV}
              className="gap-2 flex items-center justify-center"
            >
              <Download className="h-4 w-4" />
              {language === 'ar' ? '' : 'Export'}
            </GlassButton>
          </div>
        </div>

        {/* Date Range Filters */}
        {showFilters && (
          <div className="mb-6 p-4 border border-[var(--separator)] rounded-ios space-y-4 bg-[var(--system-fill)]/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                  {language === 'ar' ? ' ' : 'From Date'}
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                  {language === 'ar' ? ' ' : 'To Date'}
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                {language === 'ar' ? ' ' : 'Clear Filters'}
              </GlassButton>
            )}
          </div>
        )}

        <div className="space-y-4">
          {decidedEvents.map((event) => {
            const eventTitle = (language === 'ar' ? event.titleAr : event.titleEn) ?? event.title ?? 'Event';
            const organizer = (language === 'ar' ? event.organizerAr : event.organizerEn) ?? 'Organizer';
            const isApproved = event.status === 'approved';
            const isRejected = event.status === 'draft';

            return (
              <LiquidGlassCard
                key={event.id}
                blurIntensity="md"
                interactive={true}
                className="p-4 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      {isApproved ? (
                        <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)] mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[var(--apple-red)] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-base font-semibold text-[var(--label)] line-clamp-1">
                            {eventTitle}
                          </h4>
                          <Badge
                            variant={isApproved ? "default" : "destructive"}
                            className="ml-2 flex-shrink-0"
                          >
                            {isApproved
                              ? (language === 'ar' ? ' ' : 'Approved')
                              : (language === 'ar' ? '' : 'Rejected')
                            }
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--secondary-label)]">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{organizer}</span>
                          </div>
                          {event.decisionAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {language === 'ar' ? ':' : 'Decision:'} {new Date(event.decisionAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                        </div>

                        {isRejected && event.rejectionCategory && (
                          <div className="mt-2 flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-[var(--apple-red)] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-[var(--label)]">
                                {language === 'ar' ? ' :' : 'Rejection Category:'}
                              </span>
                              <span className="text-[var(--secondary-label)] ml-1">{event.rejectionCategory}</span>
                            </div>
                          </div>
                        )}

                        {isRejected && event.rejectionReason && (
                          <div className="mt-1 text-sm text-[var(--secondary-label)]">
                            <span className="font-medium">{language === 'ar' ? ':' : 'Reason:'}</span> {event.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <GlassButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(event.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {language === 'ar' ? ' ' : 'View Detail'}
                    </GlassButton>
                  </div>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      </LiquidGlassCard>
    </div>
  );
}
