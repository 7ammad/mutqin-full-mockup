"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useState, Suspense } from 'react';

const confirmPasswordSchema = z
  .object({
    password: z.string().min(8, 'registration.validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'registration.validation.passwordMatch',
    path: ['confirmPassword'],
  });

type ConfirmPasswordForm = z.infer<typeof confirmPasswordSchema>;

function ConfirmResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmPasswordForm>({
    resolver: zodResolver(confirmPasswordSchema),
  });

  const onSubmit = async (data: ConfirmPasswordForm) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
        <LiquidGlassCard blurIntensity="lg" className="p-8 text-center">
          <p className="text-[var(--label)]">
            {language === 'ar' ? 'رابط غير صحيح' : 'Invalid reset link'}
          </p>
        </LiquidGlassCard>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
        <LiquidGlassCard blurIntensity="lg" className="p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--label)] mb-4">
            {language === 'ar' ? 'تم إعادة تعيين كلمة المرور بنجاح' : 'Password Reset Successful'}
          </h1>
          <p className="text-[var(--secondary-label)]">
            {language === 'ar'
              ? 'جاري التوجيه إلى صفحة تسجيل الدخول...'
              : 'Redirecting to login...'}
          </p>
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--system-background)] py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--label)] mb-4">
            {language === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}
          </h1>
          <p className="text-lg text-[var(--secondary-label)]">
            {language === 'ar'
              ? 'أدخل كلمة المرور الجديدة'
              : 'Enter your new password'}
          </p>
        </div>

        <LiquidGlassCard blurIntensity="lg" className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.password)}
                </p>
              )}
            </div>

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
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors.confirmPassword)}
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
                ? 'تعيين كلمة المرور'
                : 'Set Password'}
            </GlassButton>
          </form>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--system-background)] flex items-center justify-center">
        <LiquidGlassCard blurIntensity="lg" className="p-8 text-center">
          <p className="text-[var(--label)]">Loading...</p>
        </LiquidGlassCard>
      </div>
    }>
      <ConfirmResetPasswordPageContent />
    </Suspense>
  );
}

