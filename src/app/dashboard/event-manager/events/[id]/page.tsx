"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Calendar, MapPin, Clock, Users, Activity, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';
import { useToast } from '@/components/ui/toast-context';
import type { DemoEvent } from '@/context/demoSeed';
import type { GetAssignmentByIdResponse } from '@/lib/api/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventManagerOpsOverviewPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [assignment, setAssignment] = useState<GetAssignmentByIdResponse['assignment'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Data layer works immediately, no MSW waiting needed
                // Fetch event
                const eventRes = await api.getEventById({ eventId: id });
                setEvent(eventRes.event);
                
                // Try to fetch assignment for this event
                try {
                    const assignmentsRes = await api.getEventManagerAssignments({ eventManagerId: "em-1" });
                    const eventAssignment = assignmentsRes.assignments.find(a => a.event.id === id);
                    if (eventAssignment) {
                        const assignmentRes = await api.getAssignmentById({ assignmentId: eventAssignment.assignment.id });
                        setAssignment(assignmentRes.assignment);
                    }
                } catch {
                    // Assignment not found is OK - event might not be assigned yet
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load event';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <LoadingSkeleton variant="card" />;
    }

    if (error) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--apple-red)]">
                    {error}
                </div>
            </LiquidGlassCard>
        );
    }

    if (!event) {
        notFound();
    }

    const eventTitle = language === 'ar' ? (event.titleAr || event.title) : (event.titleEn || event.title);
    const eventDate = event.date ? new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '-';
    const eventLocation = language === 'ar' ? (event.locationAr || event.locationEn) : (event.locationEn || event.locationAr);
    const assignmentStatus = assignment?.status || 'pending';
    const assignmentStatusLabel = assignmentStatus === 'accepted' 
        ? (language === 'ar' ? 'مقبول' : 'Accepted')
        : assignmentStatus === 'declined'
        ? (language === 'ar' ? 'مرفوض' : 'Declined')
        : (language === 'ar' ? 'قيد الانتظار' : 'Pending');

    return (
        <div className="max-w-6xl mx-auto space-y-6">
                {/* Title Area */}
                <div className="space-y-2">
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(buildRoute.eventManagerTab('assignments'))}
                        className="gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'ar' ? 'رجوع' : 'Back to Assignments'}
                    </GlassButton>
                    <h1 className="text-xl font-semibold text-[var(--label)]">
                        {language === 'ar' ? 'نظرة عامة على العمليات' : 'Operations Overview'}
                    </h1>
                    <h2 className="text-2xl font-bold text-[var(--label)]">
                        {eventTitle}
                    </h2>
                </div>

                {/* Event Meta */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'التاريخ' : 'Date'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{eventDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'الموقع' : 'Location'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{eventLocation || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[var(--secondary-label)]" />
                            <div>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'ساعات التعليم' : 'CME Hours'}
                                </p>
                                <p className="text-sm font-medium text-[var(--label)]">{event.cme_hours || '-'}</p>
                            </div>
                        </div>
                    </div>
                </LiquidGlassCard>

                {/* Assignment Status */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? 'حالة التكليف' : 'Assignment Status'}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                assignmentStatus === 'accepted'
                                    ? 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]'
                                    : assignmentStatus === 'declined'
                                    ? 'bg-[var(--apple-red)]/10 text-[var(--apple-red)]'
                                    : 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                            }`}>
                                {assignmentStatusLabel}
                            </div>
                        </div>
                        {assignment && assignment.status === 'pending' && (
                            <div className="flex gap-2">
                                <GlassButton
                                    variant="default"
                                    size="sm"
                                    onClick={async () => {
                                        try {
                                            await api.respondAssignment({ assignmentId: assignment.id, decision: 'accept' });
                                            // Refresh assignment data
                                            const assignmentsRes = await api.getEventManagerAssignments({ eventManagerId: "em-1" });
                                            const eventAssignment = assignmentsRes.assignments.find(a => a.event.id === id);
                                            if (eventAssignment) {
                                                const assignmentRes = await api.getAssignmentById({ assignmentId: eventAssignment.assignment.id });
                                                setAssignment(assignmentRes.assignment);
                                            }
                                            showToast(
                                                language === 'ar' ? 'تم قبول التكليف' : 'Assignment accepted',
                                                'success'
                                            );
                                        } catch (err) {
                                            const message = err instanceof Error ? err.message : (language === 'ar' ? 'فشل قبول التكليف' : 'Failed to accept assignment');
                                            showToast(message, 'info');
                                        }
                                    }}
                                    className="gap-2"
                                >
                                    {language === 'ar' ? 'قبول' : 'Accept'}
                                </GlassButton>
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                        try {
                                            await api.respondAssignment({ assignmentId: assignment.id, decision: 'decline' });
                                            // Refresh assignment data
                                            const assignmentsRes = await api.getEventManagerAssignments({ eventManagerId: "em-1" });
                                            const eventAssignment = assignmentsRes.assignments.find(a => a.event.id === id);
                                            if (eventAssignment) {
                                                const assignmentRes = await api.getAssignmentById({ assignmentId: eventAssignment.assignment.id });
                                                setAssignment(assignmentRes.assignment);
                                            }
                                            showToast(
                                                language === 'ar' ? 'تم رفض التكليف' : 'Assignment declined',
                                                'success'
                                            );
                                        } catch (err) {
                                            const message = err instanceof Error ? err.message : (language === 'ar' ? 'فشل رفض التكليف' : 'Failed to decline assignment');
                                            showToast(message, 'info');
                                        }
                                    }}
                                    className="gap-2"
                                >
                                    {language === 'ar' ? 'رفض' : 'Decline'}
                                </GlassButton>
                            </div>
                        )}
                    </div>
                </LiquidGlassCard>

                {/* Quick Actions */}
                <LiquidGlassCard blurIntensity="lg" className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <GlassButton
                            variant="default"
                            onClick={() => router.push(buildRoute.eventManagerEventCheckin(id))}
                            className="gap-2 flex items-center justify-center"
                        >
                            <Activity className="w-4 h-4" />
                            {language === 'ar' ? 'فتح تسجيل الوصول' : 'Open Check-In'}
                        </GlassButton>
                        <GlassButton
                            variant="outline"
                            onClick={() => router.push(buildRoute.eventManagerEventAttendance(id))}
                            className="gap-2 flex items-center justify-center"
                        >
                            <Users className="w-4 h-4" />
                            {language === 'ar' ? 'سجل الحضور' : 'Attendance Ledger'}
                        </GlassButton>
                        <GlassButton
                            variant="outline"
                            onClick={() => router.push(buildRoute.eventManagerEventHandover(id))}
                            className="gap-2 flex items-center justify-center"
                        >
                            <FileText className="w-4 h-4" />
                            {language === 'ar' ? 'حزمة التسليم' : 'Handover Pack'}
                        </GlassButton>
                    </div>
                </LiquidGlassCard>

                {/* Demo Stub Notice */}
                {!assignment && (
                    <LiquidGlassCard blurIntensity="lg" className="p-6 border-2 border-[var(--apple-orange)]/20">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[var(--apple-orange)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-[var(--label)] mb-1">
                                    {language === 'ar' ? 'ملاحظة: بيانات تجريبية' : 'Note: Demo Data'}
                                </p>
                                <p className="text-xs text-[var(--secondary-label)]">
                                    {language === 'ar' 
                                        ? 'هذه الصفحة تستخدم بيانات تجريبية. سيتم ربط البيانات الفعلية قريباً.'
                                        : 'This page uses demo data. Real data integration coming soon.'}
                                </p>
                            </div>
                        </div>
                    </LiquidGlassCard>
                )}
            </div>
    );
}
