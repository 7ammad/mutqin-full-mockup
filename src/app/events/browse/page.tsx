"use client";

import DiscoveryGrid from '@/components/hcp/DiscoveryGrid';

export default function BrowseEventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Browse Events
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Filter and explore events by specialty, date, and location
                </p>
            </div>
            <DiscoveryGrid />
        </div>
    );
}

