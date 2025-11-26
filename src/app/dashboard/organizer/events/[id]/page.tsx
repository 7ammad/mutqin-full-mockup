"use client";

import { use } from 'react';
import EventDashboard from '@/components/organizer/EventDashboard';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrganizerEventDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    return <EventDashboard eventId={id} />;
}

