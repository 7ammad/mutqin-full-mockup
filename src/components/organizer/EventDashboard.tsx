"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Calendar, Users, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast-context';

interface EventDashboardProps {
  eventId: string;
}

export default function EventDashboard({ eventId }: EventDashboardProps) {
  const { language } = useLanguage();
  const { events } = usePersona();
  const { showToast } = useToast();
  const event = events.find((e) => e.id === eventId);
  const normalizeStatus = (status?: string) =>
    status ? status.toLowerCase().replace(' ', '_') : 'draft';
  const [eventStatus, setEventStatus] = useState<string>(normalizeStatus(event?.status));
  const [eventManagerId, setEventManagerId] = useState<string>('em-1');
  const [organizerIdInput, setOrganizerIdInput] = useState<string>((event as any)?.organizerId ?? 'org-1');
  const [assignment, setAssignment] = useState<{ id: string; status?: string } | null>(null);
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');

  if (!event) {
    return (
      <LiquidGlassCard blurIntensity="lg" className="p-12">
        <div className="text-center text-[var(--secondary-label)]">
          {language === 'ar' ? 'الحدث غير موجود' : 'Event not found'}
        </div>
      </LiquidGlassCard>
    );
  }

  const title = language === 'ar' ? 'لوحة الحدث' : 'Event Dashboard';
  const registrationsText = language === 'ar' ? 'التسجيلات' : 'Registrations';
  const revenueText = language === 'ar' ? 'الإيرادات' : 'Revenue';
  const attendanceText = language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate';
  const capacityText = language === 'ar' ? 'السعة' : 'Capacity';
  const timelineText = language === 'ar' ? 'خط زمني للتسجيل' : 'Registration Timeline';
  const demographicsText = language === 'ar' ? 'شرائح الحضور' : 'Attendee Demographics';
  const statusText = language === 'ar' ? 'حالة الاعتماد' : 'Accreditation Status';
  const sponsorshipText = language === 'ar' ? 'حالة الرعاية' : 'Sponsorship Status';

  const handleResult = async <T,>(fn: () => Promise<T>) => {
    setLastError('');
    try {
      const res = await fn();
      setLastResult(res);
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setLastError(message);
      setLastResult(null);
      showToast(message, 'info');
      return null;
    }
  };

  const submitAccreditation = async () => {
    if (eventStatus !== 'draft') return;
    const res = await handleResult(() => api.submitAccreditation({ eventId }));
    if (res && res.ok) {
      setEventStatus(normalizeStatus(res.status));
      showToast('Accreditation submitted', 'success');
    }
  };

  const submitDisabled = eventStatus !== 'draft';
  const assignDisabled = !['approved', 'published'].includes(eventStatus);
  const publishDisabled = eventStatus !== 'approved' || organizerIdInput !== ((event as any).organizerId ?? 'org-1');

  // Mock stats
  const registrations = 145;
  const revenue = registrations * 500;
  const attendanceRate = 85;
  const targetCapacity = 200;
  const registrationTimeline = [
    { name: language === 'ar' ? 'يناير' : 'Jan', value: 20 },
    { name: language === 'ar' ? 'فبراير' : 'Feb', value: 45 },
    { name: language === 'ar' ? 'مارس' : 'Mar', value: 80 },
  ];
  const demographics = [
    { name: 'Cardiology', value: 45 },
    { name: 'Family Medicine', value: 30 },
    { name: 'Emergency Medicine', value: 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
          <p className="text-sm text-[var(--secondary-label)] mt-1">
            {language === 'ar' ? event.titleAr : event.titleEn}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="capitalize">
            {eventStatus}
          </Badge>
          {assignment && (
            <Badge variant="outline">
              assignment: {assignment.id} {assignment.status ? `(${assignment.status})` : ''}
            </Badge>
          )}
        </div>
      </div>

      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
        <div className="flex flex-wrap gap-2">
          <GlassButton variant="default" onClick={submitAccreditation} disabled={submitDisabled} size="sm">
            Submit accreditation
          </GlassButton>
          <div className="flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm"
              value={eventManagerId}
              onChange={(e) => setEventManagerId(e.target.value)}
              placeholder="eventManagerId"
            />
            <GlassButton
              variant="default"
              onClick={async () => {
                const res = await handleResult(() => api.createAssignment({ eventId, eventManagerId }));
                if (res && res.ok) {
                  setAssignment({ id: res.assignmentId });
                  showToast('Assignment created', 'success');
                }
              }}
              disabled={assignDisabled}
              size="sm"
            >
              Create assignment
            </GlassButton>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm"
              value={organizerIdInput}
              onChange={(e) => setOrganizerIdInput(e.target.value)}
              placeholder="organizerId"
            />
            <GlassButton
              variant="default"
              onClick={async () => {
                const res = await handleResult(() => api.publishEvent({ eventId, organizerId: organizerIdInput }));
                if (res && res.ok) {
                  setEventStatus(normalizeStatus(res.status));
                  showToast('Event published', 'success');
                }
              }}
              disabled={publishDisabled}
              size="sm"
            >
              Publish
            </GlassButton>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
          <div>
            <p className="font-semibold text-[var(--label)]">Last result</p>
            <pre className="bg-white border rounded p-2 overflow-auto">
              {lastResult ? JSON.stringify(lastResult, null, 2) : '—'}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-[var(--label)]">Last error</p>
            <p className="text-[var(--secondary-label)]">{lastError || '—'}</p>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--secondary-label)] mb-1">{registrationsText}</p>
              <p className="text-3xl font-bold text-[var(--label)]">{registrations}</p>
              <p className="text-xs text-[var(--tertiary-label)] mt-1">
                {language === 'ar' ? 'من' : 'of'} {targetCapacity}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
              <Users className="w-8 h-8 text-[var(--apple-blue)]" />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--secondary-label)] mb-1">{revenueText}</p>
              <p className="text-3xl font-bold text-[var(--label)]">
                {revenue.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
              <p className="text-xs text-[var(--tertiary-label)] mt-1">SAR</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
              <DollarSign className="w-8 h-8 text-[var(--apple-green)]" />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--secondary-label)] mb-1">{attendanceText}</p>
              <p className="text-3xl font-bold text-[var(--label)]">{attendanceRate}%</p>
              <p className="text-xs text-[var(--tertiary-label)] mt-1">
                {language === 'ar' ? 'متوقع' : 'Expected'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[var(--apple-purple)]/10">
              <TrendingUp className="w-8 h-8 text-[var(--apple-purple)]" />
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--secondary-label)] mb-1">{capacityText}</p>
              <p className="text-3xl font-bold text-[var(--label)]">{targetCapacity}</p>
              <p className="text-xs text-[var(--tertiary-label)] mt-1">
                {language === 'ar' ? 'الحد الأقصى' : 'Maximum'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
              <Award className="w-8 h-8 text-[var(--apple-orange)]" />
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{timelineText}</h3>
          <Chart type="line" data={registrationTimeline} dataKey="value" height={250} />
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <h3 className="text-lg font-semibold text-[var(--label)] mb-4">{demographicsText}</h3>
          <Chart type="pie" data={demographics} dataKey="value" height={250} />
        </LiquidGlassCard>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--label)]">{statusText}</h3>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                eventStatus === 'published'
                  ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                  : eventStatus === 'pending_review'
                  ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                  : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
              }`}
            >
              {eventStatus}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--secondary-label)]">
                {language === 'ar' ? 'ساعات CME' : 'CME Hours'}:
              </span>
              <span className="text-[var(--label)] font-medium">{event.cme_hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--secondary-label)]">
                {language === 'ar' ? 'التخصص' : 'Specialty'}:
              </span>
              <span className="text-[var(--label)] font-medium">{event.specialty}</span>
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--label)]">{sponsorshipText}</h3>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.is_sponsored
                  ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                  : event.needs_sponsorship
                  ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                  : 'bg-[var(--system-fill)] text-[var(--secondary-label)]'
              }`}
            >
              {event.is_sponsored
                ? language === 'ar'
                  ? 'برعاية'
                  : 'Sponsored'
                : event.needs_sponsorship
                ? language === 'ar'
                  ? 'بحاجة لرعاية'
                  : 'Needs Sponsorship'
                : language === 'ar'
                ? 'غير مدعوم'
                : 'Not Sponsored'}
            </div>
          </div>
          {event.sfda_license && (
            <div className="text-sm">
              <span className="text-[var(--secondary-label)]">
                {language === 'ar' ? 'رخصة SFDA' : 'SFDA License'}:
              </span>
              <span className="text-[var(--label)] font-medium ml-2">{event.sfda_license}</span>
            </div>
          )}
        </LiquidGlassCard>
      </div>
    </div>
  );
}
