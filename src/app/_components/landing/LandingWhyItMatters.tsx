"use client";

import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { FileText, Shield, CheckCircle, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';

type CompliancePoint = 'auditTrail' | 'alignedData' | 'fewerCycles' | 'saudiFlows';

export function LandingWhyItMatters() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const title = getNestedTranslation(language, 'landing', 'compliance', 'title');
  const subtitle = getNestedTranslation(language, 'landing', 'compliance', 'subtitle');

  const pointIcons: Record<CompliancePoint, typeof FileText> = {
    auditTrail: FileText,
    alignedData: Shield,
    fewerCycles: TrendingDown,
    saudiFlows: CheckCircle,
  };

  const points: CompliancePoint[] = ['auditTrail', 'alignedData', 'fewerCycles', 'saudiFlows'];

  const getPointData = (point: CompliancePoint) => {
    const Icon = pointIcons[point];
    const pointTitle = getNestedTranslation(language, 'landing', 'compliance', 'points', point, 'title');
    const pointDescription = getNestedTranslation(language, 'landing', 'compliance', 'points', point, 'description');
    
    return {
      Icon,
      title: pointTitle || '',
      description: pointDescription || '',
    };
  };

  return (
    <section id="compliance" className="py-16 lg:py-20 px-4 bg-[var(--secondary-system-background)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className={`text-center mb-10 ${isRTL ? 'text-right' : 'text-left'} lg:text-center`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--label)] mb-3">
            {title || (isRTL ? ' …    ' : 'Simplified compliance, clearer oversight')}
          </h2>
          {subtitle && (
            <p className="text-lg text-[var(--secondary-label)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        {/* Compliance Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((point) => {
            const { Icon, title: pointTitle, description } = getPointData(point);
            return (
              <LiquidGlassCard key={point} className="p-5 lg:p-6" blurIntensity="md">
                <div className="space-y-3">
                  <div className="p-3 rounded-full bg-[var(--apple-blue)]/20 w-fit">
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--apple-blue)]" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-[var(--label)]">
                    {pointTitle}
                  </h3>
                  <p className="text-sm text-[var(--secondary-label)] leading-relaxed">
                    {description}
                  </p>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

