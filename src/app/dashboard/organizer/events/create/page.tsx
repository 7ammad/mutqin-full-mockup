"use client";

import { useRouter } from 'next/navigation';
import EnhancedEventWizard from '@/components/organizer/EnhancedEventWizard';
import { usePersona } from '@/context/PersonaContext';
import { Event } from '@/lib/mockData';

export default function CreateEventPage() {
    const router = useRouter();
    const { addEvent } = usePersona();

    const handleComplete = (event: Event) => {
        addEvent(event);
        router.push(`/dashboard/organizer/events/${event.id}`);
    };

    const handleCancel = () => {
        router.push('/dashboard/organizer/events');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Create New Event
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Set up your medical education event
                </p>
            </div>
            <EnhancedEventWizard onComplete={handleComplete} onCancel={handleCancel} />
        </div>
    );
}

