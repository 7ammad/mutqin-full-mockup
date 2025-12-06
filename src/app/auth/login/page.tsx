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

// Note: dynamic rendering is handled by the layout.tsx file
// Client components cannot export dynamic/revalidate config

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();
    const { t } = useLanguage();
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
            setError(t('auth.login.errors.selectRole'));
            setIsLoading(false);
            return;
        }

        try {
            const redirect = searchParams?.get('redirect') || undefined;
            await login(email, password, selectedRole, redirect);
            // Login successful - navigation will happen in AuthContext
            // Don't reset loading here as the redirect will unmount the component
        } catch (err) {
            console.error('[Login] Error:', err);
            setError(t('auth.login.errors.invalidCredentials'));
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

    const roles: Persona[] = ['HCP', 'ORGANIZER', 'VENDOR', 'REGULATOR', 'EVENT_MANAGER'];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--system-background)] px-4">
            <LiquidGlassCard className="w-full max-w-md p-8" blurIntensity="lg">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-6 text-center">
                    {t('auth.login.title')}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {t('auth.login.role')}
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as Persona)}
                            className="w-full px-4 py-2 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-[var(--label)] focus:outline-none focus:ring-2 focus:ring-[var(--apple-blue)]"
                            required
                        >
                            <option value="">{t('auth.login.selectRole')}</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {t(`auth.login.roles.${role}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--label)] mb-2">
                            {t('auth.login.email')}
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
                            {t('auth.login.password')}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.login.password')}
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
                        className="w-full flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? t('auth.login.loggingIn') : t('auth.login.submit')}
                    </GlassButton>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--separator)]">
                    <p className="text-sm text-[var(--secondary-label)] text-center mb-4">
                        {t('auth.login.quickLogin')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {roles.map((role) => (
                            <GlassButton
                                key={role}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickLogin(role)}
                                className="text-xs"
                            >
                                {t(`auth.login.roles.${role}`)}
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
