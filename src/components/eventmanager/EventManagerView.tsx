"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Calendar, CheckCircle, Clock, FileText, Inbox, Activity } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import EventManagerAttendanceTab from "./EventManagerAttendanceTab";
import HandoverPackTab from "./HandoverPackTab";
import EventManagerAnalyticsTab from "./EventManagerAnalyticsTab";
import { api } from "@/lib/api";
import type { DemoEvent } from "@/context/demoSeed";
import { useToast } from "@/components/ui/toast-context";
import { buildRoute } from "@/lib/routes";

type TabKey = "inbox" | "live-ops" | "attendance" | "handover" | "analytics";

export default function EventManagerView() {
  const { events } = usePersona();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get("tab") as TabKey) || "inbox";
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [assignmentsData, setAssignmentsData] = useState<
    { event: DemoEvent; assignment: { id: string; eventId: string; organizerId: string; eventManagerId: string; status: "pending" | "accepted" | "declined" } }[]
  >([]);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(true);
  const [assignmentsError, setAssignmentsError] = useState<string>("");

  const refreshAssignments = async () => {
    setLoadingAssignments(true);
    setAssignmentsError("");
    
    // Data source works immediately, no MSW waiting needed
    try {
      const { getEventManagerAssignments } = await import('@/lib/dataSource');
      const assignments = await getEventManagerAssignments("em-1");
      setAssignmentsData(assignments);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load assignments";
      setAssignmentsError(message);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    refreshAssignments();
  }, []);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const displayAssignments = useMemo(() => {
    return assignmentsData.map(({ assignment, event }) => {
      const metaEvent =
        events.find((e) => e.id === event.id) ??
        events.find((e) => e.id === "evt-1") ??
        events[0];
      const displayEvent: DemoEvent = metaEvent
        ? { ...metaEvent, ...event, status: event.status } as DemoEvent
        : (event as DemoEvent);
      return { assignment, event: displayEvent };
    });
  }, [assignmentsData, events]);

  const activeAssignments = assignmentsData.filter((a) => a.assignment.status === "accepted").length;
  const pendingAssignments = assignmentsData.filter((a) => a.assignment.status === "pending").length;
  const completedAssignments = assignmentsData.filter((a) => a.assignment.status === "declined").length;

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabKey | null;
    if (tabFromUrl && ["inbox", "live-ops", "attendance", "handover", "analytics"].includes(tabFromUrl)) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {tab === "inbox" && (
        <div className="space-y-4">
          {loadingAssignments && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <LiquidGlassCard key={i} blurIntensity="lg" interactive={false} className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-[var(--system-fill)] rounded w-20"></div>
                      <div className="h-8 bg-[var(--system-fill)] rounded w-16"></div>
                    </div>
                  </LiquidGlassCard>
                ))}
              </div>
              <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-[var(--system-fill)] rounded w-48"></div>
                  <div className="h-4 bg-[var(--system-fill)] rounded w-full"></div>
                  <div className="h-4 bg-[var(--system-fill)] rounded w-3/4"></div>
                </div>
              </LiquidGlassCard>
            </div>
          )}
          {!loadingAssignments && assignmentsError && (
            <LiquidGlassCard blurIntensity="lg" interactive={false} className="p-6">
              <div className="text-center">
                <p className="text-[var(--apple-red)] mb-2">{assignmentsError}</p>
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={refreshAssignments}
                  className="gap-2"
                >
                  {language === "ar" ? " " : "Retry"}
                </GlassButton>
              </div>
            </LiquidGlassCard>
          )}
          {!loadingAssignments && !assignmentsError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LiquidGlassCard blurIntensity="lg" interactive={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--secondary-label)] mb-1">
                    {language === "ar" ? " " : "Active Assignments"}
                  </p>
                  <p className="text-2xl font-bold text-[var(--label)]">{activeAssignments}</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                  <Calendar className="w-6 h-6 text-[var(--apple-blue)]" />
                </div>
              </div>
            </LiquidGlassCard>
            <LiquidGlassCard blurIntensity="lg" interactive={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--secondary-label)] mb-1">
                    {language === "ar" ? " " : "Pending"}
                  </p>
                  <p className="text-2xl font-bold text-[var(--label)]">{pendingAssignments}</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--apple-orange)]/10">
                  <Clock className="w-6 h-6 text-[var(--apple-orange)]" />
                </div>
              </div>
            </LiquidGlassCard>
            <LiquidGlassCard blurIntensity="lg" interactive={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--secondary-label)] mb-1">
                    {language === "ar" ? "" : "Completed"}
                  </p>
                  <p className="text-2xl font-bold text-[var(--label)]">{completedAssignments}</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--apple-green)]/10">
                  <CheckCircle className="w-6 h-6 text-[var(--apple-green)]" />
                </div>
              </div>
            </LiquidGlassCard>
          </div>

          {displayAssignments.length === 0 ? (
            <EmptyState
              title={language === "ar" ? "   " : "No assignments"}
              description={language === "ar" ? "      .         ." : "No new assignments in inbox. New tasks will appear here when organizers create assignments."}
              icon={Inbox}
              actionLabel={language === "ar" ? "   " : "Reset demo data"}
              onAction={async () => {
                try {
                  await fetch('/api/demo/reset', { method: 'POST' });
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to reset demo data:', error);
                }
              }}
            />
          ) : (
            displayAssignments.map(({ assignment, event }) => {
              const eventForDisplay = event;
              if (!eventForDisplay) return null;
              const statusLabel =
                assignment.status === "accepted"
                  ? language === "ar"
                    ? ""
                    : "Active"
                  : assignment.status === "pending"
                  ? language === "ar"
                    ? " "
                    : "Pending"
                  : language === "ar"
                  ? ""
                  : "Declined";

              return (
                <div
                  key={assignment.id}
                  onClick={() => router.push(buildRoute.eventManagerEvent(assignment.eventId))}
                  className="cursor-pointer"
                >
                <LiquidGlassCard 
                  blurIntensity="lg" 
                  interactive={true}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                          {language === "ar" 
                            ? (eventForDisplay as DemoEvent).titleAr || (eventForDisplay as DemoEvent).title || "-"
                            : (eventForDisplay as DemoEvent).titleEn || (eventForDisplay as DemoEvent).title || "-"}
                        </h3>
                        <p className="text-sm text-[var(--secondary-label)]">
                          {language === "ar" 
                            ? eventForDisplay.organizerAr || "-"
                            : eventForDisplay.organizerEn || "-"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.status === "accepted"
                            ? "bg-[var(--apple-blue)]/10 text-[var(--apple-blue)]"
                            : assignment.status === "pending"
                            ? "bg-[var(--apple-orange)]/10 text-[var(--apple-orange)]"
                            : "bg-[var(--apple-green)]/10 text-[var(--apple-green)]"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--secondary-label)] mb-1">
                          {language === "ar" ? "" : "Date"}
                        </p>
                        <p className="text-sm font-medium text-[var(--label)]">
                          {eventForDisplay.date
                            ? new Date(eventForDisplay.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--secondary-label)] mb-1">
                          {language === "ar" ? "" : "City"}
                        </p>
                        <p className="text-sm font-medium text-[var(--label)]">
                          {(eventForDisplay as DemoEvent).city || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--secondary-label)] mb-1">
                          {language === "ar" ? "" : "Location"}
                        </p>
                        <p className="text-sm font-medium text-[var(--label)]">
                          {language === "ar" 
                            ? eventForDisplay.locationAr || "-" 
                            : eventForDisplay.locationEn || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--secondary-label)] mb-1">
                          {language === "ar" ? " " : "CME Hours"}
                        </p>
                        <p className="text-sm font-medium text-[var(--label)]">
                          {eventForDisplay.cme_hours ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                      {assignment.status === "pending" && (
                        <>
                          <GlassButton
                            variant="default"
                            size="sm"
                            onClick={async () => {
                              try {
                                await api.respondAssignment({ assignmentId: assignment.id, decision: "accept" });
                                await refreshAssignments();
                                showToast(language === "ar" ? "  " : "Assignment accepted", "success");
                              } catch (err) {
                                const message = err instanceof Error ? err.message : (language === "ar" ? "  " : "Unable to accept assignment");
                                showToast(message, "info");
                              }
                            }}
                          >
                            {language === "ar" ? "" : "Accept"}
                          </GlassButton>
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await api.respondAssignment({ assignmentId: assignment.id, decision: "decline" });
                                await refreshAssignments();
                                showToast(language === "ar" ? "  " : "Assignment declined", "success");
                              } catch (err) {
                                const message = err instanceof Error ? err.message : (language === "ar" ? "  " : "Unable to decline assignment");
                                showToast(message, "info");
                              }
                            }}
                          >
                            {language === "ar" ? "" : "Decline"}
                          </GlassButton>
                        </>
                      )}
                    </div>
                  </div>
                </LiquidGlassCard>
                </div>
              );
            })
          )}
            </>
          )}
        </div>
      )}

      {tab === "live-ops" && (
        <div className="space-y-4">
          {displayAssignments.filter(({ assignment }) => assignment.status === "accepted").length === 0 ? (
            <EmptyState
              title={language === "ar" ? "   " : "No accepted assignments"}
              description={language === "ar" ? "       .      ." : "No accepted assignments to open check-in console. Accept an assignment from Inbox first."}
              icon={Activity}
              actionLabel={language === "ar" ? "   " : "Reset demo data"}
              onAction={async () => {
                try {
                  await fetch('/api/demo/reset', { method: 'POST' });
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to reset demo data:', error);
                }
              }}
            />
          ) : (
            displayAssignments
              .filter(({ assignment }) => assignment.status === "accepted")
              .map(({ assignment, event }) => (
                <LiquidGlassCard key={assignment.id} blurIntensity="lg" interactive={true} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                          {language === "ar" 
                            ? (event as DemoEvent).titleAr || (event as DemoEvent).title || "-"
                            : (event as DemoEvent).titleEn || (event as DemoEvent).title || "-"}
                        </h3>
                        <p className="text-sm text-[var(--secondary-label)]">
                          {language === "ar" 
                            ? event.organizerAr || "-"
                            : event.organizerEn || "-"}
                        </p>
                      </div>
                    </div>
                    <GlassButton
                      variant="default"
                      size="sm"
                      onClick={() => router.push(buildRoute.eventManagerEventCheckin(assignment.eventId))}
                      className="gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      {language === "ar" ? "  " : "Open Check-In"}
                    </GlassButton>
                  </div>
                </LiquidGlassCard>
              ))
          )}
        </div>
      )}

      {tab === "attendance" && (
        <EventManagerAttendanceTab
          assignments={assignmentsData}
          language={language}
        />
      )}

      {tab === "handover" && (
        <HandoverPackTab
          assignments={assignmentsData}
          language={language}
        />
      )}

      {tab === "analytics" && (
        <EventManagerAnalyticsTab
          assignments={displayAssignments.map(({ assignment, event }) => ({ assignment, event }))}
          language={language}
        />
      )}
    </div>
  );
}
