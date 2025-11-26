"use client";

import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { Building2, DollarSign, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EventSponsorsPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    const sponsors = event.is_sponsored ? [
        {
            id: 'sponsor-1',
            name: 'PharmaCorp',
            package: 'Gold',
            amount: 50000,
            status: 'Active',
        },
    ] : [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Event Sponsors
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Manage sponsorships for {event.titleEn}
                </p>
            </div>

            {event.needs_sponsorship && !event.is_sponsored && (
                <Card className="p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                                This event needs sponsorship
                            </h3>
                            <p className="text-[var(--secondary-label)]">
                                Publish to marketplace to attract sponsors
                            </p>
                        </div>
                        <Button>Publish to Marketplace</Button>
                    </div>
                </Card>
            )}

            {sponsors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sponsors.map((sponsor) => (
                        <Card key={sponsor.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-8 w-8 text-[var(--apple-blue)]" />
                                    <div>
                                        <h3 className="font-semibold text-[var(--label)]">
                                            {sponsor.name}
                                        </h3>
                                        <Badge variant="default" className="mt-1">
                                            {sponsor.package} Package
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[var(--apple-green)]">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">{sponsor.status}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--secondary-label)] mb-4">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold text-[var(--label)]">
                                    {sponsor.amount.toLocaleString()} SAR
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm">
                                    Contact
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <Building2 className="h-12 w-12 text-[var(--tertiary-label)] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
                        No sponsors yet
                    </h3>
                    <p className="text-[var(--secondary-label)] mb-4">
                        This event doesn&apos;t have any active sponsorships
                    </p>
                    {event.needs_sponsorship && (
                        <Button>Publish to Marketplace</Button>
                    )}
                </Card>
            )}
        </div>
    );
}

