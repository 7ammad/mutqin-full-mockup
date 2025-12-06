"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { getState } from '@/context/demoStore';
import type { DemoEvent } from '@/context/demoSeed';
import { Award, Users } from 'lucide-react';

interface CertificatesTabProps {
    event: DemoEvent;
}

export default function CertificatesTab({ event }: CertificatesTabProps) {
    const router = useRouter();
    const { language } = useLanguage();
    const state = getState();

    // Get certificates for this event
    const certificates = useMemo(() => {
        return state.certificates.filter((c) => c.eventId === event.id);
    }, [event.id, state.certificates]);

    // Get unique HCPs with certificates
    const hcpIds = useMemo(() => {
        return new Set(certificates.map((c) => c.hcpId));
    }, [certificates]);

    if (certificates.length === 0) {
        return (
            <EmptyState
                title={language === 'ar' ? '  ' : 'No certificates'}
                description={
                    language === 'ar'
                        ? '       '
                        : 'No certificates have been issued for this event yet'
                }
                icon={Award}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {language === 'ar' ? ' ' : 'Certificates Summary'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? ' ' : 'Total Certificates'}
                        </div>
                        <div className="text-2xl font-bold text-[var(--label)]">
                            {certificates.length}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-[var(--secondary-label)]">
                            {language === 'ar' ? '  ' : 'HCPs with Certificates'}
                        </div>
                        <div className="text-2xl font-bold text-[var(--label)]">
                            {hcpIds.size}
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Certificates List */}
            <LiquidGlassCard blurIntensity="md" interactive={false} className="p-6">
                <h3 className="text-lg font-semibold text-[var(--label)] mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === 'ar' ? ' ' : 'Issued Certificates'}
                </h3>
                <div className="space-y-3">
                    {certificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-[var(--separator)] bg-[var(--system-fill)]/30"
                        >
                            <div className="flex-1">
                                <div className="text-sm font-medium text-[var(--label)]">
                                    {language === 'ar' ? ' ' : 'Certificate'} {cert.id.slice(-8)}
                                </div>
                                <div className="text-xs text-[var(--secondary-label)] mt-1">
                                    {language === 'ar' ? ' ' : 'Issued to'} HCP: {cert.hcpId}
                                </div>
                                {cert.issuedAt && (
                                    <div className="text-xs text-[var(--secondary-label)] mt-1">
                                        {language === 'ar' ? ' ' : 'Issued'}:{' '}
                                        {new Date(cert.issuedAt).toLocaleDateString(
                                            language === 'ar' ? 'ar-SA' : 'en-US'
                                        )}
                                    </div>
                                )}
                            </div>
                            <Badge className="bg-[var(--apple-green)]/10 text-[var(--apple-green)] border-[var(--apple-green)]/30">
                                {language === 'ar' ? '' : 'Issued'}
                            </Badge>
                        </div>
                    ))}
                </div>
            </LiquidGlassCard>
        </div>
    );
}

