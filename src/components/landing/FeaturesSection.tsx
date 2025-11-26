"use client";

import { TrendingUp, Award, QrCode, FileText, Shield, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';

export function FeaturesSection() {
  const { language } = useLanguage();

  const features = getNestedTranslation(language, 'features', 'items');
  const featureIcons = [TrendingUp, Award, QrCode, FileText, Shield, Languages];

  if (!Array.isArray(features)) {
    return null;
  }

  return (
    <section id="features" className="py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {getNestedTranslation(language, 'features', 'title')}
          </h2>
          <p className="text-lg text-[var(--secondary-label)]">
            {getNestedTranslation(language, 'features', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature: any, index: number) => {
            const Icon = featureIcons[index] || TrendingUp;
            return (
              <LiquidGlassCard
                key={index}
                blurIntensity="md"
                interactive={false}
                className="p-6"
              >
                <div className="mb-4">
                  <div className="p-3 rounded-full bg-[var(--apple-blue)]/20 w-fit">
                    <Icon className="w-6 h-6 text-[var(--apple-blue)]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[var(--label)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--secondary-label)]">
                  {feature.description}
                </p>
              </LiquidGlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

