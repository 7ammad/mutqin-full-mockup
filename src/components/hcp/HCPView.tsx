"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DiscoveryGrid from "./DiscoveryGrid";
import MyTickets from "./MyTickets";
import HcpFilesTab from "./HcpFilesTab";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { GlassButton } from "@/components/ui/glass-button";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Award, Calendar, Filter, X, Building2, FileText, Star, MessageSquare } from "lucide-react";
import CompactCMETracker from "./CompactCMETracker";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getHcpActivities, getHcpCredits, getHcpSummary } from "@/context/demoStore";
import { getState } from "@/context/demoStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { buildRoute } from "@/lib/routes";

type TabKey = "discover" | "registrations" | "files" | "credits" | "certs_reviews";

function HCPViewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { events, myTickets } = usePersona();
    const rawTab = (searchParams.get("tab") || "discover") as TabKey;
    
    // Handle tab alias: certs_reviews -> credits
    const effectiveTab = rawTab === 'certs_reviews' ? 'credits' : rawTab;

    // Get HCP data - use fixed hcpId for demo
    const hcpId = "hcp-1";
    const activitiesData = useMemo(() => getHcpActivities(hcpId), [hcpId]);
    const creditsData = useMemo(() => getHcpCredits(hcpId), [hcpId]);
    const hcpSummary = useMemo(() => getHcpSummary(hcpId), [hcpId]);

    return (
        <div className="space-y-6">
            {/* Compact CME Tracker - Mobile only (desktop shows in header) */}
            <div className="sm:hidden">
                <CompactCMETracker variant="circular" expandable={true} />
            </div>

            {/* Content Views - Tabs are in global sidebar, not here */}
            {effectiveTab === "discover" && <DiscoveryGrid />}
            {effectiveTab === "registrations" && <MyTickets />}
            {effectiveTab === "files" && <HcpFilesTab />}
            {effectiveTab === "credits" && (
                <CreditsTab 
                    creditsData={creditsData} 
                    certificates={hcpSummary.certificates}
                    reviews={hcpSummary.reviews}
                    language={language} 
                />
            )}
        </div>
    );
}

