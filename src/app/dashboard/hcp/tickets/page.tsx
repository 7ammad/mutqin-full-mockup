"use client";

import MyTickets from '@/components/hcp/MyTickets';

export default function HCPTicketsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    View and manage your event registrations
                </p>
            </div>
            <MyTickets />
        </div>
    );
}

