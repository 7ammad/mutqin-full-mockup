"use client";

import { useState } from "react";
import Dashboard from "./Dashboard";
import CreateEventWizard from "./CreateEventWizard";
import EnhancedEventWizard from "./EnhancedEventWizard";
import EventDashboard from "./EventDashboard";
import CertificateGenerator from "./CertificateGenerator";
import EventAssignment from "./EventAssignment";
import { usePersona } from "@/context/PersonaContext";
import { Event } from "@/lib/mockData";

export default function OrganizerView() {
    const { addEvent } = usePersona();
    const [view, setView] = useState<'DASHBOARD' | 'CREATE' | 'ENHANCED_CREATE' | 'EVENT_DASHBOARD' | 'CERTIFICATES' | 'ASSIGNMENT'>('DASHBOARD');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const handleEventCreated = (event: Event) => {
        addEvent(event);
        setView('DASHBOARD');
    };

    const handleAssign = (eventId: string, eventManagerId: string) => {
        console.log('Assigning event', eventId, 'to manager', eventManagerId);
        setView('DASHBOARD');
    };

    return (
        <>
            {view === 'DASHBOARD' && (
                <Dashboard 
                    onCreateClick={() => setView('ENHANCED_CREATE')}
                    onEventClick={(eventId) => {
                        setSelectedEventId(eventId);
                        setView('EVENT_DASHBOARD');
                    }}
                />
            )}
            {view === 'CREATE' && (
                <CreateEventWizard onCancel={() => setView('DASHBOARD')} />
            )}
            {view === 'ENHANCED_CREATE' && (
                <EnhancedEventWizard 
                    onCancel={() => setView('DASHBOARD')}
                    onComplete={handleEventCreated}
                />
            )}
            {view === 'EVENT_DASHBOARD' && selectedEventId && (
                <EventDashboard eventId={selectedEventId} />
            )}
            {view === 'CERTIFICATES' && (
                <CertificateGenerator />
            )}
            {view === 'ASSIGNMENT' && selectedEventId && (
                <EventAssignment 
                    eventId={selectedEventId}
                    onAssign={handleAssign}
                />
            )}
        </>
    );
}
