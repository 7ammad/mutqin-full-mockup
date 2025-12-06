"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useMemo, useState } from "react";
import { BarChart3, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { getHcpCredits, getHcpSummary, getState } from "@/context/demoStore";
import { useCmeData } from "@/hooks/useCmeData";
import { buildRoute } from "@/lib/routes";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import type { Event } from "@/lib/mockData";

export function HcpCreditsTab() {
    const router = useRouter();
    const { language } = useLanguage();
    const hcpId = "hcp-1";
    const cmeData = useCmeData(hcpId);
    const creditsData = cmeData.creditsData; // Use unified data
    const hcpSummary = useMemo(() => getHcpSummary(hcpId), [hcpId]);
    const current = getState();
    const [periodFilter, setPeriodFilter] = useState<'all' | 'this_year' | 'last_12_months'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'pending' | 'earned'>('all');

    // Merge credits and certificates into unified ledger items with events
    const mergedItems = useMemo(() => {
        const itemsMap = new Map<string, {
            activityId: string;
            title: string;
            status: 'earned' | 'pending' | 'posted';
            hours: number;
            providerName?: string;
            dateCompleted?: string;
            specialty?: string;
            certificateId?: string;
            event?: Event;
        }>();
        
        // Add all credits items
        creditsData.items.forEach((item) => {
            const event = current.events.find(e => e.id === item.activityId);
            itemsMap.set(item.activityId, { 
                ...item,
                providerName: item.providerName || 'Unknown',
                event: event ? convertDemoEventToEvent(event) : undefined,
            });
        });
        
        // Enhance with certificate info
        hcpSummary.certificates.forEach((cert) => {
            const event = current.events.find((e) => e.id === cert.eventId);
            if (!event) return;
            
            const existingItem = itemsMap.get(cert.eventId);
            if (existingItem) {
                existingItem.certificateId = cert.id;
                if (!existingItem.status || existingItem.status !== 'posted') {
                    existingItem.status = 'posted';
                }
                if (cert.issuedAt && (!existingItem.dateCompleted || new Date(cert.issuedAt) > new Date(existingItem.dateCompleted))) {
                    existingItem.dateCompleted = cert.issuedAt;
                }
            } else {
                itemsMap.set(cert.eventId, {
                    activityId: cert.eventId,
                    title: event.titleEn || event.titleAr || event.title || 'Event',
                    status: 'posted',
                    hours: cert.cme_hours || event.cme_hours || 0,
                    providerName: event.organizerEn || event.organizerAr || 'Unknown',
                    dateCompleted: cert.issuedAt || event.date,
                    specialty: event.specialty,
                    certificateId: cert.id,
                    event: convertDemoEventToEvent(event),
                });
            }
        });
        
        return Array.from(itemsMap.values());
    }, [creditsData.items, hcpSummary.certificates, current.events]);

    // Filter merged items
    const filteredItems = useMemo(() => {
        let items = [...mergedItems];

        // Period filter
        if (periodFilter !== 'all') {
            const now = new Date();
            const thisYear = now.getFullYear();
            const last12Months = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());

            items = items.filter((item) => {
                if (!item.dateCompleted) return false;
                const itemDate = new Date(item.dateCompleted);
                
                if (periodFilter === 'this_year') {
                    return itemDate.getFullYear() === thisYear;
                } else if (periodFilter === 'last_12_months') {
                    return itemDate >= last12Months;
                }
                return true;
            });
        }

        // Status filter
        if (statusFilter !== 'all') {
            items = items.filter((item) => item.status === statusFilter);
        }

        // Sort by date (most recent first)
        return items.sort((a, b) => {
            const dateA = a.dateCompleted ? new Date(a.dateCompleted).getTime() : 0;
            const dateB = b.dateCompleted ? new Date(b.dateCompleted).getTime() : 0;
            return dateB - dateA;
        });
    }, [mergedItems, periodFilter, statusFilter]);

    // Group by year for ledger display
    const itemsByYear = useMemo(() => {
        const grouped: Record<string, typeof filteredItems> = {};
        filteredItems.forEach((item) => {
            if (!item.dateCompleted) {
                const noDateKey = language === 'ar' ? ' ' : 'No Date';
                if (!grouped[noDateKey]) grouped[noDateKey] = [];
                grouped[noDateKey].push(item);
                return;
            }
            const year = new Date(item.dateCompleted).getFullYear();
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(item);
        });
        return grouped;
    }, [filteredItems, language]);

    const clearFilters = () => {
        setPeriodFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = periodFilter !== 'all' || statusFilter !== 'all';

    const handleViewEvent = (eventId: string) => {
        router.push(buildRoute.hcpEvent(eventId));
    };

    const handleViewCertificate = (eventId: string, certificateId?: string) => {
        // Deep-link to My Files > Certificates
        const params = new URLSearchParams();
        params.set('tab', 'files');
        params.set('view', 'certificates');
        if (certificateId) {
            params.set('certificateId', certificateId);
        } else {
            params.set('eventId', eventId);
        }
        router.push(`/dashboard/hcp?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--label)]">
                        {language === "ar" ? " " : "CME Credits"}
                    </h2>
                    <p className="text-sm text-[var(--secondary-label)] mt-1">
                        {language === "ar" 
                            ? "     "
                            : "Record of accredited hours by year and status"}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-xs text-[var(--secondary-label)]"
                >
                    {language === "ar" ? "  " : "Download hours statement"}
                </Button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "  " : "Total hours this period"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{creditsData.earned + creditsData.pending}</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? "" : "hours"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center shrink-0">
                            <BarChart3 className="h-5 w-5 text-[var(--apple-green)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? " " : "Pending"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{creditsData.pending}</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? "" : "hours"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-orange)]/10 flex items-center justify-center shrink-0">
                            <BarChart3 className="h-5 w-5 text-[var(--apple-orange)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                {language === "ar" ? "" : "Posted"}
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">{creditsData.posted}</p>
                            <p className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === "ar" ? "" : "hours"}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--apple-blue)]/10 flex items-center justify-center shrink-0">
                            <BarChart3 className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>
                    </div>
                </LiquidGlassCard>
            </div>

            {/* Annual Progress Bar */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[var(--label)]">
                            {language === "ar" 
                                ? `   : ${cmeData.requiredHours} `
                                : `SCFHS target for current year: ${cmeData.requiredHours} hours`}
                        </p>
                        <p className="text-sm font-semibold text-[var(--label)]">
                            {cmeData.currentHours} / {cmeData.requiredHours}
                        </p>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[var(--system-fill)] overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[var(--apple-green)] to-[var(--apple-green)]/80 transition-all duration-500"
                            style={{ width: `${cmeData.progress}%` }}
                        />
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Main Content: Filters + Credits Log */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6">
                {/* Left Column: Filters */}
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-[var(--secondary-label)]" />
                        <h3 className="text-lg font-semibold text-[var(--label)]">
                            {language === "ar" ? "" : "Filter"}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                                {language === "ar" ? "" : "Period"}
                            </label>
                            <select
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--separator)] bg-[var(--system-background)] text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]/20"
                            >
                                <option value="all">{language === "ar" ? "" : "All"}</option>
                                <option value="this_year">{language === "ar" ? " " : "Current year"}</option>
                                <option value="last_12_months">{language === "ar" ? " " : "Last year"}</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--label)] mb-2 block">
                                {language === "ar" ? "" : "Status"}
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--separator)] bg-[var(--system-background)] text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]/20"
                            >
                                <option value="all">{language === "ar" ? "" : "All"}</option>
                                <option value="posted">{language === "ar" ? "" : "Completed"}</option>
                                <option value="pending">{language === "ar" ? " " : "Pending"}</option>
                            </select>
                        </div>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="w-full gap-2"
                            >
                                <X className="h-4 w-4 shrink-0" />
                                <span>{language === "ar" ? " " : "Clear filters"}</span>
                            </Button>
                        )}
                    </div>
                </LiquidGlassCard>

                {/* Right Column: Credits Log using ActivityCard */}
                <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                    <h2 className="text-xl font-bold text-[var(--label)] mb-6">
                        {language === "ar" ? " " : "Credits Log"}
                    </h2>

                    {mergedItems.length === 0 ? (
                        <EmptyState
                            title={language === "ar" ? "     " : "No accredited activities yet"}
                            description={language === "ar" 
                                ? "     " 
                                : "Register for an event to start earning credits"}
                            icon={BarChart3}
                            actionLabel={language === "ar" ? " " : "Browse events"}
                            onAction={() => router.push(buildRoute.hcpTab('discover'))}
                        />
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <p className="text-[var(--secondary-label)]">
                                {language === "ar" 
                                    ? "    " 
                                    : "No activities match these filters"}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4 shrink-0" />
                                    <span>{language === "ar" ? " " : "Clear filters"}</span>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(itemsByYear)
                                .sort(([a], [b]) => {
                                    // Sort years descending, "No Date" at end
                                    if (a === (language === 'ar' ? ' ' : 'No Date')) return 1;
                                    if (b === (language === 'ar' ? ' ' : 'No Date')) return -1;
                                    return Number(b) - Number(a);
                                })
                                .map(([year, items]) => (
                                    <div key={year} className="space-y-3">
                                        <h3 className="text-sm font-semibold text-[var(--secondary-label)] uppercase tracking-wide">
                                            {year}
                                        </h3>
                                        <div className="space-y-2">
                                            {items.map((item) => {
                                                if (!item.event) {
                                                    // Fallback for items without events
                                                    return (
                                                        <div
                                                            key={item.activityId}
                                                            className="p-3 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30"
                                                        >
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-[var(--label)] mb-1 truncate text-sm">
                                                                        {item.title}
                                                                    </h4>
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--secondary-label)]">
                                                                        {item.providerName && <span className="truncate">{item.providerName}</span>}
                                                                        {item.dateCompleted && (
                                                                            <span>
                                                                                {new Date(item.dateCompleted).toLocaleDateString(
                                                                                    language === 'ar' ? 'ar-SA' : 'en-US',
                                                                                    { year: 'numeric', month: 'short', day: 'numeric' }
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                                    <span className="text-xs text-[var(--label)] font-semibold">
                                                                        {item.hours} {language === "ar" ? "" : "hours"}
                                                                    </span>
                                                                    {item.certificateId && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleViewCertificate(item.activityId, item.certificateId)}
                                                                            className="text-xs h-7 px-2 text-sky-400 hover:text-sky-300"
                                                                        >
                                                                            {language === "ar" ? " " : "View certificate"}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                
                                                return (
                                                    <div key={item.activityId} className="space-y-2">
                                                        <ActivityCard
                                                            event={item.event}
                                                            context="hcp"
                                                            variant="row"
                                                            showDescription={false}
                                                        />
                                                        {/* Certificate link */}
                                                        {item.certificateId && (
                                                            <div className="flex items-center gap-2 ml-2">
                                                                <button onClick={() => handleViewCertificate(item.activityId, item.certificateId)}
                                                                    className="text-xs text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200 underline"
                                                                >
                                                                    {language === "ar" ? " " : "View certificate"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </LiquidGlassCard>
            </div>
        </div>
    );
}

