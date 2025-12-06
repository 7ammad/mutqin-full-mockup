"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Badge } from '@/components/ui/badge';
import { GlassButton } from '@/components/ui/glass-button';
import { getOrganizerCompliance, getState } from '@/context/demoStore';
import type { DemoEvent } from '@/context/demoSeed';
import { ClipboardList, Users, Clock, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface ExecutionTabProps {
    event: DemoEvent;
}

export default function ExecutionTab({ event }: ExecutionTabProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const state = getState();

    // Get compliance data for this event
    const complianceData = useMemo(() => {
        const compliance = getOrganizerCompliance("org-1");
        return compliance.find((c) => c.activityId === event.id);
    }, [event.id]);

    // Get assignment for this event
    const assignment = useMemo(() => {
        return state.assignments.find((a) => a.eventId === event.id);
    }, [event.id, state.assignments]);

    // Get tickets and attendance records
    const eventTickets = useMemo(() => {
        return state.tickets.filter((t) => t.eventId === event.id);
    }, [event.id, state.tickets]);

    const attendanceRecords = useMemo(() => {
        return state.attendanceRecords.filter((a) =>
            eventTickets.some((t) => t.id === a.ticketId)
        );
    }, [eventTickets, state.attendanceRecords]);

    const handleViewEventManager = () => {
        if (assignment?.eventManagerId) {
            router.push(`/dashboard/event-manager/events/${event.id}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Event Manager Assignment */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? '  ' : 'Event Manager Assignment'}
                </h3>
                <div className="space-y-3">
                    {assignment ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--secondary-label)]">
                                    {language === 'ar' ? ' ' : 'Event Manager'}
                                </span>
                                <Badge
                                    className={
                                        assignment.status === 'accepted'
                                            ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                            : assignment.status === 'pending'
                                            ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30'
                                            : 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]'
                                    }
                                >
                                    {assignment.status === 'accepted'
                                        ? language === 'ar' ? '' : 'Accepted'
                                        : assignment.status === 'pending'
                                        ? language === 'ar' ? ' ' : 'Pending'
                                        : language === 'ar' ? '' : 'Declined'}
                                </Badge>
                            </div>
                            {assignment.eventManagerId && (
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewEventManager}
                                    className="w-full justify-between"
                                >
                                    <span className="text-sm">
                                        {language === 'ar' ? '   ' : 'View Event Manager Dashboard'}
                                    </span>
                                    <ExternalLink className="h-4 w-4" />
                                </GlassButton>
                            )}
                        </>
                    ) : (
                        <div className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? '    ' : 'No Event Manager assigned'}
                        </div>
                    )}
                </div>
            </LiquidGlassCard>

            {/* Attendance Records Status */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    {language === 'ar' ? ' ' : 'Attendance Records'}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? '' : 'Status'}
                        </span>
                        <Badge
                            className={
                                complianceData?.attendanceRecords.status === 'submitted'
                                    ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                    : complianceData?.attendanceRecords.status === 'overdue'
                                    ? 'bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/30'
                                    : 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]'
                            }
                        >
                            {complianceData?.attendanceRecords.status === 'submitted'
                                ? language === 'ar' ? '' : 'Submitted'
                                : complianceData?.attendanceRecords.status === 'overdue'
                                ? language === 'ar' ? '' : 'Overdue'
                                : language === 'ar' ? ' ' : 'Not Started'}
                        </Badge>
                    </div>
                    {complianceData?.attendanceRecords.dueAt && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' ? ' ' : 'Due Date'}
                            </span>
                            <span className="text-sm font-medium text-[var(--label)]">
                                {new Date(complianceData.attendanceRecords.dueAt).toLocaleDateString(
                                    language === 'ar' ? 'ar-SA' : 'en-US'
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? ' ' : 'Record Count'}
                        </span>
                        <span className="text-sm font-medium text-[var(--label)]">
                            {attendanceRecords.length} / {eventTickets.length}
                        </span>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Hours Registration Status */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {language === 'ar' ? ' ' : 'Hours Registration'}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? '' : 'Status'}
                        </span>
                        <Badge
                            className={
                                complianceData?.hoursRegistration.status === 'submitted'
                                    ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                    : complianceData?.hoursRegistration.status === 'overdue'
                                    ? 'bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/30'
                                    : 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]'
                            }
                        >
                            {complianceData?.hoursRegistration.status === 'submitted'
                                ? language === 'ar' ? '' : 'Submitted'
                                : complianceData?.hoursRegistration.status === 'overdue'
                                ? language === 'ar' ? '' : 'Overdue'
                                : language === 'ar' ? ' ' : 'Not Started'}
                        </Badge>
                    </div>
                    {complianceData?.hoursRegistration.dueAt && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' ? ' ' : 'Due Date'}
                            </span>
                            <span className="text-sm font-medium text-[var(--label)]">
                                {new Date(complianceData.hoursRegistration.dueAt).toLocaleDateString(
                                    language === 'ar' ? 'ar-SA' : 'en-US'
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

