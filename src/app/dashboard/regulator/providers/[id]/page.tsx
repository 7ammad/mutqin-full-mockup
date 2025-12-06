"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GlassButton } from '@/components/ui/glass-button';
import { ArrowLeft, Building2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { buildRoute } from '@/lib/routes';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProviderDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();

    const title = language === 'ar' ? ' ' : 'Provider Detail';
    const description = language === 'ar' 
        ? '             .'
        : 'Provider detail showing provider information, all applications history, compliance status, risk score, and audit history.';
    const backButton = language === 'ar' ? '' : 'Go Back';

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    {description}
                </p>
            </div>

            <LiquidGlassCard className="p-6 mb-6" blurIntensity="lg">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--label)] mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {language === 'ar' ? ' ' : 'Provider Information'}
                        </h2>
                        <p className="text-[var(--secondary-label)]">
                            {language === 'ar' 
                                ? ` : ${id}`
                                : `Provider ID: ${id}`}
                        </p>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--border)]">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                            {language === 'ar' ? ' ' : 'Compliance Status'}
                        </h3>
                        <div className="space-y-2 text-sm text-[var(--secondary-label)]">
                            <p>
                                {language === 'ar' 
                                    ? '   .          .'
                                    : 'This page is under development. Complete provider information, applications history, compliance status, risk score, and audit history will be added soon.'}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                        <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                            {language === 'ar' ? ' ' : 'Applications History'}
                        </h3>
                        <div className="space-y-2 text-sm text-[var(--secondary-label)]">
                            <p>
                                {language === 'ar' 
                                    ? '      .'
                                    : 'All provider applications history will be displayed here.'}
                            </p>
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>

            <div className="flex gap-4">
                <GlassButton
                    variant="outline"
                    onClick={() => router.push(buildRoute.regulatorTab('review_queue'))}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backButton}
                </GlassButton>
            </div>
        </div>
    );
}
