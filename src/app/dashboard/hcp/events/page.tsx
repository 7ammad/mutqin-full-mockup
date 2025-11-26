"use client";

import DiscoveryGrid from '@/components/hcp/DiscoveryGrid';

export default function HCPEventsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Discover Events
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Browse and register for accredited medical education events
                </p>
            </div>
            <DiscoveryGrid />
        </div>
    );
}

