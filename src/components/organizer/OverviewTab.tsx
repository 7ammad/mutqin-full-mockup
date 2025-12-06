"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { KPICard } from "@/components/shared/KPICard";
import { DashboardSection } from "@/components/shared/DashboardSection";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getOrganizerCompliance, getState } from "@/context/demoStore";
import { convertDemoEventToEvent } from "@/lib/eventConverter";
import {
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { DemoEvent } from "@/context/demoSeed";

export default function OverviewTab() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const state = getState();
  const events = state.events.filter((e) => e.organizerId === "org-1");

  useEffect(() => {
    const fetchKPIs = async () => {
      if (!user?.id) return;
      
      try {
        const res = await api.getDashboardKPIs({
          persona: "ORGANIZER",
          userId: user.id,
        });
        setKpis(res.kpis);
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [user?.id]);

  // Next actions
  const nextActions = useMemo(() => {
    const actions: Array<{
      label: string;
      labelAr: string;
      action: string;
      count: number;
      route: string;
    }> = [];

    const draftEvents = events.filter((e) => e.status === "draft");
    if (draftEvents.length > 0) {
      actions.push({
        label: "Submit for accreditation",
        labelAr: " ",
        action: "submit",
        count: draftEvents.length,
        route: `/dashboard/organizer?tab=accreditation`,
      });
    }

    const approvedNotPublished = events.filter((e) => e.status === "approved");
    if (approvedNotPublished.length > 0) {
      actions.push({
        label: "Publish approved events",
        labelAr: "  ",
        action: "publish",
        count: approvedNotPublished.length,
        route: `/dashboard/organizer?tab=activities&status=approved`,
      });
    }

    return actions;
  }, [events]);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => {
        if (!e.date) return false;
        const eventDate = new Date(e.date);
        return (
          eventDate >= now &&
          (e.status === "published" || e.status === "approved")
        );
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [events]);

  // Compliance alerts
  const complianceAlerts = useMemo(() => {
    const compliance = getOrganizerCompliance("org-1");
    const alerts: Array<{
      severity: "overdue" | "due_soon";
      text: string;
      textAr: string;
      count: number;
      route: string;
    }> = [];

    const overdue = compliance.filter(
      (c) =>
        c.attendanceRecords.status === "overdue" ||
        c.hoursRegistration.status === "overdue"
    );
    if (overdue.length > 0) {
      alerts.push({
        severity: "overdue",
        text: `${overdue.length} completed event${overdue.length > 1 ? "s" : ""} missing finalized attendance`,
        textAr: `${overdue.length}     `,
        count: overdue.length,
        route: `/dashboard/organizer?tab=execution`,
      });
    }

    return alerts;
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LiquidGlassCard key={i} blurIntensity="md" className="p-6">
              <div className="h-20 bg-[var(--system-fill)] animate-pulse rounded" />
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <DashboardSection spacing="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={language === "ar" ? kpi.title : kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={
                kpi.id === "total-events"
                  ? FileText
                  : kpi.id === "pending-approval"
                  ? Clock
                  : kpi.id === "published"
                  ? CheckCircle2
                  : TrendingUp
              }
              color={kpi.color}
            />
          ))}
        </div>
      </DashboardSection>

      {/* Next Actions */}
      {nextActions.length > 0 && (
        <DashboardSection
          title={language === "ar" ? " " : "Next Actions"}
          description={
            language === "ar"
              ? "  "
              : "Actions that require your attention"
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextActions.map((action, index) => (
              <LiquidGlassCard
                key={index}
                blurIntensity="md"
                interactive
                className="p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/20"
                      >
                        {action.count}
                      </Badge>
                      <h3 className="text-lg font-semibold text-[var(--label)]">
                        {language === "ar" ? action.labelAr : action.label}
                      </h3>
                    </div>
                  </div>
                  <GlassButton
                    size="sm"
                    onClick={() => router.push(action.route)}
                    className="flex-shrink-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </GlassButton>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <DashboardSection
          title={language === "ar" ? " " : "Compliance Alerts"}
        >
          <div className="space-y-3">
            {complianceAlerts.map((alert, index) => (
              <LiquidGlassCard
                key={index}
                blurIntensity="md"
                className={`p-4 border-l-4 ${
                  alert.severity === "overdue"
                    ? "border-red-500"
                    : "border-[var(--apple-orange)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      alert.severity === "overdue"
                        ? "text-red-500"
                        : "text-[var(--apple-orange)]"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--label)]">
                      {language === "ar" ? alert.textAr : alert.text}
                    </p>
                  </div>
                  <GlassButton
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(alert.route)}
                  >
                    {language === "ar" ? "" : "View"}
                  </GlassButton>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Upcoming Events */}
      <DashboardSection
        title={language === "ar" ? " " : "Upcoming Events"}
        description={
          language === "ar"
            ? "     "
            : "Upcoming events that need attention"
        }
        headerActions={
          <GlassButton
            size="sm"
            variant="outline"
            onClick={() => router.push("/dashboard/organizer/events/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "ar" ? " " : "Create Event"}
          </GlassButton>
        }
      >
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <ActivityCard key={event.id} event={convertDemoEventToEvent(event)} context="organizer" variant="full" />
            ))}
          </div>
        ) : (
          <LiquidGlassCard blurIntensity="md" className="p-12">
            <EmptyState
              title={
                language === "ar"
                  ? "   "
                  : "No upcoming events"
              }
              description={
                language === "ar"
                  ? "   "
                  : "Start by creating a new event"
              }
              icon={Calendar}
            />
          </LiquidGlassCard>
        )}
      </DashboardSection>
    </div>
  );
}

