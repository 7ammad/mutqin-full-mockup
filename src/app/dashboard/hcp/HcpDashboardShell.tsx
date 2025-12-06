"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HcpDiscoverTab } from "./tabs/HcpDiscoverTab";
import { HcpJourneyTab } from "./tabs/HcpJourneyTab";
import { HcpFilesTab } from "./tabs/HcpFilesTab";
import { HcpCreditsTab } from "./tabs/HcpCreditsTab";
import CompactCMETracker from "@/components/hcp/CompactCMETracker";

type TabKey = "discover" | "journey" | "files" | "credits";

function HcpDashboardShellContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const rawTab = searchParams.get("tab") || "discover";
    
    // Normalize tab keys: handle legacy aliases and unknown tabs
    let effectiveTab: TabKey;
    if (rawTab === "registrations") {
        // Legacy alias: registrations -> journey (backward compat, no redirect to avoid loops)
        effectiveTab = "journey";
    } else if (rawTab === "certs_reviews") {
        // Legacy alias: certs_reviews -> credits (redirect to normalize URL)
        effectiveTab = "credits";
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", "credits");
        router.replace(`/dashboard/hcp?${params.toString()}`, { scroll: false });
    } else if (rawTab === "discover" || rawTab === "journey" || rawTab === "files" || rawTab === "credits") {
        effectiveTab = rawTab as TabKey;
    } else {
        // Unknown tab -> default to discover (defensive fallback)
        effectiveTab = "discover";
    }

    return (
        <div className="space-y-6">
            {/* Compact CME Tracker - Mobile only (desktop shows in header) */}
            <div className="sm:hidden">
                <CompactCMETracker variant="circular" expandable={true} />
            </div>

            {/* Content Views - Tabs are in global sidebar */}
            {effectiveTab === "discover" && <HcpDiscoverTab />}
            {effectiveTab === "journey" && <HcpJourneyTab />}
            {effectiveTab === "files" && <HcpFilesTab />}
            {effectiveTab === "credits" && <HcpCreditsTab />}
        </div>
    );
}

export default function HcpDashboardShell() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <HcpDashboardShellContent />
        </Suspense>
    );
}

