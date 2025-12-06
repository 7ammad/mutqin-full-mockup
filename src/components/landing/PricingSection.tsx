"use client";

import { useRouter } from 'next/navigation';
import { Check, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';

export function PricingSection() {
  const router = useRouter();
  const { language } = useLanguage();

  const tiers = getNestedTranslation(language, 'pricing', 'tiers');
  if (!tiers || typeof tiers !== 'object') {
    return null;
  }

  const freeTier = tiers.free;
  const organizerTier = tiers.organizer;
  const enterpriseTier = tiers.enterprise;

  return (
    <section id="pricing" className="py-20 px-4 bg-[var(--secondary-system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {getNestedTranslation(language, 'pricing', 'title')}
          </h2>
          <p className="text-lg text-[var(--secondary-label)]">
            {getNestedTranslation(language, 'pricing', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          {freeTier && (
            <LiquidGlassCard blurIntensity="lg" className="p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--label)] mb-2">
                  {freeTier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-[var(--label)]">
                    {freeTier.price}
                  </span>
                  <span className="text-sm text-[var(--secondary-label)]">
                    /{freeTier.period}
                  </span>
                </div>
              </div>

              {Array.isArray(freeTier.features) && (
                <ul className="space-y-3 mb-8 flex-1">
                  {freeTier.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--apple-green)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--secondary-label)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <GlassButton
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => router.push('/register/hcp')}
              >
                {freeTier.cta}
              </GlassButton>
            </LiquidGlassCard>
          )}

          {/* Organizer Tier */}
          {organizerTier && (
            <LiquidGlassCard blurIntensity="lg" className="p-8 flex flex-col border-2 border-[var(--apple-green)]">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--label)] mb-2">
                  {organizerTier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-[var(--secondary-label)]">
                    {organizerTier.price}{' '}
                  </span>
                  <span className="text-4xl font-bold text-[var(--label)]">
                    {organizerTier.priceAmount}
                  </span>
                  <span className="text-sm text-[var(--secondary-label)]">
                    /{organizerTier.period}
                  </span>
                </div>
              </div>

              {Array.isArray(organizerTier.features) && (
                <ul className="space-y-3 mb-8 flex-1">
                  {organizerTier.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--apple-green)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--secondary-label)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <GlassButton
                className="w-full flex items-center justify-center gap-2"
                onClick={() => router.push('/register/organizer')}
              >
                {organizerTier.cta}
              </GlassButton>
            </LiquidGlassCard>
          )}

          {/* Enterprise Tier */}
          {enterpriseTier && (
            <LiquidGlassCard blurIntensity="lg" className="p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--label)] mb-2">
                  {enterpriseTier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-[var(--label)]">
                    {enterpriseTier.price}
                  </span>
                  <span className="text-sm text-[var(--secondary-label)]">
                    /{enterpriseTier.period}
                  </span>
                </div>
              </div>

              {Array.isArray(enterpriseTier.features) && (
                <ul className="space-y-3 mb-8 flex-1">
                  {enterpriseTier.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--apple-green)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--secondary-label)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <GlassButton
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  window.location.href = 'mailto:contact@mutqin.sa';
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                {enterpriseTier.cta}
              </GlassButton>
            </LiquidGlassCard>
          )}
        </div>
      </div>
    </section>
  );
}

