"use client";

import { useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import EventCard from "@/components/EventCard";
import { AlertCircle, MessageSquare, FileText, Search, Filter, CheckSquare, CheckCircle2 } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ApplicationQueue() {
    const { events, approveEvent } = usePersona();
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    // Filter pending events
    let filteredEvents = events.filter(e => e.status === "Pending Approval");

    // Apply search filter
    if (searchTerm) {
        filteredEvents = filteredEvents.filter(e => {
            const title = getEventTitle(e, language);
            const organizer = getEventOrganizer(e, language);
            return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   e.sfda_license?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    // Apply specialty filter
    if (selectedSpecialty !== "all") {
        filteredEvents = filteredEvents.filter(e => 
            e.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );
    }

    // Sort events
    filteredEvents = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "date":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "submission":
                // Mock: older events = earlier submission
                return a.id.localeCompare(b.id);
            case "priority":
                // Mock: conferences first
                return a.titleEn.includes('Conference') ? -1 : 1;
            default:
                return 0;
        }
    });

    const handleSelectEvent = (eventId: string) => {
        setSelectedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedEvents.size === filteredEvents.length) {
            setSelectedEvents(new Set());
        } else {
            setSelectedEvents(new Set(filteredEvents.map(e => e.id)));
        }
    };

    const handleBulkApprove = () => {
        selectedEvents.forEach(eventId => {
            approveEvent(eventId);
        });
        setSelectedEvents(new Set());
        alert(language === 'ar' ? `تم الموافقة على ${selectedEvents.size} فعالية` : `Approved ${selectedEvents.size} events`);
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
    const bulkApproveText = language === 'ar' ? 'موافقة جماعية' : 'Bulk Approve';

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

                    {/* Bulk Actions */}
                    {selectedEvents.size > 0 && (
                        <div className="flex items-center justify-between p-4 bg-[var(--apple-blue)]/10 rounded-ios border border-[var(--apple-blue)]/20">
                            <div className="flex items-center gap-3">
                                <CheckSquare className="h-5 w-5 text-[var(--apple-blue)]" />
                                <span className="text-[var(--label)] font-medium">
                                    {selectedEvents.size} {language === 'ar' ? 'محدد' : 'selected'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <GlassButton variant="outline" onClick={() => setSelectedEvents(new Set())}>
                                    {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                                </GlassButton>
                                <GlassButton onClick={handleBulkApprove} className="gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {bulkApproveText}
                                </GlassButton>
                            </div>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {pendingText} ({filteredEvents.length})
                    </h3>
                    <GlassButton variant="outline" size="sm" onClick={handleSelectAll} className="gap-2">
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
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="relative">
                                <Checkbox
                                    checked={selectedEvents.has(event.id)}
                                    onCheckedChange={() => handleSelectEvent(event.id)}
                                    className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm"
                                />
                                <EventCard
                                    event={event}
                                    variant="regulator"
                                    showDescription={true}
                                    sfdaLicense={event.sfda_license}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

