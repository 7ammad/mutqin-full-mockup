"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sponsorRegistrationSchema, type SponsorRegistrationForm, industries } from '@/types/registration';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export default function SponsorRegistrationPage() {
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
  } = useForm<SponsorRegistrationForm>({
    resolver: zodResolver(sponsorRegistrationSchema),
    defaultValues: {
      industry: '',
    },
  });

  const industry = watch('industry');

  const onSubmit = async (data: SponsorRegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'SPONSOR',
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
            {t('registration.forms.sponsor.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.forms.sponsor.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="companyName">
                {t('registration.forms.sponsor.fields.companyName')}
              </Label>
              <Input
                id="companyName"
                type="text"
                {...register('companyName')}
                className={errors.companyName ? 'border-red-500' : ''}
                aria-invalid={!!errors.companyName}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.companyName)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPersonName">
                {t('registration.forms.sponsor.fields.contactPersonName')}
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
              <Label htmlFor="email">
                {t('registration.forms.sponsor.fields.email')}
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
                {t('registration.forms.sponsor.fields.phone')}
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
              <Label htmlFor="industry">
                {t('registration.forms.sponsor.fields.industry')}
              </Label>
              <Select
                value={industry}
                onValueChange={(value) => setValue('industry', value)}
              >
                <SelectTrigger
                  id="industry"
                  className={errors.industry ? 'border-red-500' : ''}
                  aria-invalid={!!errors.industry}
                >
                  <SelectValue placeholder={t('registration.forms.sponsor.fields.industry')} />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.industry)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sponsorshipInterest">
                {t('registration.forms.sponsor.fields.sponsorshipInterest')}
              </Label>
              <Input
                id="sponsorshipInterest"
                type="text"
                {...register('sponsorshipInterest')}
                className={errors.sponsorshipInterest ? 'border-red-500' : ''}
                aria-invalid={!!errors.sponsorshipInterest}
              />
              {errors.sponsorshipInterest && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.sponsorshipInterest)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                {t('registration.forms.sponsor.fields.password')}
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
                {t('registration.forms.sponsor.fields.confirmPassword')}
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
                : t('registration.forms.sponsor.submit')}
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

