"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertTriangle, FileText, Send, Clock, User } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast-context";
import { useRouter } from "next/navigation";

interface Decision {
    id: string;
    eventId: string;
    decision: 'approve' | 'reject' | 'request-modification';
    notes: string;
    reviewer: string;
    timestamp: string;
    status: 'pending' | 'sent' | 'acknowledged';
}

export default function DecisionManagement() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const router = useRouter();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [decision, setDecision] = useState<'approve' | 'reject' | 'request-modification' | null>(null);
    const [notes, setNotes] = useState<string>("");
    const [decisions, setDecisions] = useState<Decision[]>([]);

    const pendingEvents = events.filter(e => e.status === "Pending Approval");
    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    const handleSubmitDecision = async () => {
        if (!selectedEventId || !decision) {
            showToast(language === 'ar' ? '   ' : 'Please select an event and decision', 'info');
            return;
        }

        if ((decision === 'reject' || decision === 'request-modification') && !notes.trim()) {
            showToast(language === 'ar' ? '  ' : 'Please add notes', 'info');
            return;
        }

        try {
            const res = await api.reviewAccreditation({
                eventId: selectedEventId,
                decision: decision === 'approve' ? 'approve' : 'reject',
                reason: notes || undefined
            });

            if (res.ok) {
                const newDecision: Decision = {
                    id: `dec-${Date.now()}`,
                    eventId: selectedEventId,
                    decision,
                    notes,
                    reviewer: language === 'ar' ? '.  ' : 'Dr. Khalid Al-Fahd',
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                };

                setDecisions([...decisions, newDecision]);
                showToast(
                    language === 'ar' ? '   ' : 'Decision sent successfully',
                    'success'
                );
                router.refresh();

                // Reset
                setSelectedEventId(null);
                setDecision(null);
                setNotes("");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : (language === 'ar' ? ' ' : 'An error occurred');
            showToast(message, 'info');
        }
    };

    const title = language === 'ar' ? ' ' : 'Decision Management';
    const selectEventText = language === 'ar' ? ' ' : 'Select Event';
    const decisionText = language === 'ar' ? '' : 'Decision';
    const notesText = language === 'ar' ? '' : 'Notes';
    const submitText = language === 'ar' ? ' ' : 'Submit Decision';
    const approveText = language === 'ar' ? '' : 'Approve';
    const rejectText = language === 'ar' ? '' : 'Reject';
    const requestModificationText = language === 'ar' ? ' ' : 'Request Modifications';
    const decisionHistoryText = language === 'ar' ? ' ' : 'Decision History';


    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                    {title}
                </h2>

                {/* Event Selection */}
                <div className="mb-6">
                    <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                        {selectEventText}
                    </Label>
                    <Select value={selectedEventId || ''} onValueChange={setSelectedEventId}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={selectEventText} />
                        </SelectTrigger>
                        <SelectContent glass={true}>
                            {pendingEvents.map(event => (
                                <SelectItem key={event.id} value={event.id}>
                                    {getEventTitle(event, language)} - {getEventOrganizer(event, language)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedEvent ? (
                    <div className="space-y-6">
                        {/* Event Summary */}
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-[var(--label)]">
                                    {getEventTitle(selectedEvent, language)}
                                </h3>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {getEventOrganizer(selectedEvent, language)}
                                </p>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {new Date(selectedEvent.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')} • {selectedEvent.cme_hours} {language === 'ar' ? ' ' : 'CME hours'}
                                </p>
                            </div>
                        </LiquidGlassCard>

                        {/* Decision Selection */}
                        <div>
                            <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                                {decisionText}
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <GlassButton
                                    variant={decision === 'approve' ? 'default' : 'outline'}
                                    onClick={() => setDecision('approve')}
                                    className="gap-2 h-auto py-4"
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">{approveText}</p>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? '  ' : 'Approve the event'}
                                        </p>
                                    </div>
                                </GlassButton>
                                <GlassButton
                                    variant={decision === 'reject' ? 'default' : 'outline'}
                                    onClick={() => setDecision('reject')}
                                    className="gap-2 h-auto py-4"
                                >
                                    <XCircle className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">{rejectText}</p>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? ' ' : 'Reject the event'}
                                        </p>
                                    </div>
                                </GlassButton>
                                <GlassButton
                                    variant={decision === 'request-modification' ? 'default' : 'outline'}
                                    onClick={() => setDecision('request-modification')}
                                    className="gap-2 h-auto py-4"
                                >
                                    <AlertTriangle className="h-5 w-5" />
                                    <div className="text-left">
                                        <p className="font-semibold">{requestModificationText}</p>
                                        <p className="text-xs text-[var(--secondary-label)]">
                                            {language === 'ar' ? ' ' : 'Request modifications'}
                                        </p>
                                    </div>
                                </GlassButton>
                            </div>
                        </div>

                        {/* Notes (Required for reject/modification) */}
                        {(decision === 'reject' || decision === 'request-modification') && (
                            <div>
                                <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                                    {notesText} *
                                </Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={language === 'ar' ? '  ...' : 'Add detailed notes...'}
                                    rows={5}
                                    required
                                />
                                <p className="text-xs text-[var(--secondary-label)] mt-2">
                                    {language === 'ar' 
                                        ? '     '
                                        : 'Notes are required for rejection or modification requests'}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <GlassButton
                            onClick={handleSubmitDecision}
                            disabled={!decision || ((decision === 'reject' || decision === 'request-modification') && !notes.trim())}
                            className="w-full gap-2 flex items-center justify-center"
                        >
                            <Send className="h-4 w-4" />
                            {submitText}
                        </GlassButton>
                    </div>
                ) : (
                    <EmptyState
                        title={language === 'ar' ? '   ' : 'No Event Selected'}
                        description={language === 'ar' ? '    ' : 'Please select an event to manage decision'}
                        icon={FileText}
                    />
                )}
            </LiquidGlassCard>

            {/* Decision History */}
            {decisions.length > 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                        {decisionHistoryText}
                    </h3>
                    <div className="space-y-4">
                        {decisions.map((dec) => {
                            const event = events.find(e => e.id === dec.eventId);
                            if (!event) return null;

                            return (
                                <LiquidGlassCard key={dec.id} blurIntensity="lg" interactive={false} className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[var(--label)] mb-1">
                                                {getEventTitle(event, language)}
                                            </h4>
                                            <div className="flex items-center gap-4 text-sm text-[var(--secondary-label)]">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {dec.reviewer}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(dec.timestamp).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                            dec.decision === 'approve'
                                                ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                                : dec.decision === 'reject'
                                                ? 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]'
                                                : 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                        }`}>
                                            {dec.decision === 'approve' ? (
                                                <>
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {approveText}
                                                </>
                                            ) : dec.decision === 'reject' ? (
                                                <>
                                                    <XCircle className="h-3 w-3" />
                                                    {rejectText}
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {requestModificationText}
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    {dec.notes && (
                                        <p className="text-sm text-[var(--secondary-label)] mt-2 p-3 bg-[var(--system-fill)] rounded-ios">
                                            {dec.notes}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            dec.status === 'sent'
                                                ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                                : 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                        }`}>
                                            {dec.status === 'sent' 
                                                ? (language === 'ar' ? ' ' : 'Sent')
                                                : (language === 'ar' ? ' ' : 'Pending')
                                            }
                                        </span>
                                    </div>
                                </LiquidGlassCard>
                            );
                        })}
                    </div>
                </LiquidGlassCard>
            )}
        </div>
    );
}

