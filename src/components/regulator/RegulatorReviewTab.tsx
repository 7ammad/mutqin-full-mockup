"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Users, Calendar, MapPin, Award, ArrowLeft, AlertTriangle, History, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { AccreditationPanel } from "./AccreditationPanel";
import { api } from "@/lib/api";
import type { DemoEvent } from "@/context/demoSeed";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface Props {
  itemId?: string;
  queueEvents: DemoEvent[];
  onDecision: () => void;
}

export default function RegulatorReviewTab({ itemId, queueEvents, onDecision }: Props) {
  const { language } = useLanguage();
  const router = useRouter();
  const [fetchedEvent, setFetchedEvent] = useState<DemoEvent | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedEventFromQueue = queueEvents.find(e => e.id === itemId);
  const selectedEvent = selectedEventFromQueue || fetchedEvent;

  // If event not in queue, fetch it via API
  useEffect(() => {
    if (itemId && !selectedEventFromQueue && !fetchedEvent && !loading) {
      setLoading(true);
      api.getEventById({ eventId: itemId })
        .then(res => {
          setFetchedEvent(res.event);
        })
        .catch(err => {
          console.error('Failed to fetch event:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [itemId, selectedEventFromQueue, fetchedEvent, loading]);

  const handleBackToQueue = () => {
    router.push('/dashboard/regulator?tab=queue');
  };

  // All hooks must be called before any conditional returns
  const title = selectedEvent ? ((language === 'ar' ? selectedEvent.titleAr : selectedEvent.titleEn) ?? selectedEvent.title ?? 'Event') : '';
  const organizer = selectedEvent ? ((language === 'ar' ? selectedEvent.organizerAr : selectedEvent.organizerEn) ?? 'Organizer') : '';
  const description = selectedEvent ? ((language === 'ar' ? selectedEvent.descriptionAr : selectedEvent.descriptionEn) ?? '') : '';
  const location = selectedEvent ? ((language === 'ar' ? selectedEvent.locationAr : selectedEvent.locationEn) ?? '') : '';

  // Mock risk flags based on event data
  const riskFlags = useMemo(() => {
    if (!selectedEvent) return [];
    const flags: string[] = [];
    if (!selectedEvent.sfda_license) {
      flags.push(language === 'ar' ? 'رخصة الهيئة مفقودة' : 'Missing SFDA License');
    }
    if (!selectedEvent.descriptionAr && !selectedEvent.descriptionEn) {
      flags.push(language === 'ar' ? 'وصف مفقود' : 'Missing Description');
    }
    if (selectedEvent.submittedAt) {
      const daysSinceSubmission = (Date.now() - new Date(selectedEvent.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceSubmission > 5) {
        flags.push(language === 'ar' ? 'قريب الاستحقاق' : 'Due Soon');
      }
    }
    // Mock: high-volume provider check
    const providerEvents = queueEvents.filter(e => 
      (language === 'ar' ? e.organizerAr : e.organizerEn) === organizer
    );
    if (providerEvents.length > 3) {
      flags.push(language === 'ar' ? 'مزود عالي الحجم' : 'High-Volume Provider');
    }
    return flags;
  }, [selectedEvent, queueEvents, organizer, language]);

  // Mock audit trail snippet
  const auditTrailSnippet = useMemo(() => {
    if (!selectedEvent) return [];
    const trail = [];
    if (selectedEvent.submittedAt) {
      trail.push({
        action: language === 'ar' ? 'تم التقديم' : 'Submitted',
        timestamp: selectedEvent.submittedAt,
        actor: organizer
      });
    }
    if (selectedEvent.decisionAt) {
      trail.push({
        action: language === 'ar' ? 'قرار سابق' : 'Previous Decision',
        timestamp: selectedEvent.decisionAt,
        actor: language === 'ar' ? 'مراجع' : 'Reviewer'
      });
    }
    // Add a mock recent review entry
    trail.push({
      action: language === 'ar' ? 'تم فتح المراجعة' : 'Review Opened',
      timestamp: new Date().toISOString(),
      actor: language === 'ar' ? 'نظام' : 'System'
    });
    return trail.slice(-3); // Last 3 entries
  }, [selectedEvent, organizer, language]);

  if (!itemId) {
    return (
      <div className="space-y-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
          <EmptyState
            title={language === 'ar' ? 'اختر من المعروض للمراجعة' : 'Select from Queue'}
            description={language === 'ar' ? 'اختر طلباً من المعروض لبدء المراجعة' : 'Select an application from the Queue to begin review'}
            icon={Eye}
          />
          <div className="flex justify-center mt-6">
            <GlassButton
              variant="default"
              onClick={handleBackToQueue}
             className="flex items-center justify-center gap-2">
              {language === 'ar' ? 'الذهاب إلى المعروض' : 'Go to Queue'}
            </GlassButton>
          </div>
        </LiquidGlassCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
          <div className="text-center text-[var(--secondary-label)]">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        </LiquidGlassCard>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="space-y-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-12">
          <EmptyState
            title={language === 'ar' ? 'الحدث غير موجود' : 'Event not found'}
            description={language === 'ar' ? 'تعذر العثور على الحدث المطلوب' : 'The requested event could not be found'}
            icon={Eye}
          />
          <div className="flex justify-center mt-6">
            <GlassButton
              variant="default"
              onClick={handleBackToQueue}
             className="flex items-center justify-center gap-2">
              {language === 'ar' ? 'العودة إلى المعروض' : 'Back to Queue'}
            </GlassButton>
          </div>
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <GlassButton
        variant="outline"
        size="sm"
        onClick={handleBackToQueue}
        className="gap-2 flex items-center justify-center"
      >
        <ArrowLeft className="h-4 w-4" />
        {language === 'ar' ? 'العودة إلى المعروض' : 'Back to Queue'}
      </GlassButton>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Application Summary */}
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--label)] mb-2 flex items-center gap-2">
              <Eye className="h-6 w-6 text-[var(--apple-blue)]" />
              {language === 'ar' ? 'ملخص الطلب' : 'Application Summary'}
            </h2>
            <Badge variant="outline" className="capitalize">
              {selectedEvent.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--label)]">{title}</h3>
              <p className="text-sm text-[var(--secondary-label)] mt-1">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                    {language === 'ar' ? 'المنظم' : 'Provider'}
                  </p>
                  <p className="text-sm font-medium text-[var(--label)]">{organizer}</p>
                </div>
              </div>

              {location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'المدينة' : 'City'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{selectedEvent.city}</p>
                  </div>
                </div>
              )}

              {selectedEvent.specialty && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'التخصص' : 'Specialty'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{getSpecialtyLabel(selectedEvent.specialty || '', language)}</p>
                  </div>
                </div>
              )}

              {selectedEvent.activityType && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'نوع النشاط' : 'Activity Type'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{selectedEvent.activityType}</p>
                  </div>
                </div>
              )}

              {selectedEvent.date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'تاريخ الفعالية' : 'Event Date'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">
                      {new Date(selectedEvent.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.cme_hours !== undefined && selectedEvent.cme_hours > 0 && (
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'ساعات التعليم الطبي' : 'CME Hours'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{selectedEvent.cme_hours}</p>
                  </div>
                </div>
              )}

              {selectedEvent.submittedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'تاريخ التقديم' : 'Submitted At'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">
                      {new Date(selectedEvent.submittedAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.sfda_license && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[var(--secondary-label)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide">
                      {language === 'ar' ? 'رخصة الهيئة' : 'SFDA License'}
                    </p>
                    <p className="text-sm font-medium text-[var(--label)]">{selectedEvent.sfda_license}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk Flags Section */}
          {riskFlags.length > 0 && (
            <div className="border-t border-[var(--separator)] pt-4 mt-4">
              <h3 className="text-sm font-semibold text-[var(--label)] mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--apple-orange)]" />
                {language === 'ar' ? 'علامات المخاطر' : 'Risk Flags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {riskFlags.map((flag, idx) => (
                  <Badge key={idx} variant="destructive" className="text-xs">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail Snippet */}
          {auditTrailSnippet.length > 0 && (
            <div className="border-t border-[var(--separator)] pt-4 mt-4">
              <h3 className="text-sm font-semibold text-[var(--label)] mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-[var(--secondary-label)]" />
                {language === 'ar' ? 'آخر التغييرات' : 'Recent Activity'}
              </h3>
              <div className="space-y-2">
                {auditTrailSnippet.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--secondary-label)]">
                    <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium text-[var(--label)]">{entry.action}</span>
                      {' '}
                      <span className="text-[var(--secondary-label)]">
                        {language === 'ar' ? 'بواسطة' : 'by'} {entry.actor}
                      </span>
                      {' '}
                      <span className="text-[var(--secondary-label)]">
                        {new Date(entry.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </LiquidGlassCard>

        {/* Right: Accreditation Panel */}
        <div>
          <AccreditationPanel
            eventId={selectedEvent.id}
            initialStatus={selectedEvent.status}
            onDecision={onDecision}
          />
        </div>
      </div>
    </div>
  );
}
