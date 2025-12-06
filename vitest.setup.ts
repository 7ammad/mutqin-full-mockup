import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
    resolvedTheme: 'dark',
  }),
}));

// Mock UI components
vi.mock('@/components/ui/glass-button', () => ({
  GlassButton: ({ children, onClick, className, variant, size, ...props }: any) => {
    return React.createElement(
      'button',
      {
        onClick,
        className,
        'data-variant': variant,
        'data-size': size,
        ...props,
      },
      children
    );
  },
}));

vi.mock('@/components/ui/liquid-glass-card', () => ({
  LiquidGlassCard: ({ children, className, blurIntensity, interactive, ...props }: any) => {
    return React.createElement(
      'div',
      {
        className,
        'data-blur': blurIntensity,
        'data-interactive': interactive,
        ...props,
      },
      children
    );
  },
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, variant, ...props }: any) => {
    return React.createElement(
      'span',
      {
        className,
        'data-variant': variant,
        ...props,
      },
      children
    );
  },
}));

// Mock locales
vi.mock('@/locales', () => ({
  getTranslation: (lang: string, key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        'brand.name': 'Mutqin',
        'nav.login': 'Login',
      },
      ar: {
        'brand.name': 'مُثْقِن',
        'nav.login': 'تسجيل الدخول',
      },
    };
    return translations[lang as 'en' | 'ar']?.[key] || key;
  },
  getNestedTranslation: (lang: string, ...keys: string[]) => {
    // Return placeholder text for nested translations
    if (keys.includes('hero') && keys.includes('ctaPrimary')) {
      return 'Join the founding network';
    }
    if (keys.includes('hero') && keys.includes('ctaSecondary')) {
      return 'Explore activity journeys';
    }
    if (keys.includes('demoFaq') && keys.includes('demo') && keys.includes('ctaPrimary')) {
      return 'Join us';
    }
    if (keys.includes('demoFaq') && keys.includes('demo') && keys.includes('ctaSecondary')) {
      return 'Review activity journeys';
    }
    if (keys.includes('whatIs') && keys.includes('headline')) {
      return 'Mutqin is the digital home for CME/CPD activities.';
    }
    if (keys.includes('howItWorks') && keys.includes('title')) {
      return 'Mutqin runs each CME/CPD activity as part of a connected network.';
    }
    if (keys.includes('whoWeServe') && keys.includes('title')) {
      return 'Mutqin supports every role in the CME/CPD ecosystem.';
    }
    if (keys.includes('whyItMatters') && keys.includes('title')) {
      return 'Mutqin elevates how organisations manage CME/CPD.';
    }
    if (keys.includes('demoFaq') && keys.includes('demo') && keys.includes('title')) {
      return 'Join the founding network for digital CME/CPD activities.';
    }
    return keys.join('.');
  },
}));

// Mock framer-motion for tests
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => {
      return React.createElement('div', { ...props, ref }, children);
    }),
    header: React.forwardRef(({ children, ...props }: any, ref: any) => {
      return React.createElement('header', { ...props, ref }, children);
    }),
    section: React.forwardRef(({ children, ...props }: any, ref: any) => {
      return React.createElement('section', { ...props, ref }, children);
    }),
    path: React.forwardRef(({ ...props }: any, ref: any) => {
      return React.createElement('path', { ...props, ref });
    }),
  },
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useMotionValueEvent: vi.fn(),
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useTransform: () => ({ get: () => 0 }),
  useSpring: (value: any) => value,
}));

// Mock LandingFooter
vi.mock('@/app/_components/landing/LandingFooter', () => ({
  LandingFooter: () => React.createElement('footer', { 'data-testid': 'landing-footer' }, 'Footer'),
}));

