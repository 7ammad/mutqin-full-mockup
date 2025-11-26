"use client";

import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const RegulatorView = lazy(() => import("@/components/regulator/RegulatorView"));

export default function RegulatorDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <RegulatorView />
      </Suspense>
    </ErrorBoundary>
  );
}

