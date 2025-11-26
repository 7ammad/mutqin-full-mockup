"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { useLanguage } from '@/context/LanguageContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    // Redirect to persona-specific onboarding
    const role = user.role?.toUpperCase();
    switch (role) {
      case 'HCP':
        router.push('/onboarding/hcp');
        break;
      case 'ORGANIZER':
        router.push('/onboarding/organizer');
        break;
      case 'EVENT_MANAGER':
        router.push('/onboarding/event-manager');
        break;
      case 'SPONSOR':
      case 'VENDOR':
        router.push('/onboarding/vendor');
        break;
      case 'REGULATOR':
        router.push('/onboarding/regulator');
        break;
      default:
        router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
      <LiquidGlassCard blurIntensity="lg" className="p-8 text-center">
        <p className="text-[var(--label)]">{t('common.loading')}</p>
      </LiquidGlassCard>
    </div>
  );
}

