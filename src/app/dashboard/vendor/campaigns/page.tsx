"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const MOCK_CAMPAIGNS = [
    {
        id: 'campaign-1',
        name: 'Q1 2025 Cardiology Campaign',
        status: 'Active',
        events: 3,
        budget: 150000,
        spent: 95000,
        startDate: '2025-01-01',
        endDate: '2025-03-31',
    },
    {
        id: 'campaign-2',
        name: 'Pediatrics Education Initiative',
        status: 'Planning',
        events: 0,
        budget: 80000,
        spent: 0,
        startDate: '2025-04-01',
        endDate: '2025-06-30',
    },
];

export default function VendorCampaignsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    
                    <p className="text-[var(--secondary-label)]">
                        Manage your sponsorship campaigns
                    </p>
                </div>
                <Button className="flex items-center justify-center gap-2">Create Campaign</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_CAMPAIGNS.map((campaign) => (
                    <Card key={campaign.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--label)] mb-1">
                                    {campaign.name}
                                </h3>
                                <Badge variant={campaign.status === 'Active' ? 'default' : 'outline'}>
                                    {campaign.status}
                                </Badge>
                            </div>
                            <TrendingUp className="h-5 w-5 text-[var(--apple-blue)]" />
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--secondary-label)]">Events</span>
                                <span className="font-semibold text-[var(--label)]">{campaign.events}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--secondary-label)] flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    Budget
                                </span>
                                <span className="font-semibold text-[var(--label)]">
                                    {campaign.budget.toLocaleString()} SAR
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--secondary-label)]">Spent</span>
                                <span className="font-semibold text-[var(--label)]">
                                    {campaign.spent.toLocaleString()} SAR
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--secondary-label)] flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Period
                                </span>
                                <span className="text-[var(--label)] text-xs">
                                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--separator)] flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 items-center justify-center gap-2">
                                View Details
                            </Button>
                            <Button size="sm" className="flex-1 items-center justify-center gap-2">
                                Manage
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

















