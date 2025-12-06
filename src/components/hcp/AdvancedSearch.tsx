"use client";

import { useState } from "react";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { FilterPanel, FilterOptions } from "@/components/shared/FilterPanel";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Filter, X, Sparkles } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Event } from "@/lib/mockData";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { cn } from "@/lib/utils";

export default function AdvancedSearch() {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({});
    const [searchQuery, setSearchQuery] = useState("");

    // Apply filters
    const filteredEvents = events.filter((event: Event) => {
        // Search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                event.titleAr.toLowerCase().includes(query) ||
                event.titleEn.toLowerCase().includes(query) ||
                event.organizerAr.toLowerCase().includes(query) ||
                event.organizerEn.toLowerCase().includes(query) ||
                event.specialty.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Specialty filter
        if (filters.specialty && event.specialty !== filters.specialty) {
            return false;
        }

        // Date range filter
        if (filters.dateFrom && event.date < filters.dateFrom) {
            return false;
        }
        if (filters.dateTo && event.date > filters.dateTo) {
            return false;
        }

        // Location filter
        if (filters.location) {
            const locationMatch =
                event.locationEn.toLowerCase().includes(filters.location.toLowerCase()) ||
                event.locationAr.toLowerCase().includes(filters.location.toLowerCase());
            if (!locationMatch) return false;
        }

        // Status filter
        if (filters.status && event.status !== filters.status) {
            return false;
        }

        return true;
    });

    // AI Recommendations (mock - would use behavioral data in real app)
    const recommendations = events
        .filter(e => e.status === 'Published')
        .slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Search and Filter Header */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <GlobalSearch
                        onSelect={(result) => {
                            if (result && 'id' in result) {
                                setSearchQuery(language === 'ar' ? result.titleAr : result.titleEn);
                            }
                        }}
                        placeholder={language === 'ar' ? '  ...' : 'Search events...'}
                    />
                </div>
                <GlassButton
                    onClick={() => setShowFilters(!showFilters)}
                    variant={showFilters ? "default" : "outline"}
                    size="default"
                    className="flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    {language === 'ar' ? '' : 'Filters'}
                </GlassButton>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <FilterPanel
                    onFilterChange={setFilters}
                    onClose={() => setShowFilters(false)}
                />
            )}

            {/* AI Recommendations */}
            {!searchQuery && Object.keys(filters).length === 0 && (
                <LiquidGlassCard blurIntensity="lg" interactive={false}>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-[var(--apple-purple)]" />
                        <h3 className="text-lg font-semibold text-[var(--label)]">
                            {language === 'ar' ? '  ' : 'Personalized Recommendations'}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendations.map((event) => (
                            <ActivityCard
                                key={event.id}
                                event={event}
                                context="hcp"
                                variant="full"
                                showDescription={false}
                            />
                        ))}
                    </div>
                </LiquidGlassCard>
            )}

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {language === 'ar' ? '' : 'Results'} ({filteredEvents.length})
                    </h3>
                    {(searchQuery || Object.keys(filters).length > 0) && (
                        <GlassButton
                            onClick={() => {
                                setSearchQuery("");
                                setFilters({});
                            }}
                            variant="outline"
                            size="sm"
                        >
                            <X className="w-4 h-4 mr-2" />
                            {language === 'ar' ? '' : 'Clear'}
                        </GlassButton>
                    )}
                </div>

                {filteredEvents.length === 0 ? (
                    <LiquidGlassCard blurIntensity="lg" interactive={false}>
                        <div className="text-center py-12">
                            <p className="text-[var(--secondary-label)]">
                                {language === 'ar' ? '  ' : 'No results found'}
                            </p>
                        </div>
                    </LiquidGlassCard>
                ) : (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <ActivityCard
                                key={event.id}
                                event={event}
                                context="hcp"
                                variant="full"
                                showDescription={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

