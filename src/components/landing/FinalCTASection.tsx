"use client";

import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';

export function FinalCTASection() {
  const router = useRouter();
  const { language } = useLanguage();

  const ctaData = getNestedTranslation(language, 'cta', 'final');

  return (
    <section id="demo" className="py-20 px-4 bg-gradient-to-b from-[var(--system-background)] to-[var(--secondary-system-background)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--label)] mb-4">
          {ctaData?.title}
        </h2>
        <p className="text-xl text-[var(--secondary-label)] mb-8">
          {ctaData?.subtitle}
        </p>
        <GlassButton
          size="lg"
          onClick={() => router.push('/register')}
          className="text-lg px-8 py-6"
        >
          {ctaData?.cta}
        </GlassButton>
      </div>
    </section>
  );
}

