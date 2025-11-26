"use client";

import { useRouter } from 'next/navigation';
import { HCPOnboarding } from '@/components/onboarding/HCPOnboarding';

export default function HCPOnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/dashboard/hcp');
    };

    return <HCPOnboarding onComplete={handleComplete} />;
}

