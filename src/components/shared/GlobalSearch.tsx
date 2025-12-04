"use client";

import { useState, useRef, useEffect } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Input } from "@/components/ui/input";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Event } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

interface GlobalSearchProps {
    onSelect?: (result: Event) => void;
    placeholder?: string;
    className?: string;
}

export function GlobalSearch({ onSelect, placeholder, className }: GlobalSearchProps) {
    const { events } = usePersona();
    const { language } = useLanguage();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [popularSearches] = useState([
        language === 'ar' ? 'مؤتمر القلب' : 'Cardiology Conference',
        language === 'ar' ? 'ورشة التمريض' : 'Nursing Workshop',
        language === 'ar' ? 'طب الأطفال' : getSpecialtyLabel('pediatrics', language),
    ]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('recentSearches');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setRecentSearches(parsed);
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    // Save recent searches
    const saveRecentSearch = (search: string) => {
        if (!search.trim()) return;
        const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Search across events
    const searchResults = query.trim()
        ? events.filter((event: Event) => {
            const searchTerm = query.toLowerCase();
            const titleAr = event.titleAr.toLowerCase();
            const titleEn = event.titleEn.toLowerCase();
            const organizerAr = event.organizerAr.toLowerCase();
            const organizerEn = event.organizerEn.toLowerCase();
            const specialty = event.specialty.toLowerCase();
            const locationAr = event.locationAr.toLowerCase();
            const locationEn = event.locationEn.toLowerCase();

            return (
                titleAr.includes(searchTerm) ||
                titleEn.includes(searchTerm) ||
                organizerAr.includes(searchTerm) ||
                organizerEn.includes(searchTerm) ||
                specialty.includes(searchTerm) ||
                locationAr.includes(searchTerm) ||
                locationEn.includes(searchTerm)
            );
        })
        : [];

    const handleSelect = (result: Event) => {
        saveRecentSearch(query);
        setIsOpen(false);
        if (onSelect) {
            onSelect(result);
        }
    };

    const handleRecentSelect = (search: string) => {
        setQuery(search);
        setIsOpen(true);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className={cn("relative w-full", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--secondary-label)]" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || (language === 'ar' ? 'ابحث عن فعاليات...' : 'Search events...')}
                    className="pl-10 pr-10 w-full"
                />
                {query && (
                    <button onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                        aria-label={language === 'ar' ? 'مسح البحث' : 'Clear search'}
                    >
                        <X className="w-4 h-4 text-[var(--secondary-label)]" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <LiquidGlassCard
                    className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto"
                    blurIntensity="xl"
                    interactive={false}
                >
                    {query.trim() ? (
                        <div className="space-y-2 p-2">
                            {searchResults.length > 0 ? (
                                <>
                                    <p className="text-xs font-medium text-[var(--secondary-label)] px-2 py-1">
                                        {language === 'ar' ? 'النتائج' : 'Results'} ({searchResults.length})
                                    </p>
                                    {searchResults.map((event) => (
                                        <button key={event.id}
                                            onClick={() => handleSelect(event)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-[var(--system-fill)] transition-colors"
                                        >
                                            <p className="font-medium text-[var(--label)]">
                                                {language === 'ar' ? event.titleAr : event.titleEn}
                                            </p>
                                            <p className="text-sm text-[var(--secondary-label)]">
                                                {language === 'ar' ? event.organizerAr : event.organizerEn}
                                            </p>
                                            <p className="text-xs text-[var(--tertiary-label)] mt-1">
                                                {event.specialty} • {language === 'ar' ? event.locationAr : event.locationEn}
                                            </p>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="p-4 text-center text-[var(--secondary-label)]">
                                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-[var(--secondary-label)]" />
                                        <p className="text-xs font-medium text-[var(--secondary-label)]">
                                            {language === 'ar' ? 'البحث الأخير' : 'Recent Searches'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        {recentSearches.map((search, index) => (
                                            <button key={index}
                                                onClick={() => handleRecentSelect(search)}
                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--system-fill)] transition-colors text-sm text-[var(--label)]"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-[var(--secondary-label)]" />
                                    <p className="text-xs font-medium text-[var(--secondary-label)]">
                                        {language === 'ar' ? 'البحث الشائع' : 'Popular Searches'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((search, index) => (
                                        <button key={index}
                                            onClick={() => handleRecentSelect(search)}
                                            className="px-3 py-1.5 rounded-full bg-[var(--system-fill)] hover:bg-[var(--secondary-system-fill)] transition-colors text-sm text-[var(--label)]"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </LiquidGlassCard>
            )}
        </div>
    );
}

