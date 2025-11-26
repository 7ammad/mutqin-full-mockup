"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationFlow } from '@/components/hcp/RegistrationFlow';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RegisterPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    if (isLoading) {
        return <LoadingSkeleton variant="dashboard" />;
    }

    if (!isAuthenticated) {
        router.push(`/auth/login?redirect=/events/${id}/register`);
        return null;
    }

    const handleComplete = () => {
        router.push(`/dashboard/hcp/tickets/${id}`);
    };

    const handleCancel = () => {
        router.push(`/events/${id}`);
    };

    return <RegistrationFlow event={event} onComplete={handleComplete} onCancel={handleCancel} />;
}

