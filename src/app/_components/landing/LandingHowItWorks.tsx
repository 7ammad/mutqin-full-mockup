"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { ActivityJourneyCard } from './ActivityJourneyCard';
import { HowItWorksFlow, type HowItWorksStep } from './HowItWorksFlow';
import { motion } from 'framer-motion';

export function LandingHowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0); // Keep state for mobile
  const { language } = useLanguage();
  const locale = language as 'ar' | 'en';
  
  const title = getNestedTranslation(language, 'landing', 'howItWorks', 'title');
  const subtitle = getNestedTranslation(language, 'landing', 'howItWorks', 'subtitle');
  
  // Get step data from i18n
  const steps: HowItWorksStep[] = [
    {
      id: 'create',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'create', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'create', 'description'),
      icon: null, // Icons handled in HowItWorksFlow
    },
    {
      id: 'accredit',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'accredit', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'accredit', 'description'),
      icon: null,
    },
    {
      id: 'decision',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'decision', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'decision', 'description'),
      icon: null,
    },
    {
      id: 'publish',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'publish', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'publish', 'description'),
      icon: null,
    },
    {
      id: 'attendance',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'attendance', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'attendance', 'description'),
      icon: null,
    },
    {
      id: 'credits',
      title: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'credits', 'title'),
      description: getNestedTranslation(language, 'landing', 'howItWorks', 'steps', 'credits', 'description'),
      icon: null,
    },
  ];

  const isRTL = locale === 'ar';

  return (
    <motion.section
      id="how-it-works"
      className="py-16 lg:py-24 bg-[var(--secondary-system-background)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Header */}
        <header className={`space-y-3 mb-12 lg:mb-16 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--label)]">
            {title || 'How Mutqin runs each activity from idea to credits'}
          </h2>
          <p className="text-lg text-[var(--secondary-label)] max-w-3xl mx-auto lg:mx-0">
            {subtitle || 'From accreditation to attendance to posted hours, Mutqin keeps every step connected, documented, and auditable.'}
          </p>
        </header>

        {/* Scrollytelling Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 lg:gap-16 xl:gap-24 ${isRTL ? 'lg:grid-cols-[1.2fr_1fr]' : 'lg:grid-cols-[1fr_1.2fr]'}`}>
          <div className="lg:sticky top-24 h-fit">
            <ActivityJourneyCard locale={locale} activeStepIndex={activeIndex} />
          </div>
          <HowItWorksFlow locale={locale} steps={steps} activeIndex={activeIndex} onStepEnter={setActiveIndex} />
        </div>
      </div>
    </motion.section>
  );
}
