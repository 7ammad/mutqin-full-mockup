"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const title = language === 'ar' ? '  ' : 'Something went wrong';
  
  const description = language === 'ar'
    ? '   .    .'
    : "An unexpected error occurred. Please try again.";
  
  const retryButton = language === 'ar' ? '  ' : 'Try Again';
  const homeButton = language === 'ar' ? '  ' : 'Go Home';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
      <LiquidGlassCard className="w-full max-w-md p-8 text-center" blurIntensity="lg">
        <AlertTriangle className="h-12 w-12 text-[var(--apple-red)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--label)] mb-2">
          {title}
        </h1>
        <p className="text-[var(--secondary-label)] mb-6">
          {description}
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--tertiary-label)] mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <GlassButton
            onClick={reset}
            className="gap-2 flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            {retryButton}
          </GlassButton>
          <GlassButton
            variant="outline"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            {homeButton}
          </GlassButton>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
