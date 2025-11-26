"use client";

import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const VendorView = lazy(() => import("@/components/vendor/VendorView"));

export default function VendorDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <VendorView />
      </Suspense>
    </ErrorBoundary>
  );
}

