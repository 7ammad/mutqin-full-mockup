"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const notificationTypes = [
    {
        id: 'email',
        label: 'Email Notifications',
        description: 'Receive notifications via email',
        icon: Mail,
        enabled: true,
    },
    {
        id: 'event',
        label: 'Event Updates',
        description: 'Get notified about event changes and updates',
        icon: Bell,
        enabled: true,
    },
    {
        id: 'registration',
        label: 'Registration Alerts',
        description: 'Notifications for new registrations',
        icon: MessageSquare,
        enabled: false,
    },
];

export default function NotificationSettingsPage() {
    const [settings, setSettings] = useState(
        notificationTypes.reduce((acc, type) => {
            acc[type.id] = type.enabled;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const handleToggle = (id: string) => {
        setSettings((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Notification Settings
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Configure how you receive notifications
                </p>
            </div>

            <Card className="p-6">
                <div className="space-y-6">
                    {notificationTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={type.id}
                                className="flex items-start justify-between p-4 border border-[var(--separator)] rounded-lg"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 rounded-lg bg-[var(--apple-blue)]/10">
                                        <Icon className="h-5 w-5 text-[var(--apple-blue)]" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor={type.id} className="text-base font-semibold text-[var(--label)] cursor-pointer">
                                            {type.label}
                                        </Label>
                                        <p className="text-sm text-[var(--secondary-label)] mt-1">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                                <Checkbox
                                    id={type.id}
                                    checked={settings[type.id]}
                                    onCheckedChange={() => handleToggle(type.id)}
                                    className="mt-1"
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--separator)]">
                    <Button className="flex items-center justify-center gap-2">Save Preferences</Button>
                </div>
            </Card>
        </div>
    );
}

















