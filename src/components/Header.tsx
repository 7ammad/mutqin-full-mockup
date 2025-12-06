"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GlassButton } from '@/components/ui/glass-button';
import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export function Header() {
  const router = useRouter();
  const { language, setLanguage, t, isHydrated } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Ensure isScrolled is false on initial mount to match server render
    setIsScrolled(false);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Auto-hide/show on scroll
    if (latest > lastScrollY && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);

    // Liquid Glass effect on scroll
    setIsScrolled(latest > 50);

    // Active section detection
    const sections = ['activities', 'how-it-works', 'stakeholders', 'compliance', 'partnership'];
    const currentSection = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    setActiveSection(currentSection || '');
  });

  const navLinks = [
    { href: '#activities', key: 'activities', labelKey: 'activities' },
    { href: '#how-it-works', key: 'how-it-works', labelKey: 'howItWorks' },
    { href: '#stakeholders', key: 'stakeholders', labelKey: 'whoWeServe' },
    { href: '#compliance', key: 'compliance', labelKey: 'compliance' },
    { href: '#partnership', key: 'partnership', labelKey: 'partnership' },
  ];

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--system-background)]/80 backdrop-blur-xl border-b border-[var(--border)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link 
            href="/" 
            className={`flex items-center gap-2 font-bold text-xl transition-colors ${
              isScrolled 
                ? 'text-[var(--apple-blue)]' 
                : 'text-white'
            }`}
            suppressHydrationWarning
          >
            {isHydrated ? t('brand.name') : 'Mutqin'}
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link.key
                    ? 'text-[var(--apple-blue)]'
                    : isScrolled 
                      ? 'text-[var(--label)] hover:text-[var(--apple-blue)]'
                      : 'text-white/90 hover:text-white'
                }`}
              >
                {isHydrated ? t(`nav.${link.labelKey}`) : '...'}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Sign In Link */}
            <Link
              href="/auth/login"
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-[var(--label)] hover:text-[var(--apple-blue)]'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {isHydrated ? t('nav.signIn') : 'Sign in'}
            </Link>

            {/* Language Toggle */}
            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors"
              aria-label="Toggle Language"
              title={language === 'ar' ? 'Switch to English' : '  '}
            >
              <Languages className={`h-5 w-5 transition-colors ${
                isScrolled 
                  ? 'text-[var(--secondary-label)]' 
                  : 'text-white'
              }`} />
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-[var(--system-fill)] transition-colors"
                aria-label={language === 'ar' ? ' ' : 'Toggle Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className={`h-5 w-5 transition-colors ${
                    isScrolled 
                      ? 'text-[var(--apple-yellow)]' 
                      : 'text-white'
                  }`} />
                ) : (
                  <Moon className={`h-5 w-5 transition-colors ${
                    isScrolled 
                      ? 'text-[var(--secondary-label)]' 
                      : 'text-white'
                  }`} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

