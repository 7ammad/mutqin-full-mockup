"use client";

import { use } from 'react';
import CampaignAnalytics from '@/components/vendor/CampaignAnalytics';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Detailed performance metrics and insights
                </p>
            </div>
            <CampaignAnalytics />
        </div>
    );
}

