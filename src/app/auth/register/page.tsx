"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Persona } from '@/lib/mockData';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState<Persona | ''>('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

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

        if (!selectedRole) {
            setError(language === 'ar' ? 'يرجى اختيار الدور' : 'Please select a role');
            return;
        }

        setIsLoading(true);
        // Mock registration - in production, call API
        setTimeout(() => {
            setIsLoading(false);
            router.push(`/onboarding/${selectedRole.toLowerCase()}`);
        }, 1000);
    };

    const roles: { id: Persona; labelAr: string; labelEn: string }[] = [
        { id: 'HCP', labelAr: 'الممارس الصحي', labelEn: 'Healthcare Professional' },
        { id: 'ORGANIZER', labelAr: 'المنظم', labelEn: 'Organizer' },
        { id: 'VENDOR', labelAr: 'الداعم', labelEn: 'Vendor' },
        { id: 'REGULATOR', labelAr: 'المعتمد', labelEn: 'Regulator' },
        { id: 'EVENT_MANAGER', labelAr: 'مدير الفعاليات', labelEn: 'Event Manager' },
    ];

    const pageTitle = language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account';
    const nameLabel = language === 'ar' ? 'الاسم' : 'Name';
    const emailLabel = language === 'ar' ? 'البريد الإلكتروني' : 'Email';
    const passwordLabel = language === 'ar' ? 'كلمة المرور' : 'Password';
    const confirmPasswordLabel = language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password';
    const roleLabel = language === 'ar' ? 'الدور' : 'Role';
    const registerButton = language === 'ar' ? 'إنشاء حساب' : 'Register';
    const haveAccount = language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?';
    const loginLink = language === 'ar' ? 'تسجيل الدخول' : 'Login';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
            <LiquidGlassCard className="w-full max-w-md p-8" blurIntensity="lg">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-6 text-center">
                    {pageTitle}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {nameLabel}
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                            required
                            className="w-full"
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {roleLabel}
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as Persona)}
                            className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                            required
                        >
                            <option value="">{language === 'ar' ? 'اختر الدور' : 'Select Role'}</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {language === 'ar' ? role.labelAr : role.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {passwordLabel}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
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
                        className="w-full flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : registerButton}
                    </GlassButton>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--separator)] text-center">
                    <p className="text-sm text-[var(--secondary-label)]">
                        {haveAccount}{' '}
                        <button onClick={() => router.push('/auth/login')}
                            className="text-[var(--apple-blue)] hover:underline"
                        >
                            {loginLink}
                        </button>
                    </p>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
            <RegisterForm />
        </Suspense>
    );
}

















