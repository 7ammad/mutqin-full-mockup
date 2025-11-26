"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedEventWizard from '@/components/organizer/EnhancedEventWizard';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { usePersona } from '@/context/PersonaContext';
import { Event } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { events, addEvent } = usePersona();
    const event = events.find(e => e.id === id) || INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    const handleComplete = (updatedEvent: Event) => {
        addEvent(updatedEvent);
        router.push(`/dashboard/organizer/events/${id}`);
    };

    const handleCancel = () => {
        router.push(`/dashboard/organizer/events/${id}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Edit Event
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Update event details and settings
                </p>
            </div>
            <EnhancedEventWizard onComplete={handleComplete} onCancel={handleCancel} />
        </div>
    );
}

