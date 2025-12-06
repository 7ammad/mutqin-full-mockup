"use client";

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Chart } from '@/components/shared/Chart';
import { Calendar, Users, TrendingUp, DollarSign, Award, Clock, ListChecks, Send, HelpCircle } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast-context';
import type { DemoEvent } from '@/context/demoSeed';
import { getSpecialtyLabel } from '@/lib/i18n/specialties';

interface EventDashboardProps {
  eventId: string;
}

export default function EventDashboard({ eventId }: EventDashboardProps) {
  const { language } = useLanguage();
  const { events } = usePersona();
  const { showToast } = useToast();
  const [organizerEvents, setOrganizerEvents] = useState<DemoEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [navView, setNavView] = useState<'activities' | 'accreditation' | 'publishing' | 'help'>('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const personaEvent = events.find((e) => e.id === eventId) ?? events.find((e) => e.id === 'evt-1');
  const apiEvent = useMemo(
    () => organizerEvents.find((evt) => evt.id === eventId) ?? organizerEvents.find((evt) => evt.id === 'evt-1'),
    [eventId, organizerEvents]
  );
  const event = useMemo(() => {
    if (apiEvent && personaEvent) {
      return {
        ...personaEvent,
        ...apiEvent,
        status: apiEvent.status,
        is_sponsored: apiEvent.is_sponsored ?? personaEvent.is_sponsored,
        needs_sponsorship: apiEvent.needs_sponsorship ?? personaEvent.needs_sponsorship,
        sfda_license: apiEvent.sfda_license ?? personaEvent.sfda_license,
      };
    }
    if (apiEvent) {
      return apiEvent as unknown as typeof personaEvent;
    }
    return personaEvent;
  }, [apiEvent, personaEvent]);
  const normalizeStatus = (status?: string) =>
    status ? status.toLowerCase().replace(' ', '_') : 'draft';
  const [eventStatus, setEventStatus] = useState<string>(normalizeStatus(event?.status));
  const [eventManagerId, setEventManagerId] = useState<string>('em-1');
  const [organizerIdInput, setOrganizerIdInput] = useState<string>((event as any)?.organizerId ?? 'org-1');
  const [assignment, setAssignment] = useState<{ id: string; status?: string } | null>(null);
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');

  const refreshEvents = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await api.getOrganizerEvents({ organizerId: 'org-1' });
      setOrganizerEvents(res.events);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setFetchError(message);
      showToast(message, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  useEffect(() => {
    setEventStatus(normalizeStatus(apiEvent?.status ?? event?.status));
    if (apiEvent?.organizerId) {
      setOrganizerIdInput(apiEvent.organizerId);
    }
  }, [apiEvent, event]);

  if (isLoading && !event) {
    return (
      <LiquidGlassCard blurIntensity="lg" className="p-12">
        <div className="text-center text-[var(--secondary-label)]">Loading events...</div>
      </LiquidGlassCard>
    );
  }

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
  const introTitle = language === 'ar' ? 'أنشطتك ومراحل الاعتماد' : 'Your activities & lifecycle';
  const lifecycleHelper = language === 'ar'
    ? 'مرِّر الحدث عبر الاعتماد ثم التكليف ثم النشر. الأزرار أدناه متزامنة مع الحالة الحالية.'
    : 'Move the event through accreditation, assignment, then publish. Controls stay in sync with current state.';
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
      await refreshEvents();
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

  const sourceEvents = organizerEvents.length > 0 ? organizerEvents : (events as any);
  const normalize = (status?: string) => (status ? status.toLowerCase().replace(' ', '_') : '');

  const filteredActivities = sourceEvents.filter((ev: any) => {
    const matchSearch =
      !searchTerm ||
      (language === 'ar' ? ev.titleAr : ev.titleEn ?? ev.title ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const status = normalize(ev.status);
    const matchStatus = statusFilter === 'all' || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const accreditationList = sourceEvents.filter((ev: any) => {
    const status = normalize(ev.status);
    return status === 'draft' || status === 'pending_review';
  });

  const publishingList = sourceEvents.filter((ev: any) => {
    const status = normalize(ev.status);
    return status === 'approved';
  });

  const navItems = [
    {
      key: 'activities',
      label: language === 'ar' ? 'أنشطتي' : 'My Activities',
      icon: <ListChecks className="h-4 w-4" />,
      count: sourceEvents.length,
    },
    {
      key: 'accreditation',
      label: language === 'ar' ? 'الاعتمادات' : 'Accreditation',
      icon: <Clock className="h-4 w-4" />,
      count: accreditationList.length,
    },
    {
      key: 'publishing',
      label: language === 'ar' ? 'النشر' : 'Publishing',
      icon: <Send className="h-4 w-4" />,
      count: publishingList.length,
    },
    {
      key: 'help',
      label: language === 'ar' ? 'المساعدة' : 'Help',
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ] as const;
  const pendingCount = sourceEvents.filter((ev: any) => normalize(ev.status) === 'pending_review').length;
  const approvedCount = sourceEvents.filter((ev: any) => normalize(ev.status) === 'approved').length;
  const rejectedCount = sourceEvents.filter((ev: any) => normalize(ev.status) === 'draft').length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-2">
          <div className="border rounded-lg bg-white/70 p-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition ${
                  navView === item.key ? 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]' : 'text-[var(--label)] hover:bg-[var(--system-fill)]'
                }`}
                onClick={() => setNavView(item.key)}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {'count' in item && item.count !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--label)]">{introTitle}</h2>
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

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {navView === 'activities' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
                      placeholder={language === 'ar' ? 'بحث بالعنوان' : 'Search by title'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      {['all', 'draft', 'pending_review', 'approved', 'published', 'closed'].map((status) => (
                        <GlassButton
                          key={status}
                          variant={statusFilter === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </GlassButton>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {filteredActivities.length === 0 ? (
                      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                        <p className="text-sm text-[var(--secondary-label)]">
                          {language === 'ar' ? 'لا توجد أنشطة مطابقة' : 'No activities found'}
                        </p>
                      </LiquidGlassCard>
                    ) : (
                      filteredActivities.map((ev: any) => {
                        const status = normalize(ev.status);
                        return (
                          <LiquidGlassCard key={ev.id} blurIntensity="lg" interactive={false} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-[var(--label)]">
                                  {language === 'ar' ? ev.titleAr ?? ev.title : ev.titleEn ?? ev.title}
                                </h3>
                                <p className="text-xs text-[var(--secondary-label)]">{ev.id}</p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {status}
                              </Badge>
                            </div>
                          </LiquidGlassCard>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {navView === 'accreditation' && (
                <div className="space-y-3">
                  {accreditationList.length === 0 ? (
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                      <p className="text-sm text-[var(--secondary-label)]">
                        {language === 'ar' ? 'لا توجد اعتمادات قيد المعالجة' : 'No accreditations in progress'}
                      </p>
                    </LiquidGlassCard>
                  ) : (
                    accreditationList.map((ev: any) => (
                      <LiquidGlassCard key={ev.id} blurIntensity="lg" interactive={false} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--label)]">
                              {language === 'ar' ? ev.titleAr ?? ev.title : ev.titleEn ?? ev.title}
                            </h3>
                            <p className="text-xs text-[var(--secondary-label)]">
                              {language === 'ar' ? 'حالة الاعتماد' : 'Accreditation status'}: {normalize(ev.status)}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {normalize(ev.status)}
                          </Badge>
                        </div>
                      </LiquidGlassCard>
                    ))
                  )}
                </div>
              )}

              {navView === 'publishing' && (
                <div className="space-y-3">
                  {publishingList.length === 0 ? (
                    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4">
                      <p className="text-sm text-[var(--secondary-label)]">
                        {language === 'ar' ? 'لا توجد فعاليات جاهزة للنشر' : 'No events ready to publish'}
                      </p>
                    </LiquidGlassCard>
                  ) : (
                    publishingList.map((ev: any) => (
                      <LiquidGlassCard key={ev.id} blurIntensity="lg" interactive={false} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--label)]">
                              {language === 'ar' ? ev.titleAr ?? ev.title : ev.titleEn ?? ev.title}
                            </h3>
                            <p className="text-xs text-[var(--secondary-label)]">
                              {language === 'ar' ? 'جاهز للنشر بعد الموافقة' : 'Ready to publish after approval'}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {normalize(ev.status)}
                          </Badge>
                        </div>
                      </LiquidGlassCard>
                    ))
                  )}
                </div>
              )}

              {navView === 'help' && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--label)]">
                    {language === 'ar' ? 'المساعدة' : 'Help'}
                  </h3>
                  <p className="text-sm text-[var(--secondary-label)]">
                    {language === 'ar'
                      ? 'استخدم الاعتماد ثم التكليف ثم النشر. الأزرار في الشريط الجانبي تقودك للخطوات.'
                      : 'Use accreditation, then assignments, then publish. SideNav items guide the steps.'}
                  </p>
                </LiquidGlassCard>
              )}
            </div>

            <div className="space-y-3">
              <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[var(--label)]">{language === 'ar' ? 'الإجراءات القادمة' : 'Next actions'}</h4>
                  <Badge variant="outline" className="capitalize">
                    {eventStatus}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <GlassButton variant="default" onClick={submitAccreditation} disabled={submitDisabled} size="sm" className="flex items-center justify-center gap-2">
                    Submit accreditation
                  </GlassButton>
                  <GlassButton
                    variant="default"
                    onClick={async () => {
                      const res = await handleResult(() => api.createAssignment({ eventId, eventManagerId }));
                      if (res && res.ok) {
                        setAssignment({ id: res.assignmentId });
                        await refreshEvents();
                        showToast('Assignment created', 'success');
                      }
                    }}
                    disabled={assignDisabled}
                    size="sm"
                  >
                    Create assignment
                  </GlassButton>
                  <GlassButton
                    variant="default"
                    onClick={async () => {
                      const res = await handleResult(() => api.publishEvent({ eventId, organizerId: organizerIdInput }));
                      if (res && res.ok) {
                        setEventStatus(normalizeStatus(res.status));
                        await refreshEvents();
                        showToast('Event published', 'success');
                      }
                    }}
                    disabled={publishDisabled}
                    size="sm"
                  >
                    Publish
                  </GlassButton>
                </div>
                <div className="text-xs text-[var(--secondary-label)]">
                  {language === 'ar'
                    ? 'الأزرار تعمل على الحدث النشط الافتراضي في العرض التوضيحي.'
                    : 'Buttons act on the demo primary event.'}
                </div>
              </LiquidGlassCard>
              <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-2">
                <h4 className="font-semibold text-[var(--label)]">{language === 'ar' ? 'لقطة حالة' : 'Status snapshot'}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'قيد الاعتماد' : 'Pending review'}</span>
                    <span className="font-semibold text-[var(--label)]">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'موافق عليه' : 'Approved'}</span>
                    <span className="font-semibold text-[var(--label)]">{approvedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary-label)]">{language === 'ar' ? 'مسودة/مرفوض' : 'Draft/Rejected'}</span>
                    <span className="font-semibold text-[var(--label)]">{rejectedCount}</span>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          </div>

          {/* Stats & charts preserved below */}

      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--secondary-label)]">{introTitle}</p>
            <p className="text-xs text-[var(--tertiary-label)]">
              {lifecycleHelper}
            </p>
          </div>
          <div className="text-xs text-[var(--secondary-label)]">
            {isLoading ? 'Loading events...' : fetchError || `Loaded ${organizerEvents.length} events`}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlassButton variant="default" onClick={submitAccreditation} disabled={submitDisabled} size="sm" className="flex items-center justify-center gap-2">
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
                  await refreshEvents();
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
                  await refreshEvents();
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
        <div className="text-sm text-[var(--secondary-label)] mt-3">
          {isLoading ? 'Loading events...' : fetchError || `Loaded ${organizerEvents.length} events`}
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
              <span className="text-[var(--label)] font-medium">{getSpecialtyLabel(event.specialty || '', language)}</span>
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
    </div>
  </div>
  );
}
