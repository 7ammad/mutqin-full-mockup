"use client";

import { useLanguage } from '@/context/LanguageContext';
import { getNestedTranslation } from '@/locales';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection() {
  const { language } = useLanguage();

  const faqItems = getNestedTranslation(language, 'faq', 'items');

  if (!Array.isArray(faqItems)) {
    return null;
  }

  return (
    <section id="faq" className="py-20 px-4 bg-[var(--system-background)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {getNestedTranslation(language, 'faq', 'title')}
          </h2>
          <p className="text-lg text-[var(--secondary-label)]">
            {getNestedTranslation(language, 'faq', 'subtitle')}
          </p>
        </div>

        <Accordion type="single" className="space-y-4">
          {faqItems.map((item: any, index: number) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[var(--secondary-label)] whitespace-pre-line">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

