"use client";

import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Shield, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function WhatIsMutqinSection() {
  const { language, t } = useLanguage();

  const pillars = [
    {
      icon: Shield,
      title: language === 'ar' ? '' : 'Verified',
      description: language === 'ar' 
        ? '       '
        : 'All events accredited by SCFHS',
      color: 'var(--apple-blue)',
    },
    {
      icon: Users,
      title: language === 'ar' ? '' : 'Unified',
      description: language === 'ar'
        ? '        '
        : 'One platform for all CME stakeholders',
      color: 'var(--apple-green)',
    },
    {
      icon: Zap,
      title: language === 'ar' ? '  ' : 'Accessible',
      description: language === 'ar'
        ? '     '
        : 'Easy to use, available in Arabic and English',
      color: 'var(--apple-purple)',
    },
  ];

  return (
    <section id="what-is-mutqin" className="py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Badge */}
            <Badge className="bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] border-[var(--apple-blue)]/20">
              {language === 'ar' ? '   ' : 'CME Platform'}
            </Badge>

            {/* AR Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--label)]">
              {language === 'ar' ? '  ' : 'What is Mutqin?'}
            </h2>

            {/* EN Subline */}
            <p className="text-xl text-[var(--secondary-label)]">
              {language === 'ar'
                ? '         '
                : 'Saudi Arabia\'s unified platform for accredited Continuing Medical Education'}
            </p>

            {/* Pillar Cards */}
            <div className="space-y-4 pt-4">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <LiquidGlassCard
                    key={index}
                    className="p-6"
                    blurIntensity="md"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${pillar.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-[var(--secondary-label)]">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </LiquidGlassCard>
                );
              })}
            </div>
          </div>

          {/* Right Side - Placeholder for Illustration */}
          <div className="relative">
            <div className="w-full h-[500px] rounded-ios-lg bg-gradient-to-br from-[var(--apple-blue)]/10 to-[var(--apple-purple)]/10 border border-[var(--border)] flex items-center justify-center">
              <p className="text-[var(--secondary-label)] text-sm">
                {language === 'ar' ? '    ' : 'Illustration placeholder'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

