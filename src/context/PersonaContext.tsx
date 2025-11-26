"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Event, Persona, INITIAL_EVENTS, PERSONA_DETAILS, UserSession } from '@/lib/mockData';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

interface UserSessionDisplay {
    name: string;
    role_label: string;
}

interface PersonaContextType {
    currentPersona: Persona;
    userSession: UserSessionDisplay;
    events: Event[];
    switchPersona: (persona: Persona) => void;
    addEvent: (event: Event) => void;
    sponsorEvent: (eventId: string, license: string) => void;
    approveEvent: (eventId: string) => void;
    registerForEvent: (eventId: string) => void;
    myTickets: string[]; // List of Event IDs
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
    const { role } = useAuth();
    const [currentPersona, setCurrentPersona] = useState<Persona>(role || 'ORGANIZER');
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [myTickets, setMyTickets] = useState<string[]>([]);
    const { language } = useLanguage();

    // Sync currentPersona with auth role - only update if different to avoid unnecessary rerenders
    useEffect(() => {
        if (role && role !== currentPersona) {
            setCurrentPersona(role);
        }
    }, [role, currentPersona]); // eslint-disable-line react-hooks/exhaustive-deps

    const userSession = useMemo(() => {
        const session: UserSession = PERSONA_DETAILS[currentPersona];
        return {
            name: language === 'ar' ? session.nameAr : session.nameEn,
            role_label: language === 'ar' ? session.role_labelAr : session.role_labelEn,
        };
    }, [currentPersona, language]);

    const switchPersona = () => {
        // Disabled - users must login/logout to switch personas
        // setCurrentPersona(persona);
    };

    const addEvent = (newEvent: Event) => {
        setEvents((prev) => [newEvent, ...prev]);
    };

    const sponsorEvent = (eventId: string, license: string) => {
        setEvents((prev) =>
            prev.map((ev) =>
                ev.id === eventId
                    ? {
                        ...ev,
                        is_sponsored: true,
                        needs_sponsorship: false,
                        sfda_license: license,
                        status: 'Pending Approval' // Move to Regulator Queue
                    }
                    : ev
            )
        );
    };

    const approveEvent = (eventId: string) => {
        setEvents((prev) =>
            prev.map((ev) =>
                ev.id === eventId
                    ? { ...ev, status: 'Published' } // Publish to HCP
                    : ev
            )
        );
    };

    const registerForEvent = (eventId: string) => {
        if (!myTickets.includes(eventId)) {
            setMyTickets((prev) => [...prev, eventId]);
        }
    };

    return (
        <PersonaContext.Provider
            value={{
                currentPersona,
                userSession,
                events,
                switchPersona,
                addEvent,
                sponsorEvent,
                approveEvent,
                registerForEvent,
                myTickets,
            }}
        >
            {children}
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const context = useContext(PersonaContext);
    if (context === undefined) {
        throw new Error('usePersona must be used within a PersonaProvider');
    }
    return context;
}
