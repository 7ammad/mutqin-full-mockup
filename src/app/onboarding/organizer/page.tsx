"use client";

import { useRouter } from 'next/navigation';
import { OrganizerOnboarding } from '@/components/onboarding/OrganizerOnboarding';

export default function OrganizerOnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/dashboard/organizer');
    };

    return <OrganizerOnboarding onComplete={handleComplete} />;
}

