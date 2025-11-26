"use client";

import ApplicationQueue from '@/components/regulator/ApplicationQueue';

export default function RegulatorApplicationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Applications Queue
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Review and approve event applications
                </p>
            </div>
            <ApplicationQueue />
        </div>
    );
}

