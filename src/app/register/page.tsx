"use client";

import { RoleSelector } from '@/components/registration/RoleSelector';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--label)] mb-4">
            {t('registration.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-[var(--label)] mb-8 text-center">
            {t('registration.selectRole')}
          </h2>
          
          <RoleSelector />

          <div className="mt-8 text-center">
            <p className="text-[var(--secondary-label)]">
              {t('registration.alreadyHaveAccount')}{' '}
              <Link
                href="/auth/login"
                className="text-[var(--apple-blue)] hover:underline font-medium"
              >
                {t('registration.loginLink')}
              </Link>
            </p>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

