"use client";

import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-context";
import { useState } from "react";
import EventCard from "@/components/EventCard";
import { QRCode } from "@/components/shared/QRCode";
import { CheckCircle2 } from "lucide-react";

export default function MyTickets() {
    const { events, myTickets } = usePersona();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [checkedInEvents, setCheckedInEvents] = useState<string[]>([]);

    const myEvents = events.filter(e => myTickets.includes(e.id));

    const handleCheckIn = (eventId: string, cme: number) => {
        setCheckedInEvents(prev => [...prev, eventId]);
        showToast(`${t('hcp.checkInSuccess')} ${cme} ${t('hcp.hoursInMumaris')}`, "success");
    };

    if (myEvents.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-[var(--separator)] rounded-ios">
                <p className="text-[var(--secondary-label)]">{t('hcp.noEvents')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--label)]">{t('hcp.myTickets')}</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {myEvents.map((event) => {
                    const isCheckedIn = checkedInEvents.includes(event.id);
                    return (
                        <div key={event.id} className="relative">
                            <EventCard
                                event={event}
                                variant="ticket"
                                showDescription={false}
                                actionButton={{
                                    label: isCheckedIn ? t('hcp.checkedIn') : t('hcp.checkIn'),
                                    onClick: () => handleCheckIn(event.id, event.cme_hours),
                                    variant: isCheckedIn ? 'disabled' : 'emerald',
                                    icon: isCheckedIn ? <CheckCircle2 className="h-4 w-4" /> : undefined,
                                }}
                            />
                            {/* QR Code */}
                            <div className="mt-3 flex justify-center">
                                <QRCode
                                    text={`EVENT-${event.id}-${event.date}`}
                                    size={120}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
