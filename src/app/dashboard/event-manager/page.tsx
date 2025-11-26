"use client";

import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const EventManagerView = lazy(() => import("@/components/eventmanager/EventManagerView"));

export default function EventManagerDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <EventManagerView />
      </Suspense>
    </ErrorBoundary>
  );
}

