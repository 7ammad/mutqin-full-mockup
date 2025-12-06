"use client";

import ApplicationQueue from '@/components/regulator/ApplicationQueue';

export default function RegulatorApplicationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Review and approve event applications
                </p>
            </div>
            <ApplicationQueue queueEvents={[]} />
        </div>
    );
}
