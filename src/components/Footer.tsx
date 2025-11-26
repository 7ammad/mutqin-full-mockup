"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone } from 'lucide-react';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary-system-background)]">
      <div className="max-w-7xl mx-auto px-4 py-12">
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
                aria-label={language === 'ar' ? 'إرسال بريد إلكتروني إلى contact@mutqin.sa' : 'Send email to contact@mutqin.sa'}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                contact@mutqin.sa
              </a>
              <a
                href="tel:+966112345678"
                className="flex items-center gap-2 hover:text-[var(--apple-blue)] transition-colors"
                aria-label={language === 'ar' ? 'اتصل بنا على +966 11 234 5678' : 'Call us at +966 11 234 5678'}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                +966 11 234 5678
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--label)] mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
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
              {language === 'ar' ? 'قانوني' : 'Legal'}
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

