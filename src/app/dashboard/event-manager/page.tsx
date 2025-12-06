"use client";

import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import EventManagerDashboardShell from "./EventManagerDashboardShell";

export default function EventManagerDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <EventManagerDashboardShell />
      </Suspense>
    </ErrorBoundary>
  );
}

