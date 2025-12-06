"use client";

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, User } from 'lucide-react';

const settingsSections = [
    {
        id: 'profile',
        title: 'Profile',
        description: 'Manage your personal information',
        icon: User,
        href: '/dashboard/profile',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: 'Configure notification preferences',
        icon: Bell,
        href: '/dashboard/settings/notifications',
    },
    {
        id: 'security',
        title: 'Security',
        description: 'Password and security settings',
        icon: Shield,
        href: '/dashboard/settings/security',
    },
];

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Settings
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card
                            key={section.id}
                            className="p-6 cursor-pointer hover:bg-[var(--secondary-system-background)] transition-colors"
                            onClick={() => router.push(section.href)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-[var(--apple-blue)]/10">
                                    <Icon className="h-6 w-6 text-[var(--apple-blue)]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                        {section.title}
                                    </h3>
                                    <p className="text-sm text-[var(--secondary-label)] mb-4">
                                        {section.description}
                                    </p>
                                    <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

