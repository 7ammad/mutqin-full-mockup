"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewWorkflow from '@/components/regulator/ReviewWorkflow';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { useLanguage } from '@/context/LanguageContext';
import { FileText } from 'lucide-react';
import type { DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicationReviewPage({ params }: PageProps) {
    const { id } = use(params);
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
                const res = await api.getEventById({ eventId: id });
                setEvent(res.event);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load application';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return <LoadingSkeleton variant="card" />;
    }

    if (error || !event) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <EmptyState
                    title={language === 'ar' ? 'طلب غير موجود' : 'Application not found'}
                    titleAr={language === 'ar' ? 'طلب غير موجود' : undefined}
                    description={error || (language === 'ar' ? 'تعذّر العثور على هذا الطلب. قد يكون قد تم حذفه أو نقله.' : 'Unable to find this application. It may have been deleted or moved.')}
                    descriptionAr={language === 'ar' ? 'تعذّر العثور على هذا الطلب. قد يكون قد تم حذفه أو نقله.' : undefined}
                    icon={FileText}
                    actionLabel={language === 'ar' ? 'رجوع إلى قائمة الطلبات' : 'Back to applications'}
                    actionLabelAr={language === 'ar' ? 'رجوع إلى قائمة الطلبات' : undefined}
                    onAction={() => router.push('/dashboard/regulator/applications')}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    {event.titleEn || event.titleAr || 'Event'}
                </p>
            </div>
            <ReviewWorkflow />
        </div>
    );
}

