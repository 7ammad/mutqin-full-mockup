"use client";

import { Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';

export function TestimonialsSection() {
  const { language } = useLanguage();

  // Mock testimonials - can be moved to locale files later
  const testimonials = language === 'ar' 
    ? [
        {
          quote: 'مُتْقِن ساعدني في تتبع ساعات التعليم المستمر بسهولة. المنصة سهلة الاستخدام ومتوافقة مع ممارس بلس.',
          author: 'د. أحمد محمد',
          role: 'طبيب استشاري',
        },
        {
          quote: 'كمنظم، أجد أن مُتْقِن يوفر جميع الأدوات التي أحتاجها لإدارة فعالياتي بكفاءة.',
          author: 'منظمة الصحة السعودية',
          role: 'مقدم خدمة CME',
        },
      ]
    : [
        {
          quote: 'Mutqin helped me track my CME hours effortlessly. The platform is user-friendly and compatible with Mumaris Plus.',
          author: 'Dr. Ahmed Mohammed',
          role: 'Consultant Physician',
        },
        {
          quote: 'As an organizer, I find that Mutqin provides all the tools I need to manage my events efficiently.',
          author: 'Saudi Health Organization',
          role: 'CME Provider',
        },
      ];

  return (
    <section className="py-20 px-4 bg-[var(--secondary-system-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--label)] mb-4">
            {language === 'ar' ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <LiquidGlassCard key={index} blurIntensity="lg" className="p-8">
              <Quote className="w-8 h-8 text-[var(--apple-blue)] mb-4" />
              <p className="text-[var(--label)] mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-[var(--label)]">{testimonial.author}</p>
                <p className="text-sm text-[var(--secondary-label)]">{testimonial.role}</p>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

