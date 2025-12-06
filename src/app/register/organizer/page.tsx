"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizerRegistrationSchema, type OrganizerRegistrationForm, organizationTypes } from '@/types/registration';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export default function OrganizerRegistrationPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrganizerRegistrationForm>({
    resolver: zodResolver(organizerRegistrationSchema),
    defaultValues: {
      organizationType: '',
    },
  });

  const organizationType = watch('organizationType');

  const onSubmit = async (data: OrganizerRegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'ORGANIZER',
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
            {t('registration.forms.organizer.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.forms.organizer.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Name */}
            <div>
              <Label htmlFor="organizationName">
                {t('registration.forms.organizer.fields.organizationName')}
              </Label>
              <Input
                id="organizationName"
                type="text"
                {...register('organizationName')}
                className={errors.organizationName ? 'border-red-500' : ''}
                aria-invalid={!!errors.organizationName}
                aria-describedby={errors.organizationName ? 'organizationName-error' : undefined}
              />
              {errors.organizationName && (
                <p id="organizationName-error" className="mt-1 text-sm text-red-500" role="alert">
                  {getErrorMessage(errors.organizationName)}
                </p>
              )}
            </div>

            {/* Contact Person Name */}
            <div>
              <Label htmlFor="contactPersonName">
                {t('registration.forms.organizer.fields.contactPersonName')}
              </Label>
              <Input
                id="contactPersonName"
                type="text"
                {...register('contactPersonName')}
                className={errors.contactPersonName ? 'border-red-500' : ''}
                aria-invalid={!!errors.contactPersonName}
                aria-describedby={errors.contactPersonName ? 'contactPersonName-error' : undefined}
              />
              {errors.contactPersonName && (
                <p id="contactPersonName-error" className="mt-1 text-sm text-red-500" role="alert">
                  {getErrorMessage(errors.contactPersonName)}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                {t('registration.forms.organizer.fields.email')}
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                  {getErrorMessage(errors.email)}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">
                {t('registration.forms.organizer.fields.phone')}
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

            {/* Organization Type */}
            <div>
              <Label htmlFor="organizationType">
                {t('registration.forms.organizer.fields.organizationType')}
              </Label>
              <Select
                value={organizationType}
                onValueChange={(value) => setValue('organizationType', value)}
              >
                <SelectTrigger
                  id="organizationType"
                  className={errors.organizationType ? 'border-red-500' : ''}
                  aria-invalid={!!errors.organizationType}
                >
                  <SelectValue placeholder={t('registration.forms.organizer.fields.organizationType')} />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organizationType && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.organizationType)}
                </p>
              )}
            </div>

            {/* SCFHS Provider ID (Optional) */}
            <div>
              <Label htmlFor="scfhsProviderId">
                {t('registration.forms.organizer.fields.scfhsProviderId')}
              </Label>
              <Input
                id="scfhsProviderId"
                type="text"
                {...register('scfhsProviderId')}
                placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">
                {t('registration.forms.organizer.fields.password')}
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

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">
                {t('registration.forms.organizer.fields.confirmPassword')}
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
                : t('registration.forms.organizer.submit')}
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

