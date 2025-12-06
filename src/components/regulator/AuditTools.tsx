"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, MessageSquare, FileText, Search, Calendar, User, Download } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";

interface AuditRecord {
    id: string;
    eventId: string;
    auditType: 'random' | 'targeted' | 'complaint-based';
    auditor: string;
    auditDate: string;
    findings: string;
    findingsAr: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    reportUrl?: string;
}

export default function AuditTools() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [auditType, setAuditType] = useState<'random' | 'targeted' | 'complaint-based'>('random');
    const [auditNotes, setAuditNotes] = useState<string>("");

    // Mock audit records
    const [auditRecords] = useState<AuditRecord[]>([
        {
            id: 'audit1',
            eventId: '1',
            auditType: 'random',
            auditor: language === 'ar' ? 'د. خالد الفهد' : 'Dr. Khalid Al-Fahd',
            auditDate: '2025-01-15',
            findings: 'All documentation verified. Event compliant.',
            findingsAr: 'تم التحقق من جميع الوثائق. الفعالية متوافقة.',
            status: 'completed',
        },
        {
            id: 'audit2',
            eventId: '2',
            auditType: 'targeted',
            auditor: language === 'ar' ? 'د. فاطمة الزهراء' : 'Dr. Fatima Al-Zahra',
            auditDate: '2025-01-20',
            findings: 'Minor documentation issues found. Corrective action required.',
            findingsAr: 'تم العثور على مشاكل وثائقية طفيفة. إجراء تصحيحي مطلوب.',
            status: 'in-progress',
        },
    ]);

    let filteredRecords = auditRecords;

    if (searchTerm) {
        filteredRecords = filteredRecords.filter(record => {
            const event = events.find(e => e.id === record.eventId);
            if (!event) return false;
            return getEventTitle(event, language).toLowerCase().includes(searchTerm.toLowerCase()) ||
                   getEventOrganizer(event, language).toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    if (filterType !== 'all') {
        filteredRecords = filteredRecords.filter(r => r.auditType === filterType);
    }

    if (filterStatus !== 'all') {
        filteredRecords = filteredRecords.filter(r => r.status === filterStatus);
    }

    const handleScheduleAudit = () => {
        if (!selectedEventId || !auditType) {
            alert(language === 'ar' ? 'يرجى اختيار فعالية ونوع التدقيق' : 'Please select an event and audit type');
            return;
        }

        alert(language === 'ar' ? 'تم جدولة التدقيق' : 'Audit scheduled');
        setSelectedEventId(null);
        setAuditNotes("");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-[var(--apple-green)]/10 text-[var(--apple-green)]';
            case 'in-progress':
                return 'bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]';
            case 'scheduled':
                return 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]';
            default:
                return 'bg-[var(--secondary-label)]/10 text-[var(--secondary-label)]';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'random':
                return language === 'ar' ? 'عشوائي' : 'Random';
            case 'targeted':
                return language === 'ar' ? 'موجه' : 'Targeted';
            case 'complaint-based':
                return language === 'ar' ? 'بناءً على شكوى' : 'Complaint-Based';
            default:
                return type;
        }
    };


    const downloadReportText = language === 'ar' ? 'تحميل التقرير' : 'Download Report';
    const scheduleAuditText = language === 'ar' ? 'جدولة تدقيق جديد' : 'Schedule New Audit';
    const selectEventText = language === 'ar' ? 'اختر الفعالية' : 'Select Event';
    const auditTypeText = language === 'ar' ? 'نوع التدقيق' : 'Audit Type';
    const notesText = language === 'ar' ? 'ملاحظات' : 'Notes';
    const scheduleText = language === 'ar' ? 'جدولة' : 'Schedule';
    const auditHistoryText = language === 'ar' ? 'سجل التدقيق' : 'Audit History';
    const searchPlaceholder = language === 'ar' ? 'ابحث في سجل التدقيق...' : 'Search audit history...';
    const filterByTypeText = language === 'ar' ? 'فلترة حسب النوع' : 'Filter by Type';
    const filterByStatusText = language === 'ar' ? 'فلترة حسب الحالة' : 'Filter by Status';

    return (
        <div className="space-y-6">
            {/* Schedule New Audit */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                    {scheduleAuditText}
                </h2>

                <div className="space-y-4">
                    <div>
                        <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                            {selectEventText}
                        </Label>
                        <Select value={selectedEventId || ''} onValueChange={setSelectedEventId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={selectEventText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                {events.filter(e => e.status === 'Published' || e.status === 'Completed').map(event => (
                                    <SelectItem key={event.id} value={event.id}>
                                        {getEventTitle(event, language)} - {getEventOrganizer(event, language)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                            {auditTypeText}
                        </Label>
                        <Select value={auditType} onValueChange={(val) => setAuditType(val as AuditRecord['auditType'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="random">{language === 'ar' ? 'عشوائي' : 'Random'}</SelectItem>
                                <SelectItem value="targeted">{language === 'ar' ? 'موجه' : 'Targeted'}</SelectItem>
                                <SelectItem value="complaint-based">{language === 'ar' ? 'بناءً على شكوى' : 'Complaint-Based'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-base font-medium text-[var(--label)] mb-2 block">
                            {notesText}
                        </Label>
                        <Textarea
                            value={auditNotes}
                            onChange={(e) => setAuditNotes(e.target.value)}
                            placeholder={language === 'ar' ? 'أضف ملاحظات للتدقيق...' : 'Add audit notes...'}
                            rows={3}
                        />
                    </div>

                    <GlassButton onClick={handleScheduleAudit} className="w-full gap-2 flex items-center justify-center">
                        <Calendar className="h-4 w-4" />
                        {scheduleText}
                    </GlassButton>
                </div>
            </LiquidGlassCard>

            {/* Audit History */}
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--label)] flex items-center gap-2">
                        <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                        {auditHistoryText}
                    </h2>
                    <div className="flex gap-3">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={filterByTypeText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                                <SelectItem value="random">{language === 'ar' ? 'عشوائي' : 'Random'}</SelectItem>
                                <SelectItem value="targeted">{language === 'ar' ? 'موجه' : 'Targeted'}</SelectItem>
                                <SelectItem value="complaint-based">{language === 'ar' ? 'بناءً على شكوى' : 'Complaint-Based'}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder={filterByStatusText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                                <SelectItem value="scheduled">{language === 'ar' ? 'مجدول' : 'Scheduled'}</SelectItem>
                                <SelectItem value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                                <SelectItem value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredRecords.length === 0 ? (
                        <EmptyState
                            title={language === 'ar' ? 'لا توجد سجلات' : 'No Records'}
                            description={language === 'ar' ? 'لا توجد سجلات تدقيق' : 'No audit records found'}
                            icon={FileText}
                        />
                    ) : (
                        filteredRecords.map((record) => {
                            const event = events.find(e => e.id === record.eventId);
                            if (!event) return null;

                            return (
                                <LiquidGlassCard key={record.id} blurIntensity="lg" interactive={true} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--label)] mb-1">
                                                {getEventTitle(event, language)}
                                            </h3>
                                            <p className="text-sm text-[var(--secondary-label)] mb-2">
                                                {language === 'ar' ? record.findingsAr : record.findings}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-[var(--tertiary-label)]">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {record.auditor}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(record.auditDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {getTypeLabel(record.auditType)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                {record.status === 'completed' 
                                                    ? (language === 'ar' ? 'مكتمل' : 'Completed')
                                                    : record.status === 'in-progress'
                                                    ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress')
                                                    : record.status === 'scheduled'
                                                    ? (language === 'ar' ? 'مجدول' : 'Scheduled')
                                                    : (language === 'ar' ? 'ملغى' : 'Cancelled')
                                                }
                                            </span>
                                            {record.reportUrl && (
                                                <GlassButton variant="outline" size="sm" className="gap-1 flex items-center justify-center">
                                                    <Download className="h-3 w-3" />
                                                    {downloadReportText}
                                                </GlassButton>
                                            )}
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            );
                        })
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

