"use client";

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { FloatingLines } from '@/components/ui/floating-lines';

export function LandingHero() {
  const router = useRouter();
  const { language } = useLanguage();

  const headline = getNestedTranslation(language, 'landing', 'hero', 'headline');
  const subline = getNestedTranslation(language, 'landing', 'hero', 'subline');
  const ctaPrimary = getNestedTranslation(language, 'landing', 'hero', 'ctaPrimary');

  const isRTL = language === 'ar';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers - Only cover hero section */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" style={{ zIndex: 0 }} />
      
      {/* FloatingLines Animated Background - Only cover hero section */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <FloatingLines 
          lineDistance={[8]}
          lineCount={[6]}
        />
      </div>
      
      {/* Dark Gradient Overlay - Only cover hero section */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950/50 via-slate-950/40 to-slate-950/70" style={{ zIndex: 2 }} />
      
      {/* Hero Section Content */}
      <div className="relative w-full max-w-5xl mx-auto px-4" style={{ zIndex: 10 }}>
          <div className="space-y-8 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
              {headline}
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-slate-200/90 max-w-3xl mx-auto">
              {subline}
            </p>

            <div className="pt-4">
              <button onClick={() => router.push('/register')}
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm md:text-base font-medium bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-colors"
              >
                {ctaPrimary}
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}

