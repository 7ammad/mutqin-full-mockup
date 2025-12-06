"use client";

import { use, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/shared/PDFViewer';
import { Download, CheckCircle, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoCertificate, DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CertificateDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [certificate, setCertificate] = useState<DemoCertificate | null>(null);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getCertificateById({ certificateId: id });
                setCertificate(res.certificate);
                if (res.event) {
                    setEvent(res.event);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load certificate';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
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

    if (!certificate) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                            Certificate Details
                        </h1>
                        <p className="text-[var(--secondary-label)]">
                            {event?.titleEn || event?.titleAr || 'Event'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {certificate.verified !== false && (
                            <div className="flex items-center gap-2 text-[var(--apple-green)]">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Verified</span>
                            </div>
                        )}
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                        Certificate Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                Event
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {event?.titleEn || event?.titleAr || 'Event'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                CME Hours
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {certificate.cme_hours ?? event?.cme_hours ?? 0} hours
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Issued Date
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : (event?.date ? new Date(event.date).toLocaleDateString() : 'N/A')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                Certificate ID
                            </p>
                            <p className="font-mono text-sm text-[var(--label)]">
                                {certificate.id}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-2">
                    <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                        Certificate Preview
                    </h2>
                    <div className="border border-[var(--separator)] rounded-lg overflow-hidden">
                        <PDFViewer url={certificate.url || `/certificates/${certificate.id}.pdf`} />
                    </div>
                </Card>
            </div>
        </div>
    );
}






