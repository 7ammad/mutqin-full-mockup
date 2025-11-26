"use client";

import { use } from 'react';
import CertificateGenerator from '@/components/organizer/CertificateGenerator';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface PageProps {
    readonly params: Promise<{ id: string }>;
}

export default function EventCertificatesPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Certificate Management
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Generate and manage certificates for {event.titleEn}
                </p>
            </div>
            <CertificateGenerator />
        </div>
    );
}

