"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { Search, Filter, TrendingUp, Users, Calendar, MapPin, Eye } from "lucide-react";
import { getEventTitle, getEventOrganizer } from "@/lib/eventTranslations";
import { EmptyState } from "@/components/shared/EmptyState";
import { buildRoute } from "@/lib/routes";

export default function AdvancedMarketplace() {
    const router = useRouter();
    const { events } = usePersona();
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
    const [selectedRegion, setSelectedRegion] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("relevance");
    const [dateRange, setDateRange] = useState<number[]>([0, 365]);
    const [showFilters, setShowFilters] = useState(false);
    const [minAttendees, setMinAttendees] = useState<number[]>([0]);
    const [maxBudget, setMaxBudget] = useState<number[]>([1000000]);

    // Filter events that need sponsorship
    let filteredEvents = events.filter(e => e.needs_sponsorship && !e.is_sponsored);

    // Apply search filter
    if (searchTerm) {
        filteredEvents = filteredEvents.filter(e => {
            const title = getEventTitle(e, language);
            const organizer = getEventOrganizer(e, language);
            return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   organizer.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    // Apply specialty filter
    if (selectedSpecialty !== "all") {
        filteredEvents = filteredEvents.filter(e => 
            e.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );
    }

    // Apply region filter
    if (selectedRegion !== "all") {
        filteredEvents = filteredEvents.filter(e => {
            const location = language === 'ar' ? e.locationAr : e.locationEn;
            return location.toLowerCase().includes(selectedRegion.toLowerCase());
        });
    }

    // Apply date range filter
    const today = new Date();
    filteredEvents = filteredEvents.filter(e => {
        const eventDate = new Date(e.date);
        const daysUntilEvent = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilEvent >= dateRange[0] && daysUntilEvent <= dateRange[1];
    });

    // Sort events
    filteredEvents = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "date":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "cme":
                return b.cme_hours - a.cme_hours;
            case "specialty":
                return a.specialty.localeCompare(b.specialty);
            default:
                return 0;
        }
    });

    const specialties = [
        { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
        { id: 'cardiology', label: t('specialties.cardiology') },
        { id: 'pediatrics', label: t('specialties.pediatrics') },
        { id: 'generalsurgery', label: t('specialties.generalSurgery') },
        { id: 'familymedicine', label: t('specialties.familyMedicine') },
        { id: 'emergency', label: t('specialties.emergency') },
    ];

    const regions = [
        { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
        { id: 'riyadh', label: t('regions.riyadh') },
        { id: 'jeddah', label: t('regions.jeddah') },
        { id: 'dammam', label: t('regions.dammam') },
    ];

    const title = language === 'ar' ? 'السوق المتقدم' : 'Advanced Marketplace';
    const searchPlaceholder = language === 'ar' ? 'ابحث عن فعاليات...' : 'Search events...';
    const filtersText = language === 'ar' ? 'الفلاتر' : 'Filters';
    const sortByText = language === 'ar' ? 'ترتيب حسب' : 'Sort By';
    const opportunitiesText = language === 'ar' ? 'فرص الرعاية' : 'Sponsorship Opportunities';

    return (
        <div className="space-y-6">
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <h2 className="text-2xl font-bold text-[var(--label)] mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-[var(--apple-blue)]" />
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
                                <SelectItem value="relevance">{language === 'ar' ? 'الأكثر صلة' : 'Relevance'}</SelectItem>
                                <SelectItem value="date">{language === 'ar' ? 'التاريخ' : 'Date'}</SelectItem>
                                <SelectItem value="cme">{language === 'ar' ? 'ساعات التعليم' : 'CME Hours'}</SelectItem>
                                <SelectItem value="specialty">{language === 'ar' ? 'التخصص' : 'Specialty'}</SelectItem>
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
                                <div>
                                    <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                                        {language === 'ar' ? 'المنطقة' : 'Region'}
                                    </label>
                                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent glass={true}>
                                            {regions.map(reg => (
                                                <SelectItem key={reg.id} value={reg.id}>
                                                    {reg.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                                    {language === 'ar' ? 'الأيام حتى الفعالية' : 'Days Until Event'} ({dateRange[0]} - {dateRange[1]})
                                </label>
                                <Slider
                                    min={0}
                                    max={365}
                                    step={7}
                                    value={dateRange}
                                    onValueChange={setDateRange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {opportunitiesText} ({filteredEvents.length})
                    </h3>
                </div>

                {filteredEvents.length === 0 ? (
                    <EmptyState
                        title={language === 'ar' ? 'لا توجد نتائج' : 'No Results'}
                        description={language === 'ar' ? 'جرب تغيير الفلاتر أو البحث' : 'Try adjusting your filters or search'}
                        icon={Search}
                    />
                ) : (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="space-y-3">
                                <ActivityCard
                                    event={event}
                                    context="sponsor"
                                    variant="full"
                                    showDescription={true}
                                    sponsorshipPackage={{
                                        name: language === 'ar' ? 'حزمة ذهبية' : 'Gold Package',
                                        value: 50000,
                                    }}
                                    actionButton={{
                                        label: language === 'ar' ? 'رعاية الفعالية' : 'Sponsor Event',
                                        onClick: () => console.log('Sponsor:', event.id),
                                        variant: 'blue',
                                    }}
                                />
                                <GlassButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(buildRoute.vendorEvent(event.id))}
                                    className="w-full gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    {language === 'ar' ? 'عرض الفرصة' : 'View Opportunity'}
                                </GlassButton>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

