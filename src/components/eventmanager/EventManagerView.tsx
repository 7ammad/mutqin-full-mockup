"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import MobileQRScanner from "./MobileQRScanner";
import AssignmentDashboard from "./AssignmentDashboard";
import EventBriefing from "./EventBriefing";
import RegistrationManagement from "./RegistrationManagement";
import LiveAttendanceDashboard from "./LiveAttendanceDashboard";
import SessionManagement from "./SessionManagement";
import PostEventProcessing from "./PostEventProcessing";
import CertificateGeneration from "./CertificateGeneration";
import Reporting from "./Reporting";
import { Calendar, Users, CheckCircle, FileText, Clock, QrCode, Briefcase, UserCheck, Activity, Settings, Award, FileText as FileTextIcon } from "lucide-react";
import { MOCK_EVENT_ASSIGNMENTS } from "@/lib/mockData";
import ExecutionFlow from "./ExecutionFlow";

type ViewType = 'ASSIGNMENTS' | 'BRIEFING' | 'REGISTRATION' | 'ATTENDANCE' | 'SESSIONS' | 'POST_EVENT' | 'CERTIFICATES' | 'REPORTING';

export default function EventManagerView() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [view, setView] = useState<ViewType>('ASSIGNMENTS');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [showQRScanner, setShowQRScanner] = useState(false);

    // Get assigned events
    const assignedEvents = events.filter(e => e.assignedToEventManager);
    const assignments = MOCK_EVENT_ASSIGNMENTS.filter(a => 
        assignedEvents.some(e => e.id === a.eventId)
    );

    // Calculate stats
    const activeAssignments = assignments.filter(a => a.status === 'Active').length;
    const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
    const completedAssignments = assignments.filter(a => a.status === 'Completed').length;

    return (
        <div className="space-y-6">
            <ExecutionFlow />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? 'المهام النشطة' : 'Active Assignments'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{activeAssignments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                            <Calendar className="w-6 h-6 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? 'في الانتظار' : 'Pending'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{pendingAssignments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                            <Clock className="w-6 h-6 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>

                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                {language === 'ar' ? 'مكتملة' : 'Completed'}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{completedAssignments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                            <CheckCircle className="w-6 h-6 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* View Tabs */}
            <div className="flex flex-wrap gap-2">
                <GlassButton
                    onClick={() => { setView('ASSIGNMENTS'); setSelectedEventId(null); }}
                    variant={view === 'ASSIGNMENTS' ? 'default' : 'outline'}
                    size="sm"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'المهام' : 'Assignments'}
                </GlassButton>
                {selectedEventId && (
                    <>
                        <GlassButton
                            onClick={() => setView('BRIEFING')}
                            variant={view === 'BRIEFING' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'الملخص' : 'Briefing'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('REGISTRATION')}
                            variant={view === 'REGISTRATION' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'التسجيلات' : 'Registration'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('ATTENDANCE')}
                            variant={view === 'ATTENDANCE' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'الحضور' : 'Attendance'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('SESSIONS')}
                            variant={view === 'SESSIONS' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'الجلسات' : 'Sessions'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('POST_EVENT')}
                            variant={view === 'POST_EVENT' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'ما بعد الفعالية' : 'Post-Event'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('CERTIFICATES')}
                            variant={view === 'CERTIFICATES' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Award className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'الشهادات' : 'Certificates'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setView('REPORTING')}
                            variant={view === 'REPORTING' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <FileTextIcon className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'التقارير' : 'Reporting'}
                        </GlassButton>
                    </>
                )}
            </div>

            {/* Content */}
            {view === 'ASSIGNMENTS' && (
                <AssignmentDashboard />
            )}

            {view === 'ASSIGNMENTS' && selectedEventId === null && (
                <div className="space-y-4">
                    {assignments.length === 0 ? (
                        <LiquidGlassCard blurIntensity="lg" interactive={false}>
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-4 text-[var(--secondary-label)]" />
                                <p className="text-[var(--secondary-label)]">
                                    {language === 'ar' 
                                        ? 'لا توجد مهام معينة حالياً' 
                                        : 'No assignments at the moment'}
                                </p>
                            </div>
                        </LiquidGlassCard>
                    ) : (
                        assignments.map((assignment) => {
                            const event = events.find(e => e.id === assignment.eventId);
                            if (!event) return null;

                            return (
                                <LiquidGlassCard key={assignment.id} blurIntensity="lg" interactive={true}>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                                                    {language === 'ar' ? event.titleAr : event.titleEn}
                                                </h3>
                                                <p className="text-sm text-[var(--secondary-label)]">
                                                    {language === 'ar' ? event.organizerAr : event.organizerEn}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                assignment.status === 'Active' 
                                                    ? 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]'
                                                    : assignment.status === 'Pending'
                                                    ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]'
                                                    : 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]'
                                            }`}>
                                                {assignment.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                    {language === 'ar' ? 'التاريخ' : 'Date'}
                                                </p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                    {language === 'ar' ? 'المكان' : 'Location'}
                                                </p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {language === 'ar' ? event.locationAr : event.locationEn}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                    {language === 'ar' ? 'ساعات التعليم' : 'CME Hours'}
                                                </p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {event.cme_hours}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--secondary-label)] mb-1">
                                                    {language === 'ar' ? 'الرسوم المتفق عليها' : 'Agreed Fee'}
                                                </p>
                                                <p className="text-sm font-medium text-[var(--label)]">
                                                    {assignment.agreedFee ? `SAR ${assignment.agreedFee.toLocaleString()}` : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <GlassButton 
                                                variant="default" 
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEventId(assignment.eventId);
                                                    setView('BRIEFING');
                                                }}
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                            </GlassButton>
                                            {assignment.status === 'Active' && (
                                                <GlassButton
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => setShowQRScanner(true)}
                                                >
                                                    <QrCode className="w-4 h-4 mr-2" />
                                                    {language === 'ar' ? 'بدء تسجيل الحضور' : 'Start Check-in'}
                                                </GlassButton>
                                            )}
                                            {assignment.status === 'Pending' && (
                                                <GlassButton variant="outline" size="sm">
                                                    {language === 'ar' ? 'قبول' : 'Accept'}
                                                </GlassButton>
                                            )}
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            );
                        })
                    )}
                </div>
            )}

            {view === 'BRIEFING' && selectedEventId && (
                <EventBriefing eventId={selectedEventId} />
            )}

            {view === 'REGISTRATION' && selectedEventId && (
                <RegistrationManagement eventId={selectedEventId} />
            )}

            {view === 'ATTENDANCE' && selectedEventId && (
                <LiveAttendanceDashboard eventId={selectedEventId} />
            )}

            {view === 'SESSIONS' && selectedEventId && (
                <SessionManagement eventId={selectedEventId} />
            )}

            {view === 'POST_EVENT' && selectedEventId && (
                <PostEventProcessing eventId={selectedEventId} />
            )}

            {view === 'CERTIFICATES' && selectedEventId && (
                <CertificateGeneration eventId={selectedEventId} />
            )}

            {view === 'REPORTING' && selectedEventId && (
                <Reporting eventId={selectedEventId} />
            )}

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <MobileQRScanner
                    onScan={(result) => {
                        console.log('Scanned:', result);
                        setShowQRScanner(false);
                        // Handle check-in logic here
                    }}
                    onClose={() => setShowQRScanner(false)}
                    eventId={selectedEventId || undefined}
                />
            )}
        </div>
    );
}

