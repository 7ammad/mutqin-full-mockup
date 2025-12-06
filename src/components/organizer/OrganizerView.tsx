"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/toast-context";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getOrganizerCompliance, getOrganizerSponsors, getState } from "@/context/demoStore";
import ExecutionTab from "./ExecutionTab";
import SponsorsTab from "./SponsorsTab";
import OverviewTab from "./OverviewTab";
import type { DemoEvent } from "@/context/demoSeed";
import type { Event } from "@/lib/mockData";
import { buildRoute } from "@/lib/routes";
import {
    FileText,
    Search,
    AlertCircle,
    Plus,
    ArrowRight,
    Users,
    ClipboardList,
    CheckCircle2,
    Clock,
    Package,
    DollarSign
} from "lucide-react";

type TabKey = "overview" | "activities" | "accreditation" | "execution" | "sponsors";

function OrganizerViewContent() {
    const { language } = useLanguage();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = (searchParams.get("tab") || "overview") as TabKey;

    const [events, setEvents] = useState<DemoEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");


    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            // Data layer works immediately, no MSW waiting needed
            setLoading(true);
            setError("");
            try {
                const { getOrganizerEvents } = await import('@/lib/dataSource');
                const events = await getOrganizerEvents("org-1");
                if (!cancelled) {
                    setEvents(events);
                }
            } catch (err) {
                if (!cancelled) {
                    const message = err instanceof Error ? err.message : "Unable to load events";
                    setError(message);
                    showToast(message, "info");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [showToast]);

    const normalizeStatus = (status?: string) => {
        if (!status) return "draft";
        return status.toLowerCase().replace(" ", "_");
    };

    // KPI calculations
    const kpis = useMemo(() => {
        const draft = events.filter((e) => normalizeStatus(e.status) === "draft").length;
        const pending_review = events.filter((e) => normalizeStatus(e.status) === "pending_review").length;
        const approved = events.filter((e) => normalizeStatus(e.status) === "approved").length;
        const published = events.filter((e) => normalizeStatus(e.status) === "published").length;
        const closed = events.filter((e) => normalizeStatus(e.status) === "closed").length;
        
        // Compliance KPIs
        const compliance = getOrganizerCompliance("org-1");
        const complianceDueSoon = compliance.filter((c) => {
            const dueAt = c.attendanceRecords.dueAt || c.hoursRegistration.dueAt;
            if (!dueAt) return false;
            const due = new Date(dueAt);
            const now = new Date();
            const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntilDue > 0 && daysUntilDue <= 7;
        }).length;
        const complianceOverdue = compliance.filter((c) => {
            return c.attendanceRecords.status === 'overdue' || c.hoursRegistration.status === 'overdue';
        }).length;
        
        return { draft, pending_review, approved, published, closed, complianceDueSoon, complianceOverdue };
    }, [events]);

    // Get assignments to check EM assignment status
    const assignments = useMemo(() => {
        const current = getState();
        return current.assignments || [];
    }, []);

    // Next actions with real actionable items
    const nextActions = useMemo(() => {
        const actions: Array<{ 
            label: string; 
            labelAr: string; 
            action: string; 
            count: number;
            route: string;
        }> = [];
        
        // 1. Submit for accreditation (draft events)
        const draftEvents = events.filter((e) => normalizeStatus(e.status) === "draft");
        if (draftEvents.length > 0) {
            actions.push({
                label: "Submit for accreditation",
                labelAr: "تقديم للاعتماد",
                action: "submit",
                count: draftEvents.length,
                route: `/dashboard/organizer?tab=accreditation`,
            });
        }
        
        // 2. Respond to regulator feedback (pending_review with needs_changes)
        const pendingWithFeedback = events.filter((e) => {
            const status = normalizeStatus(e.status);
            return status === "pending_review" && (e as any).needs_changes;
        });
        if (pendingWithFeedback.length > 0) {
            actions.push({
                label: "Respond to regulator feedback",
                labelAr: "الرد على ملاحظات المنظم",
                action: "respond",
                count: pendingWithFeedback.length,
                route: `/dashboard/organizer?tab=accreditation`,
            });
        }
        
        // 3. Assign Event Manager (approved/published events without EM)
        const approvedPublished = events.filter((e) => {
            const status = normalizeStatus(e.status);
            return (status === "approved" || status === "published");
        });
        const eventsWithoutEM = approvedPublished.filter((e) => {
            return !assignments.some((a: any) => a.eventId === e.id && a.status === 'accepted');
        });
        if (eventsWithoutEM.length > 0) {
            actions.push({
                label: "Assign Event Manager",
                labelAr: "تعيين مدير الفعالية",
                action: "assign_em",
                count: eventsWithoutEM.length,
                route: `/dashboard/organizer?tab=execution`,
            });
        }
        
        // 4. Publish approved events
        const approvedNotPublished = events.filter((e) => {
            const status = normalizeStatus(e.status);
            return status === "approved";
        });
        if (approvedNotPublished.length > 0) {
            actions.push({
                label: "Publish approved events",
                labelAr: "نشر الفعاليات المعتمدة",
                action: "publish",
                count: approvedNotPublished.length,
                route: `/dashboard/organizer?tab=activities&status=approved`,
            });
        }
        
        return actions;
    }, [kpis, events, assignments]);

    // Compliance alerts
    const complianceAlerts = useMemo(() => {
        const compliance = getOrganizerCompliance("org-1");
        const alerts: Array<{
            severity: 'overdue' | 'due_soon';
            text: string;
            textAr: string;
            count: number;
            route: string;
        }> = [];
        
        const overdue = compliance.filter((c) => 
            c.attendanceRecords.status === 'overdue' || c.hoursRegistration.status === 'overdue'
        );
        if (overdue.length > 0) {
            alerts.push({
                severity: 'overdue',
                text: `${overdue.length} completed event${overdue.length > 1 ? 's' : ''} missing finalized attendance`,
                textAr: `${overdue.length} فعالية مكتملة تفتقد الحضور النهائي`,
                count: overdue.length,
                route: `/dashboard/organizer?tab=execution`,
            });
        }
        
        const dueSoon = compliance.filter((c) => {
            const dueAt = c.attendanceRecords.dueAt || c.hoursRegistration.dueAt;
            if (!dueAt) return false;
            const due = new Date(dueAt);
            const now = new Date();
            const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntilDue > 0 && daysUntilDue <= 7 && 
                   (c.attendanceRecords.status !== 'submitted' && c.hoursRegistration.status !== 'submitted');
        });
        if (dueSoon.length > 0) {
            alerts.push({
                severity: 'due_soon',
                text: `${dueSoon.length} event${dueSoon.length > 1 ? 's' : ''} with compliance due soon`,
                textAr: `${dueSoon.length} فعالية مع موعد امتثال قريب`,
                count: dueSoon.length,
                route: `/dashboard/organizer?tab=execution`,
            });
        }
        
        return alerts;
    }, []);

    // Upcoming & Live Events
    const upcomingLiveEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter((e) => {
                if (!e.date) return false;
                const eventDate = new Date(e.date);
                const status = normalizeStatus(e.status);
                // Show events starting today or in the future, or currently published
                return (eventDate >= now || status === 'published') && 
                       (status === 'published' || status === 'approved' || status === 'pending_review');
            })
            .sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateA - dateB;
            })
            .slice(0, 10);
    }, [events]);

    // Filtered events for Activities tab
    const filteredEvents = useMemo(() => {
        let filtered = events;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    (e.titleEn?.toLowerCase().includes(query) || e.titleAr?.toLowerCase().includes(query) || e.title?.toLowerCase().includes(query)) ||
                    (e.locationEn?.toLowerCase().includes(query) || e.locationAr?.toLowerCase().includes(query))
            );
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((e) => normalizeStatus(e.status) === statusFilter);
        }
        return filtered;
    }, [events, searchQuery, statusFilter]);

    // Accreditation data
    const pendingReview = useMemo(() => events.filter((e) => normalizeStatus(e.status) === "pending_review"), [events]);
    const accreditationDecisions = useMemo(() => {
        return events.filter((e) => {
            const status = normalizeStatus(e.status);
            return status === "approved" || (status === "draft" && e.status?.toLowerCase().includes("reject"));
        });
    }, [events]);


    // Convert DemoEvent to Event for EventCard component
    const mapToEventCard = (event: DemoEvent): Event => ({
        id: event.id,
        titleAr: event.titleAr ?? event.title ?? 'الفعالية',
        titleEn: event.titleEn ?? event.title ?? 'Event',
        organizerAr: event.organizerAr ?? 'المنظم',
        organizerEn: event.organizerEn ?? 'Organizer',
        specialty: event.specialty ?? 'General',
        cme_hours: event.cme_hours ?? 0,
        date: event.date ?? new Date().toISOString(),
        locationAr: event.locationAr ?? 'الموقع',
        locationEn: event.locationEn ?? 'Location',
        status:
            event.status === 'published'
                ? 'Published'
                : event.status === 'pending_review'
                ? 'Pending Approval'
                : event.status === 'approved'
                ? 'Published' // Approved events can be treated as published for display
                : 'Draft',
        is_sponsored: !!event.is_sponsored,
        needs_sponsorship: !!event.needs_sponsorship,
        sfda_license: event.sfda_license,
        descriptionAr: event.descriptionAr ?? '',
        descriptionEn: event.descriptionEn ?? '',
        assignedToEventManager: false,
    });

    return (
        <>
            {tab === "overview" && <OverviewTab />}

            {/* Legacy overview code - kept for reference but not rendered */}
            {false && tab === "overview" && (
                <div className="space-y-6">
                    {/* Lifecycle Snapshot Row - Clickable Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div 
                            onClick={() => router.push(`/dashboard/organizer?tab=activities&status=draft`)}
                            className="cursor-pointer"
                        >
                            <LiquidGlassCard 
                                blurIntensity="md" 
                                interactive={true}
                                className="hover:bg-[var(--system-fill)]/20 transition-colors"
                            >
                            <div className="text-center p-4">
                                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                    {language === "ar" ? "مسودة" : "Draft"}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{kpis.draft}</p>
                                <p className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === "ar" ? "فعاليات" : "events"}
                                </p>
                            </div>
                        </LiquidGlassCard>
                        </div>
                        <div 
                            onClick={() => router.push(`/dashboard/organizer?tab=activities&status=pending_review`)}
                            className="cursor-pointer"
                        >
                            <LiquidGlassCard 
                                blurIntensity="md" 
                                interactive={true}
                                className="hover:bg-[var(--system-fill)]/20 transition-colors"
                            >
                            <div className="text-center p-4">
                                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                    {language === "ar" ? "قيد المراجعة" : "Pending Review"}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{kpis.pending_review}</p>
                                <p className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === "ar" ? "فعاليات" : "events"}
                                </p>
                            </div>
                        </LiquidGlassCard>
                        </div>
                        <div 
                            onClick={() => router.push(`/dashboard/organizer?tab=activities&status=approved`)}
                            className="cursor-pointer"
                        >
                            <LiquidGlassCard 
                                blurIntensity="md" 
                                interactive={true}
                                className="hover:bg-[var(--system-fill)]/20 transition-colors"
                            >
                            <div className="text-center p-4">
                                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                    {language === "ar" ? "معتمد" : "Approved"}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{kpis.approved}</p>
                                <p className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === "ar" ? "فعاليات" : "events"}
                                </p>
                            </div>
                        </LiquidGlassCard>
                        </div>
                        <div 
                            onClick={() => router.push(`/dashboard/organizer?tab=activities&status=published`)}
                            className="cursor-pointer"
                        >
                            <LiquidGlassCard 
                                blurIntensity="md" 
                                interactive={true}
                                className="hover:bg-[var(--system-fill)]/20 transition-colors"
                            >
                            <div className="text-center p-4">
                                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                    {language === "ar" ? "منشور" : "Published"}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{kpis.published}</p>
                                <p className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === "ar" ? "فعاليات" : "events"}
                                </p>
                            </div>
                        </LiquidGlassCard>
                        </div>
                        <div 
                            onClick={() => router.push(`/dashboard/organizer?tab=activities&status=closed`)}
                            className="cursor-pointer"
                        >
                            <LiquidGlassCard 
                                blurIntensity="md" 
                                interactive={true}
                                className="hover:bg-[var(--system-fill)]/20 transition-colors"
                            >
                            <div className="text-center p-4">
                                <p className="text-xs text-[var(--secondary-label)] uppercase tracking-wide mb-1">
                                    {language === "ar" ? "مكتمل" : "Completed"}
                                </p>
                                <p className="text-2xl font-bold text-[var(--label)]">{kpis.closed}</p>
                                <p className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === "ar" ? "فعاليات" : "events"}
                                </p>
                            </div>
                        </LiquidGlassCard>
                        </div>
                    </div>
                    
                    {/* Second Row: Compliance Alerts + Next Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Compliance Alerts Panel */}
                        {complianceAlerts.length > 0 ? (
                            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="h-5 w-5 text-[var(--apple-orange)] shrink-0" />
                                    <h3 className="text-lg font-semibold text-[var(--label)]">
                                        {language === "ar" ? "تنبيهات الالتزام" : "Compliance Alerts"}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {complianceAlerts.map((alert, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start justify-between p-3 rounded-lg bg-[var(--system-fill)]/30 border border-[var(--separator)]"
                                        >
                                            <div className="flex items-start gap-3 flex-1">
                                                <AlertCircle 
                                                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                                                        alert.severity === 'overdue' 
                                                            ? 'text-[var(--apple-red)]' 
                                                            : 'text-[var(--apple-orange)]'
                                                    }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-[var(--label)]">
                                                        {language === "ar" ? alert.textAr : alert.text}
                                                    </p>
                                                </div>
                                            </div>
                                            <GlassButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(alert.route)}
                                                className="ml-2 shrink-0"
                                            >
                                                <span className="text-xs">{language === "ar" ? "عرض" : "View"}</span>
                                            </GlassButton>
                                        </div>
                                    ))}
                                    </div>
                                </LiquidGlassCard>
                        ) : (
                            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[var(--apple-green)] shrink-0" />
                                        <div>
                                        <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                            {language === "ar" ? "تنبيهات الالتزام" : "Compliance Alerts"}
                                        </h3>
                                        <p className="text-sm text-[var(--secondary-label)]">
                                            {language === "ar" ? "جميع الفعاليات متوافقة حالياً" : "All events are currently compliant"}
                                        </p>
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                        )}

                        {/* Next Actions Card */}
                        {nextActions.length > 0 ? (
                            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                                    {language === "ar" ? "الإجراءات القادمة" : "Next Actions"}
                            </h3>
                                <div className="space-y-3">
                                {nextActions.map((action, idx) => (
                                    <div
                                        key={idx}
                                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--system-fill)]/30 hover:bg-[var(--system-fill)]/50 transition-colors border border-[var(--separator)]"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <ArrowRight className="h-4 w-4 text-[var(--secondary-label)] shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-[var(--label)]">
                                                {language === "ar" ? action.labelAr : action.label}
                                                    </p>
                                                    <p className="text-xs text-[var(--secondary-label)] mt-0.5">
                                                        {action.count} {language === "ar" ? "فعالية جاهزة" : `event${action.count > 1 ? 's' : ''} ready`}
                                                    </p>
                                                </div>
                                            </div>
                                            <GlassButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(action.route)}
                                                className="ml-2 shrink-0"
                                            >
                                                <span className="text-xs">
                                                    {language === "ar" ? "عرض" : action.action === "submit" ? "Submit" : action.action === "assign_em" ? "Assign" : "View"}
                                            </span>
                                            </GlassButton>
                                    </div>
                                ))}
                                </div>
                            </LiquidGlassCard>
                        ) : (
                            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                                <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                                    {language === "ar" ? "الإجراءات القادمة" : "Next Actions"}
                                </h3>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    {language === "ar" ? "لا توجد إجراءات معلقة حالياً" : "No pending actions right now."}
                                </p>
                            </LiquidGlassCard>
                        )}
                    </div>

                    {/* Third Row: Upcoming & Live Events */}
                    {upcomingLiveEvents.length > 0 && (
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                                {language === "ar" ? "الفعاليات القادمة والجارية" : "Upcoming & Live Events"}
                            </h3>
                            <div className="space-y-2">
                                {upcomingLiveEvents.map((event) => {
                                    const status = normalizeStatus(event.status);
                                    const hasEM = assignments.some((a: any) => a.eventId === event.id && a.status === 'accepted');
                                    const eventDate = event.date ? new Date(event.date) : new Date();
                                    
                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--system-fill)]/30 border border-[var(--separator)] hover:bg-[var(--system-fill)]/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-[var(--label)] truncate">
                                                        {language === "ar" ? event.titleAr : event.titleEn || event.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--secondary-label)]">
                                                        <span>
                                                            {eventDate.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs capitalize shrink-0"
                                                        >
                                                            {status === "published" 
                                                                ? (language === "ar" ? "منشور" : "Published")
                                                                : status === "approved"
                                                                ? (language === "ar" ? "معتمد" : "Approved")
                                                                : status === "pending_review"
                                                                ? (language === "ar" ? "قيد المراجعة" : "Pending Review")
                                                                : status}
                                                        </Badge>
                                                        {hasEM ? (
                                                            <span className="flex items-center gap-1 text-[var(--apple-green)]">
                                                                <Users className="h-3 w-3" />
                                                                <span>{language === "ar" ? "مدير معين" : "EM assigned"}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[var(--secondary-label)]">
                                                                {language === "ar" ? "غير معين" : "Not assigned"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <GlassButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(buildRoute.organizerEvent(event.id, 'summary'))}
                                                    className="shrink-0"
                                                >
                                                    <span className="text-xs">{language === "ar" ? "فتح" : "Open"}</span>
                                                </GlassButton>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </LiquidGlassCard>
                    )}
                </div>
            )}

            {tab === "activities" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)]">
                                {filteredEvents.length} {language === "ar" ? "نشاط" : "activities"}
                            </p>
                        </div>
                        <GlassButton onClick={() => router.push("/dashboard/organizer/events/create")}>
                            <Plus className="h-4 w-4 mr-2" />
                            {language === "ar" ? "إنشاء نشاط" : "Create Activity"}
                        </GlassButton>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-label)]" />
                            <Input
                                placeholder={language === "ar" ? "بحث..." : "Search..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--system-background)] text-[var(--label)]"
                        >
                            <option value="all">{language === "ar" ? "جميع الحالات" : "All Statuses"}</option>
                            <option value="draft">{language === "ar" ? "مسودة" : "Draft"}</option>
                            <option value="pending_review">{language === "ar" ? "قيد المراجعة" : "Pending Review"}</option>
                            <option value="approved">{language === "ar" ? "معتمد" : "Approved"}</option>
                            <option value="published">{language === "ar" ? "منشور" : "Published"}</option>
                            <option value="closed">{language === "ar" ? "مكتمل" : "Closed"}</option>
                        </select>
                    </div>

                    {/* Events Grid */}
                    {loading ? (
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-8 text-center">
                            <p className="text-[var(--secondary-label)]">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
                        </LiquidGlassCard>
                    ) : error ? (
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-8 text-center">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-[var(--apple-orange)]" />
                            <p className="text-[var(--secondary-label)]">{error}</p>
                        </LiquidGlassCard>
                    ) : filteredEvents.length === 0 ? (
                        <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-8 text-center">
                            <p className="text-[var(--secondary-label)]">
                                {language === "ar" ? "لا توجد أنشطة" : "No activities found"}
                            </p>
                        </LiquidGlassCard>
                    ) : (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((event) => {
                                const status = normalizeStatus(event.status);
                                let primaryAction: { label: string; onClick: () => void } | undefined;

                                if (status === "draft") {
                                    primaryAction = {
                                        label: language === "ar" ? "تحرير / تقديم الاعتماد" : "Edit / Submit accreditation",
                                        onClick: () => router.push(buildRoute.organizerEventEdit(event.id)),
                                    };
                                } else if (status === "approved") {
                                    primaryAction = {
                                        label: language === "ar" ? "نشر" : "Publish",
                                        onClick: () => router.push(buildRoute.organizerEvent(event.id)),
                                    };
                                } else if (status === "published") {
                                    primaryAction = {
                                        label: language === "ar" ? "إدارة التنفيذ" : "Manage execution",
                                        onClick: () => router.push(buildRoute.organizerEvent(event.id)),
                                    };
                                }

                                return (
                                    <ActivityCard
                                        key={event.id}
                                        event={mapToEventCard(event)}
                                        context="organizer"
                                        variant="full"
                                        showDescription={true}
                                        actionButton={primaryAction}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {tab === "accreditation" && (
                <div className="space-y-6">

                    {/* Pending Review Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {language === "ar" ? "قيد المراجعة" : "Pending Review"}
                        </h3>
                        {pendingReview.length === 0 ? (
                            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 text-center">
                                <p className="text-[var(--secondary-label)]">
                                    {language === "ar" ? "لا توجد طلبات قيد المراجعة" : "No pending review applications"}
                                </p>
                            </LiquidGlassCard>
                        ) : (
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {pendingReview.map((event) => (
                                    <ActivityCard
                                        key={event.id}
                                        event={mapToEventCard(event)}
                                        context="organizer"
                                        variant="compact"
                                        onView={() => router.push(buildRoute.organizerEvent(event.id, 'summary'))}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Decisions Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                            {language === "ar" ? "القرارات" : "Decisions"}
                        </h3>
                        {accreditationDecisions.length === 0 ? (
                            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6 text-center">
                                <p className="text-[var(--secondary-label)]">
                                    {language === "ar" ? "لا توجد قرارات سابقة" : "No previous decisions"}
                                </p>
                            </LiquidGlassCard>
                        ) : (
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {accreditationDecisions.map((event) => (
                                    <ActivityCard
                                        key={event.id}
                                        event={mapToEventCard(event)}
                                        context="organizer"
                                        variant="compact"
                                        onView={() => router.push(buildRoute.organizerEvent(event.id, 'summary'))}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {tab === "execution" && (
                <ExecutionTab events={events} language={language} router={router} loading={loading} />
            )}

            {tab === "sponsors" && (
                <SponsorsTab language={language} />
            )}
        </>
    );
}

export default function OrganizerView() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <OrganizerViewContent />
        </Suspense>
    );
}
