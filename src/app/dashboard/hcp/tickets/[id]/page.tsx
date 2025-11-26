"use client";

import { use } from 'react';
import { usePersona } from '@/context/PersonaContext';
import { INITIAL_EVENTS } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { QRCode } from '@/components/shared/QRCode';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Download, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/eventTranslations';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { myTickets } = usePersona();
    const event = INITIAL_EVENTS.find(e => e.id === id);

    if (!event || !myTickets.includes(id)) {
        notFound();
    }

    // Generate ticket number deterministically based on event ID
    const ticketNumber = `TKT-${id.toUpperCase()}-${id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)}`;

    const ticketData = {
        eventId: id,
        ticketNumber,
        registeredAt: new Date().toISOString(),
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    Event Ticket
                </h1>
                <p className="text-[var(--secondary-label)]">
                    Your registration confirmation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="default" className="bg-[var(--apple-green)]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Registered
                        </Badge>
                        <span className="text-sm text-[var(--secondary-label)]">
                            {ticketData.ticketNumber}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[var(--label)] mb-4">
                        {event.titleEn}
                    </h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date, 'en')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <MapPin className="h-4 w-4" />
                            <span>{event.locationEn}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <Clock className="h-4 w-4" />
                            <span>{event.cme_hours} CME Hours</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--separator)]">
                        <p className="text-sm text-[var(--tertiary-label)] mb-2">
                            Registered on: {new Date(ticketData.registeredAt).toLocaleDateString()}
                        </p>
                        <Button className="w-full" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Ticket PDF
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-4">
                        Check-in QR Code
                    </h3>
                    <QRCode text={ticketData.ticketNumber} size={200} />
                    <p className="text-sm text-[var(--secondary-label)] mt-4 text-center">
                        Present this QR code at the event for check-in
                    </p>
                </Card>
            </div>
        </div>
    );
}

