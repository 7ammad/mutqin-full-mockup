"use client";

import { useRouter } from 'next/navigation';
import { RegulatorOnboarding } from '@/components/onboarding/RegulatorOnboarding';

export default function RegulatorOnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/dashboard/regulator');
    };

    return <RegulatorOnboarding onComplete={handleComplete} />;
}

