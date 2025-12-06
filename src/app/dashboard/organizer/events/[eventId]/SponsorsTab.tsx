"use client";

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { getOrganizerSponsors, getState } from '@/context/demoStore';
import type { DemoEvent } from '@/context/demoSeed';
import { Users, DollarSign, Package } from 'lucide-react';

interface SponsorsTabProps {
    event: DemoEvent;
}

export default function SponsorsTab({ event }: SponsorsTabProps) {
    const { language } = useLanguage();
    const state = getState();

    // Get sponsorship data for this event
    const sponsorsData = useMemo(() => {
        const allSponsors = getOrganizerSponsors("org-1");
        return {
            packages: allSponsors.packages.filter((p) => p.activityId === event.id),
            deals: allSponsors.deals.filter((d) => d.activityId === event.id),
            disclosures: allSponsors.disclosures.filter((dis) => {
                const deal = allSponsors.deals.find((d) => d.id === dis.dealId);
                return deal?.activityId === event.id;
            }),
        };
    }, [event.id]);

    const hasSponsors = sponsorsData.deals.length > 0 || event.is_sponsored;

    if (!event.needs_sponsorship && !hasSponsors) {
        return (
            <EmptyState
                title={language === 'ar' ? 'لا يوجد رعاة' : 'No sponsors'}
                description={
                    language === 'ar'
                        ? 'هذا الحدث لا يحتاج إلى رعاة'
                        : 'This event does not require sponsorship'
                }
                icon={Users}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Sponsorship Status */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === 'ar' ? 'حالة الرعاية' : 'Sponsorship Status'}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                        </span>
                        <Badge
                            className={
                                event.is_sponsored
                                    ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                    : event.needs_sponsorship
                                    ? 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30'
                                    : 'bg-[var(--system-fill)] text-[var(--secondary-label)] border-[var(--border)]'
                            }
                        >
                            {event.is_sponsored
                                ? language === 'ar' ? 'ممول' : 'Sponsored'
                                : event.needs_sponsorship
                                ? language === 'ar' ? 'يحتاج رعاة' : 'Needs Sponsors'
                                : language === 'ar' ? 'لا يحتاج رعاة' : 'No Sponsorship Needed'}
                        </Badge>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Packages */}
            {sponsorsData.packages.length > 0 && (
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {language === 'ar' ? 'باقات الرعاية' : 'Sponsorship Packages'}
                    </h3>
                    <div className="space-y-3">
                        {sponsorsData.packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="p-4 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-[var(--label)]">{pkg.title}</div>
                                    <div className="text-lg font-bold text-[var(--label)] flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {pkg.priceSAR.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                                    </div>
                                </div>
                                <div className="text-xs text-[var(--secondary-label)] mb-2">
                                    {language === 'ar' ? 'المتبقي' : 'Remaining'}: {pkg.spotsRemaining} / {pkg.spotsTotal}
                                </div>
                                {pkg.benefits.length > 0 && (
                                    <div className="text-xs text-[var(--secondary-label)]">
                                        {language === 'ar' ? 'الفوائد' : 'Benefits'}: {pkg.benefits.join(', ')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </LiquidGlassCard>
            )}

            {/* Deals */}
            {sponsorsData.deals.length > 0 && (
                <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        {language === 'ar' ? 'صفقات الرعاية' : 'Sponsorship Deals'}
                    </h3>
                    <div className="space-y-3">
                        {sponsorsData.deals.map((deal) => (
                            <div
                                key={deal.id}
                                className="p-4 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-[var(--label)]">
                                        {language === 'ar' ? 'راعي' : 'Sponsor'}: {deal.sponsorOrgId}
                                    </div>
                                    <Badge
                                        className={
                                            deal.status === 'paid'
                                                ? 'bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30'
                                                : 'bg-[var(--apple-orange)]/10 text-[var(--apple-orange)] border-[var(--apple-orange)]/30'
                                        }
                                    >
                                        {deal.status === 'paid'
                                            ? language === 'ar' ? 'مدفوع' : 'Paid'
                                            : language === 'ar' ? 'محجوز' : 'Reserved'}
                                    </Badge>
                                </div>
                                {deal.paidAt && (
                                    <div className="text-xs text-[var(--secondary-label)]">
                                        {language === 'ar' ? 'تاريخ الدفع' : 'Paid at'}:{' '}
                                        {new Date(deal.paidAt).toLocaleDateString(
                                            language === 'ar' ? 'ar-SA' : 'en-US'
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </LiquidGlassCard>
            )}
        </div>
    );
}

