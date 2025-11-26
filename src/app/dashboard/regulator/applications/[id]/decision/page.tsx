"use client";

import { use } from 'react';
import DecisionManagement from '@/components/regulator/DecisionManagement';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicationDecisionPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Decision Management
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Approve or reject application for {event.titleEn}
                </p>
            </div>
            <DecisionManagement />
        </div>
    );
}

