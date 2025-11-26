"use client";

import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const OrganizerView = lazy(() => import("@/components/organizer/OrganizerView"));

export default function OrganizerDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <OrganizerView />
      </Suspense>
    </ErrorBoundary>
  );
}

