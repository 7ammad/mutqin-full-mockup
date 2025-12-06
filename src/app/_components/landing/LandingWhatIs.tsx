"use client";

import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Building2, Shield, Stethoscope, Briefcase } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';

export function LandingWhatIs() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const title = getNestedTranslation(language, 'landing', 'whatIs', 'title');
  const body = getNestedTranslation(language, 'landing', 'whatIs', 'body');
  const pillarUnified = getNestedTranslation(language, 'landing', 'whatIs', 'pillars', 'unifiedWorkflows');
  const pillarSource = getNestedTranslation(language, 'landing', 'whatIs', 'pillars', 'sourceOfTruth');
  const pillarVisibility = getNestedTranslation(language, 'landing', 'whatIs', 'pillars', 'visibility');

  // System visual tiles
  const systemTiles = [
    { icon: Building2, label: getNestedTranslation(language, 'landing', 'whatIs', 'visual', 'providers') || (isRTL ? 'جهات التطوير' : 'Providers') },
    { icon: Shield, label: getNestedTranslation(language, 'landing', 'whatIs', 'visual', 'regulators') || (isRTL ? 'جهات اعتمادية' : 'Regulators') },
    { icon: Stethoscope, label: getNestedTranslation(language, 'landing', 'whatIs', 'visual', 'hcps') || (isRTL ? 'ممارسون صحيون' : 'HCPs') },
    { icon: Briefcase, label: getNestedTranslation(language, 'landing', 'whatIs', 'visual', 'sponsors') || (isRTL ? 'رعاة' : 'Sponsors') },
  ];

  return (
    <section id="what-is-mutqin" className="py-16 lg:py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center ${isRTL ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--label)]">
              {title || (isRTL ? 'متقِن هو نظام تشغيل موحّد لفعاليات التعليم الطبي المستمر' : 'Mutqin is the operating system for accredited CPD activities')}
            </h2>
            
            <p className="text-lg text-[var(--secondary-label)] leading-relaxed">
              {body || (isRTL ? 'يربط متقِن جهات التطوير والاعتماد والرقابة والمستشفيات والرعاة والممارسين الصحيين في مسار عمل واحد من تصميم النشاط إلى الساعات المسجلة.' : 'Mutqin connects providers, accreditors, regulators, hospitals, sponsors, and HCPs in one workflow from activity design to recorded credits.')}
            </p>

            {/* Mini Pillars */}
            {(pillarUnified || pillarSource || pillarVisibility) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {pillarUnified && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border border-[var(--apple-blue)]/20">
                    {pillarUnified}
                  </span>
                )}
                {pillarSource && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--apple-green)]/10 text-[var(--apple-green)] border border-[var(--apple-green)]/20">
                    {pillarSource}
                  </span>
                )}
                {pillarVisibility && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--apple-purple)]/10 text-[var(--apple-purple)] border border-[var(--apple-purple)]/20">
                    {pillarVisibility}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: System Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {systemTiles.map((tile, index) => {
                const Icon = tile.icon;
                return (
                  <LiquidGlassCard
                    key={index}
                    className="p-4 lg:p-6 rounded-xl border border-[var(--border)]/60 bg-[var(--system-background)]/60 backdrop-blur-sm"
                    blurIntensity="md"
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 rounded-full bg-[var(--apple-blue)]/10">
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--apple-blue)]" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-[var(--label)]">
                        {tile.label}
                      </span>
                    </div>
                  </LiquidGlassCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

