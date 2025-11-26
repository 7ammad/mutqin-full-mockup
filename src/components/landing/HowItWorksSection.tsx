"use client";

import { UserPlus, Search, CalendarCheck, QrCode, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';

export function HowItWorksSection() {
  const { language } = useLanguage();

  const steps = getNestedTranslation(language, 'how_it_works', 'steps');
  const stepIcons = [UserPlus, Search, CalendarCheck, QrCode, Award];

  if (!Array.isArray(steps)) {
    return null;
  }

  return (
    <section id="how-it-works" className="py-20 px-4 bg-[var(--secondary-system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {getNestedTranslation(language, 'how_it_works', 'title')}
          </h2>
          <p className="text-lg text-[var(--secondary-label)]">
            {getNestedTranslation(language, 'how_it_works', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step: any, index: number) => {
            const Icon = stepIcons[index] || UserPlus;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center p-6 rounded-ios-lg bg-[var(--system-background)]/50 backdrop-blur-sm border border-[var(--border)]"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-[var(--apple-blue)] text-white flex items-center justify-center font-bold text-sm">
                    {step.number || index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className="mt-4 mb-4">
                  <div className="p-4 rounded-full bg-[var(--apple-blue)]/20">
                    <Icon className="w-8 h-8 text-[var(--apple-blue)]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[var(--label)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--secondary-label)]">
                  {step.description}
                </p>

                {/* Connector Line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[var(--border)] z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

