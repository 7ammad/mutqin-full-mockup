"use client";

import { use, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Calendar, CheckCircle, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoSponsorship, DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function SponsorshipDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [sponsorship, setSponsorship] = useState<DemoSponsorship | null>(null);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSponsorship = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getSponsorshipById({ sponsorshipId: id });
                setSponsorship(res.sponsorship);
                if (res.event) {
                    setEvent(res.event);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load sponsorship';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSponsorship();
    }, [id]);

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

    if (!sponsorship) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    {event?.titleEn || event?.titleAr || 'Event'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-[var(--apple-blue)]" />
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--label)]">
                                    {event?.titleEn || event?.titleAr || 'Event'}
                                </h2>
                                <Badge variant="default" className="mt-1">
                                    {sponsorship.package || 'Standard'} Package
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--apple-green)]">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">{sponsorship.status === 'purchased' ? 'Active' : 'Pending'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Sponsorship Amount
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">
                                50,000 SAR
                            </p>
                        </div>
                        {event?.date && (
                            <div>
                                <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Event Date
                                </p>
                                <p className="text-[var(--label)]">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                        Documents
                    </h3>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start flex items-center justify-center gap-2">
                            <FileText className="h-4 w-4 mr-2" />
                            View Contract
                        </Button>
                        <Button variant="outline" className="w-full justify-start flex items-center justify-center gap-2">
                            <FileText className="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}






