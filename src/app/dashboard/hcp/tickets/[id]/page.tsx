"use client";

import { use, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { QRCode } from '@/components/shared/QRCode';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Download, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/eventTranslations';
import { api } from '@/lib/api';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import type { DemoTicket, DemoEvent } from '@/context/demoSeed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [ticket, setTicket] = useState<DemoTicket | null>(null);
    const [event, setEvent] = useState<DemoEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getTicketById({ ticketId: id });
                setTicket(res.ticket);
                if (res.event) {
                    setEvent(res.event);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load ticket';
                setError(message);
                if (message.includes('not found') || message.includes('NOT_FOUND')) {
                    notFound();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
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

    if (!ticket || !event) {
        notFound();
    }

    const ticketNumber = ticket.id;
    const ticketData = {
        eventId: ticket.eventId,
        ticketNumber,
        registeredAt: new Date().toISOString(),
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                        {event.titleEn || event.titleAr || 'Event'}
                    </h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date || new Date().toISOString(), 'en')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <MapPin className="h-4 w-4" />
                            <span>{event.locationEn || event.locationAr || 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--secondary-label)]">
                            <Clock className="h-4 w-4" />
                            <span>{event.cme_hours || 0} CME Hours</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--separator)]">
                        <p className="text-sm text-[var(--tertiary-label)] mb-2">
                            Registered on: {new Date(ticketData.registeredAt).toLocaleDateString()}
                        </p>
                        <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Ticket PDF
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-[var(--label)] mb-2">
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

