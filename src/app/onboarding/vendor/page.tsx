"use client";

import { useRouter } from 'next/navigation';
import { VendorOnboarding } from '@/components/onboarding/VendorOnboarding';

export default function VendorOnboardingPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/dashboard/vendor');
    };

    return <VendorOnboarding onComplete={handleComplete} />;
}

