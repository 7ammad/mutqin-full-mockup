"use client";

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default function LegacyCertificatesRedirect({ params }: PageProps) {
    const { eventId } = use(params);
    const router = useRouter();

    useEffect(() => {
        router.replace(`/dashboard/organizer/events/${eventId}?view=certificates`);
    }, [eventId, router]);

    return null;
}

