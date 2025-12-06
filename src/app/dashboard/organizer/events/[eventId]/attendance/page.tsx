"use client";

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default function LegacyAttendanceRedirect({ params }: PageProps) {
    const { eventId } = use(params);
    const router = useRouter();

    useEffect(() => {
        router.replace(`/dashboard/organizer/events/${eventId}?view=execution`);
    }, [eventId, router]);

    return null;
}

