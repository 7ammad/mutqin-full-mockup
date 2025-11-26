"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  email: z.string().email().min(1),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
        <div className="max-w-md mx-auto">
          <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12 text-center">
            <h1 className="text-2xl font-bold text-[var(--label)] mb-4">
              {language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Reset Link Sent'}
            </h1>
            <p className="text-[var(--secondary-label)] mb-6">
              {language === 'ar'
                ? 'تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور'
                : 'Check your email for a password reset link'}
            </p>
            <Link href="/auth/login">
              <GlassButton>{t('registration.loginLink')}</GlassButton>
            </Link>
          </LiquidGlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--label)] mb-4">
            {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {language === 'ar'
              ? 'أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {t('registration.validation.email')}
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <GlassButton
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('common.loading')
                : language === 'ar'
                ? 'إرسال رابط إعادة التعيين'
                : 'Send Reset Link'}
            </GlassButton>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-[var(--apple-blue)] hover:underline"
              >
                {t('registration.loginLink')}
              </Link>
            </div>
          </form>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

