"use client";

import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Calendar, CheckCircle, FileText } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

const MOCK_SPONSORSHIP = {
    id: 'sponsorship-1',
    eventName: 'Saudi Cardiology Conference 2025',
    package: 'Gold',
    amount: 50000,
    status: 'Active',
    startDate: '2025-01-01',
    endDate: '2025-03-15',
    contractUrl: '/contracts/sponsorship-1.pdf',
};

export default function SponsorshipDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const sponsorship = MOCK_SPONSORSHIP;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Sponsorship Details
                </h1>
                <p className="text-[var(--secondary-label)]">
                    {sponsorship.eventName}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-[var(--apple-blue)]" />
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--label)]">
                                    {sponsorship.eventName}
                                </h2>
                                <Badge variant="default" className="mt-1">
                                    {sponsorship.package} Package
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--apple-green)]">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">{sponsorship.status}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Sponsorship Amount
                            </p>
                            <p className="text-2xl font-bold text-[var(--label)]">
                                {sponsorship.amount.toLocaleString()} SAR
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--secondary-label)] mb-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Period
                            </p>
                            <p className="text-[var(--label)]">
                                {new Date(sponsorship.startDate).toLocaleDateString()} - {new Date(sponsorship.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        Documents
                    </h3>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            View Contract
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}



