"use client";

import { use } from 'react';
import RegistrationManagement from '@/components/eventmanager/RegistrationManagement';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventRegistrationsPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Event Registrations
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Manage registrations for {event.titleEn}
                </p>
            </div>
            <RegistrationManagement eventId={id} />
        </div>
    );
}

