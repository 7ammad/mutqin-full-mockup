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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Set up your medical education event
                </p>
            </div>
            <EnhancedEventWizard onComplete={handleComplete} onCancel={handleCancel} />
        </div>
    );
}

