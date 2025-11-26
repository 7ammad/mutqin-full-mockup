"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = searchParams?.get('token');

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
        if (!token) {
            router.push('/auth/forgot-password');
        }
    }, [isAuthenticated, router, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        // Mock password reset - in production, call API with token
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        }, 1000);
    };

    const title = language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password';
    const passwordLabel = language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password';
    const confirmPasswordLabel = language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password';
    const resetButton = language === 'ar' ? 'إعادة التعيين' : 'Reset Password';
    const successMessage = language === 'ar'
        ? 'تم إعادة تعيين كلمة المرور بنجاح'
        : 'Password reset successfully';

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
                <LiquidGlassCard className="w-full max-w-md p-8 text-center" blurIntensity="lg">
                    <CheckCircle className="h-12 w-12 text-[var(--apple-green)] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--label)] mb-2">{title}</h1>
                    <p className="text-[var(--secondary-label)] mb-6">{successMessage}</p>
                    <p className="text-sm text-[var(--tertiary-label)]">
                        {language === 'ar' ? 'جاري إعادة التوجيه...' : 'Redirecting...'}
                    </p>
                </LiquidGlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
            <LiquidGlassCard className="w-full max-w-md p-8" blurIntensity="lg">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-6 text-center">
                    {title}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {passwordLabel}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                            required
                            minLength={6}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {confirmPasswordLabel}
                        </label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                            required
                            minLength={6}
                            className="w-full"
                        />
                    </div>

                    {error && (
                        <div className="text-[var(--apple-red)] text-sm text-center">
                            {error}
                        </div>
                    )}

                    <GlassButton
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (language === 'ar' ? 'جاري إعادة التعيين...' : 'Resetting...') : resetButton}
                    </GlassButton>
                </form>
            </LiquidGlassCard>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}



