"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/shared/Calendar";
import { X, Filter, Calendar, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSpecialtyLabel } from "@/lib/i18n/specialties";

export interface FilterOptions {
    specialty?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    status?: string;
    priceMin?: number;
    priceMax?: number;
}

interface FilterPanelProps {
    onFilterChange: (filters: FilterOptions) => void;
    onClose?: () => void;
    className?: string;
    savedPresets?: FilterOptions[];
    onSavePreset?: (name: string, filters: FilterOptions) => void;
}

const LOCATIONS = [
    'Riyadh',
    'Jeddah',
    'Dammam',
    'Mecca',
    'Medina',
];

const STATUSES = [
    'Draft',
    'Pending Approval',
    'Published',
    'Completed',
];

export function FilterPanel({
    onFilterChange,
    onClose,
    className,
    savedPresets = [],
    onSavePreset,
}: FilterPanelProps) {
    const { language } = useLanguage();
    const [filters, setFilters] = useState<FilterOptions>({});
    
    const SPECIALTIES = [
        getSpecialtyLabel('cardiology', language),
        'General Surgery',
        'Pediatrics',
        'Emergency Medicine',
        'Anesthesiology',
        'Nursing',
        'Pharmacy',
        'Radiology',
    ];
    const [showSavePreset, setShowSavePreset] = useState(false);
    const [presetName, setPresetName] = useState("");

    const updateFilter = (key: keyof FilterOptions, value: string | number | undefined) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        onFilterChange(updated);
    };

    const _clearFilter = (key: keyof FilterOptions) => {
        const updated = { ...filters };
        delete updated[key];
        setFilters(updated);
        onFilterChange(updated);
    };

    const clearAll = () => {
        setFilters({});
        onFilterChange({});
    };

    const handleSavePreset = () => {
        if (presetName.trim() && onSavePreset) {
            onSavePreset(presetName, filters);
            setPresetName("");
            setShowSavePreset(false);
        }
    };

    const activeFiltersCount = Object.keys(filters).filter(
        key => filters[key as keyof FilterOptions] !== undefined && filters[key as keyof FilterOptions] !== ""
    ).length;

    return (
        <LiquidGlassCard
            className={cn("p-6 space-y-6", className)}
            blurIntensity="lg"
            interactive={false}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[var(--label)]" />
                    <h3 className="text-lg font-semibold text-[var(--label)]">
                        {language === 'ar' ? '' : 'Filters'}
                    </h3>
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] text-xs font-medium">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                        <GlassButton
                            onClick={clearAll}
                            variant="outline"
                            size="sm"
                         className="flex items-center justify-center gap-2">
                            {language === 'ar' ? ' ' : 'Clear All'}
                        </GlassButton>
                    )}
                    {onClose && (
                        <button onClick={onClose}
                            className="p-1 rounded-full hover:bg-[var(--system-fill)] transition-colors inline-flex items-center justify-center"
                        >
                            <X className="w-4 h-4 text-[var(--secondary-label)]" />
                        </button>
                    )}
                </div>
            </div>

            {/* Specialty Filter */}
            <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                    {language === 'ar' ? '' : 'Specialty'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((specialty) => (
                        <button key={specialty}
                            onClick={() => {
                                updateFilter('specialty', filters.specialty === specialty ? undefined : specialty);
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-colors",
                                filters.specialty === specialty
                                    ? "bg-[var(--apple-blue)] text-white"
                                    : "bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--secondary-system-fill)]"
                            )}
                        >
                            {specialty}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Range Filter */}
            <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === 'ar' ? ' ' : 'Date Range'}
                </label>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Input
                                type="date"
                                value={filters.dateFrom || ""}
                                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                                className="w-full"
                            />
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? '' : 'From'}
                            </p>
                        </div>
                        <div>
                            <Input
                                type="date"
                                value={filters.dateTo || ""}
                                onChange={(e) => updateFilter('dateTo', e.target.value)}
                                className="w-full"
                            />
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? '' : 'To'}
                            </p>
                        </div>
                    </div>
                    {/* Calendar Picker Alternative */}
                    <div className="pt-2">
                        <CalendarComponent
                            selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                            onSelect={(date) => {
                                if (date) {
                                    updateFilter('dateFrom', date.toISOString().split('T')[0]);
                                }
                            }}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Location Filter */}
            <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {language === 'ar' ? '' : 'Location'}
                </label>
                <select
                    value={filters.location || ""}
                    onChange={(e) => updateFilter('location', e.target.value || undefined)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--system-fill)] border border-[var(--border)] text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                >
                    <option value="">{language === 'ar' ? ' ' : 'All Locations'}</option>
                    {LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status Filter */}
            <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                    {language === 'ar' ? '' : 'Status'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                        <button key={status}
                            onClick={() => {
                                updateFilter('status', filters.status === status ? undefined : status);
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-colors",
                                filters.status === status
                                    ? "bg-[var(--apple-blue)] text-white"
                                    : "bg-[var(--system-fill)] text-[var(--label)] hover:bg-[var(--secondary-system-fill)]"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <label className="text-sm font-medium text-[var(--label)] mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {language === 'ar' ? ' ' : 'Price Range'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Input
                            type="number"
                            placeholder={language === 'ar' ? ' ' : 'Min'}
                            value={filters.priceMin || ""}
                            onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder={language === 'ar' ? ' ' : 'Max'}
                            value={filters.priceMax || ""}
                            onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Save Preset */}
            {onSavePreset && (
                <div className="pt-4 border-t border-[var(--separator)]">
                    {!showSavePreset ? (
                        <GlassButton
                            onClick={() => setShowSavePreset(true)}
                            variant="outline"
                            size="default"
                            className="w-full"
                        >
                            {language === 'ar' ? ' ' : 'Save Filter Preset'}
                        </GlassButton>
                    ) : (
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder={language === 'ar' ? ' ' : 'Preset Name'}
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <GlassButton
                                    onClick={handleSavePreset}
                                    variant="default"
                                    size="default"
                                    className="flex-1 items-center justify-center gap-2"
                                >
                                    {language === 'ar' ? '' : 'Save'}
                                </GlassButton>
                                <GlassButton
                                    onClick={() => {
                                        setShowSavePreset(false);
                                        setPresetName("");
                                    }}
                                    variant="outline"
                                    size="default"
                                >
                                    {language === 'ar' ? '' : 'Cancel'}
                                </GlassButton>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </LiquidGlassCard>
    );
}

