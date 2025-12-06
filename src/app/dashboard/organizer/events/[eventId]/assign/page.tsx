"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GlassButton } from '@/components/ui/glass-button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default function AssignEventManagerPage({ params }: PageProps) {
    const { eventId } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getEventById({ eventId });
                setEvent(res.event);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load event';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return <LoadingSkeleton variant="card" />;
    }

    if (error) {
        return (
            <LiquidGlassCard blurIntensity="lg" className="p-12">
                <div className="text-center text-[var(--apple-red)]">
                    {error}
                </div>
            </LiquidGlassCard>
        );
    }

    if (!event) {
        notFound();
    }

    const title = language === 'ar' ? 'تعيين مدير الفعالية' : 'Assign Event Manager';
    const description = language === 'ar' 
        ? 'قم بتعيين مدير فعالية لتنفيذ هذا الحدث.'
        : 'Assign event execution to an Event Manager vendor.';
    const backButton = language === 'ar' ? 'رجوع' : 'Go Back';
    const assignButton = language === 'ar' ? 'تعيين مدير فعالية' : 'Assign Event Manager';

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    {title}
                </h1>
                <p className="text-[var(--secondary-label)]">
                    {description}
                </p>
            </div>

            <LiquidGlassCard className="p-6 mb-6" blurIntensity="lg">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                            {language === 'ar' ? 'تفاصيل الحدث' : 'Event Details'}
                        </h2>
                        <p className="text-[var(--secondary-label)]">
                            {event.titleEn || event.titleAr || 'Event'}
                        </p>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--border)]">
                        <p className="text-sm text-[var(--secondary-label)] mb-4">
                            {language === 'ar' 
                                ? 'هذه الصفحة قيد التطوير. سيتم إضافة واجهة تعيين مدير الفعالية قريباً.'
                                : 'This page is under development. Event Manager assignment interface will be added soon.'}
                        </p>
                    </div>
                </div>
            </LiquidGlassCard>

            <div className="flex gap-4">
                <GlassButton
                    variant="outline"
                    onClick={() => router.push(buildRoute.organizerEvent(eventId))}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backButton}
                </GlassButton>
                <GlassButton
                    className="gap-2 flex items-center justify-center"
                    disabled
                >
                    <UserPlus className="h-4 w-4" />
                    {assignButton}
                </GlassButton>
            </div>
        </div>
    );
}

