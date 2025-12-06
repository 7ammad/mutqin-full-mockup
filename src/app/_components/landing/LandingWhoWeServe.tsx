"use client";

import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Stethoscope, Building2, Shield, Calendar, Hospital, Briefcase } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';

type StakeholderRole = 'hcp' | 'provider' | 'regulator' | 'eventManager' | 'hospital' | 'sponsor';

export function LandingWhoWeServe() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const title = getNestedTranslation(language, 'landing', 'whoWeServe', 'title');
  const description = getNestedTranslation(language, 'landing', 'whoWeServe', 'description');

  const roleIcons: Record<StakeholderRole, typeof Stethoscope> = {
    hcp: Stethoscope,
    provider: Building2,
    regulator: Shield,
    eventManager: Calendar,
    hospital: Hospital,
    sponsor: Briefcase,
  };

  const roleIconColors = [
    'bg-[var(--apple-blue)]/20 text-[var(--apple-blue)]',
    'bg-[var(--apple-green)]/20 text-[var(--apple-green)]',
    'bg-[var(--apple-purple)]/20 text-[var(--apple-purple)]',
  ];

  const roles: StakeholderRole[] = ['hcp', 'provider', 'regulator', 'eventManager', 'hospital', 'sponsor'];

  const getRoleData = (role: StakeholderRole) => {
    const Icon = roleIcons[role];
    const roleTitle = getNestedTranslation(language, 'landing', 'whoWeServe', role, 'title');
    const roleBenefit = getNestedTranslation(language, 'landing', 'whoWeServe', role, 'benefit');
    
    return {
      Icon,
      title: roleTitle || role,
      benefit: roleBenefit || '',
    };
  };

  return (
    <section id="stakeholders" className="py-16 lg:py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className={`text-center mb-10 ${isRTL ? 'text-right' : 'text-left'} lg:text-center`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--label)] mb-3">
            {title || (isRTL ? '     ' : 'Clear value for every stakeholder')}
          </h2>
          {description && (
            <p className="text-lg text-[var(--secondary-label)] max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </header>

        {/* Stakeholder Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => {
            const { Icon, title: roleTitle, benefit } = getRoleData(role);
            const colorClasses = roleIconColors[index % roleIconColors.length];
            return (
              <LiquidGlassCard key={role} className="p-5 lg:p-6" blurIntensity="md">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full flex-shrink-0 ${colorClasses}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-[var(--label)]">
                      {roleTitle}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--secondary-label)] leading-relaxed">
                    {benefit}
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
