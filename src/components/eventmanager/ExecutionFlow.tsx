"use client";

import { useEffect, useState, useMemo } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Ticket, Award, Users, AlertCircle, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";
import { useLanguage } from "@/context/LanguageContext";
import { getEventAttendanceData } from "@/context/demoStore";
import type { DemoEvent } from "@/context/demoSeed";

type AssignmentStatus = 'pending' | 'accepted' | 'declined';
type TicketStatus = 'confirmed' | 'attended';

type ExecutionFlowProps = {
  eventId: string;
  eventStatus: string;
  assignmentId?: string;
  assignmentStatus?: AssignmentStatus;
  onAssignmentUpdated?: () => void;
  event?: DemoEvent;
};

const defaults = {
  eventManagerId: 'em-1',
  hcpId: 'hcp-1',
  ticketId: 'tkt-1',
};

export default function ExecutionFlow({
  eventId,
  eventStatus,
  assignmentId,
  assignmentStatus: initialAssignmentStatus = 'pending',
  onAssignmentUpdated,
  event,
}: ExecutionFlowProps) {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>(initialAssignmentStatus);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('confirmed');
  const [attendanceFinalized, setAttendanceFinalized] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<{ id: string; url: string } | null>(null);
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');
  const normalizedEventStatus = eventStatus.toLowerCase();

  useEffect(() => {
    setAssignmentStatus(initialAssignmentStatus);
  }, [initialAssignmentStatus]);

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

  const acceptAssignment = async () => {
    if (!assignmentId) return;
    const res = await handleResult(() =>
      api.respondAssignment({ assignmentId, decision: 'accept' })
    );
    if (res && res.ok) {
      setAssignmentStatus('accepted');
      onAssignmentUpdated?.();
      showToast('Assignment accepted', 'success');
    }
  };

  const checkIn = async () => {
    if (assignmentStatus !== 'accepted' || normalizedEventStatus !== 'published') return;
    const res = await handleResult(() =>
      api.checkIn({ ticketId: defaults.ticketId, eventManagerId: defaults.eventManagerId })
    );
    if (res && res.ok) {
      setTicketStatus('attended');
      showToast('Ticket checked in', 'success');
    }
  };

  const finalizeAttendance = async () => {
    if (ticketStatus !== 'attended') return;
    const res = await handleResult(() =>
      api.finalizeAttendance({ eventId, eventManagerId: defaults.eventManagerId })
    );
    if (res && res.ok) {
      setAttendanceFinalized(true);
      showToast('Attendance finalized', 'success');
    }
  };

  const issueCertificate = async () => {
    if (!attendanceFinalized || ticketStatus !== 'attended' || normalizedEventStatus !== 'approved') return;
    const res = await handleResult(() =>
      api.issueCertificate({ eventId, hcpId: defaults.hcpId })
    );
    if (res && res.ok) {
      setCertificate({ id: res.certificateId, url: res.url });
      showToast('Certificate issued', 'success');
    }
  };

  const attendanceData = useMemo(() => getEventAttendanceData(eventId), [eventId]);
  const errorCount = 0; // No errors in demo for now

  const checkInDisabled = assignmentStatus !== 'accepted' || normalizedEventStatus !== 'published';
  const finalizeDisabled = ticketStatus !== 'attended';
  const certDisabled = !attendanceFinalized || ticketStatus !== 'attended' || normalizedEventStatus !== 'approved';

  return (
    <div className="space-y-6">
      {/* Now Operating Panel */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-[var(--apple-blue)]" />
              <h3 className="text-xl font-semibold text-[var(--label)]">
                {language === 'ar' ? ' ' : 'Now Operating'}
              </h3>
              <Badge variant="outline" className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20">
                {language === 'ar' ? '' : 'Active'}
              </Badge>
            </div>
            {event && (
              <div className="space-y-1">
                <p className="text-lg font-medium text-[var(--label)]">
                  {language === 'ar' ? event.titleAr : event.titleEn}
                </p>
                <p className="text-sm text-[var(--secondary-label)]">
                  {language === 'ar' ? event.organizerAr : event.organizerEn}
                </p>
                {event.date ? (
                  <p className="text-xs text-[var(--secondary-label)]">
                    {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Quick KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                  {language === 'ar' ? ' ' : 'Checked In'}
                </p>
                <p className="text-2xl font-bold text-[var(--label)]">{attendanceData.checkedInCount}</p>
                <p className="text-xs text-[var(--secondary-label)] mt-1">
                  {language === 'ar' ? ` ${attendanceData.totalCount}` : `of ${attendanceData.totalCount}`}
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
                  {language === 'ar' ? ' ' : 'Total Tickets'}
                </p>
                <p className="text-2xl font-bold text-[var(--label)]">{attendanceData.totalCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-[var(--apple-green)]" />
              </div>
            </div>
          </LiquidGlassCard>
          <LiquidGlassCard blurIntensity="md" interactive={false} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                  {language === 'ar' ? '' : 'Errors'}
                </p>
                <p className="text-2xl font-bold text-[var(--label)]">{errorCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[var(--apple-orange)]/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[var(--apple-orange)]" />
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </LiquidGlassCard>

      {/* Execution Flow Actions */}
      <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--label)]">
              {language === 'ar' ? ' ' : 'Execution Flow'}
            </h3>
            <p className="text-xs text-[var(--secondary-label)]">
              {language === 'ar' ? ' :    →   →  ' : 'Follow steps: Check-in → Finalize → Issue Certificate'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {language === 'ar' ? '' : 'Assignment'}: {assignmentStatus}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {language === 'ar' ? '' : 'Ticket'}: {ticketStatus}
            </Badge>
            <Badge variant="outline">
              {language === 'ar' ? '' : 'Finalized'}: {attendanceFinalized ? (language === 'ar' ? '' : 'yes') : (language === 'ar' ? '' : 'no')}
            </Badge>
            <Badge variant="outline">
              {language === 'ar' ? '' : 'Event'}: {normalizedEventStatus}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <GlassButton
            variant="default"
            size="sm"
            onClick={acceptAssignment}
            disabled={assignmentStatus !== 'pending'}
           className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {language === 'ar' ? ' ' : 'Accept Assignment'}
          </GlassButton>
          <GlassButton
            variant="default"
            size="sm"
            onClick={checkIn}
            disabled={checkInDisabled}
           className="flex items-center justify-center gap-2">
            <Ticket className="w-4 h-4 mr-2" />
            {language === 'ar' ? '  ' : 'Check-in Ticket'}
          </GlassButton>
          <GlassButton
            variant="default"
            size="sm"
            onClick={finalizeAttendance}
            disabled={finalizeDisabled}
           className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 mr-2" />
            {language === 'ar' ? ' ' : 'Finalize Attendance'}
          </GlassButton>
          <GlassButton
            variant="default"
            size="sm"
            onClick={issueCertificate}
            disabled={certDisabled}
           className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 mr-2" />
            {language === 'ar' ? ' ' : 'Issue Certificate'}
          </GlassButton>
        </div>

      {certificate && (
        <div className="rounded-lg border bg-white/70 p-3 text-sm flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--label)]">
              {language === 'ar' ? '' : 'Certificate'}
            </div>
            <div className="text-[var(--secondary-label)]">ID: {certificate.id}</div>
          </div>
          <a
            href={certificate.url}
            className="text-[var(--apple-blue)] text-sm underline"
            target="_blank"
            rel="noreferrer"
          >
            {certificate.url}
          </a>
        </div>
      )}
    </LiquidGlassCard>
    </div>
  );
}
