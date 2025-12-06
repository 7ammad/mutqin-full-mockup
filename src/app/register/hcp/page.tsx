"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hcpRegistrationSchema, type HCPRegistrationForm, specialties } from '@/types/registration';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export default function HCPRegistrationPage() {
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
  } = useForm<HCPRegistrationForm>({
    resolver: zodResolver(hcpRegistrationSchema),
    defaultValues: {
      specialty: '',
    },
  });

  const specialty = watch('specialty');

  const onSubmit = async (data: HCPRegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'HCP',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      // Redirect to verification page
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
            {t('registration.forms.hcp.title')}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {t('registration.forms.hcp.subtitle')}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                {t('registration.forms.hcp.fields.fullName')}
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-sm text-red-500" role="alert">
                  {getErrorMessage(errors.fullName)}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                {t('registration.forms.hcp.fields.email')}
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
                {t('registration.forms.hcp.fields.phone')}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={language === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.phone)}
                </p>
              )}
            </div>

            {/* Specialty */}
            <div>
              <Label htmlFor="specialty">
                {t('registration.forms.hcp.fields.specialty')}
              </Label>
              <Select
                value={specialty}
                onValueChange={(value) => setValue('specialty', value)}
              >
                <SelectTrigger
                  id="specialty"
                  className={errors.specialty ? 'border-red-500' : ''}
                  aria-invalid={!!errors.specialty}
                  aria-describedby={errors.specialty ? 'specialty-error' : undefined}
                >
                  <SelectValue placeholder={t('registration.forms.hcp.fields.specialty')} />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p id="specialty-error" className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.specialty)}
                </p>
              )}
            </div>

            {/* SCFHS Number (Optional) */}
            <div>
              <Label htmlFor="scfhsNumber">
                {t('registration.forms.hcp.fields.scfhsNumber')}
              </Label>
              <Input
                id="scfhsNumber"
                type="text"
                {...register('scfhsNumber')}
                placeholder={language === 'ar' ? '' : 'Optional'}
              />
            </div>

            {/* Organization (Optional) */}
            <div>
              <Label htmlFor="organization">
                {t('registration.forms.hcp.fields.organization')}
              </Label>
              <Input
                id="organization"
                type="text"
                {...register('organization')}
                placeholder={language === 'ar' ? '' : 'Optional'}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">
                {t('registration.forms.hcp.fields.password')}
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.password)}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">
                {t('registration.forms.hcp.fields.confirmPassword')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.confirmPassword)}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <GlassButton
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('common.loading')
                : t('registration.forms.hcp.submit')}
            </GlassButton>

            {/* Login Link */}
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

