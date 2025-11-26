"use client";

import { useRouter } from 'next/navigation';
import { Stethoscope, Building2, Briefcase, Shield, Calendar } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage } from '@/context/LanguageContext';
import { Persona, type RoleInfo } from '@/types/registration';

interface RoleSelectorProps {
  onRoleSelect?: (role: Persona) => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const router = useRouter();
  const { language, t } = useLanguage();

  const roles: RoleInfo[] = [
    {
      id: Persona.HCP,
      icon: Stethoscope,
      title: t('roles.hcp.title'),
      description: t('roles.hcp.description'),
      color: 'var(--apple-blue)',
      route: '/register/hcp',
    },
    {
      id: Persona.Organizer,
      icon: Building2,
      title: t('roles.organizer.title'),
      description: t('roles.organizer.description'),
      color: 'var(--apple-green)',
      route: '/register/organizer',
    },
    {
      id: Persona.EventManager,
      icon: Calendar,
      title: t('roles.event_manager.title'),
      description: t('roles.event_manager.description'),
      color: 'var(--apple-teal-blue)',
      route: '/register/event-manager',
    },
    {
      id: Persona.Sponsor,
      icon: Briefcase,
      title: t('roles.sponsor.title'),
      description: t('roles.sponsor.description'),
      color: 'var(--apple-purple)',
      route: '/register/sponsor',
    },
    {
      id: Persona.Regulator,
      icon: Shield,
      title: t('roles.regulator.title'),
      description: t('roles.regulator.description'),
      color: 'var(--apple-orange)',
      route: '/register/regulator',
    },
  ];

  const handleRoleClick = (role: RoleInfo) => {
    if (onRoleSelect) {
      onRoleSelect(role.id);
    } else {
      router.push(role.route);
    }
  };

  const getCTAText = (persona: Persona): string => {
    switch (persona) {
      case Persona.HCP:
        return t('roles.hcp.cta');
      case Persona.Organizer:
        return t('roles.organizer.cta');
      case Persona.EventManager:
        return t('roles.event_manager.cta');
      case Persona.Sponsor:
        return t('roles.sponsor.cta');
      case Persona.Regulator:
        return t('roles.regulator.cta');
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <div
            key={role.id}
            onClick={() => handleRoleClick(role)}
            className="cursor-pointer"
          >
            <LiquidGlassCard
              blurIntensity="lg"
              interactive={true}
              className="p-6"
            >
              <div style={{ color: role.color }}>
                <Icon className="w-12 h-12 mb-4" />
              </div>
              <h3 className="text-xl font-bold text-[var(--label)] mb-2">
                {role.title}
              </h3>
              <p className="text-[var(--secondary-label)] mb-4 text-sm">
                {role.description}
              </p>
              <GlassButton
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleClick(role);
                }}
              >
                {getCTAText(role.id)}
              </GlassButton>
            </LiquidGlassCard>
          </div>
        );
      })}
    </div>
  );
}

