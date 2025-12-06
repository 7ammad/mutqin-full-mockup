"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, BarChart3, ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { Chart } from "@/components/shared/Chart";

interface ComplianceIssue {
    id: string;
    eventId: string;
    type: 'late-registration' | 'missing-documentation' | 'violation' | 'expired-license';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    descriptionAr: string;
    status: 'open' | 'in-progress' | 'resolved';
    reportedDate: string;
    resolvedDate?: string;
}

export default function ComplianceMonitoring() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterSeverity, setFilterSeverity] = useState<string>("all");

    // Mock compliance issues
    const [complianceIssues] = useState<ComplianceIssue[]>([
        {
            id: 'issue1',
            eventId: '1',
            type: 'late-registration',
            severity: 'medium',
            description: 'CME hours not registered within 21-day window',
            descriptionAr: '      21 ',
            status: 'open',
            reportedDate: '2025-01-10',
        },
        {
            id: 'issue2',
            eventId: '2',
            type: 'missing-documentation',
            severity: 'low',
            description: 'Missing attendance records',
            descriptionAr: '  ',
            status: 'in-progress',
            reportedDate: '2025-01-15',
        },
        {
            id: 'issue3',
            eventId: '3',
            type: 'expired-license',
            severity: 'high',
            description: 'SFDA license expired',
            descriptionAr: '  ',
            status: 'open',
            reportedDate: '2025-01-20',
        },
    ]);

    let filteredIssues = complianceIssues;

    if (filterStatus !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.status === filterStatus);
    }

    if (filterSeverity !== 'all') {
        filteredIssues = filteredIssues.filter(i => i.severity === filterSeverity);
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-[var(--apple-red)]/10 text-[var(--apple-red)] border-[var(--apple-red)]/20';
            case 'high':
                return 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/20';
            case 'medium':
                return 'bg-[var(--apple-yellow)]/10 text-[var(--apple-yellow)] border-[var(--apple-yellow)]/20';
            default:
                return 'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)] border-[var(--secondary-label)]/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]';
            case 'in-progress':
                return 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]';
            default:
                return 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]';
        }
    };

    const stats = {
        totalIssues: complianceIssues.length,
        openIssues: complianceIssues.filter(i => i.status === 'open').length,
        resolvedIssues: complianceIssues.filter(i => i.status === 'resolved').length,
        criticalIssues: complianceIssues.filter(i => i.severity === 'critical').length,
    };

    const complianceTrend = [
        { month: language === 'ar' ? '' : 'Jan', issues: 12, resolved: 10 },
        { month: language === 'ar' ? '' : 'Feb', issues: 15, resolved: 12 },
        { month: language === 'ar' ? '' : 'Mar', issues: 10, resolved: 9 },
        { month: language === 'ar' ? '' : 'Apr', issues: 8, resolved: 7 },
    ];

    const issueTypeDistribution = [
        { name: language === 'ar' ? ' ' : 'Late Registration', value: 5 },
        { name: language === 'ar' ? ' ' : 'Missing Documentation', value: 3 },
        { name: language === 'ar' ? '' : 'Violation', value: 2 },
        { name: language === 'ar' ? ' ' : 'Expired License', value: 1 },
    ];

    const title = language === 'ar' ? ' ' : 'Compliance Monitoring';
    const totalIssuesText = language === 'ar' ? ' ' : 'Total Issues';
    const openIssuesText = language === 'ar' ? ' ' : 'Open Issues';
    const resolvedIssuesText = language === 'ar' ? ' ' : 'Resolved Issues';
    const criticalIssuesText = language === 'ar' ? ' ' : 'Critical Issues';
    const filterByStatusText = language === 'ar' ? '  ' : 'Filter by Status';
    const filterBySeverityText = language === 'ar' ? '  ' : 'Filter by Severity';

    const reportedText = language === 'ar' ? ' ' : 'Reported';
    const complianceTrendText = language === 'ar' ? ' ' : 'Compliance Trend';
    const issueDistributionText = language === 'ar' ? ' ' : 'Issue Distribution';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-[var(--apple-blue)]" />
                    {title}
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <FileText className="h-6 w-6 text-[var(--apple-blue)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{totalIssuesText}</p>
                        <p className="text-2xl font-bold text-[var(--label)]">{stats.totalIssues}</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <AlertTriangle className="h-6 w-6 text-[var(--apple-orange)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{openIssuesText}</p>
                        <p className="text-2xl font-bold text-[var(--label)]">{stats.openIssues}</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <CheckCircle2 className="h-6 w-6 text-[var(--apple-green)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{resolvedIssuesText}</p>
                        <p className="text-2xl font-bold text-[var(--label)]">{stats.resolvedIssues}</p>
                    </div>
                    <div className="bg-[var(--system-fill)] p-4 rounded-ios text-center">
                        <ShieldCheck className="h-6 w-6 text-[var(--apple-red)] mx-auto mb-2" />
                        <p className="text-xs text-[var(--secondary-label)] mb-1">{criticalIssuesText}</p>
                        <p className="text-2xl font-bold text-[var(--label)]">{stats.criticalIssues}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={filterByStatusText} />
                        </SelectTrigger>
                        <SelectContent glass={true}>
                            <SelectItem value="all">{language === 'ar' ? '' : 'All'}</SelectItem>
                            <SelectItem value="open">{language === 'ar' ? '' : 'Open'}</SelectItem>
                            <SelectItem value="in-progress">{language === 'ar' ? ' ' : 'In Progress'}</SelectItem>
                            <SelectItem value="resolved">{language === 'ar' ? '' : 'Resolved'}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={filterBySeverityText} />
                        </SelectTrigger>
                        <SelectContent glass={true}>
                            <SelectItem value="all">{language === 'ar' ? '' : 'All'}</SelectItem>
                            <SelectItem value="critical">{language === 'ar' ? '' : 'Critical'}</SelectItem>
                            <SelectItem value="high">{language === 'ar' ? '' : 'High'}</SelectItem>
                            <SelectItem value="medium">{language === 'ar' ? '' : 'Medium'}</SelectItem>
                            <SelectItem value="low">{language === 'ar' ? '' : 'Low'}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {filteredIssues.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-[var(--tertiary-label)]" />
                            <p className="text-[var(--secondary-label)]">
                                {language === 'ar' ? '  ' : 'No issues found'}
                            </p>
                        </div>
                    ) : (
                        filteredIssues.map((issue) => {
                            const event = events.find(e => e.id === issue.eventId);
                            if (!event) return null;

                            return (
                                <LiquidGlassCard key={issue.id} blurIntensity="lg" interactive={true} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--label)] mb-1">
                                                {getEventTitle(event, language)}
                                            </h3>
                                            <p className="text-sm text-[var(--secondary-label)] mb-2">
                                                {language === 'ar' ? issue.descriptionAr : issue.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-[var(--tertiary-label)]">
                                                <span>{getEventOrganizer(event, language)}</span>
                                                <span>•</span>
                                                <span>
                                                    {reportedText}: {new Date(issue.reportedDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                                                {issue.severity}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                                                {issue.status === 'resolved' 
                                                    ? (language === 'ar' ? '' : 'Resolved')
                                                    : issue.status === 'in-progress'
                                                    ? (language === 'ar' ? ' ' : 'In Progress')
                                                    : (language === 'ar' ? '' : 'Open')
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            );
                        })
                    )}
                </div>
            </LiquidGlassCard>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {complianceTrendText}
                    </h3>
                    <Chart
                        type="line"
                        data={complianceTrend.map(t => ({ month: t.month, issues: t.issues, resolved: t.resolved }))}
                        dataKey="issues"
                        nameKey="month"
                        height={250}
                        colors={['var(--apple-orange)', 'var(--apple-green)']}
                    />
                </LiquidGlassCard>
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        {issueDistributionText}
                    </h3>
                    <Chart
                        type="pie"
                        data={issueTypeDistribution}
                        dataKey="value"
                        nameKey="name"
                        height={250}
                    />
                </LiquidGlassCard>
            </div>
        </div>
    );
}

