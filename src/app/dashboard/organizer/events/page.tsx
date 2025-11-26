"use client";

import Dashboard from '@/components/organizer/Dashboard';
import { useRouter } from 'next/navigation';

export default function OrganizerEventsPage() {
    const router = useRouter();
    
    return (
        <Dashboard 
            onCreateClick={() => router.push('/dashboard/organizer/events/create')}
            onEventClick={(eventId) => router.push(`/dashboard/organizer/events/${eventId}`)}
        />
    );
}

