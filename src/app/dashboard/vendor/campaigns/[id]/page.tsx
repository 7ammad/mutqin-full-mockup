"use client";

import { use } from 'react';
import CampaignAnalytics from '@/components/vendor/CampaignAnalytics';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Campaign Analytics
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Detailed performance metrics and insights
                </p>
            </div>
            <CampaignAnalytics />
        </div>
    );
}

