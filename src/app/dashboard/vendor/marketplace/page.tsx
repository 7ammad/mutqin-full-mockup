"use client";

import MarketplaceFeed from '@/components/vendor/MarketplaceFeed';
import { useRouter } from 'next/navigation';

export default function VendorMarketplacePage() {
    const router = useRouter();
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    Browse events seeking sponsorship
                </p>
            </div>
            <MarketplaceFeed onSponsorClick={(eventId) => router.push(`/dashboard/vendor/events/${eventId}`)} />
        </div>
    );
}