// Credits Tab Component (merged with certificates)
function CreditsTab({
    creditsData,
    certificates,
    reviews,
    language,
}: {
    creditsData: ReturnType<typeof getHcpCredits>;
    certificates: ReturnType<typeof getHcpSummary>['certificates'];
    reviews: ReturnType<typeof getHcpSummary>['reviews'];
    language: "ar" | "en";
}) {
    const router = useRouter();
    const current = getState();
    const [periodFilter, setPeriodFilter] = useState<'all' | 'this_year' | 'last_12_months'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'pending' | 'earned'>('all');

    // Merge credits and certificates into unified ledger items
    const mergedItems = useMemo(() => {
        const itemsMap = new Map<string, typeof creditsData.items[0] & { certificateId?: string }>();
        
        // Add all credits items
        creditsData.items.forEach((item) => {
            itemsMap.set(item.activityId, { ...item });
        });
        
        // Enhance with certificate info
        certificates.forEach((cert) => {
            const event = current.events.find((e) => e.id === cert.eventId);
            if (!event) return;
            
            const existingItem = itemsMap.get(cert.eventId);
            if (existingItem) {
                // Update existing item with certificate ID
                existingItem.certificateId = cert.id;
                // Ensure status is posted if certificate exists
                if (!existingItem.status || existingItem.status !== 'posted') {
                    existingItem.status = 'posted';
                }
                // Use certificate issued date if available
                if (cert.issuedAt && (!existingItem.dateCompleted || new Date(cert.issuedAt) > new Date(existingItem.dateCompleted))) {
                    existingItem.dateCompleted = cert.issuedAt;
                }
            } else {
                // Add new item from certificate if not in credits
                itemsMap.set(cert.eventId, {
                    activityId: cert.eventId,
                    title: event.titleEn || event.titleAr || event.title || 'Event',
                    status: 'posted',
                    hours: cert.cme_hours || event.cme_hours || 0,
                    providerName: event.organizerEn || event.organizerAr,
                    dateCompleted: cert.issuedAt || event.date,
                    specialty: event.specialty,
                    certificateId: cert.id,
                });
            }
        });
        
        return Array.from(itemsMap.values());
    }, [creditsData.items, certificates, current.events]);

    // Filter merged items based on selected filters
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

    // Calculate breakdown by specialty
    const specialtyBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = {};
        filteredItems.forEach((item) => {
            const specialty = item.specialty || (language === 'ar' ? '' : 'General');
            breakdown[specialty] = (breakdown[specialty] || 0) + item.hours;
        });
        return Object.entries(breakdown)
            .map(([specialty, hours]) => ({ specialty, hours }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5);
    }, [filteredItems, language]);

    // Get reviews data (last 3)
    const recentReviews = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];
        return reviews
            .slice(0, 3)
            .map((review) => {
                const event = current.events.find((e) => e.id === review.eventId);
                return {
                    id: review.id,
                    eventId: review.eventId,
                    eventTitle: event?.titleEn || event?.titleAr || event?.title || 'Event',
                    eventTitleAr: event?.titleAr || '',
                    rating: (review as any).rating || 0,
                    comment: (review as any).text || (review as any).comment || '',
                    date: (review as any).createdAt || (review as any).date || new Date().toISOString(),
                };
            });
    }, [reviews, current.events]);

    const clearFilters = () => {
        setPeriodFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = periodFilter !== 'all' || statusFilter !== 'all';

    return (
        <div className="space-y-6">
            {/* Header with Export Button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm text-[var(--secondary-label)]">
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
                            {language === "ar" ? "   :  " : "SCFHS target for current year: 40 hours"}
                        </p>
                        <p className="text-sm font-semibold text-[var(--label)]">
                            {creditsData.posted} / 40
                        </p>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[var(--system-fill)] overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[var(--apple-green)] to-[var(--apple-green)]/80 transition-all duration-500"
                            style={{ width: `${Math.min((creditsData.posted / 40) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Main Content: Filters + Compact Log */}
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

                {/* Right Column: Compact Credits Log */}
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
                                            {items.map((item) => (
                                                <div
                                                    key={item.activityId}
                                                    className="p-3 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30 hover:bg-[var(--system-fill)]/50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-[var(--label)] mb-1 truncate text-sm">
                                                                {item.title}
                                                            </h4>
                                                            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--secondary-label)]">
                                                                {item.providerName && (
                                                                    <span className="truncate">{item.providerName}</span>
                                                                )}
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
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs px-2 py-0.5"
                                                            >
                                                                {item.hours} {language === "ar" ? " " : "CME hours"}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    item.status === "posted"
                                                                        ? "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/20 text-xs px-2 py-0.5"
                                                                        : item.status === "earned"
                                                                        ? "bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/20 text-xs px-2 py-0.5"
                                                                        : "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/20 text-xs px-2 py-0.5"
                                                                }
                                                            >
                                                                {item.status === "posted"
                                                                    ? language === "ar" ? "" : "Completed"
                                                                    : item.status === "earned"
                                                                    ? language === "ar" ? "" : "Earned"
                                                                    : language === "ar" ? " " : "Pending"}
                                                            </Badge>
                                                            {item.certificateId && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const params = new URLSearchParams();
                                                                        params.set('tab', 'files');
                                                                        params.set('view', 'certificates');
                                                                        params.set('eventId', item.activityId);
                                                                        router.push(`/dashboard/hcp?${params.toString()}`);
                                                                    }}
                                                                    className="text-xs h-7 px-2 text-sky-400 hover:text-sky-300 dark:text-sky-300 dark:hover:text-sky-200"
                                                                >
                                                                    {language === "ar" ? " " : "Open certificate"}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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

export default function HCPView() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <HCPViewContent />
        </Suspense>
    );
}
