"use client";

import { FileText, Shield, CheckCircle, Calendar, QrCode, UserCircle } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { motion } from 'framer-motion';

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type HowItWorksFlowProps = {
  locale: 'ar' | 'en';
  steps: HowItWorksStep[];
  activeIndex: number;
  onStepEnter: (index: number) => void;
};

const stepIcons = [FileText, Shield, CheckCircle, Calendar, QrCode, UserCircle];

export function HowItWorksFlow({ locale, steps, activeIndex, onStepEnter }: HowItWorksFlowProps) {
  const isRTL = locale === 'ar';

  return (
    <div className="relative space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {steps.map((step, index) => {
        const Icon = stepIcons[index] || FileText;
        const isActive = activeIndex === index;
        return (
          <motion.div
            key={step.id}
            onViewportEnter={() => onStepEnter(index)}
            viewport={{ amount: 0.4 }} // Trigger when 40% of the element is in view
            className="min-h-[200px] lg:min-h-[250px]"
          >
            <LiquidGlassCard
              className={`p-6 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'border-[var(--apple-blue)] bg-[var(--system-background)]'
                  : 'border-[var(--border)] bg-[var(--secondary-system-background)]/50'
              }`}
              blurIntensity="md"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[var(--apple-blue)] border-[var(--apple-blue)] text-white'
                      : 'bg-[var(--system-background)] border-[var(--border)] text-[var(--secondary-label)]'
                  }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--label)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--secondary-label)] leading-relaxed">{step.description}</p>
                </div>
              </div>
            </LiquidGlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
