"use client";

import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/shared/PDFViewer';
import { Download, CheckCircle, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Mock certificate data
const MOCK_CERTIFICATES: Record<string, {
    id: string;
    eventName: string;
    cmeHours: number;
    issuedDate: string;
    certificateUrl: string;
    verified: boolean;
}> = {
    'cert-1': {
        id: 'cert-1',
        eventName: 'Saudi Cardiology Conference 2025',
        cmeHours: 12,
        issuedDate: '2025-01-15',
        certificateUrl: '/certificates/sample.pdf',
        verified: true,
    },
};

export default function CertificateDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const certificate = MOCK_CERTIFICATES[id];

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
                            {certificate.eventName}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {certificate.verified && (
                            <div className="flex items-center gap-2 text-[var(--apple-green)]">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Verified</span>
                            </div>
                        )}
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-[var(--label)] mb-4">
                        Certificate Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                Event
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {certificate.eventName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1">
                                CME Hours
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {certificate.cmeHours} hours
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Issued Date
                            </p>
                            <p className="font-medium text-[var(--label)]">
                                {new Date(certificate.issuedDate).toLocaleDateString()}
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
                    <h2 className="text-lg font-semibold text-[var(--label)] mb-4">
                        Certificate Preview
                    </h2>
                    <div className="border border-[var(--separator)] rounded-lg overflow-hidden">
                        <PDFViewer url={certificate.certificateUrl} />
                    </div>
                </Card>
            </div>
        </div>
    );
}



