"use client";

import { Shield, Database, CheckCircle2, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function TrustBar() {
  const { language, t } = useLanguage();

  const trustItems = [
    {
      icon: Shield,
      text: t('trust.scfhs'),
      color: 'var(--apple-blue)',
    },
    {
      icon: Database,
      text: t('trust.data_residency'),
      color: 'var(--apple-green)',
    },
    {
      icon: CheckCircle2,
      text: t('trust.mumaris'),
      color: 'var(--apple-purple)',
    },
    {
      icon: Lock,
      text: t('trust.secure'),
      color: 'var(--apple-orange)',
    },
  ];

  return (
    <section className="py-12 px-4 bg-[var(--secondary-system-background)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-ios-lg bg-[var(--system-background)]/50 backdrop-blur-sm border border-[var(--border)]"
              >
                <div
                  className="flex-shrink-0 p-2 rounded-full"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <p className="text-sm font-medium text-[var(--label)] flex-1">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

