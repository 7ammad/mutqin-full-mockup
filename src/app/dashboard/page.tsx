"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (role) {
        // Redirect to role-specific dashboard
        const slug = role.toLowerCase().replace('_', '-');
        router.push(`/dashboard/${slug}`);
      }
    }
  }, [isAuthenticated, isLoading, role, router]);

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  return null; // Will redirect
}

















