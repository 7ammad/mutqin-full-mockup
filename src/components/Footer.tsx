"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--secondary-system-background)] overflow-hidden">
      {/* Animated ECG Line Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          initial={{ x: 0 }}
          animate={{ x: [-1200, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--apple-blue)" />
              <stop offset="50%" stopColor="var(--apple-green)" />
              <stop offset="100%" stopColor="var(--apple-purple)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,100 Q150,50 300,100 T600,100 T900,100 T1200,100"
            fill="none"
            stroke="url(#ecgGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { duration: 2, ease: "easeInOut" }, opacity: { duration: 1 } }}
          />
        </motion.svg>
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          initial={{ x: 0 }}
          animate={{ x: [-1200, 0] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        >
          <defs>
            <linearGradient id="ecgGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--apple-blue)" />
              <stop offset="50%" stopColor="var(--apple-green)" />
              <stop offset="100%" stopColor="var(--apple-purple)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,120 Q150,70 300,120 T600,120 T900,120 T1200,120"
            fill="none"
            stroke="url(#ecgGradient2)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { duration: 2, ease: "easeInOut", delay: 0.5 }, opacity: { duration: 1, delay: 0.5 } }}
          />
        </motion.svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-[var(--label)] mb-4">
              {t('brand.name')}
            </h3>
            <p className="text-sm text-[var(--secondary-label)] mb-4">
              {t('footer.description')}
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--secondary-label)]">
              <a
                href="mailto:contact@mutqin.sa"
                className="flex items-center gap-2 hover:text-[var(--apple-blue)] transition-colors"
                aria-label={language === 'ar' ? '    contact@mutqin.sa' : 'Send email to contact@mutqin.sa'}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                contact@mutqin.sa
              </a>
              <a
                href="tel:+966112345678"
                className="flex items-center gap-2 hover:text-[var(--apple-blue)] transition-colors"
                aria-label={language === 'ar' ? '   +966 11 234 5678' : 'Call us at +966 11 234 5678'}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                +966 11 234 5678
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? ' ' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('nav.createAccount')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? '' : 'Legal'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('footer.links.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('footer.links.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[var(--secondary-label)] hover:text-[var(--apple-blue)] transition-colors"
                >
                  {t('footer.links.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--tertiary-label)]">
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

