"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePersona } from '@/context/PersonaContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

import { CheckCircle2, FileText, Upload, Send } from 'lucide-react';
import { getEventTitle } from '@/lib/eventTranslations';

interface PostEventProcessingProps {
    eventId: string;
}

export default function PostEventProcessing({ eventId }: PostEventProcessingProps) {
    const { language } = useLanguage();
    const { events } = usePersona();
    const [attendanceFinalized, setAttendanceFinalized] = useState(false);
    const [certificatesGenerated, setCertificatesGenerated] = useState(false);
    const [cmeHoursSubmitted, setCmeHoursSubmitted] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const event = events.find(e => e.id === eventId);

    // Mock data
    const finalAttendanceCount = 192;
    const certificatesCount = 192;
    const cmeHoursToSubmit = event?.cme_hours || 0;

    const handleFinalizeAttendance = () => {
        setAttendanceFinalized(true);
    };

    const handleGenerateCertificates = () => {
        setCertificatesGenerated(true);
    };

    const handleSubmitCMEHours = () => {
        setCmeHoursSubmitted(true);
    };

    const handleSubmitReport = () => {
        setReportSubmitted(true);
    };

    if (!event) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--secondary-label)]">
                    {language === 'ar' ? '  ' : 'Event not found'}
                </div>
            </LiquidGlassCard>
        );
    }

    const title = language === 'ar' ? '   ' : 'Post-Event Processing';
    const finalizeAttendanceText = language === 'ar' ? ' ' : 'Finalize Attendance';
    const generateCertificatesText = language === 'ar' ? ' ' : 'Generate Certificates';
    const submitCMEHoursText = language === 'ar' ? '  CME' : 'Submit CME Hours';
    const submitReportText = language === 'ar' ? ' ' : 'Submit Report';
    const completedText = language === 'ar' ? '' : 'Completed';

    const steps = [
        {
            id: 'attendance',
            title: finalizeAttendanceText,
            description: language === 'ar' ? '   ' : 'Finalize attendance list',
            completed: attendanceFinalized,
            value: finalAttendanceCount,
            action: handleFinalizeAttendance,
        },
        {
            id: 'certificates',
            title: generateCertificatesText,
            description: language === 'ar' ? '  ' : 'Generate attendance certificates',
            completed: certificatesGenerated,
            value: certificatesCount,
            action: handleGenerateCertificates,
            dependsOn: attendanceFinalized,
        },
        {
            id: 'cme',
            title: submitCMEHoursText,
            description: language === 'ar' ? '  CME  ' : 'Submit CME hours to organizer',
            completed: cmeHoursSubmitted,
            value: cmeHoursToSubmit,
            action: handleSubmitCMEHours,
            dependsOn: certificatesGenerated,
        },
        {
            id: 'report',
            title: submitReportText,
            description: language === 'ar' ? '  ' : 'Submit final report',
            completed: reportSubmitted,
            value: language === 'ar' ? ' PDF' : 'PDF Report',
            action: handleSubmitReport,
            dependsOn: cmeHoursSubmitted,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--label)]">{title}</h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {getEventTitle(event, language)}
                    </p>
                </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <LiquidGlassCard
                        key={step.id}
                        blurIntensity="lg"
                        interactive={false}
                        className={`p-6 ${step.completed ? 'border-2 border-[var(--apple-green)]' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    step.completed
                                        ? 'bg-[var(--apple-green)] text-white'
                                        : step.dependsOn === false
                                        ? 'bg-[var(--system-fill)] text-[var(--tertiary-label)]'
                                        : 'bg-[var(--apple-blue)] text-white'
                                }`}>
                                    {step.completed ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <span className="font-bold">{index + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[var(--secondary-label)] mb-2">
                                        {step.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-[var(--label)] font-medium">
                                            {typeof step.value === 'number' ? step.value : step.value}
                                        </span>
                                        {step.completed && (
                                            <span className="text-[var(--apple-green)] font-medium">
                                                {completedText}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {!step.completed && step.dependsOn !== false && (
                                    <GlassButton
                                        variant="default"
                                        size="sm"
                                        onClick={step.action}
                                     className="flex items-center justify-center gap-2">
                                        {step.id === 'attendance' ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {finalizeAttendanceText}
                                            </>
                                        ) : step.id === 'certificates' ? (
                                            <>
                                                <FileText className="w-4 h-4 mr-2" />
                                                {generateCertificatesText}
                                            </>
                                        ) : step.id === 'cme' ? (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                {submitCMEHoursText}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                {submitReportText}
                                            </>
                                        )}
                                    </GlassButton>
                                )}
                                {step.completed && (
                                    <div className="px-3 py-2 rounded-lg bg-[var(--apple-green)]/10 text-[var(--apple-green)] text-sm font-medium">
                                        {completedText}
                                    </div>
                                )}
                            </div>
                        </div>
                    </LiquidGlassCard>
                ))}
            </div>

            {/* Summary */}
            {reportSubmitted && (
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 border-2 border-[var(--apple-green)]">
                    <div className="text-center">
                        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[var(--apple-green)]" />
                        <h3 className="text-xl font-bold text-[var(--label)] mb-2">
                            {language === 'ar' ? '   ' : 'All Tasks Completed'}
                        </h3>
                        <p className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? '     ' : 'Final report has been submitted to organizer'}
                        </p>
                    </div>
                </LiquidGlassCard>
            )}
        </div>
    );
}

