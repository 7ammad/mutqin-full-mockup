"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { cn } from '@/lib/utils';
import SummaryTab from './SummaryTab';
import ExecutionTab from './ExecutionTab';
import CertificatesTab from './CertificatesTab';
import SponsorsTab from './SponsorsTab';
import type { DemoEvent } from '@/context/demoSeed';
import { FileText, ClipboardList, Award, Users } from 'lucide-react';

type ViewKey = 'summary' | 'execution' | 'certificates' | 'sponsors';

interface EventMasterTabsProps {
    eventId: string;
}

export default function EventMasterTabs({ eventId }: EventMasterTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const rawView = searchParams.get('view') as ViewKey | null;
    const view: ViewKey = rawView && ['summary', 'execution', 'certificates', 'sponsors'].includes(rawView)
        ? rawView
        : 'summary';

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
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleViewChange = (newView: ViewKey) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', newView);
        router.push(`/dashboard/organizer/events/${eventId}?${params.toString()}`);
    };

    const tabs: Array<{ key: ViewKey; label: string; labelAr: string; icon: typeof FileText }> = [
        { key: 'summary', label: 'Summary', labelAr: '', icon: FileText },
        { key: 'execution', label: 'Execution & Compliance', labelAr: ' ', icon: ClipboardList },
        { key: 'certificates', label: 'Certificates', labelAr: '', icon: Award },
        { key: 'sponsors', label: 'Sponsors', labelAr: '', icon: Users },
    ];

    if (loading) {
        return <LoadingSkeleton variant="dashboard" />;
    }

    if (error || !event) {
        return (
            <EmptyState
                title={language === 'ar' ? '  ' : 'Event not found'}
                titleAr={language === 'ar' ? '  ' : undefined}
                description={error || (language === 'ar' ? '     ' : 'Unable to find this event')}
                descriptionAr={language === 'ar' ? '     ' : undefined}
                icon={FileText}
                actionLabel={language === 'ar' ? '  ' : 'Back to activities'}
                actionLabelAr={language === 'ar' ? '  ' : undefined}
                onAction={() => {
                    const params = new URLSearchParams();
                    params.set('tab', 'activities');
                    router.push(`/dashboard/organizer?${params.toString()}`);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <GlassButton
                            key={tab.key}
                            variant={view === tab.key ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange(tab.key)}
                            className={cn(
                                "text-xs px-4 gap-2 flex-shrink-0",
                                view === tab.key && "bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]"
                            )}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            {language === 'ar' ? tab.labelAr : tab.label}
                        </GlassButton>
                    ))}
                </div>
            </LiquidGlassCard>

            {/* Tab Content - Guarded by event existence check above */}
            <div>
                {event && view === 'summary' && <SummaryTab event={event} />}
                {event && view === 'execution' && <ExecutionTab event={event} />}
                {event && view === 'certificates' && <CertificatesTab event={event} />}
                {event && view === 'sponsors' && <SponsorsTab event={event} />}
            </div>
        </div>
    );
}

