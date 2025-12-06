"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { regulatorRegistrationSchema, type RegulatorRegistrationForm } from '@/types/registration';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export default function RegulatorRegistrationPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegulatorRegistrationForm>({
    resolver: zodResolver(regulatorRegistrationSchema),
  });

  const onSubmit = async (data: RegulatorRegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'REGULATOR',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push(`/register/verify?email=${encodeURIComponent(data.officialEmail)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    const message = error.message || '';
    if (message.startsWith('registration.validation.')) {
      return t(message);
    }
    return message || t('registration.validation.required');
  };

  return (
    <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--label)] mb-4">
            {t('registration.forms.regulator.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.forms.regulator.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="organizationName">
                {t('registration.forms.regulator.fields.organizationName')}
              </Label>
              <Input
                id="organizationName"
                type="text"
                {...register('organizationName')}
                className={errors.organizationName ? 'border-red-500' : ''}
                aria-invalid={!!errors.organizationName}
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.organizationName)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPersonName">
                {t('registration.forms.regulator.fields.contactPersonName')}
              </Label>
              <Input
                id="contactPersonName"
                type="text"
                {...register('contactPersonName')}
                className={errors.contactPersonName ? 'border-red-500' : ''}
                aria-invalid={!!errors.contactPersonName}
              />
              {errors.contactPersonName && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.contactPersonName)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="officialEmail">
                {t('registration.forms.regulator.fields.officialEmail')}
              </Label>
              <Input
                id="officialEmail"
                type="email"
                {...register('officialEmail')}
                className={errors.officialEmail ? 'border-red-500' : ''}
                aria-invalid={!!errors.officialEmail}
              />
              {errors.officialEmail && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.officialEmail)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                {t('registration.forms.regulator.fields.phone')}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={language === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.phone)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="roleTitle">
                {t('registration.forms.regulator.fields.roleTitle')}
              </Label>
              <Input
                id="roleTitle"
                type="text"
                {...register('roleTitle')}
                className={errors.roleTitle ? 'border-red-500' : ''}
                aria-invalid={!!errors.roleTitle}
              />
              {errors.roleTitle && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.roleTitle)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                {t('registration.forms.regulator.fields.password')}
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.password)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                {t('registration.forms.regulator.fields.confirmPassword')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.confirmPassword)}
                </p>
              )}
            </div>

            {submitError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{submitError}</p>
              </div>
            )}

            <GlassButton
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('common.loading')
                : t('registration.forms.regulator.submit')}
            </GlassButton>

            <div className="text-center">
              <p className="text-[var(--secondary-label)]">
                {t('registration.alreadyHaveAccount')}{' '}
                <Link
                  href="/auth/login"
                  className="text-[var(--apple-blue)] hover:underline font-medium"
                >
                  {t('registration.loginLink')}
                </Link>
              </p>
            </div>
          </form>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

