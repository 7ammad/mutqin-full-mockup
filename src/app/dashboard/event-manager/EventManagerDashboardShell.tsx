"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { getEventManagerAssignments } from "@/context/demoStore";
import EventManagerInboxTab from "./tabs/EventManagerInboxTab";
import EventManagerLiveOpsTab from "./tabs/EventManagerLiveOpsTab";
import EventManagerAttendanceTab from "./tabs/EventManagerAttendanceTab";
import EventManagerHandoverTab from "./tabs/EventManagerHandoverTab";
import EventManagerAnalyticsTab from "./tabs/EventManagerAnalyticsTab";

type TabKey = "inbox" | "live-ops" | "attendance" | "handover" | "analytics" | "assignments" | "checkin";

export default function EventManagerDashboardShell() {
    const searchParams = useSearchParams();
    const rawTab = (searchParams.get("tab") || "inbox") as TabKey;
    
    // Handle legacy tab aliases and unknown tabs: assignments -> inbox, checkin -> live-ops, unknown -> inbox
    const effectiveTab = useMemo(() => {
        if (rawTab === 'assignments') return 'inbox';
        if (rawTab === 'checkin') return 'live-ops';
        // Defensive: unknown tab -> default to inbox
        if (rawTab === 'inbox' || rawTab === 'live-ops' || rawTab === 'attendance' || rawTab === 'handover' || rawTab === 'analytics') {
            return rawTab;
        }
        return 'inbox';
    }, [rawTab]);

    // Get Event Manager assignments - use fixed emId for demo
    const emId = "em-1";
    const assignmentsData = useMemo(() => getEventManagerAssignments(emId), [emId]);

    return (
        <div className="space-y-6">
            <ErrorBoundary>
                <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
                    {effectiveTab === "inbox" && <EventManagerInboxTab assignmentsData={assignmentsData} />}
                    {effectiveTab === "live-ops" && <EventManagerLiveOpsTab assignmentsData={assignmentsData} />}
                    {effectiveTab === "attendance" && <EventManagerAttendanceTab assignmentsData={assignmentsData} />}
                    {effectiveTab === "handover" && <EventManagerHandoverTab assignmentsData={assignmentsData} />}
                    {effectiveTab === "analytics" && <EventManagerAnalyticsTab assignmentsData={assignmentsData} />}
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}



