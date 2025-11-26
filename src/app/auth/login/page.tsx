"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Persona } from '@/lib/mockData';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { MOCK_USERS } from '@/lib/mockData';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const roleParam = searchParams?.get('role');
    const initialRole = roleParam && ['ORGANIZER', 'VENDOR', 'REGULATOR', 'HCP', 'EVENT_MANAGER'].includes(roleParam.toUpperCase())
        ? roleParam.toUpperCase() as Persona
        : '';
    const initialEmail = initialRole ? MOCK_USERS.find(u => u.role === initialRole)?.email || '' : '';

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<Persona | ''>(initialRole);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const redirect = searchParams?.get('redirect');
            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!selectedRole) {
            setError(language === 'ar' ? 'يرجى اختيار الدور' : 'Please select a role');
            setIsLoading(false);
            return;
        }

        try {
            const redirect = searchParams?.get('redirect') || undefined;
            await login(email, password, selectedRole, redirect);
        } catch (err) {
            setError(
                language === 'ar' 
                    ? 'بيانات الاعتماد غير صحيحة' 
                    : 'Invalid credentials'
            );
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (role: Persona) => {
        const mockUser = MOCK_USERS.find(u => u.role === role);
        if (mockUser) {
            setEmail(mockUser.email);
            setPassword(mockUser.password);
            setSelectedRole(role);
        }
    };

    const roles: { id: Persona; labelAr: string; labelEn: string }[] = [
        { id: 'HCP', labelAr: 'ممارس صحي', labelEn: 'Healthcare Professional' },
        { id: 'ORGANIZER', labelAr: 'منظم', labelEn: 'Organizer' },
        { id: 'VENDOR', labelAr: 'مزود', labelEn: 'Vendor' },
        { id: 'REGULATOR', labelAr: 'جهة تنظيمية', labelEn: 'Regulator' },
        { id: 'EVENT_MANAGER', labelAr: 'مدير حدث', labelEn: 'Event Manager' },
    ];

    const pageTitle = language === 'ar' ? 'تسجيل الدخول' : 'Login';
    const emailLabel = language === 'ar' ? 'البريد الإلكتروني' : 'Email';
    const passwordLabel = language === 'ar' ? 'كلمة المرور' : 'Password';
    const roleLabel = language === 'ar' ? 'الدور' : 'Role';
    const loginButton = language === 'ar' ? 'تسجيل الدخول' : 'Login';
    const quickLoginText = language === 'ar' ? 'تسجيل سريع' : 'Quick Login';
    const orText = language === 'ar' ? 'أو' : 'Or';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
            <LiquidGlassCard className="w-full max-w-md p-8" blurIntensity="lg">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-6 text-center">
                    {pageTitle}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            {passwordLabel}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                            required
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
                        {isLoading ? (language === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...') : loginButton}
                    </GlassButton>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--separator)]">
                    <p className="text-sm text-[var(--secondary-label)] text-center mb-4">
                        {quickLoginText}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {roles.map((role) => (
                            <GlassButton
                                key={role.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickLogin(role.id)}
                                className="text-xs"
                            >
                                {language === 'ar' ? role.labelAr : role.labelEn}
                            </GlassButton>
                        ))}
                    </div>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
            <LoginForm />
        </Suspense>
    );
}
