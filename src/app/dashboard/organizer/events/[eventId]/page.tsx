"use client";

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import EventMasterTabs from './EventMasterTabs';

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default function OrganizerEventMasterPage({ params }: PageProps) {
    const { eventId } = use(params);
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <ErrorBoundary>
                <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
                    <EventMasterTabs eventId={eventId} />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

