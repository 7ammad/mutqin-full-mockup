"use client";

import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage } from '@/context/LanguageContext';
import { TrendingUp, Users, Clock, Building2 } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';

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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        >
          {/* Placeholder - will be replaced with actual video */}
          <source src="" type="video/mp4" />
        </video>
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content - Centered with Liquid Glass Card */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <LiquidGlassCard
          className="max-w-4xl mx-auto text-center p-8 md:p-12"
          variant="prominent"
          blurIntensity="xl"
        >
          {/* Brand Name & Tagline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              {t('brand.name')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              {t('brand.tagline')}
            </p>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('hero.title')}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
                const element = document.getElementById('what-is-mutqin');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg px-8 py-6"
            >
              {t('hero.ctaSecondary')}
            </GlassButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 rounded-ios-lg bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${stat.color}30` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1 text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/70">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </LiquidGlassCard>
      </div>
    </section>
  );
}

