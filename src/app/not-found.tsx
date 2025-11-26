"use client";

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { language } = useLanguage();

  const title = language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found';

  const description = language === 'ar'
    ? 'عذراً، الصفحة التي تحاول الوصول إليها غير موجودة.'
    : "Sorry, the page you're looking for doesn't exist.";
  
  const homeButton = language === 'ar' ? 'العودة إلى الرئيسية' : 'Go Home';
  const backButton = language === 'ar' ? 'رجوع' : 'Go Back';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
      <LiquidGlassCard className="w-full max-w-md p-8 text-center" blurIntensity="lg">
        <div className="text-6xl font-bold text-[var(--label)] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[var(--label)] mb-2">
          {title}
        </h1>
        <p className="text-[var(--secondary-label)] mb-6">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <GlassButton
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            {homeButton}
          </GlassButton>
          <GlassButton
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButton}
          </GlassButton>
        </div>
      </LiquidGlassCard>
    </div>
  );
}


