"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventManagerRegistrationSchema, type EventManagerRegistrationForm } from '@/types/registration';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export default function EventManagerRegistrationPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventManagerRegistrationForm>({
    resolver: zodResolver(eventManagerRegistrationSchema),
  });

  const onSubmit = async (data: EventManagerRegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'EVENT_MANAGER',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push(`/register/verify?email=${encodeURIComponent(data.email)}`);
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
            {t('registration.forms.event_manager.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.forms.event_manager.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="fullName">
                {t('registration.forms.event_manager.fields.fullName')}
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.fullName)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">
                {t('registration.forms.event_manager.fields.email')}
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.email)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                {t('registration.forms.event_manager.fields.phone')}
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
              <Label htmlFor="associatedOrganization">
                {t('registration.forms.event_manager.fields.associatedOrganization')}
              </Label>
              <Input
                id="associatedOrganization"
                type="text"
                {...register('associatedOrganization')}
                className={errors.associatedOrganization ? 'border-red-500' : ''}
                aria-invalid={!!errors.associatedOrganization}
              />
              {errors.associatedOrganization && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.associatedOrganization)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">
                {t('registration.forms.event_manager.fields.role')}
              </Label>
              <Input
                id="role"
                type="text"
                {...register('role')}
                className={errors.role ? 'border-red-500' : ''}
                aria-invalid={!!errors.role}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.role)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                {t('registration.forms.event_manager.fields.password')}
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
                {t('registration.forms.event_manager.fields.confirmPassword')}
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
                : t('registration.forms.event_manager.submit')}
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

