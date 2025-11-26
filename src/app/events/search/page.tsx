"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DiscoveryGrid from '@/components/hcp/DiscoveryGrid';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Search Results
                </h1>
                {query && (
                    <p className="text-[var(--secondary-label)]">
                        Results for: <span className="font-semibold">{query}</span>
                    </p>
                )}
            </div>
            <DiscoveryGrid />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
            <SearchResults />
        </Suspense>
    );
}

