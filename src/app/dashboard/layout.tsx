"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <DashboardLayout role={role!}>{children}</DashboardLayout>;
}

