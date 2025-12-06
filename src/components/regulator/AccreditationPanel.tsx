"use client";

import { useEffect, useState } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  eventId?: string;
  initialStatus?: string;
  onDecision?: (nextStatus: string) => void;
};

export function AccreditationPanel({ eventId, initialStatus, onDecision }: Props) {
  const { showToast } = useToast();
  const normalizeStatus = (status?: string) => (status ? status.toLowerCase().replace(' ', '_') : 'pending_review');
  const [eventStatus, setEventStatus] = useState<string>(normalizeStatus(initialStatus));
  const [accreditationId, setAccreditationId] = useState<string>('acc-123');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  useEffect(() => {
    setEventStatus(normalizeStatus(initialStatus));
  }, [initialStatus]);

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
    if (!eventId) {
      const message = 'eventId is required';
      setLastError(message);
      showToast(message, 'info');
      return;
    }
    const res = await handleResult(() =>
      api.reviewAccreditation({ eventId, decision: 'approve', accreditationId })
    );
    if (res && res.ok) {
      setEventStatus(res.status);
      onDecision?.(res.status);
      showToast('Approved', 'success');
    }
  };

  const reject = async () => {
    if (!eventId) {
      const message = 'eventId is required';
      setLastError(message);
      showToast(message, 'info');
      return;
    }
    const res = await handleResult(() =>
      api.reviewAccreditation({ eventId, decision: 'reject', reason: rejectReason })
    );
    if (res && res.ok) {
      setEventStatus(res.status);
      onDecision?.(res.status);
      showToast('Rejected', 'info');
    }
  };

  return (
    <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--label)]">Accreditation Review</h3>
          <p className="text-xs text-[var(--secondary-label)]">eventId: {eventId ?? '—'}</p>
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
        <GlassButton variant="default" size="sm" onClick={approve} disabled={!eventId} className="flex items-center justify-center gap-2">
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
        <GlassButton variant="default" size="sm" onClick={reject} disabled={!eventId} className="flex items-center justify-center gap-2">
          Reject
        </GlassButton>
      </div>

      <div className="border-t border-[var(--separator)] pt-3">
        <button onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-2 text-sm text-[var(--secondary-label)] hover:text-[var(--label)] transition-colors"
        >
          {showTechnicalDetails ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Technical details
        </button>

        {showTechnicalDetails && (
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
        )}
      </div>
    </LiquidGlassCard>
  );
}
