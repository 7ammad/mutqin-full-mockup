"use client";

import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import HcpDashboardShell from "./HcpDashboardShell";

export default function HCPDashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
        <HcpDashboardShell />
      </Suspense>
    </ErrorBoundary>
  );
}

