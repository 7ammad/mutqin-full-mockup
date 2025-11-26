"use client";

import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const HCPView = lazy(() => import("@/components/hcp/HCPView"));

export default function HCPDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <HCPView />
      </Suspense>
    </ErrorBoundary>
  );
}

