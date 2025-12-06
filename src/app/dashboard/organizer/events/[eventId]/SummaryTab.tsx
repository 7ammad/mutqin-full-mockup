"use client";

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { convertDemoEventToEvent } from '@/lib/eventConverter';
import type { DemoEvent } from '@/context/demoSeed';
import { ClipboardList, Award, Users, ArrowRight } from 'lucide-react';

interface SummaryTabProps {
    event: DemoEvent;
}

export default function SummaryTab({ event }: SummaryTabProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const eventData = convertDemoEventToEvent(event);

    const handleNavigateToView = (view: 'execution' | 'certificates' | 'sponsors') => {
        if (!event?.id) return;
        router.push(`/dashboard/organizer/events/${event.id}?view=${view}`);
    };

    return (
        <div className="space-y-6">
            {/* Event Identity Card */}
            <ActivityCard
                event={eventData}
                context="organizer"
                variant="full"
                showDescription={true}
            />

            {/* Quick Actions */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassButton
                        variant="outline"
                        onClick={() => handleNavigateToView('execution')}
                        className="justify-start gap-3 h-auto p-4"
                    >
                        <ClipboardList className="h-5 w-5 text-[var(--apple-blue)]" />
                        <div className="flex-1 text-left">
                            <div className="font-medium text-[var(--label)]">
                                {language === 'ar' ? 'التنفيذ والامتثال' : 'Execution & Compliance'}
                            </div>
                            <div className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? 'عرض حالة التنفيذ' : 'View execution status'}
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--secondary-label)]" />
                    </GlassButton>

                    <GlassButton
                        variant="outline"
                        onClick={() => handleNavigateToView('certificates')}
                        className="justify-start gap-3 h-auto p-4"
                    >
                        <Award className="h-5 w-5 text-[var(--apple-green)]" />
                        <div className="flex-1 text-left">
                            <div className="font-medium text-[var(--label)]">
                                {language === 'ar' ? 'الشهادات' : 'Certificates'}
                            </div>
                            <div className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? 'عرض الشهادات الصادرة' : 'View issued certificates'}
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--secondary-label)]" />
                    </GlassButton>

                    <GlassButton
                        variant="outline"
                        onClick={() => handleNavigateToView('sponsors')}
                        className="justify-start gap-3 h-auto p-4"
                    >
                        <Users className="h-5 w-5 text-[var(--apple-orange)]" />
                        <div className="flex-1 text-left">
                            <div className="font-medium text-[var(--label)]">
                                {language === 'ar' ? 'الرعاة' : 'Sponsors'}
                            </div>
                            <div className="text-xs text-[var(--secondary-label)] mt-1">
                                {language === 'ar' ? 'عرض معلومات الرعاة' : 'View sponsor information'}
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--secondary-label)]" />
                    </GlassButton>
                </div>
            </LiquidGlassCard>

            {/* Accreditation Status */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                    {language === 'ar' ? 'حالة الاعتماد' : 'Accreditation Status'}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                        </span>
                        <Badge
                            className={
                                event?.status === 'approved' || event?.status === 'published'
                                    ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                    : event?.status === 'pending_review'
                                    ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30'
                                    : 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]'
                            }
                        >
                            {event?.status === 'approved' || event?.status === 'published'
                                ? language === 'ar' ? 'معتمد' : 'Approved'
                                : event?.status === 'pending_review'
                                ? language === 'ar' ? 'قيد المراجعة' : 'Pending Review'
                                : language === 'ar' ? 'مسودة' : 'Draft'}
                        </Badge>
                    </div>
                    {event.sfda_license && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--secondary-label)]">
                                {language === 'ar' ? 'ترخيص الهيئة' : 'SFDA License'}
                            </span>
                            <span className="text-sm font-medium text-[var(--label)]">
                                {event.sfda_license}
                            </span>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

