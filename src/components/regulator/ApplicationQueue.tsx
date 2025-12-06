"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, CheckSquare, CheckCircle2, Users, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DemoEvent } from "@/context/demoSeed";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface Props {
    queueEvents: DemoEvent[];
    selectedEventId?: string;
    onSelectEvent?: (eventId: string) => void;
}

export default function ApplicationQueue({ queueEvents, selectedEventId, onSelectEvent }: Props) {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");
    const [showFilters, setShowFilters] = useState(false);

    const filteredEvents = useMemo(() => {
        let list = queueEvents.filter(e => e.status === "pending_review");

        if (searchTerm) {
            list = list.filter(e => {
                const title = (language === 'ar' ? e.titleAr : e.titleEn) ?? e.title ?? '';
                const organizer = (language === 'ar' ? e.organizerAr : e.organizerEn) ?? '';
                return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       e.sfda_license?.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        if (selectedSpecialty !== "all") {
            list = list.filter(e => (e.specialty ?? '').toLowerCase().includes(selectedSpecialty.toLowerCase()));
        }

        return [...list].sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
                case "submission":
                    return a.id.localeCompare(b.id);
                case "priority":
                    return (a.titleEn ?? '').includes('Conference') ? -1 : 1;
                default:
                    return 0;
            }
        });
    }, [queueEvents, searchTerm, selectedSpecialty, sortBy, language]);

    const handleSelectAll = () => {
        // Placeholder for future bulk operations
    };

    const specialties = [
        { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
        { id: 'cardiology', label: t('specialties.cardiology') },
        { id: 'pediatrics', label: t('specialties.pediatrics') },
        { id: 'generalsurgery', label: t('specialties.generalSurgery') },
        { id: 'familymedicine', label: t('specialties.familyMedicine') },
        { id: 'emergency', label: t('specialties.emergency') },
    ];

    const title = language === 'ar' ? 'قائمة التطبيقات' : 'Application Queue';
    const searchPlaceholder = language === 'ar' ? 'ابحث عن فعاليات...' : 'Search events...';
    const filtersText = language === 'ar' ? 'الفلاتر' : 'Filters';
    const sortByText = language === 'ar' ? 'ترتيب حسب' : 'Sort By';
    const pendingText = language === 'ar' ? 'فعاليات بانتظار المراجعة' : 'Events Pending Review';
    const selectAllText = language === 'ar' ? 'تحديد الكل' : 'Select All';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[var(--apple-blue)]" />
                    {title}
                </h2>

                {/* Search and Filters Bar */}
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <GlassButton
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {filtersText}
                        </GlassButton>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={sortByText} />
                            </SelectTrigger>
                            <SelectContent glass={true}>
                                <SelectItem value="date">{language === 'ar' ? 'تاريخ الفعالية' : 'Event Date'}</SelectItem>
                                <SelectItem value="submission">{language === 'ar' ? 'تاريخ التقديم' : 'Submission Date'}</SelectItem>
                                <SelectItem value="priority">{language === 'ar' ? 'الأولوية' : 'Priority'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="p-4 border border-[var(--separator)] rounded-ios space-y-4 bg-[var(--system-fill)]/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                                        {language === 'ar' ? 'التخصص' : 'Specialty'}
                                    </label>
                                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent glass={true}>
                                            {specialties.map(spec => (
                                                <SelectItem key={spec.id} value={spec.id}>
                                                    {spec.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bulk actions removed for API-driven queue */}
                </div>
            </LiquidGlassCard>

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {pendingText} ({filteredEvents.length})
                    </h3>
                    <GlassButton variant="outline" size="sm" onClick={handleSelectAll} className="gap-2 flex items-center justify-center">
                        <CheckSquare className="h-4 w-4" />
                        {selectAllText}
                    </GlassButton>
                </div>

                {filteredEvents.length === 0 ? (
                    <EmptyState
                        title={language === 'ar' ? 'لا توجد تطبيقات' : 'No Applications'}
                        description={language === 'ar' ? 'لا توجد فعاليات بانتظار المراجعة' : 'No events pending review'}
                        icon={FileText}
                    />
                ) : (
                    <div className="grid gap-4 grid-cols-1">
                        {filteredEvents.map((event) => {
                            const isSelected = selectedEventId === event.id;
                            const title = (language === 'ar' ? event.titleAr : event.titleEn) ?? event.title ?? 'Event';
                            const organizer = (language === 'ar' ? event.organizerAr : event.organizerEn) ?? 'Organizer';

                            return (
                                <div key={event.id} onClick={() => onSelectEvent?.(event.id)} className="cursor-pointer">
                                    <LiquidGlassCard
                                        blurIntensity="md"
                                        interactive={true}
                                        className={`p-4 transition-all ${
                                            isSelected ? 'ring-2 ring-[var(--apple-blue)] shadow-lg' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="text-base font-semibold text-[var(--label)] line-clamp-1">
                                                        {title}
                                                    </h4>
                                                    <Badge variant="outline" className="ml-2 capitalize flex-shrink-0">
                                                        {event.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--secondary-label)]">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        <span>{organizer}</span>
                                                    </div>
                                                    {event.date && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                                                        </div>
                                                    )}
                                                    {event.specialty && (
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            <span>{getSpecialtyLabel(event.specialty || '', language)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {event.sfda_license && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Badge variant="outline" className="gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            SFDA: {event.sfda_license}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            {event.cme_hours && event.cme_hours > 0 && (
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-xs text-[var(--secondary-label)]">
                                                        {language === 'ar' ? 'ساعات التعليم' : 'CME Hours'}
                                                    </div>
                                                    <div className="text-lg font-bold text-[var(--apple-blue)]">
                                                        {event.cme_hours}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </LiquidGlassCard>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

