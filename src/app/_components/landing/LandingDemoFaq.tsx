"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { ChevronDown, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import { AnimatePresence, motion } from 'framer-motion';

const CONTACT_EMAIL = 'contact@mutqin.sa';

export function LandingDemoFaq() {
  const router = useRouter();
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const partnershipTitle = getNestedTranslation(language, 'landing', 'partnership', 'title');
  const partnershipSubline = getNestedTranslation(language, 'landing', 'partnership', 'subline');
  const ctaPrimary = getNestedTranslation(language, 'landing', 'partnership', 'ctaPrimary');
  const ctaSecondary = getNestedTranslation(language, 'landing', 'partnership', 'ctaSecondary');
  const whoIsBehindTitle = getNestedTranslation(language, 'landing', 'partnership', 'whoIsBehind', 'title');
  const whoIsBehindBody = getNestedTranslation(language, 'landing', 'partnership', 'whoIsBehind', 'body');
  const faqTitle = getNestedTranslation(language, 'landing', 'partnership', 'faq', 'title');
  const faqsData = getNestedTranslation(language, 'landing', 'partnership', 'faq', 'items');

  const faqs = Array.isArray(faqsData) ? faqsData.map((faq: any) => ({
    question: faq.question || 'FAQ Question Placeholder?',
    answer: faq.answer || 'Placeholder answer.',
  })) : [];

  const handleContactClick = () => {
    // Route to contact page if it exists, otherwise use mailto
    const contactPath = '/contact';
    // Check if route exists by attempting navigation, fallback to mailto
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Partnership Inquiry')}`;
  };

  return (
    <section id="partnership" className="py-20 px-4 bg-gradient-to-b from-[var(--system-background)] to-[var(--secondary-system-background)]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top CTA Band */}
        <div className="flex flex-col justify-center">
          <LiquidGlassCard className="p-8 md:p-12" blurIntensity="md">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--label)] mb-4">
              {partnershipTitle || 'Join as a founding partner'}
            </h2>
            <p className="text-lg text-[var(--secondary-label)] mb-8 max-w-3xl">
              {partnershipSubline || 'Mutqin is working with a small set of institutions—regulators, hospitals, CPD providers, and sponsors—to pilot real activities and refine the platform.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <GlassButton
                size="lg"
                onClick={handleContactClick}
                className="w-fit"
              >
                {ctaPrimary || 'Start a partnership conversation'}
              </GlassButton>
              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[var(--apple-blue)] hover:underline"
              >
                {ctaSecondary || 'View a sample activity journey'}
              </button>
            </div>
          </LiquidGlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Who is behind Mutqin */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
              {whoIsBehindTitle || 'Who is behind Mutqin?'}
            </h2>
            <p className="text-base text-[var(--secondary-label)] leading-relaxed">
              {whoIsBehindBody || 'Mutqin is built by a Saudi team working at the intersection of healthcare education, compliance, and software. We focus on creating infrastructure that connects existing systems and workflows rather than replacing them.'}
            </p>
          </div>

          {/* Right: FAQ Accordion */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--label)] mb-6">
              {faqTitle || 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <LiquidGlassCard
                  key={index}
                  className="p-6"
                  blurIntensity="md"
                >
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-[var(--label)] pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--secondary-label)] flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-[var(--secondary-label)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
