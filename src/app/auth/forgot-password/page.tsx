"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock password reset - in production, call API
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1000);
    };

    const title = language === 'ar' ? 'استعادة كلمة المرور' : 'Forgot Password';
    const description = language === 'ar'
        ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
        : 'Enter your email and we\'ll send you a password reset link';
    const emailLabel = language === 'ar' ? 'البريد الإلكتروني' : 'Email';
    const sendButton = language === 'ar' ? 'إرسال' : 'Send Reset Link';
    const successMessage = language === 'ar'
        ? 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'
        : 'Reset link sent to your email';
    const backToLogin = language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login';

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
                <LiquidGlassCard className="w-full max-w-md p-8 text-center" blurIntensity="lg">
                    <CheckCircle className="h-12 w-12 text-[var(--apple-green)] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--label)] mb-2">{title}</h1>
                    <p className="text-[var(--secondary-label)] mb-6">{successMessage}</p>
                    <GlassButton onClick={() => router.push('/auth/login')} className="w-full flex items-center justify-center">
                        {backToLogin}
                    </GlassButton>
                </LiquidGlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
            <LiquidGlassCard className="w-full max-w-md p-8" blurIntensity="lg">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2 text-center">
                    {title}
                </h1>
                <p className="text-[var(--secondary-label)] text-center mb-6 text-sm">
                    {description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {emailLabel}
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@demo.com"
                            required
                            className="w-full"
                        />
                    </div>

                    <GlassButton
                        type="submit"
                        className="w-full flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : sendButton}
                    </GlassButton>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--separator)] text-center">
                    <button onClick={() => router.push('/auth/login')}
                        className="text-sm text-[var(--apple-blue)] hover:underline"
                    >
                        {backToLogin}
                    </button>
                </div>
            </LiquidGlassCard>
        </div>
    );
}








