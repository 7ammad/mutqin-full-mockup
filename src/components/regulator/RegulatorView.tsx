"use client";

import { useState } from "react";
// import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { GlassButton } from "@/components/ui/glass-button";
import { BarChart3, Users, Clock, FileText, ClipboardCheck, Gavel, ShieldCheck, Search } from "lucide-react";
import ApplicationQueue from "./ApplicationQueue";
import ReviewWorkflow from "./ReviewWorkflow";
import StandardsChecklist from "./StandardsChecklist";
import DecisionManagement from "./DecisionManagement";
import ComplianceMonitoring from "./ComplianceMonitoring";
import NationalAnalytics from "./NationalAnalytics";
import AuditTools from "./AuditTools";
import { AccreditationPanel } from "./AccreditationPanel";

type ViewType = 'QUEUE' | 'WORKFLOW' | 'CHECKLIST' | 'DECISION' | 'COMPLIANCE' | 'ANALYTICS' | 'AUDIT';

export default function RegulatorView() {
    const { language } = useLanguage();
    const [view, setView] = useState<ViewType>('QUEUE');

    const queueText = language === 'ar' ? 'قائمة التطبيقات' : 'Application Queue';
    const workflowText = language === 'ar' ? 'سير العمل' : 'Workflow';
    const checklistText = language === 'ar' ? 'قائمة المعايير' : 'Standards';
    const decisionText = language === 'ar' ? 'القرارات' : 'Decisions';
    const complianceText = language === 'ar' ? 'الامتثال' : 'Compliance';
    const analyticsText = language === 'ar' ? 'التحليلات' : 'Analytics';
    const auditText = language === 'ar' ? 'التدقيق' : 'Audit';

    return (
        <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
                <GlassButton
                    onClick={() => setView('QUEUE')}
                    variant={view === 'QUEUE' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <FileText className="h-4 w-4" />
                    {queueText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('WORKFLOW')}
                    variant={view === 'WORKFLOW' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Clock className="h-4 w-4" />
                    {workflowText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('CHECKLIST')}
                    variant={view === 'CHECKLIST' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <ClipboardCheck className="h-4 w-4" />
                    {checklistText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('DECISION')}
                    variant={view === 'DECISION' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Gavel className="h-4 w-4" />
                    {decisionText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('COMPLIANCE')}
                    variant={view === 'COMPLIANCE' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <ShieldCheck className="h-4 w-4" />
                    {complianceText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('ANALYTICS')}
                    variant={view === 'ANALYTICS' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <BarChart3 className="h-4 w-4" />
                    {analyticsText}
                </GlassButton>
                <GlassButton
                    onClick={() => setView('AUDIT')}
                    variant={view === 'AUDIT' ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    <Search className="h-4 w-4" />
                    {auditText}
                </GlassButton>
            </div>

            {/* Content Views */}
            {view === 'QUEUE' && (
                <>
                    <ApplicationQueue />
                    <AccreditationPanel eventId="evt-1" initialStatus="pending_review" />
                </>
            )}
            {view === 'WORKFLOW' && <ReviewWorkflow />}
            {view === 'CHECKLIST' && <StandardsChecklist />}
            {view === 'DECISION' && <DecisionManagement />}
            {view === 'COMPLIANCE' && <ComplianceMonitoring />}
            {view === 'ANALYTICS' && <NationalAnalytics />}
            {view === 'AUDIT' && <AuditTools />}
        </div>
    );
}
