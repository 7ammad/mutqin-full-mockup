"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Search, Filter, Users, Clock, FileText, Calendar, Eye, CheckSquare, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { buildRoute } from "@/lib/routes";
import type { DemoEvent } from "@/context/demoSeed";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface Props {
  queueEvents: DemoEvent[];
}

export default function RegulatorQueueTab({ queueEvents }: Props) {
  const { language } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const pendingEvents = useMemo(() => {
    return queueEvents.filter(e => e.status === "pending_review");
  }, [queueEvents]);

  const filteredEvents = useMemo(() => {
    let list = pendingEvents;

    if (searchTerm) {
      list = list.filter(e => {
        const title = (language === 'ar' ? e.titleAr : e.titleEn) ?? e.title ?? '';
        const organizer = (language === 'ar' ? e.organizerAr : e.organizerEn) ?? '';
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               organizer.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (selectedSpecialty !== "all") {
      list = list.filter(e => e.specialty === selectedSpecialty);
    }

    if (selectedCity !== "all") {
      list = list.filter(e => e.city === selectedCity);
    }

    if (selectedType !== "all") {
      list = list.filter(e => e.activityType === selectedType);
    }

    return list;
  }, [pendingEvents, searchTerm, selectedSpecialty, selectedCity, selectedType, language]);

  const kpiData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueSoonThreshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    const newToday = pendingEvents.filter(e => {
      if (!e.submittedAt) return false;
      const submitted = new Date(e.submittedAt);
      return submitted >= todayStart;
    }).length;

    const dueSoon = pendingEvents.filter(e => {
      if (!e.submittedAt) return false;
      const submitted = new Date(e.submittedAt);
      const daysSinceSubmission = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
      // Consider due soon if submitted more than 4 days ago (approaching 7-day SLA)
      return daysSinceSubmission >= 4 && daysSinceSubmission < 7;
    }).length;

    return {
      pending: pendingEvents.length,
      newToday,
      dueSoon
    };
  }, [pendingEvents]);

  const uniqueSpecialties = useMemo(() => {
    const specs = new Set(queueEvents.filter(e => e.specialty).map(e => e.specialty!));
    return Array.from(specs).sort();
  }, [queueEvents]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(queueEvents.filter(e => e.city).map(e => e.city!));
    return Array.from(cities).sort();
  }, [queueEvents]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(queueEvents.filter(e => e.activityType).map(e => e.activityType!));
    return Array.from(types).sort();
  }, [queueEvents]);

  const handleOpenReview = (eventId: string) => {
    router.push(`/dashboard/regulator?tab=review&itemId=${eventId}`);
  };

  const title = language === 'ar' ? 'المعروض للمراجعة' : 'Queue';
  const searchPlaceholder = language === 'ar' ? 'ابحث...' : 'Search...';
  const filtersText = language === 'ar' ? 'عوامل التصفية' : 'Filters';

  return (
    <div className="space-y-6">
      {/* KPI Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
              </p>
              <p className="text-2xl font-bold text-[var(--label)] mt-1">
                {kpiData.pending}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center">
              <Inbox className="h-5 w-5 text-[var(--apple-blue)]" />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                {language === 'ar' ? 'جديد اليوم' : 'New Today'}
              </p>
              <p className="text-2xl font-bold text-[var(--label)] mt-1">
                {kpiData.newToday}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                {language === 'ar' ? 'قريب الاستحقاق' : 'Due Soon'}
              </p>
              <p className="text-2xl font-bold text-[var(--apple-orange)] mt-1">
                {kpiData.dueSoon}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--apple-orange)]/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[var(--apple-orange)]" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Search and Filters */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
          <Inbox className="h-6 w-6 text-[var(--apple-blue)]" />
          {title}
        </h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <GlassButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {filtersText}
            </GlassButton>
          </div>

          {showFilters && (
            <div className="p-4 border border-[var(--separator)] rounded-ios space-y-4 bg-[var(--system-fill)]/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {uniqueSpecialties.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                      {language === 'ar' ? 'التخصص' : 'Specialty'}
                    </label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent glass={true}>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                        {uniqueSpecialties.map(spec => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {uniqueCities.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                      {language === 'ar' ? 'المدينة' : 'City'}
                    </label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent glass={true}>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                        {uniqueCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {uniqueTypes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent glass={true}>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                        {uniqueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </LiquidGlassCard>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--label)]">
          {language === 'ar' ? 'النتائج' : 'Results'} ({filteredEvents.length})
        </h3>

        {filteredEvents.length === 0 ? (
          <EmptyState
            title={language === 'ar' ? 'لا توجد طلبات بانتظار المراجعة' : 'No pending applications'}
            description={language === 'ar' ? 'لا توجد طلبات حالياً في المعروض للمراجعة. تظهر العناصر هنا عند إرسال مقدمي الخدمات طلبات الاعتماد.' : 'No applications pending review. New items appear when Providers submit accreditation.'}
            icon={Inbox}
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
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {filteredEvents.map((event) => {
              const title = (language === 'ar' ? event.titleAr : event.titleEn) ?? event.title ?? 'Event';
              const organizer = (language === 'ar' ? event.organizerAr : event.organizerEn) ?? 'Organizer';

              return (
                <LiquidGlassCard
                  key={event.id}
                  blurIntensity="md"
                  interactive={true}
                  className="p-4 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-base font-semibold text-[var(--label)] line-clamp-1">
                          {title}
                        </h4>
                        <Badge variant="outline" className="ml-2 capitalize flex-shrink-0">
                          {language === 'ar' ? 'قيد المراجعة' : 'Pending review'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--secondary-label)]">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{organizer}</span>
                        </div>
                        {event.city && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{event.city}</span>
                          </div>
                        )}
                        {event.specialty && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{getSpecialtyLabel(event.specialty || '', language)}</span>
                          </div>
                        )}
                        {event.activityType && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{event.activityType}</span>
                          </div>
                        )}
                        {event.submittedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {language === 'ar' ? 'تاريخ الإرسال:' : 'Submitted:'} {new Date(event.submittedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <GlassButton
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/dashboard/regulator?tab=review&itemId=${event.id}`)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {language === 'ar' ? 'مراجعة الطلب' : 'Review Application'}
                      </GlassButton>
                      <div className="flex gap-2">
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(buildRoute.regulatorApplicationDecision(event.id))}
                          className="gap-2"
                        >
                          <CheckSquare className="h-4 w-4" />
                          {language === 'ar' ? 'قرار' : 'Decision'}
                        </GlassButton>
                        <GlassButton
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(buildRoute.regulatorApplicationChecklist(event.id))}
                          className="gap-2"
                        >
                          <ListChecks className="h-4 w-4" />
                          {language === 'ar' ? 'قائمة' : 'Checklist'}
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
