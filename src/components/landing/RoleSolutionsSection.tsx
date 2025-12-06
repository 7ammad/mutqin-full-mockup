"use client";

import { useRouter } from 'next/navigation';
import { Stethoscope, Building2, Briefcase, Shield, Calendar, Check } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage } from '@/context/LanguageContext';
import { Persona } from '@/types/registration';
import { getNestedTranslation } from '@/locales';

export function RoleSolutionsSection() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const getBenefits = (roleKey: string): string[] => {
    const benefits = getNestedTranslation(language, 'roles', roleKey, 'benefits');
    return Array.isArray(benefits) ? benefits : [];
  };

  const roles = [
    {
      id: Persona.HCP,
      icon: Stethoscope,
      title: t('roles.hcp.title'),
      description: t('roles.hcp.description'),
      benefits: getBenefits('hcp'),
      cta: t('roles.hcp.cta'),
      route: '/register/hcp',
      color: 'var(--apple-blue)',
    },
    {
      id: Persona.Organizer,
      icon: Building2,
      title: t('roles.organizer.title'),
      description: t('roles.organizer.description'),
      benefits: getBenefits('organizer'),
      cta: t('roles.organizer.cta'),
      route: '/register/organizer',
      color: 'var(--apple-green)',
    },
    {
      id: Persona.EventManager,
      icon: Calendar,
      title: t('roles.event_manager.title'),
      description: t('roles.event_manager.description'),
      benefits: getBenefits('event_manager'),
      cta: t('roles.event_manager.cta'),
      route: '/register/event-manager',
      color: 'var(--apple-teal-blue)',
    },
    {
      id: Persona.Sponsor,
      icon: Briefcase,
      title: t('roles.sponsor.title'),
      description: t('roles.sponsor.description'),
      benefits: getBenefits('sponsor'),
      cta: t('roles.sponsor.cta'),
      route: '/register/sponsor',
      color: 'var(--apple-purple)',
    },
    {
      id: Persona.Regulator,
      icon: Shield,
      title: t('roles.regulator.title'),
      description: t('roles.regulator.description'),
      benefits: getBenefits('regulator'),
      cta: t('roles.regulator.cta'),
      route: '/register/regulator',
      color: 'var(--apple-orange)',
    },
  ];

  return (
    <section id="who-we-serve" className="py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {t('registration.selectRole')}
          </h2>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <LiquidGlassCard
                key={role.id}
                blurIntensity="lg"
                interactive={true}
                className="p-6 h-full flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: role.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--label)] mb-2">
                      {role.title}
                    </h3>
                    <p className="text-sm text-[var(--secondary-label)] mb-4">
                      {role.description}
                    </p>
                  </div>
                </div>

                {Array.isArray(role.benefits) && role.benefits.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-1">
                    {role.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: role.color }}
                        />
                        <span className="text-sm text-[var(--secondary-label)]">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <GlassButton
                  variant="outline"
                  className="w-full mt-auto flex items-center justify-center gap-2"
                  onClick={() => router.push(role.route)}
                >
                  {role.cta}
                </GlassButton>
              </LiquidGlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

