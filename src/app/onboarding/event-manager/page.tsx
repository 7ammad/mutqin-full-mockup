"use client";

import { useRouter } from 'next/navigation';
import { EventManagerOnboarding } from '@/components/onboarding/EventManagerOnboarding';

export default function EventManagerOnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/dashboard/event-manager');
    };

    return <EventManagerOnboarding onComplete={handleComplete} />;
}

