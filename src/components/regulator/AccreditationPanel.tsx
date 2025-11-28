"use client";

import { useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";

type Props = {
  eventId: string;
  initialStatus: string;
};

export function AccreditationPanel({ eventId, initialStatus }: Props) {
  const { showToast } = useToast();
  const [eventStatus, setEventStatus] = useState<string>(initialStatus.toLowerCase().replace(' ', '_'));
  const [accreditationId, setAccreditationId] = useState<string>('acc-123');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');

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

  const approve = async () => {
    const res = await handleResult(() =>
      api.reviewAccreditation({ eventId, decision: 'approve', accreditationId })
    );
    if (res && res.ok) {
      setEventStatus(res.status);
      showToast('Approved', 'success');
    }
  };

  const reject = async () => {
    const res = await handleResult(() =>
      api.reviewAccreditation({ eventId, decision: 'reject', reason: rejectReason })
    );
    if (res && res.ok) {
      setEventStatus(res.status);
      showToast('Rejected', 'info');
    }
  };

  return (
    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--label)]">Accreditation Review</h3>
          <p className="text-xs text-[var(--secondary-label)]">eventId: {eventId}</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {eventStatus}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Input
          className="w-48"
          value={accreditationId}
          onChange={(e) => setAccreditationId(e.target.value)}
          placeholder="accreditationId"
        />
        <GlassButton variant="default" size="sm" onClick={approve}>
          Approve
        </GlassButton>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Input
          className="w-48"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Rejection reason"
        />
        <GlassButton variant="default" size="sm" onClick={reject}>
          Reject
        </GlassButton>
      </div>

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
