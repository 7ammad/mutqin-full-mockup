"use client";

import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage } from '@/context/LanguageContext';
import { TrendingUp, Users, Clock, Building2 } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const stats = [
    {
      icon: TrendingUp,
      value: '500+',
      label: t('hero.stats.eventsHosted'),
      color: 'var(--apple-blue)',
    },
    {
      icon: Users,
      value: '10,000+',
      label: t('hero.stats.activeHCPs'),
      color: 'var(--apple-green)',
    },
    {
      icon: Clock,
      value: '50,000+',
      label: t('hero.stats.cmeHoursTracked'),
      color: 'var(--apple-purple)',
    },
    {
      icon: Building2,
      value: '200+',
      label: t('hero.stats.accreditedOrganizers'),
      color: 'var(--apple-orange)',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[var(--system-background)] to-[var(--secondary-system-background)]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Brand Name & Tagline */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--label)] mb-4">
            {t('brand.name')}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--secondary-label)] mb-2">
            {t('brand.tagline')}
          </p>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--label)] mb-6">
          {t('hero.title')}
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-[var(--secondary-label)] mb-8 max-w-3xl mx-auto">
          {t('hero.description')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <GlassButton
            size="lg"
            onClick={() => router.push('/register')}
            className="text-lg px-8 py-6"
          >
            {t('hero.ctaPrimary')}
          </GlassButton>
          <GlassButton
            variant="outline"
            size="lg"
            onClick={() => {
              const element = document.getElementById('features');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-lg px-8 py-6"
          >
            {t('hero.ctaSecondary')}
          </GlassButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-ios-lg bg-[var(--system-background)]/50 backdrop-blur-sm border border-[var(--border)]"
              >
                <div className="flex justify-center mb-3">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--secondary-label)]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

