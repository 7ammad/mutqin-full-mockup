"use client";

import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Ticket, Award } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";

type AssignmentStatus = 'pending' | 'accepted' | 'declined';
type TicketStatus = 'confirmed' | 'attended';

const defaults = {
  assignmentId: 'assign-1',
  eventId: 'evt-1',
  eventManagerId: 'em-1',
  hcpId: 'hcp-1',
  ticketId: 'tkt-1',
};

export default function ExecutionFlow() {
  const { showToast } = useToast();
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>('pending');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('confirmed');
  const [attendanceFinalized, setAttendanceFinalized] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<{ id: string; url: string } | null>(null);
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');
  const [eventPublished] = useState<boolean>(true);
  const [eventApproved] = useState<boolean>(true);

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
    const res = await handleResult(() =>
      api.respondAssignment({ assignmentId: defaults.assignmentId, decision: 'accept' })
    );
    if (res && res.ok) {
      setAssignmentStatus('accepted');
      showToast('Assignment accepted', 'success');
    }
  };

  const checkIn = async () => {
    if (assignmentStatus !== 'accepted' || !eventPublished) return;
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
      api.finalizeAttendance({ eventId: defaults.eventId, eventManagerId: defaults.eventManagerId })
    );
    if (res && res.ok) {
      setAttendanceFinalized(true);
      showToast('Attendance finalized', 'success');
    }
  };

  const issueCertificate = async () => {
    if (!attendanceFinalized || ticketStatus !== 'attended' || !eventApproved) return;
    const res = await handleResult(() =>
      api.issueCertificate({ eventId: defaults.eventId, hcpId: defaults.hcpId })
    );
    if (res && res.ok) {
      setCertificate({ id: res.certificateId, url: res.url });
      showToast('Certificate issued', 'success');
    }
  };

  const checkInDisabled = assignmentStatus !== 'accepted' || !eventPublished;
  const finalizeDisabled = ticketStatus !== 'attended';
  const certDisabled = !attendanceFinalized || ticketStatus !== 'attended' || !eventApproved;

  return (
    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--label)]">Execution Flow (demo)</h3>
          <p className="text-xs text-[var(--secondary-label)]">
            assignmentId: {defaults.assignmentId} · eventId: {defaults.eventId} · ticketId: {defaults.ticketId}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            Assignment: {assignmentStatus}
          </Badge>
          <Badge variant="outline" className="capitalize">
            Ticket: {ticketStatus}
          </Badge>
          <Badge variant="outline">
            Finalized: {attendanceFinalized ? 'yes' : 'no'}
          </Badge>
          <Badge variant="outline">
            Event: {eventPublished ? 'published' : 'not published'}
          </Badge>
          <Badge variant="outline">
            Accreditation: {eventApproved ? 'approved' : 'not approved'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <GlassButton
          variant="default"
          size="sm"
          onClick={acceptAssignment}
          disabled={assignmentStatus !== 'pending'}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Accept Assignment
        </GlassButton>
        <GlassButton
          variant="default"
          size="sm"
          onClick={checkIn}
          disabled={checkInDisabled}
        >
          <Ticket className="w-4 h-4 mr-2" />
          Check-in Ticket
        </GlassButton>
        <GlassButton
          variant="default"
          size="sm"
          onClick={finalizeAttendance}
          disabled={finalizeDisabled}
        >
          <Clock className="w-4 h-4 mr-2" />
          Finalize Attendance
        </GlassButton>
        <GlassButton
          variant="default"
          size="sm"
          onClick={issueCertificate}
          disabled={certDisabled}
        >
          <Award className="w-4 h-4 mr-2" />
          Issue Certificate
        </GlassButton>
      </div>

      {certificate && (
        <div className="rounded-lg border bg-white/70 p-3 text-sm flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--label)]">Certificate</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
  );
}
