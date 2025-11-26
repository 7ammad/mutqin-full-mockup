"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GlassButton } from '@/components/ui/glass-button';
import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--system-background)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[var(--apple-blue)]">
            {t('brand.name')}
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--label)] hover:text-[var(--apple-blue)] transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-[var(--label)] hover:text-[var(--apple-blue)] transition-colors"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-[var(--label)] hover:text-[var(--apple-blue)] transition-colors"
            >
              {t('nav.faq')}
            </Link>
            {!isProduction && (
              <Link
                href="/demo"
                className="text-sm font-medium text-[var(--label)] hover:text-[var(--apple-blue)] transition-colors"
              >
                Demo
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors"
              aria-label="Toggle Language"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Languages className="h-5 w-5 text-[var(--secondary-label)]" />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                aria-label={language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-[var(--apple-yellow)]" />
                ) : (
                  <Moon className="h-5 w-5 text-[var(--secondary-label)]" />
                )}
              </button>
            )}

            {/* Create Account CTA */}
            <GlassButton
              onClick={() => router.push('/register')}
              size="sm"
            >
              {t('nav.createAccount')}
            </GlassButton>

            {/* Login Link */}
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[var(--label)] hover:text-[var(--apple-blue)] transition-colors hidden sm:block"
            >
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

