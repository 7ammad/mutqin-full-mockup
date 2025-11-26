"use client";

import { use } from 'react';
import { EventDetails } from '@/components/hcp/EventDetails';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Building2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function VendorEventSponsorshipPage({ params }: PageProps) {
    const { id } = use(params);
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Event Sponsorship
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Review event details and sponsorship opportunities
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EventDetails event={event} />
                </div>

                <Card className="p-6 lg:col-span-1">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-[var(--label)] mb-4">
                            Sponsorship Packages
                        </h2>
                        <div className="space-y-3">
                            <div className="p-4 border border-[var(--separator)] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-[var(--label)]">Gold</span>
                                    <span className="text-sm text-[var(--secondary-label)] flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        50,000 SAR
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    Premium visibility and branding
                                </p>
                            </div>
                            <div className="p-4 border border-[var(--separator)] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-[var(--label)]">Silver</span>
                                    <span className="text-sm text-[var(--secondary-label)] flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        30,000 SAR
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--secondary-label)]">
                                    Standard sponsorship package
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" size="lg">
                        <Building2 className="h-4 w-4 mr-2" />
                        Sponsor This Event
                    </Button>
                </Card>
            </div>
        </div>
    );
}



